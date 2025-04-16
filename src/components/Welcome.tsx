import { Dogs } from "./Dogs";
import { Me } from "./Me";
import { Navbar } from "./Navbar";

export function Welcome() {
  return (
    <>
      <Navbar />

      <section className="flex flex-wrap px-23 py-8 h-full">
        <article className="flex justify-center items-center w-1/3">
          <Me />
        </article>

        <article className="flex justify-center items-center w-1/3">
          <img src="/dogwalklogobrown.png" alt="logo" className="w-1/2" />
        </article>

        <article className="flex justify-center items-center w-1/3">
          <Dogs />
        </article>
      </section>


    </>
  );
}
