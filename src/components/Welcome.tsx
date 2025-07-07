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
      <section
        className="flex flex-col md:flex-row gap-8 justify-center py-6 px-2 w-full md:px-12 lg:px-24 xl:px-32 items-center"
      >
        <article className="w-full">
          <Me userData={user} />
        </article>

        <article className="w-full md:w-1/3 flex justify-center">
          <img
            src="/dogwalklogobrown.png"
            alt="logo"
            className="w-[90px] lg:w-40 mx-auto"
          />
        </article>

        <article className="w-full">
          <Dogs />
        </article>
      </section>

      <section
        className="flex justify-center items-center py-6 px-2 w-full md:px-12 lg:px-24"
      >
        <Groups />
      </section>
      <Footer />
    </>
  );
}