import { Request, Response } from 'express';
import { generateImage as generateImageService } from '../services/imageService.js';
import { sanitizeError } from '../utils/error.js';

export const generateImage = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    // Input validation
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }
    if (prompt.length > 4000) {
      return res.status(400).json({ error: 'Prompt must be under 4000 characters.' });
    }

    const imageUrl = await generateImageService(req.body);
    res.json({ imageUrl });
  } catch (error: any) {
    console.error("Error in /api/generate-image:", error);
    res.status(500).json({ error: sanitizeError(error) });
  }
};
