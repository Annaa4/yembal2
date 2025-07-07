// Gestion des onglets de la section Parcours IA avec auto-rotation
document.addEventListener('DOMContentLoaded', function() {
  class JourneyTabs {
    constructor() {
      this.tabs = document.querySelectorAll('.journey-tab');
      this.contents = document.querySelectorAll('.journey-content');
      this.currentIndex = 0;
      this.autoRotateInterval = null;
      this.autoRotateDelay = 4000; // 4 secondes
      this.pauseAfterClick = 8000; // Pause de 8 secondes après clic manuel
      
      this.init();
    }

    init() {
      // Événements de clic
      this.tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
          this.switchToTab(index, true); // true = clic manuel
        });
      });

      // Initialiser l'image selon l'onglet actif au démarrage
      const activeTab = document.querySelector('.journey-tab.active');
      if (activeTab) {
        const activeTabName = activeTab.getAttribute('data-tab');
        this.updateJourneyImage(activeTabName);
      }

      // Démarrer l'auto-rotation
      this.startAutoRotate();
      
      // Pause au survol de la zone
      const journeySection = document.querySelector('.ai-journey-section');
      if (journeySection) {
        journeySection.addEventListener('mouseenter', () => this.pauseAutoRotate());
        journeySection.addEventListener('mouseleave', () => this.startAutoRotate());
      }
    }

    switchToTab(index, isManualClick = false) {
      // Éviter les index invalides
      if (index < 0 || index >= this.tabs.length) return;
      
      this.currentIndex = index;
      
      // Retirer la classe active de tous les onglets
      this.tabs.forEach(t => t.classList.remove('active'));
      
      // Ajouter la classe active à l'onglet sélectionné
      this.tabs[index].classList.add('active');
      
      // Cacher tous les contenus
      this.contents.forEach(content => {
        content.classList.remove('active');
      });
      
      // Afficher le contenu correspondant
      const targetTab = this.tabs[index].getAttribute('data-tab');
      const targetContent = document.querySelector(`[data-content="${targetTab}"]`);
      if (targetContent) {
        targetContent.classList.add('active');
      }

      // Changer l'image selon l'onglet
      this.updateJourneyImage(targetTab);

      // Si c'est un clic manuel, arrêter l'auto-rotation temporairement
      if (isManualClick) {
        this.pauseAutoRotate();
        setTimeout(() => {
          this.startAutoRotate();
        }, this.pauseAfterClick);
      }
    }

    updateJourneyImage(tabName) {
      const journeyImage = document.getElementById('journey-image');
      if (!journeyImage) return;

      // Définir les images pour chaque onglet
      const imageMap = {
        'carte': '/images/carte.svg',
        'yembalko': '/images/yembalko.svg',
        'accompagnement': '/images/adpme.svg'
      };

      // Mettre à jour l'image et l'alt text
      const imageSrc = imageMap[tabName] || imageMap['carte'];
      const altTexts = {
        'carte': 'Carte interactive',
        'yembalko': 'Application Yembalko',
        'accompagnement': 'Accompagnement ADEPME'
      };

      journeyImage.src = imageSrc;
      journeyImage.alt = altTexts[tabName] || 'Illustration Journey';
    }

    nextTab() {
      const nextIndex = (this.currentIndex + 1) % this.tabs.length;
      this.switchToTab(nextIndex);
    }

    startAutoRotate() {
      this.pauseAutoRotate(); // Arrêter le timer existant
      this.autoRotateInterval = setInterval(() => {
        this.nextTab();
      }, this.autoRotateDelay);
    }

    pauseAutoRotate() {
      if (this.autoRotateInterval) {
        clearInterval(this.autoRotateInterval);
        this.autoRotateInterval = null;
      }
    }
  }

  // Initialiser les onglets
  new JourneyTabs();
}); 