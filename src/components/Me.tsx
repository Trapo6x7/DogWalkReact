import { useEffect, useState } from "react";
import { ProfileCard } from "./ProfileCard"; // Assure-toi de bien importer ProfileCard
import { Button } from "./ui/button"; // Si tu utilises un bouton ici
import { getRequest } from "../utils/api";
import { UserData } from "../types/Interfaces";

export function Me() {
  const [userData, setUserData] = useState<UserData | null>(null);
  console.log(userData);
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
    <ProfileCard
      title={`Bienvenue ${userData?.name ?? "!"}!`}
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
        <Button className="w-full sm:w-1/2">Modifier mon profil</Button>
      }
    >
      <article className="flex flex-col items-center py-8">
        <p>{userData?.description}</p>
      </article>
    </ProfileCard>
  );
}
