const router = require('express').Router();
const jwt = require("jsonwebtoken");
const Venues = require("../controllers/venues.js");
const User = require("../controllers/users.js");
const secret = require('./tokens').secret;


function secureRoute(req, res, next) {
  if(!req.headers.authorization) return res.status(401).json({ message: "Unauthorized!!"});

  let token = req.headers.authorization.replace('Bearer ', '');

  jwt.verify(token, secret, (err, payload) => {
    if(err) return res.status(401).json({message: "Unauthorized!!"});

    req.user = payload;

    next();
  });
}

// const authController = require('../controllers/auth');

router.route("/venue")
  .all(secureRoute)
  .post(Venues.add)
  .get(Venues.index);

router.route('/venue/:id')
  .all(secureRoute)
  .get(Venues.show)
  .put(Venues.update)
  .delete(Venues.delete);

router.route("/users")
  .post(User.register)
  .get(User.index);

router.route('/user/:id')
  .all(secureRoute)
  .get(User.show)
  .put(User.update)
  .delete(User.delete);

router.route('/login')
  .post(User.login);

router.route('/register')
.post(User.register);

module.exports = router;
