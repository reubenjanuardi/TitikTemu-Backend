// User Model - Using Prisma ORM
// Do not instantiate directly. Use auth-service instead.
// Prisma schema is defined in prisma/schema.prisma

const prisma = require("../prisma");

module.exports = {
  // Create a new user
  create: async (userData) => {
    try {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          passwordHash: userData.passwordHash,
          role: userData.role || "PARTICIPANT",
        },
      });
      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  },

  // Find user by email
  findByEmail: async (email) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      return user;
    } catch (error) {
      throw new Error(`Failed to find user: ${error.message}`);
    }
  },

  // Find user by ID
  findById: async (id) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      return user;
    } catch (error) {
      throw new Error(`Failed to find user: ${error.message}`);
    }
  },

  // Update user
  update: async (id, updateData) => {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: updateData,
      });
      return user;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  },

  // Delete user
  delete: async (id) => {
    try {
      const user = await prisma.user.delete({
        where: { id },
      });
      return user;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  },

  // Find all users
  findAll: async () => {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
      throw new Error(`Failed to find users: ${error.message}`);
    }
  },
};

