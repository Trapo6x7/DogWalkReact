import React from 'react';

interface GroupListProps {
  groups: Array<{ id: number; name: string; description: string }>; // Adjust type as needed
  onShowDetails: (groupId: number) => void;
}

const GroupList: React.FC<GroupListProps> = ({ groups, onShowDetails }) => {
  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#FBFFEE', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '1rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--secondary-brown)', textTransform: 'uppercase', textAlign: 'center' }}>Groupes existants</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', maxHeight: '210px', overflowY: 'auto' }}>
          {groups.length > 0 ? (
            groups.map((group) => (
              <div key={group.id} style={{ padding: '0.75rem', borderBottom: '1px solid rgba(123, 78, 46, 0.1)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--secondary-brown)' }}>{group.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--secondary-brown)' }}>{group.description}</p>
                <button
                  onClick={() => onShowDetails(group.id)}
                  style={{ backgroundColor: 'var(--primary-green)', color: 'var(--primary-brown)', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.75rem', border: 'none', cursor: 'pointer' }}
                >
                  Voir détails
                </button>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--secondary-brown)', fontSize: '0.875rem' }}>Aucun groupe disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupList;
