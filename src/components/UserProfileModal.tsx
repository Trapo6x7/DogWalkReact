import React, { useEffect, useState } from "react";

interface UserProfileModalProps {
  user: {
    id: number;
    name: string;
    email?: string;
    birthdate?: string;
    city?: string;
    description?: string;
    imageFilename?: string;
    [key: string]: any;
  };
  onClose: () => void;
  onEdit?: () => void;
}

function calculateAge(birthdate?: string): string {
  if (!birthdate) return "Âge inconnu";
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return `${age} ans`;
}

function capitalizeFirstLetter(str?: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose, onEdit }) => {

  // State to store fetched groupRoles details
  const [groupRolesDetails, setGroupRolesDetails] = useState<any[]>([]);
  // State to store fetched dog races
  const [dogRaces, setDogRaces] = useState<Record<string, string>>({});
  // Fetch dog races if needed
  useEffect(() => {
    async function fetchDogRaces() {
      if (!user.dogs || !Array.isArray(user.dogs)) return;
      const allRaceUris = user.dogs
        .flatMap((dog: any) => Array.isArray(dog.race) ? dog.race : [])
        .filter((uri: any) => typeof uri === 'string');
      const uniqueUris = Array.from(new Set(allRaceUris));
      if (uniqueUris.length === 0) return;
      const races: Record<string, string> = {};
      await Promise.all(
        uniqueUris.map(async (uri) => {
          try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}${uri}`);
            if (res.ok) {
              const data = await res.json();
              races[uri] = data.name || uri;
            } else {
              races[uri] = uri;
            }
          } catch {
            races[uri] = uri;
          }
        })
      );
      setDogRaces(races);
    }
    fetchDogRaces();
  }, [user.dogs]);

  // Fetch groupRoles details if needed
  useEffect(() => {
    async function fetchGroupRoles() {
      if (!user.groupRoles || !Array.isArray(user.groupRoles)) return;
      // Only fetch for string URIs
      const uris = user.groupRoles.filter((r: any) => typeof r === 'string');
      if (uris.length === 0) {
        setGroupRolesDetails([]);
        return;
      }
      try {
        const results = await Promise.all(
          uris.map(async (uri: string) => {
            try {
              const res = await fetch(`${import.meta.env.VITE_API_URL}${uri}`);
              if (!res.ok) return { uri };
              return await res.json();
            } catch {
              return { uri };
            }
          })
        );
        setGroupRolesDetails(results);
      } catch {
        setGroupRolesDetails([]);
      }
    }
    fetchGroupRoles();
  }, [user.groupRoles]);

  // Helper to render arrays or objects nicely
  const renderValue = (value: any, key?: string) => {
    // Cas spécial pour createdGroups : afficher le nom du groupe
    if (key === 'createdGroups' && Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-400">Aucun</span>;
      return (
        <ul className="list-disc pl-4">
          {value.map((group: any, idx: number) => (
            <li key={idx} className="break-all">
              {group.name ? group.name : (typeof group === 'object' ? JSON.stringify(group) : String(group))}
            </li>
          ))}
        </ul>
      );
    }
    // Cas spécial pour dogs : afficher nom et races
    if (key === 'dogs' && Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-400">Aucun</span>;
      return (
        <ul className="list-disc pl-4">
          {value.map((dog: any, idx: number) => {
            const dogName = dog.name || 'Chien';
            let raceLabel = '';
            if (Array.isArray(dog.race) && dog.race.length > 0) {
              raceLabel = dog.race
                .map((uri: string) => dogRaces[uri] || uri)
                .join(', ');
            }
            return (
              <li key={idx} className="break-all">
                {dogName}
                {raceLabel && (
                  <span className="text-xs text-gray-500"> — {raceLabel}</span>
                )}
              </li>
            );
          })}
        </ul>
      );
    }
    // Cas spécial pour groupRoles : afficher le nom du groupe et le rôle si possible
    if (key === 'groupRoles' && Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-400">Aucun</span>;
      return (
        <ul className="list-disc pl-4">
          {value.map((role: any, idx: number) => {
            // Si c'est un objet enrichi (déjà group+role)
            if (typeof role === 'object' && role !== null && (role.role)) {
              const roleName = role.role || 'Rôle inconnu';
              const groupName = role.walkGroup?.name || (typeof role.walkGroup === 'object' ? role.walkGroup?.name : undefined) || (role.walkGroup && typeof role.walkGroup === 'string' ? role.walkGroup : undefined) || 'Groupe inconnu';
              return (
                <li key={idx} className="break-all">
                  {groupName} — {roleName}
                </li>
              );
            }
            // Si c'est une string URI, on cherche dans groupRolesDetails (en utilisant l'index de l'URI dans la liste des URIs)
            if (typeof role === 'string') {
              const uris = user.groupRoles.filter((r: any) => typeof r === 'string');
              const uriIdx = uris.indexOf(role);
              const fetched = groupRolesDetails[uriIdx];
              if (fetched && fetched.role) {
                const roleName = fetched.role || 'Rôle inconnu';
                const groupName = fetched.walkGroup?.name || (typeof fetched.walkGroup === 'object' ? fetched.walkGroup?.name : undefined) || (fetched.walkGroup && typeof fetched.walkGroup === 'string' ? fetched.walkGroup : undefined) || 'Groupe inconnu';
                return (
                  <li key={idx} className="break-all">
                    {groupName} — {roleName}
                  </li>
                );
              }
              // fallback
              return (
                <li key={idx} className="break-all">
                  {role}
                </li>
              );
            }
            // fallback
            return (
              <li key={idx} className="break-all">
                {typeof role === 'object' ? JSON.stringify(role) : String(role)}
              </li>
            );
          })}
        </ul>
      );
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-400">Aucun</span>;
      return (
        <ul className="list-disc pl-4">
          {value.map((item, idx) => (
            <li key={idx} className="break-all">
              {typeof item === 'object' ? JSON.stringify(item) : String(item)}
            </li>
          ))}
        </ul>
      );
    }
    if (typeof value === 'object' && value !== null) {
      return <pre className="whitespace-pre-wrap break-all bg-gray-100 rounded p-2 text-xs max-h-40 overflow-auto">{JSON.stringify(value, null, 2)}</pre>;
    }
    return <span className="break-all">{String(value)}</span>;
  };
  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-0" role="dialog" aria-modal="true" aria-labelledby="user-profile-title">
      <article className="relative bg-[#FBFFEE] p-2 md:p-6 rounded-lg w-full max-w-md mx-auto overflow-y-auto" aria-label="Carte profil utilisateur">
        <button
          className="absolute top-2 right-2 md:top-4 md:right-4 text-secondary-brown text-xl md:text-2xl bg-none border-none cursor-pointer z-10"
          onClick={onClose}
          aria-label="Fermer la fenêtre de profil utilisateur"
          type="button"
        >
          ×
        </button>
        <header className="flex flex-col items-center gap-2 pb-4">
          <div className="relative w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-white">
            {user.imageFilename ? (
              <img
                src={`${import.meta.env.VITE_API_URL}/uploads/images/${user.imageFilename}`}
                alt="Photo de profil utilisateur"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-gray-800">
                {user.name?.[0]}
              </span>
            )}
          </div>
          <h2 id="user-profile-title" className="text-xl md:text-2xl font-bold text-secondary-brown text-center uppercase">
            {user.name}
          </h2>
          <span className="text-sm text-secondary-brown" aria-label="Âge utilisateur">
            {user.birthdate ? calculateAge(user.birthdate) : "Âge inconnu"}
          </span>
        </header>
        <section className="flex flex-col gap-2 px-2 pb-4" aria-label="Informations détaillées utilisateur">
          {/* Affichage dynamique de toutes les propriétés du user */}
          {Object.entries(user).map(([key, value]) => {
            // Exclure certains champs
            if (
              [
                'imageFilename',
                'groupRequests',
                'score',
                'email',
                'id',
              ].includes(key)
              || key.startsWith('@')
            ) return null;

            // Traductions des clés
            const keyLabels: Record<string, string> = {
              city: 'Ville',
              dogs: 'Chiens',
              groupRoles: 'Rôles dans les groupes',
              description: 'Description',
              name: 'Nom',
              birthdate: 'Date de naissance',
            };
            // On retire "createdGroups" de l'affichage, on veut "dogs" à la place
            if (key === 'createdGroups') return null;

            const label = keyLabels[key] || capitalizeFirstLetter(key);

            // Formatage spécial pour la date de naissance
            let displayValue = renderValue(value, key);
            // Capitalize value si string simple (hors objets, arrays, dates)
            if (typeof value === 'string' && key !== 'birthdate') {
              displayValue = <span>{capitalizeFirstLetter(value)}</span>;
            }
            if (key === 'birthdate' && typeof value === 'string') {
              // Affiche la date au format JJ/MM/YYYY
              const date = new Date(value);
              if (!isNaN(date.getTime())) {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                displayValue = <span>{`${day}/${month}/${year}`}</span>;
              }
            }

            return (
              <div key={key} className="flex flex-row justify-between items-start border-b border-dashed border-gray-200 py-1">
                <span className="text-sm font-bold uppercase" style={{ color: '#7B4E2E' }}>{label} :</span>
                <span className="text-sm text-secondary-brown text-right max-w-[60%] break-all" aria-label={key}>
                  {displayValue}
                </span>
              </div>
            );
          })}
        </section>
        <footer className="flex flex-col items-center gap-2 mt-4">
          {onEdit && (
            <button
              className="bg-[var(--primary-green)] text-[var(--primary-brown)] font-medium rounded-md w-full py-2 hover:bg-[#B7D336] transition"
              onClick={onEdit}
              type="button"
              aria-label="Modifier le profil utilisateur"
            >
              Modifier le profil
            </button>
          )}
        </footer>
      </article>
    </section>
  );
};

export default UserProfileModal;
