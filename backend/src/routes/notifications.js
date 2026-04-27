const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

// GET /api/notifications
router.get('/', authMiddleware, async (req, res) => {
  const { user_id } = req.user;
  try {
    const studentResult = await pool.query(
      'SELECT student_id, notification_enabled FROM "STUDENT" WHERE user_id = $1',
      [user_id]
    );
    if (!studentResult.rows[0]) return res.status(404).json({ error: 'Student not found' });
    const { student_id, notification_enabled } = studentResult.rows[0];

    if (!notification_enabled) return res.json({ notifications: [], disabled: true });

    const result = await pool.query(
      'SELECT * FROM "NOTIFICATION" WHERE student_id = $1 ORDER BY sent_at DESC LIMIT 50',
      [student_id]
    );
    res.json({ notifications: result.rows, disabled: false });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    await pool.query('UPDATE "NOTIFICATION" SET is_read = TRUE WHERE notif_id = $1', [req.params.id]);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark read' });
  }
});

// DELETE /api/notifications/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM "NOTIFICATION" WHERE notif_id = $1', [req.params.id]);
    res.json({ message: 'Dismissed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to dismiss' });
  }
});

// POST /api/notifications — Admin: broadcast or target
// Body: { message, type, category, student_id? }
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
  const { message, type = 'announcement', category = 'general', student_id } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    if (student_id) {
      await pool.query(
        'INSERT INTO "NOTIFICATION" (student_id, message, type, category) VALUES ($1, $2, $3, $4)',
        [student_id, message, type, category]
      );
    } else {
      const students = await pool.query(
        'SELECT student_id FROM "STUDENT" WHERE notification_enabled = TRUE'
      );
      for (const s of students.rows) {
        await pool.query(
          'INSERT INTO "NOTIFICATION" (student_id, message, type, category) VALUES ($1, $2, $3, $4)',
          [s.student_id, message, type, category]
        );
      }
    }
    res.status(201).json({ message: 'Notification(s) sent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

module.exports = router;
