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

export function Me() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");
      const response = await getRequest("/me", {
        Authorization: `Bearer ${token}`,
      });
      console.log("User data :", response.data);
      if (!response.error) {
        setUserData(response.data);
      } else {
        console.error(
          "Erreur lors de la récupération des infos utilisateur :",
          response.error
        );
      }
    };

    fetchUser();
  }, []);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Bienvenue {userData?.name ?? "!"}</CardTitle>
        <CardDescription>Tu es connecté·e à DogWalk</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          {userData
            ? `Ton email : ${userData.email}`
            : "Chargement des infos utilisateur..."}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end items-end">
        <Button className="w-1/2">Commencer</Button>
      </CardFooter>
    </Card>
  );
}
