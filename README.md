# Mon Setup Interactif

Une application web interactive et élégante permettant de présenter son espace de travail (setup) à l'aide d'une image annotée. 

Au survol des différents points lumineux sur l'image, des cartes d'informations stylisées apparaissent pour présenter l'équipement (nom, description, prix, lien d'achat). Les équipements sont ensuite récapitulés et classés par catégorie sous l'image.

## 🌟 Fonctionnalités

- **Plusieurs setups** : Chaque setup a son titre, sa photo, sa description et ses équipements. Une barre de navigation apparaît en haut du site dès qu'il y en a au moins deux, et chaque setup a sa propre ancre URL (`index.html#nomade`).
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

## 🐳 Déploiement Docker

Un push sur `main` déclenche le workflow [`.github/workflows/docker.yml`](.github/workflows/docker.yml),
qui publie l'image sur GHCR en `linux/amd64` et `linux/arm64` :

```
ghcr.io/aymericlefeyer/setup:latest
```

L'image ne contient **que le site public** (`index.html`, `app.js`, `data.js`, `style.css`, `assets/`).
L'éditeur `config/` et son serveur d'écriture n'y sont pas : le `Dockerfile` copie les fichiers un par un,
le `.dockerignore` exclut tout le reste, nginx renvoie 404 sur `/config`, et le workflow échoue si un
fichier de config se retrouvait malgré tout dans l'image.

Pour mettre à jour le contenu : éditer via `config/`, committer `data.js`, l'image se reconstruit toute seule.

Dans Portainer, créer une stack avec [`compose.yml`](compose.yml) (le site écoute sur le port 80 du conteneur) :

```yaml
services:
  setup:
    image: ghcr.io/aymericlefeyer/setup:latest
    restart: unless-stopped
    ports:
      - "8085:80"
```

Test en local :

```bash
docker build -t setup .
docker run --rm -p 8080:80 setup   # http://localhost:8080
```

## ⚙️ Personnalisation

### Interface de configuration (recommandé)

Un éditeur visuel est disponible dans le dossier `config/`. Il n'est pas relié à
`index.html` : les visiteurs du site ne le voient pas.

```bash
node config/server.js   # puis http://localhost:4321/config/
```

Il permet de gérer plusieurs setups (titre, image, description), d'ajouter/modifier/supprimer
des équipements, de placer les points par clic ou glisser-déposer sur l'image, de gérer les
catégories, puis d'écrire directement `data.js`.
Sans Node, on peut aussi ouvrir `config/index.html` dans le navigateur : l'enregistrement
se fait alors par téléchargement du fichier. Détails dans [`config/README.md`](config/README.md).

### À la main

La configuration se fait entièrement dans le fichier `data.js` :

- **`categoriesData`** : Définissez vos catégories avec un ID, un nom, et si vous souhaitez afficher le prix total (`showTotal: true`). Elles sont partagées par tous les setups.
- **`setupsData`** : La liste de vos setups. Chacun porte un `id` (ancre URL), un `title`, une `image`, une `description` (les `\n` deviennent des sauts de ligne) et son tableau `items`.
- **`items`** : Vos équipements, avec leurs coordonnées (`x` et `y` ou un tableau `coordinates`), l'ID de la catégorie, le nom, le prix, une image, etc.
