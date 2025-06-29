import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface AuthRequest extends Request {
  userId?: number;
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

// Mock data with hashed passwords
const users: User[] = [
  { id: 1, name: "Vamsee Kalyan", email: "vamsee@example.com", password: bcrypt.hashSync("password123", 10) },
  { id: 2, name: "Krishna Sukanya", email: "krishna@example.com", password: bcrypt.hashSync("password123", 10) },
];

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
app.post("/api/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// Protected routes
app.get("/api/users", authenticateToken, (req: AuthRequest, res: Response) => {
  const publicUsers = users.map(({ password, ...user }) => user);
  res.json(publicUsers);
});

app.get("/api/dashboard", authenticateToken, (req: AuthRequest, res: Response) => {
  const user = users.find(u => u.id === req.userId);
  res.json({ message: `Welcome to dashboard, ${user?.name}!`, stats: { totalUsers: users.length } });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
