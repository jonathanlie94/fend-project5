# Neighbourhood Map

This project is part of Udacity's Frontend Web Developer Nanodegree. This project is written in ES6 and transpiled using [Babel](http://babeljs.io). The framework is used [Knockout.js](http://knockoutjs.com). Material layouts and components used are from [Material Design Lite](http://getmdl.io).

This application uses Foursquare's Venues API as part of its functionality to show recommended places near a certain location.

## Setup

It should be noted that even though the application project rubric requests the build directory to be included, the build is *NOT* included in the repository. Please run the following code:
```
npm install
npm run build
npm start
```
Once done, open the following page:
```
localhost:8080
```

## Usage Instructions

Use the filter box on the top of the left panel to filter the markers on the map. The filter is by the name of the place.
Select a marker or an item in the left panel to display an info window on the map, listing some details about the location such as its name, rating, as well as nearby interesting places.
