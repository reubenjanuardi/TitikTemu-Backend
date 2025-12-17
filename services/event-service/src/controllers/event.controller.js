// Event Controller
const eventService = require("../services/event.service");

module.exports = {
  createEvent: async (req, res) => {
    try {
      const { title, description, startTime, endTime, status } = req.body;

      if (!title || !startTime || !endTime) {
        return res.status(400).json({
          message: "Title, startTime, and endTime are required",
        });
      }

      const result = await eventService.createEvent({
        title,
        description,
        startTime,
        endTime,
        status,
      });
      return res
        .status(201)
        .json({ message: "Event created successfully", data: result });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  getEvents: async (req, res) => {
    try {
      const filters = {};
      if (req.query.status) filters.status = req.query.status;

      const result = await eventService.getAllEvents(filters);
      return res.status(200).json({ data: result });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  getEventById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await eventService.getEventById(id);

      if (!result) {
        return res.status(404).json({ message: "Event not found" });
      }

      return res.status(200).json({ data: result });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  updateEvent: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const result = await eventService.updateEvent(id, updateData);
      return res
        .status(200)
        .json({ message: "Event updated successfully", data: result });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  deleteEvent: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await eventService.deleteEvent(id);

      return res
        .status(200)
        .json({ message: "Event deleted successfully", data: result });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

