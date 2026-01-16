const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const db = require("../config/database");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// All admin routes require authentication and admin role
router.use(authMiddleware, adminMiddleware);

// Get all reservations (admin view)
router.get("/reservations", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT r.*, u.name as user_name, u.email as user_email, f.name as field_name
      FROM reservations r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN football_fields f ON r.field_id = f.id
      ORDER BY r.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Admin get reservations error:", error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

// Manage football fields
router.get("/fields", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM football_fields ORDER BY name ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get fields error:", error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

router.post(
  "/fields",
  [
    body("name").notEmpty().withMessage("Nazwa jest wymagana"),
    body("field_type").notEmpty().withMessage("Typ boiska jest wymagany"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        name,
        description,
        field_type,
        surface_type,
        max_players,
        hourly_rate,
      } = req.body;

      const result = await db.query(
        `INSERT INTO football_fields (name, description, field_type, surface_type, max_players, hourly_rate)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [name, description, field_type, surface_type, max_players, hourly_rate]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Create field error:", error);
      res.status(500).json({ error: "Błąd serwera" });
    }
  }
);

router.put("/fields/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      field_type,
      surface_type,
      max_players,
      hourly_rate,
      is_active,
    } = req.body;

    const result = await db.query(
      `UPDATE football_fields 
       SET name = $1, description = $2, field_type = $3, surface_type = $4, 
           max_players = $5, hourly_rate = $6, is_active = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 RETURNING *`,
      [
        name,
        description,
        field_type,
        surface_type,
        max_players,
        hourly_rate,
        is_active,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Boisko nie znalezione" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update field error:", error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

router.delete("/fields/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "DELETE FROM football_fields WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Boisko nie znalezione" });
    }

    res.json({ message: "Boisko usunięte pomyślnie" });
  } catch (error) {
    console.error("Delete field error:", error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

// Create calendar event
router.post(
  "/calendar",
  [
    body("title").notEmpty().withMessage("Tytuł jest wymagany"),
    body("start_date").notEmpty().withMessage("Data rozpoczęcia jest wymagana"),
    body("end_date").notEmpty().withMessage("Data zakończenia jest wymagana"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, start_date, end_date, event_type, field_id } =
        req.body;

      const result = await db.query(
        `INSERT INTO calendar_events (title, description, start_date, end_date, event_type, field_id, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          title,
          description,
          start_date,
          end_date,
          event_type || "available",
          field_id,
          req.user.id,
        ]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Create calendar event error:", error);
      res.status(500).json({ error: "Błąd serwera" });
    }
  }
);

// Update calendar event
router.put(
  "/calendar/:id",
  [
    body("title").notEmpty().withMessage("Tytuł jest wymagany"),
    body("start_date").notEmpty().withMessage("Data rozpoczęcia jest wymagana"),
    body("end_date").notEmpty().withMessage("Data zakończenia jest wymagana"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { title, description, start_date, end_date, event_type, field_id } =
        req.body;

      const result = await db.query(
        `UPDATE calendar_events 
         SET title = $1, description = $2, start_date = $3, end_date = $4, event_type = $5, field_id = $6, updated_at = CURRENT_TIMESTAMP
         WHERE id = $7 RETURNING *`,
        [title, description, start_date, end_date, event_type, field_id, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Wydarzenie nie znalezione" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Update calendar event error:", error);
      res.status(500).json({ error: "Błąd serwera" });
    }
  }
);

// Delete calendar event
router.delete("/calendar/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if there are any reservations for this event
    const reservations = await db.query(
      "SELECT * FROM reservations WHERE event_id = $1 AND status IN ($2, $3)",
      [id, "pending", "confirmed"]
    );

    if (reservations.rows.length > 0) {
      return res.status(400).json({
        error: "Cannot delete event with active reservations",
        reservationCount: reservations.rows.length,
      });
    }

    const result = await db.query(
      "DELETE FROM calendar_events WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete calendar event error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get statistics
router.get("/stats", async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM reservations WHERE status = 'pending') as pending_count,
        (SELECT COUNT(*) FROM reservations WHERE status = 'confirmed') as confirmed_count,
        (SELECT COUNT(*) FROM reservations WHERE status = 'cancelled') as cancelled_count,
        (SELECT COUNT(*) FROM calendar_events) as total_events,
        (SELECT COUNT(*) FROM users) as total_users
    `);

    res.json(stats.rows[0]);
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
