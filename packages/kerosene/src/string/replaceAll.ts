const replaceAll = (replaceThis: string, withThis: string, inThis: string): string => {
  let result = inThis;

  while (result.includes(replaceThis)) {
    result = result.replace(replaceThis, withThis);
  }

  return result;
};

export default replaceAll;
