import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import User from '../user/UserModel';
import '../roles/RoleModel';

const checkUsers = async () => {
  try {
    await connectDB();
    const users = await User.find().populate('role');
    console.log('Users in database:', users.length);
    users.forEach(user => {
      console.log(`- ${user.email} (${user.name}) - Role: ${(user.role as any)?.name}`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUsers();