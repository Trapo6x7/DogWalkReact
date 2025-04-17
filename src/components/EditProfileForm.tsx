import { useState } from "react";
import { Button } from "./ui/button";
import { UserData } from "../types/Interfaces";

interface EditProfileFormProps {
  userData: UserData | null;
  onCancel: () => void;
  onSave: (updatedData: UserData) => void;
  onRefresh : () => void;
}

export function EditProfileForm({
    userData: initialUserData,
    onCancel,
    onRefresh,
  }: EditProfileFormProps & { onRefresh: () => void }) {
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
      }
    );
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await handleSave(formData);
    };
  
    const handleSave = async (updatedData: UserData) => {
      console.log(updatedData);
      if (!userData) {
        console.error("userData est null, impossible de sauvegarder.");
        return;
      }
  
      try {
        const token = localStorage.getItem("authToken");
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
  
        setUserData(updatedData);
  
      
        onRefresh();
        onCancel(); 
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
          className="p-2 rounded bg-white/80"
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