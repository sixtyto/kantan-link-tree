export function normalizeUrl(input: string) {
  if (
    input.includes("@") ||
    input.startsWith("http://") ||
    input.startsWith("https://")
  ) {
    return input;
  }
  return `https://${input}`;
}
