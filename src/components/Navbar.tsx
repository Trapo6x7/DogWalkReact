import { useState } from "react";

export function Navbar() {
  const [currentPage, setCurrentPage] = useState("/");

  const handleNavigation = (path: string) => {
    setCurrentPage(path);
  };
const handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault(); // Empêche le comportement par défaut de l'élément <a>
  
  // Suppression du token d'authentification
  localStorage.removeItem("authToken"); // Si le token est stocké dans localStorage
  sessionStorage.removeItem("authToken"); // Si le token est stocké dans sessionStorage

  // Redirection vers la page de connexion
  window.location.href = "/login"; // Remplacez "/login" par la route de votre page de connexion

  console.log("Déconnexion effectuée");
};

  return (
    <header className="flex justify-around bg-white/80">
      <nav className="container mx-auto py-1">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            onClick={() => handleNavigation("/")}
            className="flex items-center space-x-2 w-1/12"
          >
            <img src="/mimilogo.png" alt="" />
          </a>

          {/* Bouton de déconnexion */}
          <a
            href="#"
            onClick={handleLogout}
            className="px-4 py-2 text-white rounded transition-colors duration-200 w-20"
          >
            <img src="/logout.png" alt="" />
          </a>
        </div>
      </nav>
    </header>
  );
}