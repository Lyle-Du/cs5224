class Venue {
  constructor(id,name,city,cc,address,lat,lng,categories) {
    self.id         = id
    self.name       = name
    self.city       = city
    self.cc         = cc
    self.address    = address
    self.lat        = lat
    self.lng        = lng
    self.categories = categories
  }
}

class VenueCreator {
  static parse(data) {
    var categories = [];
    data.categories.forEach(function(obj) {
       categories.push(new Category(obj.id, obj.name))
    })

    return new Venue(data.id,data.name,data.city,data.cc,data.address,data.lat,data.lng,categories)
  }
}
