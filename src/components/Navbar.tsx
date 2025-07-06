import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import EditProfileForm from "./EditProfileForm";
import EditPasswordForm from "./EditPasswordForm";
import AddDogs from "./AddDogs";

export function Navbar({ onLogout }: { onLogout: () => void }) {
  const { user, logout, refreshUser } = useAuth();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddDogForm, setShowAddDogForm] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  return (
    <header
      className={`flex flex-col items-center px-4 bg-[#FBFFEE] fixed top-0 left-0 shadow-lg transition-transform duration-300`}
      style={{ height: 'auto', width: '120px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <nav className="container py-4 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          {/* Boutons */}
          <a
            onClick={() => {
              setShowEditProfile(!showEditProfile);
              setShowAddDogForm(false);
              setShowEditPassword(false);
            }}
            className="p-2 w-15 z-75"
          >
            <img src="/usericon2.png" alt="Modifier le profil" />
          </a>

          <a
            onClick={() => {
              setShowAddDogForm(!showAddDogForm);
              setShowEditProfile(false);
              setShowEditPassword(false);
            }}
            className="p-2 w-15 z-75"
          >
            <img src="/dogicon2.png" alt="Ajouter un chien" />
          </a>

          <a
            onClick={() => {
              setShowEditPassword(!showEditPassword);
              setShowEditProfile(false);
              setShowAddDogForm(false);
            }}
            className="p-2 w-15 z-75"
          >
            <img src="/paramdogwalk.png" alt="Modifier le mot de passe" />
          </a>

          <a
            onClick={() => {
              logout();
              onLogout();
            }}
            className="p-2 w-15 z-75 cursor-pointer"
          >
            <img src="/logout2.png" alt="Déconnexion" />
          </a>
        {/* Séparateur horizontal */}
        <hr className="w-full border-t border-gray-300 my-2" style={{ marginTop: 'auto' }} />
      <a
        className="flex justify-center items-center w-15 z-75 border-none cursor-pointer"
        style={{ backgroundColor: "transparent" }}
      >
        <img src="/logoronddogwalk2.png" alt="Dogwalk logo" />
      </a>
          </div>
        </nav>
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
