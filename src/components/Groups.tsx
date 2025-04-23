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
  creator?: {
    id: number;
    email: string;
  };
};

export default function Groups() {
  const { token, user } = useAuth();
  const [mixed, setMixed] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const userId = user?.id;

  const isCreator =
    selectedGroup && Array.isArray(selectedGroup.groupRoles)
      ? selectedGroup.groupRoles.some(
          (role) => role.role === "CREATOR" && role.user?.id === userId
        )
      : false;

  const isAlreadyMember =
    selectedGroup && Array.isArray(selectedGroup.groupRoles)
      ? selectedGroup.groupRoles.some((role: any) => role.user?.id === user?.id)
      : false;

  const hasAlreadyRequested =
    selectedGroup && Array.isArray(selectedGroup.groupRequests)
      ? selectedGroup.groupRequests.some(
          (req: any) => req.user?.id === user?.id
        )
      : false;

  const canRequestJoin = !isAlreadyMember && !hasAlreadyRequested;

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

      if (!createdGroup.id) {
        throw new Error("L'identifiant du groupe n’a pas été renvoyé");
      }

      const newGroup: Group = {
        id: createdGroup.id,
        name: createdGroup.name,
        description: createdGroup.comment,
        mixed: createdGroup.mixed,
        comment: createdGroup.comment,
        createdAt: createdGroup.createdAt,
        groupRequests: createdGroup.groupRequests ?? [],
        groupRoles: createdGroup.groupRoles ?? [],
        walks: createdGroup.walks ?? [],
      };

      setGroups([...groups, newGroup]);
      setName("");
      setDescription("");
    } catch (error) {
      console.error(error);
      alert("Impossible de créer le groupe. Réessaie plus tard.");
    }
  };

  const handleJoinGroup = async (groupId: number) => {
    console.log(groupId);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/group_requests`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/ld+json",
          },
          body: JSON.stringify({
            walk_group: `/api/groups/${groupId}`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la demande d'adhésion");
      }

      alert("Demande envoyée avec succès !");
      await handleShowDetails(groupId);
    } catch (error) {
      console.error("Erreur join group :", error);
      alert("Impossible d’envoyer la demande. Réessaie plus tard.");
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/group_requests/${requestId}/accept`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/ld+json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la validation de la demande");
      }

      await handleShowDetails(selectedGroup?.id!);
    } catch (error) {
      console.error("Erreur acceptation :", error);
      alert("Impossible de valider la demande.");
    }
  };

  const handleShowDetails = async (groupId: number) => {
    console.log(groupId);
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
        name: data.name || `DogWalk # ${data.id}`,
        description: data.comment,
        mixed: data.mixed,
        comment: data.comment,
        createdAt: data.createdAt,
        groupRequests: data.groupRequests ?? [],
        groupRoles: data.groupRoles ?? [],
        walks: data.walks ?? [],
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des détails :", error);
    }
  };

  return (
    <article className="px-38 flex w-full h-full">
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
                <div className="items-center justify-center flex flex-col p-10">
                  <p>
                    <strong>Nom :</strong> {selectedGroup.name}
                  </p>
                  <p>
                    <strong>Description :</strong> {selectedGroup.comment}
                  </p>
                  <p>
                    <strong>Mixte :</strong>{" "}
                    {selectedGroup.mixed ? "Oui" : "Non"}
                  </p>
                  <p>
                    <strong>Créé le :</strong>{" "}
                    {new Date(
                      selectedGroup.createdAt || ""
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>Balades :</strong>{" "}
                    {selectedGroup.walks?.length ?? 0}
                  </p>

                  {isCreator && (
                    <>
                      <p>
                        <strong>Demandes :</strong>{" "}
                        {selectedGroup.groupRequests?.length ?? 0}
                      </p>
                      <p>
                        <strong>Membres :</strong>{" "}
                        {selectedGroup.groupRoles?.length ?? 0}
                      </p>
                      {selectedGroup.groupRequests &&
                        selectedGroup.groupRequests.length > 0 && (
                          <div className="mt-4 w-full">
                            <h3 className="font-semibold mb-2">
                              Demandes en attente
                            </h3>
                            <ul className="space-y-2">
                              {selectedGroup.groupRequests.map((request) => (
                                <li
                                  key={request.id}
                                  className="border p-3 rounded flex items-center justify-between"
                                >
                                  <span>
                                    {request.user?.email ??
                                      "Utilisateur inconnu"}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleAcceptRequest(request.id)
                                    }
                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                  >
                                    Accepter
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </>
                  )}

                  {canRequestJoin && (
                    <button
                      onClick={() => handleJoinGroup(selectedGroup.id)}
                      className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Rejoindre ce groupe
                    </button>
                  )}
                </div>
              </div>
            </div>
          </article>
        )}
      </div>
    </article>
  );
}
