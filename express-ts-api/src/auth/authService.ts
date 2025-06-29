import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../user/UserModel';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
};