const router = require('express').Router();
const jwt = require("jsonwebtoken");

const User = require("../controllers/users.js");
const Places = require("../controllers/places.js");
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

router.route("/place")
  .all(secureRoute)
  .get(Places.index);

router.route('/place/:id')
  .all(secureRoute)
  .get(Places.show)
  .put(Places.update)
  .delete(Places.delete);

router.route("/users")
  .post(User.register)
  .get(secureRoute,User.index);

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
