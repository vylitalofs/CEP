var Location = require('../models/location');
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

// GET Location
exports.location_detail = function(req, res, next) {
	Location.findById(req.params.id, function (err, location) {
		if (err || location == null) {
			var err = new Error('Location not found');
			err.status = 404;
			return next(err);
		}
		res.status(200).json(location);
	});
}

// GET Location List
exports.location_list = function(req, res, next) {
  Location.find()
	.sort([['index', 'ascending']])
	.exec(function (err, list_locations) {
		if (err) { 
			return next(err); 
		}
		res.json(list_locations)
	});
};

// DELETE Location
exports.location_delete = function(req, res, next) {
	Location.findById(req.params.id, function (err, location) {
		if (err || location == null) {
			var err = new Error('Location not found');
			err.status = 404;
			return next(err);
		}
		location.remove();
		res.status(200).json({"message":"success"});
	});
};

// POST, Location Create 
exports.location_create = [

	// Validate fields.
	body('name').isLength({ min: 1 }).trim().withMessage('Location name must be specified.'),
	body('index').isLength({ min: 1 }).trim().withMessage('Index must be specified.'),

	// Sanitize fields.
	sanitizeBody('name').escape(),
	sanitizeBody('index').toInt(),

	// Process request after validation and sanitization.
	(req, res, next) => {

		// Extract the validation errors from a request.
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(500).json(errors);
			return;
		}
		else {
			var location = new Location(
				{
					name: req.body.name,
					index: req.body.index,
				});

			location.save(function (err) {
				if (err) { 
					return next(err); 
				}
				res.status(200).json({"message":"success"});
			});
		}
	}
];

// PUT, Location Update 
exports.location_update = [

	// Validate fields.
	body('name').isLength({ min: 1 }).trim().withMessage('Location name must be specified.'),
	body('index').isLength({ min: 1 }).trim().withMessage('Index must be specified.'),

	// Sanitize fields.
	sanitizeBody('name').escape(),
	sanitizeBody('index').toInt(),

	// Process request after validation and sanitization.
	(req, res, next) => {

		// Extract the validation errors from a request.
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(500).json(errors);
			return;
		}
		else {
			Location.findById(req.params.id, function (err, location) {
				
				if (err || location == null) {
					var err = new Error('Location not found');
					err.status = 404;
					return next(err);
				}
				
				var newlocation = new Location(
				{
					name: req.body.name,
					index: req.body.index,
					_id: req.params.id
				});

				location.update(newlocation, function (err) {
					if (err) { 
						return next(err); 
					}
					res.status(200).json({"message":"success"});
				});
			});
		}
	}
];