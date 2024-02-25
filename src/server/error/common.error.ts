export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return { error: String(error) };
  return { error: String(error) };
}
