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
COPY index.html app.js data.js style.css ./
COPY assets/ ./assets/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://127.0.0.1/ || exit 1
