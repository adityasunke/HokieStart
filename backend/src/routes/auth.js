const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, role = 'student', name, major, graduation_year } = req.body;
  if (!email.endsWith('@vt.edu')) {
    return res.status(400).json({ error: 'Must use a valid @vt.edu email address' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query('SELECT user_id FROM "USER" WHERE email = $1', [email]);
    if (existing.rows.length > 0) return res.status(409).json({ error: 'Email already registered' });
    const password_hash = await bcrypt.hash(password, 12);
    const userResult = await client.query(
      'INSERT INTO "USER" (email, password_hash, role) VALUES ($1, $2, $3) RETURNING user_id',
      [email, password_hash, role]
    );
    const user_id = userResult.rows[0].user_id;
    if (role === 'student') {
      await client.query(
        'INSERT INTO "STUDENT" (user_id, name, major, graduation_year) VALUES ($1, $2, $3, $4)',
        [user_id, name, major, graduation_year]
      );
    } else {
      await client.query('INSERT INTO "ADMIN" (user_id, name) VALUES ($1, $2)', [user_id, name]);
    }
    await client.query('COMMIT');
    const token = jwt.sign({ user_id, email, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query('INSERT INTO "SESSION" (user_id, token, expires_at) VALUES ($1, $2, $3)', [user_id, token, expires_at]);
    res.status(201).json({ token, user_id, role, email });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  } finally {
    client.release();
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM "USER" WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ user_id: user.user_id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query('INSERT INTO "SESSION" (user_id, token, expires_at) VALUES ($1, $2, $3)', [user.user_id, token, expires_at]);
    res.json({ token, user_id: user.user_id, role: user.role, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) await pool.query('DELETE FROM "SESSION" WHERE token = $1', [token]);
  res.json({ message: 'Logged out' });
});

module.exports = router;
