import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
  name: string;
  description: string;
  permissions: string[];
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
    type: String,
    required: true
  }]
}, {
  timestamps: true
});

export const seedRoles = async () => {
  try {
    const roleCount = await Role.countDocuments();
    if (roleCount === 0) {
      await Role.create([
        { name: "admin", description: "Full system access", permissions: ["user.create", "user.read", "user.update", "user.delete", "role.manage"] },
        { name: "manager", description: "Limited management access", permissions: ["user.read", "user.update"] },
        { name: "user", description: "Basic user access", permissions: ["user.read.own"] }
      ]);
      console.log('Initial roles seeded');
    }
  } catch (error) {
    console.error('Error seeding roles:', error);
  }
};

const Role = mongoose.model<IRole>('Role', RoleSchema);
export default Role;