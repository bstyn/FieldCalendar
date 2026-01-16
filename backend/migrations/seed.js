const db = require('../config/database');

const seedFootballFields = async () => {
  try {
    console.log('Dodawanie przykładowych boisk...');

    // Sprawdź czy już są jakieś boiska
    const existingFields = await db.query('SELECT COUNT(*) FROM football_fields');
    if (parseInt(existingFields.rows[0].count) > 0) {
      console.log('Boiska już istnieją w bazie danych. Pomijanie seed...');
      return;
    }

    // Dodaj przykładowe boiska
    await db.query(`
      INSERT INTO football_fields (name, description, field_type, surface_type, max_players, hourly_rate, is_active)
      VALUES 
        ('Boisko Główne', 'Pełnowymiarowe boisko ze sztuczną trawą, oświetlenie LED', 'full', 'artificial', 22, 200.00, true),
        ('Boisko Treningowe', 'Połowa boiska, idealne dla mniejszych grup', 'half', 'artificial', 14, 120.00, true),
        ('Orlik', 'Małe boisko do gry 5 na 5', 'small', 'artificial', 10, 80.00, true),
        ('Hala Sportowa', 'Boisko halowe z profesjonalną podłogą', 'small', 'indoor', 10, 150.00, true)
    `);

    console.log('Przykładowe boiska zostały dodane pomyślnie!');
  } catch (error) {
    console.error('Błąd podczas dodawania przykładowych boisk:', error);
    throw error;
  }
};

// Uruchom seed
if (require.main === module) {
  seedFootballFields()
    .then(() => {
      console.log('Seed zakończony pomyślnie');
      process.exit(0);
    })
    .catch(err => {
      console.error('Seed nie powiódł się:', err);
      process.exit(1);
    });
}

module.exports = { seedFootballFields };
