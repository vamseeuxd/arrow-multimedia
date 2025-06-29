import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  courseId: string;
  courseName: string;
  description: string;
  duration: number;
  fees: number;
}

const CourseSchema: Schema = new Schema({
  courseId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  fees: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

CourseSchema.index({ courseId: 1 });
CourseSchema.index({ courseName: 1 });

const Course = mongoose.model<ICourse>('Course', CourseSchema);
export default Course;