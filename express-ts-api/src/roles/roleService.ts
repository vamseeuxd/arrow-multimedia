import Role from './RoleModel';

export const getAllRoles = async () => {
  return await Role.find({});
};

export const getRoleById = async (id: string) => {
  const role = await Role.findById(id);
  if (!role) throw new Error('Role not found');
  return role;
};

export const createRole = async (name: string, description: string, permissions: string[]) => {
  const existingRole = await Role.findOne({ name });
  if (existingRole) throw new Error('Role already exists');
  
  const role = await Role.create({ name, description, permissions });
  return role;
};

export const updateRole = async (id: string, name: string, description: string, permissions: string[]) => {
  const role = await Role.findByIdAndUpdate(id, { name, description, permissions }, { new: true });
  if (!role) throw new Error('Role not found');
  return role;
};

export const deleteRole = async (id: string) => {
  const role = await Role.findByIdAndDelete(id);
  if (!role) throw new Error('Role not found');
  return { message: 'Role deleted successfully' };
};