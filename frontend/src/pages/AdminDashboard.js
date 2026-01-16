import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, getAuthHeader } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reservations');
  const [reservations, setReservations] = useState([]);
  const [events, setEvents] = useState([]);
  const [fields, setFields] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showFieldForm, setShowFieldForm] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeader();
      
      const [reservationsRes, eventsRes, fieldsRes, statsRes] = await Promise.all([
        axios.get('/api/admin/reservations', { headers }),
        axios.get('/api/calendar', { headers }),
        axios.get('/api/admin/fields', { headers }),
        axios.get('/api/admin/stats', { headers })
      ]);

      setReservations(reservationsRes.data);
      setEvents(eventsRes.data);
      setFields(fieldsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Błąd ładowania danych:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      const headers = getAuthHeader();
      await axios.patch(
        `/api/reservations/${reservationId}/status`,
        { status: newStatus },
        { headers }
      );
      loadData();
      alert('Status rezerwacji został zaktualizowany');
    } catch (error) {
      alert('Nie udało się zaktualizować statusu rezerwacji');
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę rezerwację?')) {
      return;
    }

    try {
      const headers = getAuthHeader();
      await axios.delete(`/api/reservations/${reservationId}`, { headers });
      loadData();
      alert('Rezerwacja została usunięta');
    } catch (error) {
      alert('Nie udało się usunąć rezerwacji');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to wydarzenie?')) {
      return;
    }

    try {
      const headers = getAuthHeader();
      await axios.delete(`/api/admin/calendar/${eventId}`, { headers });
      loadData();
      alert('Wydarzenie zostało usunięte');
    } catch (error) {
      alert(error.response?.data?.error || 'Nie udało się usunąć wydarzenia');
    }
  };

  const handleDeleteField = async (fieldId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to boisko?')) {
      return;
    }

    try {
      const headers = getAuthHeader();
      await axios.delete(`/api/admin/fields/${fieldId}`, { headers });
      loadData();
      alert('Boisko zostało usunięte');
    } catch (error) {
      alert(error.response?.data?.error || 'Nie udało się usunąć boiska');
    }
  };

  if (loading && reservations.length === 0) {
    return <div className="loading">Ładowanie...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Panel Administratora</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div style={{ padding: '20px', backgroundColor: '#ffc107', borderRadius: '8px', textAlign: 'center' }}>
            <h3>{stats.pending_count || 0}</h3>
            <p>Oczekujące Rezerwacje</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#28a745', borderRadius: '8px', textAlign: 'center', color: 'white' }}>
            <h3>{stats.confirmed_count || 0}</h3>
            <p>Potwierdzone</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#007bff', borderRadius: '8px', textAlign: 'center', color: 'white' }}>
            <h3>{stats.total_events || 0}</h3>
            <p>Wydarzenia</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#6c757d', borderRadius: '8px', textAlign: 'center', color: 'white' }}>
            <h3>{stats.total_users || 0}</h3>
            <p>Użytkownicy</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ borderBottom: '2px solid #ddd', marginBottom: '20px' }}>
          <button
            className={`button ${activeTab === 'reservations' ? 'button-primary' : 'button-secondary'}`}
            onClick={() => setActiveTab('reservations')}
            style={{ marginRight: '10px' }}
          >
            Rezerwacje
          </button>
          <button
            className={`button ${activeTab === 'events' ? 'button-primary' : 'button-secondary'}`}
            onClick={() => setActiveTab('events')}
            style={{ marginRight: '10px' }}
          >
            Kalendarz
          </button>
          <button
            className={`button ${activeTab === 'fields' ? 'button-primary' : 'button-secondary'}`}
            onClick={() => setActiveTab('fields')}
          >
            Boiska
          </button>
        </div>

        {activeTab === 'reservations' && (
          <div>
            <h2>Wszystkie Rezerwacje</h2>
            {reservations.length === 0 ? (
              <p>Brak rezerwacji.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Boisko</th>
                      <th>Gość</th>
                      <th>Email</th>
                      <th>Telefon</th>
                      <th>Data i Czas</th>
                      <th>Gracze</th>
                      <th>Status</th>
                      <th>Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map(reservation => (
                      <tr key={reservation.id}>
                        <td>{reservation.id}</td>
                        <td>{reservation.field_name || 'Nie przypisano'}</td>
                        <td>{reservation.guest_name}</td>
                        <td>{reservation.guest_email}</td>
                        <td>{reservation.guest_phone || '-'}</td>
                        <td>
                          {format(new Date(reservation.start_time), 'd MMM yyyy HH:mm', { locale: pl })}
                          <br />
                          do {format(new Date(reservation.end_time), 'HH:mm')}
                        </td>
                        <td>{reservation.number_of_players || '-'}</td>
                        <td>
                          <span className={`badge badge-${reservation.status}`}>
                            {reservation.status === 'confirmed' ? 'Potwierdzona' : 
                             reservation.status === 'pending' ? 'Oczekująca' : 'Anulowana'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                            {reservation.status === 'pending' && (
                              <button
                                className="button button-success"
                                style={{ padding: '5px 10px', fontSize: '12px' }}
                                onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                              >
                                Potwierdź
                              </button>
                            )}
                            {reservation.status !== 'cancelled' && (
                              <button
                                className="button button-danger"
                                style={{ padding: '5px 10px', fontSize: '12px' }}
                                onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                              >
                                Anuluj
                              </button>
                            )}
                            <button
                              className="button button-secondary"
                              style={{ padding: '5px 10px', fontSize: '12px' }}
                              onClick={() => handleDeleteReservation(reservation.id)}
                            >
                              Usuń
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Wydarzenia Kalendarzowe</h2>
              <button
                className="button button-primary"
                onClick={() => setShowEventForm(true)}
              >
                Dodaj Nowe Wydarzenie
              </button>
            </div>

            {events.length === 0 ? (
              <p>Brak wydarzeń.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tytuł</th>
                      <th>Opis</th>
                      <th>Data Rozpoczęcia</th>
                      <th>Data Zakończenia</th>
                      <th>Typ</th>
                      <th>Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(event => (
                      <tr key={event.id}>
                        <td>{event.id}</td>
                        <td>{event.title}</td>
                        <td>{event.description || '-'}</td>
                        <td>{format(new Date(event.start_date), 'd MMM yyyy HH:mm', { locale: pl })}</td>
                        <td>{format(new Date(event.end_date), 'd MMM yyyy HH:mm', { locale: pl })}</td>
                        <td>
                          {event.event_type === 'available' ? 'Dostępne' : 
                           event.event_type === 'blocked' ? 'Zablokowane' : 
                           event.event_type === 'special' ? 'Specjalne' : event.event_type}
                        </td>
                        <td>
                          <button
                            className="button button-danger"
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            Usuń
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'fields' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Zarządzanie Boiskami</h2>
              <button
                className="button button-primary"
                onClick={() => setShowFieldForm(true)}
              >
                Dodaj Nowe Boisko
              </button>
            </div>

            {fields.length === 0 ? (
              <p>Brak boisk.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nazwa</th>
                      <th>Typ</th>
                      <th>Nawierzchnia</th>
                      <th>Maks. Graczy</th>
                      <th>Cena/godz.</th>
                      <th>Status</th>
                      <th>Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map(field => (
                      <tr key={field.id}>
                        <td>{field.id}</td>
                        <td>{field.name}</td>
                        <td>
                          {field.field_type === 'full' ? 'Pełne' : 
                           field.field_type === 'half' ? 'Połowa' : 
                           field.field_type === 'small' ? 'Małe' : field.field_type}
                        </td>
                        <td>
                          {field.surface_type === 'artificial' ? 'Sztuczna' : 
                           field.surface_type === 'natural' ? 'Naturalna' : field.surface_type}
                        </td>
                        <td>{field.max_players}</td>
                        <td>{field.hourly_rate ? `${field.hourly_rate} PLN` : '-'}</td>
                        <td>
                          <span className={`badge ${field.is_active ? 'badge-confirmed' : 'badge-cancelled'}`}>
                            {field.is_active ? 'Aktywne' : 'Nieaktywne'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="button button-danger"
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                            onClick={() => handleDeleteField(field.id)}
                          >
                            Usuń
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {showEventForm && (
        <EventForm
          fields={fields}
          onClose={() => setShowEventForm(false)}
          onSuccess={() => {
            setShowEventForm(false);
            loadData();
          }}
          getAuthHeader={getAuthHeader}
        />
      )}

      {showFieldForm && (
        <FieldForm
          onClose={() => setShowFieldForm(false)}
          onSuccess={() => {
            setShowFieldForm(false);
            loadData();
          }}
          getAuthHeader={getAuthHeader}
        />
      )}
    </div>
  );
};

const EventForm = ({ fields, onClose, onSuccess, getAuthHeader }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    event_type: 'available',
    field_id: fields.length > 0 ? fields[0].id : ''
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
      const headers = getAuthHeader();
      await axios.post('/api/admin/calendar', formData, { headers });
      alert('Wydarzenie zostało utworzone');
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Nie udało się utworzyć wydarzenia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Utwórz Wydarzenie Kalendarzowe</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tytuł *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Np. Dostępny slot"
            />
          </div>

          <div className="form-group">
            <label>Opis</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Opcjonalny opis"
            />
          </div>

          <div className="form-group">
            <label>Boisko *</label>
            <select
              name="field_id"
              value={formData.field_id}
              onChange={handleChange}
              required
            >
              {fields.map(field => (
                <option key={field.id} value={field.id}>
                  {field.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Data i Czas Rozpoczęcia *</label>
            <input
              type="datetime-local"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Data i Czas Zakończenia *</label>
            <input
              type="datetime-local"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Typ Wydarzenia</label>
            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
            >
              <option value="available">Dostępne</option>
              <option value="blocked">Zablokowane</option>
              <option value="special">Specjalne</option>
            </select>
          </div>

          {error && <div className="error">{error}</div>}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button 
              type="submit" 
              className="button button-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Tworzenie...' : 'Utwórz Wydarzenie'}
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

const FieldForm = ({ onClose, onSuccess, getAuthHeader }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    field_type: 'full',
    surface_type: 'artificial',
    max_players: 22,
    hourly_rate: ''
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
      const headers = getAuthHeader();
      await axios.post('/api/admin/fields', formData, { headers });
      alert('Boisko zostało utworzone');
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Nie udało się utworzyć boiska');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Dodaj Nowe Boisko</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nazwa Boiska *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Np. Boisko Główne"
            />
          </div>

          <div className="form-group">
            <label>Opis</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Dodatkowe informacje o boisku"
            />
          </div>

          <div className="form-group">
            <label>Typ Boiska *</label>
            <select
              name="field_type"
              value={formData.field_type}
              onChange={handleChange}
              required
            >
              <option value="full">Pełnowymiarowe (11 na 11)</option>
              <option value="half">Połowa boiska (7 na 7)</option>
              <option value="small">Małe boisko (5 na 5)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Typ Nawierzchni *</label>
            <select
              name="surface_type"
              value={formData.surface_type}
              onChange={handleChange}
              required
            >
              <option value="artificial">Sztuczna trawa</option>
              <option value="natural">Trawa naturalna</option>
              <option value="indoor">Hala (podłoga)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Maksymalna Liczba Graczy *</label>
            <input
              type="number"
              name="max_players"
              value={formData.max_players}
              onChange={handleChange}
              required
              min="2"
              max="22"
            />
          </div>

          <div className="form-group">
            <label>Cena za Godzinę (PLN)</label>
            <input
              type="number"
              name="hourly_rate"
              value={formData.hourly_rate}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Np. 150.00"
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
              {loading ? 'Dodawanie...' : 'Dodaj Boisko'}
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

export default AdminDashboard;
