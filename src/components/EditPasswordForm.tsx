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

  // Responsive styles
  const isMobile = window.innerWidth <= 600;
  const containerClass = isMobile ? "w-full max-w-full mx-0 px-1" : "w-full max-w-sm mx-auto px-4";
  const closeBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0.5,
    right: 17,
    background: 'transparent',
    border: 'none',
    fontSize: isMobile ? '1.2rem' : '1.5rem',
    color: '#7B4E2E',
    cursor: 'pointer',
    zIndex: 10,
  };
  return (
    <div className={containerClass} style={{ position: "relative" }}>
      {/* Bouton de fermeture en haut à droite */}
      <button
        onClick={onCancel}
        style={closeBtnStyle}
        aria-label="Fermer la modale"
      >
        ×
      </button>
      <div className="bg-[#FBFFEE] p-6 rounded-lg transform hover:scale-[1.01] transition-all text-center">
        {user && (
          <div className="mb-6">
            <ProfileCard userData={user} customClass="h-auto" />
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
            Modifier le mot de passe
          </h2>
          {error && <p className="text-red-500 text-center text-sm font-semibold">{error}</p>}
          {success && <p className="text-green-600 text-center text-sm font-semibold">{success}</p>}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              placeholder="Mot de passe actuel"
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
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Nouveau mot de passe"
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
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirmer le nouveau mot de passe"
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
};

export default EditPasswordForm;
