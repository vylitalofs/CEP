const mongoose = require("mongoose");

let Schema = mongoose.Schema({
	email:String,
	token:String,
	ttl:Number
});

module.exports = mongoose.model("Session", Schema);