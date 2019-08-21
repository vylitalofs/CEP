var CaseStatus = require('../models/caseStatus');
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');


// GET caseStatus
exports.caseStatus_detail = function(req, res, next) {
    CaseStatus.findById(req.params.id, function (err, caseStatus) {
        if (err) { return next(err); }
        if (caseStatus == null) {
            var err = new Error('caseStatus not found');
            err.status = 404;
            return next(err);
        }
        res.status(200).json(caseStatus);
    });
}

// GET caseStatus List
exports.caseStatus_list = function(req, res, next) {
  CaseStatus.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_caseStatuses) {
      if (err) { return next(err); }
      res.json(list_caseStatuses)
    });
};

// DELETE caseStatus
exports.caseStatus_delete = function(req, res, next) {
    CaseStatus.findById(req.params.id, function (err, thisStatus) {
        if (err) { return next(err); }
        if (thisStatus == null) {
            var err = new Error('CaseStatus not found');
            err.status = 404;
            return next(err);
        }
        thisStatus.remove();
        res.status(200).json({"message":"success"});
    });
};

// POST, caseStatus Create 
exports.caseStatus_create = [

    // Validate fields.
    body('name').isLength({ min: 1 }).trim().withMessage('CaseStatus name must be specified.'),
    body('defaultStatus').isLength({ min: 1 }).trim().withMessage('defaultStatus field must be specified.'),

    // Sanitize fields.
    sanitizeBody('name').escape(),
    sanitizeBody('defaultStatus').toBoolean(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(500).json(errors);
            return;
        }
        else {
            var status = new CaseStatus(
                {
                    name: req.body.name,
                    defaultStatus:req.body.defaultStatus
                });

            status.save(function (err) {
                if (err) { return next(err); }
                res.status(200).json({"message":"success"});
            });
        }
    }
];

// PUT, caseStatus Update 
exports.caseStatus_update = [

    // Validate fields.
    body('name').isLength({ min: 1 }).trim().withMessage('CaseStatus name must be specified.'),
    body('defaultStatus').isLength({ min: 1 }).trim().withMessage('defaultStatus field must be specified.'),

    // Sanitize fields.
    sanitizeBody('name').escape(),
    sanitizeBody('defaultStatus').toBoolean(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(500).json(errors);
            return;
        }
        else {
            CaseStatus.findById(req.params.id, function (err, thisStatus) {
                if (err) { return next(err); }
                if (thisStatus == null) {
                    var err = new Error('CaseStatus not found');
                    err.status = 404;
                    return next(err);
                }
                
                var newStatus = new CaseStatus(
                {
                    name: req.body.name,
                    defaultStatus:req.body.defaultStatus,
                    _id: req.params.id
                });

                thisStatus.update(newStatus, function (err) {
                    if (err) { return next(err); }
                    res.status(200).json({"message":"success"});
                });
            });
        }
    }
];