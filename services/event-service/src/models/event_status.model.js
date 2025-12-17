// Event Status Model
// This model contains status constants used throughout the event service
// Foreign key constraints to other schemas are intentionally NOT created
// to maintain microservice isolation

module.exports = {
  STATUS: {
    DRAFT: "DRAFT",
    PUBLISHED: "PUBLISHED",
    ONGOING: "ONGOING",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
  },

  isValidStatus: (status) => {
    const validStatuses = Object.values(module.exports.STATUS);
    return validStatuses.includes(status);
  },
};

