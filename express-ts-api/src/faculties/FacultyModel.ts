import mongoose, { Document, Schema } from 'mongoose';

export interface IFaculty extends Document {
  facultyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  assignedCourses: mongoose.Types.ObjectId[];
}

const FacultySchema: Schema = new Schema({
  facultyId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  assignedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
}, {
  timestamps: true
});

FacultySchema.index({ facultyId: 1 });
FacultySchema.index({ email: 1 });

const Faculty = mongoose.model<IFaculty>('Faculty', FacultySchema);
export default Faculty;