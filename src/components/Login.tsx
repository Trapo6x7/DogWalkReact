import { useState } from "react";
import { postRequest } from "../utils/api";
import { Button } from "./ui/button";


interface LoginProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
}

export function Login({ onLoginSuccess, onGoToRegister }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await postRequest<{ token: string }>("/login_check", {
      username,
      password,
    });

    if (response.error) {
      setErrorMessage(response.error);
    } else {
      localStorage.setItem("authToken", response.data.token);
      onLoginSuccess();
    }
  };

  return (
    <section>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Login</Button>
      </form>
      {/* Bouton Register avec onClick et typage explicite */}
      <Button
        type="button" // type "button" pour empêcher la soumission du formulaire
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault(); // Empêche le comportement par défaut de l'élément
          onGoToRegister(); // Appelle la fonction pour rediriger vers l'enregistrement
        }}
      >
        Register
      </Button>{" "}
      {errorMessage && <p>{errorMessage}</p>}
    </section>
  );
}
