

export function Welcome() {
  return (
    <main>
    <section id="home">
      <article>
        <h1>Welcome to the Home Page</h1>
        {/* Lien pour naviguer vers la page /about */}
        <Link href="/about">
          <button>Go to About</button>
        </Link>
      </article>
    </section>
  </main>
  );
}

