#!/usr/bin/env ruby

require 'sqlite3'
require 'csv'

# Vider la table opportunities existante
db = SQLite3::Database.new('storage/development.sqlite3')
db.execute('DELETE FROM opportunities')

# Extraire les données du fichier SQL
sql_file = File.expand_path('~/Downloads/dbyembal_30_juin_2025.sql')
opportunities_data = []

puts "Extraction des données de la table opportunities..."

# Lire le fichier et extraire les données COPY pour la table opportunities
in_copy_section = false
File.open(sql_file, 'r') do |file|
  file.each_line do |line|
    if line.include?('COPY public.opportunities (id, name, description, available_resources, market_opportunity, latitude, longitude, location_name, estimated_budget, active, created_at, updated_at, tags, strategic_alignment)')
      in_copy_section = true
      puts "Début de la section COPY opportunities trouvée"
      next
    end
    
    if in_copy_section
      if line.strip == '\.'
        puts "Fin de la section COPY opportunities"
        break
      end
      
      # Parser la ligne de données
      parts = line.strip.split("\t")
      if parts.length >= 12
        id = parts[0].to_i
        name = parts[1]
        description = parts[2]
        available_resources = parts[3]
        market_opportunity = parts[4]
        latitude = parts[5].to_f
        longitude = parts[6].to_f
        location_name = parts[7]
        estimated_budget = parts[8]
        active = parts[9] == 't' ? 1 : 0
        tags = parts[12] # tags est en position 12
        
        # Nettoyer les données
        name = name.gsub(/\\n/, ' ').gsub(/\\r/, '').strip if name
        description = description.gsub(/\\n/, ' ').gsub(/\\r/, '').strip if description
        location_name = location_name.gsub(/\\n/, ' ').gsub(/\\r/, '').strip if location_name
        tags = tags.gsub(/\\n/, ' ').gsub(/\\r/, '').strip if tags
        available_resources = available_resources.gsub(/\\n/, ' ').gsub(/\\r/, '').strip if available_resources
        market_opportunity = market_opportunity.gsub(/\\n/, ' ').gsub(/\\r/, '').strip if market_opportunity
        
        # Ajouter seulement si latitude et longitude valides et nom présent
        if latitude != 0 && longitude != 0 && !name.nil? && !name.empty? && name != "\\N"
          opportunities_data << {
            id: id,
            name: name,
            description: description,
            latitude: latitude,
            longitude: longitude,
            location_name: location_name,
            estimated_budget: estimated_budget,
            available_resources: available_resources,
            market_opportunity: market_opportunity,
            tags: tags,
            active: active
          }
        end
      end
    end
  end
end

puts "#{opportunities_data.length} opportunités extraites"

# Insérer les données dans la base SQLite
puts "Insertion des données dans la base SQLite..."

opportunities_data.each_with_index do |opp, index|
  begin
    db.execute(
      'INSERT INTO opportunities (name, description, latitude, longitude, location_name, estimated_budget, available_resources, market_opportunity, tags, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        opp[:name],
        opp[:description],
        opp[:latitude],
        opp[:longitude],
        opp[:location_name],
        opp[:estimated_budget],
        opp[:available_resources],
        opp[:market_opportunity],
        opp[:tags],
        opp[:active],
        Time.now.strftime('%Y-%m-%d %H:%M:%S'),
        Time.now.strftime('%Y-%m-%d %H:%M:%S')
      ]
    )
  rescue => e
    puts "Erreur ligne #{index + 1}: #{e.message}"
    puts "Données problématiques: #{opp.inspect}"
  end
  
  # Afficher le progrès
  if (index + 1) % 500 == 0
    puts "#{index + 1} opportunités insérées..."
  end
end

puts "#{opportunities_data.length} opportunités insérées avec succès !"

# Vérifier les résultats
count = db.execute('SELECT COUNT(*) FROM opportunities')[0][0]
puts "Total d'opportunités dans la base : #{count}"

# Vérifier la répartition par région
puts "\nRépartition par région :"
regions = db.execute('SELECT location_name, COUNT(*) as count FROM opportunities WHERE location_name IS NOT NULL GROUP BY location_name ORDER BY count DESC LIMIT 10')
regions.each do |region, count|
  puts "#{region}: #{count} opportunités"
end

db.close 