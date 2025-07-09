import React from 'react';

interface GroupListProps {
  groups: Array<{ id: number; name: string; description: string }>; // Adjust type as needed
  onShowDetails: (groupId: number) => void;
}

const GroupList: React.FC<GroupListProps> = ({ groups, onShowDetails }) => {
  return (
    <section className="w-full flex flex-col items-center" aria-label="Section liste des groupes">
      <article className="bg-[#FBFFEE] rounded-lg shadow-lg md:h-80 w-full mx-auto p-2 md:p-4 flex flex-col justify-between" aria-label="Carte liste des groupes">
        {/* Accordion général */}
        {/* Mobile: Accordion général */}
        <div className="block md:hidden w-full">
          <details className="w-full max-w-md mx-auto" role="region" aria-labelledby="group-list-title">
            <summary className="mb-7 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden before:hidden">
              <h2 id="group-list-title" className="text-lg font-bold text-secondary-brown uppercase text-center">Groupes existants</h2>
            </summary>
            <div className="flex flex-col gap-2 mt-4 max-h-52 overflow-y-auto">
              {groups.length > 0 ? (
                groups.map((group) => (
                  <details key={group.id} className="w-full max-w-md mx-auto" aria-label={`Groupe ${group.name}`}>
                    <summary className="flex flex-col items-center gap-2 cursor-pointer select-none px-4 pt-2 pb-0 w-full max-w-md mx-auto">
                      <span className="text-base font-bold text-secondary-brown uppercase text-center w-full">{group.name}</span>
                    </summary>
                    <section className="flex flex-col gap-2 mt-4 px-2 pb-2" aria-label={`Détails du groupe ${group.name}`}> 
                      <p className="text-sm text-secondary-brown mb-2">{group.description}</p>
                      <button
                        onClick={() => onShowDetails(group.id)}
                        className="bg-[var(--secondary-green)] text-[var(--primary-brown)] w-full rounded px-2 py-1 text-xs font-medium hover:bg-[#B7D336] transition border-none cursor-pointer"
                        aria-label={`Voir les détails du groupe ${group.name}`}
                        type="button"
                      >
                        Voir détails
                      </button>
                    </section>
                  </details>
                ))
              ) : (
                <p className="text-center text-secondary-brown text-sm">Aucun groupe disponible.</p>
              )}
            </div>
          </details>
        </div>
        {/* Desktop: list expanded */}
        <section className="hidden md:flex flex-col gap-2 md:gap-3 w-full mx-auto" role="region" aria-labelledby="group-list-title-desktop" aria-label="Liste des groupes desktop">
          <h2 id="group-list-title-desktop" className="text-xl font-bold text-secondary-brown uppercase text-center mb-7">Groupes existants</h2>
          <div className="flex flex-col gap-2 md:gap-3 max-h-60 overflow-y-auto">
            {groups.length > 0 ? (
              groups.map((group) => (
                <article key={group.id} className="py-2 md:py-3 border-b border-[rgba(123,78,46,0.1)] last:border-b-0" aria-label={`Groupe ${group.name}`}> 
                  <h3 className="text-lg font-bold text-secondary-brown">{group.name}</h3>
                  <p className="text-base text-secondary-brown">{group.description}</p>
                  <button
                    onClick={() => onShowDetails(group.id)}
                    className="bg-[var(--secondary-green)] text-[var(--primary-brown)] w-full rounded px-2 py-1 mt-2 text-sm font-medium hover:bg-[#B7D336] transition border-none cursor-pointer"
                    aria-label={`Voir les détails du groupe ${group.name}`}
                    type="button"
                  >
                    Voir détails
                  </button>
                </article>
              ))
            ) : (
              <p className="text-center text-secondary-brown text-base">Aucun groupe disponible.</p>
            )}
          </div>
        </section>
      </article>
    </section>
  );
};

export default GroupList;
