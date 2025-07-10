// ===========================================
// LANDING PAGE INTERACTIONS
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
  // Éléments DOM
  const tagItems = document.querySelectorAll('.tag-item');
  const viewSelectors = document.querySelectorAll('.view-selector');
  const mapView = document.querySelector('.map-view');
  const listView = document.querySelector('.list-view');
  
  // Variables d'état
  let currentView = 'map';
  
  // Event listeners pour les tags de filtrage
  tagItems.forEach(tag => {
    tag.addEventListener('click', function() {
      // Retirer la classe active de tous les tags
      tagItems.forEach(t => t.classList.remove('active'));
      
      // Activer le tag cliqué
      this.classList.add('active');
    });
  });
  
  // Gestion du changement de vue (carte/liste)
  viewSelectors.forEach(selector => {
    const selectedText = selector.querySelector('.selected-view-text');
    const options = selector.querySelectorAll('.view-option');
    
    // Toggle dropdown
    selector.addEventListener('click', function(e) {
      if (!e.target.closest('.view-option')) {
        this.classList.toggle('active');
      }
    });
    
    // Sélection d'option
    options.forEach(option => {
      option.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const view = this.dataset.view;
        const viewText = this.textContent.trim();
        
        // Mettre à jour le texte sélectionné
        selectedText.textContent = viewText;
        
        // Changer la vue
        if (view === 'map') {
          mapView.classList.remove('hidden');
          listView.classList.add('hidden');
          currentView = 'map';
        } else if (view === 'list') {
          mapView.classList.add('hidden');
          listView.classList.remove('hidden');
          currentView = 'list';
        }
        
        // Fermer le dropdown
        selector.classList.remove('active');
      });
    });
  });
  
  // Fermer les dropdowns en cliquant ailleurs
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.view-selector')) {
      viewSelectors.forEach(selector => {
        selector.classList.remove('active');
      });
    }
  });

  // ===========================================
  // SIDEBAR TOGGLE
  // ===========================================
  
  const toggleSidebar = document.getElementById('toggleSidebar');
  const filtersContainer = document.getElementById('filtersContainer');
  
  if (toggleSidebar && filtersContainer) {
    toggleSidebar.addEventListener('click', function() {
      filtersContainer.classList.toggle('collapsed');
      this.classList.toggle('rotated');
    });
  }

  // ===========================================
  // MODALES
  // ===========================================
  
  // Modale projet
  const projectCards = document.querySelectorAll('.opportunity-card');
  const projectModal = document.getElementById('projectModal');
  const projectModalClose = projectModal?.querySelector('.modal-close');
  
  projectCards.forEach(card => {
    card.addEventListener('click', function() {
      if (projectModal) {
        projectModal.classList.add('active');
        document.body.classList.add('modal-open');
      }
    });
  });
  
  if (projectModalClose) {
    projectModalClose.addEventListener('click', function() {
      projectModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    });
  }
  
  // Modale Yembalko
  const yembalkoBtn = document.querySelector('.yembalko-btn');
  const yembalkoModal = document.getElementById('yembalkoModal');
  const yembalkoModalClose = yembalkoModal?.querySelector('.modal-close');
  
  if (yembalkoBtn && yembalkoModal) {
    yembalkoBtn.addEventListener('click', function() {
      yembalkoModal.classList.add('active');
      document.body.classList.add('modal-open');
    });
  }
  
  if (yembalkoModalClose) {
    yembalkoModalClose.addEventListener('click', function() {
      yembalkoModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    });
  }
  
  // Fermer modales en cliquant sur l'overlay
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
        document.body.classList.remove('modal-open');
      }
    });
  });

  // ===========================================
  // UPLOAD DANS MODALE YEMBALKO
  // ===========================================
  
  const fileInput = document.querySelector('.file-input');
  const uploadButton = document.querySelector('.upload-button');
  const loader = document.querySelector('.loader');
  
  if (fileInput) {
    fileInput.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        // Afficher le loader
        if (loader) {
          loader.style.display = 'block';
        }
        
        // Simuler un upload (remplacer par vraie logique)
        setTimeout(() => {
          if (loader) {
            loader.style.display = 'none';
          }
          alert('Photo analysée ! Résultats bientôt disponibles.');
        }, 2000);
      }
    });
  }
}); 