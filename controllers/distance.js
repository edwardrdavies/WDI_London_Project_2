var requestify = require('requestify');
let distance = {};

const getDistance = (origin,destination) => {

  requestify.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=AIzaSyB54_x_Vqe5uUc0eubPI6KSymlhOCJJaAM`).then(function(response) {
    // Get the response body (JSON parsed - JSON response or jQuery object in case of XML response)
    let res = response.getBody().rows[0].elements[0];

   distance = {
      miles: res.distance.text,
      duration: res.duration.text
    };
console.log(distance);

  });


};


getDistance('se58nz','se218bs');
