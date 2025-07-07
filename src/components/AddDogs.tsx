import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";
import { ProfileCard } from "./ProfileCard";

interface AddDogsProps {
  onCancel: () => void;
  onRefresh: () => void;
}

export function AddDogs({ onCancel, onRefresh }: AddDogsProps) {
  const { token } = useAuth();
  // const [hasDog, setHasDog] = useState(false);

  const [dogName, setDogName] = useState("");
  const [dogRaceId, setDogRaceId] = useState("");
  const [dogGender, setDogGender] = useState("");
  const [dogBirthdate, setDogBirthdate] = useState("");

  const [races, setRaces] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/races`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/ld+json",
            },
          }
        );

        if (!response.ok)
          throw new Error("Erreur lors de la récupération des races");

        const data = await response.json();
        setRaces(data["member"]);
      } catch (error) {
        console.error("Erreur lors du chargement des races :", error);
      }
    };

    fetchRaces();
  }, [token]);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/dogs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/ld+json",
            },
          }
        );

        if (!response.ok)
          throw new Error("Erreur lors de la récupération des chiens");

        // const data = await response.json();

        // if (data["member"] && data["member"].length >= 1) {
        //   setHasDog(true);
        // }
      } catch (error) {
        console.error("Erreur lors du chargement des chiens :", error);
      }
    };

    fetchDogs();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dogData = {
      name: dogName,
      race: dogRaceId ? [`/api/races/${dogRaceId}`] : [],
      gender: dogGender,
      birthdate: dogBirthdate,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dogs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/ld+json",
        },
        body: JSON.stringify(dogData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du chien.");
      }

      onRefresh();
      onCancel();
    } catch (error) {
      console.error("Erreur:", error);
    }
  } // <-- fermeture correcte de handleSubmit
  return (
    <div className="relative w-full max-w-sm mx-auto px-4 sm:max-w-full sm:px-1">
      {/* Bouton de fermeture en haut à droite */}
      <button
        onClick={onCancel}
        aria-label="Fermer la modale"
        className="absolute top-2 right-4 bg-transparent border-none text-[1.5rem] sm:text-[1.2rem] text-[#7B4E2E] cursor-pointer z-10"
        type="button"
      >
        ×
      </button>
      <div className="bg-[#FBFFEE] p-6 rounded-lg transform hover:scale-[1.01] transition-all text-center">
        <ProfileCard
          customClass="h-auto"
          headerContent={<></>}
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 mt-1"
          >
            <h2 className="text-xl font-bold text-primary-brown text-center mb-2">
              Ajouter un chien
            </h2>
            <label className="font-medium text-secondary-brown">Nom</label>
            <input
              type="text"
              value={dogName}
              onChange={(e) => setDogName(e.target.value)}
              placeholder="Nom du chien"
              className="w-full p-2 border border-[#7B4E2E]/30 rounded-lg outline-none bg-white/80 text-center"
              required
            />

            <label className="font-medium text-secondary-brown">Race</label>
            <select
              value={dogRaceId}
              onChange={(e) => setDogRaceId(e.target.value)}
              className="w-full p-2 border border-[#7B4E2E]/30 rounded-lg outline-none bg-white/80 text-center"
              required
            >
              <option value="">Sélectionner une race</option>
              {races && races.length > 0 ? (
                races.map((race) => (
                  <option key={race.id} value={race.id}>
                    {race.name}
                  </option>
                ))
              ) : (
                <option>Chargement...</option>
              )}
            </select>

            <label className="font-medium text-secondary-brown">Sexe</label>
            <select
              value={dogGender}
              onChange={(e) => setDogGender(e.target.value)}
              className="w-full p-2 border border-[#7B4E2E]/30 rounded-lg outline-none bg-white/80 text-center"
              required
            >
              <option value="">Sélectionner</option>
              <option value="male">Mâle</option>
              <option value="female">Femelle</option>
            </select>

            <label className="font-medium text-secondary-brown">
              Date de naissance
            </label>
            <input
              type="date"
              value={dogBirthdate}
              onChange={(e) => setDogBirthdate(e.target.value)}
              className="w-full p-2 border border-[#7B4E2E]/30 rounded-lg outline-none bg-white/80 text-center"
              required
            />

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
                Ajouter
              </Button>
            </div>
          </form>
        </ProfileCard>
      </div>
    </div>
  );
}

export default AddDogs;
