
export function replaceUrlPlaceholders(
    url: string,
    replacements: { [key: string]: string }
  ): string {
    return url.replace(
      /{(\w+)}/g,
      (placeholderWithDelimiters, placeholderWithoutDelimiters) =>
        placeholderWithoutDelimiters in replacements
          ? replacements[placeholderWithoutDelimiters]
          : placeholderWithDelimiters
    );
  }


export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function camelCaseToSeparated(input: string, separator: string = ' '): string {
  return input.replace(/([A-Z])/g, `${separator}$1`).trim();
}
