# Site statique servi par nginx.
#
# Seuls les fichiers du site public sont copiés : l'éditeur (config/) et le
# serveur d'écriture de data.js ne font volontairement pas partie de l'image.
FROM nginx:1.27-alpine

LABEL org.opencontainers.image.title="Setup interactif" \
      org.opencontainers.image.description="Présentation interactive de mon setup (site statique)" \
      org.opencontainers.image.source="https://github.com/AymericLeFeyer/setup" \
      org.opencontainers.image.licenses="MIT"

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# Copie explicite : rien d'autre que ces fichiers n'entre dans l'image.
COPY index.html app.js analytics.js data.js style.css ./
COPY assets/ ./assets/

# Aynalytics : clé PUBLIQUE du site (jamais la clé secrète), injectée dans la balise
# <meta name="aynalytics-site-key"> d'index.html. Vide = analytics désactivé.
ARG AYNALYTICS_SITE_KEY=""
RUN case "$AYNALYTICS_SITE_KEY" in \
      ""|ay_pk_*) ;; \
      *) echo "AYNALYTICS_SITE_KEY doit commencer par ay_pk_" >&2; exit 1 ;; \
    esac \
 && sed -i "s|name=\"aynalytics-site-key\" content=\"\"|name=\"aynalytics-site-key\" content=\"$AYNALYTICS_SITE_KEY\"|" index.html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://127.0.0.1/ || exit 1
