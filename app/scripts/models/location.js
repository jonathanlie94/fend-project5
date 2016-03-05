import ko from 'knockout';

class Location {
  constructor(lat, lng, name) {
    this.lat = ko.observable(lat);
    this.lng = ko.observable(lng);
    this.name = ko.observable(name);
  }
}

export default Location;
