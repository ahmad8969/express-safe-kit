type PlainObject = Record<string, unknown>;

const isPlainObject = (value: unknown): value is PlainObject =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const deepMerge = <T extends object>(
  base: T,
  override: Partial<T> | undefined
): T => {
  if (!override) {
    return { ...base };
  }

  const result: PlainObject = { ...(base as PlainObject) };

  for (const key of Object.keys(override) as Array<keyof T>) {
    const overrideValue = override[key];
    if (overrideValue === undefined) {
      continue;
    }

    const baseValue = result[key as string];
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key as string] = deepMerge(baseValue, overrideValue as Partial<T>);
      continue;
    }

    result[key as string] = overrideValue;
  }

  return result as T;
};
