import { useState } from 'react';
import { postRequest } from '../utils/api';

interface LoginProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
}

export function Login({ onLoginSuccess, onGoToRegister }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await postRequest<{ token: string }>('/login_check', { username, password });

    if (response.error) {
      setErrorMessage(response.error);
    } else {
      localStorage.setItem('authToken', response.data.token);
      onLoginSuccess();
    }
  };

  return (
    <section>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <a href="#" onClick={(e) => { e.preventDefault(); onGoToRegister(); }}>Register</a>
      {errorMessage && <p>{errorMessage}</p>}
    </section>
  );
}
