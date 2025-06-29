import Role from './RoleModel';

export const getAllRoles = async () => {
  return await Role.find({}).populate('permissions', 'name description category');
};

export const getRoleById = async (id: string) => {
  const role = await Role.findById(id).populate('permissions', 'name description category');
  if (!role) throw new Error('Role not found');
  return role;
};

export const createRole = async (name: string, description: string, permissionIds: string[]) => {
  const existingRole = await Role.findOne({ name });
  if (existingRole) throw new Error('Role already exists');
  
  const role = await Role.create({ name, description, permissions: permissionIds });
  return await Role.findById(role._id).populate('permissions', 'name description category');
};

export const updateRole = async (id: string, name: string, description: string, permissionIds: string[]) => {
  const role = await Role.findByIdAndUpdate(id, { name, description, permissions: permissionIds }, { new: true }).populate('permissions', 'name description category');
  if (!role) throw new Error('Role not found');
  return role;
};

export const deleteRole = async (id: string) => {
  const role = await Role.findByIdAndDelete(id);
  if (!role) throw new Error('Role not found');
  return { message: 'Role deleted successfully' };
};