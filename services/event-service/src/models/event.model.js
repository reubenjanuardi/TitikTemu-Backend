// Event Model - Using Prisma ORM
// Do not instantiate directly. Use event-service instead.
// Prisma schema is defined in prisma/schema.prisma

const prisma = require("../prisma");

module.exports = {
  // Create a new event
  create: async (eventData) => {
    try {
      const event = await prisma.event.create({
        data: {
          title: eventData.title,
          description: eventData.description || null,
          startTime: new Date(eventData.startTime),
          endTime: new Date(eventData.endTime),
          status: eventData.status || "DRAFT",
        },
      });
      return event;
    } catch (error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }
  },

  // Find event by ID
  findById: async (id) => {
    try {
      const event = await prisma.event.findUnique({
        where: { id },
      });
      return event;
    } catch (error) {
      throw new Error(`Failed to find event: ${error.message}`);
    }
  },

  // Get all events
  findAll: async (filters = {}) => {
    try {
      const where = {};
      if (filters.status) where.status = filters.status;

      const events = await prisma.event.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
      return events;
    } catch (error) {
      throw new Error(`Failed to find events: ${error.message}`);
    }
  },

  // Update event
  update: async (id, updateData) => {
    try {
      const event = await prisma.event.update({
        where: { id },
        data: updateData,
      });
      return event;
    } catch (error) {
      throw new Error(`Failed to update event: ${error.message}`);
    }
  },

  // Delete event
  delete: async (id) => {
    try {
      const event = await prisma.event.delete({
        where: { id },
      });
      return event;
    } catch (error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    }
  },
};

