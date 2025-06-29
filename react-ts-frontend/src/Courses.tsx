import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton
} from '@mui/material';
import { Edit, Delete, Add, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Course {
  _id: string;
  courseId: string;
  courseName: string;
  description: string;
  duration: number;
  fees: number;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    courseId: '',
    courseName: '',
    description: '',
    duration: 0,
    fees: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingCourse) {
        await axios.put(`http://localhost:3001/api/courses/${editingCourse._id}`, formData);
      } else {
        await axios.post('http://localhost:3001/api/courses', formData);
      }
      fetchCourses();
      handleClose();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/courses/${id}`);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      courseId: course.courseId,
      courseName: course.courseName,
      description: course.description,
      duration: course.duration,
      fees: course.fees
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCourse(null);
    setFormData({ courseId: '', courseName: '', description: '', duration: 0, fees: 0 });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
          Back
        </Button>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Courses</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add Course
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course ID</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Duration (months)</TableCell>
              <TableCell>Fees</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell>{course.courseId}</TableCell>
                <TableCell>{course.courseName}</TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell>{course.duration}</TableCell>
                <TableCell>${course.fees}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(course)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(course._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCourse ? 'Edit Course' : 'Add Course'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Course ID"
            value={formData.courseId}
            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Course Name"
            value={formData.courseName}
            onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Duration (months)"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Fees"
            type="number"
            value={formData.fees}
            onChange={(e) => setFormData({ ...formData, fees: Number(e.target.value) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCourse ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Courses;