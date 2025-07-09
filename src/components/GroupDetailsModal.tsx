import React, { useState, useEffect } from 'react';
import LeafletMap from './LeafletMap';
import GroupComments from "./GroupComments";

interface GroupDetailsModalProps {
  group: {
    id: number;
    name: string;
    comment: string;
    mixed: boolean;
    createdAt: string;
    walks: Array<{ id: number; location: string }>;
  };
  onClose: () => void;
  onJoinGroup: (groupId: number) => void;
  onCreateWalk: () => void;
  isCreator: boolean;
  canRequestJoin: boolean;
}

const GroupDetailsModal: React.FC<GroupDetailsModalProps> = ({ group, onClose, onJoinGroup, onCreateWalk, isCreator, canRequestJoin }) => {
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoordinates([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          setUserCoordinates(null);
        }
      );
    }
  }, []);

  // All JS/CSS style constants removed, now using Tailwind for modal and content
  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 md:p-0" role="dialog" aria-modal="true" aria-labelledby="group-details-title">
      <article className="relative bg-[#FBFFEE] p-2 md:p-6 rounded-lg w-full max-w-3xl h-[95%] md:h-[80%] mx-auto overflow-y-auto" aria-label="Carte détails du groupe">
        <button
          className="absolute top-2 right-2 md:top-4 md:right-4 text-secondary-brown text-xl md:text-2xl bg-none border-none cursor-pointer z-10"
          onClick={onClose}
          aria-label="Fermer la fenêtre de détails du groupe"
          type="button"
        >
          ×
        </button>
        <header>
          <h2 id="group-details-title" className="text-xl md:text-2xl font-bold text-secondary-brown text-center uppercase pb-6">Détails du groupe</h2>
        </header>
        <section className="border-b border-[rgba(123,78,46,0.2)] pb-2 md:pb-4" aria-label="Informations principales du groupe">
          <div className="flex flex-col md:flex-row md:flex-wrap md:justify-around mt-4 md:items-center gap-2 md:gap-0">
            <p className="text-[0.95rem] text-secondary-brown"><strong>Nom :</strong> {group.name}</p>
            <p className="text-[0.95rem] text-secondary-brown"><strong>Description :</strong> {group.comment}</p>
            <p className="text-[0.95rem] text-secondary-brown"><strong>Mixte :</strong> {group.mixed ? 'Oui' : 'Non'}</p>
            <p className="text-[0.95rem] text-secondary-brown"><strong>Créé le :</strong> {new Date(group.createdAt || '').toLocaleDateString()}</p>
            <p className="text-[0.95rem] text-secondary-brown"><strong>Balades :</strong> {group.walks?.length ?? 0}</p>
          </div>
        </section>
        {/* Comments Section */}
        <section className="border-b border-[rgba(123,78,46,0.2)] pb-4 flex flex-col items-center" aria-label="Commentaires du groupe">
          <GroupComments group={group} user={{ username: "Anonyme" }} />
        </section>
        {/* Map Section */}
        <section className="border-b border-[rgba(123,78,46,0.2)] pb-4" aria-label="Carte interactive du groupe">
          <h3 className="text-base md:text-lg font-bold text-secondary-brown uppercase text-center py-6">Carte interactive</h3>
          {group.walks && group.walks.length > 0 ? (
            (() => {
              const location = group.walks[0].location;
              const coordinates = location
                ? location.split(',').map(Number).filter((coord) => !isNaN(coord))
                : [];

              return (
                <div className="w-full max-w-2xl h-[350px] mx-auto">
                  {coordinates.length === 2 && coordinates.every((coord) => coord >= -90 && coord <= 90) ? (
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
            <p className="text-sm text-secondary-brown">Aucune balade disponible.</p>
          )}
        </section>
        <footer className="flex flex-col items-center justify-center gap-4" aria-label="Actions du groupe">
          {isCreator && (
            <button
              className="bg-[var(--primary-green)] text-[var(--primary-brown)] py-2 px-6 rounded-md font-medium text-sm w-full max-w-xs hover:bg-[#B7D336] transition border-none cursor-pointer"
              onClick={onCreateWalk}
              aria-label="Créer une balade pour ce groupe"
              type="button"
            >
              Créer une balade
            </button>
          )}
          {canRequestJoin && (
            <button
              className="bg-[var(--primary-green)] text-[var(--primary-brown)] py-2 px-6 rounded-md font-medium text-sm w-full max-w-xs hover:bg-[#B7D336] transition border-none cursor-pointer"
              onClick={() => onJoinGroup(group.id)}
              aria-label="Rejoindre ce groupe"
              type="button"
            >
              Rejoindre ce groupe
            </button>
          )}
        </footer>
      </article>
    </section>
  );
};

export default GroupDetailsModal;
