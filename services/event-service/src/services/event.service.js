// Event Service
const Event = require("../models/event.model");
const EventStatus = require("../models/event_status.model");

module.exports = {
  createEvent: async (eventData) => {
    if (!EventStatus.isValidStatus(eventData.status)) {
      throw new Error(`Invalid status: ${eventData.status}`);
    }

    return await Event.create(eventData);
  },

  getAllEvents: async (filters = {}) => {
    return await Event.findAll(filters);
  },

  getEventById: async (eventId) => {
    return await Event.findById(eventId);
  },

  updateEvent: async (eventId, updateData) => {
    // Validate status if provided
    if (updateData.status && !EventStatus.isValidStatus(updateData.status)) {
      throw new Error(`Invalid status: ${updateData.status}`);
    }

    return await Event.update(eventId, updateData);
  },

  deleteEvent: async (eventId) => {
    return await Event.delete(eventId);
  },
};

