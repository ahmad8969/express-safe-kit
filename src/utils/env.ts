export const isProduction = (): boolean => {
  return process.env.NODE_ENV === "production";
};

export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV !== "production";
};

const warnedKeys = new Set<string>();

export const warnOnce = (key: string, message: string): void => {
  if (warnedKeys.has(key)) {
    return;
  }
  warnedKeys.add(key);
  console.warn(message);
};

/** Reset warnings between tests. */
export const resetWarningsForTests = (): void => {
  warnedKeys.clear();
};
