var User = require('../models/user');
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

// Display list of all Users on users GET
exports.user_list = function(req, res, next) {
  User.find()
    .sort([['family_name', 'ascending']])
    .exec(function (err, list_users) {
      if (err) { return next(err); }
      res.json(list_users)
    });
};

// Handle User create on POST.
exports.user_create_post = [

    // Validate fields.
    body('name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),

    body('email').isLength({ min: 3 }).trim().isEmail().normalizeEmail().withMessage('Email-address must be specified.'),

    body('password').isLength({ min: 3 }).trim().withMessage('Password must be specified.'),

    // Sanitize fields.
    sanitizeBody('name').escape(),
    sanitizeBody('email').escape(),
    sanitizeBody('password').escape(),
    sanitizeBody('isAdmin').toBoolean(),
    sanitizeBody('isDisabled').toBoolean(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // TODO: Handle errors
            res.status(500).json(errors);
            return;
        }
        else {
            // Form data is valid, create user
            var user = new User(
                {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    isAdmin: req.body.isAdmin,
                    isDisabled: req.body.isDisabled,
                });

            user.save(function (err) {
                if (err) { return next(err); }
                res.status(200).json({"message":"success"});
            });
        }
    }
];