// Aynalytics (analytics auto-hébergé) : charge le SDK et expose window.ayTrack.
//
// - Pages vues, visites, visiteurs uniques : automatiques (un `screen` au chargement).
// - Clics « Acheter » : attributs data-ay-event / data-ay-prop-* posés par app.js,
//   envoyés par le SDK sans code (autoClicks).
// - Changement de setup, zoom photo : window.ayTrack(...) depuis app.js.
//
// La clé publique vient de <meta name="aynalytics-site-key">, remplie au build de
// l'image Docker (build-arg AYNALYTICS_SITE_KEY). Vide (ouverture locale du fichier) :
// tout est inactif. Le SDK passe par le proxy /_ay du nginx du site.
(function () {
    var meta = document.querySelector('meta[name="aynalytics-site-key"]');
    var siteKey = meta ? meta.getAttribute('content') : '';
    var endpoint = '/_ay';

    // Sans clé, ayTrack existe quand même (app.js l'appelle sans vérifier) mais ne fait rien.
    if (!siteKey) {
        window.ayTrack = function () {};
        return;
    }

    // File d'attente : les appels faits avant le chargement du script sont rejoués après l'init.
    window.aynalytics = { q: [] };

    window.ayTrack = function (name, properties) {
        var api = window.aynalytics;
        if (!api) return;
        if (api.q) api.q.push(['track', [name, properties]]);
        else api.track(name, properties);
    };

    var script = document.createElement('script');
    script.src = endpoint + '/sdk.js';
    script.async = true;
    script.onload = function () {
        var api = window.aynalytics;
        if (!api || typeof api.init !== 'function') return;
        api.init({
            siteKey: siteKey,
            endpoint: endpoint,
            // Identifiant anonyme persistant (13 mois max) : visiteurs uniques sur plusieurs jours.
            persistence: 'local',
            // data-ay-event sur les boutons « Acheter » ; les autres liens ne sont pas suivis.
            autoClicks: true,
            outboundLinks: false,
        });
    };
    document.head.appendChild(script);
})();
