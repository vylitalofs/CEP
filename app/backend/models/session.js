const mongoose = require("mongoose");

let Schema = mongoose.Schema({
	ttl:Number,
	token:String,
	userId:String,
	isAdmin:Boolean,
});

module.exports = mongoose.model("Session", Schema);