const Sequelize = require("sequelize");
const db = require("../database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const SALT_ROUNDS = 5;

const User = db.define("user", {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

User.prototype.correctPassword = function (candidatePwd) {
  console.log(candidatePwd, this.password);
  return bcrypt.compare(candidatePwd, this.password);
};

User.prototype.generateToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT, {
    expiresIn: "2h",
  });
};

User.authenticate = async function ({ username, password }) {
  console.log("authenticating");
  const user = await this.findOne({ where: { username } });
  // console.log(await user.correctPassword(password));
  if (!user || !(await user.correctPassword(password))) {
    console.log("In Here");
    const error = Error("Incorrect username/password");
    error.status = 401;
    throw error;
  }
  // console.log("Authenticated: ", user.id);
  // console.log(process.env.JWT);
  // console.log(user.generateToken());
  return {
    userId: user.id,
    token: user.generateToken(),
  };
};

User.findByToken = async function (token) {
  try {
    const { id } = await jwt.verify(token, process.env.JWT);
    const user = User.findByPk(id);
    if (!user) {
      throw "No User Signed In";
    }
    return user;
  } catch (ex) {
    const error = Error("bad token");
    error.status = 401;
    throw error;
  }
};

User.beforeSave(async function (user) {
  user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
});

module.exports = User;
