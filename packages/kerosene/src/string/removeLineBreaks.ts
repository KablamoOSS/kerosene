import replaceAll from "./replaceAll";

const removeLineBreaks = (input: string): string => {
  let result = input;

  result = replaceAll("\n", " ", result);
  result = replaceAll("\r", " ", result);

  return result;
};

export default removeLineBreaks;
