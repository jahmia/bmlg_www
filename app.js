const html = document.documentElement;
const languageButton = document.querySelector('.language-toggle');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

const copy = {
  en: {
    menuOpen: 'Open navigation',
    menuClose: 'Close navigation',
    language: 'Passer en français',
    homeTitle: 'BMLG Group | Real estate, built with purpose',
    privacyTitle: 'Privacy | BMLG Group',
    termsTitle: 'Terms of Use | BMLG Group',
    homeDescription: 'BMLG Group connects real estate ownership, property operations and building services across New Brunswick.',
    privacyDescription: 'How BMLG Group collects, uses, discloses, and safeguards personal information.',
    termsDescription: 'Terms of use for the websites and digital services of BMLG Group.',
    formSent: 'Your email app should open with the message ready to send.'
  },
  fr: {
    menuOpen: 'Ouvrir la navigation',
    menuClose: 'Fermer la navigation',
    language: 'Switch to English',
    homeTitle: 'BMLG Group | L’immobilier, avec intention',
    privacyTitle: 'Confidentialité | BMLG Group',
    termsTitle: 'Conditions d’utilisation du service | BMLG Group',
    homeDescription: 'BMLG Group réunit détention immobilière, gestion locative et services aux immeubles au New Brunswick.',
    privacyDescription: 'Comment BMLG Group recueille, utilise, divulgue et protège les renseignements personnels.',
    termsDescription: 'Conditions d’utilisation des sites Web et services numériques de BMLG Group.',
    formSent: 'Votre application de courriel devrait s’ouvrir avec le message prêt à envoyer.'
  }
};

function updateMenuLabel() {
  if (!menuButton) return;
  const lang = html.lang === 'fr' ? 'fr' : 'en';
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-label', isOpen ? copy[lang].menuClose : copy[lang].menuOpen);
}

function setLanguage(language) {
  const lang = language === 'fr' ? 'fr' : 'en';
  html.lang = lang;
  html.dataset.lang = lang;
  document.querySelectorAll('a[href]').forEach((link) => {
    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return;
    destination.searchParams.set('lang', lang);
    link.href = destination.href;
  });
  document.querySelectorAll('[data-en][data-fr]').forEach((element) => {
    element.innerHTML = element.dataset[lang];
  });
  document.querySelectorAll('[data-en-aria-label][data-fr-aria-label]').forEach((element) => {
    element.setAttribute('aria-label', element.dataset[`${lang}AriaLabel`]);
  });
  document.title = document.body.classList.contains('legal-privacy')
    ? copy[lang].privacyTitle
    : document.body.classList.contains('legal-terms')
      ? copy[lang].termsTitle
      : copy[lang].homeTitle;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.content = document.body.classList.contains('legal-privacy')
      ? copy[lang].privacyDescription
      : document.body.classList.contains('legal-terms')
        ? copy[lang].termsDescription
        : copy[lang].homeDescription;
  }
  if (navigation) navigation.setAttribute('aria-label', lang === 'fr' ? 'Navigation principale' : 'Main navigation');
  document.querySelectorAll('.wordmark[aria-label]').forEach((brand) => {
    brand.setAttribute('aria-label', lang === 'fr' ? 'Accueil BMLG Group' : 'BMLG Group home');
  });
  if (languageButton) {
    languageButton.setAttribute('aria-pressed', String(lang === 'fr'));
    languageButton.setAttribute('aria-label', copy[lang].language);
  }
  updateMenuLabel();
  try {
    localStorage.setItem('bmlg-language', lang);
  } catch {
    // Language switching works even when browser storage is unavailable.
  }
}

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  updateMenuLabel();
}

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    updateMenuLabel();
  });
  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

languageButton?.addEventListener('click', () => {
  setLanguage(html.lang === 'en' ? 'fr' : 'en');
});

const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
let preferredLanguage = requestedLanguage === 'en' || requestedLanguage === 'fr' ? requestedLanguage : 'en';
if (requestedLanguage !== 'en' && requestedLanguage !== 'fr') {
  try {
    preferredLanguage = localStorage.getItem('bmlg-language') || 'en';
  } catch {
    // English is the default when browser storage is unavailable.
  }
}
setLanguage(preferredLanguage);

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const data = new FormData(contactForm);
    const lang = html.lang === 'fr' ? 'fr' : 'en';
    const interest = contactForm.querySelector('#interest');
    const topic = interest?.selectedOptions[0]?.textContent.trim() || String(data.get('interest'));
    const subject = encodeURIComponent(`${lang === 'fr' ? 'Demande BMLG Group' : 'BMLG Group enquiry'} — ${topic}`);
    const body = encodeURIComponent(
      `${lang === 'fr' ? 'Nom' : 'Name'}: ${data.get('name')}\n` +
      `${lang === 'fr' ? 'Courriel' : 'Email'}: ${data.get('email')}\n` +
      `${lang === 'fr' ? 'Sujet' : 'Topic'}: ${topic}\n\n${data.get('message')}`
    );
    const status = document.querySelector('#form-status');
    if (status) status.textContent = copy[lang].formSent;
    window.location.href = `mailto:contact@bmlggroup.com?subject=${subject}&body=${body}`;
  });
}
