// import { ChatOpenAI } from '@langchain/openai';
// // import { ConversationChain } from 'langchain/chains';
// // import { BufferMemory } from 'langchain/memory';
// import {
//   insightPrompt,
//   //   relevantPrompt,
//   sqlAnswerPrompt,
//   sqlPrompt,
// } from './promptTemplate';
// import { RunnableLambda, RunnableSequence } from '@langchain/core/runnables';
// import { AIMessage } from '@langchain/core/messages';
// import { sqlSchemas } from './sqlSchemas';

// const SUPABASE_FUNCTION_URL =
//   'https://hvpvmczjpfwysvzbwhhn.supabase.co/functions/v1/quick-endpoint';

// // const memory = new BufferMemory({
// //   returnMessages: true,
// //   memoryKey: 'history',
// // });

// const model = new ChatOpenAI({
//   temperature: 0,
//   modelName: 'openai/gpt-4o-mini',
//   configuration: {
//     baseURL: 'https://openrouter.ai/api/v1',
//     apiKey: process.env.OPENROUTER_API_KEY,
//     defaultHeaders: {
//       'HTTP-Referer': 'http://localhost:3000',
//       'X-Title': 'SAMI Dashboard',
//     },
//   },
// });

// // const chain = new ConversationChain({
// //   llm: model,
// //   memory,
// // });

// const classifyIntent = async (question: string) => {
//   const isSQL =
//     /(jumlah|berapa|tampilkan|data|daftar|persentase|rata-rata|berapa banyak)/i.test(
//       question
//     );
//   return isSQL ? 'sql' : 'insight';
// };

// // const tableKeywords = {
// //   detail_lulusan: [
// //     'lulusan',
// //     'mahasiswa',
// //     'status bekerja',
// //     'pekerjaan',
// //     'gaji',
// //     'waktu tunggu',
// //   ],
// //   status_lulusan: ['status lulusan', 'jumlah lulusan'],
// //   program_studi: ['program studi', 'prodi', 'jenjang'],
// //   kategori_pekerjaan: ['kategori pekerjaan', 'jenis pekerjaan'],
// // };

// // const extractTableNames = (question: string): string[] => {
// //   const lowerQuestion = question.toLowerCase();
// //   const tablesFound: string[] = [];

// //   for (const [table, keywords] of Object.entries(tableKeywords)) {
// //     if (keywords.some((kw) => lowerQuestion.includes(kw))) {
// //       tablesFound.push(table);
// //     }
// //   }

// //   return tablesFound;
// // };

// // const isRelevant = relevantPrompt.pipe(model).pipe(
// //   new RunnableLambda({
// //     func: async (output: AIMessage) => {
// //       console.log('Isi output dari model relevansi:', String(output.content));

// //       return String(output.content).trim().toLowerCase() === 'ya';
// //     },
// //   })
// // );

// // SQL CHAIN buat dapetin prompt sql
// const sqlChain = RunnableSequence.from([
//   async (input: { question: string; table_name: string; limit?: number }) => {
//     const { table_name, limit = 10 } = input;

//     const schema = sqlSchemas[table_name as keyof typeof sqlSchemas];

//     if (!schema) {
//       throw new Error(`Schema for table "${table_name}" not found.`);
//     }

//     console.log('schema :', schema);

//     const columns = schema.columns
//       .map((col) =>
//         'enum' in col && Array.isArray(col.enum)
//           ? `${col.name} (${col.type}) — one of [${col.enum.join(', ')}]`
//           : `${col.name} (${col.type})`
//       )
//       .join('\n');

//     console.log('columns :', columns);

//     return {
//       ...input,
//       columns,
//       limit,
//     };
//   },
//   sqlPrompt,
//   model,
//   async (input: { content: string; table_name: string }) => {
//     const match = input.content.match(/```sql\s*([\s\S]+?)\s*```/);
//     if (!match) throw new Error('No SQL found');

//     console.log('Query :', match[1].trim());

