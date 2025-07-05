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
    <div style={{ width: "100%", maxWidth: "450px", display: "flex", flexDirection: "column", alignItems: "center", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#FBFFEE", borderRadius: "0.5rem", width: "100%", display: "flex", flexDirection: "column", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "1rem", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ width: "4rem", height: "4rem", borderRadius: "50%", backgroundColor: "rgb(229, 231, 235)", overflow: "hidden", border: "2px solid white" }}>
            <img
              src="/dwlogopatte.png"
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <h2 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "var(--secondary-brown)", textTransform: "uppercase", margin: 0 }}>Mes chiens</h2>
          <div style={{ width: "4rem" }}></div> {/* Élément vide pour équilibrer la mise en page */}
        </div>

        {/* Content Section */}
        <div style={{ padding: "0.75rem 1.5rem" }}>
          {/* Dogs List Section */}
          <div style={{ display: "flex", flexDirection: "column", width: "100%", margin: "0.5rem 0", maxHeight: "65px", overflowY: "scroll", overflowX: "hidden" }}>
            {user?.dogs && user.dogs.length > 0 ? (
              user.dogs.map((dog) => (
                <div
                  key={dog.id}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid rgba(123, 78, 46, 0.1)" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ position: "relative" }}>
                      <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", backgroundColor: "rgb(229, 231, 235)", overflow: "hidden" }}>
                        <img
                          src={`${import.meta.env.VITE_API_URL}/uploads/images/${dog.imageFilename}`}
                          alt={`Photo de ${dog.name}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <Button
                        style={{ position: "absolute", bottom: "0", right: "0", padding: "0.125rem", fontSize: "0.625rem", borderRadius: "9999px", backgroundColor: "var(--primary-green)", color: "white", minWidth: "unset", lineHeight: "1", width: "1rem", height: "1rem" }}
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
                      <h3 style={{ fontWeight: "600", color: "var(--secondary-brown)", textTransform: "uppercase", fontSize: "0.875rem", margin: "0" }}>{dog.name}</h3>
                      <p style={{ fontSize: "0.75rem", color: "var(--secondary-brown)", margin: "0" }}>
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
                    style={{ fontSize: "0.75rem", color: "#e53e3e", backgroundColor: "transparent", padding: "0.25rem 0.5rem" }}
                    onClick={() => handleDeleteDog(dog.id.toString())}
                  >
                    Supprimer
                  </Button>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", color: "var(--secondary-brown)", fontSize: "0.875rem", margin: "1rem 0" }}>
                Vous n'avez pas encore ajouté de chien.
              </p>
            )}
          </div>

          {/* Separator */}
          <div style={{ margin: "0.75rem 0" }}>
            <div style={{ height: "1px", width: "100%", backgroundColor: "rgba(123, 78, 46, 0.2)" }}></div>
          </div>

          {/* Footer Section */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
            <button
              style={{ 
                backgroundColor: "var(--primary-green)", 
                color: "var(--primary-brown)", 
                padding: "0.5rem 1rem", 
                borderRadius: "0.375rem", 
                border: "none", 
                fontWeight: "500",
                transition: "background-color 0.3s ease",
                cursor: "pointer",
                width: "100%",
                fontSize: "0.875rem"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#B7D336"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "var(--primary-green)"}
              onClick={openAddModal}
            >
              Ajouter un chien
            </button>
          </div>
        </div>
      </div>

      {/* Modale AddDogs */}
      {isAddModalOpen && <AddDogs onCancel={closeAddModal} onRefresh={refreshUser} />}
    </div>
  );
}