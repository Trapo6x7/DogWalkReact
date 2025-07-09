import React from 'react';


const Footer: React.FC = () => {
  return (
    <footer aria-label="Réseaux sociaux" className="flex items-center justify-center gap-2 py-2">
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
    </footer>
  );
};


export default Footer;