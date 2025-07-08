import { useAuth } from "../context/AuthContext";
import { Dogs } from "./Dogs";
import Footer from "./Footer";
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
      <section className="flex flex-col items-center justify-center min-h-screen">
        <section className="flex w-full flex-col md:flex-row gap-2 justify-center px-2 md:px-20 lg:px-32 xl:px-48 items-center">
          <article className="w-full max-w-xl">
            <Me userData={user} />
          </article>

          <article className="w-full md:w-1/3 hidden md:flex justify-center items-center">
            <img
              src="/dogwalklogobrown.png"
              alt="logo"
              className="w-auto lg:w-48 mx-auto"
            />
          </article>

          <article className="w-full max-w-xl">
            <Dogs />
          </article>
        </section>

        <section className="flex flex-col md:flex-row gap-10 justify-center items-start py-10 px-2 w-full md:px-20 lg:px-32 xl:px-48">
          <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
            <Groups />
          </div>
        </section>
             <article className="w-full md:w-1/4 flex md:hidden justify-center items-center">
            <img
              src="/dogwalklogobrown.png"
              alt="logo"
              className="w-[120px] lg:w-48 mx-auto"
            />
          </article>
      </section>
    </>
  );
}
