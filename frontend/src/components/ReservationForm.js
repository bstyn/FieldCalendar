import React, { useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

const ReservationForm = ({ selectedDate, selectedField, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    start_time: '',
    end_time: '',
    number_of_players: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Combine date with time
      const startDateTime = new Date(selectedDate);
      const [startHour, startMinute] = formData.start_time.split(':');
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0);

      const endDateTime = new Date(selectedDate);
      const [endHour, endMinute] = formData.end_time.split(':');
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

      const reservationData = {
        field_id: selectedField.id,
        guest_name: formData.guest_name,
        guest_email: formData.guest_email,
        guest_phone: formData.guest_phone,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        number_of_players: formData.number_of_players ? parseInt(formData.number_of_players) : null,
        notes: formData.notes
      };

      await axios.post('/api/reservations', reservationData);
      alert('Rezerwacja utworzona pomyślnie! Sprawdź swój email w celu potwierdzenia.');
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Nie udało się utworzyć rezerwacji');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Rezerwacja Boiska</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <p><strong>Boisko:</strong> {selectedField.name}</p>
          <p><strong>Data:</strong> {format(selectedDate, 'd MMMM yyyy', { locale: pl })}</p>
          {selectedField.hourly_rate && (
            <p><strong>Cena:</strong> {selectedField.hourly_rate} PLN/godz.</p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Twoje Imię i Nazwisko *</label>
            <input
              type="text"
              name="guest_name"
              value={formData.guest_name}
              onChange={handleChange}
              required
              placeholder="Jan Kowalski"
            />
          </div>

          <div className="form-group">
            <label>Adres Email *</label>
            <input
              type="email"
              name="guest_email"
              value={formData.guest_email}
              onChange={handleChange}
              required
              placeholder="jan@example.com"
            />
          </div>

          <div className="form-group">
            <label>Numer Telefonu *</label>
            <input
              type="tel"
              name="guest_phone"
              value={formData.guest_phone}
              onChange={handleChange}
              required
              placeholder="+48 123 456 789"
            />
          </div>

          <div className="form-group">
            <label>Godzina Rozpoczęcia *</label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Godzina Zakończenia *</label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Liczba Graczy</label>
            <input
              type="number"
              name="number_of_players"
              value={formData.number_of_players}
              onChange={handleChange}
              min="1"
              max={selectedField.max_players || 22}
              placeholder={`Maksymalnie ${selectedField.max_players || 22}`}
            />
          </div>

          <div className="form-group">
            <label>Dodatkowe Uwagi</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Dodatkowe informacje lub specjalne życzenia..."
            />
          </div>

          {error && <div className="error">{error}</div>}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button 
              type="submit" 
              className="button button-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Wysyłanie...' : 'Zarezerwuj'}
            </button>
            <button 
              type="button" 
              className="button button-secondary"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
