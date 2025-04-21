import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { getRequest } from "../utils/api";
import { UserData } from "../types/Interfaces";
import { ProfileCard } from "./ProfileCard";


export function Dogs() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [dogName, setDogName] = useState("");
  const [dogRace, setDogRace] = useState("");
  const [dogGender, setDogGender] = useState("");
  const [dogBirthdate, setDogBirthdate] = useState("");
  const [dogImage, setDogImage] = useState<File | null>(null);

  const fetchUserDogs = async () => {
    const token = localStorage.getItem("authToken");
    const response = await getRequest<UserData>("/me", {
      Authorization: `Bearer ${token}`,
    });

    if (!response.error) {
      setUserData(response.data);
    }
  };

  const handleAddDog = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    const formData = new FormData();
    formData.append("name", dogName);
    formData.append("race", dogRace);
    formData.append("gender", dogGender);
    formData.append("birthdate", new Date(dogBirthdate).toISOString());

    if (dogImage) {
      formData.append("file", dogImage);
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dogs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/ld+json",
      },
      body: formData,
    });

    if (response.ok) {
      setDogName("");
      setDogRace("");
      setDogGender("");
      setDogBirthdate("");
      setDogImage(null);
      setShowForm(false);
      fetchUserDogs();
    } else {
      console.error("Erreur lors de l'ajout du chien");
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
              src="/dwlogopatte.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      }
      footerContent={
        <Button
          className="w-full sm:w-1/2"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Annuler" : "Ajouter un chien"}
        </Button>
      }
      customClass="h-50"
    >
      <article className="flex flex-col items-center py-8 space-y-4">
        {showForm && (
          <form
            onSubmit={handleAddDog}
            className="w-full max-w-sm space-y-4 p-4 border rounded bg-white shadow"
            encType="multipart/form-data"
          >
            <input
              type="text"
              placeholder="Nom"
              value={dogName}
              onChange={(e) => setDogName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Race"
              value={dogRace}
              onChange={(e) => setDogRace(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={dogGender}
              onChange={(e) => setDogGender(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Sexe</option>
              <option value="male">Mâle</option>
              <option value="female">Femelle</option>
            </select>
            <input
              type="date"
              value={dogBirthdate}
              onChange={(e) => setDogBirthdate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setDogImage(e.target.files?.[0] || null)}
              className="w-full"
              required
            />
            <Button type="submit" className="w-full">
              Enregistrer
            </Button>
          </form>
        )}

        {userData?.dogs && userData.dogs.length > 0 ? (
          <div className="space-y-4 w-full">
            {userData.dogs.map((dog) => (
              <div
                key={dog.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-muted"
              >
                <div>
                  <h3 className="font-semibold">{dog.name}</h3>
                  <p className="text-sm text-muted-foreground">{dog.race}</p>
                </div>
                <Button variant="outline" size="sm">
                  Modifier
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
  );
}
