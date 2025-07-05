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
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#FBFFEE', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '1rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--secondary-brown)', textTransform: 'uppercase', textAlign: 'center' }}>Créer un groupe</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="Nom du groupe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid rgba(123, 78, 46, 0.2)', fontSize: '0.875rem' }}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid rgba(123, 78, 46, 0.2)', fontSize: '0.875rem', minHeight: '80px' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="mixed"
              checked={mixed}
              onChange={(e) => setMixed(e.target.checked)}
              style={{ accentColor: 'var(--primary-green)' }}
            />
            <label htmlFor="mixed" style={{ fontSize: '0.875rem', color: 'var(--secondary-brown)' }}>Mixte</label>
          </div>
          <button
            onClick={handleSubmit}
            style={{ backgroundColor: 'var(--primary-green)', color: 'var(--primary-brown)', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', fontWeight: '500', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Créer un groupe
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupCreateForm;
