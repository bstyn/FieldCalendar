-- Dane przykładowe dla Boisk Piłkarskich
-- Uruchom ten plik ПОСЛЕ schema.sql

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

-- Komunikat o sukcesie
DO $$
BEGIN
  RAISE NOTICE 'Dane przykładowe załadowane pomyślnie!';
END $$;
