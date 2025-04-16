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

const uploadImage = async (file: File) => {
  const token = localStorage.getItem("authToken");
  const formData = new FormData();

  // Assurez-vous que le nom du champ correspond à ce qui est attendu par l'API
  formData.append("file", file);

  const url = `${import.meta.env.VITE_API_URL}/api/users/image`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Retirez le Content-Type pour laisser le navigateur le gérer avec le multipart/form-data
      },
      body: formData,
    });

    // Log de la réponse complète pour le débogage
    const responseText = await response.text();
    console.log("Server response:", responseText);

    if (!response.ok) {
      console.error("Upload error response:", responseText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return responseText ? JSON.parse(responseText) : { success: true };
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export function Me() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userData?.id) return;

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      console.log("Upload result:", result);

      // Attendre un peu avant de rafraîchir les données
      setTimeout(() => {
        fetchUser();
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm bg-card h-[13rem] flex flex-col justify-between">
      <CardHeader className="flex items-center gap-4">
      
          <div className="relative">
            {/* Avatar ou image de profil */}
            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
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
                  <span className="text-2xl">{userData?.name?.[0]}</span>
                </div>
              )}
            </div>
            {/* Input file caché */}
            <input
              type="file"
              id="profile-image"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isUploading}
            />
            {/* Bouton pour déclencher l'input file */}
            <Button
              variant="outline"
              size="sm"
              className="absolute bottom-0 right-4.5 w-6 h-6 p-0 min-w-0"
              onClick={() => document.getElementById("profile-image")?.click()}
              disabled={isUploading}
            >
              {isUploading ? "..." : "+"}
            </Button>
          </div>

          <div>
            <CardTitle>
              <h1>Bienvenue {userData?.name ?? "!"}</h1></CardTitle>
            <CardDescription>
              <p>{userData?.email}</p>
            </CardDescription>
          </div>

      </CardHeader>
      <CardContent>{/* faire le content */}</CardContent>
      <CardFooter className="flex justify-end items-end">
        <Button className="w-1/2">Modifier mon profil</Button>
      </CardFooter>
    </Card>
  );
}
