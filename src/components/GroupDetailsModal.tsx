import React, { useState, useEffect } from "react";
import UserProfileModal from "./UserProfileModal";
import LeafletMap from "./LeafletMap";
import GroupComments from "./GroupComments";

interface GroupDetailsModalProps {
  group: {
    id: number;
    name: string;
    comment: string;
    mixed: boolean;
    createdAt: string;
    walks: Array<{ id: number; location: string }>;
    groupRequests?: Array<{
      id: number;
      user?: { id?: number; name?: string; email?: string };
      status?: number | boolean | string;
      createdAt?: string;
    }>;
    groupRoles?: Array<{
      id: number;
      user?: { id?: number; name?: string; email?: string };
      role: string;
    }>;
  };
  onClose: () => void;
  onJoinGroup: (groupId: number) => void;
  onCreateWalk: () => void;
  isCreator: boolean;
  canRequestJoin: boolean;
  onDeleteGroup: (groupId: number) => void;
}

// Accepter une demande d'ajout et créer un groupRole MEMBER
const handleAcceptRequest = async (
  request: any,
  setLocalGroupRequests: Function
) => {
  try {
    const token = localStorage.getItem("authToken");
    let groupRequestId = request.id;
    if (!groupRequestId && request["@id"]) {
      const match = request["@id"].match(/group_requests\/(\d+)/);
      if (match) groupRequestId = match[1];
    }
    if (!groupRequestId)
      throw new Error("Impossible de déterminer l'id de la demande");
    // 1. PATCH la demande (status: true)
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/group_requests/${groupRequestId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/merge-patch+json",
          Accept: "application/ld+json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: true }),
      }
    );
    const data = await res.json();
    console.log("PATCH group_request data:", data);
    if (!res.ok) throw new Error("Erreur lors de la mise à jour");
    // 2. POST sur groupRole (role: MEMBER)
    console.log("request complet", request);
    const groupIri =
      data.walkGroup || request.walkGroup || request.group || request.groupId;
    const userIri =
      (request.user && request.user["@id"]) || request.user || request.userId;
    if (!groupIri || !userIri)
      throw new Error(
        "Impossible de déterminer l'IRI du groupe ou de l'utilisateur pour le groupRole"
      );
    console.log("avant POST groupRole", { groupIri, userIri });
    const roleRes = await fetch(
      `${import.meta.env.VITE_API_URL}/api/group_roles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
          Accept: "application/ld+json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          walkGroup: groupIri,
          user: userIri,
          role: "MEMBER",
        }),
      }
    );
    const roleData = await roleRes.json();
    console.log("POST group_role data:", roleData);
    if (!roleRes.ok) throw new Error("Erreur lors de la création du groupRole");
    setLocalGroupRequests((prev: any[]) =>
      prev.map((r) => {
        let rId = r.id;
        if (!rId && r["@id"]) {
          const match = r["@id"].match(/group_requests\/(\d+)/);
          if (match) rId = match[1];
        }
        return rId == groupRequestId ? { ...r, status: true } : r;
      })
    );
  } catch (e) {
    alert("Erreur lors de l’acceptation de la demande.");
  }
};

// Refuser une demande d'ajout
const handleRejectRequest = async (
  request: any,
  setLocalGroupRequests: Function
) => {
  try {
    const token = localStorage.getItem("authToken");
    let groupRequestId = request.id;
    if (!groupRequestId && request["@id"]) {
      const match = request["@id"].match(/group_requests\/(\d+)/);
      if (match) groupRequestId = match[1];
    }
    if (!groupRequestId)
      throw new Error("Impossible de déterminer l'id de la demande");
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/group_requests/${groupRequestId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/ld+json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    if (!res.ok) throw new Error("Erreur lors du refus");
    setLocalGroupRequests((prev: any[]) =>
      prev.filter((r) => {
        let rId = r.id;
        if (!rId && r["@id"]) {
          const match = r["@id"].match(/group_requests\/(\d+)/);
          if (match) rId = match[1];
        }
        return rId != groupRequestId;
      })
    );
  } catch (e) {
    alert("Erreur lors du refus de la demande.");
  }
};

const GroupDetailsModal: React.FC<GroupDetailsModalProps> = ({
  group,
  onClose,
  onJoinGroup,
  onCreateWalk,
  isCreator,
  canRequestJoin,
  onDeleteGroup,
}) => {
  const [userCoordinates, setUserCoordinates] = useState<
    [number, number] | null
  >(null);
  // Pour la modale profil utilisateur
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  // State React pour masquer le bouton "Rejoindre ce groupe" dès le clic
  const [joinClicked, setJoinClicked] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoordinates([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        () => {
          setUserCoordinates(null);
        }
      );
    }
  }, []);

  // Utilitaire pour récupérer l'id utilisateur courant (localStorage 'user' ou JWT 'authToken')
  function getCurrentUserId(): { id?: string; username?: string } {
    const userRaw = localStorage.getItem("user");
    console.log("DEBUG localStorage user:", userRaw);
    if (userRaw) {
      try {
        const parsed = JSON.parse(userRaw);
        console.log("DEBUG parsed user:", parsed);
        if (parsed && parsed.id) return { id: String(parsed.id) };
      } catch (e) {
        console.log("DEBUG error parsing user:", e);
      }
    }
    const token = localStorage.getItem("authToken");
    console.log("DEBUG localStorage authToken:", token);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("DEBUG parsed token payload:", payload);
        if (payload.id || payload.user_id || payload.sub)
          return { id: String(payload.id || payload.user_id || payload.sub) };
        if (payload.username) return { username: payload.username };
      } catch (e) {
        console.log("DEBUG error parsing token:", e);
      }
    }
    return {};
  }

  const [localGroupRequests, setLocalGroupRequests] = useState(
    group.groupRequests || []
  );
  useEffect(() => {
    setLocalGroupRequests(group.groupRequests || []);
  }, [group.groupRequests]);

  console.log("GroupDetailsModal group prop:", group);
  return (
    <section
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 md:p-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="group-details-title"
    >
      <article
        className="relative bg-[#FBFFEE] p-2 md:p-6 rounded-lg w-full max-w-3xl h-[95%] md:h-[80%] mx-auto overflow-y-auto"
        aria-label="Carte détails du groupe"
      >
        <button
          className="absolute top-2 right-2 md:top-4 md:right-4 text-secondary-brown text-xl md:text-2xl bg-none border-none cursor-pointer z-10"
          onClick={onClose}
          aria-label="Fermer la fenêtre de détails du groupe"
          type="button"
        >
          ×
        </button>
        <header>
          <h2
            id="group-details-title"
            className="text-xl md:text-2xl font-bold text-secondary-brown text-center uppercase pb-6"
          >
            Détails du groupe
          </h2>
          {/* <p className="text-[0.95rem] text-secondary-brown"><strong>Créateur :</strong> {group.creator_id.name}</p> */}
        </header>
        <section
          className="border-b border-[rgba(123,78,46,0.2)] pb-2 md:pb-4"
          aria-label="Informations principales du groupe"
        >
          <div className="flex flex-col  md:justify-between mt-4 md:items-center gap-2 md:gap-3">
            <p className="text-[0.95rem]">
              <span className="font-bold uppercase" style={{ color: '#7B4E2E' }}>Nom :</span> <span className="text-black ps-3">{group.name}</span>
            </p>
            <p className="text-[0.95rem]">
              <span className="font-bold uppercase" style={{ color: '#7B4E2E' }}>Description :</span> <span className="text-black ps-3">{group.comment}</span>
            </p>
            <p className="text-[0.95rem]">
              <span className="font-bold uppercase" style={{ color: '#7B4E2E' }}>Mixte :</span> <span className="text-black ps-3">{group.mixed ? "Oui" : "Non"}</span>
            </p>
            <p className="text-[0.95rem]">
              <span className="font-bold uppercase" style={{ color: '#7B4E2E' }}>Créé le :</span> <span className="text-black ps-3">{new Date(group.createdAt || "").toLocaleDateString()}</span>
            </p>
            <p className="text-[0.95rem]">
              <span className="font-bold uppercase" style={{ color: '#7B4E2E' }}>Balades :</span> <span className="text-black ps-3">{group.walks?.length ?? 0}</span>
            </p>
          </div>
        </section>
        {/* Section Membres et Créateur */}
        <section className="border-b border-[rgba(123,78,46,0.2)] pb-4" aria-label="Membres du groupe">
          <h3 className="text-base md:text-lg font-bold text-secondary-brown uppercase text-center py-4">
            Membres du groupe
          </h3>
          <ul className="flex flex-col items-center gap-2">
            {/* Créateur */}
            {group.groupRoles && group.groupRoles.filter((role: any) => role.role && role.role.toUpperCase() === 'CREATOR').map((role: any) => (
              <li key={role.id || role.user?.id || Math.random()} className="flex flex-row items-center gap-2 cursor-pointer hover:underline"
                  onClick={async () => {
                    if (role.user && role.user.id) {
                      setLoadingUser(true);
                      try {
                        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${role.user.id}`);
                        if (res.ok) {
                          const userData = await res.json();
                          setSelectedUser(userData);
                        } else {
                          setSelectedUser(role.user); // fallback
                        }
                      } catch {
                        setSelectedUser(role.user);
                      }
                      setLoadingUser(false);
                    } else if (role.user) {
                      setSelectedUser(role.user);
                    }
                  }}
              >
                <span className="font-bold uppercase" style={{ color: '#7B4E2E' }}>Créateur :</span>
                <span className="text-black">{role.user?.name || role.user?.email || 'Inconnu'}</span>
              </li>
            ))}
            {/* Membres (hors créateur) */}
            {group.groupRoles && group.groupRoles.filter((role: any) => role.role && role.role.toUpperCase() !== 'CREATOR').map((role: any) => (
              <li key={role.id || role.user?.id || Math.random()} className="flex flex-row items-center gap-2 cursor-pointer hover:underline"
                  onClick={async () => {
                    if (role.user && role.user.id) {
                      setLoadingUser(true);
                      try {
                        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${role.user.id}`);
                        if (res.ok) {
                          const userData = await res.json();
                          setSelectedUser(userData);
                        } else {
                          setSelectedUser(role.user); // fallback
                        }
                      } catch {
                        setSelectedUser(role.user);
                      }
                      setLoadingUser(false);
                    } else if (role.user) {
                      setSelectedUser(role.user);
                    }
                  }}
              >
                <span className="font-bold uppercase" style={{ color: '#7B4E2E' }}>Membre :</span>
                <span className="text-black">{role.user?.name || role.user?.email || 'Inconnu'}</span>
              </li>
            ))}
          </ul>
          {/* Modale profil utilisateur */}
          {loadingUser && (
            <div className="text-center text-secondary-brown py-4">Chargement du profil...</div>
          )}
          {selectedUser && !loadingUser && (
            <div style={{ position: "fixed", inset: 0, zIndex: 2000 }}>
              {/* Z-index élevé pour que la modale profil soit toujours au-dessus de la carte et du reste */}
              {(() => {
                console.log('DEBUG selectedUser.dogs:', selectedUser.dogs);
                return (
                  <UserProfileModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                  />
                );
              })()}
            </div>
          )}
        </section>
        {/* Demandes d'ajout : visible uniquement pour le créateur */}
        {isCreator && localGroupRequests && localGroupRequests.filter((req: any) => req.status !== true && req.status != 1).length > 0 && (
          <section
            className="border-b border-[rgba(123,78,46,0.2)] pb-4"
            aria-label="Demandes d'ajout au groupe"
          >
            <h3 className="text-base md:text-lg font-bold text-secondary-brown uppercase text-center py-4">
              Demandes d'ajout
            </h3>
            <ul className="flex flex-col gap-2">
              {localGroupRequests.map((req: any) => {
                // Statut en attente si 0 (number ou string), false, "", ou undefined
                const isPending =
                  req.status === undefined ||
                  req.status === false ||
                  req.status === "" ||
                  req.status == 0;
                // Ne pas afficher si accepté (status == 1 ou true)
                if (req.status == 1 || req.status === true) {
                  return null;
                }
                const key = req.id ?? req["@id"] ?? Math.random();
                return (
                  <li
                    key={key}
                    className="text-[0.95rem] text-secondary-brown justify-center items-center flex flex-col md:items-center md:gap-2"
                  >
                    <span className="text-[0.95rem] text-secondary-brown">
                      <strong className="text-[0.95rem] text-secondary-brown">Utilisateur :</strong>{" "}
                      {req.user?.name || req.user?.email || "Inconnu"}
                    </span>
                    <span className="text-[0.95rem] text-secondary-brown">
                      <strong className="text-[0.95rem] text-secondary-brown">Status :</strong> {"En attente"}
                    </span>
                    {isPending && (
                      <div className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0">
                        <button
                          className="ml-2 bg-[var(--primary-green)] text-[var(--primary-brown)] py-1 px-3 rounded-md text-xs font-medium hover:bg-[#B7D336] transition border-none cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAcceptRequest(req, setLocalGroupRequests);
                          }}
                        >
                          Accepter
                        </button>
                        <button
                          className="ml-2 bg-red-500 text-white py-1 px-3 rounded-md text-xs font-medium hover:bg-red-700 transition border-none cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRejectRequest(req, setLocalGroupRequests);
                          }}
                        >
                          Refuser
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
    
        {/* Map Section */}
        <section
          className="border-b border-[rgba(123,78,46,0.2)] pb-4"
          aria-label="Carte interactive du groupe"
        >
          <h3 className="text-base md:text-lg font-bold text-secondary-brown uppercase text-center py-6">
            Carte interactive
          </h3>
          {group.walks && group.walks.length > 0 ? (
            (() => {
              const location = group.walks[0].location;
              const coordinates = location
                ? location
                    .split(",")
                    .map(Number)
                    .filter((coord) => !isNaN(coord))
                : [];

              return (
                <div
                  className="w-full max-w-2xl h-[350px] mx-auto"
                  style={{ zIndex: 20, position: "relative" }}
                >
                  {/* Z-index bas pour que la carte reste sous la modale profil */}
                  {coordinates.length === 2 &&
                  coordinates.every((coord) => coord >= -90 && coord <= 90) ? (
                    <LeafletMap coordinates={coordinates as [number, number]} />
                  ) : userCoordinates ? (
                    <LeafletMap coordinates={userCoordinates} />
                  ) : (
                    <LeafletMap coordinates={null} />
                  )}
                </div>
              );
            })()
          ) : (
            <p className="text-sm text-secondary-brown">
              Aucune balade disponible.
            </p>
          )}
        </section>
    {/* Comments Section */}
        <section
          className="border-b border-[rgba(123,78,46,0.2)] pb-4 flex flex-col items-center"
          aria-label="Commentaires du groupe"
        >
          <GroupComments group={group} user={{ username: "Anonyme" }} />
        </section>
        <footer
          className="flex flex-col w-full justify-center gap-4"
          aria-label="Actions du groupe"
        >
          {/* Afficher "Créer une balade" pour le créateur OU les membres (MEMBER) */}
          {(() => {
            const currentUser = getCurrentUserId();
            console.log("DEBUG groupRoles:", group.groupRoles);
            console.log("DEBUG currentUser:", currentUser);
            let userRoles: string[] = [];
            if (Array.isArray(group.groupRoles)) {
              userRoles = group.groupRoles
                .filter((role: any) => {
                  if (
                    currentUser.id &&
                    String(role.user?.id) === String(currentUser.id)
                  )
                    return true;
                  if (currentUser.username) {
                    // Match email or name
                    if (role.user?.email === currentUser.username) return true;
                    if (role.user?.name === currentUser.username) return true;
                    // Match username before @
                    const usernamePart = currentUser.username.split("@")[0];
                    if (
                      role.user?.name &&
                      role.user?.name.toLowerCase() ===
                        usernamePart.toLowerCase()
                    )
                      return true;
                  }
                  return false;
                })
                .map((role: any) => role.role);
            }
            console.log("DEBUG userRoles for current user:", userRoles);
            const isMember = userRoles.some(
              (r) => r && r.toUpperCase() === "MEMBER"
            );
            if (isCreator || isMember) {
              return (
                <button
                  className="bg-[var(--primary-green)] text-[var(--primary-brown)] py-2 px-6 rounded-md font-medium text-sm w-full max-w-[320px] min-w-[220px] hover:bg-[#B7D336] transition border-none cursor-pointer"
                  style={{ width: '100%' }}
                  onClick={onCreateWalk}
                  aria-label="Créer une balade pour ce groupe"
                  type="button"
                >
                  Créer une balade
                </button>
              );
            }
            return null;
          })()}
          {/* Supprimer le groupe : uniquement pour le créateur */}
          {isCreator && (
            <button
              className="bg-red-600 text-white py-2 px-6 rounded-md font-medium text-sm w-full max-w-[320px] min-w-[220px] hover:bg-red-800 transition border-none cursor-pointer"
              style={{ width: '100%' }}
              onClick={() => onDeleteGroup(group.id)}
              aria-label="Supprimer ce groupe"
              type="button"
            >
              Supprimer le groupe
            </button>
          )}
          {/* Affichage conditionnel du bouton "Rejoindre ce groupe" ou "Demande envoyée" */}
          {(() => {
            const currentUserId = getCurrentUserId();
            const hasPendingRequest = Array.isArray(localGroupRequests)
              ? localGroupRequests.some(
                  (req: any) =>
                    String(req.user?.id) === String(currentUserId) &&
                    (req.status === undefined ||
                      req.status === false ||
                      req.status === "" ||
                      req.status == 0)
                )
              : false;
            const isMember = Array.isArray(group.groupRoles)
              ? group.groupRoles.some(
                  (role: any) =>
                    String(role.user?.id) === String(currentUserId) &&
                    role.role &&
                    role.role.toUpperCase() === "MEMBER"
                )
              : false;
            // Hide button if already member, or if join just clicked
            if (isMember || joinClicked) {
              return null;
            } else if (hasPendingRequest) {
              return (
                <button
                  className="bg-gray-300 text-gray-600 py-2 px-6 rounded-md font-medium text-sm w-full max-w-[320px] min-w-[220px] cursor-not-allowed border-none"
                  style={{ width: '100%' }}
                  type="button"
                  disabled
                  aria-label="Demande envoyée"
                >
                  Demande envoyée
                </button>
              );
            } else if (canRequestJoin) {
              return (
                <button
                  className="bg-[var(--primary-green)] text-[var(--primary-brown)] py-2 px-6 rounded-md font-medium text-sm w-full max-w-[320px] min-w-[220px] hover:bg-[#B7D336] transition border-none cursor-pointer"
                  style={{ width: '100%' }}
                  onClick={() => {
                    setJoinClicked(true);
                    onJoinGroup(group.id);
                  }}
                  aria-label="Rejoindre ce groupe"
                  type="button"
                >
                  Rejoindre ce groupe
                </button>
              );
            }
            return null;
          })()}
        </footer>
      </article>
    </section>
  );
};

export default GroupDetailsModal;
