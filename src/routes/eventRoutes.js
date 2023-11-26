// eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Create a new event
router.post('/create', eventController.createEvent);

// Get all events
router.get('/all', eventController.getAllEvents);

// Get event by ID
router.get('/:id', eventController.getEventById);

// Update event by ID
router.put('/update/:id', eventController.updateEventById);

// Delete event by ID
router.delete('/delete/:id', eventController.deleteEventById);

module.exports = router;
