const elide = (input: string, maxLength: number, elideWith = "..."): string => {
  if (input.length <= maxLength) {
    return input;
  }

  let result = input.slice(0, maxLength);

  if (elideWith) {
    result = result.slice(0, -elideWith.length);
    result += elideWith;
  }

  return result;
};

export default elide;
