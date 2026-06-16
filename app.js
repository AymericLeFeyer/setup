document.addEventListener('DOMContentLoaded', () => {
    const imageWrapper = document.getElementById('image-wrapper');

    if (typeof setupData === 'undefined' || !imageWrapper) {
        console.error('Erreur: Les données (setupData) ou le conteneur n\'ont pas été trouvés.');
        return;
    }

    // Fonction pour générer le HTML d'un sous-élément dans la carte
    function createCardItemHtml(item, index) {
        let imageHtml = '';
        if (item.image) {
            imageHtml = `<img src="${item.image}" alt="${item.name}" class="card-image">`;
        }

        let descHtml = '';
        if (item.description) {
            descHtml = `<p class="card-desc">${item.description}</p>`;
        }

        const separator = index > 0 ? `<hr class="card-separator">` : '';
        const hasImageClass = item.image ? 'has-image' : '';

        return `
            ${separator}
            <div class="card-item ${hasImageClass}">
                ${imageHtml}
                <div class="card-content-wrapper">
                    <h3 class="card-title">${item.name}</h3>
                    ${descHtml}
                    <div class="card-footer">
                        <span class="card-price">${item.price}</span>
                        <a href="${item.buyLink}" class="buy-btn" target="_blank" rel="noopener noreferrer">Acheter</a>
                    </div>
                </div>
            </div>
        `;
    }

    // Fonction pour créer un marqueur regroupant plusieurs éléments
    function createMarker(itemsAtCoord) {
        // Trouver l'élément principal (ou par défaut le premier)
        const mainItem = itemsAtCoord.find(i => i.main) || itemsAtCoord[0];
        
        const marker = document.createElement('div');
        marker.classList.add('marker');
        
        // Positionnement en pourcentage
        marker.style.left = `${mainItem.x}%`;
        marker.style.top = `${mainItem.y}%`;
        
        // Couleur optionnelle basée sur l'élément principal
        if (mainItem.color === 'black') {
            marker.classList.add('marker-black');
        }

        // Gestion des bords d'écran
        if (mainItem.x < 20) {
            marker.classList.add('align-left');
        } else if (mainItem.x > 80) {
            marker.classList.add('align-right');
        }

        // Accessibilité
        const names = itemsAtCoord.map(i => i.name).join(', ');
        marker.setAttribute('aria-label', `Voir les détails de: ${names}`);
        marker.setAttribute('role', 'button');
        marker.tabIndex = 0;

        // Création de la carte (infobulle)
        const card = document.createElement('div');
        card.classList.add('device-card');
        
        // Si un des items a une image, on ajoute une classe pour élargir la carte
        if (itemsAtCoord.some(i => i.image)) {
            card.classList.add('has-multiple-or-image');
        }

        // Trier pour mettre le principal en premier
        const sortedItems = [mainItem, ...itemsAtCoord.filter(i => i !== mainItem)];
        
        // Générer le contenu HTML pour chaque item dans cette coordonnée
        card.innerHTML = sortedItems.map((item, index) => createCardItemHtml(item, index)).join('');

        // Gestion de l'affichage sur mobile (click au lieu de hover)
        marker.addEventListener('click', (e) => {
            // Sur mobile, si on clique sur le lien, on laisse passer l'événement
            if (e.target.tagName.toLowerCase() === 'a') return;
            
            document.querySelectorAll('.marker').forEach(m => {
                if (m !== marker) m.classList.remove('active');
            });
            
            marker.classList.toggle('active');
        });

        // Assemblage
        marker.appendChild(card);
        imageWrapper.appendChild(marker);
        
        return marker;
    }

    // Stockage des marqueurs par ID pour l'interaction avec la liste
    const markersById = {};
    const equipmentContainer = document.getElementById('equipment-container');

    // 1. Grouper les items par coordonnées et par catégories
    const itemsByCoord = {};
    const itemsByCategory = {};
    const DEFAULT_CATEGORY = "Autres équipements";
    
    setupData.forEach(item => {
        markersById[item.id] = [];
        
        // Group by coord
        if (item.coordinates && Array.isArray(item.coordinates)) {
            item.coordinates.forEach(coord => {
                const key = `${coord.x}-${coord.y}`;
                if (!itemsByCoord[key]) itemsByCoord[key] = [];
                itemsByCoord[key].push({ ...item, x: coord.x, y: coord.y });
            });
        } 
        else if (item.x !== undefined && item.y !== undefined) {
            const key = `${item.x}-${item.y}`;
            if (!itemsByCoord[key]) itemsByCoord[key] = [];
            itemsByCoord[key].push(item);
        }
        
        // Group by category using categoriesData
        let categoryName = DEFAULT_CATEGORY;
        if (item.category) {
            if (typeof categoriesData !== 'undefined' && Array.isArray(categoriesData)) {
                // Utilisation de == au lieu de === pour supporter les ID en string ou integer (ex: 1 ou "1")
                const catObj = categoriesData.find(c => c.id == item.category);
                categoryName = catObj ? catObj.name : item.category; // fallback to ID if not found
            } else {
                categoryName = item.category; // fallback if categoriesData is not defined
            }
        }

        if (!itemsByCategory[categoryName]) {
            itemsByCategory[categoryName] = [];
        }
        itemsByCategory[categoryName].push(item);
    });

    // 2. Créer les marqueurs pour chaque groupe de coordonnées
    Object.values(itemsByCoord).forEach(itemsAtCoord => {
        const marker = createMarker(itemsAtCoord);
        
        // Lier ce marqueur à tous les items présents à cette coordonnée
        if (marker) {
            itemsAtCoord.forEach(item => {
                markersById[item.id].push(marker);
            });
        }
    });

    // 3. Création des grilles par catégorie
    if (equipmentContainer) {
        equipmentContainer.innerHTML = ''; // Clear just in case
        
        Object.entries(itemsByCategory).forEach(([categoryName, items]) => {
            const categoryWrapper = document.createElement('div');
            categoryWrapper.classList.add('category-group');
            
            const categoryTitle = document.createElement('h2');
            categoryTitle.textContent = categoryName;
            
            // --- Vérifier si l'option showTotal est activée ---
            let showTotal = false;
            if (typeof categoriesData !== 'undefined' && Array.isArray(categoriesData)) {
                const catObj = categoriesData.find(c => c.name === categoryName);
                if (catObj && catObj.showTotal) {
                    showTotal = true;
                }
            }

            if (showTotal) {
                let total = 0;
                items.forEach(item => {
                    if (item.price) {
                        // Extraire le nombre (ex: "106€" -> 106, "1 100 €" -> 1100)
                        // On supprime d'abord les espaces, puis on garde chiffres, virgule et point.
                        const numStr = item.price.replace(/\s/g, '').replace(/[^\d.,]/g, '').replace(',', '.');
                        const num = parseFloat(numStr);
                        if (!isNaN(num)) {
                            total += num;
                        }
                    }
                });

                if (total > 0) {
                    const totalSpan = document.createElement('span');
                    // Formatage: ex 1500 ou 1500.50
                    const formattedTotal = Number.isInteger(total) ? total : total.toFixed(2);
                    totalSpan.textContent = ` (Total : ${formattedTotal}€)`;
                    totalSpan.style.fontStyle = 'italic';
                    totalSpan.style.fontSize = '1.2rem';
                    totalSpan.style.color = 'var(--text-secondary)';
                    totalSpan.style.marginLeft = '15px';
                    categoryTitle.appendChild(totalSpan);
                }
            }

            categoryWrapper.appendChild(categoryTitle);
            
            const grid = document.createElement('div');
            grid.classList.add('equipment-grid');
            
            items.forEach(item => {
                const gridItem = createGridItem(item);
                grid.appendChild(gridItem);
            });
            
            categoryWrapper.appendChild(grid);
            equipmentContainer.appendChild(categoryWrapper);
        });
    }

    // Fonction pour générer une carte de la liste du bas
    function createGridItem(item) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-card');
        
        let imageHtml = '';
        if (item.image) {
            imageHtml = `<img src="${item.image}" alt="${item.name}" class="card-image">`;
            gridItem.classList.add('has-image');
        }

        let descHtml = '';
        if (item.description) {
            descHtml = `<p class="card-desc">${item.description}</p>`;
        }

        gridItem.innerHTML = `
            ${imageHtml}
            <div class="card-content-wrapper">
                <h3 class="card-title">${item.name}</h3>
                ${descHtml}
                <div class="card-footer">
                    <span class="card-price">${item.price}</span>
                    <a href="${item.buyLink}" class="buy-btn" target="_blank" rel="noopener noreferrer">Acheter</a>
                </div>
            </div>
        `;
        
        // Interactions: survoler un élément de la liste met en surbrillance le(s) point(s) sur l'image
        gridItem.addEventListener('mouseenter', () => {
            if (markersById[item.id]) {
                markersById[item.id].forEach(m => m.classList.add('active'));
            }
        });
        
        gridItem.addEventListener('mouseleave', () => {
            if (markersById[item.id]) {
                markersById[item.id].forEach(m => m.classList.remove('active'));
            }
        });

        return gridItem;
    }

    // --- Ajout du tracker de coordonnées ---
    const image = document.getElementById('setup-image');
    const coordsDisplay = document.getElementById('coordinates-display');

    if (image && coordsDisplay) {
        let isTrackerActive = false;

        // Activer/Désactiver au double-clic
        image.addEventListener('dblclick', () => {
            isTrackerActive = !isTrackerActive;
            coordsDisplay.style.opacity = isTrackerActive ? '1' : '0';
            if (isTrackerActive) {
                coordsDisplay.textContent = "Tracker activé";
            }
        });

        image.addEventListener('mousemove', (e) => {
            if (!isTrackerActive) return;
            const rect = image.getBoundingClientRect();
            // Calcul du pourcentage par rapport à la taille de l'image
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            coordsDisplay.textContent = `X: ${x.toFixed(1)}%, Y: ${y.toFixed(1)}%`;
        });
        
        image.addEventListener('mouseenter', () => {
            if (isTrackerActive) coordsDisplay.style.opacity = '1';
        });
        
        image.addEventListener('mouseleave', () => {
            coordsDisplay.style.opacity = '0';
        });
    }
});
