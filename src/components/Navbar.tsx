import { useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("/");

  const handleNavigation = (path: string) => {
    setCurrentPage(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-background border-b flex justify-around">
      <nav className="container mx-auto py-1">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            onClick={() => handleNavigation("/")}
            className="flex items-center space-x-2 w-1/12"
          >
            <img src="/mimilogo.png" alt="" />
          </a>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col justify-center items-center w-12 h-12 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-1 w-6 bg-current rounded-full transform transition-all duration-300 ease-in-out ${
                isMenuOpen ? "rotate-45 translate-y-[0.33rem]" : ""
              }`}
            />

            <span
              className={`block h-1 w-6 bg-current rounded-full transform transition-all duration-300 ease-in-out ${
                isMenuOpen ? "-rotate-45 -translate-y-[0.33rem]" : ""
              }`}
            />
          </button>
        </div>

        {/* Menu dropdown avec animation */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-2">
            <a
              //   onClick={() => handleNavigation("/promenades")}
              className={`block w-full text-left px-4 py-2 transition-colors duration-200 ${
                currentPage === "/promenades"
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-accent/50"
              }`}
            >
              Promenades
            </a>
            <a
              //   onClick={() => handleNavigation("/chiens")}
              className={`block w-full text-left px-4 py-2 transition-colors duration-200 ${
                currentPage === "/chiens"
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-accent/50"
              }`}
            >
              Mes chiens
            </a>
            <a
              //   onClick={() => handleNavigation("/profil")}
              className={`block w-full text-left px-4 py-2 transition-colors duration-200 ${
                currentPage === "/profil"
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-accent/50"
              }`}
            >
              Mon profil
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
