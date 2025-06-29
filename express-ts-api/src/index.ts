import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/database";
import User, { IUser } from "./models/User";

interface AuthRequest extends Request {
  userId?: string;
}

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Error handler
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
};

// Initialize database connection
connectDB();

// Seed initial users if needed
const seedUsers = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create([
        { name: "Vamsee Kalyan", email: "vamsee@example.com", password: bcrypt.hashSync("password123", 10) },
        { name: "Krishna Sukanya", email: "krishna@example.com", password: bcrypt.hashSync("password123", 10) }
      ]);
      console.log('Initial users seeded');
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};
seedUsers();

// Auth middleware
const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    req.userId = decoded.userId;
    next();
  });
};

// Routes
app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express API!" });
});

// Auth routes
app.post("/api/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Protected routes
app.get("/api/users", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/dashboard", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    const totalUsers = await User.countDocuments();
    res.json({ message: `Welcome to dashboard, ${user?.name}!`, stats: { totalUsers } });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
