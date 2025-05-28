// import { NextRequest, NextResponse } from 'next/server';
// import { ChatOpenAI } from '@langchain/openai';
// import { ConversationChain } from 'langchain/chains';
// import { BufferMemory } from 'langchain/memory';

// const memory = new BufferMemory({
//   returnMessages: true,
//   memoryKey: 'chat_history',
// });

// const chat = new ChatOpenAI({
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

// const chain = new ConversationChain({
//   llm: chat,
//   memory,
// });

// export async function POST(req: NextRequest) {
//   try {
//     const { messages } = await req.json();

//     if (!messages || !Array.isArray(messages)) {
//       return NextResponse.json(
//         { error: 'Invalid message format' },
//         { status: 400 }
//       );
//     }

//     const userMessage = messages[messages.length - 1]?.content || '';

//     const response = await chain.call({ input: userMessage });

//     return NextResponse.json({ message: response.response }, { status: 200 });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { error: 'Failed to get response' },
//       { status: 500 }
//     );
//   }
// }

// import { NextRequest, NextResponse } from 'next/server';
// import OpenAI from 'openai';
// import { sqlSchemas } from '@/lib/sqlSchemas';

// const openai = new OpenAI({
//   baseURL: 'https://openrouter.ai/api/v1',
//   apiKey: process.env.OPENROUTER_API_KEY!,
//   defaultHeaders: {
//     'HTTP-Referer': 'http://localhost:3000',
//     'X-Title': 'SAMI Dashboard',
//   },
// });

// // const supabase = createSupabaseBrowserClient();
// const SUPABASE_FUNCTION_URL =
//   'https://hvpvmczjpfwysvzbwhhn.supabase.co/functions/v1/quick-endpoint';

// async function detectQueryIntent(message: string): Promise<boolean> {
//   // Simple keyword check, bisa di-tune
//   const keywords = [
//     'status lulusan',
//     'detail lulusan',
//     'data',
//     'berapa',
//     'jumlah',
//     'statistik',
//     'lulusan',
//     'insight',
//     'tabel',
//   ];

//   return keywords.some((kw) => message.toLowerCase().includes(kw));
// }

// function isInDomainContext(message: string): boolean {
//   const domainKeywords = [
//     'audit',
//     'mutu',
//     'internal',
//     'kinerja',
//     'program',
//     'program studi',
//     'kualitas',
//     'lulusan',
//     'evaluasi',
//     'akreditasi',
//     'penjaminan mutu',
//     'tracer',
//     'sarjana',
//     'mahasiswa',
//     'kuesioner',
//     'dosen',
//     'kurikulum',
//     'kemampuan kerja',
//     'hasil studi',
//     'evaluasi pembelajaran',
//   ];

//   return domainKeywords.some((kw) => message.toLowerCase().includes(kw));
// }

// function detectTableNameFromQuestion(
//   message: string
// ): keyof typeof sqlSchemas | null {
//   const keywordTableMap: Record<string, keyof typeof sqlSchemas> = {
//     'status lulusan': 'status_lulusan',
//     'detail lulusan': 'detail_lulusan',
//     lulusan: 'detail_lulusan',
//     pekerjaan: 'detail_lulusan',
//     prodi: 'program_studi',
//     tracer: 'detail_lulusan',
//     jumlah: 'detail_lulusan',
//     statistik: 'detail_lulusan',
//     tahun: 'detail_lulusan',
//     'kategori pekerjaan': 'kategori_pekerjaan',
//   };

//   const lower = message.toLowerCase();

//   for (const [keyword, table] of Object.entries(keywordTableMap)) {
//     if (lower.includes(keyword)) return table;
//   }

//   return null;
// }

// function detectLimitFromQuestion(message: string, defaultLimit = 50): number {
//   const match = message.match(/\b(\d+)\b/);
//   if (match) {
//     const num = parseInt(match[1], 10);
//     if (!isNaN(num) && num > 0 && num <= 200) return num;
//   }
//   return defaultLimit;
// }

// async function convertToSQL(
//   question: string,
//   table_name: string,
//   columns: { name: string; type: string; enum?: string[] }[],
//   limit: number
// ): Promise<string> {
//   const columnDescriptions = columns
//     .map((col) =>
//       col.enum
//         ? `${col.name} (${col.type}) — one of [${col.enum.join(', ')}]`
//         : `${col.name} (${col.type})`
//     )
//     .join('\n');

// const messages: {
//   role: 'system' | 'user' | 'assistant';
//   content: string;
//   name?: string;
// }[] = [
//   {
//     role: 'system',
//     content: `You are a SQL expert who converts natural language questions into PostgreSQL SQL queries using the "${table_name}" table. Only return the SQL query wrapped in \`\`\`sql blocks.
//     Relevant Table: ${table_name}

//     Available Columns: ${columnDescriptions}

//     Guidelines:
//     1. All text comparisons must be case-insensitive.
//     2. If the user asks to filter by certain values, use ILIKE or LOWER(column) = LOWER('value').
//     3. For boolean filters, match against TRUE or FALSE.
//     4. Use LIMIT ${limit} at the end unless:
//     - The question asks for all records explicitly
//     - The query uses GROUP BY to show group-level results
//     - The query uses COUNT or other aggregates that need all data
//     5. Do NOT explain the query, only return it.
//     6. If the user asks for general insights, return a default query like:
//        SELECT * FROM ${table_name} LIMIT ${limit};

