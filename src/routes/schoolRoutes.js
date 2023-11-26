const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController')

router.get('/all', schoolController.getAll);

module.exports = router;
