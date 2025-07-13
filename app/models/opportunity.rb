class Opportunity < ApplicationRecord
  validates :name, presence: true
  validates :latitude, presence: true, numericality: { greater_than: -90, less_than: 90 }
  validates :longitude, presence: true, numericality: { greater_than: -180, less_than: 180 }
  validates :location_name, presence: true
  
  scope :active, -> { where(active: true) }
  
  def coordinates
    [latitude, longitude]
  end
end
