import { Request, Response } from 'express';
import { generateConcepts, refineConcept as refineConceptService } from '../services/conceptService.js';
import { sanitizeError } from '../utils/error.js';

export const createConcepts = async (req: Request, res: Response) => {
  try {
    const { idea, niche, stylePreset, layout, palette, imageBase64, likedConcepts } = req.body;

    // Input validation
    if (!idea || typeof idea !== 'string' || !idea.trim()) {
      return res.status(400).json({ error: 'Video idea is required.' });
    }
    if (idea.length > 2000) {
      return res.status(400).json({ error: 'Video idea must be under 2000 characters.' });
    }
    if (likedConcepts !== undefined && !Array.isArray(likedConcepts)) {
      return res.status(400).json({ error: 'likedConcepts must be an array.' });
    }
    if (Array.isArray(likedConcepts) && likedConcepts.length > 20) {
      return res.status(400).json({ error: 'Too many liked concepts (max 20).' });
    }

    const data = await generateConcepts(req.body);
    res.json(data);
  } catch (error: any) {
    console.error("Error in /api/thumbnail-concepts:", error);
    const msg = sanitizeError(error);
    res.status(error.status === 429 ? 429 : 500).json({ error: msg });
  }
};

export const refineConcept = async (req: Request, res: Response) => {
  try {
    const { originalConcept, feedback, compositeReferences, imageBase64 } = req.body;

    // Input validation
    if (!originalConcept || typeof originalConcept !== 'object') {
      return res.status(400).json({ error: 'originalConcept is required.' });
    }
    if (!feedback || typeof feedback !== 'string' || !feedback.trim()) {
      return res.status(400).json({ error: 'Feedback is required.' });
    }
    if (feedback.length > 1000) {
      return res.status(400).json({ error: 'Feedback must be under 1000 characters.' });
    }

    const data = await refineConceptService(req.body);
    res.json(data);
  } catch (error: any) {
    console.error("Error in /api/refine-concept:", error);
    res.status(500).json({ error: sanitizeError(error) });
  }
};
