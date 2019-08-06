var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController'); 


// GET user list
router.get('/api/users', userController.user_list);

// POST request for creating User.
router.post('/api/user/create', userController.user_create);

// GET request for one User.
router.get('/api/user/:id', userController.user_detail);

// PUT request for updating User.
router.put('/api/user/:id/', userController.user_update);

// DELETE request for removing User.
router.delete('/api/user/:id/', userController.user_delete);



module.exports = router;