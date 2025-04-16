import { Dogs } from "./Dogs";
import { Me } from "./Me";


export function Welcome() {
  return (
    <>

    <section id="home" className="flex flex-wrap p-20 h-full">
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
