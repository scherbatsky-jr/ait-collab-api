// eventController.js
const eventService = require('../services/eventService');

// Create a new event
const createEvent = async (req, res) => {
    const userId = req.user.userId
  try {
    const eventData = req.body;
    eventData.createdBy = userId
    eventData.createdAt = new Date()
    const event = await eventService.createEvent(eventData);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all events
const getAllEvents = async (req, res) => {
  const userId = req.user.userId
  try {
    const events = await eventService.getAllEvents(userId);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await eventService.getEventById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update event by ID
const updateEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const eventData = req.body;
    const updatedEvent = await eventService.updateEventById(eventId, eventData);
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete event by ID
const deleteEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const deletedEvent = await eventService.deleteEventById(eventId);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEventById,
  deleteEventById,
};
