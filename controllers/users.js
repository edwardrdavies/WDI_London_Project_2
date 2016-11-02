const User = require('../models/user');
const jwt = require('jsonwebtoken');
const secret = require('../config/tokens').secret;

function userRegister(req, res){
  User.create(req.body, (err, user) => {
    if (err){
      console.log(err);
      return res.status(500).json({ message: "Ain't not users here!"});
    }
    let payload = {_id:user._id, username: user.username};
    let token = jwt.sign(payload,secret, {expiresIn: 60*60*24});
    console.log(user);
    return res.status(201).json({
      message: "Success, that's a nice a user",
      user,
      token
    });
  });
}

function userLogin(req, res){
  User.findOne({email: req.body.email}, (err, user) => {
    if (err){
      console.log(err);
      return res.status(500).json({ message: "No Login Hombre"});
    }
    if (!user || !user.validatePassword(req.body.password)) {
      return res.status(401).json({ message: "Unauthorized Login"});
    }
    let payload = {_id:user._id, username: user.username};
    let token = jwt.sign(payload,secret, {expiresIn: 60*60*24});

    return res.status(201).json({
      message: "Welcome back",
      user,
      token
    });
  });
}

function userIndex(req,res){
  User.find((err,users)=>{
    if (err){
      console.log(err);
      return res.status(500).json({ message: "Ain't not users here!"});
    }
    return res.status(200).json(users);

  });
}

function userShow(req, res){
  User.findById(req.params.id, (err, user) => {
    if (err){
      console.log(err);
      return res.status(500).json({ message: "Ain't not users here!"});
    }
    return res.status(200).json(user);
  });
}

function userUpdate(req, res){
  User.findByIdAndUpdate(req.params.id, req.body, { new: true}, (err, user) => {
    console.log(req.params.id, req.body);
    if (err){
      console.log(err);
      return res.status(500).json({ message: "Ain't not users here!"});

    }
    if (!user) {
      return res.status(404).json({ message: "No user, no see"});
    }
    return res.status(200).json(user);
  });
}

function userDelete(req, res){
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err){
      console.log(err);
      return res.status(500).json({ message: "Ain't not users here!"});

    }
    if (!user) {
      return res.status(404).json({ message: "No user, no see"});
    }
    return res.status(204).send();
  });
}

module.exports = {
  register: userRegister,
  index: userIndex,
  show: userShow,
  update: userUpdate,
  delete: userDelete,
  login: userLogin
};
