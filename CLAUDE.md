# CLAUDE.md — getpro-design

Site statique HTML/CSS/JS (pas de build), assets en `assets/{slug}.svg`, données dans
`*.json`. Servir avec `python3 -m http.server 4321` (cf. `.claude/launch.json`).

## Règle critique : ne pas saturer le contexte avec des images

Ce repo a beaucoup d'assets visuels (logos, photos, screenshots d'audit). **Plusieurs
sessions précédentes ont crashé parce que le contexte s'est saturé d'images binaires.**

### À faire systématiquement

- **Audits visuels multi-pages** → utiliser le pattern sprite-sheet de `_audit/`
  (cf. PR #4) : screenshot fullpage → append immédiat dans un sprite horizontal →
  `rm` de l'image source. Une seule image accumule la trace visuelle de N pages.
- **Recherches dans le repo qui touchent beaucoup de fichiers** (find, grep, ls
  sur `assets/`, audits cross-fichiers) → déléguer à un sous-agent `Explore` via
  l'outil Agent. Le sous-agent lit dans son propre contexte et renvoie un résumé
  textuel court.
- **Métadonnées d'image** (dimensions, type, taille) → `identify`, `file`, `stat`
  via Bash. Jamais `Read` sur le fichier image.
- **Screenshots Playwright** → fullPage avec viewport étendu à la hauteur du
  document pour éviter les artefacts de stitching avec `loading="lazy"`. Sauver
  sur disque, ne pas Read inline.

### À éviter

- `Read` sur un fichier `.png`/`.jpg`/`.jpeg`/`.gif`/`.webp` > 200KB. Un hook
  `PreToolUse` (cf. `.claude/settings.json`) le bloque automatiquement.
- `Read` sur un SVG qui embed un PNG en base64 (`urb-it.svg`, `satelia.svg`,
  `spark-cleantech.svg`). Utiliser `head` ou `grep` via Bash si besoin.
- Lecture séquentielle de plusieurs screenshots pleine page dans la même session.
- `ls` ou `find` qui crache 800+ lignes — pipe vers `head`/`wc -l`/`sort` pour
  réduire la sortie.

## Structure des assets

- `assets/{slug}.svg` — logos clients (rendu via `assets/${c.slug}.svg` templated
  dans `clients.html` et `solutions-profils.html`)
- `assets/team/*.{jpg,png}` — photos équipe (référencées en `background-image`
  CSS dans `index.html` et `equipe.html`)
- `assets/{Gsatge,filigran-cover,electra-cover,initial-arthur-mensch-...}.jpg` —
  case-images des cards (référencées en `background-image` CSS dans `index.html`)
- `_check.html` — page de vérification de tous les logos clients

## Pages

`index.html`, `clients.html`, `equipe.html`, `contact.html`, `mentions.html`,
`methode.html`, `solutions-{cdi,clevel,drh,freelance,outils,profils,rpo}.html`.

Données : `clients.json`, `candidates.json`, `cases.json`, `metiers.json`.
Templating client-side dans le `<script>` de chaque HTML.

## Notes upstream Checkmate

`CHECKMATE-UPSTREAM-FIXES.md` documente les fixes locaux à propager dans
`getpro-checkmate` (logos cassés / mal générés). Ce sont des notes — pas des
références de code.
