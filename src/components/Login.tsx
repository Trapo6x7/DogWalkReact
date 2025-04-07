import { useState } from 'react';
import { postRequest } from '../utils/api';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const credentials = { username, password };

    // Utilisation de l'utilitaire pour la requête POST
    const response = await postRequest<{ token: string }>('/login_check', credentials);

    if (response.error) {
      console.log("loupé mec");
      
      setErrorMessage(response.error);
    } else {
      // Si la connexion est réussie, tu peux stocker un token ou rediriger l'utilisateur
      console.log('Connexion réussie, token:', response.data.token);
      localStorage.setItem('authToken', response.data.token);
      // Gérer le token ou la redirection ici
    } 
  };

  return (
    <section id="login">
      <article>
        <h1>YOOOOO</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        {errorMessage && <p>{errorMessage}</p>}
      </article>
    </section>
  );
}
