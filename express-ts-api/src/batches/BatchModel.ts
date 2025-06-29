import mongoose, { Document, Schema } from 'mongoose';

export interface IBatch extends Document {
  batchId: string;
  batchName: string;
  courseId: mongoose.Types.ObjectId;
  facultyId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  studentIds: mongoose.Types.ObjectId[];
}

const BatchSchema: Schema = new Schema({
  batchId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  batchName: {
    type: String,
    required: true,
    trim: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  studentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }]
}, {
  timestamps: true
});

BatchSchema.index({ batchId: 1 });
BatchSchema.index({ courseId: 1 });
BatchSchema.index({ facultyId: 1 });

const Batch = mongoose.model<IBatch>('Batch', BatchSchema);
export default Batch;