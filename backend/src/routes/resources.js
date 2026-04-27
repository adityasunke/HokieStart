const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

async function getStudentId(user_id) {
  const r = await pool.query('SELECT student_id FROM "STUDENT" WHERE user_id = $1', [user_id]);
  return r.rows[0]?.student_id || null;
}

async function getAdminId(user_id) {
  const r = await pool.query('SELECT admin_id FROM "ADMIN" WHERE user_id = $1', [user_id]);
  return r.rows[0]?.admin_id || null;
}

// ─── RESOURCES ────────────────────────────────────────────────

// GET /api/resources
// ?search=keyword  ?category=academic
router.get('/', authMiddleware, async (req, res) => {
  const { search, category } = req.query;
  const { user_id } = req.user;

  try {
    let query = `
      SELECT r.*,
        CASE WHEN b.bookmark_id IS NOT NULL THEN true ELSE false END AS is_bookmarked
      FROM "RESOURCE" r
      LEFT JOIN "BOOKMARK" b
        ON b.resource_id = r.resource_id
        AND b.student_id = (SELECT student_id FROM "STUDENT" WHERE user_id = $1)
      WHERE 1=1
    `;
    const params = [user_id];
    let i = 2;

    if (search) {
      query += ` AND (LOWER(r.title) LIKE LOWER($${i}) OR LOWER(r.description) LIKE LOWER($${i}))`;
      params.push(`%${search}%`);
      i++;
    }
    if (category) {
      query += ` AND r.category = $${i}`;
      params.push(category);
      i++;
    }

    query += ' ORDER BY r.title ASC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// GET /api/resources/categories
router.get('/categories', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM "RESOURCE" WHERE category IS NOT NULL ORDER BY category');
    res.json(result.rows.map(r => r.category));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/resources/bookmarks/all
router.get('/bookmarks/all', authMiddleware, async (req, res) => {
  const { user_id } = req.user;
  try {
    const student_id = await getStudentId(user_id);
    if (!student_id) return res.status(404).json({ error: 'Student not found' });
    const result = await pool.query(
      `SELECT r.*, b.bookmark_id, b.saved_at, true AS is_bookmarked
       FROM "BOOKMARK" b
       JOIN "RESOURCE" r ON r.resource_id = b.resource_id
       WHERE b.student_id = $1
       ORDER BY b.saved_at DESC`,
      [student_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

// GET /api/resources/:id
router.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.user;
  try {
    const result = await pool.query(
      `SELECT r.*,
        CASE WHEN b.bookmark_id IS NOT NULL THEN true ELSE false END AS is_bookmarked
       FROM "RESOURCE" r
       LEFT JOIN "BOOKMARK" b
         ON b.resource_id = r.resource_id
         AND b.student_id = (SELECT student_id FROM "STUDENT" WHERE user_id = $2)
       WHERE r.resource_id = $1`,
      [id, user_id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
});

// POST /api/resources — Admin only
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
  const { title, url, description, category } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  try {
    const admin_id = await getAdminId(req.user.user_id);
    const result = await pool.query(
      'INSERT INTO "RESOURCE" (admin_id, title, url, description, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [admin_id, title, url, description, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create resource' });
  }
});

// PATCH /api/resources/:id — Admin only
router.patch('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
  const { title, url, description, category } = req.body;
  try {
    const result = await pool.query(
      `UPDATE "RESOURCE"
       SET title = COALESCE($1, title),
           url = COALESCE($2, url),
           description = COALESCE($3, description),
           category = COALESCE($4, category)
       WHERE resource_id = $5 RETURNING *`,
      [title, url, description, category, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

// DELETE /api/resources/:id — Admin only
router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
  try {
    await pool.query('DELETE FROM "RESOURCE" WHERE resource_id = $1', [req.params.id]);
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

// ─── BOOKMARKS ────────────────────────────────────────────────

// POST /api/resources/bookmarks/:resource_id
router.post('/bookmarks/:resource_id', authMiddleware, async (req, res) => {
  const { user_id } = req.user;
  const { resource_id } = req.params;
  try {
    const student_id = await getStudentId(user_id);
    if (!student_id) return res.status(404).json({ error: 'Student not found' });
    await pool.query(
      'INSERT INTO "BOOKMARK" (student_id, resource_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [student_id, resource_id]
    );
    res.status(201).json({ message: 'Bookmarked' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to bookmark' });
  }
});

// DELETE /api/resources/bookmarks/:resource_id
router.delete('/bookmarks/:resource_id', authMiddleware, async (req, res) => {
  const { user_id } = req.user;
  const { resource_id } = req.params;
  try {
    const student_id = await getStudentId(user_id);
    await pool.query(
      'DELETE FROM "BOOKMARK" WHERE student_id = $1 AND resource_id = $2',
      [student_id, resource_id]
    );
    res.json({ message: 'Bookmark removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove bookmark' });
  }
});

module.exports = router;
