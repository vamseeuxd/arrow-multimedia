import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { getAllPermissions, getPermissionById, createPermission, updatePermission, deletePermission } from './permissionService';

export const getPermissions = async (req: AuthRequest, res: Response) => {
  try {
    const permissions = await getAllPermissions();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPermission = async (req: AuthRequest, res: Response) => {
  try {
    const permission = await getPermissionById(req.params.id);
    res.json(permission);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const addPermission = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, category } = req.body;
    const permission = await createPermission(name, description, category);
    res.status(201).json(permission);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const editPermission = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, category } = req.body;
    const permission = await updatePermission(req.params.id, name, description, category);
    res.json(permission);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const removePermission = async (req: AuthRequest, res: Response) => {
  try {
    const result = await deletePermission(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};