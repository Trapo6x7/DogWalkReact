import { Button } from "./ui/button";
import { deleteRequest } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import AddDogs from "./AddDogs";

export function Dogs() {
  const { user, refreshUser, token } = useAuth();
  const [allRaces, setAllRaces] = useState<{ id: number; name: string }[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/races`)
      .then((res) => res.json())
      .then((data) => {
        setAllRaces(data.member || []);
      });
  }, []);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const handleDeleteDog = async (dogId: string) => {
    const dog = user?.dogs.find((d) => d.id.toString() === dogId);
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
        refreshUser();
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

  const handleDogImageUpload = async (dogId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/dogs/${dogId}/image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        refreshUser();
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

  return (
<section className="w-full h-75 flex flex-col items-center">
  <article className="bg-[#FBFFEE] rounded-lg w-full h-full flex flex-col">
    <div className="p-6 flex flex-row items-center gap-8 justify-between w-full">
      <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white">
        <img
          src="/dwlogopatte.png"
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      <h2 className="text-lg font-bold text-gray-900 mt-4 uppercase">Mes chiens</h2>
    </div>

    {/* Scrollable Section */}
    <div className="flex-1 overflow-y-auto">
      {/* Body Section */}
      <div className="p-6 flex flex-col gap-4 w-full text-justify border border-[#EBFFA8]">
        {user?.dogs && user.dogs.length > 0 ? (
          user.dogs.map((dog) => (
            <div
              key={dog.id}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/images/${dog.imageFilename}`}
                      alt={`Photo de ${dog.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    className="absolute bottom-0 right-0 p-1 text-xs rounded-full bg-green-500 text-white"
                    onClick={() =>
                      document
                        .getElementById(`upload-photo-${dog.id}`)
                        ?.click()
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
                  <h3 className="font-semibold text-gray-900 uppercase">{dog.name}</h3>
                  <p className="text-sm text-gray-700">
                    {!allRaces.length
                      ? "Chargement…"
                      : dog.race &&
                        (Array.isArray(dog.race)
                          ? dog.race.length > 0
                          : !!dog.race)
                      ? (Array.isArray(dog.race) ? dog.race : [dog.race])
                          .map((raceIri: string) => {
                            const raceId = raceIri.split("/").pop();
                            const raceObj = allRaces.find(
                              (r) => r.id.toString() === raceId
                            );
                            return raceObj ? raceObj.name : "Race inconnue";
                          })
                          .join(", ")
                      : "Aucune race"}
                  </p>
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
          ))
        ) : (
          <p className="text-center text-gray-700">
            Vous n'avez pas encore ajouté de chien.
          </p>
        )}
      </div>

      {/* Footer Section */}
      <div className="bg-[#FBFFEE] p-4 flex justify-center">
        <button
          className="bg-[#f6c23e] text-white px-4 py-2 rounded-lg hover:bg-[#e0ac2d] transition"
          onClick={openAddModal}
        >
          Ajouter un chien
        </button>
      </div>
    </div>
  </article>

  {/* Modale AddDogs */}
  {isAddModalOpen && <AddDogs onCancel={closeAddModal} onRefresh={refreshUser} />}
</section>
  );
}