//     Double check the query for common SQL issues:
//     - Avoid using NOT IN with NULLs — prefer NOT EXISTS
//     - Use BETWEEN only for inclusive ranges
//     - Ensure data types in WHERE clauses match column types
//     - Avoid unnecessary subqueries
//     - Use proper functions for date filtering on created_at or tahun

//     Important:
//     - DO NOT include a semicolon (;) at the end of the SQL query
//     - Return only one SQL statement without explanation

//     If the question is not about **lulusan**, respond with "I don't know" wrapped in \`\`\`.

//     Respond only with valid SQL inside \`\`\`sql\n...\n\`\`\`.`,
//   },
//   {
//     role: 'user',
//     content: `Convert this question into a SQL query:\n"${question}"`,
//   },
// ];

//   console.log('Messages:\n', messages);

//   const response = await openai.chat.completions.create({
//     model: 'openai/gpt-4o-mini',
//     messages,
//   });

//   const fullContent = response.choices?.[0]?.message?.content || '';
//   console.log('Full SQL Response:\n', fullContent);

//   const match = fullContent?.match(/```sql\s*([\s\S]+?)\s*```/);
//   const queryOnly = match?.[1]?.trim();

//   return queryOnly || '';
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { messages } = body;

//     if (!messages || !Array.isArray(messages)) {
//       return NextResponse.json(
//         { error: 'Invalid message format' },
//         { status: 400 }
//       );
//     }

//     const userMessage = messages[messages.length - 1]?.content || '';

//     // 1. Deteksi intent
//     const detectedTable = detectTableNameFromQuestion(userMessage);
//     const isQuery =
//       (await detectQueryIntent(userMessage)) && detectedTable !== null;
//     const isDomainRelevant = isInDomainContext(userMessage);

//     if (!isDomainRelevant) {
//       return NextResponse.json({
//         message: {
//           role: 'assistant',
//           content:
//             'Maaf, saya hanya dapat membantu terkait audit mutu internal program studi. Silakan ajukan pertanyaan seputar itu.',
//         },
//       });
//     }

//     if (!isQuery) {
//       console.log('Bukan query');

//       const response = await openai.chat.completions.create({
//         model: 'openai/gpt-4o-mini',
//         messages,
//       });

//       const reply = response.choices?.[0]?.message;
//       if (reply?.content) reply.content = reply.content.trim();

//       return NextResponse.json({ message: reply });
//     }

//     // 2. Jika pertanyaan data → convert ke SQL dulu
//     const tableName = detectedTable!;
//     const table = sqlSchemas[tableName];
//     const limit = detectLimitFromQuestion(userMessage);

//     const sqlQuery = await convertToSQL(
//       userMessage,
//       tableName,
//       table.columns,
//       limit
//     );

//     console.log('Query beneran: ', sqlQuery);

//     if (!sqlQuery) {
//       return NextResponse.json({
//         message: {
//           role: 'assistant',
//           content:
//             'Maaf, saya tidak bisa membuat query untuk pertanyaan tersebut.',
//         },
//       });
//     }

//     // 3. Jalankan query ke Supabase (gunakan RPC run_dynamic_query atau query biasa)
//     const supaRes = await fetch(SUPABASE_FUNCTION_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ sql: sqlQuery }),
//     });

//     if (!supaRes.ok) {
//       const err = await supaRes.json();
//       return NextResponse.json({
//         message: {
//           role: 'assistant',
//           content: `Gagal mengambil data dari database: ${
//             err.error || supaRes.statusText
//           }`,
//         },
//       });
//     }

//     const data = await supaRes.json();

//     if (!data || (Array.isArray(data) && data.length === 0)) {
//       return NextResponse.json({
//         message: {
//           role: 'assistant',
//           content: 'Tidak ditemukan data yang relevan.',
//         },
//       });
//     }

//     // 4. Gabungkan data ke prompt baru untuk peringkasan
//     const summaryPrompt = [
//       ...messages,
//       {
//         role: 'system',
//         content: `You are an expert in higher education analytics and serve as the head of the Computer Science study program.

//         You have received tracer study data from alumni based on a user request.

//         If the user’s question contains the word **"ringkasan"**, **"insight"**, or **"saran"**, your task is to **analyze the data** and respond **in Bahasa Indonesia** with:
//         - Ringkasan temuan utama
//         - Insight yang dapat ditindaklanjuti oleh program studi
//         - Saran konkret jika memungkinkan

//         Only use the data below to answer. Do not make assumptions about context or year unless the user's question specifically asks for them.

//         There is the data: ${JSON.stringify(data, null, 2)}`,
//       },
//       {
//         role: 'user',
//         content: `Pertanyaan user: ${userMessage}`,
//       },
//     ];

//     // 5. Kirim prompt ringkasan ke model
//     const response = await openai.chat.completions.create({
//       model: 'openai/gpt-4o-mini',
//       messages: summaryPrompt,
//     });

//     const reply = response.choices?.[0]?.message;
//     if (reply?.content) reply.content = reply.content.trim();

//     return NextResponse.json({ message: reply });

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     console.error('OpenRouter error:', error);

//     return NextResponse.json(
//       { error: error.message || 'Internal error' },
//       { status: 500 }
//     );
//   }
// }
