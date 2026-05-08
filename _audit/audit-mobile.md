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
| solutions-profils.html | bugs → fixés | navbar pas sticky + view-tabs cachées sticky |
| _global_ | bug → fixé | navbar `.header` perdait `position: sticky` sous 480px (régression de l'override prévu pour ancrer le burger) |

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

## solutions-profils.html — 2 bugs fixés

### Bug A (global) — navbar `.header` perdait `position: sticky` sous 480px

`styles.css:312` overridait `.header { position: relative; }` sous 480px
au prétexte d'« ancrer le dropdown ». Mais `position: sticky` est non-static
et établit déjà un containing block pour les enfants `position: absolute` —
l'override était inutile et cassait la stickyness sur mobile pour TOUTES
les pages.

Fix : suppression de l'override. Le burger (`.menu-right` en `position:
absolute; top: 100%`) reste correctement ancré sous le `.header` sticky.

### Bug B — view-tabs cachées par le sticky `categories-col` en mobile

À ≤ 800px, `panel-body` passe en 1 colonne : `categories-col` (sticky bar
"Tech ▾ + Trustpilot") et `content-col` (qui contient `.view-tabs`
Placements/Témoignages, sticky aussi) se retrouvent empilés. Les 2 sticky
stop-tops étaient calibrés sur la nav, ils entraient en collision —
`categories-col` (z-index:5) écrasait `.view-tabs` (z-index:4) au scroll.

Fix : sous 800px, `.view-tabs` passe en `position: static` et reste en
flux normal au-dessus de la grille de profils. Seul `categories-col` reste
sticky en mobile (Tech + Trustpilot toujours accessibles au scroll).

### Hero (post-fix)

"Solutions" h1 + 3 sub-nav + Tech dropdown + Trustpilot + tabs
Placements/Témoignages + filter pills Software/IA/Hardware. Dense mais
tient en mobile, hiérarchie claire. Liste métiers en 1 col, lisible.

---

## Tooling audit (référence)

- `_audit/screenshot.mjs` : capture mobile fullpage via Playwright (iPhone 12, viewport élargi).
- `_audit/sprite_append.py` : ajoute une colonne au contact sheet horizontal, supprime l'image source. Garde la trace visuelle dans **un seul fichier** sans saturer le contexte image de la session.
- `_audit/crop.py` : utilitaire de crop rapide pour zoomer sur une zone précise pendant l'audit.
- `_audit/_tmp/` : working dir gitignoré (server log, pid, screenshots temp).
- `_audit/node_modules/` : symlinks vers playwright global, gitignoré.
