// eventService.js
const Event = require('../models/event');

// Create a new event
const createEvent = async (eventData) => {
  const event = new Event(eventData);
  return await event.save();
};

// Get all events
const getAllEvents = async (userId) => {
    const query = userId ? { participants: userId } : {};
  
    return await Event.find(query);
  };

// Get event by ID
const getEventById = async (eventId) => {
  return await Event.findById(eventId);
};

// Update event by ID
const updateEventById = async (eventId, eventData) => {
  return await Event.findByIdAndUpdate(eventId, eventData, { new: true });
};

// Delete event by ID
const deleteEventById = async (eventId) => {
  return await Event.findByIdAndDelete(eventId);
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEventById,
  deleteEventById,
};
