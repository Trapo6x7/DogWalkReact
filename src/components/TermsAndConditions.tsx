

export default function TermsAndConditions({ onBack }: { onBack?: () => void }) {
  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-4 justify-center items-center text-center rounded-lg">
      <h1 className="text-2xl font-bold">Conditions Générales d'Utilisation</h1>
      <p>Bienvenue sur DogWalk. Veuillez lire attentivement ces conditions générales d'utilisation avant d'utiliser notre service.</p>
      <h2 className="text-xl font-semibold">1. Acceptation des conditions</h2>
      <p>En accédant ou en utilisant notre application, vous acceptez d'être lié par ces conditions générales.</p>
      <h2 className="text-xl font-semibold">2. Utilisation du service</h2>
      <p>Vous vous engagez à utiliser l'application conformément à la loi et à ne pas porter atteinte aux droits d'autrui.</p>
      <h2 className="text-xl font-semibold">3. Données personnelles</h2>
      <p>Vos données sont traitées conformément à notre politique de confidentialité.</p>
      <h2 className="text-xl font-semibold">4. Responsabilité</h2>
      <p>DogWalk décline toute responsabilité en cas de mauvaise utilisation de l'application.</p>
      <h2 className="text-xl font-semibold">5. Modifications</h2>
      <p>Nous nous réservons le droit de modifier ces conditions à tout moment.</p>
      <p className="mt-6">Dernière mise à jour : 9 juillet 2025</p>
      {onBack && (
        <button
          className="mt-8 px-6 py-2 bg-primary-green text-primary-brown rounded hover:bg-primary-brown hover:text-white transition-colors"
          onClick={onBack}
        >
          Retour
        </button>
      )}
    </div>
  );
}
