import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

interface User {
  id: number;
  name: string;
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Error handler
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
};

// Mock data
const users: User[] = [
  { id: 1, name: "Vamsee Kalyan" },
  { id: 2, name: "Krishna Sukanya" },
];

// Routes
app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express API!" });
});

app.get("/api/users", (req: Request, res: Response) => {
  res.json(users);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
