import ko from 'knockout';

class PlaceModel {
  constructor(object) {
    this.lat = ko.observable(object.lat);
    this.lng = ko.observable(object.lng);
    this.name = ko.observable(object.name);
    this.icon = ko.observable(object.icon);
    this.photos = ko.observable(object.photos);
    this.types = ko.observable(object.types);
    this.rating = ko.observable(object.rating);
    this.vicinity = ko.observable(object.vicinity);
  }
}

export default PlaceModel;
