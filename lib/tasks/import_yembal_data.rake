namespace :yembal do
  desc "Import des données depuis le fichier SQL du projet original"
  task import: :environment do
    puts "🚀 Début de l'import des données Yembal..."

    sql_file = File.expand_path("~/Downloads/dbyembal_30_juin_2025.sql")

    unless File.exist?(sql_file)
      puts "❌ Fichier SQL non trouvé: #{sql_file}"
      exit 1
    end

    puts "📂 Lecture du fichier SQL: #{sql_file}"
    content = File.read(sql_file)

    # Nettoyer les données existantes
    puts "🧹 Nettoyage des données existantes..."
    Opportunity.destroy_all
    Sector.destroy_all

    # Import des secteurs
    import_sectors(content)

    # Import des opportunités
    import_opportunities(content)

    puts ""
    puts "✅ Import terminé avec succès !"
    puts "📊 Résumé des données importées :"
    puts "  • #{Sector.count} secteurs"
    puts "  • #{Opportunity.count} opportunités"
    puts ""
    puts "🎯 Répartition par secteur :"
    Sector.includes(:opportunities).each do |sector|
      count = sector.opportunities.count
      puts "    - #{sector.name}: #{count} opportunités" if count > 0
    end
  end

  private

  def import_sectors(content)
    puts "\n🏢 Import des secteurs..."

    # Extraire les données des secteurs
    sectors_match = content.match(/COPY public\.inv_sectors.*?FROM stdin;\n(.*?)\\\.\n/m)

    unless sectors_match
      puts "❌ Impossible de trouver les données des secteurs"
      return
    end

    sectors_data = sectors_match[1]
    sector_mapping = {}

    sectors_data.lines.each do |line|
      line = line.strip
      next if line.empty?

      # Parser la ligne: id \t name \t created_at \t updated_at
      parts = line.split("\t")
      next if parts.length < 2

      old_id = parts[0].to_i
      name = parts[1]

      # Nettoyer le nom (parfois il y a des caractères étranges)
      name = name.strip.gsub(/[^\w\s\-àâäéèêëïîôöùûüÿç\(\)\/\*]/i, "")

      # Créer le secteur avec une couleur automatique
      sector = Sector.create!(
        name: name,
        description: generate_sector_description(name),
        color: generate_sector_color(name)
      )

      sector_mapping[old_id] = sector
      puts "  ✓ #{sector.name} (id: #{old_id} → #{sector.id})"
    end

    @sector_mapping = sector_mapping
    puts "📊 #{sector_mapping.count} secteurs importés"
  end

  def import_opportunities(content)
    puts "\n🏭 Import des opportunités..."

    # Extraire les données des opportunités principales
    opps_match = content.match(/COPY public\.inv_opportunities.*?FROM stdin;\n(.*?)\\\.\n/m)

    unless opps_match
      puts "❌ Impossible de trouver les données des opportunités"
      return
    end

    opps_data = opps_match[1]
    imported_count = 0
    errors_count = 0

    opps_data.lines.each do |line|
      line = line.strip
      next if line.empty?

      begin
        opportunity = parse_opportunity_line(line)
        if opportunity.save
          imported_count += 1
          print "." if imported_count % 10 == 0
        else
          errors_count += 1
          puts "\n⚠️  Erreur sauvegarde: #{opportunity.errors.full_messages.join(', ')}"
        end
      rescue => e
        errors_count += 1
        puts "\n❌ Erreur parsing ligne: #{e.message}"
      end
    end

    puts "\n📊 #{imported_count} opportunités importées, #{errors_count} erreurs"
  end

  def parse_opportunity_line(line)
    # Les champs dans inv_opportunities:
    # id, name, description, implementation_area, location_name, latitude, longitude,
    # available_resources, target_market, estimated_investment, tags, active,
    # inv_filiere_id, inv_sector_id, created_at, updated_at, inv_pole_id

    parts = line.split("\t")

    # Parser les champs principaux
    old_id = parts[0].to_i
    name = clean_text(parts[1])
    description = clean_text(parts[2])
    implementation_area = clean_text(parts[3])
    location_name = clean_text(parts[4])
    latitude = parse_decimal(parts[5])
    longitude = parse_decimal(parts[6])
    available_resources = clean_text(parts[7])
    target_market = clean_text(parts[8])
    estimated_investment = clean_text(parts[9])
    tags = clean_text(parts[10])
    active = parts[11] == "t"
    inv_sector_id = parts[13].to_i

    # Mapper le secteur
    sector = @sector_mapping[inv_sector_id]

    # Construire l'opportunité
    opportunity = Opportunity.new(
      name: name || "Opportunité ##{old_id}",
      description: build_description(description, implementation_area),
      available_resources: available_resources,
      market_opportunity: target_market,
      latitude: latitude,
      longitude: longitude,
      location_name: location_name,
      estimated_budget: parse_budget(estimated_investment),
      tags: tags,
      active: active,
      sector: sector || Sector.first
    )

    opportunity
  end

  def clean_text(text)
    return nil if text.nil? || text.strip.empty? || text == '\N'

    # Nettoyer le texte des caractères d'échappement et formatage
    text.strip
        .gsub(/\\n/, " ")
        .gsub(/\\t/, " ")
        .gsub(/\s+/, " ")
        .strip
  end

  def parse_decimal(value)
    return nil if value.nil? || value.strip.empty? || value == '\N'
    value.to_f
  end

  def parse_budget(investment_str)
    return nil if investment_str.nil? || investment_str.strip.empty? || investment_str == '\N'

    # Extraire les montants numériques (en millions, milliers, etc.)
    amount = investment_str.scan(/[\d.,]+/).first
    return nil unless amount

    amount = amount.gsub(",", "").to_f

    # Convertir selon les unités
    if investment_str.match?(/million|M/i)
      amount * 1_000_000
    elsif investment_str.match?(/milliard|B/i)
      amount * 1_000_000_000
    elsif investment_str.match?(/k|thousand/i)
      amount * 1_000
    else
      amount
    end
  end

  def build_description(main_desc, implementation_area)
    parts = []
    parts << main_desc if main_desc && !main_desc.empty?
    parts << "Zone d'implémentation: #{implementation_area}" if implementation_area && !implementation_area.empty?

    description = parts.join("\n\n")
    description.empty? ? nil : description
  end

  def generate_sector_description(name)
    descriptions = {
      /extractives?/i => "Secteur de l'extraction et de la transformation des ressources minières",
      /manufacturières?/i => "Secteur de la production industrielle et manufacturière",
      /agroalimentaires?/i => "Secteur de la transformation et production agroalimentaire",
      /services/i => "Secteur des services à haute valeur ajoutée",
      /infrastructures?/i => "Secteur des infrastructures et équipements",
      /or/i => "Secteur de l'extraction et transformation aurifère",
      /marbre/i => "Secteur de l'extraction et transformation du marbre",
      /coton/i => "Secteur de la filière cotonnière",
      /karité/i => "Secteur de la transformation du karité"
    }

    descriptions.each do |pattern, desc|
      return desc if name.match?(pattern)
    end

    "Secteur d'activité spécialisé"
  end

  def generate_sector_color(name)
    # Couleurs basées sur le type de secteur
    colors = {
      /extractives?|or|mine/i => "#C49102",      # Or pour extractif
      /manufacturières?|industrie/i => "#004439", # Vert foncé pour industrie
      /agroalimentaires?|coton|karité/i => "#59B224", # Vert pour agro
      /services|technologie/i => "#3B605A",       # Bleu-vert pour services
      /infrastructures?/i => "#7E9894",           # Gris-vert pour infra
      /marbre|pierre/i => "#8B7355",              # Beige pour marbre
      /métallurgie|fonderie/i => "#5D4E37"        # Marron pour métaux
    }

    colors.each do |pattern, color|
      return color if name.match?(pattern)
    end

    # Couleur par défaut
    "#59B224"
  end
end
