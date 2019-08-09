const mongoose = require('mongoose');
const router = require('express').Router();
const User = mongoose.model('User');
const Session = require("../models/session");
var authController = require('../controllers/authController'); 

router.post("/logout", function(req, res) {
	let token = req.headers.token;
	if(token) {
		Session.findOne({"token":token}, function(err, session) {
			if(err) {
				console.log("Find session failed. Still logging out");
			}
			session.remove()
		});
	}
	return res.status(200).json({"message":"success"});
})

router.post("/login", function(req, res) {

	if(!req.body || !req.body.email || !req.body.password) {
		return res.status(422).json({"error":"wrong credentials"});		
	}

	if(req.body.email.length < 4 || req.body.password.length < 8) {
		return res.status(422).json({"error":"wrong credentials"});		
	}

	User.findOne({"email":req.body.email}, function(err, user) {

		if(err || !user) {
			return res.status(422).json({"message":"wrong credentials"});			
		}

		if (user.validatePassword(req.body.password)) {

			let session = authController.generateSession(user);

			session.save(function(err, session) {
				if(err) {
					return res.status(422).json({"error":"wrong credentials"});						
				} 
				return res.status(200).json({"token":session.token});
			});

		} else {
			return res.status(422).json({"error":"wrong credentials"});				
		}
		
	});
});

module.exports = router;