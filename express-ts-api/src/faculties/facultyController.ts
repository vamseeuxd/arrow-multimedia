import { Request, Response } from 'express';
import Faculty from './FacultyModel';

export const createFaculty = async (req: Request, res: Response) => {
  try {
    const faculty = new Faculty(req.body);
    await faculty.save();
    res.status(201).json(faculty);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getFaculties = async (req: Request, res: Response) => {
  try {
    const faculties = await Faculty.find().populate('assignedCourses');
    res.json(faculties);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getFaculty = async (req: Request, res: Response) => {
  try {
    const faculty = await Faculty.findById(req.params.id).populate('assignedCourses');
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    res.json(faculty);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFaculty = async (req: Request, res: Response) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('assignedCourses');
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    res.json(faculty);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteFaculty = async (req: Request, res: Response) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    res.json({ message: 'Faculty deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};