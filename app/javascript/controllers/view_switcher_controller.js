
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["dropdown", "carte", "liste", "label", "icon"]

  connect() {
    this.currentView = "carte"
    this.renderOpportunitiesList()
  }

  updateActiveDropdownItem() {
    this.dropdownTarget.querySelectorAll('.view-dropdown-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === this.currentView)
    })
  }

  toggleDropdown(event) {
    event.stopPropagation()
    this.dropdownTarget.classList.toggle("open")
    this.updateActiveDropdownItem()
  }

  selectView(event) {
    const view = event.currentTarget.dataset.view
    this.currentView = view

    // Affiche la bonne vue
    this.carteTarget.style.display = (view === "carte") ? "" : "none"
    this.listeTarget.style.display = (view === "liste") ? "" : "none"
    if (view === "carte") {
      this.carteTarget.classList.remove("hidden-by-switcher")
    } else {
      this.carteTarget.classList.add("hidden-by-switcher")
    }

    // Change le label et l'icône du bouton principal
    if (view === "carte") {
      this.labelTarget.textContent = "Vue carte"
      this.iconTarget.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="23" viewBox="0 0 28 23" fill="none"><path d="M1 20.9838L3.20268 9.45143L8.47243 6.5459L14.0693 9.45143L19.6582 6.5459L24.9266 9.45143L27 20.7253L20.5212 18.018L14.0761 20.9838L7.56496 17.9751L1 20.9838Z" stroke="#004439" stroke-width="1.5" stroke-miterlimit="10"/><path d="M8.47191 6.5459L7.56445 17.9751" stroke="#004439" stroke-width="1.5" stroke-miterlimit="10"/><path d="M14.0703 9.45117L14.077 20.9836" stroke="#004439" stroke-width="1.5" stroke-miterlimit="10"/><path d="M19.6582 6.5459L20.5212 18.018" stroke="#004439" stroke-width="1.5" stroke-miterlimit="10"/><path d="M14.0901 12.3043C16.308 8.8768 17.8228 6.79454 17.8228 4.73264C17.8228 2.67074 16.152 1 14.0901 1C12.0282 1 10.3574 2.67074 10.3574 4.73264C10.3574 6.79454 11.8722 8.8768 14.0901 12.3043Z" fill="#59B224" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.0909 6.20033C14.8401 6.20033 15.4474 5.593 15.4474 4.84382C15.4474 4.09464 14.8401 3.4873 14.0909 3.4873C13.3417 3.4873 12.7344 4.09464 12.7344 4.84382C12.7344 5.593 13.3417 6.20033 14.0909 6.20033Z" fill="white"/></svg>`
      // Invalide la carte si besoin
      const mapController = this.application.getControllerForElementAndIdentifier(document.querySelector('[data-controller~="map"]'), "map")
      if (mapController) mapController.invalidate()
    } else {
      this.labelTarget.textContent = "Vue liste"
      this.iconTarget.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="0.75" y="8.75" width="20.5" height="4.5" rx="1.25" stroke="#004439" stroke-width="1.5"/><rect x="0.75" y="0.75" width="12.5" height="4.5" rx="1.25" stroke="#004439" stroke-width="1.5"/><rect x="0.75" y="16.75" width="20.5" height="4.5" rx="1.25" stroke="#004439" stroke-width="1.5"/></svg>`
      this.renderOpportunitiesList()
    }

    this.updateActiveDropdownItem()
    this.dropdownTarget.classList.remove("open")
  }

  renderOpportunitiesList() {
    // Récupérer les données depuis le data-attribute du parent
    const mainLayout = document.querySelector('.home-main-layout')
    if (!mainLayout) return
    const data = mainLayout.dataset.opportunities
    if (!data) return
    let opportunities = []
    try {
      opportunities = JSON.parse(data)
    } catch (e) {
      console.error('Erreur de parsing des opportunités', e)
      return
    }
    const listeContainer = document.querySelector('[data-view-switcher-target="liste"]')
    if (!listeContainer) return
    listeContainer.innerHTML = ''
    if (opportunities.length === 0) {
      listeContainer.innerHTML = '<p>Aucune opportunité trouvée.</p>'
      return
    }
    const grid = document.createElement('div')
    grid.className = 'opportunities-grid'
    opportunities.forEach(opportunity => {
      const card = document.createElement('div')
      card.className = 'opportunity-card'
      card.innerHTML = `
        <div class="card-content">
          <h3>${opportunity.name}</h3>
          <div class="location">
            <span>${opportunity.location_name || ''}</span>
          </div>
          <div class="description">
            <span>${opportunity.description ? opportunity.description.substring(0, 100) + '...' : ''}</span>
          </div>
        </div>
      `
      grid.appendChild(card)
    })
    listeContainer.appendChild(grid)
  }
} 