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

  // Responsive styles
  const isMobile = window.innerWidth <= 600;
  const modalBgStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backdropFilter: 'blur(4px)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: isMobile ? '0.5rem' : 0,
  };
  const modalStyle: React.CSSProperties = {
    backgroundColor: '#FBFFEE',
    padding: isMobile ? '0.5rem' : '1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
    width: '100%',
    maxWidth: isMobile ? '100%' : '900px',
    height: isMobile ? '95%' : '80%',
    margin: '0 auto',
    position: 'relative',
    overflowY: 'auto',
    boxSizing: 'border-box',
  };
  const closeBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: isMobile ? '0.5rem' : '1rem',
    right: isMobile ? '0.5rem' : '1rem',
    color: 'var(--secondary-brown)',
    fontSize: isMobile ? '1.1rem' : '1.25rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    zIndex: 2,
  };
  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: isMobile ? '1rem' : '1.5rem',
  };
  const sectionTitleStyle: React.CSSProperties = {
    fontSize: isMobile ? '1rem' : '1.125rem',
    fontWeight: 'bold',
    color: 'var(--secondary-brown)',
    textTransform: 'uppercase',
    marginBottom: isMobile ? '0.5rem' : '0.75rem',
    textAlign: 'center',
  };
  const infoRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    flexWrap: 'wrap',
    justifyContent: isMobile ? 'flex-start' : 'space-around',
    marginTop: '1rem',
    alignItems: isMobile ? 'flex-start' : 'center',
    gap: isMobile ? '0.5rem' : 0,
  };
  const infoTextStyle: React.CSSProperties = {
    fontSize: isMobile ? '0.9rem' : '0.95rem',
    color: 'var(--secondary-brown)',
  };
  const mainTitleStyle: React.CSSProperties = {
    fontSize: isMobile ? '1.2rem' : '1.5rem',
    fontWeight: 'bold',
    color: 'var(--secondary-brown)',
    textAlign: 'center',
    textTransform: 'uppercase',
    margin: isMobile ? '0.3rem 0' : '0.5rem 0',
  };
  return (
    <div style={modalBgStyle}>
      <div style={modalStyle}>
        <button
          style={closeBtnStyle}
          onClick={onClose}
        >
          ×
        </button>
        <div style={contentStyle}>
          <h2 style={mainTitleStyle}>Détails du groupe</h2>
          <div style={{ borderBottom: '1px solid rgba(123, 78, 46, 0.2)', paddingBottom: isMobile ? '0.5rem' : '1rem' }}>
            <h3 style={sectionTitleStyle}>Informations générales</h3>
            <div style={infoRowStyle}>
              <p style={infoTextStyle}><strong>Nom :</strong> {group.name}</p>
              <p style={infoTextStyle}><strong>Description :</strong> {group.comment}</p>
              <p style={infoTextStyle}><strong>Mixte :</strong> {group.mixed ? 'Oui' : 'Non'}</p>
              <p style={infoTextStyle}><strong>Créé le :</strong> {new Date(group.createdAt || '').toLocaleDateString()}</p>
              <p style={infoTextStyle}><strong>Balades :</strong> {group.walks?.length ?? 0}</p>
            </div>
          </div>

          {/* Comments Section */}
          <div style={{ borderBottom: '1px solid rgba(123, 78, 46, 0.2)', paddingBottom: '1rem' }}>
            <GroupComments group={group} user={{ username: "Anonyme" }} />
          </div>

          {/* Map Section */}
          <div style={{ borderBottom: '1px solid rgba(123, 78, 46, 0.2)', paddingBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--secondary-brown)', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>Carte interactive</h3>
            {group.walks && group.walks.length > 0 ? (
              (() => {
                const location = group.walks[0].location;
                const coordinates = location
                  ? location.split(',').map(Number).filter((coord) => !isNaN(coord))
                  : [];

                return (
                  <div style={{ width: '100%', maxWidth: 600, height: 350, margin: '0 auto' }}>
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
              <p style={{ fontSize: '0.875rem', color: 'var(--secondary-brown)' }}>Aucune balade disponible.</p>
            )}
          </div>
<div className='flex flex-col items-center gap-4'>
          {isCreator && (
            <button
              style={{ backgroundColor: 'var(--primary-green)', color: 'var(--primary-brown)', padding: '0.5rem 1.5rem', borderRadius: '0.375rem', border: 'none', fontWeight: '500', cursor: 'pointer', fontSize: '0.875rem', width: '100%', maxWidth: '250px' }}
              onClick={onCreateWalk}
            >
              Créer une balade
            </button>
          )}
          {canRequestJoin && (
            <button
              style={{ backgroundColor: 'var(--primary-green)', color: 'var(--primary-brown)', padding: '0.5rem 1.5rem', borderRadius: '0.375rem', border: 'none', fontWeight: '500', cursor: 'pointer', fontSize: '0.875rem', width: '100%', maxWidth: '250px' }}
              onClick={() => onJoinGroup(group.id)}
            >
              Rejoindre ce groupe
            </button>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsModal;
