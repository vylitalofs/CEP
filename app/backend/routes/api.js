var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController'); 


// GET user list
router.get('/api/users', userController.user_list);

// POST request for creating User.
router.post('/api/user/create', userController.user_create_post);



module.exports = router;
