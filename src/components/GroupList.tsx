import React from 'react';

interface GroupListProps {
  groups: Array<{ id: number; name: string; description: string }>; // Adjust type as needed
  onShowDetails: (groupId: number) => void;
}

const GroupList: React.FC<GroupListProps> = ({ groups, onShowDetails }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="bg-[#FBFFEE] rounded-lg shadow-lg md:h-80 w-full mx-auto p-2 md:p-4 flex flex-col justify-between">
        {/* Accordion général */}
        {/* Mobile: Accordion général */}
        <div className="block md:hidden w-full">
          <details className="w-full max-w-md mx-auto">
            <summary className="mb-7 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden before:hidden">
              <h2 className="text-lg font-bold text-secondary-brown uppercase text-center">Groupes existants</h2>
            </summary>
            <div className="flex flex-col gap-2 mt-4 max-h-52 overflow-y-auto">
              {groups.length > 0 ? (
                groups.map((group) => (
                  <details key={group.id} className="w-full max-w-md mx-auto">
                    <summary className="flex flex-col items-center gap-2 cursor-pointer select-none px-4 pt-2 pb-0 w-full max-w-md mx-auto">
                      <span className="text-base font-bold text-secondary-brown uppercase text-center w-full">{group.name}</span>
                    </summary>
                    <div className="flex flex-col gap-2 mt-4 px-2 pb-2">
                      <p className="text-sm text-secondary-brown mb-2">{group.description}</p>
                      <button
                        onClick={() => onShowDetails(group.id)}
                        className="bg-[var(--secondary-green)] text-[var(--primary-brown)] w-full rounded px-2 py-1 text-xs font-medium hover:bg-[#B7D336] transition border-none cursor-pointer"
                      >
                        Voir détails
                      </button>
                    </div>
                  </details>
                ))
              ) : (
                <p className="text-center text-secondary-brown text-sm">Aucun groupe disponible.</p>
              )}
            </div>
          </details>
        </div>
        {/* Desktop: list expanded */}
        <div className="hidden md:flex flex-col gap-2 md:gap-3 w-full mx-auto">
          <h2 className="text-xl font-bold text-secondary-brown uppercase text-center mb-7">Groupes existants</h2>
          <div className="flex flex-col gap-2 md:gap-3 max-h-60 overflow-y-auto">
            {groups.length > 0 ? (
              groups.map((group) => (
                <div key={group.id} className="py-2 md:py-3 border-b border-[rgba(123,78,46,0.1)] last:border-b-0">
                  <h3 className="text-lg font-bold text-secondary-brown">{group.name}</h3>
                  <p className="text-base text-secondary-brown">{group.description}</p>
                  <button
                    onClick={() => onShowDetails(group.id)}
                    className="bg-[var(--secondary-green)] text-[var(--primary-brown)] w-full rounded px-2 py-1 mt-2 text-sm font-medium hover:bg-[#B7D336] transition border-none cursor-pointer"
                  >
                    Voir détails
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-secondary-brown text-base">Aucun groupe disponible.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupList;
