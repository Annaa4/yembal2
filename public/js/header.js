/**
 * Header Mobile Navigation
 * Gestion du menu hamburger responsive
 */

class MobileNav {
  constructor() {
    this.toggle = document.querySelector('.header__mobile-toggle');
    this.rightPanel = document.querySelector('.header__right');
    this.nav = document.querySelector('.header__nav');
    this.body = document.body;
    this.isOpen = false;
    
    this.init();
  }

  init() {
    if (!this.toggle || !this.rightPanel) return;
    
    // Event listeners
    this.toggle.addEventListener('click', (e) => this.handleToggle(e));
    
    // Fermer menu au clic sur les liens
    this.nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    
    // Fermer menu au redimensionnement (tablet/desktop)
    window.addEventListener('resize', () => this.handleResize());
    
    // Fermer menu avec échap
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  handleToggle(e) {
    e.preventDefault();
    this.isOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    this.isOpen = true;
    this.toggle.classList.add('active');
    
    // Sur mobile, on anime la navigation comme avant
    if (window.innerWidth < 768) {
      this.nav.classList.add('active');
    }
    
    this.toggle.setAttribute('aria-expanded', 'true');
    
    // Empêcher le scroll du body sur mobile
    this.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.isOpen = false;
    this.toggle.classList.remove('active');
    
    // Sur mobile, on cache la navigation
    if (window.innerWidth < 768) {
      this.nav.classList.remove('active');
    }
    
    this.toggle.setAttribute('aria-expanded', 'false');
    
    // Restaurer le scroll
    this.body.style.overflow = '';
  }

  handleResize() {
    // Fermer menu si passage en tablet/desktop
    if (window.innerWidth >= 768 && this.isOpen) {
      this.closeMenu();
    }
  }

  handleKeydown(e) {
    if (e.key === 'Escape' && this.isOpen) {
      this.closeMenu();
    }
  }
}

// Navigation active (pour Rails)
class ActiveNav {
  constructor() {
    this.init();
  }

  init() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      // Retirer toutes les classes actives
      link.classList.remove('nav-link--active');
      
      // Ajouter active si correspond au path actuel
      if (href === currentPath || 
          (currentPath.startsWith(href) && href !== '/')) {
        link.classList.add('nav-link--active');
      }
    });
  }
}

// Smooth scroll pour liens internes
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        
        if (target) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = target.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  new MobileNav();
  new ActiveNav();
  new SmoothScroll();
});

// Export pour utilisation dans d'autres fichiers si besoin
window.YembalHeader = {
  MobileNav,
  ActiveNav,
  SmoothScroll
}; 