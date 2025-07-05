import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { ProfileCard } from "./ProfileCard";

interface RegisterProps {
  onGoToLogin: () => void;
  onRegisterSuccess: () => void;
}

export function Register({ onGoToLogin, onRegisterSuccess }: RegisterProps) {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState(""); // Nouveau champ pour la ville
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Utiliser l'API de géolocalisation pour récupérer la ville
  useEffect(() => {
    const fetchCity = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          // Appeler une API météo gratuite pour obtenir la ville
          const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${latitude},${longitude}`
          );
          const data = await response.json();
          setCity(data.location?.name || "Ville inconnue");
        });
      } else {
        setCity("Géolocalisation non disponible");
      }
    };

    fetchCity();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/ld+json" },
        body: JSON.stringify({ email, password, name, birthdate, city }), // Inclure la ville
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
      onRegisterSuccess(); // Rediriger vers la page d'accueil après inscription
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center h-screen w-full max-w-sm mx-auto px-4">
      <ProfileCard 
        title="Créer un compte" 
        description="Rejoignez l'aventure DogWalk"
        headerContent={<></>}
        customClass="h-auto transform hover:scale-[1.01] transition-all text-center"
      >
        <div style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "center" }}>
          <p style={{ color: "var(--secondary-brown)", textAlign: "center", fontSize: "0.75rem" }}>Remplissez le formulaire ci-dessous</p>
        </div>
        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.25rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <div style={{ position: "relative" }}>
              <input
                type="date"
                placeholder="Date de naissance"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
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
                type="text"
                placeholder="Ville"
                value={city}
                onChange={(e) => setCity(e.target.value)}
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
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.25rem" }}>
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
              {isLoading ? "Inscription en cours..." : "S'inscrire"}
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
                onGoToLogin();
              }}
            >
              Retour à la connexion
            </Button>
          </div>
        </form>
        
        {message && (
          <div style={{ marginTop: "0.5rem", padding: "0.5rem", backgroundColor: "rgba(254, 226, 226, 1)", borderRadius: "0.375rem", border: "1px solid rgba(254, 202, 202, 1)" }}>
            <p style={{ color: "rgba(239, 68, 68, 1)", textAlign: "center", fontSize: "0.75rem" }}>{message}</p>
          </div>
        )}
        
        <div style={{ marginTop: "0.5rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.625rem", color: "rgba(123, 78, 46, 0.7)", marginBottom: "0.5rem" }}>
            En vous inscrivant, vous acceptez nos conditions d'utilisation
          </p>
          <img src="/dogwalklogobrown.png" alt="DogWalk Logo" style={{ width: "3rem", height: "3rem", objectFit: "contain", margin: "0 auto" }} />
        </div>
      </ProfileCard>
    </section>
  );
}