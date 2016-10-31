const mongoose = require('mongoose');
const User = require('./models/user');
const Venue = require('./models/venue');
Venue.collection.drop();
User.collection.drop();
mongoose.connect('mongodb://localhost/edsserver');

User.create([{
  username: "test",
  fullname: "Dan Krijgsman",
  image: "https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAeSAAAAJGQyZDVmNjVlLTY3ZDktNGEwNi05M2YyLTI3Y2FiMjQ4N2JlYw.jpg",
  postcode: "SE58NZ",
  skillLevel: "Master",
  availability: "Evenings",
  travelDistance: 5,
  email: "dan@dan.com",
  phoneNumber: 07595971006,
  passwordHash: "12345"

}], (err, users) => {
  if(err) console.log("An error occured");
  if(users) console.log(`${users.length} users created`);

  mongoose.connection.close();
});


Venue.create([{
  venueName: "The All England Lawn Tennis & Croquet Club",
  address: "Wimbledon",
  phone:"020 8340 6534",
  image:"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ60VSTAGDuedSVY7SzBE03zt2gNjK7Y7uqm37xKu7c5wLVuHuq7lx-5sogbA",
  description:"The Most Awesome Tennis Courts in all the land",
  url:"http://www.wimbledon.com/en_GB/atoz/about_aeltc.html"

},{
  venueName: "Bethnal Green Gardens Tennis",
  address: "Malcolm Pl, London E2 0EU",
  phone:"020 8340 6534",
  image:"http://www.etcsports.co.uk/wp-content/uploads/2015/08/Bethnal-Green-Gardens-149.jpg",
  description:"round the back of a carpark",
  url:"http://www.towerhamletstennis.org.uk/#/bethnal-green-gardens/4557558070"

},{
  venueName: "Highgate Tennis Club",
  address: "Shepherd's Cot, Park Rd, London N8 8JJ",
  phone:"020 8340 6534",
  image:"http://www.thecrouchendproject.co.uk/pictures/0020/9609/Highgate_CLTC_Club_House_Credit_Chris_Dixon_view.jpg",
  description:"Play awesome tennis at this awesome club",
  url:"https://www.highgate-tennis.co.uk/"

},{
  venueName: "Blackheath Tennis Club",
  address: "Blackheath Lawn Tennis Club, Charlton Road, Blackheath, London, SE3 8SR",
  image:"http://www.blackheathlawntennisclub.org.uk/",
  description:"Cool tennis in blackheat",
  url:"http://www.blackheathlawntennisclub.org.uk/"

},{
  venueName: "Cumberland Lawn Tennis Club",
  address: "Cumberland Lawn Tennis Club 25 Alvanley Gardens Hampstead London NW6 1JD",
  image:"http://www.cltc-hcc.com/wp-content/uploads/2015/02/adulttennis-800x370.jpg",
  description:"With an active membership and numerous courts to choose from, if you would like a game of tennis the chances of playing are high!",
  url:"http://www.cltc-hcc.com/"

}
], (err, users) => {
  if(err) console.log("An error occured");
  if(users) console.log(`${users.length} venues created`);

  mongoose.connection.close();
});
