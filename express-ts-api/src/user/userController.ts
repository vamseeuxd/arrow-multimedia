import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, getAllRolesForUsers } from './userService';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const addUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, roleId } = req.body;
    const user = await createUser(name, email, password, roleId);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const editUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, roleId } = req.body;
    const user = await updateUser(req.params.id, name, email, roleId, password);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const removeUser = async (req: AuthRequest, res: Response) => {
  try {
    const result = await deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const getUserRoles = async (req: AuthRequest, res: Response) => {
  try {
    const roles = await getAllRolesForUsers();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};