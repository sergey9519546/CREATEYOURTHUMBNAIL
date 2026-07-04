export const isQuotaError = (msg: string): boolean => {
  if (!msg) return false;
  return msg.includes('spending cap') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('Quota Exceeded');
};

export const isAuthError = (msg: string): boolean => {
  if (!msg) return false;
  return msg.includes('API_KEY_INVALID') || msg.includes('not valid') || msg.includes('API key');
};
