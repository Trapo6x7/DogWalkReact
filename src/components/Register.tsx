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
        <div className="mb-3 flex justify-center">
          <p className="text-[0.75rem] text-secondary-brown text-center">Remplissez le formulaire ci-dessous</p>
        </div>
        <form onSubmit={handleRegister} className="flex flex-col gap-2 mt-1">
          <div className="flex flex-col gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-brown/30 rounded-lg outline-none bg-white/80 text-center focus:ring-2 focus:ring-primary-green"
              />
            </div>
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-brown/30 rounded-lg outline-none bg-white/80 text-center focus:ring-2 focus:ring-primary-green"
              />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-brown/30 rounded-lg outline-none bg-white/80 text-center focus:ring-2 focus:ring-primary-green"
              />
            </div>
            <div className="relative">
              <input
                type="date"
                placeholder="Date de naissance"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full p-2 border border-brown/30 rounded-lg outline-none bg-white/80 text-center focus:ring-2 focus:ring-primary-green"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Ville"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2 border border-brown/30 rounded-lg outline-none bg-white/80 text-center focus:ring-2 focus:ring-primary-green"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-1">
            <Button 
              type="submit" 
              className="w-full bg-primary-green text-primary-brown font-medium py-2 rounded-lg hover:bg-primary-green/90 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Inscription en cours..." : "S'inscrire"}
            </Button>
            <div className="relative flex items-center gap-2 my-1">
              <div className="flex-grow h-px bg-brown/20"></div>
              <span className="text-xs text-brown/60">ou</span>
              <div className="flex-grow h-px bg-brown/20"></div>
            </div>
            <Button
              variant="outline"
              className="w-full border border-brown/30 text-secondary-brown py-2 rounded-lg hover:bg-brown/10 transition-colors"
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
          <div className="mt-2 p-2 bg-red-100 rounded-md border border-red-200">
            <p className="text-red-500 text-center text-xs">{message}</p>
          </div>
        )}
        <div className="mt-2 text-center flex flex-col items-center justify-center">
          <p className="text-[0.625rem] text-brown/70 mb-2">
            En vous inscrivant, vous acceptez nos conditions d'utilisation
          </p>
          <img src="/dogwalklogobrown.png" alt="DogWalk Logo" className="w-12 h-12 object-contain mx-auto" />
        </div>
      </ProfileCard>
    </section>
  );
}