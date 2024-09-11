import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function Login() {
  const [email, setEmail] = useState('');
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

    // Basic client-side validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      router.push('/admin');
    } catch (error) {
      setError('Failed to log in. Please check your email and password.');
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
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
      <style jsx>{`
        .login-page {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #00000;
        }
        .login-box {
          background: steelblue;
          padding: 6rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          animation: fadeIn 1s ease-in-out;
        }
        h1 {
          margin-bottom: 2rem;
        }
        .error {
          color: red;
          margin-bottom: 2rem;
        }
        form div {
          margin-bottom: 2rem;
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
          border: 1px solid #ccc;
          border-radius: 4px;
          color: #000000;
          cursor: pointer;
          padding: 0.6rem;
          font-size: 0.9rem;
        }
        input {
          width: 100%;
          padding: 0.6rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button[type="submit"] {
          width: 100%;
          padding: 0.75rem;
          border:  1px solid #ccc ;
          border-radius: 8px;
          background-color: #2196f3;
          color: black;
          font-size: 1rem;
          cursor: pointer;
        }
        button[type="submit"]:disabled {
          background-color: #ccc;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

