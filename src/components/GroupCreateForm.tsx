import React, { useState } from 'react';

interface GroupCreateFormProps {
  onCreateGroup: (name: string, description: string, mixed: boolean) => void;
}

const GroupCreateForm: React.FC<GroupCreateFormProps> = ({ onCreateGroup }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mixed, setMixed] = useState(true);

  const handleSubmit = () => {
    if (name && description) {
      onCreateGroup(name, description, mixed);
      setName('');
      setDescription('');
      setMixed(true);
    }
  };
  return (
    <div className="w-full flex flex-col items-center">
      <div className="bg-[#FBFFEE] rounded-lg shadow-lg w-full md:h-80 mx-auto p-2 md:p-4 flex flex-col justify-between">
        {/* Mobile: Accordion */}
        <div className="block md:hidden w-full">
          <details className="w-full max-w-md mx-auto">
            <summary className="flex flex-col items-center gap-2 cursor-pointer select-none px-4 pt-2 pb-0 w-full max-w-md mx-auto">
              <h2 className="text-lg font-bold text-secondary-brown uppercase text-center mb-0">Créer un groupe</h2>
            </summary>
            <div className="flex flex-col gap-2 mt-4 px-2 pb-2">
              <input
                type="text"
                placeholder="Nom du groupe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 rounded-md border border-[rgba(123,78,46,0.2)] text-sm w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="p-2 rounded-md border border-[rgba(123,78,46,0.2)] text-sm min-h-[80px] w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="mixed"
                  checked={mixed}
                  onChange={(e) => setMixed(e.target.checked)}
                  className="accent-[var(--primary-green)]"
                />
                <label htmlFor="mixed" className="text-sm text-secondary-brown">Mixte</label>
              </div>
              <button
                onClick={handleSubmit}
                className="bg-[var(--primary-green)] text-[var(--primary-brown)] w-full rounded-md px-4 py-2 font-medium text-sm hover:bg-[#B7D336] transition border-none cursor-pointer mt-2"
              >
                Créer un groupe
              </button>
            </div>
          </details>
        </div>
        {/* Desktop: Form always visible */}
        <div className="hidden md:block w-full max-w-md mx-auto my-4">
          <h2 className="text-xl font-bold text-secondary-brown uppercase text-center">Créer un groupe</h2>
          <div className="flex flex-col gap-3 mt-4">
            <input
              type="text"
              placeholder="Nom du groupe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 rounded-md border border-[rgba(123,78,46,0.2)] text-base w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-2 rounded-md border border-[rgba(123,78,46,0.2)] text-base min-h-[80px] w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="mixed-desktop"
                checked={mixed}
                onChange={(e) => setMixed(e.target.checked)}
                className="accent-[var(--primary-green)]"
              />
              <label htmlFor="mixed-desktop" className="text-base text-secondary-brown">Mixte</label>
            </div>
            <button
              onClick={handleSubmit}
              className="bg-[var(--primary-green)] text-[var(--primary-brown)] w-full rounded-md px-4 py-2 font-medium text-base hover:bg-[#B7D336] transition border-none cursor-pointer mt-2"
            >
              Créer un groupe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCreateForm;
