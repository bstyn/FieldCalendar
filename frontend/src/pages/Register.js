import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Hasła nie są identyczne');
      return;
    }

    if (formData.password.length < 6) {
      setError('Hasło musi mieć minimum 6 znaków');
      return;
    }

    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h1>Rejestracja</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Imię i Nazwisko</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Jan Kowalski"
            />
          </div>

          <div className="form-group">
            <label>Adres Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="jan@example.com"
            />
          </div>

          <div className="form-group">
            <label>Hasło</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Minimum 6 znaków"
            />
          </div>

          <div className="form-group">
            <label>Potwierdź Hasło</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Powtórz hasło"
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button 
            type="submit" 
            className="button button-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Rejestrowanie...' : 'Zarejestruj się'}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Masz już konto? <a href="/login">Zaloguj się tutaj</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
