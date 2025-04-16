import { Dogs } from "./Dogs";
import { Me } from "./Me";
import { Navbar } from "./Navbar";

export function Welcome() {
  return (
    <>
      <Navbar />

      <section className="flex gap-8 justify-center py-8 px-47 w-full items-center">
        <article className="w-1/3">
          <Me />
        </article>

        <article className="w-1/3 flex justify-center">
          <img src="/dogwalklogobrown.png" alt="logo" className="h-1/2 w-1/2" />
        </article>

        <article className="w-1/3">
          <Dogs />
        </article>
      </section>
    </>
  );
}
