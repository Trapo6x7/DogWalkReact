import { useState, useEffect } from "react";
import { ProfileCard } from "./ProfileCard";
import { useAuth } from "../context/AuthContext";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LeafletMouseEvent } from "leaflet";
import GroupComments from "./GroupComments";

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
  const [showWalkForm, setShowWalkForm] = useState(false);
  const [walkName, setWalkName] = useState("");
  const [walkLocation, setWalkLocation] = useState("");
  const [walkDate, setWalkDate] = useState("");
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null
  );
  const [selectedWalkIndex, setSelectedWalkIndex] = useState(0);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    [48.8584, 2.2945],
  );
  const defaultCenter = [48.8584, 2.2945]; // Paris
  const center =
    selectedGroup?.walks?.[selectedWalkIndex]?.location &&
    typeof selectedGroup.walks[selectedWalkIndex].location === "string" &&
    selectedGroup.walks[selectedWalkIndex].location
      .split(",")
      .map((coord: string) => Number(coord)) // Typage explicite de `coord`
      .every((coord: number) => !isNaN(coord)) // Typage explicite de `coord`
      ? selectedGroup.walks[selectedWalkIndex].location
          .split(",")
          .map((coord: string) => Number(coord)) // Typage explicite de `coord`
      : defaultCenter;
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

  const fetchWalks = async (groupId: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/groups/${groupId}/walks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des balades");
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleShowDetails = async (groupId: number) => {
    try {
      const groupResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/groups/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!groupResponse.ok) {
        throw new Error("Erreur lors de la récupération des détails du groupe");
      }

      const groupData = await groupResponse.json();
      const walks = await fetchWalks(groupId);

      setSelectedGroup({
        ...groupData,
        walks, // Ajoute les balades récupérées séparément
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des détails :", error);
    }
  };

  // Composant pour gérer le clic sur la carte
  function LocationMarker() {
    useMapEvents({
      click(e: LeafletMouseEvent) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        setWalkLocation(`${lat},${lng}`);
      },
    });
    return markerPosition ? <Marker position={markerPosition} /> : null;
  }
  useEffect(() => {
    if (showWalkForm && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          setMapCenter([48.8584, 2.2945]); // fallback Paris
        }
      );
    }
  }, [showWalkForm]);

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
  <article className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-[90%] h-[80%] mx-auto relative overflow-scroll">
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
        onClick={() => setSelectedGroup(null)}
      >
        ✕
      </button>
      <div className="flex flex-col gap-8">
        {/* Titre */}
        <h2 className="text-3xl font-bold text-gray-800 text-center uppercase">
          Détails du groupe
        </h2>

        {/* Informations générales */}
        <section className="border-b pb-6">
          <h3 className="text-xl font-bold text-gray-800 uppercase mb-4">
            Informations générales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-lg">
              <strong>Nom :</strong> {selectedGroup.name}
            </p>
            <p className="text-lg">
              <strong>Description :</strong> {selectedGroup.comment}
            </p>
            <p className="text-lg">
              <strong>Mixte :</strong> {selectedGroup.mixed ? "Oui" : "Non"}
            </p>
            <p className="text-lg">
              <strong>Créé le :</strong>{" "}
              {new Date(selectedGroup.createdAt || "").toLocaleDateString()}
            </p>
            <p className="text-lg">
              <strong>Balades :</strong> {selectedGroup.walks?.length ?? 0}
            </p>
          </div>
        </section>

        {/* Commentaires */}
        <section className="border-b pb-6">
          <h3 className="text-xl font-bold text-gray-800 uppercase mb-4">
            Commentaires
          </h3>
          <GroupComments
            group={selectedGroup}
            user={{ username: user?.name || "Anonyme" }}
          />
        </section>

        {/* Demandes en attente */}
        {isCreator &&
          selectedGroup &&
          Array.isArray(selectedGroup.groupRequests) &&
          selectedGroup.groupRequests.length > 0 && (
            <section className="border-b pb-6">
              <h3 className="text-xl font-bold text-gray-800 uppercase mb-4">
                Demandes en attente
              </h3>
              <ul className="space-y-2">
                {selectedGroup.groupRequests.map((request) => (
                  <li
                    key={request.id}
                    className="border p-3 rounded-lg flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <span>
                      {request.user?.email ?? "Utilisateur inconnu"}
                    </span>
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Accepter
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

        {/* Balades */}
        <section className="border-b pb-6">
          <h3 className="text-xl font-bold text-gray-800 uppercase mb-4">
            Balades
          </h3>
          {selectedGroup.walks && selectedGroup.walks.length > 0 ? (
            <section className="space-y-4">
              <article className="h-64 w-full rounded-lg overflow-hidden">
                <MapContainer
                  center={
                    selectedGroup.walks[selectedWalkIndex]?.location
                      ?.split(",")
                      .map(Number)
                      .every((coord: number) => !isNaN(coord))
                      ? selectedGroup.walks[selectedWalkIndex].location
                          .split(",")
                          .map(Number)
                      : [48.8584, 2.2945]
                  }
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                </MapContainer>
              </article>
            </section>
          ) : (
            <p className="text-gray-600">Aucune balade disponible.</p>
          )}
        </section>

        {/* Boutons */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          {isCreator && (
            <button
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setShowWalkForm(true)}
              disabled={!selectedGroup || showWalkForm}
            >
              Créer une balade
            </button>
          )}
          {canRequestJoin && (
            <button
              onClick={() => handleJoinGroup(selectedGroup.id)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Rejoindre ce groupe
            </button>
          )}
        </div>
      </div>
    </div>
  </article>
)}

        {showWalkForm && selectedGroup && (
          <article className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-[40%] relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
                onClick={() => setShowWalkForm(false)}
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Créer une balade
              </h2>
              <form
                className="flex flex-col gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!walkName || !walkLocation || !walkDate || !selectedGroup)
                    return;
                  try {
                    const response = await fetch(
                      `${import.meta.env.VITE_API_URL}/api/walks`,
                      {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/ld+json",
                        },
                        body: JSON.stringify({
                          name: walkName,
                          location: walkLocation,
                          startAt: new Date(walkDate).toISOString(),
                          walkGroup: `/api/groups/${selectedGroup.id}`,
                        }),
                      }
                    );
                    if (!response.ok) throw new Error("Erreur création balade");
                    setShowWalkForm(false);
                    setWalkName("");
                    setWalkLocation("");
                    setWalkDate("");
                    setMarkerPosition(null);
                    alert("Balade créée !");
                    await handleShowDetails(selectedGroup.id);
                  } catch (err) {
                    alert("Erreur lors de la création de la balade.");
                  }
                }}
              >
                <input
                  className="border p-3 rounded-lg w-full"
                  type="text"
                  placeholder="Nom de la balade"
                  value={walkName}
                  onChange={(e) => setWalkName(e.target.value)}
                  required
                />
                <div className="h-64 w-full mb-4 rounded-lg">
                  <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    <LocationMarker />
                  </MapContainer>
                </div>
                <input
                  className="border p-3 rounded-lg w-full"
                  type="text"
                  placeholder="Lieu (lat,lng)"
                  value={walkLocation}
                  onChange={(e) => setWalkLocation(e.target.value)}
                  required
                  readOnly
                />
                <input
                  className="border p-3 rounded-lg w-full"
                  type="datetime-local"
                  value={walkDate}
                  onChange={(e) => setWalkDate(e.target.value)}
                  required
                />
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Valider
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400"
                    onClick={() => setShowWalkForm(false)}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </article>
        )}
      </div>
    </article>
  );
}
