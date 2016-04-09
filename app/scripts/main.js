import ko from 'knockout';
import Helper from 'utils/helper';
import PlaceModel from 'models/placeModel';

/* TODO:
  1. Custom InfoWindow, containing info from Google Maps Places,
     and Foursquare, and Yelp Search API
  2. Show error messages if third-party API failed at the top
  3. Cater for responsiveness across different screen sizes
*/


class ViewModel {
  constructor() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10
    });

    this.markers = [];
    this.visibleMarkers = [];
    this._browserSupportFlag = false;
    this._initialLocation = null;

    this.infowWindow = new google.maps.InfoWindow();

    this.filter = ko.observable(''); // Search keyword
    this.places = ko.observableArray();

    this.filteredPlaces = ko.computed(() => {
      if (!this.filter()) {
        return this.places();
      } else {
        return ko.utils.arrayFilter(this.places(), (place) => {
          return (Helper.containsKeywords(place.name(), this.filter())) ||
            (Helper.containsKeywords(place.vicinity(), this.filter())) ||
            (Helper.containsKeywords(place.types(), this.filter()))
        });
      }
    });

    this.filter.subscribe((newValue) => {
      this._toggleMarkersVisibility();
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
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i ++) {
          this.places.push(new PlaceModel({
            lat: results[i].geometry.location.lat(),
            lng: results[i].geometry.location.lng(),
            name: results[i].name,
            icon: results[i].icon,
            photos: results[i].photos,
            types: results[i].types,
            rating: results[i].rating,
            vicinity: results[i].vicinity
          }));
        }
        this._plotMarkers();
      }
    });
  }

  _plotMarkers() {
    this.places().forEach((place) => {
      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(
          place.lat(),
          place.lng()
        ),
        icon: {
          url: place.icon(),
          scaledSize: new google.maps.Size(28, 28),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 0)
        },
        map: this.map,
        title: place.name()
      });

      this.markers.push(marker);
      this.visibleMarkers.push(marker);
    });

    this._setMapOnAll(null, this.markers);
    this._setMapOnAll(this.map, this.visibleMarkers);
  }

  _setMapOnAll(map, markers) {
    markers.forEach((marker) => {
      marker.setMap(map);
    });
  }

  _toggleMarkersVisibility() {
    this._setMapOnAll(null, this.visibleMarkers);
    this.visibleMarkers = this.markers.filter((marker) => {
      const filteredPlaces = this.filteredPlaces();

      for (let i = 0; i < filteredPlaces.length; i ++) {
        if (filteredPlaces[i].name() == marker.title) {
          return true;
        }
      }

      return false;
    });

    this._setMapOnAll(this.map, this.visibleMarkers);
  }
}

export default ViewModel;

ko.applyBindings(new ViewModel());
