const db = require("../database");
const Sequelize = require("sequelize");

const Book = db.define("book", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  genre: {
    type: Sequelize.STRING,
  },
});

module.exports = Book;
