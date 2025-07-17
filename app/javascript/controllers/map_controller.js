import { Controller } from "@hotwired/stimulus"
import * as L from "leaflet"

export default class extends Controller {
  static targets = ["container", "loadingOverlay"]

  connect() {
    if (!this.map) {
      // Centre et zoom optimal sur le Sénégal, comme sur la capture d'écran
      this.map = L.map(this.containerTarget).setView([14.2, -14.5], 7.3)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        opacity: 0.9,
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(this.map)

      // Masquer l'overlay dès que la carte est prête
      this.map.whenReady(() => {
        if (this.hasLoadingOverlayTarget) {
          this.loadingOverlayTarget.style.display = "none";
        }
      });

      fetch('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_ocean.geojson')
        .then(response => response.json())
        .then(data => {
          L.geoJSON(data, {
            style: {
              fillColor: '#cce5ff',
              fillOpacity: 0.3,
              weight: 0,
              color: '#cce5ff'
            }
          }).addTo(this.map);
        });
    }
  }

  invalidate() {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 200)
    }
  }
} 
