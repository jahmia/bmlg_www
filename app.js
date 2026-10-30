const root = document.documentElement;
const languageButton = document.querySelector('.language-toggle');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');

const translations = {
  en: {
    menuOpen: 'Open navigation',
    menuClose: 'Close navigation',
    switchLanguage: 'Passer en français',
    pageTitle: 'BMLG Group — Real Estate & Property Services in New Brunswick',
    description: 'BMLG Group brings property ownership, rental operations and building services together in New Brunswick.',
    name: 'Name',
    email: 'Email',
    interest: 'Interest',
    formSuccess: 'Your email app should open with the consultation request ready to send.'
  },
  fr: {
    menuOpen: 'Ouvrir la navigation',
    menuClose: 'Fermer la navigation',
    switchLanguage: 'Switch to English',
    pageTitle: 'BMLG Group — Immobilier et services immobiliers au Nouveau-Brunswick',
    description: 'BMLG Group réunit détention immobilière, gestion locative et services aux immeubles au Nouveau-Brunswick.',
    name: 'Nom',
    email: 'Courriel',
    interest: 'Sujet',
    formSuccess: 'Votre application de courriel devrait s’ouvrir avec la demande prête à envoyer.'
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

  document.title = translations[lang].pageTitle;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = translations[lang].description;
  if (navigation) navigation.setAttribute('aria-label', lang === 'fr' ? 'Navigation principale' : 'Main navigation');
  document.querySelectorAll('.brand[aria-label]').forEach((brand) => {
    brand.setAttribute('aria-label', lang === 'fr' ? 'Accueil BMLG Group' : 'BMLG Group home');
  });
  if (languageButton) {
    languageButton.setAttribute('aria-pressed', String(lang === 'fr'));
    languageButton.setAttribute('aria-label', translations[lang].switchLanguage);
  }
  updateMenuLabel();
  try {
    localStorage.setItem('bmlg-language', lang);
  } catch {
    // Language switching still works when browser storage is unavailable.
  }
}

function updateMenuLabel() {
  if (!menuButton) return;
  const lang = root.lang === 'fr' ? 'fr' : 'en';
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-label', isOpen ? translations[lang].menuClose : translations[lang].menuOpen);
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
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
    updateMenuLabel();
  });
  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

languageButton?.addEventListener('click', () => setLanguage(root.lang === 'en' ? 'fr' : 'en'));

let initialLanguage = 'en';
try {
  initialLanguage = localStorage.getItem('bmlg-language') || 'en';
} catch {
  // English remains the default when browser storage is unavailable.
}
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
    const body = encodeURIComponent(`${translations[lang].name}: ${data.get('name')}\n${translations[lang].email}: ${data.get('email')}\n${translations[lang].interest}: ${interestText}\n\n${data.get('message')}`);
    const status = document.querySelector('#form-status');
    if (status) status.textContent = translations[lang].formSuccess;
    window.location.href = `mailto:contact@bmlggroup.com?subject=${subject}&body=${body}`;
  });
}
