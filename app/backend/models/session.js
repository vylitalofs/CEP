const mongoose = require("mongoose");

let Schema = mongoose.Schema({
	email:String,
	token:String,
	isAdmin:Boolean,
	ttl:Number
});

module.exports = mongoose.model("Session", Schema);