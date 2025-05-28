import { RunnableLambda } from '@langchain/core/runnables';

export const withErrorHandling = <TInput, TOutput>(
  fn: (input: TInput) => Promise<TOutput>,
  fallback: Partial<TOutput> = {}
) =>
  new RunnableLambda<TInput, TOutput>({
    func: async (input: TInput): Promise<TOutput> => {
      try {
        return await fn(input);
      } catch (err) {
        console.error('Runnable error:', err);
        return {
          ...(input as unknown as TOutput),
          ...fallback,
          error: 'Terjadi kesalahan saat memproses data.',
        };
      }
    },
  });
