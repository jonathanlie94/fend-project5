import ko from 'knockout';
import Global from 'utils/global';
import ErrorDisplayer from 'utils/errorDisplayer';
import ViewModel from 'models/viewModel.js';

function onMapLoadSuccess() {
  ko.applyBindings(new ViewModel());
}

function onMapLoadError() {
  ErrorDisplayer.setErrorMessage(`There is an error in loading Google Maps.
    Please refresh the page.`);
}

$.getScript(Global.Google.googleMapUrl)
  .done(() => onMapLoadSuccess())
  .fail(() => onMapLoadError());
