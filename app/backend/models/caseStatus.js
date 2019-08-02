var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CaseStatusSchema = new Schema(
  {
  	name: {type: String, required: true, min: 3, max: 100},
  }
);

CaseStatusSchema
.virtual('url')
.get(function () {
  return '/api/casestatus/' + this._id;
});

module.exports = mongoose.model('CaseStatus', CaseStatusSchema);