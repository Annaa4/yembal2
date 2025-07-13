document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.landing-sidebar');
    
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
    const viewDropdowns = document.querySelectorAll('.view-selector');
    const mapContainer = document.querySelector('.map-view');
    const listContainer = document.querySelector('.list-view');

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
                
                // Met à jour tous les dropdowns
                viewDropdowns.forEach(d => {
                    d.querySelector('.selected-view-text').textContent = viewText;
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
        const closeBtn = modal.querySelector('.modal-close');
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
    const closeProjectModal = projectModal.querySelector('.modal-close');

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

    // Gestion du modal Yembalko
    const yembalkoBtn = document.querySelector('.yembalko-btn');
    const yembalkoModal = document.getElementById('yembalkoModal');
    const closeYembalkoModal = yembalkoModal.querySelector('.modal-close');

    // Ouvrir le modal
    yembalkoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        yembalkoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Fermer le modal
    function closeYembalkoModalHandler() {
        yembalkoModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeYembalkoModal.addEventListener('click', closeYembalkoModalHandler);

    // Fermer en cliquant en dehors du modal
    yembalkoModal.addEventListener('click', (e) => {
        if (e.target === yembalkoModal) {
            closeYembalkoModalHandler();
        }
    });

    // Gestion du upload dans le modal Yembalko
    const fileInput = document.querySelector('.file-input');
    const uploadLoader = document.querySelector('.upload-loader .loader');

    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                uploadLoader.style.display = 'block';
                
                // Simuler le traitement (vous pouvez ajouter ici l'appel API réel)
                setTimeout(() => {
                    uploadLoader.style.display = 'none';
                    alert('Image traitée avec succès !');
                    closeYembalkoModalHandler();
                }, 2000);
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

    // Initialiser la carte
    function initMap() {
        // Récupérer les données des opportunités depuis le backend
        const opportunities = JSON.parse(document.getElementById('searchInput').dataset.opportunities);
        
        // Ajuster le zoom initial en fonction de la taille de l'écran
        const initialZoom = window.innerWidth <= 768 ? 6 : 7;
        
        // Initialiser la carte centrée sur le Sénégal
        map = L.map('map').setView([14.4974, -14.4524], initialZoom);

        // Ajouter le fond de carte OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Définir les limites de la carte
        const bounds = L.latLngBounds(
            L.latLng(12.3, -17.5), // Sud-Ouest
            L.latLng(16.7, -11.4)  // Nord-Est
        );
        map.setMaxBounds(bounds);
        map.setMinZoom(6);

        // Créer une icône personnalisée
        customIcon = L.icon({
            iconUrl: '/images/opp-icon.svg',
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24]
        });

        // Ajouter les marqueurs initiaux
        updateMapMarkers(opportunities);
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

    // Ajouter cette fonction pour créer un décalage aléatoire beaucoup plus important
    function addJitter(coordinate, amount = 0.07) {
        return coordinate + (Math.random() - 0.5) * amount;
    }

    // Fonction pour mettre à jour les marqueurs sur la carte
    function updateMapMarkers(opportunities) {
        // Supprimer les marqueurs existants
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Ajouter les nouveaux marqueurs avec un décalage beaucoup plus important
        opportunities.forEach(opportunity => {
            if (opportunity.latitude && opportunity.longitude && 
                !isNaN(opportunity.latitude) && !isNaN(opportunity.longitude)) {
                
                // Ajouter un décalage beaucoup plus important aux coordonnées
                const jitteredLat = addJitter(parseFloat(opportunity.latitude), 0.1);
                const jitteredLng = addJitter(parseFloat(opportunity.longitude), 0.1);
                
                const marker = L.marker([jitteredLat, jitteredLng], {icon: customIcon})
                    .bindPopup(`
                        <div class="map-popup">
                            <h3>${opportunity.name}</h3>
                            <p class="location"><img src="/images/globe-icon.svg" alt="Localisation"> ${opportunity.location_name}</p>
                            <button onclick="showProjectDetails(${opportunity.id})" class="popup-btn">Voir détails</button>
                        </div>
                    `)
                    .addTo(map);

                // Ajouter un gestionnaire d'événements pour ouvrir le modal au clic sur le popup
                marker.on('popupopen', function() {
                    const popupBtn = document.querySelector('.popup-btn');
                    if (popupBtn) {
                        popupBtn.addEventListener('click', function() {
                            showProjectDetails(opportunity.id);
                        });
                    }
                });
            } else {
                console.warn(`Invalid coordinates for opportunity ${opportunity.id}: [${opportunity.latitude}, ${opportunity.longitude}]`);
            }
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
            const countSpan = document.querySelector('.results-section h2 span');
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
                    <div class="card-location">
                        <img src="/images/globe-icon.svg" alt="Localisation">
                        <span>${opp.location_name}</span>
                    </div>
                </div>
                <img src="/images/arrowg.svg" alt="Voir détails" class="card-arrow">
            `;

            listContainer.appendChild(card);
        });
    }

    // Initialiser la carte
    initMap();

    // Gestionnaire d'événement pour la recherche
    if (searchInput) {
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
    }

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
