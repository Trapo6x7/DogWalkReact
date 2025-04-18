import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import EditProfileForm from "./EditProfileForm";

export function Navbar() {
  const { user, logout } = useAuth();
  const [showEditProfile, setShowEditProfile] = useState(false);

  const handleNavigation = (path: string) => {
    console.log(`Navigation vers ${path}`);
  };

  return (
    <header className="flex justify-around items-center bg-[#FBFFEE]">
      <nav className="container mx-auto py-1">
        <div className="flex justify-between">
          {/* Logo */}
          <a
            onClick={() => handleNavigation("/")}
            className="flex items-center space-x-2 w-1/12"
          >
            <img src="/mimilogo.png" alt="" />
          </a>

          <nav className="flex gap-1">
            {/* Affichage conditionnel du formulaire de modification du profil */}
            {showEditProfile && user && (
              <div>
                <EditProfileForm
                  userData={user}
                  onCancel={() => setShowEditProfile(false)}
                  onSave={(updatedData) => {
                    console.log("Profil mis à jour :", updatedData);
                  }}
                  onRefresh={() => {}}
                />
              </div>
            )}
            {/* Bouton pour afficher le formulaire de modification du profil */}
            <a
              onClick={() => setShowEditProfile(!showEditProfile)}
              className="p-2 w-19 z-75"
            >
              <img src="/iconprofile.png" alt="Modifier le profil" />
            </a>

            {/* Bouton de déconnexion */}
            <a onClick={logout} className="p-2 w-15 z-75 cursor-pointer">
              <img src="/logout.png" alt="Déconnexion" />
            </a>
          </nav>
        </div>
      </nav>
    </header>
  );
}