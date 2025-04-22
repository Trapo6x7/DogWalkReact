import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { getRequest, deleteRequest } from "../utils/api";
import { UserData } from "../types/Interfaces";
import { ProfileCard } from "./ProfileCard";

export function Dogs() {
  const [userData, setUserData] = useState<UserData | null>(null);

  console.log(userData);

  const fetchUserDogs = async () => {
    const token = localStorage.getItem("authToken");

    const response = await getRequest<UserData>("/api/me", {
      Authorization: `Bearer ${token}`,
    });

    if (!response.error) {
      setUserData(response.data);
    } else {
      console.error("Erreur lors de la récupération des données utilisateur");
    }
  };

  const handleDeleteDog = async (dogId: string) => {
    const token = localStorage.getItem("authToken");

    if (!userData) {
      console.error("Utilisateur non trouvé");
      return;
    }

    const dog = userData.dogs.find((d) => d.id.toString() === dogId);
    if (!dog) {
      console.error("Le chien n'a pas été trouvé.");
      return;
    }


    const isUserOwner = dog.user === "/api/me";
    if (!isUserOwner) {
      console.error("Vous ne pouvez supprimer que vos propres chiens.");
      return;
    }

    try {
      const response = await deleteRequest(`/api/dogs/${dogId}`, {
        Authorization: `Bearer ${token}`,
      });

      if (response.ok) {
        fetchUserDogs();
      } else {
        console.error("Erreur lors de la suppression du chien :", response.error);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleDogImageUpload = async (dogId: string, file: File) => {
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/dogs/${dogId}/image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "application/ld+json",
          },
          body: formData,
        }
      );

      if (response.ok) {
        fetchUserDogs();
        alert("Photo du chien mise à jour !");
      } else {
        console.error("Erreur lors de la mise à jour de l'image du chien");
        alert("Échec de la mise à jour.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue.");
    }
  };

  useEffect(() => {
    fetchUserDogs();
  }, []);

  return (
    <>
      <ProfileCard
        title="Mes chiens"
        headerContent={
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
              <img
                src="/dwlogopatte.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        }
        footerContent={<></>}
        customClass="h-[10%]"
      >
        <article className="flex flex-wrap items-center justify-center h-full w-full py-8 px-6 overflow-hidden">
          {userData?.dogs && userData.dogs.length > 0 ? (
            <div className="space-y-4 w-full">
              {userData.dogs.map((dog) => (
                <div
                  key={dog.id}
                  className="flex items-center justify-between p-4 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                        <img
                          src={`${import.meta.env.VITE_API_URL}/uploads/images/${
                            dog.imageFilename
                          }`}
                          alt={`Photo de ${dog.name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        className="absolute bottom-0 right-0 p-1 text-xs rounded-full bg-green-500 text-white"
                        onClick={() =>
                          document.getElementById(`upload-photo-${dog.id}`)?.click()
                        }
                      >
                        +
                      </Button>
                      <input
                        type="file"
                        id={`upload-photo-${dog.id}`}
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleDogImageUpload(dog.id.toString(), file);
                          }
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{dog.name}</h3>
                      <p className="text-sm text-muted-foreground">{dog.race}</p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleDeleteDog(dog.id.toString())}
                    className="text-red-500"
                  >
                    Supprimer
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Vous n'avez pas encore ajouté de chien.
            </p>
          )}
        </article>
      </ProfileCard>
    </>
  );
}
