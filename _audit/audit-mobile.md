# Audit mobile — getpro-design

Viewport iPhone 12 (390×844 CSS, DPR 3). Captures fullpage via Playwright,
viewport étendu pour éviter les artefacts de stitching sur les pages avec
images en `loading="lazy"`.
Trace visuelle complète : `_audit/audit-mobile-sprite.png` (contact sheet
horizontal — 1 colonne par page, dans l'ordre auditée).

## Résultats

| Page | Verdict | Action |
|---|---|---|
| index.html | OK | — |
| equipe.html | bug → fixé | overlap manifeste / captions sous 480px |
| clients.html | OK | — |
| contact.html | OK | — |
| solutions-profils.html | OK | — |

---

## index.html — OK

- **Hero** : titre 4 lignes, matrice portraits 3×3 dense (sans gap) → wall-of-faces réussi above-the-fold.
- **Cases studies** (Mistral AI, Lucca, Filigran) : cards aérées, bonne hiérarchie logo → titre → description → photo.
- **Manifeste "Depuis 2015"** : passe bien en 1 col mobile, line-height correct.
- **Logos clients IA** : grille 4-col desktop → 2-col mobile, lisibles.
- **Footer** : dense mais lisible.
- Asymétrie mineure : "Recrutement salarié / Freelance" sur 2 cols puis "RH de transition" seul → tolérable.

## equipe.html — bug fixé

### Constat

À 390px (iPhone 12), la règle `@media (max-width: 700px)` positionne
`.equipe-text` en `position: absolute; top: 0; left: 0; width: 33%;` avec
`z-index: 1`, et `.team-grid` en `z-index: 2`. L'intention : le manifeste
passe derrière les photos.

À 480px, la grille passe à 2 colonnes (au lieu de 4). Les photos sont
plus larges mais les **captions** (nom, rôle, années d'expérience) restent
sur fond transparent, sous le bord bas de la photo. Elles se posent pile
sur les paragraphes du manifeste qui dépassent au même y → chevauchement
illisible sous le 1ᵉʳ portrait (Romain Pichou).

### Fix appliqué

Sous 480px, on annule l'astuce absolute / z-index : le manifeste revient
en flux normal au-dessus de la grille (`equipe-row` en flex column,
`equipe-text` en `position: static`). L'effet poétique de transparence ne
fonctionne pas en 2 colonnes serrées ; en mobile le manifeste se lit
linéairement, puis la grille de portraits.

`equipe.html` lignes 212-237.

## clients.html — OK

- **Hero** : "Clients" + Trustfolio rating sur même ligne, search input clean.
- **Liste avec témoignages** : nom (col gauche) + quote tronquée (col droite). La troncature est précoce (4-5 mots avant `...`) sur mobile, mais c'est intentionnel — la quote complète s'ouvre au tap.
- **"Et aussi" — logos en 2 col + names en 2 col** : lisible.
- **Note tooling** : la première version du screenshot avait un faux trou de 4500px CSS au milieu de la page — artefact Playwright (lazy images race avec le stitching de fullPage). Fixé en `_audit/screenshot.mjs` en élargissant le viewport à la hauteur du document avant capture.

## contact.html — OK

- **Value props** ×5 (mission 48h, shortlist 60min, time-to-fill 50j, 800 recrutements, expérience 5★) : lisibles, hiérarchie correcte.
- **Form** : 1 col en mobile (de 2 cols desktop), padding correct, focus state propre, hairlines 1px nets.
- **CTA** : passe en pleine largeur en mobile (bonne ergonomie touch).
- Pas de h1 visible — choix design (page de conversion, value props font office d'accroche).

## solutions-profils.html — OK

- **Hero** : "Solutions" h1 + 3 sub-nav (Chasse / Renfort RH / Profils recrutés) + Tech dropdown + Trustpilot 5★ + tabs Placements/Témoignages + filter pills Software/IA/Hardware. Dense mais tient en mobile, hiérarchie claire.
- **Liste métiers** (QA Engineer, Développeur, etc.) : 1 col en mobile, lisibilité OK.
- **Footer** standard.

---

## Tooling audit (référence)

- `_audit/screenshot.mjs` : capture mobile fullpage via Playwright (iPhone 12, viewport élargi).
- `_audit/sprite_append.py` : ajoute une colonne au contact sheet horizontal, supprime l'image source. Garde la trace visuelle dans **un seul fichier** sans saturer le contexte image de la session.
- `_audit/crop.py` : utilitaire de crop rapide pour zoomer sur une zone précise pendant l'audit.
- `_audit/_tmp/` : working dir gitignoré (server log, pid, screenshots temp).
- `_audit/node_modules/` : symlinks vers playwright global, gitignoré.
