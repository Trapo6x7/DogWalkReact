import { useState } from "react";
import { postRequest } from "../utils/api";
import { Button } from "./ui/button";




interface RegisterProps {
  onRegisterSuccess: () => void;
}

export function Register({ onRegisterSuccess }: RegisterProps) {
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

    // Convertir birthdate en ISO format (sans heure)
    const formattedBirthdate = new Date(birthdate).toISOString();

    const response = await postRequest("/register", {
      email,
      password,
      name,
      birthdate: formattedBirthdate,
    });

    if (response.error) {
      setMessage(response.error);
    } else {
      // Connexion de l'utilisateur après l'inscription
      setMessage("Inscription réussie et connecté !");
      onRegisterSuccess();
    }
  };

  return (
    <section>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="date"
          placeholder="Birthdate"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
        />
        <Button type="submit">Register</Button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}
