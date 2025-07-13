class CreateOpportunities < ActiveRecord::Migration[7.2]
  def change
    create_table :opportunities do |t|
      t.string :name
      t.text :description
      t.decimal :latitude
      t.decimal :longitude
      t.string :location_name
      t.decimal :estimated_budget
      t.text :available_resources
      t.text :market_opportunity
      t.text :tags
      t.boolean :active

      t.timestamps
    end
  end
end
