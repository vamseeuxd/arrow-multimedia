import express from 'express';
import { createStudent, getStudents, getStudent, updateStudent, deleteStudent } from './studentController';

const router = express.Router();

router.post('/', createStudent);
router.get('/', getStudents);
router.get('/:id', getStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;