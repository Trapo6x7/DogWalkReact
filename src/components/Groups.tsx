import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import GroupCreateForm from "./GroupCreateForm";
import GroupList from "./GroupList";
import GroupDetailsModal from "./GroupDetailsModal";

interface Group {
  id: number;
  name: string;
  mixed: boolean;
  comment: string;
  createdAt: string;
  updatedAt: string;
  groupRoles: Array<{ role: string; user: { id: number; name: string } }>;
  groupRequests: Array<{ id: number; user: { id: number; name: string } }>;
  walks: Array<{ id: number; location: string }>;
}

export default function Groups() {
  const { user } = useAuth();
  const [mixed, setMixed] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showWalkForm, setShowWalkForm] = useState(false);
  const [walkName, setWalkName] = useState("");
  const [walkLocation, setWalkLocation] = useState("");
  const [walkDate, setWalkDate] = useState("");
  const [markerPosition, setMarkerPosition] = useState(null);
  const selectedWalkIndex = 0;
  const [mapCenter, setMapCenter] = useState([48.8584, 2.2945]);
  const defaultCenter = [48.8584, 2.2945]; // Paris
  const center =
    selectedGroup?.walks?.[selectedWalkIndex]?.location &&
    typeof selectedGroup.walks[selectedWalkIndex].location === "string" &&
    selectedGroup.walks[selectedWalkIndex].location
      .split(",")
      .map((coord) => Number(coord)) // Typage explicite de `coord`
      .every((coord) => !isNaN(coord)) // Typage explicite de `coord`
      ? selectedGroup.walks[selectedWalkIndex].location
          .split(",")
          .map((coord) => Number(coord)) // Typage explicite de `coord`
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
      ? selectedGroup.groupRoles.some((role) => role.user?.id === user?.id)
      : false;

  const hasAlreadyRequested =
    selectedGroup && Array.isArray(selectedGroup.groupRequests)
      ? selectedGroup.groupRequests.some(
          (req) => req.user?.id === user?.id
        )
      : false;

  const canRequestJoin = !isAlreadyMember && !hasAlreadyRequested;

  const fetchGroups = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/groups`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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

      const newGroup = {
        id: createdGroup.id,
        name: createdGroup.name,
        description: createdGroup.comment,
        mixed: createdGroup.mixed,
        comment: createdGroup.comment,
        createdAt: createdGroup.createdAt,
        updatedAt: createdGroup.updatedAt || new Date().toISOString(), // Ensure updatedAt is present
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
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/ld+json",
          },
          body: JSON.stringify({
            walkGroup: `/api/groups/${groupId}`,
            user: user && user.id ? `/api/users/${user.id}` : undefined
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la demande d'adhésion");
      }

      alert("Demande envoyée avec succès !");
    } catch (error) {
      console.error("Erreur join group :", error);
      alert("Impossible d’envoyer la demande. Réessaie plus tard.");
    }
  };

  const fetchWalks = async (groupId: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/groups/${groupId}/walks`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/groups/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des détails du groupe");
      }

      const groupData = await response.json();
      const walks = await fetchWalks(groupId);

      setSelectedGroup({
        ...groupData,
        walks,
        updatedAt: groupData.updatedAt || new Date().toISOString(), // Ensure updatedAt is present
      });
    } catch (error) {
      console.error("Erreur récupération détails groupe :", error);
    }
  };
  return (
    <div className="w-full flex flex-col md:flex-row gap-4 box-border mx-auto">
      <div className="flex flex-col md:flex-row w-full gap-10">
        <div className="w-full mb-4 md:mb-0">
          <GroupCreateForm onCreateGroup={handleCreateGroup} />
        </div>
        <div className="w-full ">
          <GroupList
            groups={groups.map((group) => ({
              id: group.id,
              name: group.name,
              description: group.comment || "Pas de description",
            }))}
            onShowDetails={handleShowDetails}
          />
        </div>
      </div>
      {selectedGroup && (
        <GroupDetailsModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
          onJoinGroup={handleJoinGroup}
          onCreateWalk={() => setShowWalkForm(true)}
          isCreator={isCreator}
          canRequestJoin={canRequestJoin}
        />
      )}
    </div>
  );
}
