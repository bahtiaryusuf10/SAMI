import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const model = new ChatOpenAI({
  temperature: 0.5,
  modelName: 'openai/gpt-4o-mini',
  configuration: {
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL,
      'X-Title': 'SAMI Dashboard',
    },
  },
});

export function createSummaryChain(template: string) {
  const prompt = PromptTemplate.fromTemplate(template);
  
  return prompt.pipe(model).pipe(new StringOutputParser());
}