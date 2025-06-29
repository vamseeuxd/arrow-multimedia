import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  enrolledCourses: mongoose.Types.ObjectId[];
  enrollmentDate: Date;
}

const StudentSchema: Schema = new Schema({
  studentId: {
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
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  enrollmentDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

StudentSchema.index({ studentId: 1 });
StudentSchema.index({ email: 1 });

const Student = mongoose.model<IStudent>('Student', StudentSchema);
export default Student;