const exclude = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const filteredObj: Partial<T> = {};
  Object.keys(obj).forEach((key) => {
    if (!keys.includes(key as K)) {
      filteredObj[key as keyof T] = obj[key as keyof T];
    }
  });
  return filteredObj as Omit<T, K>;
};

export default exclude;
