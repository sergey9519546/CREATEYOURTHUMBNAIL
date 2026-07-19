export const isQuotaError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes('spending cap') || error.message.includes('RESOURCE_EXHAUSTED');
  }
  return false;
};

export const isAuthError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes('API key not valid');
  }
  return false;
};
