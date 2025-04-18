import { useState } from "react";

import { UserData } from "../types/Interfaces";
import EditProfileForm from "./EditProfileForm";

interface NavbarProps {
  userData: UserData | null;
  onLogout: () => void;
  onLoginSuccess: () => void;
}

export function Navbar({ userData, onLogout, onLoginSuccess }: NavbarProps) {
  const [showEditProfile, setShowEditProfile] = useState(false);

  const handleNavigation = (path: string) => {
    console.log(`Navigation vers ${path}`);
  };

  return (
    <header className="flex justify-around bg-[#FBFFEE]">
      <nav className="container mx-auto py-1">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            onClick={() => handleNavigation("/")}
            className="flex items-center space-x-2 w-1/12"
          >
            <img src="/mimilogo.png" alt="" />
          </a>

          <nav className="flex gap-1">
            {/* Affichage conditionnel du formulaire de modification du profil */}
            {showEditProfile && userData && (
              <div>
                <EditProfileForm
                  userData={userData}
                  onCancel={() => setShowEditProfile(false)}
                  onSave={(updatedData) => {
                    console.log("Profil mis à jour :", updatedData);
                  }}
                  onRefresh={onLoginSuccess}
                />
              </div>
            )}
            {/* Bouton pour afficher le formulaire de modification du profil */}
            <a
              onClick={() => setShowEditProfile(!showEditProfile)}
              className="p-2 w-15 z-75"
            >
              <img src="/settingsdogwalk.png" alt="Modifier le profil" />
            </a>

            {/* Bouton de déconnexion */}
            <a onClick={onLogout} className="p-2 w-15 z-75 cursor-pointer">
              <img src="/logout.png" alt="Déconnexion" />
            </a>
          </nav>
        </div>
      </nav>
    </header>
  );
}