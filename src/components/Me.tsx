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
      <div className="w-full max-w-md h-full mx-auto">
        {/* Mobile Accordion Layout (inchangé) */}
        {localUserData && (
          <div>
            <div className="block md:hidden w-full">
              <div className="bg-[#FBFFEE] rounded-xl max-w-md mx-auto flex flex-col shadow-lg p-4 gap-6">
                <details className="max-w-md mx-auto w-full">
                  <summary className="flex flex-col items-center gap-2 cursor-pointer select-none px-4 max-w-md mx-auto w-full">
                    <div className="flex items-center justify-center gap-8 w-full min-w-sm max-w-md mx-auto">
                      <div className="relative w-20 h-20 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                          {localUserData.imageFilename ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL}/uploads/images/${localUserData.imageFilename}`}
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
                        </div>
                        <Button
                          className="absolute bottom-0 right-0 p-0.5 text-xs rounded-full bg-[var(--primary-green)] text-white min-w-0 leading-none w-5 h-5 shadow"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('upload-photo')?.click();
                          }}
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
                      <h2 className="text-xl font-bold text-secondary-brown uppercase leading-none mt-2">{localUserData.name}</h2>
                      <span className="text-sm text-secondary-brown mb-2">
                        {localUserData.birthdate
                          ? `${calculateAge(localUserData.birthdate)} ans`
                          : "Âge inconnu"}
                      </span>
                    </div>
                  </summary>
                  <div className="mt-4 flex flex-col gap-2 px-4 pb-4 max-w-md mx-auto w-full">
                    <div className="flex flex-row justify-between items-start">
                      <span className="text-sm text-secondary-brown uppercase font-bold">DESCRIPTION :</span>
                      <span className="text-sm text-secondary-brown text-right max-w-[60%]">
                        {localUserData.description || "Aucune description disponible."}
                      </span>
                    </div>
                    <div className="flex flex-row justify-between items-start">
                      <span className="text-sm text-secondary-brown uppercase font-bold">EMAIL :</span>
                      <span className="text-sm text-secondary-brown text-right max-w-[60%]">
                        {localUserData.email || "Non renseigné"}
                      </span>
                    </div>
                    <div className="flex flex-row justify-between items-start">
                      <span className="text-sm text-secondary-brown uppercase font-bold">VILLE :</span>
                      <span className="text-sm text-secondary-brown text-right max-w-[60%]">
                        {localUserData.city ? capitalizeFirstLetter(localUserData.city) : "Non renseignée"}
                      </span>
                    </div>
                    <div className="my-3 w-full">
                      <div className="h-px w-full bg-[rgba(123,78,46,0.2)]"></div>
                    </div>
                    <button
                      className="bg-[var(--primary-green)] text-[var(--primary-brown)] font-medium rounded-md w-full py-2 mt-2 hover:bg-[#B7D336] transition"
                      onClick={openEditModal}
                      type="button"
                    >
                      Modifier le profil
                    </button>
                  </div>
                </details>
              </div>
            </div>
            {/* Desktop Layout (structure Dogs, une seule card) */}
            <div className="hidden md:block w-full">
              <div className="bg-[#FBFFEE] rounded-xl w-full flex flex-col shadow-lg p-10 gap-0 h-[370px] max-h-[370px] min-h-[370px] justify-between">
                {/* Header Section - aligné Dogs */}
                <div className="flex flex-col items-center justify-center gap-2 mb-2">
                  <div className="flex items-center justify-center gap-4">
                    <div className="relative w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white flex-shrink-0">
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
                      <Button
                        className="absolute bottom-0 right-0 p-0.5 text-xs rounded-full bg-[var(--primary-green)] text-white min-w-0 leading-none w-4 h-4"
                        onClick={() => document.getElementById('upload-photo-desktop')?.click()}
                      >
                        +
                      </Button>
                      <input
                        type="file"
                        id="upload-photo-desktop"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handlePhotoUpload(file);
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h2 className="text-2xl font-bold text-secondary-brown uppercase leading-none">{localUserData.name}</h2>
                      <span className="text-sm text-secondary-brown">
                        {localUserData.birthdate
                          ? `${calculateAge(localUserData.birthdate)} ans`
                          : "Âge inconnu"}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Infos Section - aligné Dogs */}
                <div className="w-full flex flex-col items-center">
                  <div className="w-full bg-white rounded-lg p-4 flex flex-col gap-2">
                    <div className="flex flex-row justify-between items-start">
                      <span className="text-sm text-secondary-brown uppercase font-bold">DESCRIPTION :</span>
                      <span className="text-sm text-secondary-brown text-right max-w-[60%]">
                        {localUserData.description || "Aucune description disponible."}
                      </span>
                    </div>
                    <div className="flex flex-row justify-between items-start">
                      <span className="text-sm text-secondary-brown uppercase font-bold">EMAIL :</span>
                      <span className="text-sm text-secondary-brown text-right max-w-[60%]">
                        {localUserData.email || "Non renseigné"}
                      </span>
                    </div>
                    <div className="flex flex-row justify-between items-start">
                      <span className="text-sm text-secondary-brown uppercase font-bold">VILLE :</span>
                      <span className="text-sm text-secondary-brown text-right max-w-[60%]">
                        {localUserData.city ? capitalizeFirstLetter(localUserData.city) : "Non renseignée"}
                      </span>
                    </div>
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
            </div>
          </div>
        )}
        {/* Modale EditProfileForm centrée */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="rounded-xl bg-white p-8 min-w-[320px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
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
    </div>
  );
}
