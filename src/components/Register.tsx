import { useState } from "react";
import { postRequest } from "../utils/api";
import { Button } from "./ui/button";
import { ProfileCard } from "./ProfileCard";

interface RegisterProps {
  onRegisterSuccess: () => void;
  onGoToLogin: () => void; // Nouvelle prop pour la navigation
}

export function Register({ onRegisterSuccess, onGoToLogin }: RegisterProps) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const isAdult = (birthdateStr: string) => {
    const birth = new Date(birthdateStr);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    return (
      age > 18 || (age === 18 && m >= 0 && today.getDate() >= birth.getDate())
    );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAdult(birthdate)) {
      setMessage("Tu dois avoir au moins 18 ans pour t'inscrire.");
      return;
    }

    const formattedBirthdate = new Date(birthdate).toISOString();

    const response = await postRequest("/register", {
      email,
      password,
      name,
      birthdate: formattedBirthdate,
    });

    if (response.error) {
      setMessage(response.error);
      return;
    }

    const loginResponse = await postRequest<{ token: string }>("/login_check", {
      username: email,
      password: password,
    });

    if (loginResponse.error) {
      setMessage(
        "Inscription réussie, mais échec de la connexion automatique."
      );
    } else {
      localStorage.setItem("authToken", loginResponse.data.token);
      setMessage("Inscription réussie et connexion automatique !");
      onRegisterSuccess();
    }
  };

  return (
    <section className="flex justify-center items-center h-screen w-120">
      <ProfileCard
        title="Créer un compte"
        headerContent={
          <>
          </>
        }
        footerContent={<></>}
      >
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
              onGoToLogin(); // Appel de la fonction de navigation
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