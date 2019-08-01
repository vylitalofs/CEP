var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    name: {type: String, required: true, min: 1, max: 100},
    email: {type: String, required: true, min: 3, max: 100},
    password: {type: String, required: true, min: 4, max: 32},
    isAdmin: {type: Boolean},
  }
);

// Virtual for user's URL
UserSchema
.virtual('url')
.get(function () {
  return '/api/user/' + this._id;
});

//Export model
module.exports = mongoose.model('User', UserSchema);