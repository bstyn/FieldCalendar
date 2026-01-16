const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all football fields
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM football_fields WHERE is_active = true ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get football fields error:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// Get single football field
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM football_fields WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Boisko nie znalezione' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get football field error:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

module.exports = router;
