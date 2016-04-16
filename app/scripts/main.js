import ko from 'knockout';
import Helper from 'utils/helper';
import PlaceModel from 'models/placeModel';
import Global from 'utils/global';
import API from 'utils/api';

/* TODO:
  1. Custom InfoWindow, containing info from Google Maps Places,
     and Foursquare, and Yelp Search API
  2. Show error messages if third-party API failed at the top
  3. Cater for responsiveness across different screen sizes (change side content
     to MDL layout)
*/

const zoomLevel = 10;

const defaultLocations = {
  siberia: new google.maps.LatLng(60, 105),
  newyork: new google.maps.LatLng(40.69847032728747, -73.9514422416687)
};

const markerAnimationTimeout = 750;

class ViewModel {
  constructor() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: zoomLevel
    });

    this.markers = [];
    this.visibleMarkers = [];

    this._browserSupportFlag = false;
    this._initialLocation = null;

    this.infoWindow = new google.maps.InfoWindow();

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
      this.infoWindow.close();
    });

    this.selectedPlace = ko.observable("");

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
      this._initialLocation = defaultLocations.siberia;
    }
    else {
      this._initialLocation = defaultLocations.newyork;
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
      radius: '50000'
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
        animation: google.maps.Animation.DROP,
      });

      marker.place = place;

      let self = this;

      marker.addListener('click', function () {
        let infoWindow = self.infoWindow;
        infoWindow.close();

        self._updateAndOpenInfoWindow({
          lat: this.position.lat,
          lng: this.position.lng,
        });
      });

      this.markers.push(marker);
      this.visibleMarkers.push(marker);

    });

    this._setMapOnAll(null, this.markers);
    this._setMapOnAll(this.map, this.visibleMarkers);
  }

  _findMarker(lat, lng) {
    return this.visibleMarkers.filter((visibleMarker) => {
      return (visibleMarker.position.lat() == lat &&
        visibleMarker.position.lng() == lng);
    })[0];
  }

  _updateAndOpenInfoWindow(object) {
    // Object can be either a marker or a placeModel
    let marker =  this._findMarker(object.lat(), object.lng());

    this.map.setCenter(new google.maps.LatLng(object.lat(), object.lng()));

    this._resetMarkerAnimations();
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => marker.setAnimation(null), markerAnimationTimeout);

    // Request Foursquare API

    API.callAPI(Global.Foursquare.apiUrl, {
      data: {
        'client_id': Global.Foursquare.clientId,
        'client_secret': Global.Foursquare.clientSecret,
        'v': moment().format('YYYYMMDD'),
        'll': object.lat() + ',' + object.lng(),
        'radius': 250,
        'section': 'topPicks'
      },
      successCallback: (result) => {
        this._renderInfoWindow(marker, result.response.groups[0].items.map((item) => {
          return item.venue;
        }));
      },
      errorCallback: (error) => {
        this._renderInfoWindow(marker);
      }
    });
  }

  _renderInfoWindow(marker, venues) {
    let recommendedPlaces;
    if (Helper.isNullOrUndefined(venues)) {
      recommendedPlaces = 'An error occured while retrieving data from Foursquare.';
    } else {
      recommendedPlaces = 'Recommended places nearby:';
      venues.forEach((venue) => {
        recommendedPlaces += '<br>';
        recommendedPlaces += '- ' + venue.name;
      });
      recommendedPlaces += '<br>Powered by Foursquare';
    }

    let div = `
      <div class='info-window'>
        ${marker.place.name()}
        <br>
        <i class='info-window__rating__logo material-icons'>star</i>
        ${(Helper.isNullOrUndefined(marker.place.rating())) ?
          'No ratings' : marker.place.rating()}
        <br>
        <br>
        ${recommendedPlaces}
        <br>
      </div>
    `;
    this.infoWindow.setContent(div);
    this.infoWindow.open(this.map, marker);
  }

  _resetMarkerAnimations() {
    this.visibleMarkers.forEach((marker) => {
      marker.setAnimation(null);
    });
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
        if (filteredPlaces[i].name() == marker.place.name()) {
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
