import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: mongoose.Types.ObjectId;
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
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  }
}, {
  timestamps: true
});

export const seedUsers = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const Role = mongoose.model('Role');
      const superAdminRole = await Role.findOne({ name: 'superAdmin' });
      const adminRole = await Role.findOne({ name: 'admin' });
      const userRole = await Role.findOne({ name: 'user' });
      
      if (superAdminRole && adminRole && userRole) {
        await User.create([
          { name: "Super Administrator", email: "superadmin@arrow.com", password: bcrypt.hashSync("SuperAdmin@2024", 10), role: superAdminRole._id },
          { name: "Vamsee Kalyan", email: "vamsee@example.com", password: bcrypt.hashSync("password123", 10), role: adminRole._id },
          { name: "Krishna Sukanya", email: "krishna@example.com", password: bcrypt.hashSync("password123", 10), role: userRole._id }
        ]);
        console.log('Initial users seeded');
      }
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;