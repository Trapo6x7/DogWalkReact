import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { ProfileCard } from "./ProfileCard";

interface LoginProps {
  onGoToRegister: () => void;
  onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess, onGoToRegister }: LoginProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login_check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center h-screen w-full max-w-sm mx-auto px-4">
      <ProfileCard 
        title="Bienvenue sur DogWalk !" 
        description="Connectez-vous pour commencer votre aventure"
        headerContent={<></>}
        customClass="h-auto transform hover:scale-[1.01] transition-all text-center"
      >
        <div className="mb-3 flex justify-center">
          <p className="text-[0.75rem] text-secondary-brown text-center">Entrez vos identifiants</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-2 mt-1">
          <div className="flex flex-col gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-[rgba(123,78,46,0.3)] rounded-lg outline-none bg-[rgba(255,255,255,0.8)] text-center"
              />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-[rgba(123,78,46,0.3)] rounded-lg outline-none bg-[rgba(255,255,255,0.8)] text-center"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <Button 
              type="submit" 
              className="w-full bg-[var(--primary-green)] text-[var(--primary-brown)] font-medium py-2"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Connexion"}
            </Button>
            <div className="relative flex items-center gap-2 my-1">
              <div className="flex-grow h-px bg-[rgba(123,78,46,0.2)]"></div>
              <span className="text-[0.75rem] text-[rgba(123,78,46,0.6)]">ou</span>
              <div className="flex-grow h-px bg-[rgba(123,78,46,0.2)]"></div>
            </div>
            <Button
              variant="outline"
              className="w-full border border-[rgba(123,78,46,0.3)] text-secondary-brown py-2"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                onGoToRegister();
              }}
            >
              Créer un compte
            </Button>
          </div>
        </form>
        {errorMessage && (
          <div className="mt-2 p-2 bg-red-100 rounded-md border border-red-200">
            <p className="text-red-600 text-center text-xs">{errorMessage}</p>
          </div>
        )}
        <div className="mt-2 text-center flex flex-col items-center justify-center">
          <p className="text-[0.625rem] text-[rgba(123,78,46,0.7)] mb-2">
            En vous connectant, vous acceptez nos conditions d'utilisation
          </p>
          <img src="/dogwalklogobrown.png" alt="DogWalk Logo" className="w-9 h-9 object-contain mx-auto" />
        </div>
      </ProfileCard>
    </section>
  );
}