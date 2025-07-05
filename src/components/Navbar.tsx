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
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const handleNavigation = (path: string) => {
    console.log(`Navigation vers ${path}`);
  };

  return (
    <>
      {isNavbarVisible && (
        <header className="flex flex-col items-center px-4 bg-[#FBFFEE]" style={{ height: '50vh', width: '100px', position: 'fixed', top: '0', left: '0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
          <nav className="container py-4">
            <div className="flex flex-col items-center gap-2">
              <hr className="w-full border-t border-gray-300 my-2" />

              {/* Affichages conditionnels */}
              {showEditProfile && user && (
                <EditProfileForm
                  userData={user}
                  onCancel={() => setShowEditProfile(false)}
                  onSave={(updatedData) => {
                    console.log("Profil mis à jour :", updatedData);
                  }}
                  onRefresh={refreshUser}
                />
              )}

              {showEditPassword && user && (
                <EditPasswordForm onCancel={() => setShowEditPassword(false)} />
              )}

              {showAddDogForm && (
                <AddDogs
                  onCancel={() => setShowAddDogForm(false)}
                  onRefresh={refreshUser}
                />
              )}

              {/* Boutons */}
              <a
                onClick={() => {
                  setShowEditProfile(!showEditProfile);
                  setShowAddDogForm(false);
                  setShowEditPassword(false);
                }}
                className="p-2 w-full z-75 flex justify-center"
              >
                <img src="/iconprofile.png" alt="Modifier le profil" style={{ width: '40px' }} />
              </a>

              <a
                onClick={() => {
                  setShowAddDogForm(!showAddDogForm);
                  setShowEditProfile(false);
                  setShowEditPassword(false);
                }}
                className="p-2 w-full z-75 flex justify-center"
              >
                <img src="/dogicon.png" alt="Ajouter un chien" style={{ width: '40px' }} />
              </a>

              <a
                onClick={() => {
                  setShowEditPassword(!showEditPassword);
                  setShowEditProfile(false);
                  setShowAddDogForm(false);
                }}
                className="p-2 w-full z-75 flex justify-center"
              >
                <img src="/settingsdogwalk.png" alt="Modifier le mot de passe" style={{ width: '40px' }} />
              </a>

              <a
                onClick={() => {
                  logout();
                  onLogout();
                }}
                className="p-2 w-full z-75 flex justify-center cursor-pointer"
              >
                <img src="/logout.png" alt="Déconnexion" style={{ width: '40px' }} />
              </a>
            </div>
          </nav>
        </header>
      )}
      <a
        onClick={() => setIsNavbarVisible(!isNavbarVisible)}
        className="absolute top-4 left-4 cursor-pointer"
      >
        <img
          src="/mimilogo.png"
          alt="Dogwalk logo"
          style={{ width: '100px', transition: 'transform 0.3s ease' }}
          className={isNavbarVisible ? 'transform rotate-0' : 'transform rotate-180'}
        />
      </a>
    </>
  );
}
