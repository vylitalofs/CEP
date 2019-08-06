var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController'); 
var caseController = require('../controllers/caseController'); 
var locationController = require('../controllers/locationController'); 
var caseTypeController = require('../controllers/caseTypeController'); 
var caseStatusController = require('../controllers/caseStatusController'); 


// USER


// GET User list
router.get('/api/users', userController.user_list);

// POST request for creating User.
router.post('/api/user/create', userController.user_create);

// GET request for one User.
router.get('/api/user/:id', userController.user_detail);

// PUT request for updating User.
router.put('/api/user/:id/', userController.user_update);

// DELETE request for removing User.
router.delete('/api/user/:id/', userController.user_delete);


// CASE


// GET Case list
router.get('/api/cases', caseController.case_list);

// POST request for creating Case.
router.post('/api/case/create', caseController.case_create);

// GET request for one Case.
router.get('/api/case/:id', caseController.case_detail);

// PUT request for updating Case.
router.put('/api/case/:id/', caseController.case_update);

// DELETE request for removing Case.
router.delete('/api/case/:id/', caseController.case_delete);


// LOCATION


// GET Location list
router.get('/api/locations', locationController.location_list);

// POST request for creating Location.
router.post('/api/location/create', locationController.location_create);

// GET request for one Location.
router.get('/api/location/:id', locationController.location_detail);

// PUT request for updating Location.
router.put('/api/location/:id/', locationController.location_update);

// DELETE request for removing Location.
router.delete('/api/location/:id/', locationController.location_delete);


// CASETYPE


// GET Casetype list
router.get('/api/casetypes', caseTypeController.caseType_list);

// POST request for creating Casetype.
router.post('/api/casetype/create', caseTypeController.caseType_create);

// GET request for one Casetype.
router.get('/api/casetype/:id', caseTypeController.caseType_detail);

// PUT request for updating Casetype.
router.put('/api/casetype/:id/', caseTypeController.caseType_update);

// DELETE request for removing Casetype.
router.delete('/api/casetype/:id/', caseTypeController.caseType_delete);


// CASESTATUS


// GET Casestatus list
router.get('/api/casestatuses', caseStatusController.caseStatus_list);

// POST request for creating Casestatus.
router.post('/api/casestatus/create', caseStatusController.caseStatus_create);

// GET request for one Casestatus.
router.get('/api/casestatus/:id', caseStatusController.caseStatus_detail);

// PUT request for updating Casestatus.
router.put('/api/casestatus/:id/', caseStatusController.caseStatus_update);

// DELETE request for removing Casestatus.
router.delete('/api/casestatus/:id/', caseStatusController.caseStatus_delete);



module.exports = router;