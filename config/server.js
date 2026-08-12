#!/usr/bin/env node
/**
 * Serveur local pour l'interface de configuration.
 *
 *   node config/server.js        puis ouvrir http://localhost:4321/config/
 *
 * - Sert les fichiers statiques du projet (racine du dépôt).
 * - POST /__save écrit directement data.js (avec une sauvegarde data.js.bak).
 * - N'écoute que sur 127.0.0.1 : rien n'est exposé sur le réseau.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'data.js');
const BACKUP_FILE = path.join(ROOT, 'data.js.bak');
const PORT = Number(process.env.PORT) || 4321;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon'
};

function sendJson(res, status, payload) {
    const body = JSON.stringify(payload);
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body)
    });
    res.end(body);
}

function readBody(req, limitBytes = 5 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;
        req.on('data', chunk => {
            size += chunk.length;
            if (size > limitBytes) {
                reject(new Error('Corps de requête trop volumineux'));
                req.destroy();
                return;
            }
            chunks.push(chunk);
        });
        req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        req.on('error', reject);
    });
}

// Vérifie que le contenu généré est du JS valide et expose bien les 2 tableaux
function validate(content) {
    if (typeof content !== 'string' || !content.trim()) {
        return 'Contenu vide';
    }
    try {
        const check = new Function(`${content}\nreturn { c: categoriesData, s: setupsData };`);
        const result = check();
        if (!Array.isArray(result.c) || !Array.isArray(result.s)) {
            return 'categoriesData ou setupsData n\'est pas un tableau';
        }
        if (!result.s.length) {
            return 'Aucun setup : le fichier doit contenir au moins un setup';
        }
        if (result.s.some(s => !Array.isArray(s.items))) {
            return 'Un setup n\'a pas de tableau items';
        }
    } catch (e) {
        return 'JavaScript invalide : ' + e.message;
    }
    return null;
}

// Conserve la convention de fin de ligne du fichier existant (CRLF sous Windows)
function matchLineEndings(content) {
    if (!fs.existsSync(DATA_FILE)) return content;
    const current = fs.readFileSync(DATA_FILE, 'utf8');
    const usesCrlf = /\r\n/.test(current);
    const normalized = content.replace(/\r\n/g, '\n');
    return usesCrlf ? normalized.replace(/\n/g, '\r\n') : normalized;
}

async function handleSave(req, res) {
    try {
        const raw = await readBody(req);
        const { content } = JSON.parse(raw);

        const error = validate(content);
        if (error) return sendJson(res, 400, { ok: false, error });

        if (fs.existsSync(DATA_FILE)) {
            fs.copyFileSync(DATA_FILE, BACKUP_FILE);
        }
        fs.writeFileSync(DATA_FILE, matchLineEndings(content), 'utf8');

        console.log(`[${new Date().toLocaleTimeString()}] data.js enregistré (${content.length} caractères)`);
        sendJson(res, 200, { ok: true });
    } catch (e) {
        sendJson(res, 500, { ok: false, error: e.message });
    }
}

function serveStatic(req, res) {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    let filePath = path.join(ROOT, urlPath);

    // Empêche de sortir de la racine du projet
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403).end('Forbidden');
        return;
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('404 – ' + urlPath);
        return;
    }

    const type = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
    const pathname = req.url.split('?')[0];

    if (pathname === '/__ping') return sendJson(res, 200, { ok: true });
    if (pathname === '/__save' && req.method === 'POST') return handleSave(req, res);

    serveStatic(req, res);
});

server.listen(PORT, '127.0.0.1', () => {
    console.log('');
    console.log('  Setup Config');
    console.log('  ─────────────────────────────────────────');
    console.log(`  Configuration : http://localhost:${PORT}/config/`);
    console.log(`  Site          : http://localhost:${PORT}/`);
    console.log(`  Fichier cible : ${DATA_FILE}`);
    console.log('');
    console.log('  Ctrl+C pour arrêter.');
    console.log('');
});

server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Le port ${PORT} est déjà utilisé. Essayez : PORT=4322 node config/server.js`);
    } else {
        console.error(err);
    }
    process.exit(1);
});
