var mongoose = require('mongoose');
const crypto = require('crypto');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	firstName: {type: String, required: true, min: 1, max: 100},
	lastName: {type: String, required: true, min: 1, max: 100},
	email: {type: String, required: true, unique:true, min: 3, max: 100},
	accessLevel: {type: Number, required: true},
	hash: String,
	salt: String,
});

UserSchema.methods.isDisabled = function() {
	return this.accessLevel == 0
};

UserSchema.methods.isBasicUser = function() {
	return this.accessLevel == 1
};

UserSchema.methods.isManager = function() {
	return this.accessLevel == 2
};

UserSchema.methods.isAdmin = function() {
	return this.accessLevel == 3
};

UserSchema.methods.isSuper = function() {
	return this.accessLevel == 4
};

UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function(password) {
	const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
	return this.hash === hash;
};

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