const mongoose = require('mongoose');
const Beer = require('../models/beer');
Beer.collection.drop();
mongoose.connect('mongodb://localhost/beer-api');

Beer.create([{
  name: "Punk IPA",
  brewery: "BrewDog",
  abv: 4.6
},{
  name: "Camden Hells",
  brewery: "Camden Town Brewer",
  abv: 4.6
}], (err, beers) => {
  if(err) console.log("An error occured");
  if(beers) console.log(`${beers.length} beers created`);

  mongoose.connection.close();
});
