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

  // Fonction pour rafraîchir les données utilisateur
  const onRefresh = () => {
    fetchUser();
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
            setUserData(updatedData); // Mettre à jour les données utilisateur
            setIsEditing(false); // Revenir à l'affichage du profil
          }}
          onRefresh={onRefresh} // Passer la fonction onRefresh
        />
      ) : (
        // Afficher le profil si isEditing est false
        <ProfileCard
          title={` ${userData?.name ?? "..."} . ${
            userData?.birthdate ? calculateAge(userData.birthdate) : "N/A"
          }`}
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
