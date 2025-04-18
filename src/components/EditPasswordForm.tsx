import React, { useState } from "react";
import { ProfileCard } from "./ProfileCard";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext"; // <-- Import du hook useAuth

interface EditPasswordFormProps {
  onCancel: () => void;
}

const EditPasswordForm: React.FC<EditPasswordFormProps> = ({ onCancel }) => {
  const { user, token, refreshUser } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/updatepassword`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/ld+json",
          },
          body: JSON.stringify({
            oldPassword,
            password: newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Une erreur est survenue.");
        return;
      }

      setSuccess("Mot de passe mis à jour avec succès.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      refreshUser();
    } catch (err) {
      setError("Impossible de mettre à jour le mot de passe. Veuillez réessayer plus tard.");
    }
  };

  return (
    <div className="edit-password-form bg-[#FBFFEE] rounded-lg">
      {/* Affichage du profil si dispo */}
      {user && (
        <div className="mb-6">
          <ProfileCard userData={user} customClass="h-auto" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <div>
          <label htmlFor="oldPassword" className="font-medium text-secondary-brown">
            Mot de passe actuel
          </label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="p-2 rounded bg-neutral-white border border-secondary-brown w-full"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="font-medium text-secondary-brown">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="p-2 rounded bg-neutral-white border border-secondary-brown w-full"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="font-medium text-secondary-brown">
            Confirmer le nouveau mot de passe
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="p-2 rounded bg-neutral-white border border-secondary-brown w-full"
          />
        </div>

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
            className="bg-primary-green text-primary-brown px-4 py-2 rounded mt-4"
          >
            Mettre à jour
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPasswordForm;
