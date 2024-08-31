require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cors = require('cors');
const crypto = require('crypto');

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

const authenticateToken = (requiredRole) => (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/protected', authenticateToken(), (req, res) => {
  res.json({ user: req.user });
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

app.get('/analytics', async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const { rows } = await pool.query(
      'SELECT org, seller, grand_total, sale_date FROM sales WHERE sale_date BETWEEN $1 AND $2',
      [startDate, endDate]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching sales data', error);
    res.status(500).send('Server error');
  }
});

app.get('/inventory', async (req, res) => {
  const { endDate } = req.query;
  try {
    const { rows } = await pool.query('SELECT ROW_NUMBER() OVER (ORDER BY org, name) AS id, org, name, SUM(qtyavailable) AS total_qtyavailable, TO_CHAR(MAX(reception_date), \'DD-MM-YYYY\') AS reception_date FROM products WHERE reception_date::DATE <= $1  GROUP BY org, name',
    [endDate] 
  );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products data', error);
    res.status(500).send('Server error');
  }
});


app.get('/users', authenticateToken(1), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/users', async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password, role_id) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, role || 'user']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.put('/users/:id', authenticateToken(1), async (req, res) => {
  const { id } = req.params;
  const { username, role } = req.body;
  try {
    const result = await pool.query('UPDATE users SET username = $1, role_id = $2 WHERE id = $3 RETURNING *', [username, role, id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/users/:id', authenticateToken(1), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/roles', authenticateToken(1), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM role');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/roles', authenticateToken(1), async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query('INSERT INTO role (name) VALUES ($1) RETURNING *', [name]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/roles/:id', authenticateToken(1), async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await pool.query('UPDATE role SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/roles/:id', authenticateToken(1), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM role WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

