import ko from 'knockout';
import Location from 'models/location';
import Global from './global';

// Dummy data
let data = [{
  lat: 1.00,
  lng: 1.20,
  name: "Some random name"
}, {
  lat: 1.20,
  lng: 1.40,
  name: "Another random name"
}];

class ViewModel {
  constructor(locations) {
    this.locations = ko.observableArray(locations.map((item) => {
      return new Location(item.lat, item.lng, item.name);
    }));
    this.keyword = ko.observable('');
  }
}

export default ViewModel;

ko.applyBindings(new ViewModel(data));
