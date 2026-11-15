# Kerala Biometrics Chapter — Website

Static site for GitHub Pages. No build step.

## Structure
```
index.html            Page layout and copy
assets/css/style.css  Styles (colours from the logo)
assets/js/main.js     Menu, events/team/resources rendering
images/               logo.png + favicon / web versions
data/site.json        Form links, email, LinkedIn, WhatsApp
data/events.json      Events (upcoming/past split by date automatically)
data/team.json        Founding team cards
data/resources.json   Resource links
.nojekyll             Serve files as-is
```

## Publish
1. Upload everything to the `main` branch root of `Kerala-Biometrics-Chapter/KBC`.
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)` → Save.
3. Site URL: `https://kerala-biometrics-chapter.github.io/KBC/`

## Update content (no HTML needed)
- **Add an event:** add an entry to `data/events.json` (`date` as `YYYY-MM-DD`).
- **Add a team member:** add to `data/team.json`; optional `photo` path such as `images/team/name.jpg`.
- **Change form/social links:** edit `data/site.json`.

## Preview locally
```
python -m http.server 8000
```
Open http://localhost:8000 (opening `index.html` directly won't load the JSON files).
