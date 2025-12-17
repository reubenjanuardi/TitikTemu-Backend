// Attendance Service
const Attendance = require("../models/attendance.model");

module.exports = {
  recordAttendance: async (attendanceData) => {
    // Check if user already checked in for this event
    const exists = await Attendance.exists(
      attendanceData.eventId,
      attendanceData.userId
    );

    if (exists) {
      throw new Error("User has already checked in for this event");
    }

    return await Attendance.create(attendanceData);
  },

  getAttendanceByEvent: async (eventId) => {
    return await Attendance.findByEventId(eventId);
  },

  getAttendanceStats: async (eventId) => {
    return await Attendance.getStatsByEventId(eventId);
  },

  getAttendanceByUser: async (userId) => {
    return await Attendance.findByUserId(userId);
  },
};

