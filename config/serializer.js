/**
 * Génération du contenu de data.js à partir de l'état de l'éditeur.
 * Le format de sortie reproduit celui écrit à la main : indentation 2 espaces,
 * quotes simples, une propriété par ligne pour les équipements.
 */
(function (global) {
    'use strict';

    // Échappe une valeur pour une string JS entre quotes simples
    function esc(value) {
        return String(value)
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/\r/g, '')
            .replace(/\n/g, '\\n');
    }

    function str(value) {
        return "'" + esc(value) + "'";
    }

    // Un nombre "propre" : 46 plutôt que 46.0, 70.9 conservé
    function num(value) {
        const n = Number(value);
        if (!isFinite(n)) return '0';
        return String(parseFloat(n.toFixed(3)));
    }

    function pad(depth) {
        return '  '.repeat(depth);
    }

    function serializeCategories(categories) {
        if (!categories.length) return 'const categoriesData = [];\n';

        const lines = categories.map(cat => {
            const id = typeof cat.id === 'number' ? cat.id : str(cat.id);
            return `  { id: ${id}, name: ${str(cat.name)}, showTotal: ${cat.showTotal ? 'true' : 'false'} }`;
        });

        return 'const categoriesData = [\n' + lines.join(',\n') + '\n];\n';
    }

    function serializeItem(item, depth) {
        const p = pad(depth);
        const inner = pad(depth + 1);
        const props = [];

        props.push(`${inner}id: ${str(item.id)}`);

        if (item.category !== '' && item.category !== null && item.category !== undefined) {
            const cat = typeof item.category === 'number' ? item.category : str(item.category);
            props.push(`${inner}category: ${cat}`);
        }

        const coords = Array.isArray(item.coords) ? item.coords : [];
        if (coords.length === 1 && item.coordFormat !== 'array') {
            props.push(`${inner}x: ${num(coords[0].x)}`);
            props.push(`${inner}y: ${num(coords[0].y)}`);
        } else if (coords.length > 0) {
            const points = coords
                .map(c => `${pad(depth + 2)}{ x: ${num(c.x)}, y: ${num(c.y)} }`)
                .join(',\n');
            props.push(`${inner}coordinates: [\n${points}\n${inner}]`);
        }

        if (item.main) props.push(`${inner}main: true`);
        if (item.color) props.push(`${inner}color: ${str(item.color)}`);

        props.push(`${inner}name: ${str(item.name)}`);
        if (item.description) props.push(`${inner}description: ${str(item.description)}`);
        if (item.image) props.push(`${inner}image: ${str(item.image)}`);
        if (item.buyLink) props.push(`${inner}buyLink: ${str(item.buyLink)}`);
        if (item.price) props.push(`${inner}price: ${str(item.price)}`);

        return `${p}{\n` + props.join(',\n') + `\n${p}}`;
    }

    function serializeSetup(setup) {
        const props = [
            `    id: ${str(setup.id)}`,
            `    title: ${str(setup.title)}`
        ];

        if (setup.image) props.push(`    image: ${str(setup.image)}`);
        if (setup.description) props.push(`    description: ${str(setup.description)}`);

        const items = Array.isArray(setup.items) ? setup.items : [];
        const body = items.length
            ? '[\n' + items.map(i => serializeItem(i, 3)).join(',\n') + '\n    ]'
            : '[]';
        props.push(`    items: ${body}`);

        return '  {\n' + props.join(',\n') + '\n  }';
    }

    function serializeSetups(setups) {
        if (!setups.length) return 'const setupsData = [];\n';
        return 'const setupsData = [\n' + setups.map(serializeSetup).join(',\n') + '\n];\n';
    }

    function serialize(state) {
        return serializeCategories(state.categories) + '\n' + serializeSetups(state.setups);
    }

    global.DataSerializer = { serialize, serializeCategories, serializeSetups, serializeItem };
})(window);
