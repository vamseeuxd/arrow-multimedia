import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../user/UserModel';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const loginUser = async (email: string, password: string) => {
  console.log('Login attempt for:', email);
  const user = await User.findOne({ email }).populate('role', 'name description');
  console.log('User found:', user ? 'Yes' : 'No');
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  const passwordMatch = bcrypt.compareSync(password, user.password);
  console.log('Password match:', passwordMatch);
  
  if (!passwordMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
};