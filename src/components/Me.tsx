import { useEffect, useState } from "react";
import { ProfileCard } from "./ProfileCard";
import { Button } from "./ui/button";
import { getRequest } from "../utils/api";
import { UserData } from "../types/Interfaces";
import { EditProfileForm } from "./EditProfileForm";
import EditPasswordForm from "./EditPasswordForm"; // Import du formulaire de changement de mot de passe

function calculateAge(birthdate: string): number {
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export function Me() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false); // État pour afficher le formulaire de changement de mot de passe

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

  const onRefresh = () => {
    fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      {isChangingPassword ? (
        
        <EditPasswordForm
       
 
        />
      ) : isEditing ? (
      
        <EditProfileForm
          userData={userData}
          onCancel={() => setIsEditing(false)}
          onSave={(updatedData: UserData) => {
            setUserData(updatedData);
            setIsEditing(false);
          }}
          onRefresh={onRefresh}
        />
      ) : (
       
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
              <Button
                className="absolute bottom-0 right-0 p-2 rounded-full"
                onClick={() => document.getElementById("upload-photo")?.click()}
              >
                +
              </Button>
              <input
                type="file"
                id="upload-photo"
                style={{ display: "none" }}
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
                        setUserData(updatedUser);
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
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="w-full sm:w-1/2"
                onClick={() => setIsEditing(true)}
              >
                Modifier ma bio
              </Button>
              <Button
                className="w-full sm:w-1/2 bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => setIsChangingPassword(true)} 
              >
                Changer mot de passe
              </Button>
            </div>
          }
        >
          <article className="flex flex-col items-center py-8 overflow-y-hidden ">
            <p>{userData?.description}</p>
          </article>
        </ProfileCard>
      )}
    </div>
  );
}