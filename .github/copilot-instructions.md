# BMLG Group site

## Architecture

The site is static HTML, CSS and vanilla JavaScript; there is no package manager, framework, backend, or form service. `index.html` is the bilingual company site. `privacy-policy.html` and `terms-of-service.html` are separate legal pages, sharing the masthead, footer styles, language control, and `app.js`. Visual building illustrations are inline SVG; do not add image-host dependencies unless the privacy notice is updated to describe them.

The French company profile in `about.txt` is the factual source for the group, subsidiary, service, and project copy. It describes BMLG Property Inc. as wholly owned, BMLG Services Inc.'s operational and project expertise, and BMLG Soldier Memorial Inc.'s 34-unit building with Immo Alliance as a 40% partner.

## Local checks

No build, lint, or automated test commands are defined. Check JavaScript syntax with:

```sh
node --check app.js
```

Serve the site from the repository root:

```sh
python3 -m http.server 8000
```

Use the Playwright MCP configured in `.vscode/mcp.json` for focused checks of the homepage and both legal pages. Cover English/French switching, mobile navigation, legal-page links, and the contact form's mailto behavior. The form opens a prefilled email; it does not submit to a server.

## Cross-file conventions

- Each translatable text node uses matching `data-en` and `data-fr` attributes. `app.js` swaps these as HTML, so preserve intentional inline markup in attribute values or keep translated text separate from links and other nested elements.
- The language choice is persisted as `bmlg-language` in local storage. The shared script also sets page title and description based on the legal page body class (`legal-privacy` or `legal-terms`).
- Keep form field IDs and names aligned with the `FormData` reads in `app.js`; valid submission builds a localized `mailto:contact@bmlggroup.com` draft.
- Mobile navigation state is coordinated by `aria-expanded`, the `.is-open` class on `.site-nav`, and `body.menu-open`; keep the Escape-key and navigation-link close behaviors intact.
- Shared layout and responsive styles live in `style.css`. Its breakpoints are 1000px and 680px, and reduced-motion preferences disable smooth scrolling and transitions.
