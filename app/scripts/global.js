import ko from 'knockout';
import Map from './googleMap';

class Global {
  constructor() {
    this.googleMap = new Map();
  }
}

new Global();

export default Global;
