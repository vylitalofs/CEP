var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var CaseSchema = new Schema({
	title: {type: String, required: true, min: 1, max: 100},
	description: {type: String, required: true, min: 1, max: 1000},
	adminComment: {type: String, max: 1000},
	dateCreated: {type: Date},
	dateUpdated: {type: Date},
	creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	location: {type: Schema.Types.ObjectId, ref: 'Location', required: true},
	status: {type: Schema.Types.ObjectId, ref: 'CaseStatus', required: true},
	type: {type: Schema.Types.ObjectId, ref: 'CaseType', required: true},
});

CaseSchema
.virtual('url')
.get(function () {
	return '/api/case/' + this._id;
});

CaseSchema
.virtual('dateCreated_formatted')
.get(function () {
	return moment(this.dateCreated).format('MMMM Do, YYYY');
});

CaseSchema
.virtual('dateUpdated_formatted')
.get(function () {
	return moment(this.dateUpdated).format('MMMM Do, YYYY');
});

module.exports = mongoose.model('Case', CaseSchema);