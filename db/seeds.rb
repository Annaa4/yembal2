# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

puts "🌱 Création des opportunités d'investissement pour Yembal..."

# Nettoyer les données existantes
Opportunity.destroy_all

# Créer des opportunités d'investissement avec coordonnées GPS réelles
opportunities_data = [
  {
    name: "Ferme aquacole moderne à Saint-Louis",
    description: "Développement d'une ferme aquacole moderne pour l'élevage de tilapia et de crevettes dans la région de Saint-Louis, près du fleuve Sénégal.",
    latitude: 16.0201,
    longitude: -16.4919,
    location_name: "Saint-Louis",
    estimated_budget: 1800000.00,
    available_resources: "Accès à l'eau douce et salée, climat favorable, expertise locale",
    market_opportunity: "Marché national et export vers l'Europe",
    tags: "aquaculture, tilapia, crevettes, saint-louis",
    active: true
  },
  {
    name: "Unité de transformation de riz à Kaolack",
    description: "Création d'une unité moderne de transformation et de conditionnement de riz dans la région de Kaolack. Cette unité permettra de valoriser la production locale de riz et de réduire les importations.",
    latitude: 14.1594,
    longitude: -16.0736,
    location_name: "Kaolack",
    estimated_budget: 2500000.00,
    available_resources: "Rizières productives, main-d'œuvre qualifiée, infrastructures de transport",
    market_opportunity: "Marché national et sous-régional",
    tags: "transformation, riz, agroalimentaire, kaolack",
    active: true
  },
  {
    name: "Centre de transformation de fruits à Thiès",
    description: "Installation d'un centre de transformation et de conditionnement de fruits tropicaux (mangues, oranges, papayes) avec des technologies de conservation modernes.",
    latitude: 14.7889,
    longitude: -16.9261,
    location_name: "Thiès",
    estimated_budget: 3200000.00,
    available_resources: "Production fruitière abondante, infrastructure routière, proximité des ports",
    market_opportunity: "Export international et marché local",
    tags: "fruits, transformation, export, thiès",
    active: true
  },
  {
    name: "Mine d'or artisanale mécanisée à Kédougou",
    description: "Modernisation d'exploitations aurifères artisanales avec introduction d'équipements mécanisés respectueux de l'environnement.",
    latitude: 12.5595,
    longitude: -12.1756,
    location_name: "Kédougou",
    estimated_budget: 5000000.00,
    available_resources: "Gisements aurifères, main-d'œuvre expérimentée, cadre légal favorable",
    market_opportunity: "Marché international de l'or",
    tags: "or, mines, kédougou, artisanal",
    active: true
  },
  {
    name: "Complexe touristique écologique en Casamance",
    description: "Développement d'un complexe touristique écologique en Casamance, mettant en valeur la biodiversité et la culture locale.",
    latitude: 12.5681,
    longitude: -16.2748,
    location_name: "Ziguinchor",
    estimated_budget: 4500000.00,
    available_resources: "Biodiversité exceptionnelle, culture riche, potentiel touristique",
    market_opportunity: "Touristes internationaux et nationaux",
    tags: "écotourisme, casamance, biodiversité, ziguinchor",
    active: true
  },
  {
    name: "Usine textile moderne à Dakar",
    description: "Création d'une usine textile moderne pour la production de vêtements destinés à l'export, utilisant du coton local.",
    latitude: 14.6928,
    longitude: -17.4467,
    location_name: "Dakar",
    estimated_budget: 6000000.00,
    available_resources: "Coton local, main-d'œuvre qualifiée, infrastructures portuaires",
    market_opportunity: "Export vers l'Europe et l'Amérique",
    tags: "textile, export, coton, dakar",
    active: true
  },
  {
    name: "Ferme avicole intensive à Tambacounda",
    description: "Développement d'une ferme avicole moderne avec 50,000 poules pondeuses et unité de transformation d'œufs.",
    latitude: 13.7671,
    longitude: -13.6675,
    location_name: "Tambacounda",
    estimated_budget: 1500000.00,
    available_resources: "Terres disponibles, céréales locales, marché en croissance",
    market_opportunity: "Marché national en expansion",
    tags: "aviculture, œufs, tambacounda, élevage",
    active: true
  },
  {
    name: "Centrale solaire communautaire à Kolda",
    description: "Installation d'une centrale solaire de 10 MW pour alimenter les communautés rurales de la région de Kolda.",
    latitude: 12.8939,
    longitude: -14.9405,
    location_name: "Kolda",
    estimated_budget: 8000000.00,
    available_resources: "Ensoleillement optimal, terrain disponible, demande énergétique",
    market_opportunity: "Communautés rurales et réseau national",
    tags: "solaire, énergie, rural, kolda",
    active: true
  }
]

opportunities_data.each do |opp_data|
  Opportunity.create!(opp_data)
end

puts "✅ Seeds créés avec succès !"
puts "  💼 #{Opportunity.count} opportunités d'investissement"
puts "  📍 Réparties sur #{Opportunity.pluck(:location_name).uniq.count} villes du Sénégal"
