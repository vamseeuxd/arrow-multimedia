import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  name: {
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
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const seedUsers = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create([
        { name: "Vamsee Kalyan", email: "vamsee@example.com", password: bcrypt.hashSync("password123", 10) },
        { name: "Krishna Sukanya", email: "krishna@example.com", password: bcrypt.hashSync("password123", 10) }
      ]);
      console.log('Initial users seeded');
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;