import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { getAllRoles, getRoleById, createRole, updateRole, deleteRole } from './roleService';

export const getRoles = async (req: AuthRequest, res: Response) => {
  try {
    const roles = await getAllRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getRole = async (req: AuthRequest, res: Response) => {
  try {
    const role = await getRoleById(req.params.id);
    res.json(role);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const addRole = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, permissions } = req.body;
    const role = await createRole(name, description, permissions);
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const editRole = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, permissions } = req.body;
    const role = await updateRole(req.params.id, name, description, permissions);
    res.json(role);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const removeRole = async (req: AuthRequest, res: Response) => {
  try {
    const result = await deleteRole(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};