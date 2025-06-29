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
  };

  return (
    <article
      className={`fixed transform -translate-y-1/2 bg-[#FBFFEE] rounded-lg z-50 w-full max-w-md  top-80 right-0
      `}
    >
      <ProfileCard
        title="Ajouter un chien"
        customClass="h-auto"
        headerContent={<></>}
      >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <label className="font-medium text-secondary-brown">Nom</label>
            <input
              type="text"
              value={dogName}
              onChange={(e) => setDogName(e.target.value)}
              placeholder="Nom du chien"
              className="p-2 rounded bg-neutral-white border border-secondary-brown"
              required
            />

            <label className="font-medium text-secondary-brown">Race</label>
            <select
              value={dogRaceId}
              onChange={(e) => setDogRaceId(e.target.value)}
              className="p-2 rounded bg-neutral-white border border-secondary-brown"
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
              className="p-2 rounded bg-neutral-white border border-secondary-brown"
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
              className="p-2 rounded bg-neutral-white border border-secondary-brown"
              required
            />

            <div className="flex gap-4 mt-4 justify-center">
              <Button
                type="button"
                onClick={onCancel}
                className="bg-secondary-green text-secondary-brown px-4 py-2 rounded"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-primary-green text-primary-brown px-4 py-2 rounded"
              >
                Ajouter
              </Button>
            </div>
          </form>
      </ProfileCard>
    </article>
  );
}

export default AddDogs;
