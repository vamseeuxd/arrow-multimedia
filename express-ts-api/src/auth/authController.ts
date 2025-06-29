import { Request, Response } from 'express';
import { loginUser } from './authService';

export const login = async (req: Request, res: Response) => {
  try {
    console.log('Login endpoint hit with body:', req.body);
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json(result);
  } catch (error) {
    console.log('Login error:', (error as Error).message);
    res.status(401).json({ error: (error as Error).message });
  }
};