// pages/login.js
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function Login() {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Please enter both username and password.');
      setLoading(false);
      return;
    }

    try {
      await login(username, password);
      router.push('/admin'); // Redirige al dashboard de administrador
    } catch (error) {
      setError('Failed to log in. Please check your username and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="login-box">
          <h1>Login</h1>
          {error && <p className="error" role="alert">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                aria-required="true"
              />
            </div>
            <div className="password-container">
              <label htmlFor="password">Password:</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-required="true"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password-button"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
       </div>
       <Footer/>

      {/* Estilos */}
      <style jsx>{`
        .login-page {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f0f4f8; /* Fondo suave */
        }
        .login-box {
          background-color: #ffffff;
          padding: 3rem;
          border-radius: 12px;
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1); /* Sombra suave */
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        h1 {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          color: #333333;
        }
        .error {
          color: red;
          margin-bottom: 1rem;
          font-weight: bold;
        }
        form div {
          margin-bottom: 1.5rem;
        }
        label {
          display: block;
          font-size: 1rem;
          font-weight: bold;
          color: #333333;
          margin-bottom: 0.5rem;
          text-align: left;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #cccccc;
          border-radius: 8px;
          font-size: 1rem;
        }
        input:focus {
          outline: none;
          border-color: #2196f3; /* Color de foco */
        }
        .password-container {
          display: flex;
          flex-direction: column;
        }
        .password-wrapper {
          display: flex;
          align-items: center;
        }
        .password-wrapper input {
          flex: 1;
          margin-right: 0.5rem;
        }
        .toggle-password-button {
          background: none;
          border: 1px solid #cccccc;
          border-radius: 8px;
          color: #333333;
          cursor: pointer;
          padding: 0.5rem;
          font-size: 0.875rem;
        }
        button[type="submit"] {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          background-color: #2196f3;
          color: #ffffff;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        button[type="submit"]:hover {
          background-color: #1e88e5; /* Color de hover */
        }
        button[type="submit"]:disabled {
          background-color: #cccccc;
        }
      `}</style>
    </>
  );
}
