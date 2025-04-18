import { useState } from "react";
import { Button } from "./ui/button";
import { UserData } from "../types/Interfaces";
import EditPasswordForm from "./EditPasswordForm"; // Import du composant EditPasswordForm
import { ProfileCard } from "./ProfileCard"; // Import du composant ProfileCard

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
      const updatedUser = await response.json();
      setUserData(updatedUser);
      onRefresh();
      onCancel();
      // window.location.reload();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
<div className="fixed top-100 right-5 transform -translate-y-1/2 bg-[#FBFFEE] p-6 rounded-lg z-50 w-full max-w-md">      {/* Utilisation de ProfileCard */}
      {userData && (
        <div className="mb-6">
          <ProfileCard userData={userData} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-primary-brown text-center">
          Modifier le profil
        </h2>

        <label htmlFor="name" className="font-medium text-secondary-brown">
          Nom
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nom"
          className="p-2 rounded bg-neutral-white border border-secondary-brown"
        />

        <label
          htmlFor="description"
          className="font-medium text-secondary-brown"
        >
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-2 rounded bg-neutral-white border border-secondary-brown"
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
            Sauvegarder
          </Button>
        </div>
      </form>

      {/* Ajout du composant EditPasswordForm */}
      <div className="mt-8">
        <EditPasswordForm
          userData={userData}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}

export default EditProfileForm;