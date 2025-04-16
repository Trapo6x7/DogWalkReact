import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { getRequest } from "../utils/api";
import { UserData } from "../types/Interfaces";

export function Dogs() {
  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchUserDogs = async () => {
    const token = localStorage.getItem("authToken");
    const response = await getRequest<UserData>("/me", {
      Authorization: `Bearer ${token}`,
    });

    if (!response.error) {
      setUserData(response.data);
    } else {
      console.error(
        "Erreur lors de la récupération des chiens :",
        response.error
      );
    }
  };

  useEffect(() => {
    fetchUserDogs();
  }, []);

  return (
    <Card className="w-full max-w-sm bg-card h-[15rem] flex flex-col justify-between">
      <CardHeader>
        <CardTitle> <h1>Mes chiens</h1></CardTitle>
        <CardDescription><p>Gérer mes compagnons à quatre pattes</p></CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {userData?.dogs && userData.dogs.length > 0 ? (
            userData.dogs.map((dog) => (
              <div
                key={dog.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                    {dog.image ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}/uploads/images/${dog.image}`}
                        alt={dog.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xl">🐕</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{dog.name}</h3>
                    <p className="text-sm text-gray-500">{dog.race}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Modifier
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              Vous n'avez pas encore ajouté de chien
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end items-end">
        <Button className="w-1/2">Ajouter un chien</Button>
      </CardFooter>
    </Card>
  );
}