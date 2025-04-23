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
  const {user, token, refreshUser, setUser } = useAuth();

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

  const [charCount, setCharCount] = useState(0);
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);

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

  return (
    <div className="fixed top-60 right-5 transform -translate-y-1/2 bg-[#FBFFEE] p-6 rounded-lg z-50 w-full max-w-md">
      {userData && (
        <div className="mb-6">
          <ProfileCard userData={userData} customClass="h-auto" />
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
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

        <label htmlFor="description" className="font-medium text-secondary-brown">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-2 rounded bg-neutral-white border border-secondary-brown"
        />
        <div className="text-sm text-gray-500">{charCount}/140 caractères</div>
        {isLimitExceeded && (
          <div className="text-sm text-red-500">
            Vous avez dépassé la limite de 140 caractères !
          </div>
        )}

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
    </div>
  );
}

export default EditProfileForm;
