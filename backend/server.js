require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(express.json());

app.post('/admin/users', async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, role || 'user']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ message: 'Usuario o Contraseña Invalido' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Usuario o Contraseña Invalido' });
    }
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { username: user.username, id: user.id, role: user.role_id } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/roles', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM role');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

/// CRUD para los usuarios (solo para admin)
app.get('/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 1) return res.sendStatus(403); // Admin role ID is 1
  try {
    const result = await pool.query('SELECT users.id, users.username, role.name as role FROM users JOIN role ON users.role_id = role.id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/users/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 1) return res.sendStatus(403); // Admin role ID is 1
  const { id } = req.params;
  const { username, role_id } = req.body;
  try {
    const result = await pool.query('UPDATE users SET username = $1, role_id = $2 WHERE id = $3 RETURNING *', [username, role_id, id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/users/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 1) return res.sendStatus(403); // Admin role ID is 1
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});