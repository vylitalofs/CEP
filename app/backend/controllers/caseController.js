const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

var Case = require('../models/case');
var User = require('../models/user');
var Session = require('../models/session');
var Location = require('../models/location')
var CaseType = require('../models/caseType')
var CaseStatus = require('../models/caseStatus')

// GET Case
exports.case_detail = function(req, res, next) {
	Case.findById(req.params.id)
	.populate('type')
	.populate('status')
	.populate('creator', 'firstName lastName')
	.populate('location')
	.exec(function (err, thiscase) {
		if (err || thiscase == null) {
			var err = new Error('Case not found');
			err.status = 404;
			return next(err);
		}
		res.status(200).json(thiscase);
	});
}

// GET Case List
exports.case_list = function(req, res, next) {
	Case.find()
	.sort([['dateCreated', 'descending']])
	.populate('type')
	.populate('status')
	.populate('creator', 'firstName lastName')
	.populate('location')
	.exec(function (err, list_cases) {
		if (err) { 
			return next(err); 
		}
		res.json(list_cases)
	});
};

// DELETE Case
exports.case_delete = function(req, res, next) {
	// Get token
	let token = req.headers.token;

	if (!token) {
		return res.status(403).json({"message":"forbidden"});
	}

	// Find session and userId
	Session.findOne({"token":token}, function(err, session) {
		
		if (err || !session || !session.userId) {
			return res.status(403).json({"message":"forbidden"});
		}

		Case.findById(req.params.id, function (err, thiscase) {

			if (err || thiscase == null) {
				var err = new Error('Case not found');
				err.status = 404;
				return next(err);
			}

			// Allow access only if own case or user is admin
			if (!session.isAdmin && session.userId != thiscase.creator._id) {
				return res.status(403).json({"message":"forbidden"});
			}
			
			thiscase.remove();
			res.status(200).json({"message":"success"});
		});
	});
};

// POST, Case Create 
exports.case_create = [

	// Validate fields.
	body('title').isLength({ min: 1 }).trim().withMessage('Title must be specified.'),
	body('description').isLength({ min: 1 }).trim().withMessage('Description required.'),
	body('location', 'Location must not be empty.').isLength({ min: 1 }).trim(),
	body('type', 'Type must not be empty.').isLength({ min: 1 }).trim(),

	// Process request after validation and sanitization.
	(req, res, next) => {

		// Extract the validation errors from a request.
		const errors = validationResult(req);
		
		if (!errors.isEmpty()) {
			console.log(errors)
			res.status(500).json(errors);
			return
		}

		// Get token
		let token = req.headers.token;

		if (!token) {
			return res.status(403).json({"message":"forbidden"});
		}

		// Find session and userId
		Session.findOne({"token":token}, function(err, session) {

			if (err || !session) {
				return res.status(403).json({"message":"forbidden"});
			}

			if (!session.userId) {
				console.log("userid not found")
				return res.status(403).json({"message":"forbidden"});
			}

			// Get the default Status
			CaseStatus.findOne({"defaultStatus":true}, function(err, thisStatus) {

				if (err || !thisStatus) {
					console.log(err)
					return res.status(403).json({"message":"forbidden"});
				}

				var newcase = new Case({
					title: req.body.title,
					description: req.body.description,
					adminComment: req.body.adminComment,
					dateCreated: new Date(),
					dateUpdated: "",
					creator: session.userId,
					location: req.body.location,
					status: thisStatus,
					type: req.body.type,
				});

				newcase.save(function (err) {
					if (err) { 
						return next(err); 
					}
					res.status(200).json({
						"message":"success",
						"caseId":newcase._id
					});
				});
			})
		})
	}
];

// PUT, Case Update 
exports.case_update = [

	// Validate fields.
	body('title').isLength({ min: 1 }).trim().withMessage('Title must be specified.'),
	body('description').isLength({ min: 1 }).trim().withMessage('Description required.'),
	body('location', 'Location must not be empty.').isLength({ min: 1 }).trim(),
	body('status', 'Status must not be empty.').isLength({ min: 1 }).trim(),
	body('type', 'Type must not be empty.').isLength({ min: 1 }).trim(),

	// Process request after validation and sanitization.
	(req, res, next) => {

		// Extract the validation errors from a request.
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(500).json(errors);
			return
		}

		// Get token
		let token = req.headers.token;

		if (!token) {
			return res.status(403).json({"message":"forbidden"});
		}

		// Find session and userId
		Session.findOne({"token":token}, function(err, session) {

			if (err || !session || !session.userId) {
				return res.status(403).json({"message":"forbidden"});
			}

			Case.findById(req.params.id, function (err, thiscase) {

				if (err || thiscase == null) {
					var err = new Error('Case not found');
					err.status = 404;
					return next(err);
				}

				// Allow access only if own case or user is at least manager
				if (session.accessLevel > 2 && session.userId != thiscase.creator._id) {
					return res.status(403).json({"message":"forbidden"});
				}

				// Allow only an admin or case creator to update description and title
				if (session.accessLevel < 3 && session.userId != thiscase.creator._id) {
					req.body.title = thiscase.title
					req.body.description = thiscase.description
				}

				// Allow only manager or higher to update status
				if (session.accessLevel < 2) {
					req.body.status = thiscase.status
				}
				
				var newcase = new Case({
					title: req.body.title,
					description: req.body.description,
					adminComment: req.body.adminComment,
					dateCreated: thiscase.dateCreated,
					dateUpdated: new Date(),
					creator: thiscase.creator,
					location: req.body.location,
					status: req.body.status,
					type: req.body.type,
					_id: req.params.id
				});

				thiscase.update(newcase, function (err) {
					if (err) { 
						return next(err); 
					}
					res.status(200).json({"message":"success"});
				});
			});
		});
	}
];