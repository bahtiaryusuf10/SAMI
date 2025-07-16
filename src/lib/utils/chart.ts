// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractKeysFromData<T extends Record<string, any>>(
  data: T[],
  indexBy: keyof T
): string[] {
  if (data.length === 0) return [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [indexBy]: _, ...rest } = data[0];
  return Object.keys(rest);
}
