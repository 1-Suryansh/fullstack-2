// Mock user database (Experiment 1.3.1)
// A real app never stores plain passwords - it stores a bcrypt hash.

export const USERS = [
  { id: 1, name: "Aditi Sharma", email: "admin@app.com",  password: "admin123",  role: "admin"  },
  { id: 2, name: "Rohit Verma",  email: "editor@app.com", password: "editor123", role: "editor" },
  { id: 3, name: "Neha Gupta",   email: "viewer@app.com", password: "viewer123", role: "viewer" },
];
