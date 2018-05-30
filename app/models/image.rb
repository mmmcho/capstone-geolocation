class Image < ActiveRecord::Base
  include Protectable
  attr_accessor :image_content

  has_many :thing_images, inverse_of: :image, dependent: :destroy
  has_many :things, through: :thing_images

  composed_of :position,
              class_name:"Point",
              allow_nil: true,
              mapping: [%w(lng lng), %w(lat lat)]

  acts_as_mappable
  scope :exclude_images, -> (imagelist) {where("id not in (?)", imagelist)}

  scope :within_range, ->(origin, limit=nil, reverse=nil, imagelist=nil) {
    scope=Image.within(limit,:origin=>origin)                   if limit
    scope=scope.by_distance(:origin=>origin, :reverse=>reverse) unless reverse.nil?
    scope=scope.exclude_images(imagelist) if imagelist
    return scope
  }

  def to_lat_lng
    Geokit::LatLng.new(lat,lng)
  end

  def basename
    caption || "image-#{id}"
  end

  def self.with_distance(origin, scope)
    scope.select("-1 as distance, *")
         .each {|i| i.distance = i.distance_from(origin) }
  end
end

Point.class_eval do
  def to_lat_lng
    Geokit::LatLng.new(*latlng)
  end
end
