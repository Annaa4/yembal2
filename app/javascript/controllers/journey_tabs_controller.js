import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["tab", "content", "section", "image"]

  connect() {
    this.currentIndex = 0;
    this.autoRotateInterval = null;
    this.autoRotateDelay = 4000;
    this.pauseAfterClick = 8000;
    this.initTabs();
    this.startAutoRotate();
    if (this.hasSectionTarget) {
      this.sectionTarget.addEventListener('mouseenter', () => this.pauseAutoRotate());
      this.sectionTarget.addEventListener('mouseleave', () => this.startAutoRotate());
    }
  }

  initTabs() {
    this.tabTargets.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        this.switchToTab(index, true);
      });
    });
    const activeTab = this.tabTargets.find(tab => tab.classList.contains('active'));
    if (activeTab) {
      const activeTabName = activeTab.getAttribute('data-tab');
      this.updateJourneyImage(activeTabName);
    }
  }

  switchToTab(index, isManualClick = false) {
    if (index < 0 || index >= this.tabTargets.length) return;
    this.currentIndex = index;
    this.tabTargets.forEach(t => t.classList.remove('active'));
    this.tabTargets[index].classList.add('active');
    this.contentTargets.forEach(content => {
      content.classList.remove('active');
    });
    const targetTab = this.tabTargets[index].getAttribute('data-tab');
    const targetContent = this.contentTargets.find(content => content.getAttribute('data-content') === targetTab);
    if (targetContent) {
      targetContent.classList.add('active');
    }
    this.updateJourneyImage(targetTab);
    if (isManualClick) {
      this.pauseAutoRotate();
      setTimeout(() => {
        this.startAutoRotate();
      }, this.pauseAfterClick);
    }
  }

  updateJourneyImage(tabName) {
    if (!this.hasImageTarget) return;
    const imageMap = {
      'carte': '/images/carte.svg',
      'yembalko': '/images/yembalko.svg',
      'accompagnement': '/images/adpme.svg'
    };
    const altTexts = {
      'carte': 'Carte interactive',
      'yembalko': 'Application Yembalko',
      'accompagnement': 'Accompagnement ADEPME'
    };
    this.imageTarget.src = imageMap[tabName] || imageMap['carte'];
    this.imageTarget.alt = altTexts[tabName] || 'Illustration Journey';
  }

  nextTab() {
    const nextIndex = (this.currentIndex + 1) % this.tabTargets.length;
    this.switchToTab(nextIndex);
  }

  startAutoRotate() {
    this.pauseAutoRotate();
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