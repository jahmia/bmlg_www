# Repository guide

## Project shape

This is a static, framework-free bilingual website for BMLG Group. The home page (`index.html`) contains the company overview, subsidiaries, services, project, and contact form. `privacy-policy.html` and `terms-of-service.html` are standalone legal pages that reuse the shared stylesheet and JavaScript. The pages link to `style.css` and load `app.js` with `defer`; there is no server-side application or form backend. The architectural artwork is made with CSS rather than downloaded image assets.

The company facts and French source material are in `about.txt`. Keep those facts consistent across the English and French copy in the HTML. The legal pages contain their own bilingual content.

## Build, test, and lint

There is no package manifest, build step, automated test suite, or configured linter. Check JavaScript syntax with `node --check app.js`. To preview the static site from the repository root, run:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`. There is no unit-test command. The Playwright MCP server is configured in `.vscode/mcp.json`; use it for focused browser checks of `/`, `/privacy-policy.html`, or `/terms-of-service.html`, including language switching and the mobile menu. On the home page, verify that a valid contact form prepares an email in the visitor's mail app; it does not send data to a backend.

## Cross-file behavior and conventions

- English and French copy live side by side in HTML as `data-en` and `data-fr` attributes. `app.js` switches the document language and updates text, placeholders, image alt text, and accessible labels. When adding translated content, provide both attributes and preserve any intended inline markup; the script renders translated `data-en`/`data-fr` values as HTML.
- The selected language is stored as `bmlg-language` in local storage, with English as the fallback. The same script is shared by the home and legal pages; legal page body classes select their translated title and description.
- The contact form's `name` attributes and the matching IDs are read by `app.js` to build a localized `mailto:` message. Keep them in sync when changing fields; do not assume submissions are stored or transmitted by this site.
- The mobile menu's `aria-expanded` state, `.is-open` navigation class, and `body.menu-open` class are managed together in `app.js` and styled in `style.css`. Preserve this coordination and the Escape/link-close behavior.
- `style.css` owns shared page styling, responsive layouts (notably the 1000px and 640px breakpoints), CSS-drawn architectural visuals, and reduced-motion behavior.
- Keep the three HTML pages' shared header, footer, language controls, and stylesheet/script links consistent. Legal-page-specific behavior depends on the `legal-privacy` and `legal-terms` body classes.
