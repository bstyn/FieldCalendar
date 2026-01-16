const db = require("../config/database");

const createTables = async () => {
  try {
    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Football fields table
    await db.query(`
      CREATE TABLE IF NOT EXISTS football_fields (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        field_type VARCHAR(50) DEFAULT 'full',
        surface_type VARCHAR(50) DEFAULT 'artificial',
        max_players INTEGER DEFAULT 22,
        hourly_rate DECIMAL(10, 2),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Calendar events table (time slots for fields)
    await db.query(`
      CREATE TABLE IF NOT EXISTS calendar_events (
        id SERIAL PRIMARY KEY,
        field_id INTEGER REFERENCES football_fields(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        event_type VARCHAR(50) DEFAULT 'available',
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Reservations table
    await db.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        field_id INTEGER REFERENCES football_fields(id),
        user_id INTEGER REFERENCES users(id),
        event_id INTEGER REFERENCES calendar_events(id),
        guest_name VARCHAR(255) NOT NULL,
        guest_email VARCHAR(255) NOT NULL,
        guest_phone VARCHAR(50),
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        number_of_players INTEGER,
        confirmed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_calendar_dates ON calendar_events(start_date, end_date);
      CREATE INDEX IF NOT EXISTS idx_calendar_field ON calendar_events(field_id);
      CREATE INDEX IF NOT EXISTS idx_reservation_status ON reservations(status);
      CREATE INDEX IF NOT EXISTS idx_reservation_dates ON reservations(start_time, end_time);
      CREATE INDEX IF NOT EXISTS idx_reservation_field ON reservations(field_id);
    `);

    console.log("Database tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
};

// Run migrations
if (require.main === module) {
  createTables()
    .then(() => {
      console.log("Migration completed");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Migration failed:", err);
      process.exit(1);
    });
}

module.exports = { createTables };
