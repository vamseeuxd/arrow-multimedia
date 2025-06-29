import mongoose, { Document, Schema } from 'mongoose';

export interface IPermission extends Document {
  name: string;
  description: string;
  category: string;
}

const PermissionSchema: Schema = new Schema({
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
  category: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

export const seedPermissions = async () => {
  try {
    const permissionCount = await Permission.countDocuments();
    if (permissionCount === 0) {
      await Permission.create([
        { name: "user.create", description: "Create new users", category: "User Management" },
        { name: "user.read", description: "View user information", category: "User Management" },
        { name: "user.update", description: "Update user information", category: "User Management" },
        { name: "user.delete", description: "Delete users", category: "User Management" },
        { name: "user.read.own", description: "View own profile", category: "User Management" },
        { name: "role.manage", description: "Manage roles and permissions", category: "Role Management" },
        { name: "dashboard.view", description: "Access dashboard", category: "Dashboard" },
        { name: "reports.view", description: "View reports", category: "Reports" },
        { name: "settings.manage", description: "Manage system settings", category: "Settings" },
        { name: "system.admin", description: "Full system administration access", category: "System" }
      ]);
      console.log('Initial permissions seeded');
    }
  } catch (error) {
    console.error('Error seeding permissions:', error);
  }
};

const Permission = mongoose.model<IPermission>('Permission', PermissionSchema);
export default Permission;