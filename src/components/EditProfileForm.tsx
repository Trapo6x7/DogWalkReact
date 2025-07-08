import { useState } from "react";
import { Button } from "./ui/button";
import { UserData } from "../types/Interfaces";
import { ProfileCard } from "./ProfileCard";
import { useAuth } from "../context/AuthContext"; // 🔥 Import du context

interface EditProfileFormProps {
  userData: UserData | null;
  onCancel: () => void;
  onSave: (updatedData: UserData) => void;
  onRefresh: () => void;
}

export function EditProfileForm({
  userData: initialUserData,
  onCancel,
  onRefresh,
}: EditProfileFormProps & { onRefresh: () => void }) {
  const { user, token, refreshUser, setUser } = useAuth();

  const [userData, setUserData] = useState<UserData | null>(initialUserData);
  const [formData, setFormData] = useState<UserData>(
    initialUserData ?? {
      id: 0,
      name: "",
      email: "",
      imageFilename: "",
      dogs: [],
      birthdate: "",
      score: 0,
      description: "",
      city: "",
    }
  );

  const [charCount, setCharCount] = useState(0);
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "description") {
      setCharCount(value.length);
      if (value.length > 140) {
        setIsLimitExceeded(true);
        return;
      } else {
        setIsLimitExceeded(false);
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSave(formData);
  };

  const handleSave = async (updatedData: UserData) => {
    if (!userData) {
      console.error("userData est null, impossible de sauvegarder.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${userData.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 Utilisation du token depuis le context
            "Content-Type": "application/merge-patch+json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du profil");
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      setUser(updatedUser);
      onRefresh();
      onCancel();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Utilisation de l'API Nominatim pour reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county ||
            "";
          setFormData((prev) => ({ ...prev, city }));
        } catch (e) {
          alert("Impossible de récupérer la ville automatiquement.");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        alert("Impossible d'accéder à votre position.");
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="w-full max-w-sm mx-auto px-1 md:px-4 relative">
      {/* Bouton de fermeture en haut à droite */}
      <button
        onClick={onCancel}
        aria-label="Fermer la modale"
        className="absolute top-2 right-4 bg-transparent border-none text-[1.5rem] text-[#7B4E2E] cursor-pointer z-10"
      >
        ×
      </button>
      <div className="bg-[#FBFFEE] p-6 rounded-lg transform hover:scale-[1.01] transition-all text-center">
        {userData && (
          <div className="mb-6">
            <ProfileCard userData={userData} customClass="h-auto" />
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 mt-1"
        >
          <h2 className="text-xl font-bold text-primary-brown text-center mb-2">
            Modifier le profil
          </h2>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nom"
              className="w-full p-2 border border-[rgba(123,78,46,0.3)] rounded-lg outline-none bg-[rgba(255,255,255,0.8)] text-center"
            />
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 border border-[rgba(123,78,46,0.3)] rounded-lg outline-none bg-[rgba(255,255,255,0.8)] text-center"
            />
            <div className="text-sm text-gray-500">
              {charCount}/140 caractères
            </div>
            {isLimitExceeded && (
              <div className="text-sm text-red-500">
                Vous avez dépassé la limite de 140 caractères !
              </div>
            )}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ville"
                className="w-full p-2 border border-[rgba(123,78,46,0.3)] rounded-lg outline-none bg-[rgba(255,255,255,0.8)] text-center"
              />
              <button
                type="button"
                onClick={handleGeolocate}
                disabled={isLocating}
                title="Détecter ma ville automatiquement"
                className="bg-[var(--primary-green)] text-[var(--primary-brown)] border-none rounded-lg px-3 py-2 font-semibold cursor-pointer min-w-[40px] flex items-center justify-center"
              >
                {isLocating ? (
                  "..."
                ) : (
                  <span role="img" aria-label="géolocalisation">
                    <img src="localisation.png" alt="geolocalisation" className="w-6" />
                  </span>
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <Button
              type="button"
              onClick={onCancel}
              className="w-full bg-[var(--secondary-green)] text-[var(--secondary-brown)] font-medium py-2"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="w-full bg-[var(--primary-green)] text-[var(--primary-brown)] font-medium py-2"
            >
              Sauvegarder
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileForm;
