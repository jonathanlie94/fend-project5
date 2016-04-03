import ko from 'knockout';

class Place {
  constructor(lat, lng, name, icon, photos, types, rating, address) {
    this.lat = ko.observable(lat);
    this.lng = ko.observable(lng);
    this.name = ko.observable(name);
    this.icon = ko.observable(icon);
    this.photos = ko.observable(photos);
    this.types = ko.observable(types);
    this.rating = ko.observable(rating);
    this.address = ko.observable(address);
  }
}

export default Place;