//     return {
//       sqlQuery: match[1].trim(),
//       table_name: input.table_name,
//     };
//   },
//   async (input: { sqlQuery: string; table_name: string }) => {
//     const supaRes = await fetch(SUPABASE_FUNCTION_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ sql: input.sqlQuery }),
//     });

//     const data = await supaRes.json();

//     console.log('Hasil Query :', data);

//     return {
//       table_name: input.table_name,
//       sql_result: data,
//     };
//   },
//   sqlAnswerPrompt,
//   model,
//   (res: { content: string }) => res.content,
// ]);

// const sqlChain = RunnableSequence.from([
//   async (input: { question: string }) => {
//     const allSchemas = Object.entries(sqlSchemas)
//       .map(([tableName, schema]) => {
//         const cols = schema.columns.map((col) =>
//           'enum' in col && Array.isArray(col.enum)
//             ? `${col.name} (${col.type}) — one of [${col.enum.join(', ')}]`
//             : `${col.name} (${col.type})`
//         );
//         return `Table: ${tableName}\n${cols.join('\n')}`;
//       })
//       .join('\n\n');

//     return {
//       question: input.question,
//       schema: allSchemas,
//     };
//   },
//   sqlPrompt,
//   model,
//   async (input: { content: string }) => {
//     const match = input.content.match(/```sql\s*([\s\S]+?)\s*```/);
//     if (!match) throw new Error('No SQL found');

//     const sqlQuery = match[1].trim();
//     console.log('Query:', sqlQuery);

//     return { sqlQuery };
//   },
//   async (input: { sqlQuery: string }) => {
//     const supaRes = await fetch(SUPABASE_FUNCTION_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ sql: input.sqlQuery }),
//     });

//     const data = await supaRes.json();

//     return {
//       sql_result: data,
//     };
//   },
//   sqlAnswerPrompt,
//   model,
//   (res: { content: string }) => res.content,
// ]);

// const insightChain = insightPrompt.pipe(model).pipe(
//   new RunnableLambda({
//     func: async (res: AIMessage) => res.content,
//   })
// );

// export const chatChain = RunnableSequence.from([
//   new RunnableLambda({
//     func: async (input: { question: string }) => {
//       const intent = await classifyIntent(input.question);

//       console.log('jenis intent :', intent);

//       return { ...input, intent };
//     },
//   }),

//   //   new RunnableLambda({
//   //     func: async (input: {
//   //       question: string;
//   //       intent: string;
//   //       stopChain: boolean;
//   //     }) => {
//   //       if (input.stopChain) {
//   //         return input;
//   //       }

//   //       if (input.intent === 'sql') {
//   //         const tables = extractTableNames(input.question);
//   //         if (tables.length === 0) {
//   //           throw new Error('Tidak ada nama tabel terdeteksi.');
//   //         }

//   //         console.log('ada tabel :', tables);

//   //         return {
//   //           ...input,
//   //           table_name: tables,
//   //         };
//   //       }

//   //       return input;
//   //     },
//   //   }),

//   new RunnableLambda({
//     func: async (input: {
//       question: string;
//       intent?: string;
//       table_name?: string;
//       tables?: string[];
//     }) => {
//       if (input.intent === 'sql') {
//         // if (!input.table_name) {
//         //   throw new Error('table_name tidak tersedia untuk query SQL.');
//         // }

//         const result = await sqlChain.invoke({
//           question: input.question,
//           table_name: input.table_name,
//         });

//         console.log('jenis sql');
//         console.log('output file agent :', result);
//         console.log('question :', input.question);

//         return { output: result };
//       } else {
//         const result = await insightChain.invoke({ question: input.question });
//         console.log('jenis insight');

//         return { output: result };
//       }
//     },
//   }),
// ]);

