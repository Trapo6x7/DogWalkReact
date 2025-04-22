import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { getRequest, deleteRequest } from "../utils/api"; // Assure-toi que deleteRequest existe
import { UserData } from "../types/Interfaces";
import { ProfileCard } from "./ProfileCard";
import AddDogs from "./AddDogs";

export function Dogs() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showAddDogForm, setShowAddDogForm] = useState(false);

  const fetchUserDogs = async () => {
    const token = localStorage.getItem("authToken");

    // Récupérer les données utilisateur depuis "/api/me"
    const response = await getRequest<UserData>("/api/me", {
      Authorization: `Bearer ${token}`,
    });

    if (!response.error) {
      const fetchedUserData = response.data;
      // Stocker les données utilisateur dans l'état
      setUserData(fetchedUserData);
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
    console.log(dog, isUserOwner);
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
        console.error(
          "Erreur lors de la suppression du chien :",
          response.error
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
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
        footerContent={
          <Button
            onClick={() => setShowAddDogForm(true)}
            className="bg-primary-green text-primary-brown px-4 py-2 rounded"
          >
            Ajouter un chien
          </Button>
        }
        customClass="h-50"
      >
        <article className="flex flex-col items-center py-8 space-y-4">
          {userData?.dogs && userData.dogs.length > 0 ? (
            <div className="space-y-4 w-full">
              {userData.dogs.map((dog) => (
                <div
                  key={dog.id}
                  className="flex items-center justify-between p-4 rounded-lg "
                >
                  <div>
                    <h3 className="font-semibold">{dog.name}</h3>
                    <p className="text-sm text-muted-foreground">{dog.race}</p>
                  </div>
                  <Button
                    variant="outline"
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

    
      {showAddDogForm && (
        <AddDogs
          onCancel={() => setShowAddDogForm(false)}
          onRefresh={fetchUserDogs}
        />
      )}
    </>
  );
}
