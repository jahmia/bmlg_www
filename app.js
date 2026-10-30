const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
const languageButton = document.querySelector('.language-toggle');
const root = document.documentElement;
const translations = {
  en: {
    menuOpen: 'Open navigation', menuClose: 'Close navigation', switchLanguage: 'Passer en français',
    homeTitle: 'BMLG Group — Real Estate, Property & Construction in New Brunswick',
    privacyTitle: 'Privacy Policy — BMLG Group', termsTitle: 'Terms of Service — BMLG Group',
    description: 'BMLG Group is a New Brunswick real estate holding company bringing together property ownership, rental operations, project management and construction services.',
    privacyDescription: 'Read how BMLG Group handles personal information when you visit the website or contact our New Brunswick real estate group.',
    termsDescription: 'Review the terms for using the BMLG Group website and its property, rental, and construction information.',
    interestLabel: 'Interest', nameLabel: 'Name', emailLabel: 'Email', messageLabel: 'Message',
    formSuccess: 'Your email app should open with the consultation request ready to send.'
  },
  fr: {
    menuOpen: 'Ouvrir la navigation', menuClose: 'Fermer la navigation', switchLanguage: 'Switch to English',
    homeTitle: 'BMLG Group — Immobilier, gestion et construction au Nouveau-Brunswick',
    privacyTitle: 'Politique de confidentialité — BMLG Group', termsTitle: 'Conditions d’utilisation — BMLG Group',
    description: 'BMLG Group est une société de portefeuille immobilier du Nouveau-Brunswick qui réunit détention d’actifs, gestion locative, gestion de projets et services de construction.',
    privacyDescription: 'Découvrez comment BMLG Group traite les renseignements personnels lorsque vous visitez le site ou communiquez avec notre groupe immobilier.',
    termsDescription: 'Consultez les conditions d’utilisation du site de BMLG Group et de ses renseignements immobiliers, locatifs et de construction.',
    interestLabel: 'Sujet', nameLabel: 'Nom', emailLabel: 'Courriel', messageLabel: 'Message',
    formSuccess: 'Votre application de courriel devrait s’ouvrir avec la demande de consultation prête à envoyer.'
  }
};

function setLanguage(language) {
  const lang = language === 'fr' ? 'fr' : 'en';
  root.lang = lang;
  root.dataset.lang = lang;
  document.querySelectorAll('[data-en][data-fr]').forEach((element) => {
    element.innerHTML = element.dataset[lang];
  });
  document.querySelectorAll('[data-en-placeholder][data-fr-placeholder]').forEach((element) => {
    element.placeholder = element.dataset[`${lang}Placeholder`];
  });
  document.querySelectorAll('[data-en-alt][data-fr-alt]').forEach((element) => {
    element.alt = element.dataset[`${lang}Alt`];
  });
  document.querySelectorAll('[data-en-aria-label][data-fr-aria-label]').forEach((element) => {
    element.setAttribute('aria-label', element.dataset[`${lang}AriaLabel`]);
  });
  document.title = document.body.classList.contains('legal-privacy')
    ? translations[lang].privacyTitle
    : document.body.classList.contains('legal-terms')
      ? translations[lang].termsTitle
      : translations[lang].homeTitle;
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.content = document.body.classList.contains('legal-privacy')
      ? translations[lang].privacyDescription
      : document.body.classList.contains('legal-terms')
        ? translations[lang].termsDescription
        : translations[lang].description;
  }
  const pageNavigation = document.querySelector('#primary-nav');
  if (pageNavigation) pageNavigation.setAttribute('aria-label', lang === 'fr' ? 'Navigation principale' : 'Main navigation');
  document.querySelectorAll('.brand[aria-label]').forEach((brand) => {
    brand.setAttribute('aria-label', lang === 'fr' ? 'Accueil BMLG Group' : 'BMLG Group home');
  });
  if (languageButton) {
    languageButton.setAttribute('aria-pressed', String(lang === 'fr'));
    languageButton.setAttribute('aria-label', translations[lang].switchLanguage);
  }
  menuButton?.setAttribute('aria-label', menuButton.getAttribute('aria-expanded') === 'true'
    ? translations[lang].menuClose
    : translations[lang].menuOpen);
  try { localStorage.setItem('bmlg-language', lang); } catch { /* Storage can be unavailable in private browsing. */ }
}

if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', translations[root.lang]?.menuOpen || translations.en.menuOpen);
    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? translations[root.lang].menuOpen : translations[root.lang].menuClose);
    navigation.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });
  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
}

if (languageButton) {
  languageButton.addEventListener('click', () => setLanguage(root.lang === 'en' ? 'fr' : 'en'));
}
let initialLanguage = 'en';
try { initialLanguage = localStorage.getItem('bmlg-language') || 'en'; } catch { /* Keep English as the default. */ }
setLanguage(initialLanguage);

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const lang = root.lang === 'fr' ? 'fr' : 'en';
    const interest = contactForm.querySelector('#interest');
    const interestText = interest?.selectedOptions[0]?.textContent.trim() || String(data.get('interest'));
    const subject = encodeURIComponent(`${lang === 'fr' ? 'Demande BMLG Group' : 'BMLG Group enquiry'} — ${interestText}`);
    const body = encodeURIComponent(`${translations[lang].nameLabel}: ${data.get('name')}\n${translations[lang].emailLabel}: ${data.get('email')}\n${translations[lang].interestLabel}: ${interestText}\n\n${data.get('message')}`);
    const status = document.querySelector('#form-status');
    if (status) status.textContent = translations[lang].formSuccess;
    window.location.href = `mailto:contact@bmlggroup.com?subject=${subject}&body=${body}`;
  });
}

const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (parallaxItems.length && !reduceMotion.matches) {
  let ticking = false;
  const updateParallax = () => {
    const viewportHeight = window.innerHeight;
    parallaxItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewportHeight) return;
      const speed = Number(item.dataset.parallax) || 0.08;
      const offset = (rect.top + rect.height / 2 - viewportHeight / 2) * speed;
      const image = item.matches('img') ? item : item.querySelector('img');
      if (image) image.style.transform = `translate3d(0, ${Math.max(-24, Math.min(24, offset))}px, 0) scale(1.05)`;
    });
    ticking = false;
  };
  const requestParallax = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };
  window.addEventListener('scroll', requestParallax, { passive: true });
  window.addEventListener('resize', requestParallax);
  requestParallax();
}
