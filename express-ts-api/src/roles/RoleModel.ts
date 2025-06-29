import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
  name: string;
  description: string;
  permissions: mongoose.Types.ObjectId[];
}

const RoleSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }]
}, {
  timestamps: true
});

export const seedRoles = async () => {
  try {
    const roleCount = await Role.countDocuments();
    if (roleCount === 0) {
      const Permission = mongoose.model('Permission');
      const permissions = await Permission.find({});
      
      const adminPerms = permissions.filter(p => ['user.create', 'user.read', 'user.update', 'user.delete', 'role.manage'].includes(p.name));
      const managerPerms = permissions.filter(p => ['user.read', 'user.update'].includes(p.name));
      const userPerms = permissions.filter(p => ['user.read.own'].includes(p.name));
      
      await Role.create([
        { name: "admin", description: "Full system access", permissions: adminPerms.map(p => p._id) },
        { name: "manager", description: "Limited management access", permissions: managerPerms.map(p => p._id) },
        { name: "user", description: "Basic user access", permissions: userPerms.map(p => p._id) }
      ]);
      console.log('Initial roles seeded');
    }
  } catch (error) {
    console.error('Error seeding roles:', error);
  }
};

const Role = mongoose.model<IRole>('Role', RoleSchema);
export default Role;