export function isString(variable) {
  return typeof (variable) === 'string';
}

export function replaceLastOccurrenceInString(input, find, replaceWith) {
  if (!isString(input) || !isString(find) || !isString(replaceWith)) {
    // returns input on invalid arguments
    return input;
  }

  const lastIndex = input.lastIndexOf(find);
  if (lastIndex < 0) {
    return input;
  }

  return input.substr(0, lastIndex) + replaceWith + input.substr(lastIndex + find.length);
}
