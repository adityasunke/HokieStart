const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

// GET /api/profile/me
router.get('/me', authMiddleware, async (req, res) => {
  const { user_id, role } = req.user;
  try {
    const userResult = await pool.query(
      'SELECT user_id, email, role, is_verified, created_at FROM "USER" WHERE user_id = $1',
      [user_id]
    );
    if (role === 'student') {
      const profileResult = await pool.query('SELECT * FROM "STUDENT" WHERE user_id = $1', [user_id]);
      return res.json({ ...userResult.rows[0], profile: profileResult.rows[0] });
    } else {
      const profileResult = await pool.query('SELECT * FROM "ADMIN" WHERE user_id = $1', [user_id]);
      return res.json({ ...userResult.rows[0], profile: profileResult.rows[0] });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PATCH /api/profile/update
router.patch('/update', authMiddleware, async (req, res) => {
  const { user_id } = req.user;
  const { name, major, graduation_year, display_name, profile_photo_url, notification_enabled } = req.body;
  try {
    const result = await pool.query(
      `UPDATE "STUDENT"
       SET name = COALESCE($1, name),
           major = COALESCE($2, major),
           graduation_year = COALESCE($3, graduation_year),
           display_name = COALESCE($4, display_name),
           profile_photo_url = COALESCE($5, profile_photo_url),
           notification_enabled = COALESCE($6, notification_enabled)
       WHERE user_id = $7 RETURNING *`,
      [name, major, graduation_year, display_name, profile_photo_url, notification_enabled, user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Profile update failed' });
  }
});

module.exports = router;
