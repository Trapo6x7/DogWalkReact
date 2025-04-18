import { useState, useEffect } from "react";
import { Dogs } from "./Dogs";
import Footer from "./Footer";
import { Me } from "./Me";
import { Navbar } from "./Navbar";
import { UserData } from "../types/Interfaces";

export function Welcome() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const fetchUserData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token non disponible");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données utilisateur"
        );
      }

      const data: UserData = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    setUserData(null);
    setIsLoggedIn(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    fetchUserData();
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <p>Veuillez vous connecter.</p>;
  }

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <>
      <Navbar
        userData={userData}
        onLogout={handleLogout}
        onLoginSuccess={handleLoginSuccess}
      />
      <section className="flex gap-8 justify-center py-8 px-47 w-full items-center">
        <article className="w-1/3">
          <Me userData={userData} />
        </article>

        <article className="w-1/3 flex justify-center">
          <img src="/dogwalklogobrown.png" alt="logo" className="h-1/2 w-1/2" />
        </article>

        <article className="w-1/3">
          <Dogs />
        </article>
      </section>
      <Footer />
    </>
  );
}