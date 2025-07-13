require 'set'

class HomeController < ApplicationController
  def index
    @opportunities = if params[:search].present?
      query = params[:search].downcase
      Opportunity.where(active: true)
                 .where("LOWER(name) LIKE :query OR 
                        LOWER(description) LIKE :query OR 
                        LOWER(location_name) LIKE :query OR 
                        LOWER(tags) LIKE :query", 
                        query: "%#{query}%")
    elsif params[:tag].present?
      Opportunity.where(active: true)
                 .where("LOWER(tags) LIKE ? OR LOWER(location_name) LIKE ?", 
                        "%#{params[:tag].downcase}%", "%#{params[:tag].downcase}%")
    else
      Opportunity.where(active: true)
    end

    # 15 tags populaires, propres, sans doublons ni vides ni \n ni espaces
    @popular_tags = Opportunity.where(active: true)
      .pluck(:tags)
      .compact
      .flat_map { |tags| tags.split(',') }
      .map { |tag| tag.to_s.strip }
      .reject { |tag| tag.gsub(/\s+/, '').empty? || tag.length < 2 }
      .map { |tag| tag.mb_chars.capitalize.to_s }
      .group_by(&:itself)
      .transform_values(&:count)
      .sort_by { |_, count| -count }
      .first(15)
      .map { |tag, count| { name: tag, count: count } }

    @opportunities_json = @opportunities.map do |opp|
      {
        id: opp.id,
        name: opp.name,
        description: opp.description,
        latitude: opp.latitude,
        longitude: opp.longitude,
        location_name: opp.location_name,
        estimated_budget: opp.estimated_budget,
        available_resources: opp.available_resources,
        market_opportunity: opp.market_opportunity,
        tags: opp.tags
      }
    end.to_json

    respond_to do |format|
      format.html
      format.json { render json: @opportunities_json }
    end
  end

  def about
  end

  def carte
  end
end
