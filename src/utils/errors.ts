export const ERR_QUOTA_EXCEEDED = 'Gemini API Quota Exceeded: Your Google Cloud project has reached its spending cap or quota. Please check your billing settings at console.cloud.google.com.';
export const ERR_INVALID_API_KEY = 'Invalid API key. Please check your environment configuration.';
export const ERR_MINIMAX_MISSING = 'Image generation is not configured. MINIMAX_API_KEY is missing.';
export const ERR_UNKNOWN = 'Unknown error';

export const isQuotaError = (msg: string): boolean => {
  if (!msg) return false;
  return msg.includes('spending cap') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('Quota Exceeded');
};

export const sanitizeError = (err: any): string => {
  const msg: string = err?.message || ERR_UNKNOWN;
  if (isQuotaError(msg)) {
    return ERR_QUOTA_EXCEEDED;
  }
  if (msg.includes('API_KEY_INVALID') || msg.includes('not valid') || msg.includes('API key')) {
    return ERR_INVALID_API_KEY;
  }
  if (msg.includes('MINIMAX_API_KEY environment variable')) {
    return ERR_MINIMAX_MISSING;
  }
  // Strip URLs and stack traces, keep first line only, cap length
  return msg.replace(/https?:\/\/[^\s]*/g, '[url]').split('\n')[0].slice(0, 300);
};
