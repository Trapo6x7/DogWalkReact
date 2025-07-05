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
        <div style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "center" }}>
          <p style={{ color: "var(--secondary-brown)", textAlign: "center", fontSize: "0.75rem" }}>Entrez vos identifiants</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.25rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ 
                  width: "100%", 
                  padding: "0.5rem", 
                  border: "1px solid rgba(123, 78, 46, 0.3)", 
                  borderRadius: "0.5rem", 
                  outline: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  textAlign: "center"
                }}
              />
            </div>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: "100%", 
                  padding: "0.5rem", 
                  border: "1px solid rgba(123, 78, 46, 0.3)", 
                  borderRadius: "0.5rem", 
                  outline: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  textAlign: "center"
                }}
              />
            </div>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
            <Button 
              type="submit" 
              style={{
                width: "100%",
                backgroundColor: "var(--primary-green)",
                color: "var(--primary-brown)",
                fontWeight: "500",
                padding: "0.5rem 0"
              }}
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Connexion"}
            </Button>
            
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "0.5rem", margin: "0.25rem 0" }}>
              <div style={{ flexGrow: 1, height: "1px", backgroundColor: "rgba(123, 78, 46, 0.2)" }}></div>
              <span style={{ fontSize: "0.75rem", color: "rgba(123, 78, 46, 0.6)" }}>ou</span>
              <div style={{ flexGrow: 1, height: "1px", backgroundColor: "rgba(123, 78, 46, 0.2)" }}></div>
            </div>
            
            <Button
              variant="outline"
              style={{
                width: "100%",
                border: "1px solid rgba(123, 78, 46, 0.3)",
                color: "var(--secondary-brown)",
                padding: "0.5rem 0"
              }}
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
          <div style={{ marginTop: "0.5rem", padding: "0.5rem", backgroundColor: "rgba(254, 226, 226, 1)", borderRadius: "0.375rem", border: "1px solid rgba(254, 202, 202, 1)" }}>
            <p style={{ color: "rgba(239, 68, 68, 1)", textAlign: "center", fontSize: "0.75rem" }}>{errorMessage}</p>
          </div>
        )}
        
        <div style={{ marginTop: "0.5rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.625rem", color: "rgba(123, 78, 46, 0.7)", marginBottom: "0.5rem" }}>
            En vous connectant, vous acceptez nos conditions d'utilisation
          </p>
          <img src="/dogwalklogobrown.png" alt="DogWalk Logo" style={{ width: "2.25rem", height: "2.25rem", objectFit: "contain", margin: "0 auto" }} />
        </div>
      </ProfileCard>
    </section>
  );
}