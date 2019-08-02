var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    name: {type: String, required: true, min: 1, max: 100},
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

module.exports = mongoose.model('User', UserSchema);