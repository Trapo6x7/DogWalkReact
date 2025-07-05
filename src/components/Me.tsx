import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import EditProfileForm from "./EditProfileForm";
import { UserData } from "../types/Interfaces";

interface MeProps {
  userData: any;
}

export function Me({ userData }: MeProps) {
  const { token, refreshUser } = useAuth();
  const [localUserData, setLocalUserData] = useState(userData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    setLocalUserData(userData);
  }, [userData]);

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const handleSave = (updatedData: UserData) => {
    setLocalUserData(updatedData); // Met à jour les données locales
    refreshUser(); // Recharge les données utilisateur globales
  };

  function handlePhotoUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    fetch(`${import.meta.env.VITE_API_URL}/api/users/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.imageFilename) {
          alert("Photo mise à jour avec succès !");
          setLocalUserData((prev: typeof userData) => ({
            ...prev,
            imageFilename: data.imageFilename,
          }));
          refreshUser();
        } else {
          alert("Échec de la mise à jour de la photo.");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de l'upload de la photo :", error);
        alert("Une erreur est survenue.");
      });
  }

  function calculateAge(birthdate: string): number {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <div style={{ width: "100%", maxWidth: "450px", display: "flex", flexDirection: "column", alignItems: "center", margin: "0 auto" }}>
      {localUserData && (
        <div style={{ backgroundColor: "#FBFFEE", borderRadius: "0.5rem", width: "100%", display: "flex", flexDirection: "column", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)" }}>
          {/* Header Section */}
          <div style={{ padding: "1rem", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ width: "4rem", height: "4rem", borderRadius: "50%", backgroundColor: "rgb(229, 231, 235)", overflow: "hidden", border: "2px solid white", position: "relative" }}>
              {localUserData.imageFilename ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/images/${
                    localUserData.imageFilename
                  }`}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "1.25rem", fontWeight: "bold", color: "rgb(31, 41, 55)" }}>
                    {localUserData.name?.[0]}
                  </span>
                </div>
              )}
              <Button
                style={{ position: "absolute", bottom: "0", right: "0", padding: "0.125rem", fontSize: "0.625rem", borderRadius: "9999px", backgroundColor: "var(--primary-green)", color: "white", minWidth: "unset", lineHeight: "1", width: "1rem", height: "1rem" }}
                onClick={() => document.getElementById("upload-photo")?.click()}
              >
                +
              </Button>
            </div>
            <input
              type="file"
              id="upload-photo"
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handlePhotoUpload(file);
                }
              }}
            />
            <h2 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "var(--secondary-brown)", textTransform: "uppercase", margin: 0 }}>
              {localUserData.name}
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--secondary-brown)", margin: 0 }}>
              {localUserData.birthdate
                ? `${calculateAge(localUserData.birthdate)} ans`
                : "Âge inconnu"}
            </p>
          </div>

          {/* Content Section */}
          <div style={{ padding: "0.75rem 1.5rem" }}>
            {/* Body Section - More compact version */}
            <div style={{ display: "flex", flexDirection: "column", width: "100%", margin: "0.5rem 0" }}>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <p style={{ fontSize: "0.875rem", color: "var(--secondary-brown)", textTransform: "uppercase", fontWeight: "bold", margin: "0" }}>
                  DESCRIPTION :
                </p>
                <p style={{ fontSize: "0.875rem", color: "var(--secondary-brown)", margin: "0", textAlign: "right" }}>
                  {localUserData.description || "Aucune description disponible."}
                </p>
              </div>
              
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <p style={{ fontSize: "0.875rem", color: "var(--secondary-brown)", textTransform: "uppercase", fontWeight: "bold", margin: "0" }}>
                  EMAIL :
                </p>
                <p style={{ fontSize: "0.875rem", color: "var(--secondary-brown)", margin: "0", textAlign: "right" }}>
                  {localUserData.email || "Non renseigné"}
                </p>
              </div>
              
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <p style={{ fontSize: "0.875rem", color: "var(--secondary-brown)", textTransform: "uppercase", fontWeight: "bold", margin: "0" }}>
                  VILLE :
                </p>
                <p style={{ fontSize: "0.875rem", color: "var(--secondary-brown)", margin: "0", textAlign: "right" }}>
                  {localUserData.city ? capitalizeFirstLetter(localUserData.city) : "Non renseignée"}
                </p>
              </div>
            </div>

            {/* Separator */}
            <div style={{ margin: "0.75rem 0" }}>
              <div style={{ height: "1px", width: "100%", backgroundColor: "rgba(123, 78, 46, 0.2)" }}></div>
            </div>
            
            {/* Footer Section */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
              <button
                style={{ 
                  backgroundColor: "var(--primary-green)", 
                  color: "var(--primary-brown)", 
                  padding: "0.5rem 1rem", 
                  borderRadius: "0.375rem", 
                  border: "none", 
                  fontWeight: "500",
                  transition: "background-color 0.3s ease",
                  cursor: "pointer",
                  width: "100%",
                  fontSize: "0.875rem"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#B7D336"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "var(--primary-green)"}
                onClick={openEditModal}
              >
                Modifier le profil
              </button>
            </div>
            
            {/* Espace supplémentaire en bas si nécessaire */}
          </div>
        </div>
      )}

      {/* Modale EditProfileForm */}
      {isEditModalOpen && (
        <EditProfileForm
          userData={localUserData}
          onCancel={closeEditModal}
          onRefresh={refreshUser}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
