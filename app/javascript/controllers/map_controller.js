import { Controller } from "@hotwired/stimulus"
import * as L from "leaflet"

export default class extends Controller {
  static targets = ["container", "loadingOverlay"]

  connect() {
    if (!this.map) {
      this.map = L.map(this.containerTarget).setView([14.2, -14.5], 7.3)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        opacity: 0.9,
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(this.map)

      // Icône personnalisée
      this.customIcon = L.icon({
        iconUrl: '/images/opp-single.svg',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28]
      })

      // Clustering via global L.MarkerClusterGroup (CDN)
      this.markerClusterGroup = new window.L.MarkerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        disableClusteringAtZoom: 12,
        iconCreateFunction: function(cluster) {
          const count = cluster.getChildCount();
          let size = 'small';
          let color = '#6BBE46';
          if (count > 50) {
            size = 'large';
            color = '#004439';
          } else if (count > 20) {
            size = 'medium';
            color = '#3B605A';
          }
          return L.divIcon({
            html: `<div style=\"background-color: ${color}; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.1);\">${count}</div>`,
            className: `marker-cluster marker-cluster-${size}`,
            iconSize: size === 'large' ? [44, 44] : size === 'medium' ? [38, 38] : [32, 32]
          })
        }
      })
      this.map.addLayer(this.markerClusterGroup)

      // Masquer l'overlay dès que la carte est prête
      this.map.whenReady(() => {
        if (this.hasLoadingOverlayTarget) {
          this.loadingOverlayTarget.style.display = "none";
        }
      });

      this.displayOpportunities()
    }
  }

  displayOpportunities() {
    const data = this.element.closest('.home-main-layout').dataset.opportunities
    if (!data) return
    let opportunities = []
    try {
      opportunities = JSON.parse(data)
    } catch (e) {
      console.error('Erreur de parsing des opportunités', e)
      return
    }
    this.markerClusterGroup.clearLayers()
    opportunities.forEach(opportunity => {
      if (opportunity.latitude && opportunity.longitude) {
        const marker = L.marker([parseFloat(opportunity.latitude), parseFloat(opportunity.longitude)], {icon: this.customIcon})
        marker.bindPopup(
          `<b>${opportunity.name}</b><br>${opportunity.location_name || ''}<br><button onclick=\"window.showProjectDetails && window.showProjectDetails(${opportunity.id})\" class=\"popup-btn\">Voir détails</button>`
        )
        this.markerClusterGroup.addLayer(marker)
      }
    })
  }

  invalidate() {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 200)
    }
  }
} 
