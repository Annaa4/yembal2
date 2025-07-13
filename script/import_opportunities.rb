#!/usr/bin/env ruby

require 'sqlite3'
require 'csv'

# Vider la table opportunities existante
db = SQLite3::Database.new('storage/development.sqlite3')
db.execute('DELETE FROM opportunities')

# Extraire les données du fichier SQL
sql_file = File.expand_path('~/Downloads/dbyembal_30_juin_2025.sql')
opportunities_data = []

puts "Extraction des données du fichier SQL..."

# Lire le fichier et extraire les données COPY
in_copy_section = false
File.open(sql_file, 'r') do |file|
  file.each_line do |line|
    if line.include?('COPY public.inv_opportunities')
      in_copy_section = true
      puts "Début de la section COPY trouvée"
      next
    end
    
    if in_copy_section
      if line.strip == '\.'
        puts "Fin de la section COPY"
        break
      end
      
      # Parser la ligne de données
      parts = line.strip.split("\t")
      if parts.length >= 17
        id = parts[0].to_i
        name = parts[1]
        description = parts[2]
        location_name = parts[4]
        latitude = parts[5].to_f
        longitude = parts[6].to_f
        available_resources = parts[7]
        market_opportunity = parts[8]
        estimated_budget = parts[9]
        tags = parts[10]
        active = parts[11] == 't' ? 1 : 0  # Convertir en entier pour SQLite
        
        # Nettoyer les données
        name = name.gsub(/\\n/, ' ').gsub(/\\r/, '').strip if name
        description = description.gsub(/\\n/, ' ').gsub(/\\r/, '').strip if description
        location_name = location_name.gsub(/\\n/, ' ').gsub(/\\r/, '').strip if location_name
        tags = tags.gsub(/\\n/, ' ').gsub(/\\r/, '').strip if tags
        
        # Ajouter seulement si latitude et longitude valides
        if latitude != 0 && longitude != 0 && !name.nil? && !name.empty?
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

opportunities_data.each do |opp|
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
end

puts "#{opportunities_data.length} opportunités insérées avec succès !"

# Vérifier les résultats
count = db.execute('SELECT COUNT(*) FROM opportunities')[0][0]
puts "Total d'opportunités dans la base : #{count}"

db.close 