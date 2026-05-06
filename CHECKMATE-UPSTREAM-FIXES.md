# Fixes à faire passer dans Checkmate

Ce fichier liste les corrections appliquées localement sur les assets logos
qui devraient être propagées dans le repo source `getpro-checkmate` pour
que les prochains téléchargements depuis https://getpro-checkmate.vercel.app
soient propres dès l'origine.

## 1. Lucca — version couleur orange à remplacer par mono

**Symptôme** : `assets/lucca.svg` (downloaded from `/logos/lucca.svg`)
contient les couleurs `#ff7b3d` (orange) + `#2a3551` (navy). Tous les
autres logos clients sont en mono noir → Lucca détonnait visuellement
sur clients.html et la grille home.

**Fix appliqué** : remplacé localement par la version mono (copie de
`assets/logos-mono/lucca.svg`). Le wordmark mono existait déjà sur
Checkmate à `/logos-mono/lucca.svg`.

**Action Checkmate** : si le rendu mono est attendu par défaut, le
endpoint `/logos/lucca.svg` devrait servir la version mono — ou bien
documenter explicitement que les consommateurs doivent toujours utiliser
`/logos-mono/` quand ils veulent du mono.

---

## 2. Satelia — mono PNG est un icône 32×32 au lieu du wordmark

**Symptôme** : `/logos-mono/satelia.png` retourne un PNG 32×32 (juste
un mini icône, illisible à la taille d'affichage des rows). Le SVG mono
`/logos-mono/satelia.svg` wrap aussi cette même mini-image via
`<pattern>` + `<image xlink:href="data:image/png;base64,...">`.

Le wordmark complet n'existe qu'en version couleur (`/logos/satelia.svg`,
1260×278, embed PNG via pattern, couleurs vertes #1a4d2e + accents).

**Fix appliqué** : extrait le PNG du wordmark color, désaturé tous les
pixels colorés vers `#062004` (--ink) en préservant l'alpha original,
trim au bbox, resize à 400px max, ré-embed en SVG via
`<image xlink:href="data:image/png;base64,...">`.

**Action Checkmate** :
- Générer un vrai mono **wordmark** pour satelia (pas juste l'icône) à
  `/logos-mono/satelia.svg` et `/logos-mono/satelia.png`
- Idéalement à résolution raisonnable (< 1000px de large) pour ne pas
  embed des PNG inutilement lourds

---

## 3. Spark Cleantech — mono PNG corrompu (carré noir vide)

**Symptôme** : `/logos-mono/spark-cleantech.png` retourne un PNG
2400×1600 100 % opaque noir uni — aucun contenu logo, juste un
rectangle plein. Le SVG `/logos-mono/spark-cleantech.svg` référence ce
PNG via `<image xlink:href="/logos-mono/spark-cleantech.png">` (chemin
absolu qui ne marche que sur le domaine Checkmate).

La version couleur `/logos/spark-cleantech.svg` est un vrai PNG
1024×512 RGBA avec le wordmark "spark" + étoile (couleurs purple +
dark blue).

**Fix appliqué** : utilisé le PNG color comme source, désaturé en --ink,
trim, resize 400px, ré-embed en SVG inline base64.

**Action Checkmate** :
- Régénérer le mono PNG depuis le source vector — il est complètement
  cassé actuellement
- Idem que pour satelia : le SVG mono devrait embed la PNG en base64
  inline, pas la référencer en chemin absolu (qui casse hors-domaine)

---

## 4. 20 logos initialement absents de `/logos-mono/` (résolu en pull)

Lors du fix initial des 20 logos cassés (commit `c11051d`), j'ai dû
télécharger depuis Checkmate :

```
andjaro, buildrz, c2s, evermaps, greenweez, hardis-groupe,
iel-etudes-et-installations, in-store-media-france, isograd, kheoos,
kostango, mwm, mytraffic, parmentine, pricemoov, qualisocial,
sdec-france, selceon, sipearl, spark-cleantech
```

**Note Checkmate** : 5 d'entre eux ont un suffixe `_wordmark` côté
Checkmate (greenweez_wordmark, isograd_wordmark, mytraffic_wordmark,
in-store-media-france_wordmark, selceon_wordmark). Convention pas
documentée — utile de savoir.

---

## 5. PNG Checkmate avec padding transparent excessif

11 PNG mono téléchargés depuis Checkmate avaient des padding transparents
intégrés non triviaux (jusqu'à **417 px à gauche pour buildrz**, 175 px
pour pricemoov). Trim local appliqué via `Image.getbbox()` avec seuil
alpha > 100.

Liste : pricemoov (-175 L), buildrz (-417 L), hardis-groupe (-76 L),
sdec-france (-64 L), kostango (-39 L), c2s (-28 L), mwm (-20 L),
selceon_wordmark (-9 L), parmentine (-6 L), iel-etudes (-4 L),
in-store-media-france (-3 L AA résiduelle).

Plus second pass : isograd_wordmark (-43 L), in-store-media (-23 L
re-trim).

**Action Checkmate** : appliquer un `getbbox()` automatique côté pipeline
Checkmate sur les PNG/SVG avant publication. Évite d'avoir à re-trimer
chez chaque consommateur.

---

## Méthode appliquée localement (référence)

```python
from PIL import Image
import base64, io

# Pour SVG-wrapper-de-PNG cassé : extraire color, desaturate vers --ink
import re
content = open('/path/to/color-source.svg').read()
m = re.search(r'data:image/png;base64,([A-Za-z0-9+/=]+)', content)
png = base64.b64decode(m.group(1))
im = Image.open(io.BytesIO(png)).convert('RGBA')

import numpy as np
arr = np.array(im)
# Map all non-transparent pixels to --ink (#062004)
new = np.zeros_like(arr)
new[..., :3] = (6, 32, 4)
new[..., 3] = arr[..., 3]
mono = Image.fromarray(new, 'RGBA')

# Trim + resize
bbox = mono.getbbox()
if bbox: mono = mono.crop(bbox)
if mono.size[0] > 400:
    mono = mono.resize((400, round(mono.size[1]*400/mono.size[0])), Image.LANCZOS)

# Re-embed as SVG
buf = io.BytesIO()
mono.save(buf, format='PNG', optimize=True)
b64 = base64.b64encode(buf.getvalue()).decode()
W, H = mono.size
svg = f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><image xlink:href="data:image/png;base64,{b64}" width="{W}" height="{H}"/></svg>'
```
