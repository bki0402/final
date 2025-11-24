const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// 여행 일정 목록 조회
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM trips WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json({ trips: result.rows });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 여행 일정 생성
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('start_date').isISO8601().withMessage('Valid start date required'),
  body('end_date').isISO8601().withMessage('Valid end date required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, start_date, end_date, destinations } = req.body;

    const result = await pool.query(
      `INSERT INTO trips (user_id, title, description, start_date, end_date, destinations)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.userId, title, description || null, start_date, end_date, JSON.stringify(destinations || [])]
    );

    res.status(201).json({ trip: result.rows[0] });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 여행 일정 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM trips WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json({ trip: result.rows[0] });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 여행 일정 수정
router.put('/:id', [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, start_date, end_date, destinations } = req.body;

    // 일정 존재 및 소유권 확인
    const checkResult = await pool.query(
      'SELECT id FROM trips WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // 업데이트할 필드 구성
    const updates = [];
    const values = [];
    let paramCount = 0;

    if (title !== undefined) {
      paramCount++;
      updates.push(`title = $${paramCount}`);
      values.push(title);
    }
    if (description !== undefined) {
      paramCount++;
      updates.push(`description = $${paramCount}`);
      values.push(description);
    }
    if (start_date !== undefined) {
      paramCount++;
      updates.push(`start_date = $${paramCount}`);
      values.push(start_date);
    }
    if (end_date !== undefined) {
      paramCount++;
      updates.push(`end_date = $${paramCount}`);
      values.push(end_date);
    }
    if (destinations !== undefined) {
      paramCount++;
      updates.push(`destinations = $${paramCount}`);
      values.push(JSON.stringify(destinations));
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    paramCount++;
    updates.push(`updated_at = NOW()`);
    paramCount++;
    values.push(id);
    paramCount++;
    values.push(req.user.userId);

    const result = await pool.query(
      `UPDATE trips SET ${updates.join(', ')} 
       WHERE id = $${paramCount - 1} AND user_id = $${paramCount}
       RETURNING *`,
      values
    );

    res.json({ trip: result.rows[0] });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 여행 일정 삭제
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

