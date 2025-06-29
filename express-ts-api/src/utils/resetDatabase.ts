import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import { seedPermissions } from '../permissions/PermissionModel';
import { seedRoles } from '../roles/RoleModel';
import { seedUsers } from '../user/UserModel';

export const resetDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
      console.log('Database cleared');
    }
    
    // Reseed in correct order
    await seedPermissions();
    await seedRoles();
    await seedUsers();
    
    console.log('Database reset and reseeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  resetDatabase();
}