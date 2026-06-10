export const getMimeType = (dataUrl: string): string => {
  const match = dataUrl.match(/^data:([^;]+);/);
  return match ? match[1] : 'image/png';
};

export const sanitizeError = (err: unknown): string => {
  let msg = 'Unknown error';
  if (err instanceof Error) {
    msg = err.message;
  } else if (err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string') {
    msg = (err as any).message;
  } else if (typeof err === 'string') {
    msg = err;
  }

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
