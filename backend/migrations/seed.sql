-- Dane przykładowe dla Boisk Piłkarskich
-- Uruchom ten plik ПОСЛЕ schema.sql

-- Dodaj użytkownika administratora (hasło: admin123)
INSERT INTO users (name, email, password, role)
VALUES 
  (
    'Administrator',
    'admin@example.com',
    '$2a$10$XGYxmlMZOdqj.fofwdApi.JLJIHjC5hSMQ.hNT9tz4hY7uCIlxqzW',
    'admin'
  )
ON CONFLICT (email) DO NOTHING;

-- Dodaj użytkownika testowego (hasło: user123)
INSERT INTO users (name, email, password, role)
VALUES 
  (
    'Jan Kowalski',
    'user@example.com',
    '$2a$10$72W2gNDrNh6N8EhXgLsSsejBf3Ib/ljpFKPZ0br9VAuQVIfmNs/S.',
    'user'
  )
ON CONFLICT (email) DO NOTHING;

-- Dodaj 4 przykładowe boiska
INSERT INTO football_fields (name, description, field_type, surface_type, max_players, hourly_rate, is_active)
VALUES 
  (
    'Boisko Główne',
    'Pełnowymiarowe boisko piłkarskie ze sztuczną nawierzchnią, oświetlenie LED, trybuna dla kibiców',
    'full',
    'artificial',
    22,
    200.00,
    true
  ),
  (
    'Boisko Treningowe',
    'Połowa standardowego boiska, idealne na treningi i małe turnieje',
    'half',
    'artificial',
    14,
    120.00,
    true
  ),
  (
    'Orlik',
    'Małe boisko 5v5, powierzchnia sztuczna trawa, piłkochwyty',
    'small',
    'artificial',
    10,
    80.00,
    true
  ),
  (
    'Hala Sportowa',
    'Boisko halowe, nawierzchnia parkiet, dostępne przez cały rok',
    'small',
    'indoor',
    10,
    150.00,
    true
  )
ON CONFLICT DO NOTHING;

-- Dodaj wydarzenia kalendarzowe (dostępne sloty) dla następnych 30 dni
-- Dla każdego boiska, tworzymy sloty co godzinę od 8:00 do 22:00
DO $$
DECLARE
  field_record RECORD;
  day_offset INT;
  hour_slot INT;
  start_time TIMESTAMP;
  end_time TIMESTAMP;
BEGIN
  -- Dla każdego boiska
  FOR field_record IN SELECT id FROM football_fields LOOP
    -- Dla następnych 30 dni
    FOR day_offset IN 0..29 LOOP
      -- Dla każdej godziny od 8:00 do 21:00 (sloty godzinowe)
      FOR hour_slot IN 8..21 LOOP
        start_time := (CURRENT_DATE + day_offset * INTERVAL '1 day') + (hour_slot * INTERVAL '1 hour');
        end_time := start_time + INTERVAL '1 hour';
        
        INSERT INTO calendar_events (field_id, title, description, start_date, end_date, event_type, created_by)
        VALUES (
          field_record.id,
          'Dostępne',
          'Slot dostępny do rezerwacji',
          start_time,
          end_time,
          'available',
          (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
        );
      END LOOP;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Wydarzenia kalendarzowe utworzone dla następnych 30 dni!';
END $$;

-- Komunikat o sukcesie
DO $$
BEGIN
  RAISE NOTICE 'Dane przykładowe załadowane pomyślnie!';
  RAISE NOTICE 'Login administratora: admin@example.com / hasło: admin123';
  RAISE NOTICE 'Login użytkownika: user@example.com / hasło: user123';
END $$;
