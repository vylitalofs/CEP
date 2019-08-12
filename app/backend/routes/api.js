var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController'); 
var caseController = require('../controllers/caseController'); 
var locationController = require('../controllers/locationController'); 
var caseTypeController = require('../controllers/caseTypeController'); 
var caseStatusController = require('../controllers/caseStatusController'); 
var authController = require('../controllers/authController'); 


// USER


// GET User list
router.get('/users', authController.isUserAdmin, userController.user_list);

// POST request for creating User.
router.post('/user/create', authController.isUserAdmin, userController.user_create);

// GET request for one User.
router.get('/user/:id', userController.user_detail);

// PUT request for updating User.
router.put('/user/:id/', authController.isUserAdmin, userController.user_update);

// DELETE request for removing User.
router.delete('/user/:id/', authController.isUserAdmin, userController.user_delete);


// CASE


// GET Case list
router.get('/cases', caseController.case_list);

// POST request for creating Case.
router.post('/case/create', caseController.case_create);

// GET request for one Case.
router.get('/case/:id', caseController.case_detail);

// PUT request for updating Case.
router.put('/case/:id/', authController.isUserAdmin, caseController.case_update);

// DELETE request for removing Case.
router.delete('/case/:id/', authController.isUserAdmin, caseController.case_delete);


// LOCATION


// GET Location list
router.get('/locations', locationController.location_list);

// POST request for creating Location.
router.post('/location/create', authController.isUserAdmin, locationController.location_create);

// GET request for one Location.
router.get('/location/:id', locationController.location_detail);

// PUT request for updating Location.
router.put('/location/:id/', authController.isUserAdmin, locationController.location_update);

// DELETE request for removing Location.
router.delete('/location/:id/', authController.isUserAdmin, locationController.location_delete);


// CASETYPE


// GET Casetype list
router.get('/casetypes', caseTypeController.caseType_list);

// POST request for creating Casetype.
router.post('/casetype/create',  authController.isUserAdmin, caseTypeController.caseType_create);

// GET request for one Casetype.
router.get('/casetype/:id', caseTypeController.caseType_detail);

// PUT request for updating Casetype.
router.put('/casetype/:id/',  authController.isUserAdmin, caseTypeController.caseType_update);

// DELETE request for removing Casetype.
router.delete('/casetype/:id/',  authController.isUserAdmin, caseTypeController.caseType_delete);


// CASESTATUS


// GET Casestatus list
router.get('/casestatuses', caseStatusController.caseStatus_list);

// POST request for creating Casestatus.
router.post('/casestatus/create', authController.isUserAdmin, caseStatusController.caseStatus_create);

// GET request for one Casestatus.
router.get('/casestatus/:id', caseStatusController.caseStatus_detail);

// PUT request for updating Casestatus.
router.put('/casestatus/:id/', authController.isUserAdmin, caseStatusController.caseStatus_update);

// DELETE request for removing Casestatus.
router.delete('/casestatus/:id/', authController.isUserAdmin, caseStatusController.caseStatus_delete);



module.exports = router;