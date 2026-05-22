import { Router } from 'express';
import { createConcepts, refineConcept } from '../controllers/conceptController.js';
import { generateImage } from '../controllers/imageController.js';
import { rateLimit } from '../middlewares/rateLimit.js';

const router = Router();

router.post('/thumbnail-concepts', rateLimit(10), createConcepts);
router.post('/refine-concept', rateLimit(20), refineConcept);
router.post('/generate-image', rateLimit(15), generateImage);

export default router;
