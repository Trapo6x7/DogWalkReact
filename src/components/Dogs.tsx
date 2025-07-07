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
    <div className="w-full max-w-[500px] flex flex-col items-center mx-auto mx-6 mb-8">
      <div className="bg-[#FBFFEE] rounded-xl w-full flex flex-col shadow-lg p-10 gap-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white flex-shrink-0">
            <img
              src="/logoronddogwalk2.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-secondary-brown uppercase">Mes chiens</h2>
        </div>

        {/* Liste des chiens */}
        <div className="w-full bg-white rounded-lg shadow-inner p-4 flex flex-col gap-4 max-h-[120px] overflow-y-auto">
          {user?.dogs && user.dogs.length > 0 ? (
            user.dogs.map((dog) => (
              <div
                key={dog.id}
                className="flex items-center gap-4 border-b border-[rgba(123,78,46,0.1)] pb-2 last:border-b-0 last:pb-0"
              >
                <div className="relative w-12 h-12">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/images/${dog.imageFilename}`}
                      alt={`Photo de ${dog.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    className="absolute bottom-0 right-0 p-0.5 text-xs rounded-full bg-[var(--primary-green)] text-white min-w-0 leading-none w-4 h-4"
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
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleDogImageUpload(dog.id.toString(), file);
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-bold text-secondary-brown text-lg truncate">{dog.name}</span>
                  <span className="text-xs text-secondary-brown truncate">
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
                  </span>
                </div>
                <Button
                  className="text-xs text-[#e53e3e] bg-transparent px-2 py-1"
                  onClick={() => handleDeleteDog(dog.id.toString())}
                >
                  Supprimer
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-secondary-brown text-sm my-2">
              Vous n'avez pas encore ajouté de chien.
            </p>
          )}
        </div>

        {/* Footer Section */}
        <button
          className="bg-[var(--primary-green)] text-[var(--primary-brown)] font-medium rounded-md w-full py-2 mt-2 hover:bg-[#B7D336] transition"
          onClick={openAddModal}
          type="button"
        >
          Ajouter un chien
        </button>
      </div>

      {/* Modale AddDogs centrée */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[1000] bg-black/30"
        >
          <div className="rounded-xl p-8 min-w-[320px] max-w-[90vw] max-h-[90vh] overflow-y-auto bg-white">
            <AddDogs onCancel={closeAddModal} onRefresh={refreshUser} />
          </div>
        </div>
      )}
    </div>
  );
}