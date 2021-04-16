const db = require("./database");
const Book = require("./models/Book");
const Author = require("./models/Author");
const User = require("./models/User");

Author.hasMany(Book);
Book.belongsTo(Author);

module.exports = {
  db,
  Book,
  Author,
  User,
};
