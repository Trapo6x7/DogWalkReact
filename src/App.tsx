import { useState } from 'react';
import { Welcome } from './components/Welcome';
import { Login } from './components/Login';

function App() {
  const [page, setPage] = useState('home'); // Gère la page actuelle

  let currentPage;
  if (page === 'home') {
    currentPage = <Welcome />;
  } 
  else if (page === 'login') {
    currentPage = <Login />;
  }

  return (
    <main>
      {currentPage}
      <nav>
        <button onClick={() => setPage('home')}>Home</button>
        <button onClick={() => setPage('login')}>Login</button>
      </nav>
    </main>
  );
}

export default App;