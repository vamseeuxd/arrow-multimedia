import express from 'express';
import { createBatch, getBatches, getBatch, updateBatch, deleteBatch } from './batchController';

const router = express.Router();

router.post('/', createBatch);
router.get('/', getBatches);
router.get('/:id', getBatch);
router.put('/:id', updateBatch);
router.delete('/:id', deleteBatch);

export default router;