class HomeController < ApplicationController
  def index
    @opportunities = Opportunity.where(active: true)
    @popular_tags = Opportunity.where.not(tags: nil)
      .pluck(:tags)
      .map { |t| t.split(',') }
      .flatten
      .map(&:strip)
      .reject(&:blank?)
      .group_by(&:itself)
      .transform_values(&:count)
      .sort_by { |_, v| -v }
      .first(15)
      .map { |name, count| { name: name, count: count } }
  end

  def about
  end

  def carte
    # Page démo de la carte interactive optimisée
  end
end
