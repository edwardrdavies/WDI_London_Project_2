const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  username: { type: String, required:"Please put a username", unique: true},
  fullname: { type: String },
  image: { type: String },
  postcode: { type: String },
  skillLevel: { type: String },
  availability: { type: String },
  ageRange: { type: String },
  travelDistance: { type: Number, message: 'not a valid number'},
  email: { type: String, required: "You must put an email to register", unique: true },
  phoneNumber: { type: String },
  passwordHash: { type: String, required: "You need a password" },
  lat: { type: Number },
  lng: { type: Number }
});

function setPassword(value){
 this._password    = value;
 this.passwordHash = bcrypt.hashSync(value, bcrypt.genSaltSync(8));
}

function setPasswordConfirmation(passwordConfirmation) {
 this._passwordConfirmation = passwordConfirmation;
}

function validatePasswordHash() {
 if (this.isNew) {
   if (!this._password) {
     return this.invalidate("password", "A password is required.");
   }

   if (this._password.length < 6) {
     this.invalidate('password', 'must be at least 6 characters.');
   }

   if (this._password !== this._passwordConfirmation) {
     return this.invalidate("passwordConfirmation", "Passwords do not match.");
   }
 }
}

function validateEmail(email) {
 if (!validator.isEmail(email)) {
   return this.invalidate('email', 'must be a valid email address');
 }
}

function validatePassword(password){
 return bcrypt.compareSync(password, this.passwordHash);
}

userSchema
 .virtual('password')
 .set(setPassword);

userSchema
 .virtual("passwordConfirmation")
 .set(setPasswordConfirmation);

userSchema
 .path("passwordHash")
 .validate(validatePasswordHash);

userSchema
 .path('email')
 .validate(validateEmail);

userSchema.methods.validatePassword = validatePassword;

userSchema.set("toJSON", {
 transform: function(doc, ret) {
   delete ret.passwordHash;
   delete ret.__v;
   return ret;
 }
});

module.exports = mongoose.model("User", userSchema);
