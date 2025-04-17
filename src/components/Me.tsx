import { useEffect, useState } from "react";
import { ProfileCard } from "./ProfileCard"; // Assure-toi de bien importer ProfileCard
import { Button } from "./ui/button"; // Si tu utilises un bouton ici
import { getRequest } from "../utils/api";
import { UserData } from "../types/Interfaces";
import { EditProfileForm } from "./EditProfileForm";

function calculateAge(birthdate: string): number {
  const birthDate = new Date(birthdate); // Convertir la date de naissance en objet Date
  const today = new Date(); // Obtenir la date actuelle
  let age = today.getFullYear() - birthDate.getFullYear(); // Calculer la différence d'années

  // Vérifier si l'anniversaire de cette année est déjà passé
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--; // Réduire l'âge si l'anniversaire n'est pas encore passé
  }

  return age;
}

export function Me() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false); // État pour basculer entre affichage et édition

  const fetchUser = async () => {
    const token = localStorage.getItem("authToken");
    const response = await getRequest<UserData>("/me", {
      Authorization: `Bearer ${token}`,
    });

    if (!response.error) {
      setUserData(response.data);
    } else {
      console.error(
        "Erreur lors de la récupération des infos utilisateur :",
        response.error
      );
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      {isEditing ? (
        // Afficher le formulaire de modification si isEditing est true
        <EditProfileForm
          userData={userData}
          onCancel={() => setIsEditing(false)} // Revenir à l'affichage du profil
          onSave={(updatedData: UserData) => {
            // Typage explicite de updatedData
            setUserData(updatedData); // Mettre à jour les données utilisateur
            setIsEditing(false); // Revenir à l'affichage du profil
          }}
        />
      ) : (
        // Afficher le profil si isEditing est false
        <ProfileCard
          title={` ${userData?.name?? "..."} . ${userData?.birthdate ? calculateAge(userData.birthdate) : "N/A"}`}
          headerContent={
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                {userData?.imageFilename ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/images/${
                      userData.imageFilename
                    }`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl">{userData?.name?.[0]}</span>
                  </div>
                )}
              </div>
              {/* Bouton pour modifier la photo de profil */}
              <Button
                className="absolute bottom-0 right-0 p-2 rounded-full"
                onClick={() => document.getElementById("upload-photo")?.click()} // Ouvre l'input file
              >
                +
              </Button>
              <input
                type="file"
                id="upload-photo"
                style={{ display: "none" }} // Cache l'input file
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append("file", file);

                    try {
                      const token = localStorage.getItem("authToken");
                      const response = await fetch(
                        `${import.meta.env.VITE_API_URL}/api/users/image`,
                        {
                          method: "POST",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                          body: formData,
                        }
                      );

                      if (response.ok) {
                        const updatedUser = await response.json();
                        setUserData(updatedUser); // Met à jour l'image de l'utilisateur
                        alert("Photo de profil mise à jour avec succès !");
                      } else {
                        alert(
                          "Erreur lors de la mise à jour de la photo de profil."
                        );
                      }
                    } catch (error) {
                      console.error("Erreur :", error);
                      alert("Une erreur est survenue.");
                    }
                  }
                }}
              />
            </div>
          }
          footerContent={
            <Button
              className="w-full sm:w-1/2"
              onClick={() => setIsEditing(true)} // Passer en mode édition
            >
              Modifier ma bio
            </Button>
          }
        >
          <article className="flex flex-col items-center py-8">
            <p>{userData?.description}</p>
          </article>
        </ProfileCard>
      )}
    </div>
  );
}
