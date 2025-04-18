import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { ProfileCard } from "./ProfileCard";

interface RegisterProps {
  onGoToLogin: () => void;
  onRegisterSuccess: () => void;
}

export function Register({ onGoToLogin }: RegisterProps) {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/ld+json" },
        body: JSON.stringify({ email, password, name, birthdate }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'inscription.");
      }

      const loginResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/login_check`, {
        method: "POST",
        headers: { "Content-Type": "application/ld+json" },
        body: JSON.stringify({ username: email, password }),
      });

      if (!loginResponse.ok) {
        throw new Error("Inscription réussie, mais échec de la connexion.");
      }

      const { token } = await loginResponse.json();
      login(token); // Connexion automatique après l'inscription
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <section className="flex justify-center items-center h-screen w-120">
      <ProfileCard title="Créer un compte" footerContent={<></>} customClass="h-auto">
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
          <input
            type="date"
            placeholder="Date de naissance"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
          <Button type="submit" className="w-full text-white">
            S'inscrire
          </Button>
          <Button
            className="w-full bg-gray-600 text-white"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              onGoToLogin();
            }}
          >
            Retour à la connexion
          </Button>
        </form>
        {message && (
          <p className="text-red-500 text-center flex-col">{message}</p>
        )}
      </ProfileCard>
    </section>
  );
}