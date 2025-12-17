// Attendance Controller
const attendanceService = require("../services/attendance.service");

module.exports = {
  recordAttendance: async (req, res) => {
    try {
      const { eventId, userId, checkInTime } = req.body;

      if (!eventId || !userId || !checkInTime) {
        return res.status(400).json({
          message: "eventId, userId, and checkInTime are required",
        });
      }

      const result = await attendanceService.recordAttendance({
        eventId,
        userId,
        checkInTime,
      });

      return res
        .status(201)
        .json({ message: "Attendance recorded successfully", data: result });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  getAttendance: async (req, res) => {
    try {
      const { eventId } = req.params;

      if (!eventId) {
        return res.status(400).json({ message: "eventId is required" });
      }

      const result = await attendanceService.getAttendanceByEvent(eventId);
      return res.status(200).json({ data: result });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  getAttendanceStats: async (req, res) => {
    try {
      const { eventId } = req.params;

      if (!eventId) {
        return res.status(400).json({ message: "eventId is required" });
      }

      const result = await attendanceService.getAttendanceStats(eventId);
      return res.status(200).json({ data: result });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

