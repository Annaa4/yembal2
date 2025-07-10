namespace :db do
  desc "Import data from SQL dump file"
  task import_yembal_data: :environment do
    sql_file = "/Users/macpro/Downloads/dbyembal_30_juin_2025.sql"

    unless File.exist?(sql_file)
      puts "❌ Fichier SQL non trouvé: #{sql_file}"
      exit 1
    end

    puts "🚀 Début de l'importation des données Yembal..."

    begin
      # Connexion à la base de données
      conn = ActiveRecord::Base.connection

      puts "📋 Lecture du fichier SQL..."
      sql_content = File.read(sql_file)

      # Séparer les commandes SQL
      sql_commands = sql_content.split(";").map(&:strip).reject(&:empty?)

      puts "⚡ Exécution des commandes SQL (#{sql_commands.length} commandes)..."

      # Désactiver temporairement les contraintes
      conn.execute("SET foreign_key_checks = 0") rescue nil

      # Compteurs
      created_tables = 0
      inserted_records = 0

      sql_commands.each_with_index do |command, index|
        next if command.start_with?("--") || command.strip.empty?

        begin
          if command.upcase.include?("CREATE TABLE")
            conn.execute(command + ";")
            created_tables += 1
            puts "✅ Table créée: #{extract_table_name(command)}"
          elsif command.upcase.include?("INSERT INTO")
            conn.execute(command + ";")
            inserted_records += 1
            if inserted_records % 100 == 0
              puts "📊 #{inserted_records} enregistrements insérés..."
            end
          else
            conn.execute(command + ";") unless command.strip.empty?
          end
        rescue ActiveRecord::StatementInvalid => e
          # Ignorer les erreurs de tables déjà existantes ou contraintes
          puts "⚠️  Erreur ignorée: #{e.message[0..100]}..." if Rails.env.development?
        end

        # Afficher le progrès
        if index % 1000 == 0 && index > 0
          puts "🔄 Progression: #{index}/#{sql_commands.length} commandes exécutées"
        end
      end

      # Réactiver les contraintes
      conn.execute("SET foreign_key_checks = 1") rescue nil

      puts "\n🎉 Importation terminée avec succès!"
      puts "📊 Statistiques:"
      puts "   - Tables créées: #{created_tables}"
      puts "   - Enregistrements insérés: #{inserted_records}"

      # Vérifier les données importées
      verify_imported_data

    rescue => e
      puts "❌ Erreur lors de l'importation: #{e.message}"
      puts e.backtrace.first(5).join("\n") if Rails.env.development?
      exit 1
    end
  end

  private

  def extract_table_name(create_command)
    match = create_command.match(/CREATE TABLE (?:public\.)?(\w+)/i)
    match ? match[1] : "Unknown"
  end

  def verify_imported_data
    puts "\n🔍 Vérification des données importées:"

    # Vérifier les principales tables
    tables_to_check = %w[inv_opportunities inv_sectors inv_poles inv_filieres]

    tables_to_check.each do |table_name|
      begin
        count = ActiveRecord::Base.connection.execute("SELECT COUNT(*) FROM #{table_name}").first
        record_count = count.is_a?(Array) ? count.first : count["count"]
        puts "   - #{table_name}: #{record_count} enregistrements"
      rescue => e
        puts "   - #{table_name}: ❌ Table non trouvée ou erreur"
      end
    end

    # Vérifier quelques opportunités avec coordonnées
    begin
      opportunities_with_coords = ActiveRecord::Base.connection.execute(
        "SELECT COUNT(*) FROM inv_opportunities WHERE latitude IS NOT NULL AND longitude IS NOT NULL"
      ).first
      coord_count = opportunities_with_coords.is_a?(Array) ? opportunities_with_coords.first : opportunities_with_coords["count"]
      puts "   - Opportunités avec coordonnées: #{coord_count}"
    rescue => e
      puts "   - Coordonnées: ❌ Erreur lors de la vérification"
    end

    puts "\n✅ Vérification terminée. Vous pouvez maintenant utiliser la landing page dynamique!"
  end
end

# Tâche pour créer quelques données de test si l'import échoue
namespace :db do
  desc "Create sample data for testing"
  task create_sample_data: :environment do
    puts "🎯 Création de données d'exemple..."

    # Créer des secteurs
    sectors = [
      "Agriculture",
      "Industrie",
      "Technologie",
      "Énergie",
      "Transport",
      "Santé",
      "Éducation",
      "Tourisme"
    ]

    # Créer des pôles
    poles = [
      { name: "Pôle Dakar", description: "Zone industrielle de Dakar" },
      { name: "Pôle Thiès", description: "Zone industrielle de Thiès" },
      { name: "Pôle Casamance", description: "Zone agricole de Casamance" },
      { name: "Pôle Saint-Louis", description: "Zone énergétique du Nord" }
    ]

    # Créer des filières
    filieres = [
      "Agroalimentaire",
      "Textile",
      "Métallurgie",
      "Chimie",
      "Technologies de l'information",
      "Énergies renouvelables"
    ]

    # Créer les enregistrements
    sectors.each { |name| InvSector.find_or_create_by(name: name) }
    filieres.each { |name| InvFiliere.find_or_create_by(name: name) }
    poles.each { |attrs| InvPole.find_or_create_by(name: attrs[:name]) { |p| p.description = attrs[:description] } }

    # Créer des opportunités d'exemple
    20.times do |i|
      InvOpportunity.find_or_create_by(name: "Opportunité Test #{i + 1}") do |opp|
        opp.description = "Description de l'opportunité d'investissement #{i + 1}"
        opp.location_name = [ "Dakar", "Thiès", "Saint-Louis", "Ziguinchor" ].sample
        opp.latitude = 14.0 + rand * 2.0  # Sénégal approximatif
        opp.longitude = -17.0 + rand * 6.0
        opp.estimated_investment = "#{rand(100..1000)} millions FCFA"
        opp.target_market = "Marché local et export"
        opp.inv_sector = InvSector.all.sample
        opp.inv_pole = InvPole.all.sample
        opp.inv_filiere = InvFiliere.all.sample
        opp.active = true
      end
    end

    puts "✅ Données d'exemple créées:"
    puts "   - #{InvSector.count} secteurs"
    puts "   - #{InvPole.count} pôles"
    puts "   - #{InvFiliere.count} filières"
    puts "   - #{InvOpportunity.count} opportunités"
  end
end
