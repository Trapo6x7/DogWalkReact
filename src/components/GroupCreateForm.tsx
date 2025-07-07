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
    <div className="w-full h-full max-w-2xl mx-auto px-2">
      <div className="bg-[#FBFFEE] rounded-lg shadow-lg p-4 md:p-6 w-full h-full flex flex-col justify-between">
        <h2 className="text-lg md:text-xl font-bold text-secondary-brown uppercase text-center mb-0">Créer un groupe</h2>
        <div className="flex flex-col gap-2 md:gap-3 mt-4">
          <input
            type="text"
            placeholder="Nom du groupe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded-md border border-[rgba(123,78,46,0.2)] text-sm md:text-base w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 rounded-md border border-[rgba(123,78,46,0.2)] text-sm md:text-base min-h-[80px] w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="mixed"
              checked={mixed}
              onChange={(e) => setMixed(e.target.checked)}
              className="accent-[var(--primary-green)]"
            />
            <label htmlFor="mixed" className="text-sm md:text-base text-secondary-brown">Mixte</label>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-[var(--primary-green)] text-[var(--primary-brown)] w-full rounded-md px-4 py-2 font-medium text-sm md:text-base hover:bg-[#B7D336] transition border-none cursor-pointer mt-2"
          >
            Créer un groupe
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupCreateForm;
