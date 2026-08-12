/**
 * Interface de configuration des setups.
 * Lit les données globales exposées par ../data.js, les édite en mémoire,
 * puis régénère le fichier data.js (écriture directe si le serveur local
 * est lancé, téléchargement sinon).
 */
(function () {
    'use strict';

    const state = {
        categories: [],
        setups: [],
        currentSetupUid: null,
        selectedUid: null,
        placing: false,
        search: '',
        dirty: false,
        canWrite: false
    };

    let uidSeq = 0;

    // ---------------------------------------------------------------- DOM refs

    const el = {
        stage: document.getElementById('image-stage'),
        stageImage: document.getElementById('stage-image'),
        stageCoords: document.getElementById('stage-coords'),
        stageHint: document.getElementById('stage-hint'),
        itemList: document.getElementById('item-list'),
        editor: document.getElementById('editor'),
        setupEditor: document.getElementById('setup-editor'),
        setupSelect: document.getElementById('setup-select'),
        catList: document.getElementById('cat-list'),
        search: document.getElementById('search'),
        dirtyBadge: document.getElementById('dirty-badge'),
        modePill: document.getElementById('mode-pill'),
        toast: document.getElementById('toast'),
        modalExport: document.getElementById('modal-export'),
        exportCode: document.getElementById('export-code'),
        btnPlace: document.getElementById('btn-place')
    };

    // ------------------------------------------------------------------ Utils

    function toast(message, type) {
        el.toast.textContent = message;
        el.toast.className = 'toast' + (type ? ' toast-' + type : '');
        el.toast.hidden = false;
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => { el.toast.hidden = true; }, 3200);
    }

    function markDirty() {
        state.dirty = true;
        el.dirtyBadge.hidden = false;
    }

    function clearDirty() {
        state.dirty = false;
        el.dirtyBadge.hidden = true;
    }

    function slugify(text) {
        return String(text)
            .toLowerCase()
            .normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 40) || 'item';
    }

    // Les chemins des images sont relatifs à la racine du projet, mais cette page
    // est servie depuis /config/ : on remonte d'un cran pour l'affichage seulement.
    function assetUrl(url) {
        const value = String(url || '').trim();
        if (!value) return '';
        if (/^(https?:)?\/\//i.test(value) || /^(data|blob):/i.test(value)) return value;
        if (value.startsWith('/') || value.startsWith('../')) return value;
        return '../' + value.replace(/^\.\//, '');
    }

    function currentSetup() {
        return state.setups.find(s => s._uid === state.currentSetupUid) || state.setups[0] || null;
    }

    function currentItems() {
        const setup = currentSetup();
        return setup ? setup.items : [];
    }

    function uniqueId(base, ignoreUid) {
        let candidate = base;
        let n = 2;
        const taken = new Set(currentItems().filter(i => i._uid !== ignoreUid).map(i => i.id));
        while (taken.has(candidate)) {
            candidate = base + '-' + n;
            n++;
        }
        return candidate;
    }

    function uniqueSetupId(base, ignoreUid) {
        let candidate = base;
        let n = 2;
        const taken = new Set(state.setups.filter(s => s._uid !== ignoreUid).map(s => s.id));
        while (taken.has(candidate)) {
            candidate = base + '-' + n;
            n++;
        }
        return candidate;
    }

    function findItem(uid) {
        return currentItems().find(i => i._uid === uid) || null;
    }

    function categoryName(id) {
        const cat = state.categories.find(c => String(c.id) === String(id));
        return cat ? cat.name : 'Sans catégorie';
    }

    function duplicatedIds() {
        const seen = new Set();
        const dupes = new Set();
        currentItems().forEach(i => {
            if (seen.has(i.id)) dupes.add(i.id);
            seen.add(i.id);
        });
        return dupes;
    }

    // ------------------------------------------------------------ Chargement

    function toEditorItem(raw) {
        let coords = [];
        let coordFormat = 'xy';

        if (Array.isArray(raw.coordinates)) {
            coords = raw.coordinates.map(c => ({ x: Number(c.x), y: Number(c.y) }));
            coordFormat = 'array';
        } else if (raw.x !== undefined && raw.y !== undefined) {
            coords = [{ x: Number(raw.x), y: Number(raw.y) }];
        }

        return {
            _uid: ++uidSeq,
            id: raw.id || '',
            category: raw.category !== undefined ? raw.category : '',
            coords,
            coordFormat,
            main: !!raw.main,
            color: raw.color || '',
            name: raw.name || '',
            description: raw.description || '',
            image: raw.image || '',
            buyLink: raw.buyLink || '',
            price: raw.price || ''
        };
    }

    function loadFromGlobals() {
        const rawCats = typeof categoriesData !== 'undefined' && Array.isArray(categoriesData) ? categoriesData : [];

        state.categories = rawCats.map(c => ({
            id: c.id,
            name: c.name || '',
            showTotal: !!c.showTotal
        }));

        // Format multi-setups, avec repli sur l'ancien format plat (setupData)
        let rawSetups = [];
        if (typeof setupsData !== 'undefined' && Array.isArray(setupsData) && setupsData.length) {
            rawSetups = setupsData;
        } else if (typeof setupData !== 'undefined' && Array.isArray(setupData)) {
            rawSetups = [{ id: 'principal', title: 'Mon Setup', image: '', description: '', items: setupData }];
        }

        state.setups = rawSetups.map(raw => ({
            _uid: ++uidSeq,
            id: raw.id || 'setup',
            title: raw.title || 'Setup',
            image: raw.image || '',
            description: raw.description || '',
            items: (Array.isArray(raw.items) ? raw.items : []).map(toEditorItem)
        }));

        if (!state.setups.length) {
            state.setups.push(newSetup('Mon Setup'));
        }

        state.currentSetupUid = state.setups[0]._uid;
    }

    function newSetup(title) {
        return {
            _uid: ++uidSeq,
            id: uniqueSetupId(slugify(title)),
            title,
            image: '',
            description: '',
            items: []
        };
    }

    // ----------------------------------------------------------- Setups (nav)

    function renderSetupSelect() {
        el.setupSelect.innerHTML = state.setups
            .map(s => `<option value="${s._uid}" ${s._uid === state.currentSetupUid ? 'selected' : ''}>${escapeHtml(s.title || '(sans titre)')} — ${s.items.length} éq.</option>`)
            .join('');
    }

    function switchSetup(uid) {
        state.currentSetupUid = uid;
        state.selectedUid = null;
        state.search = '';
        el.search.value = '';
        togglePlacing(false);
        renderSetupSelect();
        renderStageImage();
        renderItemList();
        renderEditor();
        renderSetupEditor();
        renderMarkers();
    }

    function createSetup() {
        const setup = newSetup('Nouveau setup');
        state.setups.push(setup);
        markDirty();
        switchSetup(setup._uid);
        activateTab('setup');
        const input = document.getElementById('s-title');
        if (input) { input.focus(); input.select(); }
    }

    function deleteSetup(setup) {
        if (state.setups.length < 2) {
            toast('Impossible de supprimer le dernier setup.', 'error');
            return;
        }
        state.setups.splice(state.setups.indexOf(setup), 1);
        markDirty();
        switchSetup(state.setups[0]._uid);
    }

    function shiftSetup(setup, delta) {
        const idx = state.setups.indexOf(setup);
        const target = idx + delta;
        if (target < 0 || target >= state.setups.length) return;
        state.setups.splice(idx, 1);
        state.setups.splice(target, 0, setup);
        markDirty();
        renderSetupSelect();
        renderSetupEditor();
    }

    function renderStageImage() {
        const setup = currentSetup();
        const url = setup ? setup.image : '';
        el.stageImage.src = assetUrl(url);
        el.stage.classList.toggle('no-image', !url);
    }

    function renderSetupEditor() {
        const setup = currentSetup();
        if (!setup) return;

        const index = state.setups.indexOf(setup);

        el.setupEditor.innerHTML = `
            <div class="editor-head">
                <h3>${escapeHtml(setup.title || '(sans titre)')}</h3>
                <div class="editor-head-actions">
                    <button class="btn btn-icon" data-action="setup-up" title="Déplacer vers la gauche dans la navigation">↑</button>
                    <button class="btn btn-icon" data-action="setup-down" title="Déplacer vers la droite dans la navigation">↓</button>
                    <button class="btn btn-icon btn-danger" data-action="setup-delete" title="Supprimer ce setup">✕</button>
                </div>
            </div>

            <div class="field">
                <label for="s-title">Titre du setup</label>
                <input id="s-title" type="text" value="${escapeAttr(setup.title)}">
                <span class="hint">Affiché en grand sur le site, et dans l'onglet de navigation${state.setups.length > 1 ? '' : ' dès qu\'il y a au moins deux setups'}.</span>
            </div>

            <div class="field">
                <label for="s-image">Image du setup (URL)</label>
                <div class="field-with-preview">
                    <input id="s-image" type="url" value="${escapeAttr(setup.image)}" placeholder="https://… ou assets/setup.jpeg">
                    <div class="image-preview" id="setup-image-preview">
                        ${setup.image ? `<img src="${escapeAttr(assetUrl(setup.image))}" alt="">` : '<span>—</span>'}
                    </div>
                </div>
                <span class="hint">C'est la photo sur laquelle les points sont placés.</span>
            </div>

            <div class="field">
                <label for="s-description">Description</label>
                <textarea id="s-description" rows="10" placeholder="Texte affiché sous l'image…">${escapeHtml(setup.description)}</textarea>
                <span class="hint">Les sauts de ligne sont conservés sur le site. Laisser vide masque la section.</span>
            </div>

            <div class="field">
                <label for="s-id">Identifiant technique</label>
                <input id="s-id" type="text" value="${escapeAttr(setup.id)}">
                <span class="hint">Sert d'ancre dans l'URL du site : <code>index.html#${escapeHtml(setup.id)}</code></span>
            </div>

            <p class="hint">Setup ${index + 1} sur ${state.setups.length} · ${setup.items.length} équipement(s).</p>
        `;

        const bind = (id, key, after) => {
            const input = document.getElementById(id);
            input.addEventListener('input', () => {
                setup[key] = input.value;
                markDirty();
                if (after) after(setup);
            });
            return input;
        };

        bind('s-title', 'title', () => {
            renderSetupSelect();
            const h3 = el.setupEditor.querySelector('.editor-head h3');
            if (h3) h3.textContent = setup.title || '(sans titre)';
        });

        bind('s-image', 'image', () => {
            renderStageImage();
            const preview = document.getElementById('setup-image-preview');
            preview.innerHTML = setup.image ? `<img src="${escapeAttr(assetUrl(setup.image))}" alt="">` : '<span>—</span>';
        });

        bind('s-description', 'description');

        const idInput = document.getElementById('s-id');
        idInput.addEventListener('input', () => {
            setup.id = slugify(idInput.value);
            markDirty();
        });
        idInput.addEventListener('blur', () => {
            setup.id = uniqueSetupId(slugify(idInput.value || setup.title), setup._uid);
            idInput.value = setup.id;
        });

        el.setupEditor.querySelector('[data-action="setup-up"]').addEventListener('click', () => shiftSetup(setup, -1));
        el.setupEditor.querySelector('[data-action="setup-down"]').addEventListener('click', () => shiftSetup(setup, 1));
        el.setupEditor.querySelector('[data-action="setup-delete"]').addEventListener('click', () => deleteSetup(setup));
    }

    // ---------------------------------------------------------- Rendu : liste

    function visibleItems() {
        const q = state.search.trim().toLowerCase();
        if (!q) return currentItems();
        return currentItems().filter(i =>
            (i.name + ' ' + i.id + ' ' + categoryName(i.category)).toLowerCase().includes(q)
        );
    }

    function renderItemList() {
        const dupes = duplicatedIds();
        el.itemList.innerHTML = '';

        const items = visibleItems();
        if (!items.length) {
            const li = document.createElement('li');
            li.className = 'list-empty';
            li.textContent = state.search ? 'Aucun résultat.' : 'Aucun équipement dans ce setup.';
            el.itemList.appendChild(li);
            return;
        }

        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'item-row' + (item._uid === state.selectedUid ? ' selected' : '');
            li.dataset.uid = item._uid;
            li.draggable = true;

            const thumb = item.image
                ? `<img class="row-thumb" src="${escapeAttr(assetUrl(item.image))}" alt="" loading="lazy">`
                : '<span class="row-thumb row-thumb-empty"></span>';

            const dupWarn = dupes.has(item.id) ? '<span class="row-warn" title="Identifiant en double">!</span>' : '';
            const pin = item.coords.length
                ? `<span class="row-pin" title="${item.coords.length} point(s) sur l'image">${item.coords.length > 1 ? item.coords.length + ' pts' : 'placé'}</span>`
                : '<span class="row-pin row-pin-off" title="Pas de point sur l\'image">hors image</span>';

            li.innerHTML = `
                ${thumb}
                <span class="row-main">
                    <span class="row-name">${escapeHtml(item.name || '(sans nom)')}${dupWarn}</span>
                    <span class="row-meta">${escapeHtml(categoryName(item.category))} · ${escapeHtml(item.price || '—')}</span>
                </span>
                ${pin}
            `;

            li.addEventListener('click', () => selectItem(item._uid));
            el.itemList.appendChild(li);
        });

        enableListDrag();
    }

    function enableListDrag() {
        let dragUid = null;

        el.itemList.querySelectorAll('.item-row').forEach(row => {
            row.addEventListener('dragstart', e => {
                dragUid = Number(row.dataset.uid);
                row.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', String(dragUid));
            });

            row.addEventListener('dragend', () => {
                row.classList.remove('dragging');
                el.itemList.querySelectorAll('.drop-target').forEach(r => r.classList.remove('drop-target'));
            });

            row.addEventListener('dragover', e => {
                e.preventDefault();
                if (Number(row.dataset.uid) !== dragUid) row.classList.add('drop-target');
            });

            row.addEventListener('dragleave', () => row.classList.remove('drop-target'));

            row.addEventListener('drop', e => {
                e.preventDefault();
                row.classList.remove('drop-target');
                const targetUid = Number(row.dataset.uid);
                if (!dragUid || dragUid === targetUid) return;
                moveItem(dragUid, targetUid);
            });
        });
    }

    function moveItem(fromUid, toUid) {
        const items = currentItems();
        const fromIdx = items.findIndex(i => i._uid === fromUid);
        const toIdx = items.findIndex(i => i._uid === toUid);
        if (fromIdx < 0 || toIdx < 0) return;

        const [moved] = items.splice(fromIdx, 1);
        items.splice(toIdx, 0, moved);
        markDirty();
        renderItemList();
    }

    // ------------------------------------------------------- Rendu : éditeur

    function selectItem(uid) {
        state.selectedUid = uid;
        renderItemList();
        renderEditor();
        renderMarkers();
    }

    function renderEditor() {
        const item = findItem(state.selectedUid);
        if (!item) {
            el.editor.innerHTML = '<p class="empty-state">Sélectionnez un équipement dans la liste, ou créez-en un nouveau.</p>';
            return;
        }

        const catOptions = state.categories
            .map(c => `<option value="${escapeAttr(c.id)}" ${String(c.id) === String(item.category) ? 'selected' : ''}>${escapeHtml(c.name)}</option>`)
            .join('');

        const setupOptions = state.setups
            .map(s => `<option value="${s._uid}" ${s._uid === state.currentSetupUid ? 'selected' : ''}>${escapeHtml(s.title || '(sans titre)')}</option>`)
            .join('');

        el.editor.innerHTML = `
            <div class="editor-head">
                <h3>${escapeHtml(item.name || '(sans nom)')}</h3>
                <div class="editor-head-actions">
                    <button class="btn btn-icon" data-action="up" title="Monter dans la liste">↑</button>
                    <button class="btn btn-icon" data-action="down" title="Descendre dans la liste">↓</button>
                    <button class="btn btn-icon" data-action="duplicate" title="Dupliquer">⧉</button>
                    <button class="btn btn-icon btn-danger" data-action="delete" title="Supprimer">✕</button>
                </div>
            </div>

            <div class="field">
                <label for="f-name">Nom</label>
                <input id="f-name" data-field="name" type="text" value="${escapeAttr(item.name)}">
            </div>

            <div class="field-row">
                <div class="field">
                    <label for="f-category">Catégorie</label>
                    <select id="f-category" data-field="category">
                        <option value="">— Sans catégorie —</option>
                        ${catOptions}
                    </select>
                </div>
                <div class="field field-narrow">
                    <label for="f-price">Prix</label>
                    <input id="f-price" data-field="price" type="text" value="${escapeAttr(item.price)}" placeholder="120€">
                </div>
            </div>

            <div class="field">
                <label for="f-description">Description <span class="optional">(optionnel)</span></label>
                <textarea id="f-description" data-field="description" rows="2">${escapeHtml(item.description)}</textarea>
            </div>

            <div class="field">
                <label for="f-image">Image (URL)</label>
                <div class="field-with-preview">
                    <input id="f-image" data-field="image" type="url" value="${escapeAttr(item.image)}" placeholder="https://…">
                    <div class="image-preview" id="image-preview">
                        ${item.image ? `<img src="${escapeAttr(assetUrl(item.image))}" alt="">` : '<span>—</span>'}
                    </div>
                </div>
            </div>

            <div class="field">
                <label for="f-buyLink">Lien d'achat</label>
                <input id="f-buyLink" data-field="buyLink" type="url" value="${escapeAttr(item.buyLink)}" placeholder="https://…">
            </div>

            <div class="field-row">
                <div class="field">
                    <label for="f-setup">Setup</label>
                    <select id="f-setup">${setupOptions}</select>
                </div>
                <div class="field">
                    <label for="f-id">Identifiant technique</label>
                    <input id="f-id" data-field="id" type="text" value="${escapeAttr(item.id)}">
                </div>
            </div>

            <div class="field-row">
                <label class="checkbox">
                    <input type="checkbox" data-field="main" ${item.main ? 'checked' : ''}>
                    <span>Élément principal du point (affiché en premier)</span>
                </label>
                <label class="checkbox">
                    <input type="checkbox" data-field="color" ${item.color === 'black' ? 'checked' : ''}>
                    <span>Marqueur foncé (sur fond clair)</span>
                </label>
            </div>

            <div class="field">
                <div class="coords-head">
                    <label>Points sur l'image</label>
                    <button class="btn btn-small" data-action="add-coord">+ Point</button>
                </div>
                <div class="coords" id="coords-rows"></div>
            </div>
        `;

        renderCoordRows();
        bindEditorEvents(item);
    }

    function renderCoordRows() {
        const item = findItem(state.selectedUid);
        const container = document.getElementById('coords-rows');
        if (!item || !container) return;

        if (!item.coords.length) {
            container.innerHTML = '<p class="hint">Aucun point : l\'équipement apparaît seulement dans la liste sous l\'image.</p>';
            return;
        }

        container.innerHTML = item.coords.map((c, i) => `
            <div class="coord-row" data-index="${i}">
                <span class="coord-index">${i + 1}</span>
                <label>X<input type="number" step="0.1" min="0" max="100" data-coord="x" value="${c.x}"></label>
                <label>Y<input type="number" step="0.1" min="0" max="100" data-coord="y" value="${c.y}"></label>
                <button class="btn btn-icon btn-danger" data-action="remove-coord" title="Supprimer ce point">✕</button>
            </div>
        `).join('');

        container.querySelectorAll('.coord-row').forEach(row => {
            const index = Number(row.dataset.index);

            row.querySelectorAll('input[data-coord]').forEach(input => {
                input.addEventListener('input', () => {
                    const axis = input.dataset.coord;
                    const value = clamp(parseFloat(input.value), 0, 100);
                    if (isNaN(value)) return;
                    item.coords[index][axis] = value;
                    markDirty();
                    renderMarkers();
                });
            });

            row.querySelector('[data-action="remove-coord"]').addEventListener('click', () => {
                item.coords.splice(index, 1);
                if (item.coords.length <= 1) item.coordFormat = 'xy';
                markDirty();
                renderCoordRows();
                renderMarkers();
                renderItemList();
            });
        });
    }

    function bindEditorEvents(item) {
        el.editor.querySelectorAll('[data-field]').forEach(input => {
            const field = input.dataset.field;

            const handler = () => {
                if (field === 'main') {
                    item.main = input.checked;
                } else if (field === 'color') {
                    item.color = input.checked ? 'black' : '';
                } else if (field === 'category') {
                    const raw = input.value;
                    const cat = state.categories.find(c => String(c.id) === raw);
                    item.category = cat ? cat.id : '';
                } else if (field === 'id') {
                    item.id = slugify(input.value);
                } else {
                    item[field] = input.value;
                }

                markDirty();

                if (field === 'image') updateImagePreview(item.image);
                if (field === 'name' || field === 'price' || field === 'category' || field === 'id' || field === 'image') {
                    renderItemList();
                    const title = el.editor.querySelector('.editor-head h3');
                    if (title && field === 'name') title.textContent = item.name || '(sans nom)';
                }
                if (field === 'color' || field === 'main') renderMarkers();
            };

            input.addEventListener(input.type === 'checkbox' ? 'change' : 'input', handler);

            if (field === 'id') {
                input.addEventListener('blur', () => {
                    const clean = uniqueId(slugify(input.value || item.name || 'item'), item._uid);
                    if (clean !== item.id) {
                        item.id = clean;
                        input.value = clean;
                        renderItemList();
                    }
                });
            }
        });

        // Déplacement de l'équipement vers un autre setup
        const setupSelect = document.getElementById('f-setup');
        setupSelect.addEventListener('change', () => {
            const targetUid = Number(setupSelect.value);
            if (targetUid === state.currentSetupUid) return;
            moveItemToSetup(item, targetUid);
        });

        el.editor.querySelector('[data-action="up"]').addEventListener('click', () => shiftItem(item, -1));
        el.editor.querySelector('[data-action="down"]').addEventListener('click', () => shiftItem(item, 1));
        el.editor.querySelector('[data-action="duplicate"]').addEventListener('click', () => duplicateItem(item));
        el.editor.querySelector('[data-action="delete"]').addEventListener('click', () => deleteItem(item));
        el.editor.querySelector('[data-action="add-coord"]').addEventListener('click', () => addCoord(item, 50, 50));
    }

    function moveItemToSetup(item, targetUid) {
        const target = state.setups.find(s => s._uid === targetUid);
        if (!target) return;

        const items = currentItems();
        items.splice(items.indexOf(item), 1);
        target.items.push(item);
        markDirty();

        const name = item.name;
        switchSetup(targetUid);
        selectItem(item._uid);
        toast(`« ${name} » déplacé vers « ${target.title} ».`, 'ok');
    }

    function updateImagePreview(url) {
        const preview = document.getElementById('image-preview');
        if (!preview) return;
        preview.innerHTML = url ? `<img src="${escapeAttr(assetUrl(url))}" alt="">` : '<span>—</span>';
    }

    function addCoord(item, x, y) {
        item.coords.push({ x, y });
        if (item.coords.length > 1) item.coordFormat = 'array';
        markDirty();
        renderCoordRows();
        renderMarkers();
        renderItemList();
    }

    function shiftItem(item, delta) {
        const items = currentItems();
        const idx = items.indexOf(item);
        const target = idx + delta;
        if (target < 0 || target >= items.length) return;
        items.splice(idx, 1);
        items.splice(target, 0, item);
        markDirty();
        renderItemList();
    }

    function duplicateItem(item) {
        const copy = JSON.parse(JSON.stringify(item));
        copy._uid = ++uidSeq;
        copy.id = uniqueId(item.id || slugify(item.name), copy._uid);
        copy.name = item.name + ' (copie)';
        const items = currentItems();
        items.splice(items.indexOf(item) + 1, 0, copy);
        markDirty();
        selectItem(copy._uid);
    }

    function deleteItem(item) {
        const items = currentItems();
        items.splice(items.indexOf(item), 1);
        state.selectedUid = null;
        markDirty();
        renderItemList();
        renderEditor();
        renderMarkers();
        renderSetupSelect();
    }

    function createItem() {
        const item = {
            _uid: ++uidSeq,
            id: uniqueId('nouvel-equipement'),
            category: state.categories.length ? state.categories[0].id : '',
            coords: [],
            coordFormat: 'xy',
            main: false,
            color: '',
            name: 'Nouvel équipement',
            description: '',
            image: '',
            buyLink: '',
            price: ''
        };
        currentItems().push(item);
        state.search = '';
        el.search.value = '';
        markDirty();
        renderSetupSelect();
        selectItem(item._uid);
        const nameInput = document.getElementById('f-name');
        if (nameInput) { nameInput.focus(); nameInput.select(); }
    }

    // ------------------------------------------------------- Rendu : marqueurs

    function renderMarkers() {
        el.stage.querySelectorAll('.cfg-marker').forEach(m => m.remove());

        currentItems().forEach(item => {
            item.coords.forEach((coord, index) => {
                const marker = document.createElement('div');
                marker.className = 'cfg-marker'
                    + (item._uid === state.selectedUid ? ' selected' : '')
                    + (item.color === 'black' ? ' dark' : '');
                marker.style.left = coord.x + '%';
                marker.style.top = coord.y + '%';
                marker.title = `${item.name} (point ${index + 1})`;
                marker.innerHTML = `<span class="cfg-marker-label">${escapeHtml(item.name)}</span>`;

                attachMarkerDrag(marker, item, index);
                el.stage.appendChild(marker);
            });
        });
    }

    function attachMarkerDrag(marker, item, index) {
        marker.addEventListener('pointerdown', e => {
            e.preventDefault();
            e.stopPropagation();
            marker.setPointerCapture(e.pointerId);

            const startX = e.clientX;
            const startY = e.clientY;
            let moved = false;

            const onMove = ev => {
                if (Math.abs(ev.clientX - startX) > 3 || Math.abs(ev.clientY - startY) > 3) moved = true;
                if (!moved) return;

                const pos = pointerToPercent(ev);
                item.coords[index] = pos;
                marker.style.left = pos.x + '%';
                marker.style.top = pos.y + '%';
                el.stageCoords.textContent = `X: ${pos.x}%, Y: ${pos.y}%`;
                el.stageCoords.classList.add('visible');
                syncCoordInputs(item, index);
            };

            const onUp = () => {
                marker.releasePointerCapture(e.pointerId);
                marker.removeEventListener('pointermove', onMove);
                marker.removeEventListener('pointerup', onUp);
                el.stageCoords.classList.remove('visible');

                if (moved) {
                    markDirty();
                } else if (item._uid !== state.selectedUid) {
                    selectItem(item._uid);
                }
            };

            marker.addEventListener('pointermove', onMove);
            marker.addEventListener('pointerup', onUp);
        });
    }

    function syncCoordInputs(item, index) {
        if (item._uid !== state.selectedUid) return;
        const row = el.editor.querySelector(`.coord-row[data-index="${index}"]`);
        if (!row) return;
        row.querySelector('[data-coord="x"]').value = item.coords[index].x;
        row.querySelector('[data-coord="y"]').value = item.coords[index].y;
    }

    function pointerToPercent(event) {
        const rect = el.stageImage.getBoundingClientRect();
        return {
            x: round1(clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100)),
            y: round1(clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100))
        };
    }

    function round1(n) { return Math.round(n * 10) / 10; }
    function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }

    // ------------------------------------------------------ Rendu : catégories

    function renderCategories() {
        el.catList.innerHTML = '';

        state.categories.forEach((cat, index) => {
            const usage = state.setups.reduce(
                (total, s) => total + s.items.filter(i => String(i.category) === String(cat.id)).length,
                0
            );

            const row = document.createElement('div');
            row.className = 'cat-row';
            row.innerHTML = `
                <span class="cat-id">#${escapeHtml(cat.id)}</span>
                <input type="text" class="cat-name" value="${escapeAttr(cat.name)}">
                <label class="checkbox">
                    <input type="checkbox" class="cat-total" ${cat.showTotal ? 'checked' : ''}>
                    <span>Afficher le total</span>
                </label>
                <span class="cat-usage">${usage} équipement${usage > 1 ? 's' : ''}</span>
                <button class="btn btn-icon" data-action="cat-up" title="Monter">↑</button>
                <button class="btn btn-icon" data-action="cat-down" title="Descendre">↓</button>
                <button class="btn btn-icon btn-danger" data-action="cat-delete" title="Supprimer">✕</button>
            `;

            row.querySelector('.cat-name').addEventListener('input', e => {
                cat.name = e.target.value;
                markDirty();
                renderItemList();
            });

            row.querySelector('.cat-total').addEventListener('change', e => {
                cat.showTotal = e.target.checked;
                markDirty();
            });

            row.querySelector('[data-action="cat-up"]').addEventListener('click', () => shiftCategory(index, -1));
            row.querySelector('[data-action="cat-down"]').addEventListener('click', () => shiftCategory(index, 1));
            row.querySelector('[data-action="cat-delete"]').addEventListener('click', () => deleteCategory(cat, usage));

            el.catList.appendChild(row);
        });
    }

    function shiftCategory(index, delta) {
        const target = index + delta;
        if (target < 0 || target >= state.categories.length) return;
        const [cat] = state.categories.splice(index, 1);
        state.categories.splice(target, 0, cat);
        markDirty();
        renderCategories();
    }

    function deleteCategory(cat, usage) {
        if (usage > 0) {
            toast(`Impossible : ${usage} équipement(s) utilisent encore cette catégorie.`, 'error');
            return;
        }
        state.categories.splice(state.categories.indexOf(cat), 1);
        markDirty();
        renderCategories();
        renderEditor();
    }

    function createCategory() {
        const numericIds = state.categories.map(c => Number(c.id)).filter(n => !isNaN(n));
        const nextId = numericIds.length ? Math.max(...numericIds) + 1 : 1;
        state.categories.push({ id: nextId, name: 'Nouvelle catégorie', showTotal: false });
        markDirty();
        renderCategories();
        renderEditor();
    }

    // ------------------------------------------------------------ Sauvegarde

    function buildOutput() {
        return window.DataSerializer.serialize(state);
    }

    async function detectServer() {
        if (location.protocol === 'file:') {
            setMode(false, 'Mode fichier — téléchargement');
            return;
        }
        try {
            const res = await fetch('/__ping', { cache: 'no-store' });
            const json = await res.json();
            setMode(!!json.ok, json.ok ? 'Serveur local — écriture directe' : 'Serveur inconnu — téléchargement');
        } catch (e) {
            setMode(false, 'Sans serveur — téléchargement');
        }
    }

    function setMode(canWrite, label) {
        state.canWrite = canWrite;
        el.modePill.textContent = label;
        el.modePill.classList.toggle('mode-ok', canWrite);
    }

    async function save() {
        const dupes = duplicatedIds();
        if (dupes.size) {
            const list = Array.from(dupes).join(', ');
            if (!confirm(`Attention : identifiants en double dans ce setup (${list}).\nLe survol depuis la liste sera partiellement cassé. Enregistrer quand même ?`)) {
                return;
            }
        }

        const content = buildOutput();

        if (!state.canWrite) {
            download(content);
            toast('data.js téléchargé — remplacez le fichier à la racine du projet.', 'ok');
            clearDirty();
            return;
        }

        try {
            const res = await fetch('/__save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            const json = await res.json();
            if (!res.ok || !json.ok) throw new Error(json.error || 'Échec de l\'écriture');
            clearDirty();
            toast('data.js enregistré ✓', 'ok');
        } catch (e) {
            toast('Erreur : ' + e.message + ' — bascule sur le téléchargement.', 'error');
            download(content);
        }
    }

    function download(content) {
        const blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.js';
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    // ----------------------------------------------------------------- Escape

    function escapeHtml(text) {
        return String(text == null ? '' : text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function escapeAttr(text) {
        return escapeHtml(text).replace(/"/g, '&quot;');
    }

    // ------------------------------------------------------------- Évènements

    function activateTab(name) {
        document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + name));
    }

    function bindGlobalEvents() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => activateTab(tab.dataset.tab));
        });

        el.setupSelect.addEventListener('change', () => switchSetup(Number(el.setupSelect.value)));
        document.getElementById('btn-add-setup').addEventListener('click', createSetup);

        el.search.addEventListener('input', e => {
            state.search = e.target.value;
            renderItemList();
        });

        document.getElementById('btn-add-item').addEventListener('click', createItem);
        document.getElementById('btn-add-cat').addEventListener('click', createCategory);
        document.getElementById('btn-save').addEventListener('click', save);
        document.getElementById('btn-save-modal').addEventListener('click', () => {
            closeExport();
            save();
        });

        document.getElementById('btn-preview').addEventListener('click', () => {
            const setup = currentSetup();
            window.open('../index.html' + (setup ? '#' + setup.id : ''), '_blank');
        });

        document.getElementById('btn-reload').addEventListener('click', () => {
            if (state.dirty && !confirm('Les modifications non enregistrées seront perdues. Continuer ?')) return;
            location.reload();
        });

        document.getElementById('btn-export').addEventListener('click', () => {
            el.exportCode.value = buildOutput();
            el.modalExport.hidden = false;
        });

        document.getElementById('btn-close-export').addEventListener('click', closeExport);
        el.modalExport.addEventListener('click', e => {
            if (e.target === el.modalExport) closeExport();
        });

        document.getElementById('btn-copy').addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(el.exportCode.value);
                toast('Copié dans le presse-papier ✓', 'ok');
            } catch (e) {
                el.exportCode.select();
                document.execCommand('copy');
                toast('Copié ✓', 'ok');
            }
        });

        document.getElementById('btn-download').addEventListener('click', () => download(buildOutput()));

        el.btnPlace.addEventListener('click', () => togglePlacing(!state.placing));

        // Suivi des coordonnées + placement au clic
        el.stageImage.addEventListener('mousemove', e => {
            const pos = pointerToPercent(e);
            el.stageCoords.textContent = `X: ${pos.x}%, Y: ${pos.y}%`;
            el.stageCoords.classList.add('visible');
        });

        el.stageImage.addEventListener('mouseleave', () => el.stageCoords.classList.remove('visible'));

        el.stageImage.addEventListener('click', e => {
            if (!state.placing) return;
            const item = findItem(state.selectedUid);
            if (!item) {
                toast('Sélectionnez d\'abord un équipement.', 'error');
                return;
            }
            const pos = pointerToPercent(e);
            addCoord(item, pos.x, pos.y);
            togglePlacing(false);
        });

        // Raccourcis
        document.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                save();
            }
            if (e.key === 'Escape') {
                if (!el.modalExport.hidden) closeExport();
                else if (state.placing) togglePlacing(false);
            }
        });

        window.addEventListener('beforeunload', e => {
            if (!state.dirty) return;
            e.preventDefault();
            e.returnValue = '';
        });
    }

    function togglePlacing(active) {
        state.placing = active;
        el.btnPlace.dataset.active = String(active);
        el.btnPlace.textContent = active ? 'Annuler le placement' : 'Ajouter un point';
        el.stage.classList.toggle('placing', active);
        el.stageHint.hidden = !active;
    }

    function closeExport() {
        el.modalExport.hidden = true;
    }

    // ------------------------------------------------------------------ Boot

    function init() {
        if (typeof setupsData === 'undefined' && typeof setupData === 'undefined') {
            document.body.innerHTML = '<p style="padding:2rem">Impossible de charger <code>../data.js</code>.</p>';
            return;
        }

        loadFromGlobals();
        bindGlobalEvents();
        renderSetupSelect();
        renderStageImage();
        renderItemList();
        renderSetupEditor();
        renderCategories();
        renderEditor();

        if (el.stageImage.complete) renderMarkers();
        el.stageImage.addEventListener('load', renderMarkers);

        detectServer();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
