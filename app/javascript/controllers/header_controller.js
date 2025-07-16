import { Controller } from "@hotwired/stimulus"

// Contrôleur Stimulus pour la navigation mobile, l'activation du lien courant et le smooth scroll
export default class extends Controller {
  static targets = ["toggle", "rightPanel", "nav"]

  connect() {
    // Gestion du menu hamburger
    if (this.hasToggleTarget && this.hasRightPanelTarget && this.hasNavTarget) {
      this.isOpen = false;
      this.toggleTarget.addEventListener('click', (e) => this.handleToggle(e));
      this.navTarget.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });
      window.addEventListener('resize', () => this.handleResize());
      document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }
    // Activation du lien courant
    this.activateCurrentNav();
    // Smooth scroll pour les liens internes
    this.initSmoothScroll();
  }

  handleToggle(e) {
    e.preventDefault();
    this.isOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    this.isOpen = true;
    this.toggleTarget.classList.add('active');
    if (window.innerWidth < 768) {
      this.navTarget.classList.add('active');
    }
    this.toggleTarget.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.isOpen = false;
    this.toggleTarget.classList.remove('active');
    if (window.innerWidth < 768) {
      this.navTarget.classList.remove('active');
    }
    this.toggleTarget.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  handleResize() {
    if (window.innerWidth >= 768 && this.isOpen) {
      this.closeMenu();
    }
  }

  handleKeydown(e) {
    if (e.key === 'Escape' && this.isOpen) {
      this.closeMenu();
    }
  }

  activateCurrentNav() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      link.classList.remove('nav-link--active');
      if (href === currentPath || (currentPath.startsWith(href) && href !== '/')) {
        link.classList.add('nav-link--active');
      }
    });
  }

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const header = document.querySelector('.header');
          const headerHeight = header ? header.offsetHeight : 0;
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