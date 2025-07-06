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
    <div className="w-full max-w-sm mx-auto px-4">
      <div className="bg-[#FBFFEE] p-6 rounded-lg transform hover:scale-[1.01] transition-all text-center">
        {userData && (
          <div className="mb-6">
            <ProfileCard userData={userData} customClass="h-auto" />
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginTop: "0.25rem",
          }}
        >
          <h2 className="text-xl font-bold text-primary-brown text-center mb-2">
            Modifier le profil
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nom"
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid rgba(123, 78, 46, 0.3)",
                borderRadius: "0.5rem",
                outline: "none",
                backgroundColor: "rgba(255,255,255,0.8)",
                textAlign: "center",
              }}
            />
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid rgba(123, 78, 46, 0.3)",
                borderRadius: "0.5rem",
                outline: "none",
                backgroundColor: "rgba(255,255,255,0.8)",
                textAlign: "center",
              }}
            />
            <div className="text-sm text-gray-500">
              {charCount}/140 caractères
            </div>
            {isLimitExceeded && (
              <div className="text-sm text-red-500">
                Vous avez dépassé la limite de 140 caractères !
              </div>
            )}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ville"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid rgba(123, 78, 46, 0.3)",
                  borderRadius: "0.5rem",
                  outline: "none",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  textAlign: "center",
                }}
              />
              <button
                type="button"
                onClick={handleGeolocate}
                disabled={isLocating}
                style={{
                  background: "var(--primary-green)",
                  color: "var(--primary-brown)",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  minWidth: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Détecter ma ville automatiquement"
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            <Button
              type="button"
              onClick={onCancel}
              style={{
                width: "100%",
                backgroundColor: "var(--secondary-green)",
                color: "var(--secondary-brown)",
                fontWeight: 500,
                padding: "0.5rem 0",
              }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "var(--primary-green)",
                color: "var(--primary-brown)",
                fontWeight: 500,
                padding: "0.5rem 0",
              }}
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
