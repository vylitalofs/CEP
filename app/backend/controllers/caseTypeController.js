var CaseType = require('../models/caseType');
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

// GET caseType
exports.caseType_detail = function(req, res, next) {
	CaseType.findById(req.params.id, function (err, caseType) {
		if (err || caseType == null) {
			var err = new Error('caseType not found');
			err.status = 404;
			return next(err);
		}
		res.status(200).json(caseType);
	});
}

// GET caseType List
exports.caseType_list = function(req, res, next) {
	CaseType.find()
	.sort([['index', 'ascending']])
	.exec(function (err, list_caseTypes) {
		if (err) {
			return next(err);
		}
		res.json(list_caseTypes);
	});
};

// DELETE caseType
exports.caseType_delete = function(req, res, next) {
	CaseType.findById(req.params.id, function (err, caseType) {
		if (err || caseType == null) {
			var err = new Error('CaseType not found');
			err.status = 404;
			return next(err);
		}
		caseType.remove();
		res.status(200).json({"message":"success"});
	});
};

// POST, caseType Create 
exports.caseType_create = [

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
			var caseType = new CaseType({
				name: req.body.name,
				index: req.body.index,
			});

			caseType.save(function (err) {
				if (err) {
					return next(err);
				}
				res.status(200).json({"message":"success"});
			});
		}
	}
];

// PUT, caseType Update 
exports.caseType_update = [

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
			CaseType.findById(req.params.id, function (err, thisType) {

				if (err || thisType == null) {
					var err = new Error('CaseType not found');
					err.status = 404;
					return next(err);
				}
				
				var newcaseType = new CaseType({
					name: req.body.name,
					index: req.body.index,
					_id: req.params.id
				});

				thisType.update(newcaseType, function (err) {
					if (err) {
						return next(err);
					}
					res.status(200).json({"message":"success"});
				});
			});
		}
	}
];