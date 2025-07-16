import { ChatOpenAI } from '@langchain/openai';
import { BufferMemory } from 'langchain/memory';
import { insightPrompt, sqlAnswerPrompt, sqlPrompt } from './promptTemplate';
import { RunnableLambda, RunnableSequence } from '@langchain/core/runnables';
import { AIMessage } from '@langchain/core/messages';
import { sqlSchemas } from './sqlSchemas';
import { withErrorHandling } from '@/lib/utils/errorHandling';
import { formatToMarkdownTable } from '@/lib/utils/formatToMarkdown';

const SUPABASE_FUNCTION_URL =
  'https://hvpvmczjpfwysvzbwhhn.supabase.co/functions/v1/quick-endpoint';

const model = new ChatOpenAI({
  temperature: 0,
  modelName: 'openai/gpt-4o-mini',
  configuration: {
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'SAMI Dashboard',
    },
  },
});

export const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: 'history',
  inputKey: 'question',
  outputKey: 'output',
});

const contextAugmenter = withErrorHandling(
  async (input: { question: string }) => {
    const history = await memory.loadMemoryVariables({});
    console.log('Loaded history:', history.history);

    return {
      ...input,
      history: history.history,
    };
  }
);

const classifyIntent = async (question: string) => {
  const isSQL =
    /(jumlah|berapa|tampilkan|data|daftar|persentase|rata-rata|berapa banyak|database)/i.test(
      question
    );
  return isSQL ? 'sql' : 'insight';
};

const sqlChain = RunnableSequence.from([
  withErrorHandling<
    { question: string; history: unknown },
    { question: string; history: unknown; schema: string; limit: number }
  >(
    async (input) => {
      const allSchemas = Object.entries(sqlSchemas)
        .map(([tableName, schema]) => {
          const cols = schema.columns.map((col) =>
            'enum' in col && Array.isArray(col.enum)
              ? `${col.name} (${col.type}) — one of [${col.enum.join(', ')}]`
              : `${col.name} (${col.type})`
          );
          return `Table: ${tableName}\n${cols.join('\n')}`;
        })
        .join('\n\n');

      return {
        ...input,
        schema: allSchemas,
        limit: 50,
      };
    },
    { schema: '', limit: 0 }
  ),
  sqlPrompt,
  model,
  withErrorHandling<
    { content: string; schema: string; history: unknown },
    { sqlQuery: string | null; schema: string; history: unknown }
  >(
    async (input) => {
      const match = input.content.match(/```sql\s*([\s\S]+?)\s*```/);
      if (!match) {
        console.warn('SQL query tidak ditemukan dalam respons model.');
        return { sqlQuery: null, schema: input.schema, history: input.history };
      }

      const sqlQuery = match[1].trim();
      console.log('Query : ', sqlQuery);

      return { sqlQuery, schema: input.schema, history: input.history };
    },
    { sqlQuery: null, schema: '', history: null }
  ),
  withErrorHandling<
    { sqlQuery: string | null; schema: string; history: unknown },
    { sql_result: unknown; schema: string; history: unknown }
  >(
    async (input) => {
      if (!input.sqlQuery) {
        console.warn('SQL query kosong. Melewatkan eksekusi SQL.');
        return {
          sql_result: { error: 'Query tidak valid atau tidak ditemukan.' },
          schema: input.schema,
          history: input.history,
        };
      }

      const supaRes = await fetch(SUPABASE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: input.sqlQuery }),
      });

      const data = await supaRes.json();
      const formattedResult = formatToMarkdownTable(data);
      console.log('Hasil query : ', formattedResult);

      return {
        sql_result: formattedResult,
        schema: input.schema,
        history: input.history,
      };
    },
    {
      sql_result: { error: 'Gagal menjalankan query.' },
      schema: '',
      history: null,
    }
  ),
  sqlAnswerPrompt,
  model,
  new RunnableLambda({ func: (res: { content: string }) => res.content }),
]);

const insightChain = RunnableSequence.from([
  insightPrompt,
  model,
  withErrorHandling(async (res: AIMessage) => res.content),
]);

export const chatChain = RunnableSequence.from([
  contextAugmenter,
  withErrorHandling(async (input: { question: string; history?: unknown }) => {
    const intent = await classifyIntent(input.question);
    return { ...input, intent };
  }),
  withErrorHandling(
    async (input: { question: string; intent?: string; history?: unknown }) => {
      if (input.intent === 'sql') {
        const result = await sqlChain.invoke({
          question: input.question,
          history: input.history,
        });
        console.log('SQL Type');
        return { ...input, output: result };
      } else {
        const result = await insightChain.invoke({
          question: input.question,
          history: input.history,
        });
        console.log('Insight Type');
        return { ...input, output: result };
      }
    }
  ),
  withErrorHandling(async (input: { question: string; output: string }) => {
    console.log('Saving context : ', input.question, input.output);
    await memory.saveContext(
      { question: input.question },
      { output: input.output }
    );
    console.log('Context saved.');

    return input.output;
  }),
]);
