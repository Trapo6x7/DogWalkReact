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

  const handleNavigation = (path: string) => {
    console.log(`Navigation vers ${path}`);
  };

  return (
    <header className="flex justify-around items-center px-6 bg-[#FBFFEE]">
      <nav className="container mx-auto py-1">
        <div className="flex justify-between">
          <a
            onClick={() => handleNavigation("/")}
            className="flex items-center space-x-2 w-1/12"
          >
            <img src="/mimilogo.png" alt="Dogwalk logo" />
          </a>

          <nav className="flex justify-between">
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
              className="p-2 w-19 z-75"
            >
              <img src="/iconprofile.png" alt="Modifier le profil" />
            </a>

            <a
              onClick={() => {
                setShowAddDogForm(!showAddDogForm);
                setShowEditProfile(false);
                setShowEditPassword(false);
              }}
              className="p-2 w-19 z-75"
            >
              <img src="/dogicon.png" alt="Ajouter un chien" />
            </a>

            {/* 🔐 Bouton pour modifier le mot de passe */}
            <a
              onClick={() => {
                setShowEditPassword(!showEditPassword);
                setShowEditProfile(false);
                setShowAddDogForm(false);
              }}
              className="p-2 w-15 z-75"
            >
              <img src="/settingsdogwalk.png" alt="Modifier le mot de passe" />
            </a>

            <a
              onClick={() => {
                logout();
                onLogout();
              }}
              className="p-2 w-15 z-75 cursor-pointer"
            >
              <img src="/logout.png" alt="Déconnexion" />
            </a>
          </nav>
        </div>
      </nav>
    </header>
  );
}
