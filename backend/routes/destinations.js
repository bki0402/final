const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// 여행지 목록 조회
router.get('/', async (req, res) => {
  try {
    const { limit = 20, offset = 0, category } = req.query;
    let query = 'SELECT * FROM destinations WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    res.json({ destinations: result.rows });
  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 여행지 검색
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const result = await pool.query(
      `SELECT * FROM destinations 
       WHERE name ILIKE $1 OR description ILIKE $1 OR location ILIKE $1
       ORDER BY created_at DESC`,
      [`%${q}%`]
    );

    res.json({ destinations: result.rows });
  } catch (error) {
    console.error('Search destinations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 여행지 상세 정보
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM destinations WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    res.json({ destination: result.rows[0] });
  } catch (error) {
    console.error('Get destination error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

