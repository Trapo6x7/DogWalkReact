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
    <div className="w-full h-75 flex flex-col items-center">
      {localUserData && (
        <div className="bg-[#FBFFEE] rounded-lg w-full h-full flex flex-col">
          {/* Header Section */}
          <div className="p-6 flex flex-row justify-between px-15 items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white relative">
              {localUserData.imageFilename ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/images/${
                    localUserData.imageFilename
                  }`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">
                    {localUserData.name?.[0]}
                  </span>
                </div>
              )}
              <Button
                className="absolute bottom-0 right-0 p-1 text-xs rounded-full bg-green-500 text-white"
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
            <h2 className="text-lg font-bold text-gray-900 mt-4 uppercase">
              {localUserData.name}
            </h2>
            <p className="text-sm text-gray-700">
              {localUserData.birthdate
                ? `${calculateAge(localUserData.birthdate)} ans`
                : "Âge inconnu"}
            </p>
          </div>

          {/* Scrollable Section */}
          <div className="flex-1 overflow-y-auto">
            {/* Body Section */}
            <div className="p-6 flex flex-col gap-4 w-full text-justify border border-[#EBFFA8]">
              <div className="p-6 flex flex-row gap-8 justify-between w-full">
                {/* Left Column */}
                <div className="w-1/2 flex flex-col gap-2">
                  <p className="text-sm text-gray-800 text-start uppercase font-bold">
                    <strong>Description :</strong>{" "}
                  </p>
                  <p className="text-sm text-gray-800 text-start uppercase font-bold">
                    <strong>Email :</strong>{" "}
                  </p>
                  <p className="text-sm text-gray-800 text-start uppercase font-bold">
                    <strong>Ville :</strong>{" "}
                  </p>
                </div>

                {/* Right Column */}
                <div className="w-1/2 flex flex-col gap-2">
                  <p className="text-sm text-gray-800">
                    {localUserData.description ||
                      "Aucune description disponible."}
                  </p>
                  <p className="text-sm text-gray-800">
                    {localUserData.email || "Non renseigné"}
                  </p>
                  <p className="text-sm text-gray-800">
                    {localUserData.city
                      ? capitalizeFirstLetter(localUserData.city)
                      : "Non renseignée"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <div className="bg-[#FBFFEE] p-4 flex justify-center">
              <button
                className="bg-[#f6c23e] text-white px-4 py-2 rounded-lg hover:bg-[#e0ac2d] transition"
                onClick={openEditModal}
              >
                Modifier le profil
              </button>
            </div>
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