// export const sqlPrompt = ChatPromptTemplate.fromMessages([
//   SystemMessagePromptTemplate.fromTemplate(
//     `You are a PostgreSQL SQL expert. Your task is to convert natural language questions into valid PostgreSQL SQL queries based on the schema. Use the schema provided below to select appropriate tables and columns. Return only the query, wrapped in a \`\`\`sql ... \`\`\` block, and ensure correctness and compatibility with PostgreSQL.

//       Schema:
//       {schema}

//       Guidelines:
//       1. All text comparisons must be case-insensitive.
//       2. If the user asks to filter by certain values, use ILIKE or LOWER(column) = LOWER('value').
//       3. For boolean filters, match against TRUE or FALSE.
//       4. Use LIMIT {limit} at the end unless:
//       - The question asks for all records explicitly
//       - The query uses GROUP BY to show group-level results
//       - The query uses COUNT or other aggregates that need all data
//       5. Do NOT explain the query, only return it.
//       6. If the user asks for general insights, return a default query like:
//           SELECT * FROM {table_name} LIMIT {limit};

//       Double check the query for common SQL issues:
//       - Avoid using NOT IN with NULLs — prefer NOT EXISTS
//       - Use BETWEEN only for inclusive ranges
//       - Ensure data types in WHERE clauses match column types
//       - Avoid unnecessary subqueries
//       - Use proper functions for date filtering on created_at or tahun

//       Important:
//       - If the question is not about data, do not generate SQL.
//       - DO NOT include a semicolon (;) at the end of the SQL query
//       - Return only one SQL statement without explanation

//       Respond only with valid SQL inside \`\`\`sql\n...\n\`\`\`.`
//   ),
//   HumanMessagePromptTemplate.fromTemplate(`{question}`),
// ]);

// // export const sqlPrompt = ChatPromptTemplate.fromMessages([
// //   SystemMessagePromptTemplate.fromTemplate(
// //     `You are a PostgreSQL SQL expert. Your task is to convert natural language questions into valid PostgreSQL SQL queries based on the "{table_name}" table. Return only the query, wrapped in a \`\`\`sql ... \`\`\` block, and ensure correctness and compatibility with PostgreSQL.

// //     Relevant Table: {table_name}

// //     Available Columns: {columns}

// //     Guidelines:
// //     1. All text comparisons must be case-insensitive.
// //     2. If the user asks to filter by certain values, use ILIKE or LOWER(column) = LOWER('value').
// //     3. For boolean filters, match against TRUE or FALSE.
// //     4. Use LIMIT {limit} at the end unless:
// //     - The question asks for all records explicitly
// //     - The query uses GROUP BY to show group-level results
// //     - The query uses COUNT or other aggregates that need all data
// //     5. Do NOT explain the query, only return it.
// //     6. If the user asks for general insights, return a default query like:
// //         SELECT * FROM {table_name} LIMIT {limit};

// //     Double check the query for common SQL issues:
// //     - Avoid using NOT IN with NULLs — prefer NOT EXISTS
// //     - Use BETWEEN only for inclusive ranges
// //     - Ensure data types in WHERE clauses match column types
// //     - Avoid unnecessary subqueries
// //     - Use proper functions for date filtering on created_at or tahun

// //     Important:
// //     - If the question is not about data, do not generate SQL.
// //     - DO NOT include a semicolon (;) at the end of the SQL query
// //     - Return only one SQL statement without explanation

// //     Respond only with valid SQL inside \`\`\`sql\n...\n\`\`\`.`
// //   ),
// //   HumanMessagePromptTemplate.fromTemplate(`{question}`),
// // ]);

// UPDATE PALING BARU

// const SUPABASE_FUNCTION_URL =
//   'https://hvpvmczjpfwysvzbwhhn.supabase.co/functions/v1/quick-endpoint';

// const model = new ChatOpenAI({
//   temperature: 0,
//   modelName: 'openai/gpt-4o-mini',
//   configuration: {
//     baseURL: 'https://openrouter.ai/api/v1',
//     apiKey: process.env.OPENROUTER_API_KEY,
//     defaultHeaders: {
//       'HTTP-Referer': 'http://localhost:3000',
//       'X-Title': 'SAMI Dashboard',
//     },
//   },
// });

