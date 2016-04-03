import ko from 'knockout';
import Helper from 'utils/helper';
import Place from 'models/place';

class ViewModel {
  constructor() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10
    });
    this._browserSupportFlag = false;
    this._initialLocation = null;

    this.filter = ko.observable(''); // Search keyword
    this.places = ko.observableArray();

    this.filteredPlaces = ko.computed(() => {
      if (!this.filter()) {
        return this.places();
      } else {
        return ko.utils.arrayFilter(this.places(), (place) => {
          return (Helper.containsKeywords(place.name(), this.filter())) ||
            (Helper.containsKeywords(place.address(), this.filter())) ||
            (Helper.containsKeywords(place.types(), this.filter()))
        });
      }
    });

    this.selectedPlace = ko.observable("");
    this.defaultLocations = {
      siberia: new google.maps.LatLng(60, 105),
      newyork: new google.maps.LatLng(40.69847032728747, -73.9514422416687)
    };
    this.getCurrentLocation();
  }

  getCurrentLocation() {
    // Try W3C Geolocation
    if (navigator.geolocation) {
      this._browserSupportFlag = true;
      navigator.geolocation.getCurrentPosition((position) => {
          this._initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          this.map.setCenter(this._initialLocation);
          this.requestPlaces();
        }, () => this._handleNoGeolocation(this._browserSupportFlag)
      );
    }
    // Browser doesn't support Geolocation
    else {
      this._browserSupportFlag = false;
      this._handleNoGeolocation(this._browserSupportFlag);
    }
  }

  _handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      this._initialLocation = this.defaultLocations.siberia;
    }
    else {
      this._initialLocation = this.defaultLocations.newyork;
    }
    this.map.setCenter(this._initialLocation);
    this.requestPlaces();
  }

  requestPlaces() {
    let service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch({
      location: new google.maps.LatLng(
        this._initialLocation.lat(),
        this._initialLocation.lng()
      ),
      radius: '20000'
    }, (results, status) => {
      console.log(status);
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i ++) {
          console.log(results[i]);
          let place = new Place(
            results[i].lat,
            results[i].lng,
            results[i].name,
            results[i].icon,
            results[i].photos,
            results[i].types,
            results[i].rating,
            results[i].vicinity
          );
          console.log(place);
          this.places.push(place);
        }
      }
      console.log(this.places());
    });
  }


}

export default ViewModel;

ko.applyBindings(new ViewModel());
