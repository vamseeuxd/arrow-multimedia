import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { connectDB } from "./config/database";
import { seedUsers } from "./user/UserModel";
import { seedRoles } from "./roles/RoleModel";
import { seedPermissions } from "./permissions/PermissionModel";
import authRoutes from "./auth/authRoutes";
import userRoutes from "./user/userRoutes";
import dashboardRoutes from "./dashboard/dashboardRoutes";
import roleRoutes from "./roles/roleRoutes";
import permissionRoutes from "./permissions/permissionRoutes";

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Initialize database connection
connectDB();

// Seed in correct order: Permissions -> Roles -> Users
const initializeData = async () => {
  await seedPermissions();
  await seedRoles();
  await seedUsers();
};
initializeData();

// Error handler
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
};

// Routes
app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express API!" });
});

app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
