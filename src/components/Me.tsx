import { useState } from "react";
import { useAuth } from "../context/AuthContext"; 
import { ProfileCard } from "./ProfileCard";
import { Button } from "./ui/button";

export function Me() {
  const { user, setUser } = useAuth();
  const [userData, setUserData] = useState(user);


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

  return (
    <div>
      {user && (
        <ProfileCard
          userData={user}
          title={` ${user.name} . ${
            user.birthdate ? calculateAge(user.birthdate) : "N/A"
          }`}
          headerContent={
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                {user.imageFilename ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/images/${
                      user.imageFilename
                    }`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl">{user.name?.[0]}</span>
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
                        setUserData(updatedUser); // local
                        setUser(updatedUser);     // global
                        alert("Photo de profil mise à jour avec succès !");
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
          footerContent={<></>}
          customClass="h-50"
        >
          <article className="flex flex-wrap items-center justify-center h-full w-full py-8 px-6 overflow-hidden">
            <p className="text-center overflow-hidden text-ellipsis whitespace-normal">
              {user.description}
            </p>
          </article>
        </ProfileCard>
      )}
    </div>
  );
}