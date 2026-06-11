const sequelize = require("../config/database");
const User = require("./User");
const Task = require("./Task");

// Definisi Relasi
User.hasMany(Task, { 
  foreignKey: "userId",
  as: "tasks" // Alias untuk pemanggilan query include
});

Task.belongsTo(User, { 
  foreignKey: "userId",
  as: "user" // Alias untuk pemanggilan query include
});

module.exports = {
  sequelize,
  User,
  Task,
};
