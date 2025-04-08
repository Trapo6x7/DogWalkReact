import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Welcome } from './components/Welcome';

export default function App() {
  const [page, setPage] = useState<'login' | 'register' | 'welcome'>('login');

  const handleRegisterSuccess = () => {
    localStorage.setItem('authToken', 'fake-jwt-token'); // à remplacer par le vrai token plus tard
    setPage('welcome');
  };

  const handleLoginSuccess = () => {
    localStorage.setItem('authToken', 'fake-jwt-token'); // à remplacer aussi
    setPage('welcome');
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setPage('welcome');
    }
  }, []);

  return (
    <>
      {page === 'login' && <Login onLoginSuccess={handleLoginSuccess} onGoToRegister={() => setPage('register')} />}
      {page === 'register' && <Register onRegisterSuccess={handleRegisterSuccess} />}
      {page === 'welcome' && <Welcome />}
    </>
  );
}