// Scrub internal details before sending errors to the client
export const sanitizeError = (err: any): string => {
  const msg: string = err?.message || 'Unknown error';
  if (msg.includes('spending cap') || msg.includes('RESOURCE_EXHAUSTED')) {
    return 'Gemini API quota exceeded. Please check your billing settings at console.cloud.google.com.';
  }
  if (msg.includes('API_KEY_INVALID') || msg.includes('not valid') || msg.includes('API key')) {
    return 'Invalid API key. Please check your environment configuration.';
  }
  if (msg.includes('MINIMAX_API_KEY environment variable')) {
    return 'Image generation is not configured. MINIMAX_API_KEY is missing.';
  }
  // Strip URLs and stack traces, keep first line only, cap length
  return msg.replace(/https?:\/\/[^\s]*/g, '[url]').split('\n')[0].slice(0, 300);
};
