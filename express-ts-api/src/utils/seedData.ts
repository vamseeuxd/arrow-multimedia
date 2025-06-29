import bcrypt from 'bcryptjs';
import User from '../models/User';

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