import React from 'react';

interface GroupListProps {
  groups: Array<{ id: number; name: string; description: string }>; // Adjust type as needed
  onShowDetails: (groupId: number) => void;
}

const GroupList: React.FC<GroupListProps> = ({ groups, onShowDetails }) => {
  return (
    <div className="w-full h-full mx-auto px-2">
      <div className="bg-[#FBFFEE] rounded-lg shadow-lg p-4 md:p-6 w-full h-full flex flex-col justify-between">
        <h2 className="text-lg md:text-xl font-bold text-secondary-brown uppercase text-center mb-0">Groupes existants</h2>
        <div className="flex flex-col gap-2 md:gap-3 mt-4 max-h-52 md:max-h-60 overflow-y-auto">
          {groups.length > 0 ? (
            groups.map((group) => (
              <div
                key={group.id}
                className="py-2 md:py-3 border-b border-[rgba(123,78,46,0.1)] last:border-b-0"
              >
                <h3 className="text-base md:text-lg font-bold text-secondary-brown">{group.name}</h3>
                <p className="text-sm md:text-base text-secondary-brown">{group.description}</p>
                <button
                  onClick={() => onShowDetails(group.id)}
                  className="bg-[var(--secondary-green)] text-[var(--primary-brown)] w-full rounded px-2 py-1 mt-2 text-xs md:text-sm font-medium hover:bg-[#B7D336] transition border-none cursor-pointer"
                >
                  Voir détails
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-secondary-brown text-sm md:text-base">Aucun groupe disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupList;
