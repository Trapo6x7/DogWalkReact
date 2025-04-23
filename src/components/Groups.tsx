import { useState, useEffect } from "react";
import { ProfileCard } from "./ProfileCard";
import { useAuth } from "../context/AuthContext";

type Group = {
  id: number;
  name: string;
  description: string;
  mixed: boolean;
  comment?: string;
  createdAt?: string;
  groupRequests?: any[];
  groupRoles?: any[];
  walks?: any[];
};

export default function Groups() {
  const { token } = useAuth();
  const [mixed, setMixed] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/groups`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/ld+json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des groupes");
      }

      const data = await response.json();

      setGroups(data["member"]);
    } catch (error) {
      console.error("Erreur fetch groupes :", error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async () => {
    if (!name || !description) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/groups`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/ld+json",
          },
          body: JSON.stringify({
            name,
            comment: description,
            mixed,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la création du groupe");
      }

      const createdGroup = await response.json();

      // Tu peux adapter selon la réponse exacte de l’API
      const newGroup = {
        id: createdGroup.id ?? groups.length + 1,
        name: createdGroup.name,
        description: createdGroup.comment,
        mixed: createdGroup.mixed,
      };

      setGroups([...groups, newGroup]);
      setName("");
      setDescription("");
    } catch (error) {
      console.error(error);
      alert("Impossible de créer le groupe. Réessaie plus tard.");
    }
  };

  const handleShowDetails = async (groupId: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/groups/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/ld+json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des détails du groupe");
      }

      const data = await response.json();
      setSelectedGroup({
        id: data.id,
        name: data.name || "DogWalk # ${data.id}",
        description: data.comment,
        mixed: data.mixed,
        comment: data.comment,
        createdAt: data.createdAt,
        groupRequests: data.groupRequests,
        groupRoles: data.groupRoles,
        walks: data.walks,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des détails :", error);
    }
  };

  return (
    <article className="px-38 flex w-full h-full">
      {/* Formulaire de création (70% de l'écran) */}
      <div className="w-1/2 p-8">
        <ProfileCard
          title="Créer un groupe"
          footerContent={
            <button
              onClick={handleCreateGroup}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Créer
            </button>
          }
        >
          <div className="space-y-2">
            <input
              className="border p-2 rounded w-full"
              type="text"
              placeholder="Nom du groupe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="border p-2 rounded w-full"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="mixed"
              checked={mixed}
              onChange={(e) => setMixed(e.target.checked)}
            />
            <label htmlFor="mixed" className="text-sm text-gray-700">
              Groupe mixte
            </label>
          </div>
        </ProfileCard>
      </div>

      {/* Liste des groupes existants (30% de l'écran) */}
      <div className="w-1/2 p-8">
        <ProfileCard title="Groupes existants" customClass="overflow-y-scroll">
          <div className="space-y-4">
            {groups.map((group) => (
              <div key={group.id} className="border rounded p-3 bg-white">
                <p className="font-semibold">{group.name}</p>
                <p className="text-sm text-gray-600">{group.description}</p>
                <button
                  onClick={() => handleShowDetails(group.id)}
                  className="mt-2 text-blue-600 underline text-sm"
                >
                  Voir détails
                </button>
              </div>
            ))}
          </div>
        </ProfileCard>
        {selectedGroup && (
          <article className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-100">
            <div className="bg-white p-20 rounded shadow-lg w-[60%] h-[50%] relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
                onClick={() => setSelectedGroup(null)}
              >
                ✕
              </button>

              <div className="flex flex-col justify-center items-center gap-5">
                <h2 className="text-xl font-bold">Détails du groupe</h2>
                <p>
                  <strong>Nom :</strong> {selectedGroup.name}
                </p>
                <p>
                  <strong>Description :</strong> {selectedGroup.comment}
                </p>
                <p>
                  <strong>Mixte :</strong> {selectedGroup.mixed ? "Oui" : "Non"}
                </p>
                <p>
                  <strong>Créé le :</strong>{" "}
                  {new Date(selectedGroup.createdAt || "").toLocaleDateString()}
                </p>
                <p>
                  <strong>Demandes :</strong>{" "}
                  {selectedGroup.groupRequests?.length ?? 0}
                </p>
                <p>
                  <strong>Membres :</strong>{" "}
                  {selectedGroup.groupRoles?.length ?? 0}
                </p>
                <p>
                  <strong>Balades :</strong> {selectedGroup.walks?.length ?? 0}
                </p>
              </div>
            </div>
          </article>
        )}
      </div>
    </article>
  );
}
