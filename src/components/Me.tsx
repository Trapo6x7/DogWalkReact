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
    <div className="w-full flex flex-col items-center mx-6 mb-8">
      {localUserData && (
        <div className="bg-[#FBFFEE] rounded-xl w-full flex flex-col shadow-lg p-10 gap-6">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-2">
            <div className="relative w-16 h-16">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                {localUserData.imageFilename ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/images/${localUserData.imageFilename}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-800">
                      {localUserData.name?.[0]}
                    </span>
                  </div>
                )}
              </div>
              <Button
                className="absolute bottom-0 right-0 p-0.5 text-xs rounded-full bg-[var(--primary-green)] text-white min-w-0 leading-none w-4 h-4"
                onClick={() => document.getElementById("upload-photo")?.click()}
              >
                +
              </Button>
            </div>
            <input
              type="file"
              id="upload-photo"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handlePhotoUpload(file);
                }
              }}
            />
            <div className="flex flex-col gap-0.5">
              <h2 className="text-2xl font-bold text-secondary-brown uppercase leading-none">{localUserData.name}</h2>
              <span className="text-sm text-secondary-brown">
                {localUserData.birthdate
                  ? `${calculateAge(localUserData.birthdate)} ans`
                  : "Âge inconnu"}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full flex flex-col gap-2">
            <div className="flex flex-row justify-between">
              <span className="text-sm text-secondary-brown uppercase font-bold">DESCRIPTION :</span>
              <span className="text-sm text-secondary-brown text-right">
                {localUserData.description || "Aucune description disponible."}
              </span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-sm text-secondary-brown uppercase font-bold">EMAIL :</span>
              <span className="text-sm text-secondary-brown text-right">
                {localUserData.email || "Non renseigné"}
              </span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-sm text-secondary-brown uppercase font-bold">VILLE :</span>
              <span className="text-sm text-secondary-brown text-right">
                {localUserData.city ? capitalizeFirstLetter(localUserData.city) : "Non renseignée"}
              </span>
            </div>
          </div>

          {/* Separator */}
          <div className="my-3 w-full">
            <div className="h-px w-full bg-[rgba(123,78,46,0.2)]"></div>
          </div>

          {/* Footer Section */}
          <button
            className="bg-[var(--primary-green)] text-[var(--primary-brown)] font-medium rounded-md w-full py-2 mt-2 hover:bg-[#B7D336] transition"
            onClick={openEditModal}
            type="button"
          >
            Modifier le profil
          </button>
        </div>
      )}

      {/* Modale EditProfileForm centrée */}
      {isEditModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div style={{borderRadius: "0.75rem", padding: "2rem", minWidth: 320, maxWidth: "90vw", maxHeight: "90vh", overflowY: "auto" }}>
            <EditProfileForm
              userData={localUserData}
              onCancel={closeEditModal}
              onRefresh={refreshUser}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
}
