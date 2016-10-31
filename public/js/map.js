'use strict';

// let origin = "brixton";
// let destination = 'dulwich';

function getDistance(origin, destination) {
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix({
    origins: [origin],
    destinations: [destination],
    travelMode: 'DRIVING'
  }, callback);

  function callback(response, status) {
    console.log("h");
    if (status == 'OK') {
      console.log(2);
      var origins = response.originAddresses;
      var destinations = response.destinationAddresses;

      for (var i = 0; i < origins.length; i++) {
        var results = response.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
          var element = results[j];
          var distance = element.distance.text;
          var duration = element.duration.text;
          var from = origins[i];
          var to = destinations[j];

          /// do with me what you will! these are the two variables that show the distances and duration.
          console.log(distance);
          console.log(duration);
        }
      }
    }
  }
}