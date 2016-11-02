const mongoose = require('mongoose');
const User = require('./models/user');
const Venue = require('./models/venue');

mongoose.connect('mongodb://localhost/gamesetmatch');
Venue.collection.drop();
User.collection.drop();

function createUsersAndVenues() {
  createUsers(createVenues);
}

function createUsers(callbackWhenFinished) {
  // create all users
  User.create([{
    username: "test",
    fullname: "Dan Krijgsman",
    image: "https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAeSAAAAJGQyZDVmNjVlLTY3ZDktNGEwNi05M2YyLTI3Y2FiMjQ4N2JlYw.jpg",
    postcode: "SE58NZ",
    lat: 51.4721,
    lng: 0.0846,
    skillLevel: "Advanced",
    availability: "Evenings",
    ageRange: "18-35",
    travelDistance: 5,
    email: "dan@dan.com",
    phoneNumber: "07595971006",
    password: "password",
    passwordConfirmation: "password"
  },{
    username: "Nataliemp28",
    fullname: "Natalie Pateman",
    image: "http://bit.ly/2eRjEgS",
    postcode: "E111QA",
    lat: 51.5808,
    lng: 0.0208,
    skillLevel: "Intermediate",
    availability: "Weekends",
    ageRange: "18-35",
    travelDistance: 10,
    email: "natalie@gmail.com",
    phoneNumber: "07594263060",
    password: "password",
    passwordConfirmation: "password"
  },{
    username: "Marco",
    fullname: "Marco Servidio",
    image: "https://s-media-cache-ak0.pinimg.com/564x/5b/82/b9/5b82b940f87e02160cda20fc8a4f386d.jpg",
    postcode: "W1T7RJ",
    lat: 51.5166,
    lng: -0.1299,
    skillLevel: "Beginner",
    availability: "Tuesday and Thursday",
    ageRange: "18-35",
    travelDistance: 15,
    email: "marco@gmail.com",
    phoneNumber: "07883575628",
    password: "password",
    passwordConfirmation: "password"
  },{
    username: "Ed",
    fullname: "Ed Davies",
    image: "https://static-secure.guim.co.uk/sys-images/Guardian/About/General/2013/10/8/1381219095197/Jeremy-Paxman-014.jpg",
    postcode: "E148AG",
    lat: 51.5095,
    lng: 0.0293,
    skillLevel: "Total Pro",
    availability: "Friday evening",
    ageRange: "18-35",
    travelDistance: 8,
    email: "ed@gmail.com",
    phoneNumber: "07586380976",
    password: "password",
    passwordConfirmation: "password"
  },{
    username: "hollywoodbrad",
    fullname: "Brad Pitt",
    image: "https://pbs.twimg.com/media/CO0d2ZcUkAA6gjw.jpg",
    postcode: "SW31DE",
    lat: 51.5009,
    lng: -0.1614,
    skillLevel: "Absolute Novice",
    availability: "Every day between 9-12",
    ageRange: "36-59",
    travelDistance: 15,
    email: "brad@gmail.com",
    phoneNumber: "07956387090",
    password: "password",
    passwordConfirmation: "password"
  },{
    username: "wallBuilder",
    fullname: "Donald Trump",
    image: "http://www.dumpaday.com/wp-content/uploads/2015/09/Donald-trump-8.jpg",
    postcode: "CR00AP",
    lat: 51.3347,
    lng: 0.0115,
    skillLevel: "Absolute Novice",
    availability: "anytime",
    ageRange: "60+",
    travelDistance: 20,
    email: "donald@gmail.com",
    phoneNumber: "+1832759359384",
    password: "password",
    passwordConfirmation: "password"
  },{
    username: "foxymegs",
    fullname: "Megan Fox",
    image: "http://bjstlh.com/image.php?pic=/data/images/megan-fox-photos/megan-fox-photos-5.jpg",
    postcode: "SW40LY",
    lat: 51.4665,
    lng: -0.1464,
    skillLevel: "Intermediate",
    availability: "Monday evening",
    ageRange: "18-35",
    travelDistance: 15,
    email: "megan@gmail.com",
    phoneNumber: "074490759432",
    password: "password",
    passwordConfirmation: "password"
  },{
    username: "lovescakes",
    fullname: "Mary Berry",
    image: "http://bzfd.it/2eYckxh",
    postcode: "SL50AA",
    lat: 51.4027,
    lng: -0.6527,
    skillLevel: "Beginner",
    availability: "Sundays",
    ageRange: "60+",
    travelDistance: 5,
    email: "mary@gmail.com",
    phoneNumber: "07889045608",
    password: "password",
    passwordConfirmation: "password"
  },{
    username: "GokWan",
    fullname: "Gok Wan",
    image: "http://www.hamhigh.co.uk/polopoly_fs/1.4175790.1438274323!/image/image.jpg_gen/derivatives/landscape_630/image.jpg",
    postcode: "NW15HF",
    lat: 51.5235,
    lng: -0.1505,
    skillLevel: "Absolute Pro",
    availability: "Tuesday, Thursday, Friday",
    ageRange: "36-59",
    travelDistance: 3,
    email: "gok@email.com",
    phoneNumber: "07452639880",
    password: "password",
    passwordConfirmation: "password"
  },{
    username: "boselecta",
    fullname: "Keith Lemon",
    image: "http://news.images.itv.com/image/file/891331/stream_img.jpg",
    postcode: "E61AE",
    lat: 51.5370,
    lng: 0.0362,
    skillLevel: "Absolute Novice",
    availability: "Saturday and Sunday morning",
    ageRange: "36-59",
    travelDistance: 10,
    email: "keith@gmail.com",
    phoneNumber: "07943277501",
    password: "password",
    passwordConfirmation: "password"
  },{
    username: "wimbledonchamp",
    fullname: "Andy Murray",
    image: "http://bit.ly/2eoAfrO",
    postcode: "W129AP",
    lat: 51.5031,
    lng: -0.2425,
    skillLevel: "Total Pro",
    availability: "Every damn day",
    ageRange: "36-59",
    travelDistance: 20,
    email: "andy@gmail.com",
    phoneNumber: "07884098773",
    password: "password",
    passwordConfirmation: "password"
  },{
    username: "royalkate",
    fullname: "Kate Middleton",
    image: "http://bit.ly/2e34Pby",
    postcode: "SW1A1AA",
    lat: 51.5014,
    lng: -0.1419,
    skillLevel: "Intermediate",
    availability: "Occasional Sundays",
    ageRange: "18-35",
    travelDistance: 17,
    email: "kate@gmail.com",
    phoneNumber: "07909887312",
    password: "password",
    passwordConfirmation: "password"
  },{
    username: "bojo",
    fullname: "Boris Johnson",
    image: "http://bit.ly/2f23DSN",
    postcode: "W120AD",
    lat: 51.5185,
    lng: -0.2470,
    skillLevel: "Beginner",
    availability: "Weekday evenings",
    ageRange: "60+",
    travelDistance: 10,
    email: "boris@gmail.com",
    phoneNumber: "07885687009",
    password: "password",
    passwordConfirmation: "password"
  },{
    username: "harryginge",
    fullname: "Harry Windsor",
    image: "http://bit.ly/2e3h6Nv",
    postcode: "SL41NJ",
    lat: 51.4840,
    lng: -0.6066,
    skillLevel: "Absolute Pro",
    availability: "Sundays",
    ageRange: "18-35",
    travelDistance: 20,
    email: "harry@gmail.com",
    phoneNumber: "07990121235",
    password: "password",
    passwordConfirmation: "password"
  },{
    username: "partykate",
    fullname: "Kate Moss",
    image: "http://bit.ly/2fFsQ9f",
    postcode: "N103JP",
    lat: 51.5814,
    lng: -0.1463,
    skillLevel: "Total Novice",
    availability: "Weekday Mornings",
    ageRange: "36-59",
    travelDistance: 5,
    email: "kate@gmail.com",
    phoneNumber: "0765911230",
    password: "password",
    passwordConfirmation: "password"
  },{
    username: "stickyricky",
    fullname: "Ricky Gervais",
    image: "http://bit.ly/1Mfhlta",
    postcode: "SL30AD",
    lat: 51.482281,
    lng: -0.530137,
    skillLevel: "Intermediate",
    availability: "Weekend afternoons",
    ageRange: "36-59",
    travelDistance: 15,
    email: "ricky@gmail.com",
    phoneNumber: "07845550976",
    password: "password",
    passwordConfirmation: "password"
  },{
    username: "gazza",
    fullname: "Gary Lineker",
    image: "http://bit.ly/2f28bsu",
    postcode: "N17 0FA",
    lat: 51.599391,
    lng: -0.067283,
    skillLevel: "Beginner",
    availability: "Mornings",
    ageRange: "36-59",
    travelDistance: 20,
    email: "gary@gmail.com",
    phoneNumber: "07899345011",
    password: "password",
    passwordConfirmation: "password"
  },{
    username: "lenny",
    fullname: "Lenny Henry",
    image: "https://c7.staticflickr.com/5/4020/4565384382_055cf5681d_m.jpg",
    postcode: "SE10BD",
    lat: 51.5025,
    lng: 0.1010,
    skillLevel: "Advanced",
    availability: "Anytime",
    ageRange: "60+",
    travelDistance: 18,
    email: "lenny@gmail.com",
    phoneNumber: "07565900231",
    password: "password",
    passwordConfirmation: "password"
  },
  ],
  (err, users) => {
    if(err) {
      console.log("An error occurred creating users:", err);
      mongoose.connection.close();
      return;
    }
    if(users) {
      console.log(`${users.length} users created`);
      callbackWhenFinished();
    }
  });
}

function createVenues() {
  // create the venues
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
  ], (err, venues) => {
    if(err) {
      console.log("An error occurred creating venues:", err);
      return;
    }
    if(venues) {
      console.log(`${venues.length} venues created`);
    }
    mongoose.connection.close();
  });
}

createUsersAndVenues();
