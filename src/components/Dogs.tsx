import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { getRequest } from "../utils/api";
import { UserData } from "../types/Interfaces";
import { ProfileCard } from "./ProfileCard";

export function Dogs() {
  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchUserDogs = async () => {
    const token = localStorage.getItem("authToken");
    const response = await getRequest<UserData>("/me", {
      Authorization: `Bearer ${token}`,
    });

    if (!response.error) {
      setUserData(response.data);
    }
  };

  useEffect(() => {
    fetchUserDogs();
  }, []);

  return (
    <ProfileCard
      title="Mes chiens"
      headerContent={
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
           
              <img
                src='/dwlogopatte.png'
                alt="Profile"
                className="w-full h-full object-cover"
              />
            
          </div>
        </div>
      }
      footerContent={<Button className="w-full sm:w-1/2">Ajouter un chien</Button>}
      customClass="h-50"
    >  
     <article className="flex flex-col items-center py-8">
      {userData?.dogs && userData.dogs.length > 0 ? (
        <div className="space-y-4">
          {userData.dogs.map((dog) => (
            <div
              key={dog.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-muted"
            >
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-semibold">{dog.name}</h3>
                  <p className="text-sm text-muted-foreground">{dog.race}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Modifier</Button>
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
  );
}
