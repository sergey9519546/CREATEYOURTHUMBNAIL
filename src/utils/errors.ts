export function isQuotaError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return msg.includes('spending cap') || msg.includes('resource_exhausted') || msg.includes('quota');
  }
  return false;
}

export function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return msg.includes('api_key_invalid') || msg.includes('not valid') || msg.includes('api key');
  }
  return false;
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
