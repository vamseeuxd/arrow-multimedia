import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton, Chip, FormControl, InputLabel,
  Select, MenuItem, OutlinedInput
} from '@mui/material';
import { Edit, Delete, Add, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Course {
  _id: string;
  courseName: string;
}

interface Faculty {
  _id: string;
  facultyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  assignedCourses: Course[];
}

const Faculties: React.FC = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [formData, setFormData] = useState({
    facultyId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    assignedCourses: [] as string[]
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchFaculties();
    fetchCourses();
  }, []);

  const fetchFaculties = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/faculties');
      setFaculties(response.data);
    } catch (error) {
      console.error('Error fetching faculties:', error);
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

  const handleSubmit = async () => {
    try {
      if (editingFaculty) {
        await axios.put(`http://localhost:3001/api/faculties/${editingFaculty._id}`, formData);
      } else {
        await axios.post('http://localhost:3001/api/faculties', formData);
      }
      fetchFaculties();
      handleClose();
    } catch (error) {
      console.error('Error saving faculty:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/faculties/${id}`);
      fetchFaculties();
    } catch (error) {
      console.error('Error deleting faculty:', error);
    }
  };

  const handleEdit = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setFormData({
      facultyId: faculty.facultyId,
      firstName: faculty.firstName,
      lastName: faculty.lastName,
      email: faculty.email,
      phone: faculty.phone,
      assignedCourses: faculty.assignedCourses.map(course => course._id)
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingFaculty(null);
    setFormData({ facultyId: '', firstName: '', lastName: '', email: '', phone: '', assignedCourses: [] });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
          Back
        </Button>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Faculties</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add Faculty
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Faculty ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Assigned Courses</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {faculties.map((faculty) => (
              <TableRow key={faculty._id}>
                <TableCell>{faculty.facultyId}</TableCell>
                <TableCell>{`${faculty.firstName} ${faculty.lastName}`}</TableCell>
                <TableCell>{faculty.email}</TableCell>
                <TableCell>{faculty.phone}</TableCell>
                <TableCell>
                  {faculty.assignedCourses.map((course) => (
                    <Chip key={course._id} label={course.courseName} size="small" sx={{ mr: 1 }} />
                  ))}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(faculty)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(faculty._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingFaculty ? 'Edit Faculty' : 'Add Faculty'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Faculty ID"
            value={formData.facultyId}
            onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Assigned Courses</InputLabel>
            <Select
              multiple
              value={formData.assignedCourses}
              onChange={(e) => setFormData({ ...formData, assignedCourses: e.target.value as string[] })}
              input={<OutlinedInput label="Assigned Courses" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const course = courses.find(c => c._id === value);
                    return <Chip key={value} label={course?.courseName} size="small" />;
                  })}
                </Box>
              )}
            >
              {courses.map((course) => (
                <MenuItem key={course._id} value={course._id}>
                  {course.courseName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingFaculty ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Faculties;