export const isQuotaError = (msg: string | undefined): boolean => {
  if (!msg) return false;
  const lowerMsg = msg.toLowerCase();
  return lowerMsg.includes('spending cap') || lowerMsg.includes('resource_exhausted') || lowerMsg.includes('quota exceeded');
};

export const isAuthError = (msg: string | undefined): boolean => {
  if (!msg) return false;
  const lowerMsg = msg.toLowerCase();
  return lowerMsg.includes('api_key_invalid') || lowerMsg.includes('not valid') || lowerMsg.includes('invalid api key') || lowerMsg.includes('api key');
};
