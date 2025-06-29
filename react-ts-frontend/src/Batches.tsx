import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton, Chip, FormControl, InputLabel,
  Select, MenuItem, OutlinedInput
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axios from 'axios';

interface Course {
  _id: string;
  courseName: string;
}

interface Faculty {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Batch {
  _id: string;
  batchId: string;
  batchName: string;
  courseId: Course;
  facultyId: Faculty;
  startDate: string;
  endDate: string;
  studentIds: Student[];
}

const Batches: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [formData, setFormData] = useState({
    batchId: '',
    batchName: '',
    courseId: '',
    facultyId: '',
    startDate: '',
    endDate: '',
    studentIds: [] as string[]
  });

  useEffect(() => {
    fetchBatches();
    fetchCourses();
    fetchFaculties();
    fetchStudents();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/batches');
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/faculties');
      setFaculties(response.data);
    } catch (error) {
      console.error('Error fetching faculties:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingBatch) {
        await axios.put(`http://localhost:3001/api/batches/${editingBatch._id}`, formData);
      } else {
        await axios.post('http://localhost:3001/api/batches', formData);
      }
      fetchBatches();
      handleClose();
    } catch (error) {
      console.error('Error saving batch:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/batches/${id}`);
      fetchBatches();
    } catch (error) {
      console.error('Error deleting batch:', error);
    }
  };

  const handleEdit = (batch: Batch) => {
    setEditingBatch(batch);
    setFormData({
      batchId: batch.batchId,
      batchName: batch.batchName,
      courseId: batch.courseId._id,
      facultyId: batch.facultyId._id,
      startDate: batch.startDate.split('T')[0],
      endDate: batch.endDate.split('T')[0],
      studentIds: batch.studentIds.map(student => student._id)
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBatch(null);
    setFormData({ batchId: '', batchName: '', courseId: '', facultyId: '', startDate: '', endDate: '', studentIds: [] });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Batches</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add Batch
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Batch ID</TableCell>
              <TableCell>Batch Name</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Faculty</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Students</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {batches.map((batch) => (
              <TableRow key={batch._id}>
                <TableCell>{batch.batchId}</TableCell>
                <TableCell>{batch.batchName}</TableCell>
                <TableCell>{batch.courseId.courseName}</TableCell>
                <TableCell>{`${batch.facultyId.firstName} ${batch.facultyId.lastName}`}</TableCell>
                <TableCell>
                  {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {batch.studentIds.map((student) => (
                    <Chip key={student._id} label={`${student.firstName} ${student.lastName}`} size="small" sx={{ mr: 1, mb: 1 }} />
                  ))}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(batch)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(batch._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingBatch ? 'Edit Batch' : 'Add Batch'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Batch ID"
            value={formData.batchId}
            onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Batch Name"
            value={formData.batchName}
            onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Course</InputLabel>
            <Select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              label="Course"
            >
              {courses.map((course) => (
                <MenuItem key={course._id} value={course._id}>
                  {course.courseName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Faculty</InputLabel>
            <Select
              value={formData.facultyId}
              onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
              label="Faculty"
            >
              {faculties.map((faculty) => (
                <MenuItem key={faculty._id} value={faculty._id}>
                  {`${faculty.firstName} ${faculty.lastName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Students</InputLabel>
            <Select
              multiple
              value={formData.studentIds}
              onChange={(e) => setFormData({ ...formData, studentIds: e.target.value as string[] })}
              input={<OutlinedInput label="Students" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const student = students.find(s => s._id === value);
                    return <Chip key={value} label={`${student?.firstName} ${student?.lastName}`} size="small" />;
                  })}
                </Box>
              )}
            >
              {students.map((student) => (
                <MenuItem key={student._id} value={student._id}>
                  {`${student.firstName} ${student.lastName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingBatch ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Batches;