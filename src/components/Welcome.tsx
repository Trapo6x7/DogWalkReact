import { useAuth } from "../context/AuthContext";
import { Dogs } from "./Dogs";
import Groups from "./Groups";
import { Me } from "./Me";
import { Navbar } from "./Navbar";

export function Welcome({ onLogout }: { onLogout: () => void }) {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <p>Veuillez vous connecter.</p>;
  }

  return (
    <>
      <Navbar onLogout={onLogout} />
      <main className="flex flex-col items-center justify-center min-h-screen w-full" role="main" aria-label="Accueil utilisateur">
        <section className="flex flex-col md:flex-row gap-2 justify-center px-2 md:px-20 lg:px-32 xl:px-48 items-center w-full max-w-md mx-auto md:max-w-none" aria-label="Section profil et chiens">
          <article className="w-full max-w-full" aria-label="Profil utilisateur">
            <Me userData={user} />
          </article>

          <article className="w-full md:w-1/6 px-4 hidden md:flex justify-center items-center" aria-hidden="true">
            <img
              src="/dogwalklogobrown.png"
              alt="Logo DogWalk"
              className="w-auto lg:w-48 mx-auto"
            />
          </article>

          <article className="w-full max-w-full" aria-label="Chiens utilisateur">
            <Dogs />
          </article>
        </section>

        <section className="flex flex-col md:flex-row gap-10 justify-center items-start py-10 px-2 w-full md:px-20 lg:px-32 xl:px-48" aria-label="Section groupes">
          <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
            <Groups />
          </div>
        </section>
        <article className="w-full md:w-1/4 flex md:hidden justify-center items-center" aria-hidden="true">
          <img
            src="/dogwalklogobrown.png"
            alt="Logo DogWalk"
            className="w-[120px] lg:w-48 mx-auto"
          />
        </article>
      </main>
    </>
  );
}
