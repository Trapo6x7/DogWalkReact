import React from 'react';


interface FooterProps {
  onShowTerms?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowTerms }) => {
  return (
    <footer className="flex flex-col items-center justify-center gap-2 py-2">
      <div className="flex items-center justify-center gap-2">
        <a href="#" aria-label="Lien vers Instagram" tabIndex={0}>
          <img src='/socialicon1.png' alt='Instagram' />
        </a>
        <a href="#" aria-label="Lien vers Facebook" tabIndex={0}>
          <img src='/socialicon2.png' alt='Facebook' />
        </a>
        <a href="#" aria-label="Lien vers Twitter" tabIndex={0}>
          <img src='/socialincon3.png' alt='Twitter' />
        </a>
        <a href="#" aria-label="Lien vers LinkedIn" tabIndex={0}>
          <img src='/socialicon4.png' alt='LinkedIn' />
        </a>
      </div>
      <button
        className="mt-2 text-xs text-primary-green hover:text-primary-brown focus:outline-none"
        onClick={onShowTerms}
        aria-label="Voir les conditions générales d'utilisation"
      >
        Conditions générales d'utilisation
      </button>
    </footer>
  );
};

export default Footer;