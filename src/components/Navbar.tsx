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
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 700 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`fixed left-0 z-40 bg-[#FBFFEE] shadow-lg transition-transform duration-300 flex flex-col items-center
        ${isMobile ? "top-0 w-screen h-auto rounded-b-2xl" : "top-0 h-100 w-[110px] rounded-b-2xl pt-6"}
      `}
    >
      {/* Desktop vertical menu */}
      {!isMobile && (
        <nav className="flex flex-col gap-2 items-center w-full justify-center">
          <a
            onClick={() => {
              setShowEditProfile(!showEditProfile);
              setShowAddDogForm(false);
              setShowEditPassword(false);
            }}
            className="p-2 w-15 z-75 cursor-pointer"
          >
            <img src="/usericon2.png" alt="Modifier le profil" />
          </a>
          <a
            onClick={() => {
              setShowAddDogForm(!showAddDogForm);
              setShowEditProfile(false);
              setShowEditPassword(false);
            }}
            className="p-2 w-15 z-75 cursor-pointer"
          >
            <img src="/dogicon2.png" alt="Ajouter un chien" />
          </a>
          <a
            onClick={() => {
              setShowEditPassword(!showEditPassword);
              setShowEditProfile(false);
              setShowAddDogForm(false);
            }}
            className="p-2 w-15 z-75 cursor-pointer"
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
          {/* Séparateur */}
          <div className="w-10 h-[2px] bg-[#7B4E2E] opacity-30 mx-auto rounded-full"></div>
          {/* Logo */}
          <a className="flex items-center border-none cursor-pointer mt-4 mb-6 bg-transparent">
            <img
              src="/logoronddogwalk2.png"
              alt="Dogwalk logo"
              className="h-12 w-12"
            />
          </a>
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
            <span className="block w-7 h-1 bg-[#7B4E2E] mb-1 rounded transition-all"></span>
            <span className="block w-7 h-1 bg-[#7B4E2E] mb-1 rounded transition-all"></span>
            <span className="block w-7 h-1 bg-[#7B4E2E] rounded transition-all"></span>
          </button>
        </nav>
      )}

      {/* Mobile menu drawer */}
      {isMobile && menuOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex flex-col items-end">
          <div className="bg-[#FBFFEE] w-64 h-full shadow-lg p-6 flex flex-col gap-6 animate-slide-in-right rounded-br-2xl">
            <button
              className="self-end mb-4"
              onClick={() => setMenuOpen(false)}
              aria-label="Fermer le menu"
            >
              <span className="text-3xl text-[#7B4E2E]">×</span>
            </button>
            <a
              onClick={() => {
                setShowEditProfile(true);
                setShowAddDogForm(false);
                setShowEditPassword(false);
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src="/usericon2.png"
                alt="Modifier le profil"
                className="h-7 w-7"
              />
              <span>Profil</span>
            </a>
            <a
              onClick={() => {
                setShowAddDogForm(true);
                setShowEditProfile(false);
                setShowEditPassword(false);
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src="/dogicon2.png"
                alt="Ajouter un chien"
                className="h-7 w-7"
              />
              <span>Ajouter un chien</span>
            </a>
            <a
              onClick={() => {
                setShowEditPassword(true);
                setShowEditProfile(false);
                setShowAddDogForm(false);
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src="/paramdogwalk.png"
                alt="Modifier le mot de passe"
                className="h-7 w-7"
              />
              <span>Mot de passe</span>
            </a>
            <a
              onClick={() => {
                logout();
                onLogout();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img src="/logout2.png" alt="Déconnexion" className="h-7 w-7" />
              <span>Déconnexion</span>
            </a>
          </div>
        </div>
      )}

      {/* Modales centrées */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-full max-w-lg mx-4 flex items-center justify-center">
            <EditProfileForm
              onCancel={() => setShowEditProfile(false)}
              userData={user}
              onSave={() => console.log("Save")}
              onRefresh={() => console.log("Refresh")}
            />
          </div>
        </div>
      )}

      {showAddDogForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-full max-w-md flex items-center justify-center">
            <AddDogs
              onCancel={() => setShowAddDogForm(false)}
              onRefresh={() => console.log("Refresh")}
            />
          </div>
        </div>
      )}

      {showEditPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="p-6 w-full max-w-md flex items-center justify-center">
            <EditPasswordForm onCancel={() => setShowEditPassword(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
