import { useState } from "react";
import { Button } from "./ui/button";
import { UserData } from "../types/Interfaces";

interface EditProfileFormProps {
  userData: UserData | null;
  onCancel: () => void;
  onSave: (updatedData: UserData) => void;
}

export function EditProfileForm({ userData, onCancel }: EditProfileFormProps) {
  const [formData, setFormData] = useState<UserData>(
    userData ?? {
      id: 0, // Valeur par défaut pour id
      name: "",
      email: "",
      imageFilename: "",
      dogs: [], // Tableau vide pour les chiens
      birthdate: "",
      score: 0, // Score par défaut
      description: "", // Valeur par défaut pour description
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSave(formData); // Appeler handleSave pour envoyer les données à l'API
  };

  const handleSave = async (updatedData: UserData) => {
    if (!userData) {
      console.error("userData est null, impossible de sauvegarder.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      console.log("Token utilisé :", token)
      const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/${userData.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/merge-patch+json",
          },
          body: JSON.stringify(updatedData),
        }
      );
    
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du profil");
      }

      console.log("Profil mis à jour avec succès");
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
      <label htmlFor="description" className="font-medium">
        Description
      </label>
      <input
        type="text"
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className=" p-2 rounded bg-white/80 "
      />

      <div className="flex gap-4 mt-4">
        <Button type="button" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">Sauvegarder</Button>
      </div>
    </form>
  );
}
