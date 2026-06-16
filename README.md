# Mon Setup Interactif

Une application web interactive et élégante permettant de présenter son espace de travail (setup) à l'aide d'une image annotée. 

Au survol des différents points lumineux sur l'image, des cartes d'informations stylisées apparaissent pour présenter l'équipement (nom, description, prix, lien d'achat). Les équipements sont ensuite récapitulés et classés par catégorie sous l'image.

## 🌟 Fonctionnalités

- **Points interactifs sur l'image** : Positionnez des points (marqueurs) précis sur la photo de votre setup.
- **Cartes de détails Premium** : Design "glassmorphism" moderne avec prise en charge du mode sombre.
- **Support des multi-coordonnées** : Un même équipement (comme deux écrans identiques) peut être pointé à plusieurs endroits.
- **Catégories dynamiques** : Les équipements sont automatiquement triés par catégorie dans une liste détaillée.
- **Calcul automatique du prix** : Option pour afficher le coût total de tous les équipements d'une même catégorie.
- **Tracker de coordonnées** : Un outil intégré (activable par double-clic sur l'image) permet de récupérer facilement les coordonnées (X, Y) en pourcentages pour placer de nouveaux équipements.

## 🛠️ Technologies

- **HTML5 Sémantique**
- **CSS3** (Variables, Grid, Flexbox, Animations, Backdrop-filter)
- **Vanilla JavaScript** (Aucun framework, ultra-léger et rapide)

## 🚀 Comment l'utiliser ?

1. Clonez ce dépôt sur votre machine.
2. Ouvrez simplement le fichier `index.html` dans votre navigateur web préféré. Aucune installation ni serveur n'est requis !

## ⚙️ Personnalisation

La configuration se fait entièrement dans le fichier `data.js` :

- **`categoriesData`** : Définissez vos catégories avec un ID, un nom, et si vous souhaitez afficher le prix total (`showTotal: true`).
- **`setupData`** : Ajoutez vos équipements avec leurs coordonnées (`x` et `y` ou un tableau `coordinates`), l'ID de la catégorie, le nom, le prix, une image, etc.
- **Image du setup** : Remplacez l'image `assets/setup.jpg` par la photo de votre propre espace de travail.
