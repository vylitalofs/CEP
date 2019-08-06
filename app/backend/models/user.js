var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    firstName: {type: String, required: true, min: 1, max: 100},
    lastName: {type: String, required: true, min: 1, max: 100},
    email: {type: String, required: true, min: 3, max: 100},
    password: {type: String, required: true, min: 4, max: 32},
    isAdmin: {type: Boolean, required: true},
    isDisabled: {type: Boolean, required: true}
  }
);

UserSchema
.virtual('url')
.get(function () {
  return '/api/user/' + this._id;
});

UserSchema
.virtual('name')
.get(function () {
  return this.lastName + ', ' + this.firstName;
});

module.exports = mongoose.model('User', UserSchema);