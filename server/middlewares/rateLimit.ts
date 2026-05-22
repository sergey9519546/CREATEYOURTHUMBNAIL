import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter (per IP, sliding window)
const ipWindows = new Map<string, { count: number; resetAt: number }>();

// Purge expired windows every 5 minutes to prevent unbounded map growth
setInterval(() => {
  const now = Date.now();
  for (const [ip, win] of ipWindows) {
    if (now > win.resetAt) ipWindows.delete(ip);
  }
}, 5 * 60_000).unref();

export const rateLimit = (maxPerMinute: number) => (req: Request, res: Response, next: NextFunction) => {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.ip || 'unknown';
  const now = Date.now();
  const win = ipWindows.get(ip);
  if (!win || now > win.resetAt) {
    ipWindows.set(ip, { count: 1, resetAt: now + 60_000 });
    return next();
  }
  if (win.count >= maxPerMinute) {
    return res.status(429).json({ error: 'Too many requests — please wait a minute before trying again.' });
  }
  win.count++;
  next();
};
