import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { ProfileCard } from "./ProfileCard";

interface LoginProps {
  onGoToRegister: () => void;
  onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess , onGoToRegister }: LoginProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login_check`, {
        method: "POST",
        headers: { "Content-Type": "application/ld+json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Nom d'utilisateur ou mot de passe incorrect.");
      }

      const { token } = await response.json();
      login(token); 
      onLoginSuccess();
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <section className="flex justify-center items-center h-screen w-120">
      <ProfileCard title="Bienvenue !" footerContent={<></>} customClass="h-auto">
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
          <Button type="submit" className="w-full text-white">
            Connexion
          </Button>
          <Button
            className="w-full bg-gray-600 text-white"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              onGoToRegister();
            }}
          >
            Créer un compte
          </Button>
        </form>
        {errorMessage && (
          <p className="text-red-500 text-center flex-col">{errorMessage}</p>
        )}
      </ProfileCard>
    </section>
  );
}