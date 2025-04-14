import { useState, useEffect } from "react";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Welcome } from "./components/Welcome";

export default function App() {
  const [page, setPage] = useState<"login" | "register" | "welcome">("login");

  const handleRegisterSuccess = () => {
    setPage("welcome");
  };

  const handleLoginSuccess = () => {
    setPage("welcome");
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setPage("welcome");
    }
  }, []);

  return (
    <>
      {page === "login" && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onGoToRegister={() => setPage("register")}
        />
      )}
      {page === "register" && (
        <Register onRegisterSuccess={handleRegisterSuccess} />
      )}
      {page === "welcome" && <Welcome />}
    </>
  );
}
