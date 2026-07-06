export const isQuotaError = (error: unknown): boolean => {
  const msg = error instanceof Error ? error.message : String(error);
  return msg.includes('spending cap') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota');
};

export const isAuthError = (error: unknown): boolean => {
  const msg = error instanceof Error ? error.message : String(error);
  return msg.includes('API_KEY_INVALID') || msg.includes('not valid') || msg.includes('API key');
};
