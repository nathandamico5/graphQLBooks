const db = require("../database");
const Sequelize = require("sequelize");

const Author = db.define("author", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  age: {
    type: Sequelize.INTEGER,
    validate: {
      min: 0,
      max: 120,
    },
  },
});

module.exports = Author;
