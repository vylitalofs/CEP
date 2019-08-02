var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CaseTypeSchema = new Schema(
  {
  	name: {type: String, required: true, min: 3, max: 100},
  }
);

CaseTypeSchema
.virtual('url')
.get(function () {
  return '/api/casetype/' + this._id;
});

module.exports = mongoose.model('CaseType', CaseTypeSchema);