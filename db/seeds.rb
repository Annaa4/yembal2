# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

puts "🌱 Création des secteurs..."

# Créer les secteurs principaux
sectors_data = [
  { name: "Agriculture", description: "Transformation et production agricole", color: "#59B224" },
  { name: "Industrie", description: "Industrie manufacturière et transformation", color: "#004439" },
  { name: "Énergie", description: "Énergies renouvelables et traditionnelles", color: "#FFC500" },
  { name: "Numérique", description: "Technologies et services numériques", color: "#3B605A" },
  { name: "Artisanat", description: "Artisanat et produits locaux", color: "#7E9894" },
  { name: "Export", description: "Produits destinés à l'exportation", color: "#59B224" }
]

sectors = {}
sectors_data.each do |sector_data|
  sector = Sector.find_or_create_by(name: sector_data[:name]) do |s|
    s.description = sector_data[:description]
    s.color = sector_data[:color]
  end
  sectors[sector_data[:name]] = sector
  puts "  ✓ #{sector.name}"
end

puts "🏭 Création des opportunités d'exemple..."

# Coordonnées des principales villes du Sénégal
locations = [
  { name: "Dakar", lat: 14.6928, lng: -17.4467 },
  { name: "Thiès", lat: 14.7886, lng: -16.9246 },
  { name: "Kaolack", lat: 14.1481, lng: -16.0736 },
  { name: "Saint-Louis", lat: 16.0370, lng: -16.4951 },
  { name: "Ziguinchor", lat: 12.5681, lng: -16.2729 },
  { name: "Diourbel", lat: 14.6564, lng: -16.2414 },
  { name: "Tambacounda", lat: 13.7671, lng: -13.6681 },
  { name: "Kolda", lat: 12.8939, lng: -14.9419 },
  { name: "Fatick", lat: 14.3347, lng: -16.4123 },
  { name: "Kédougou", lat: 12.5592, lng: -12.1756 }
]

# Opportunités d'exemple
opportunities_data = [
  {
    name: "Transformation de manioc en farine",
    description: "Unité de transformation de manioc local en farine industrielle pour l'alimentation et l'exportation",
    sector: "Agriculture",
    location: "Fatick",
    estimated_budget: 250_000_000,
    tags: "agroalimentaire, transformation, manioc, farine, export",
    available_resources: "Matières premières locales abondantes, main d'œuvre disponible",
    market_opportunity: "Forte demande locale et régionale, potentiel d'exportation vers l'Afrique de l'Ouest"
  },
  {
    name: "Assemblage de véhicules électriques",
    description: "Centre d'assemblage de véhicules électriques pour le marché ouest-africain",
    sector: "Industrie",
    location: "Thiès",
    estimated_budget: 2_500_000_000,
    tags: "automobile, électrique, assemblage, industrie, innovation",
    available_resources: "Zone industrielle équipée, main d'œuvre qualifiée",
    market_opportunity: "Marché émergent des véhicules électriques en Afrique"
  },
  {
    name: "Production de panneaux solaires",
    description: "Usine de fabrication de panneaux solaires photovoltaïques",
    sector: "Énergie",
    location: "Dakar",
    estimated_budget: 1_800_000_000,
    tags: "solaire, énergie, renouvelable, photovoltaïque, industrie",
    available_resources: "Accès au port, infrastructure électrique",
    market_opportunity: "Demande croissante en énergie solaire au Sénégal et dans la région"
  },
  {
    name: "Plateforme e-commerce agricole",
    description: "Plateforme numérique de commercialisation des produits agricoles",
    sector: "Numérique",
    location: "Dakar",
    estimated_budget: 150_000_000,
    tags: "e-commerce, agriculture, plateforme, numérique, marketplace",
    available_resources: "Hub technologique, développeurs qualifiés",
    market_opportunity: "Digitalisation du secteur agricole"
  },
  {
    name: "Atelier de maroquinerie artisanale",
    description: "Production d'articles de maroquinerie haut de gamme pour l'export",
    sector: "Artisanat",
    location: "Saint-Louis",
    estimated_budget: 85_000_000,
    tags: "maroquinerie, artisanat, cuir, export, haut-gamme",
    available_resources: "Tradition artisanale, matières premières locales",
    market_opportunity: "Marché européen des produits artisanaux africains"
  },
  {
    name: "Transformation d'anacarde",
    description: "Unité de transformation d'anacarde en produits dérivés",
    sector: "Agriculture",
    location: "Ziguinchor",
    estimated_budget: 180_000_000,
    tags: "anacarde, transformation, agroalimentaire, export",
    available_resources: "Production locale d'anacarde importante",
    market_opportunity: "Demande internationale croissante pour les noix de cajou transformées"
  },
  {
    name: "Centre de données écologique",
    description: "Data center alimenté par des énergies renouvelables",
    sector: "Numérique",
    location: "Thiès",
    estimated_budget: 950_000_000,
    tags: "datacenter, cloud, écologique, numérique, infrastructure",
    available_resources: "Connectivité fibre optique, climat favorable",
    market_opportunity: "Demande croissante de services cloud en Afrique de l'Ouest"
  },
  {
    name: "Production de biocarburants",
    description: "Usine de production de biocarburants à partir de déchets agricoles",
    sector: "Énergie",
    location: "Kaolack",
    estimated_budget: 680_000_000,
    tags: "biocarburant, déchets, énergie, durable, agriculture",
    available_resources: "Abondance de déchets agricoles, position géographique centrale",
    market_opportunity: "Transition énergétique et réduction des importations d'hydrocarbures"
  },
  {
    name: "Filature de coton moderne",
    description: "Unité moderne de filature et tissage du coton local",
    sector: "Industrie",
    location: "Tambacounda",
    estimated_budget: 420_000_000,
    tags: "coton, textile, filature, industrie, transformation",
    available_resources: "Production cotonnière locale, main d'œuvre disponible",
    market_opportunity: "Demande locale et sous-régionale de textiles"
  },
  {
    name: "Extraction et transformation d'or",
    description: "Mine et raffinerie d'or avec transformation locale",
    sector: "Industrie",
    location: "Kédougou",
    estimated_budget: 3_200_000_000,
    tags: "or, mine, extraction, transformation, métaux",
    available_resources: "Gisements aurifères confirmés, infrastructure minière",
    market_opportunity: "Cours de l'or favorable, demande internationale stable"
  }
]

opportunities_data.each do |opp_data|
  location = locations.find { |l| l[:name] == opp_data[:location] }
  sector = sectors[opp_data[:sector]]

  next unless location && sector

  opportunity = Opportunity.find_or_create_by(
    name: opp_data[:name],
    sector: sector
  ) do |opp|
    opp.description = opp_data[:description]
    opp.latitude = location[:lat]
    opp.longitude = location[:lng]
    opp.location_name = location[:name]
    opp.estimated_budget = opp_data[:estimated_budget]
    opp.tags = opp_data[:tags]
    opp.available_resources = opp_data[:available_resources]
    opp.market_opportunity = opp_data[:market_opportunity]
    opp.active = true
  end

  puts "  ✓ #{opportunity.name} (#{opportunity.location_name})"
end

puts ""
puts "📊 Résumé des données créées :"
puts "  • #{Sector.count} secteurs"
puts "  • #{Opportunity.count} opportunités"
puts "  • Répartition par secteur :"

Sector.includes(:opportunities).each do |sector|
  count = sector.opportunities.count
  puts "    - #{sector.name}: #{count} opportunités"
end

puts ""
puts "🎉 Seeds terminées avec succès !"
