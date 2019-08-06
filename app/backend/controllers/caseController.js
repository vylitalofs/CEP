const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

var Case = require('../models/case');
var User = require('../models/user');
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
        if (err) { return next(err); }
        if (thiscase == null) {
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
    // TODO: Sort by date created?
    //.sort([['lastName', 'ascending']])
    .populate('type')
    .populate('status')
    .populate('creator', 'firstName lastName')
    .populate('location')
    .exec(function (err, list_cases) {
      if (err) { return next(err); }
      res.json(list_cases)
    });
};

// DELETE Case
exports.case_delete = function(req, res, next) {
    Case.findById(req.params.id, function (err, thiscase) {
        if (err) { return next(err); }
        if (thiscase == null) {
            var err = new Error('Case not found');
            err.status = 404;
            return next(err);
        }
        thiscase.remove();
        res.status(200).json({"message":"success"});
    });
};

// POST, Case Create 
exports.case_create = [

    // Validate fields.
    body('title').isLength({ min: 1 }).trim().withMessage('Title must be specified.'),
    body('description').isLength({ min: 1 }).trim().withMessage('Description required.'),
    body('dateCreated', 'Date created must not be empty.').optional({ checkFalsy: true }).isISO8601(),
    body('creator', 'Creator must not be empty.').isLength({ min: 1 }).trim(),
    body('location', 'Location must not be empty.').isLength({ min: 1 }).trim(),
    body('status', 'Status must not be empty.').isLength({ min: 1 }).trim(),
    body('type', 'Type must not be empty.').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('title').escape(),
    sanitizeBody('description').escape(),
    sanitizeBody('adminComment').escape(),
    sanitizeBody('dateCreated').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(500).json(errors);
            return;
        }
        else {
            var newcase = new Case(
                {
                    title: req.body.title,
                    description: req.body.description,
                    adminComment: req.body.adminComment,
                    dateCreated: req.body.dateCreated,
                    dateUpdated: "",
                    creator: req.body.creator,
                    location: req.body.location,
                    status: req.body.status,
                    type: req.body.type,
                });

            newcase.save(function (err) {
                if (err) { return next(err); }
                res.status(200).json({"message":"success"});
            });
        }
    }
];

// PUT, Case Update 
exports.case_update = [

    // Validate fields.
    body('title').isLength({ min: 1 }).trim().withMessage('Title must be specified.'),
    body('description').isLength({ min: 1 }).trim().withMessage('Description required.'),
    body('dateUpdated', 'Date updated must not be empty.').optional({ checkFalsy: true }).isISO8601(),
    body('location', 'Location must not be empty.').isLength({ min: 1 }).trim(),
    body('status', 'Status must not be empty.').isLength({ min: 1 }).trim(),
    body('type', 'Type must not be empty.').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('title').escape(),
    sanitizeBody('description').escape(),
    sanitizeBody('adminComment').escape(),
    sanitizeBody('dateUpdated').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(500).json(errors);
            return;
        }
        else {
            Case.findById(req.params.id, function (err, thiscase) {
                if (err) { return next(err); }
                if (thiscase == null) {
                    var err = new Error('Case not found');
                    err.status = 404;
                    return next(err);
                }
                
                var newcase = new Case(
                {
                    title: req.body.title,
                    description: req.body.description,
                    adminComment: req.body.adminComment,
                    dateCreated: thiscase.dateCreated,
                    dateUpdated: req.body.dateUpdated,
                    creator: thiscase.creator,
                    location: req.body.location,
                    status: req.body.status,
                    type: req.body.type,
                    _id: req.params.id
                });

                thiscase.update(newcase, function (err) {
                    if (err) { return next(err); }
                    res.status(200).json({"message":"success"});
                });
            });
        }
    }
];