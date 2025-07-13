document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    
    // Fonction pour gérer le comportement selon la taille d'écran
    function handleToggleSidebar() {
        if (window.innerWidth > 768) {
            sidebar.classList.toggle('collapsed');
        }
    }

    // Réinitialiser l'état lors du redimensionnement
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('collapsed');
        }
    });

    // Gestion des dropdowns de vue (mobile et desktop)
    const viewDropdowns = document.querySelectorAll('.view-dropdown');
    const mapContainer = document.querySelector('.map-container');
    const listContainer = document.querySelector('.list-container');

    // Gestionnaire pour les clics sur les dropdowns
    viewDropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation();
            // Ferme tous les autres dropdowns
            viewDropdowns.forEach(d => {
                if (d !== dropdown) d.classList.remove('active');
            });
            dropdown.classList.toggle('active');
        });

        // Gestionnaire pour les options de vue
        dropdown.querySelectorAll('.view-option').forEach(option => {
            option.addEventListener('click', function() {
                const viewType = this.dataset.view;
                const viewText = this.textContent.trim();
                const viewIcon = this.querySelector('img').src;
                
                // Met à jour tous les dropdowns
                viewDropdowns.forEach(d => {
                    d.querySelector('.selected-view').textContent = viewText;
                    d.querySelector('.left-icon').src = viewIcon;
                });
                
                // Gestion de la transition de vue
                if (viewType === 'map') {
                    listContainer.style.opacity = '0';
                    setTimeout(() => {
                        listContainer.classList.add('hidden');
                        mapContainer.classList.remove('hidden');
                        requestAnimationFrame(() => {
                            mapContainer.style.opacity = '1';
                        });
                    }, 300);
                } else {
                    mapContainer.style.opacity = '0';
                    setTimeout(() => {
                        mapContainer.classList.add('hidden');
                        listContainer.classList.remove('hidden');
                        requestAnimationFrame(() => {
                            listContainer.style.opacity = '1';
                        });
                    }, 300);
                }
            });
        });
    });

    // Ferme les dropdowns lors d'un clic à l'extérieur
    document.addEventListener('click', function() {
        viewDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });

    // Gestion du modal des secteurs
    const sectorFilter = document.querySelector('[data-filter="sector"]');
    const modal = document.getElementById('sectorModal');
    
    if (sectorFilter && modal) {  // Vérifier si les éléments existent
        const closeBtn = modal.querySelector('.close-modal');
        const saveBtn = modal.querySelector('.save-btn');

        // Ouvrir le modal
        sectorFilter.addEventListener('click', () => {
            modal.classList.add('active');
            // Empêcher le scroll du body
            document.body.style.overflow = 'hidden';
        });

        // Fermer le modal
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (saveBtn) saveBtn.addEventListener('click', closeModal);

        // Fermer en cliquant en dehors du modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Gestion du modal projet
    const projectModal = document.getElementById('projectModal');
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    const closeProjectModal = projectModal.querySelector('.close-modal');

    // Ouvrir le modal projet
    opportunityCards.forEach(card => {
        card.addEventListener('click', () => {
            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Fermer le modal projet
    function closeProjectModalHandler() {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeProjectModal.addEventListener('click', closeProjectModalHandler);

    // Fermer en cliquant en dehors du modal
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeProjectModalHandler();
        }
    });

    // Gestion du modal Snap & Ideate
    const snapBtn = document.querySelector('.action-btn');
    const snapModal = document.getElementById('snapModal');
    const closeSnapModal = snapModal.querySelector('.close-modal');

    // Ouvrir le modal
    snapBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        snapModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Fermer le modal
    function closeSnapModalHandler() {
        snapModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeSnapModal.addEventListener('click', closeSnapModalHandler);

    // Fermer en cliquant en dehors du modal
    snapModal.addEventListener('click', (e) => {
        if (e.target === snapModal) {
            closeSnapModalHandler();
        }
    });

    // Gestion du upload dans le modal Snap & Ideate
    const snapForm = document.querySelector('.snap-form');
    const snapFileInput = document.querySelector('.snap-file-input');
    const snapLoader = document.querySelector('.loader-container .loader');

    if (snapFileInput) {
        snapFileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                snapLoader.style.display = 'block';
                
                const formData = new FormData(snapForm);
                
                fetch(snapForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.redirect_url) {
                        window.location.href = data.redirect_url;
                    } else {
                        throw new Error(data.errors?.join(', ') || 'Une erreur est survenue');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    snapLoader.style.display = 'none';
                    alert(error.message || 'Une erreur est survenue lors du chargement de l\'image.');
                });
            }
        });
    }

    // Gestion du formulaire et du loader
    const projectForm = document.querySelector('.project-modal form');
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            const button = this.querySelector('.project-action-btn');
            const loader = this.querySelector('.loader');
            const buttonText = this.querySelector('.project-action-btn span:first-child');
            
            // Désactiver le bouton et afficher le loader
            button.disabled = true;
            loader.style.display = 'inline-block';
            buttonText.style.opacity = '0.7';
        });
    }

    // Ajouter après l'initialisation de la carte
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    let map;
    let customIcon;
    let markerClusterGroup;

    // Initialiser la carte
    function initMap() {
        // Récupérer les données des opportunités
        const opportunities = JSON.parse(document.getElementById('searchInput').dataset.opportunities);
        
        map = new maplibregl.Map({
            container: 'map',
            style: {
                version: 8,
                sources: {
                    'osm': {
                        type: 'raster',
                        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: '&copy; OpenStreetMap Contributors'
                    }
                },
                layers: [{
                    id: 'osm',
                    type: 'raster',
                    source: 'osm',
                    minzoom: 0,
                    maxzoom: 19
                }]
            },
            center: [-14.4524, 14.4974], // centre sur le Sénégal
            zoom: window.innerWidth <= 768 ? 6 : 7,
            maxBounds: [
                [-17.5, 12.3], // Sud-Ouest
                [-11.4, 16.7]  // Nord-Est
            ],
            minZoom: 6
        });

        // Ajouter les contrôles de navigation
        map.addControl(new maplibregl.NavigationControl(), 'top-right');

        // Attendre que la carte soit chargée
        map.on('load', () => {
            // Ajouter une source de données pour les marqueurs
            map.addSource('opportunities', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: opportunities.map(opp => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [opp.longitude, opp.latitude]
                        },
                        properties: {
                            id: opp.id,
                            name: opp.name,
                            location: opp.location_name
                        }
                    }))
                },
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50
            });

            // Ajouter une couche pour les clusters
            map.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'opportunities',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': [
                        'step',
                        ['get', 'point_count'],
                        '#6BBE46', // couleur pour < 20 points
                        20,
                        '#3B605A', // couleur pour 20-50 points
                        50,
                        '#004439'  // couleur pour > 50 points
                    ],
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        20, // rayon pour < 20 points
                        20,
                        25, // rayon pour 20-50 points
                        50,
                        30  // rayon pour > 50 points
                    ]
                }
            });

            // Ajouter une couche pour le nombre de points dans les clusters
            map.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'opportunities',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['Arial Unicode MS Bold'],
                    'text-size': 12
                },
                paint: {
                    'text-color': '#ffffff'
                }
            });

            // Ajouter une couche pour les points individuels
            map.addLayer({
                id: 'unclustered-point',
                type: 'circle',
                source: 'opportunities',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': '#6BBE46',
                    'circle-radius': 10,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#fff'
                }
            });
        });

        // Gérer les clics sur les clusters
        map.on('click', 'clusters', (e) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
            const clusterId = features[0].properties.cluster_id;
            map.getSource('opportunities').getClusterExpansionZoom(
                clusterId,
                (err, zoom) => {
                    if (err) return;

                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                    });
                }
            );
        });

        // Gérer les clics sur les points individuels
        map.on('click', 'unclustered-point', (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const { id, name, location } = e.features[0].properties;

            // Créer le popup
            const popupContent = `
                <div class="map-popup">
                    <h3>${name}</h3>
                    <p class="location">
                        <img src="/images/location-icon.svg" alt="Location">
                        ${location}
                    </p>
                    <button onclick="showProjectDetails(${id})" class="popup-btn">Voir détails</button>
                </div>
            `;

            new maplibregl.Popup()
                .setLngLat(coordinates)
                .setHTML(popupContent)
                .addTo(map);
        });

        // Changer le curseur au survol
        map.on('mouseenter', 'clusters', () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', () => {
            map.getCanvas().style.cursor = '';
        });

        map.on('mouseenter', 'unclustered-point', () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'unclustered-point', () => {
            map.getCanvas().style.cursor = '';
        });
    }

    // Fonction pour afficher les détails du projet
    window.showProjectDetails = function(opportunityId) {
        const opportunities = JSON.parse(document.getElementById('searchInput').dataset.opportunities);
        const opportunity = opportunities.find(opp => opp.id === opportunityId);
        
        if (opportunity) {
            const projectTitle = projectModal.querySelector('.project-title');
            const projectDescription = projectModal.querySelector('.project-description');
            const projectResources = projectModal.querySelector('.project-resources');
            const projectMarket = projectModal.querySelector('.project-market');
            const opportunityIdInput = document.getElementById('projectOpportunityId');

            projectTitle.textContent = opportunity.name;
            projectDescription.textContent = opportunity.description;
            projectResources.textContent = opportunity.available_resources;
            projectMarket.textContent = opportunity.market_opportunity;
            opportunityIdInput.value = opportunity.id;

            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    // Fonction pour mettre à jour les marqueurs sur la carte
    function updateMapMarkers(opportunities) {
        if (!map.getSource('opportunities')) return;

        map.getSource('opportunities').setData({
            type: 'FeatureCollection',
            features: opportunities.map(opp => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [opp.longitude, opp.latitude]
                },
                properties: {
                    id: opp.id,
                    name: opp.name,
                    location: opp.location_name
                }
            }))
        });
    }

    // Gestion des tags
    const tagItems = document.querySelectorAll('.tag-item');
    tagItems.forEach(tag => {
        tag.addEventListener('click', function() {
            const tagName = this.dataset.tag;
            
            // Toggle classe active
            this.classList.toggle('active');
            
            // Si le tag est actif, filtrer les résultats
            if (this.classList.contains('active')) {
                updateResults('', tagName);
            } else {
                updateResults('', '');
            }
        });
    });

    // Modifier la fonction updateResults pour prendre en compte les tags
    function updateResults(query, tag = '') {
        let url = '/?';
        if (query) url += `search=${encodeURIComponent(query)}`;
        if (tag) url += `${query ? '&' : ''}tag=${encodeURIComponent(tag)}`;

        fetch(url, {
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Mettre à jour le nombre d'opportunités
            const countSpan = document.querySelector('.results-header h2 span');
            countSpan.textContent = `(${data.length})`;

            // Mettre à jour la carte
            updateMapMarkers(data);

            // Mettre à jour la vue liste
            updateListView(data);
        });
    }

    // Ajouter cette fonction pour mettre à jour la vue liste
    function updateListView(opportunities) {
        const listContainer = document.querySelector('.opportunities-grid');
        if (!listContainer) return;

        // Vider la liste actuelle
        listContainer.innerHTML = '';

        // Créer et ajouter les nouvelles cartes d'opportunités
        opportunities.forEach(opp => {
            const card = document.createElement('div');
            card.className = 'opportunity-card';
            card.onclick = () => showProjectDetails(opp.id);
            card.setAttribute('data-project-id', opp.id);

            card.innerHTML = `
                <div class="card-content">
                    <h3>${opp.name}</h3>
                    <div class="location">
                        <img src="/images/location-icon.svg" alt="Location">
                        <span>${opp.location_name}</span>
                    </div>
                </div>
                <img src="/images/arrow-right-green.svg" alt="Arrow" class="card-arrow">
            `;

            listContainer.appendChild(card);
        });
    }

    // Initialiser la carte
    initMap();

    // Gestionnaire d'événement pour la recherche
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        searchTimeout = setTimeout(() => {
            if (query.length >= 2) {
                updateResults(query);
            } else if (query.length === 0) {
                updateResults('');
            }
        }, 300);
    });

    // Ajouter un gestionnaire de redimensionnement pour ajuster le zoom
    window.addEventListener('resize', function() {
        if (map) {
            const newZoom = window.innerWidth <= 768 ? 6 : 7;
            map.setZoom(newZoom);
        }
    });

    // Ajouter l'écouteur d'événement sur le header des tags
    const tagsHeader = document.querySelector('.tags-header');
    if (tagsHeader) {
        tagsHeader.addEventListener('click', handleToggleSidebar);
    }
});
