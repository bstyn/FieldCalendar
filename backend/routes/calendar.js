const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { authMiddleware } = require("../middleware/auth");

// Get calendar events (public)
router.get("/", async (req, res) => {
  try {
    const { start, end, type } = req.query;

    let query = "SELECT * FROM calendar_events WHERE 1=1";
    const params = [];
    let paramCount = 1;

    if (start) {
      query += ` AND end_date >= $${paramCount}`;
      params.push(start);
      paramCount++;
    }

    if (end) {
      query += ` AND start_date <= $${paramCount}`;
      params.push(end);
      paramCount++;
    }

    if (type) {
      query += ` AND event_type = $${paramCount}`;
      params.push(type);
      paramCount++;
    }

    query += " ORDER BY start_date ASC";

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Get calendar events error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single event
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "SELECT * FROM calendar_events WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get available slots
router.get("/available/slots", async (req, res) => {
  try {
    const { date, field_id } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Parametr daty jest wymagany" });
    }

    // Get available events for the date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    let eventsQuery = `
      SELECT ce.*, ff.name as field_name 
      FROM calendar_events ce
      LEFT JOIN football_fields ff ON ce.field_id = ff.id
      WHERE ce.event_type = 'available' 
      AND ce.start_date >= $1 AND ce.end_date <= $2
    `;
    const params = [startOfDay, endOfDay];

    if (field_id) {
      eventsQuery += ` AND ce.field_id = $3`;
      params.push(field_id);
    }

    eventsQuery += " ORDER BY ce.start_date ASC";

    const eventsResult = await db.query(eventsQuery, params);

    // Get reservations for the date
    let reservationsQuery = `
      SELECT r.*, ff.name as field_name 
      FROM reservations r
      LEFT JOIN football_fields ff ON r.field_id = ff.id
      WHERE r.status IN ('pending', 'confirmed')
      AND r.start_time >= $1 AND r.end_time <= $2
    `;
    const resParams = [startOfDay, endOfDay];

    if (field_id) {
      reservationsQuery += ` AND r.field_id = $3`;
      resParams.push(field_id);
    }

    const reservationsResult = await db.query(reservationsQuery, resParams);

    res.json({
      events: eventsResult.rows,
      reservations: reservationsResult.rows,
    });
  } catch (error) {
    console.error("Get available slots error:", error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

module.exports = router;
