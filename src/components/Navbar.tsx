import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import EditProfileForm from "./EditProfileForm";
import EditPasswordForm from "./EditPasswordForm";
import AddDogs from "./AddDogs";

export function Navbar({ onLogout }: { onLogout: () => void }) {
  const { user, logout, refreshUser } = useAuth();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddDogForm, setShowAddDogForm] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 700 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-40 h-full bg-[#FBFFEE] shadow-lg transition-transform duration-300 flex flex-col items-center`}
      style={{ width: isMobile ? '100vw' : 110, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderTopRightRadius: isMobile ? 0 : 20, borderTopLeftRadius: 0 }}
    >
      {/* Logo */}
      <a className="flex items-center border-none cursor-pointer mt-4 mb-6" style={{ backgroundColor: "transparent" }}>
        <img src="/logoronddogwalk2.png" alt="Dogwalk logo" className="h-12 w-12" />
      </a>

      {/* Desktop vertical menu */}
      {!isMobile && (
        <nav className="flex flex-col gap-4 items-center w-full justify-center">
          <a onClick={() => { setShowEditProfile(!showEditProfile); setShowAddDogForm(false); setShowEditPassword(false); }} className="p-2 w-15 z-75 cursor-pointer"><img src="/usericon2.png" alt="Modifier le profil" /></a>
          <a onClick={() => { setShowAddDogForm(!showAddDogForm); setShowEditProfile(false); setShowEditPassword(false); }} className="p-2 w-15 z-75 cursor-pointer"><img src="/dogicon2.png" alt="Ajouter un chien" /></a>
          <a onClick={() => { setShowEditPassword(!showEditPassword); setShowEditProfile(false); setShowAddDogForm(false); }} className="p-2 w-15 z-75 cursor-pointer"><img src="/paramdogwalk.png" alt="Modifier le mot de passe" /></a>
          <a onClick={() => { logout(); onLogout(); }} className="p-2 w-15 z-75 cursor-pointer"><img src="/logout2.png" alt="Déconnexion" /></a>
        </nav>
      )}

      {/* Burger menu icon for mobile */}
      {isMobile && (
        <nav className="flex items-center justify-between px-4 py-2 w-full">
          <button
            className="flex flex-col justify-center items-center w-10 h-10 focus:outline-none ml-auto"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Ouvrir le menu"
          >
            <span className="block w-7 h-1 bg-primary-brown mb-1 rounded transition-all" style={{ background: '#7B4E2E' }}></span>
            <span className="block w-7 h-1 bg-primary-brown mb-1 rounded transition-all" style={{ background: '#7B4E2E' }}></span>
            <span className="block w-7 h-1 bg-primary-brown rounded transition-all" style={{ background: '#7B4E2E' }}></span>
          </button>
        </nav>
      )}

      {/* Mobile menu drawer */}
      {isMobile && menuOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex flex-col items-end">
          <div className="bg-[#FBFFEE] w-64 h-full shadow-lg p-6 flex flex-col gap-6 animate-slide-in-right" style={{ borderTopRightRadius: 0, borderBottomRightRadius: 20 }}>
            <button className="self-end mb-4" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu">
              <span className="text-3xl text-primary-brown" style={{ color: '#7B4E2E' }}>×</span>
            </button>
            <a onClick={() => { setShowEditProfile(true); setShowAddDogForm(false); setShowEditPassword(false); setMenuOpen(false); }} className="flex items-center gap-2 cursor-pointer"><img src="/usericon2.png" alt="Modifier le profil" className="h-7 w-7" /><span>Profil</span></a>
            <a onClick={() => { setShowAddDogForm(true); setShowEditProfile(false); setShowEditPassword(false); setMenuOpen(false); }} className="flex items-center gap-2 cursor-pointer"><img src="/dogicon2.png" alt="Ajouter un chien" className="h-7 w-7" /><span>Ajouter un chien</span></a>
            <a onClick={() => { setShowEditPassword(true); setShowEditProfile(false); setShowAddDogForm(false); setMenuOpen(false); }} className="flex items-center gap-2 cursor-pointer"><img src="/paramdogwalk.png" alt="Modifier le mot de passe" className="h-7 w-7" /><span>Mot de passe</span></a>
            <a onClick={() => { logout(); onLogout(); setMenuOpen(false); }} className="flex items-center gap-2 cursor-pointer"><img src="/logout2.png" alt="Déconnexion" className="h-7 w-7" /><span>Déconnexion</span></a>
          </div>
        </div>
      )}

      {/* Modales centrées */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="w-full max-w-lg mx-4 flex items-center justify-center">
            <EditProfileForm onCancel={() => setShowEditProfile(false)} userData={user} onSave={() => console.log('Save')} onRefresh={() => console.log('Refresh')} />
          </div>
        </div>
      )}

      {showAddDogForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="w-full max-w-md flex items-center justify-center">
            <AddDogs onCancel={() => setShowAddDogForm(false)} onRefresh={() => console.log('Refresh')} />
          </div>
        </div>
      )}

      {showEditPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="p-6 w-full max-w-md flex items-center justify-center">
            <EditPasswordForm onCancel={() => setShowEditPassword(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
