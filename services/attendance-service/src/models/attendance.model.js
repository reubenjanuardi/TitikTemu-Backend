// Attendance Model - Using Prisma ORM
// Do not instantiate directly. Use attendance-service instead.
// Prisma schema is defined in prisma/schema.prisma

const prisma = require("../prisma");

module.exports = {
  // Record attendance (check-in)
  create: async (attendanceData) => {
    try {
      const attendance = await prisma.attendance.create({
        data: {
          eventId: attendanceData.eventId,
          userId: attendanceData.userId,
          checkInTime: new Date(attendanceData.checkInTime),
        },
      });
      return attendance;
    } catch (error) {
      throw new Error(`Failed to record attendance: ${error.message}`);
    }
  },

  // Find attendance record by ID
  findById: async (id) => {
    try {
      const attendance = await prisma.attendance.findUnique({
        where: { id },
      });
      return attendance;
    } catch (error) {
      throw new Error(`Failed to find attendance: ${error.message}`);
    }
  },

  // Get attendance records by event ID
  findByEventId: async (eventId) => {
    try {
      const records = await prisma.attendance.findMany({
        where: { eventId },
        orderBy: { checkInTime: "asc" },
      });
      return records;
    } catch (error) {
      throw new Error(`Failed to find attendance records: ${error.message}`);
    }
  },

  // Get attendance records by user ID
  findByUserId: async (userId) => {
    try {
      const records = await prisma.attendance.findMany({
        where: { userId },
        orderBy: { checkInTime: "desc" },
      });
      return records;
    } catch (error) {
      throw new Error(`Failed to find user attendance: ${error.message}`);
    }
  },

  // Check if user already checked in for an event
  exists: async (eventId, userId) => {
    try {
      const record = await prisma.attendance.findFirst({
        where: { eventId, userId },
      });
      return !!record;
    } catch (error) {
      throw new Error(`Failed to check attendance: ${error.message}`);
    }
  },

  // Get attendance statistics for an event
  getStatsByEventId: async (eventId) => {
    try {
      const count = await prisma.attendance.count({
        where: { eventId },
      });
      return { eventId, totalAttendees: count };
    } catch (error) {
      throw new Error(`Failed to get attendance stats: ${error.message}`);
    }
  },

  // Delete attendance record
  delete: async (id) => {
    try {
      const attendance = await prisma.attendance.delete({
        where: { id },
      });
      return attendance;
    } catch (error) {
      throw new Error(`Failed to delete attendance: ${error.message}`);
    }
  },
};

