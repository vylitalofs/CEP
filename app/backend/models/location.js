var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LocationSchema = new Schema(
  {
  	name: {type: String, required: true, min: 3, max: 100},
  }
);

LocationSchema
.virtual('url')
.get(function () {
  return '/api/location/' + this._id;
});

module.exports = mongoose.model('Location', LocationSchema);