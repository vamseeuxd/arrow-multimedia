import Permission from './PermissionModel';

export const getAllPermissions = async () => {
  return await Permission.find({});
};

export const getPermissionById = async (id: string) => {
  const permission = await Permission.findById(id);
  if (!permission) throw new Error('Permission not found');
  return permission;
};

export const createPermission = async (name: string, description: string, category: string) => {
  const existingPermission = await Permission.findOne({ name });
  if (existingPermission) throw new Error('Permission already exists');
  
  const permission = await Permission.create({ name, description, category });
  return permission;
};

export const updatePermission = async (id: string, name: string, description: string, category: string) => {
  const permission = await Permission.findByIdAndUpdate(id, { name, description, category }, { new: true });
  if (!permission) throw new Error('Permission not found');
  return permission;
};

export const deletePermission = async (id: string) => {
  const permission = await Permission.findByIdAndDelete(id);
  if (!permission) throw new Error('Permission not found');
  return { message: 'Permission deleted successfully' };
};