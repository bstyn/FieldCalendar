import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
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
        <h1>Logowanie</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Adres Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="twoj@email.com"
            />
          </div>

          <div className="form-group">
            <label>Hasło</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Twoje hasło"
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button 
            type="submit" 
            className="button button-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Nie masz konta? <a href="/register">Zarejestruj się tutaj</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
