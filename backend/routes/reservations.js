const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const { sendConfirmationEmail, sendCancellationEmail } = require('../utils/email');

// Create reservation (public - no auth required)
router.post('/',
  [
    body('guest_name').notEmpty().withMessage('Name is required'),
    body('guest_email').isEmail().withMessage('Valid email is required'),
    body('start_time').notEmpty().withMessage('Start time is required'),
    body('end_time').notEmpty().withMessage('End time is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { guest_name, guest_email, guest_phone, start_time, end_time, notes, event_id, field_id, number_of_players } = req.body;

      // Check for conflicting reservations
      const conflicts = await db.query(
        `SELECT * FROM reservations 
         WHERE status IN ('pending', 'confirmed')
         AND field_id = $1
         AND (
           (start_time <= $2 AND end_time > $2) OR
           (start_time < $3 AND end_time >= $3) OR
           (start_time >= $2 AND end_time <= $3)
         )`,
        [field_id, start_time, end_time]
      );

      if (conflicts.rows.length > 0) {
        return res.status(409).json({ error: 'Ten termin jest już zarezerwowany' });
      }

      // Create reservation
      const result = await db.query(
        `INSERT INTO reservations 
         (guest_name, guest_email, guest_phone, start_time, end_time, notes, event_id, field_id, number_of_players, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [guest_name, guest_email, guest_phone, start_time, end_time, notes, event_id, field_id, number_of_players, 'pending']
      );

      const reservation = result.rows[0];

      // Send confirmation email
      try {
        await sendConfirmationEmail(guest_email, reservation);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Continue even if email fails
      }

      res.status(201).json(reservation);
    } catch (error) {
      console.error('Create reservation error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Get all reservations (requires auth)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, start, end } = req.query;
    
    let query = 'SELECT * FROM reservations WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (start) {
      query += ` AND end_time >= $${paramCount}`;
      params.push(start);
      paramCount++;
    }

    if (end) {
      query += ` AND start_time <= $${paramCount}`;
      params.push(end);
      paramCount++;
    }

    query += ' ORDER BY start_time ASC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single reservation
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM reservations WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get reservation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update reservation status (requires auth)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const confirmedAt = status === 'confirmed' ? new Date() : null;
    
    const result = await db.query(
      'UPDATE reservations SET status = $1, confirmed_at = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [status, confirmedAt, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const reservation = result.rows[0];

    // Send email notification
    try {
      if (status === 'confirmed') {
        await sendConfirmationEmail(reservation.guest_email, reservation);
      } else if (status === 'cancelled') {
        await sendCancellationEmail(reservation.guest_email, reservation);
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.json(reservation);
  } catch (error) {
    console.error('Update reservation status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete reservation (requires auth)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query('DELETE FROM reservations WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error('Delete reservation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
