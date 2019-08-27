var User = require('../models/user');
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');


// GET User
exports.user_detail = function(req, res, next) {
    User.findById(req.params.id, '_id firstName lastName email isAdmin', function (err, user) {
        if (err) { return next(err); }
        if (user == null) {
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        res.status(200).json(user);
    });
}

// GET User List
exports.user_list = function(req, res, next) {
  User.find({}, '_id firstName lastName email isAdmin')
    .sort([['lastName', 'ascending']])
    .exec(function (err, list_users) {
      if (err) { return next(err); }
      res.json(list_users)
    });
};

// DELETE User
exports.user_delete = function(req, res, next) {
    User.findById(req.params.id, function (err, user) {
        if (err) { return next(err); }
        if (user == null) {
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        user.remove();
        res.status(200).json({"message":"success"});
    });
};

// POST, User Create 
exports.user_create = [

    // Validate fields.
    body('firstName').isLength({ min: 1 }).trim().withMessage('First name must be specified.'),

    body('lastName').isLength({ min: 1 }).trim().withMessage('Last name must be specified.'),

    body('email').isLength({ min: 3 }).trim().isEmail().normalizeEmail().withMessage('Email-address must be specified.'),

    body('password').isLength({ min: 3 }).trim().withMessage('Password must be specified.'),

    // Sanitize fields.
    sanitizeBody('firstName').escape(),
    sanitizeBody('lastName').escape(),
    sanitizeBody('email').escape(),
    sanitizeBody('password').escape(),
    sanitizeBody('isAdmin').toBoolean(),
    sanitizeBody('isDisabled').toBoolean(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(500).json(errors);
            return;
        }
        else {
            var user = new User(
                {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    isAdmin: req.body.isAdmin,
                    isDisabled: req.body.isDisabled,
                });

            user.setPassword(req.body.password);

            user.save(function (err) {
                if (err) { return next(err); }
                res.status(200).json({
                    "message":"success",
                    "userId":user._id
                });
            })
        }
    }
];

// PUT, User Update 
exports.user_update = [

     // Validate fields.
    body('firstName').isLength({ min: 1 }).trim().withMessage('First name must be specified.'),

    body('lastName').isLength({ min: 1 }).trim().withMessage('Last name must be specified.'),

    body('email').isLength({ min: 3 }).trim().isEmail().normalizeEmail().withMessage('Email-address must be specified.'),

    //body('password').isLength({ min: 3 }).trim().withMessage('Password must be specified.'),

    // Sanitize fields.
    sanitizeBody('firstName').escape(),
    sanitizeBody('lastName').escape(),
    sanitizeBody('email').escape(),
    sanitizeBody('password').escape(),
    sanitizeBody('isAdmin').toBoolean(),
    sanitizeBody('isDisabled').toBoolean(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(500).json(errors);
            return;
        }
        else {
            User.findById(req.params.id, function (err, user) {
                if (err) { return next(err); }
                if (user == null) {
                    var err = new Error('User not found');
                    err.status = 404;
                    return next(err);
                }
                
                var newuser = new User(
                {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    hash: user.hash,
                    salt: user.salt,
                    isAdmin: req.body.isAdmin,
                    isDisabled: req.body.isDisabled,
                    _id: req.params.id
                });

                if (req.body.password && req.body.password.Length < 5) {
                    newuser.setPassword(req.body.password)
                }

                user.update(newuser, function (err) {
                    if (err) { return next(err); }
                    res.status(200).json({"message":"success"});
                });
            });
        }
    }
];