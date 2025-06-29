import express from 'express';
import { createFaculty, getFaculties, getFaculty, updateFaculty, deleteFaculty } from './facultyController';

const router = express.Router();

router.post('/', createFaculty);
router.get('/', getFaculties);
router.get('/:id', getFaculty);
router.put('/:id', updateFaculty);
router.delete('/:id', deleteFaculty);

export default router;