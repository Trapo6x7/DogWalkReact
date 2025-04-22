import { useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";
import { ProfileCard } from "./ProfileCard";

interface AddDogsProps {
  onCancel: () => void;
  onRefresh: () => void;
}

export function AddDogs({ onCancel, onRefresh }: AddDogsProps) {
  const { token } = useAuth();

  const [dogName, setDogName] = useState("");
  const [dogRace, setDogRace] = useState("");
  const [dogGender, setDogGender] = useState("");
  const [dogBirthdate, setDogBirthdate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dogData = {
      name: dogName,
      race: dogRace,
      gender: dogGender,
      birthdate: dogBirthdate,
    };
console.log(dogData);
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
    <div className="fixed top-100 right-5 transform -translate-y-1/2 bg-[#FBFFEE] p-6 rounded-lg z-50 w-full max-w-md">
      <ProfileCard
        title="Ajouter un chien"
        customClass="h-auto"
        headerContent={
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mx-auto">
            <img
              src="/dwlogopatte.png"
              alt="Ajout de chien"
              className="w-full h-full object-cover"
            />
          </div>
        }
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
          <input
            type="text"
            value={dogRace}
            onChange={(e) => setDogRace(e.target.value)}
            placeholder="Race"
            className="p-2 rounded bg-neutral-white border border-secondary-brown"
            required
          />

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
              onClick={onRefresh}
              className="bg-primary-green text-primary-brown px-4 py-2 rounded"
            >
              Ajouter
            </Button>
          </div>
        </form>
      </ProfileCard>
    </div>
  );
}

export default AddDogs;
