import { Request, Response } from 'express';
import Batch from './BatchModel';

export const createBatch = async (req: Request, res: Response) => {
  try {
    const batch = new Batch(req.body);
    await batch.save();
    res.status(201).json(batch);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getBatches = async (req: Request, res: Response) => {
  try {
    const batches = await Batch.find()
      .populate('courseId')
      .populate('facultyId')
      .populate('studentIds');
    res.json(batches);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBatch = async (req: Request, res: Response) => {
  try {
    const batch = await Batch.findById(req.params.id)
      .populate('courseId')
      .populate('facultyId')
      .populate('studentIds');
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    res.json(batch);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBatch = async (req: Request, res: Response) => {
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('courseId')
      .populate('facultyId')
      .populate('studentIds');
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    res.json(batch);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteBatch = async (req: Request, res: Response) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    res.json({ message: 'Batch deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};