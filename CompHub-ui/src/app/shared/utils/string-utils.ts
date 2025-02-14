
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