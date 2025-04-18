import { useAuth } from "../context/AuthContext";
import { Dogs } from "./Dogs";
import Footer from "./Footer";
import { Me } from "./Me";
import { Navbar } from "./Navbar";

export function Welcome() {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <p>Veuillez vous connecter.</p>;
  }

  return (
    <>
      <Navbar />
      <section className="flex gap-8 justify-center py-8 px-47 w-full items-center">
        <article className="w-1/3">
          <Me userData={user} />
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