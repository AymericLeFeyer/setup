// Aynalytics (analytics auto-hébergé) : charge le SDK et expose window.ayTrack.
//
// - Pages vues : une par setup affiché (window.ayScreen depuis app.js), y compris au
//   changement d'onglet. Les ancres #slug ne changent pas le chemin : la détection
//   automatique des routes du SDK n'en verrait qu'une, elle est donc désactivée.
// - Clics « Acheter » : attributs data-ay-event / data-ay-prop-* posés par app.js,
//   envoyés par le SDK sans code (autoClicks, clic molette compris).
// - Zoom photo : window.ayTrack(...) depuis app.js.
//
// La clé publique vient de <meta name="aynalytics-site-key">, remplie au build de
// l'image Docker (build-arg AYNALYTICS_SITE_KEY). Vide (ouverture locale du fichier) :
// tout est inactif. Le SDK passe par le proxy /_ay du nginx du site.
(function () {
    var meta = document.querySelector('meta[name="aynalytics-site-key"]');
    var siteKey = meta ? meta.getAttribute('content') : '';
    var endpoint = '/_ay';

    // Sans clé, les helpers existent quand même (app.js les appelle sans vérifier) mais ne font rien.
    if (!siteKey) {
        window.ayTrack = window.ayScreen = function () {};
        return;
    }

    // File d'attente : les appels faits avant le chargement du script sont rejoués après l'init.
    window.aynalytics = { q: [] };

    function call(method, args) {
        var api = window.aynalytics;
        if (!api) return;
        if (api.q) api.q.push([method, args]);
        else api[method].apply(null, args);
    }

    window.ayTrack = function (name, properties) {
        call('track', [name, properties]);
    };
    window.ayScreen = function (name, properties) {
        call('screen', [name, properties]);
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
            // Pages vues envoyées par app.js, une par setup (voir plus haut).
            autoScreens: false,
            // data-ay-event sur les boutons « Acheter » ; les autres liens ne sont pas suivis.
            autoClicks: true,
            outboundLinks: false,
        });
    };
    document.head.appendChild(script);
})();
