import { useState } from "react";
import { postRequest } from "../utils/api";
import { Button } from "./ui/button";
import { ProfileCard } from "./ProfileCard"; // Réutilisation de ProfileCard pour la cohérence

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
    <section className="flex justify-center items-center h-screen w-120">
      <ProfileCard
        title="Bienvenue !"
        headerContent={
          <div className="text-center">
          </div>
        }
        footerContent={<></>}
      >
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