// const memory = new BufferMemory({
//   returnMessages: true,
//   memoryKey: 'history',
// });

// const contextAugmenter = new RunnableLambda({
//   func: async (input) => {
//     const history = await memory.loadMemoryVariables({});
//     return {
//       ...input,
//       history: history.history,
//     };
//   },
// });

// const classifyIntent = async (question: string) => {
//   const isSQL =
//     /(jumlah|berapa|tampilkan|data|daftar|persentase|rata-rata|berapa banyak)/i.test(
//       question
//     );
//   return isSQL ? 'sql' : 'insight';
// };

// const sqlChain = RunnableSequence.from([
//   contextAugmenter,
//   new RunnableLambda({
//     func: async (input: { question: string; history: any }) => {
//       const allSchemas = Object.entries(sqlSchemas)
//         .map(([tableName, schema]) => {
//           const cols = schema.columns.map((col) =>
//             'enum' in col && Array.isArray(col.enum)
//               ? `${col.name} (${col.type}) — one of [${col.enum.join(', ')}]`
//               : `${col.name} (${col.type})`
//           );
//           return `Table: ${tableName}\n${cols.join('\n')}`;
//         })
//         .join('\n\n');

//       return {
//         ...input,
//         schema: allSchemas,
//         limit: 50,
//       };
//     },
//   }),
//   sqlPrompt,
//   model,
//   new RunnableLambda({
//     func: async (input: { content: string; schema: string; history: any }) => {
//       const match = input.content.match(/```sql\s*([\s\S]+?)\s*```/);
//       if (!match) {
//         console.warn('SQL query tidak ditemukan dalam respons model.');
//         return { sqlQuery: null, schema: input.schema };
//       }

//       const sqlQuery = match[1].trim();
//       console.log('Query : ', sqlQuery);

//       return { sqlQuery, schema: input.schema, history: input.history };
//     },
//   }),
//   new RunnableLambda({
//     func: async (input: {
//       sqlQuery: string | null;
//       schema: string;
//       history: any;
//     }) => {
//       if (!input.sqlQuery) {
//         console.warn('SQL query kosong. Melewatkan eksekusi SQL.');
//         return {
//           sql_result: { error: 'Query tidak valid atau tidak ditemukan.' },
//           schema: input.schema,
//           history: input.history,
//         };
//       }

//       const supaRes = await fetch(SUPABASE_FUNCTION_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ sql: input.sqlQuery }),
//       });

//       const data = await supaRes.json();
//       console.log('Hasil query : ', data);

//       return {
//         sql_result: data,
//         schema: input.schema,
//         history: input.history,
//       };
//     },
//   }),
//   sqlAnswerPrompt,
//   model,
//   new RunnableLambda({ func: (res: { content: string }) => res.content }),
// ]);

// const insightChain = RunnableSequence.from([
//   contextAugmenter,
//   insightPrompt,
//   model,
//   new RunnableLambda({
//     func: async (res: AIMessage) => res.content,
//   }),
// ]);

// export const chatChain = RunnableSequence.from([
//   new RunnableLambda({
//     func: async (input: { question: string }) => {
//       const intent = await classifyIntent(input.question);

//       return { ...input, intent };
//     },
//   }),
//   new RunnableLambda({
//     func: async (input: { question: string; intent?: string }) => {
//       if (input.intent === 'sql') {
//         const result = await sqlChain.invoke({
//           question: input.question,
//         });
//         console.log('SQL Type');

//         return { output: result };
//       } else {
//         const result = await insightChain.invoke({ question: input.question });
//         console.log('Insight Type');

//         return { output: result };
//       }
//     },
//   }),
//   new RunnableLambda({
//     func: async (input: { question: string; output: string }) => {
//       await memory.saveContext(
//         { input: input.question },
//         { output: input.output }
//       );
//       return input.output;
//     },
//   }),
// ]);
