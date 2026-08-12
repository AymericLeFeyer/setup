# Setup Config

Interface d'administration du setup. Elle édite `categoriesData` et `setupData`, puis
régénère le fichier `data.js` à la racine du projet.

Ce dossier n'est référencé nulle part depuis `index.html` : il reste invisible pour les
visiteurs du site (sauf s'ils devinent l'URL `/config/` — ce n'est pas une protection,
juste une séparation).

## Lancer l'interface

### Avec écriture directe dans data.js (recommandé)

```bash
node config/server.js
```

Puis ouvrir <http://localhost:4321/config/>.

Le bouton **Enregistrer data.js** écrit alors directement le fichier `data.js`, après
avoir copié l'ancien dans `data.js.bak`. Aucune dépendance npm, aucun build : juste Node.

Pour changer de port : `PORT=4322 node config/server.js`.

Le serveur n'écoute que sur `127.0.0.1`, rien n'est exposé sur le réseau.

### Sans serveur

Ouvrir `config/index.html` directement dans le navigateur. Tout fonctionne à
l'identique, mais **Enregistrer** déclenche un téléchargement de `data.js` : il faut
ensuite remplacer manuellement le fichier à la racine du projet.

## Ce que l'interface permet

| Zone | Actions |
|------|---------|
| Setups | Créer, renommer, réordonner, supprimer ; le sélecteur en haut à gauche choisit celui qu'on édite |
| Onglet Setup | Titre, image de fond, description, identifiant d'ancre URL |
| Image | Placer un point par clic, déplacer un marqueur par glisser-déposer, cliquer un marqueur pour sélectionner l'équipement |
| Équipements | Créer, dupliquer, supprimer, réordonner (glisser-déposer ou ↑/↓), rechercher, déplacer vers un autre setup |
| Champs | Nom, catégorie, prix, description, URL d'image (avec aperçu), lien d'achat, identifiant |
| Options | Élément principal du point (`main`), marqueur foncé (`color: 'black'`) |
| Points | Plusieurs coordonnées par équipement (ex. deux écrans identiques), édition manuelle X/Y |
| Catégories | Créer, renommer, réordonner, activer le total des prix, supprimer (si inutilisée) |

## Structure de `data.js`

```js
const categoriesData = [                       // partagées par tous les setups
  { id: 1, name: 'PC de jeux', showTotal: true }
];

const setupsData = [
  {
    id: 'principal',                           // ancre URL : index.html#principal
    title: 'Mon Setup',                        // titre affiché + libellé de l'onglet
    image: 'https://…/setup.JPG',              // photo sur laquelle les points sont posés
    description: 'Ligne 1\nLigne 2',           // texte sous l'image (\n = saut de ligne)
    items: [ /* les équipements de ce setup */ ]
  }
];
```

Le site affiche la barre de navigation dès qu'il y a **deux setups ou plus** ; avec un seul,
elle reste masquée. `app.js` accepte aussi l'ancien format plat (`setupData`) et le traite
comme un setup unique.

## Raccourcis

- `Ctrl` + `S` : enregistrer
- `Échap` : quitter le mode placement / fermer la modale

## Détails utiles

- **Bouton « Voir le code »** : affiche le `data.js` généré, avec copie presse-papier et
  téléchargement — pratique pour vérifier avant d'écrire.
- **Catégories partagées** : elles valent pour tous les setups. Le compteur « n équipements »
  additionne donc les équipements de tous les setups, et une catégorie ne peut être supprimée
  que si plus aucun d'entre eux ne l'utilise.
- **Identifiants** : normalisés automatiquement (minuscules, tirets) et rendus uniques
  au sein du setup.
  Un identifiant en double est signalé par un `!` rouge dans la liste : sur le site, il
  casse la mise en surbrillance du marqueur au survol de la fiche.
- **Format de sortie** : les propriétés sont réécrites dans un ordre canonique
  (`id, category, coordonnées, main, color, name, description, image, buyLink, price`).
- **Un seul point** → écrit en `x` / `y` ; **plusieurs points** → écrit en `coordinates: []`.
  Le format d'origine de chaque fiche est conservé.
- **Fins de ligne** : le serveur reprend celles du `data.js` existant (CRLF sous Windows).
- **Suppressions** : équipement, catégorie et setup sont supprimés sans confirmation. Rien
  n'est écrit sur disque tant que vous n'avez pas cliqué **Enregistrer** : un **Recharger**
  annule tout. Le dernier setup restant ne peut pas être supprimé.
- Avant écriture, le serveur vérifie que le contenu généré est du JavaScript valide et
  qu'il expose bien `categoriesData` et `setupsData` — un fichier cassé ne peut pas être écrit.
