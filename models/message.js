const Sequelize = require("sequelize");
const sequelize = require("../config/db.config");

const Message = sequelize.define(
  "message",
  {
    name: {
      type: Sequelize.STRING,
      required: true,
    },
    email: {
      type: Sequelize.STRING,
      required: true,
      unique: true,
    },
    mobileno: {
      type: Sequelize.STRING,
      required: true,
      unique: true,
    },
    otp: {
      type: Sequelize.INTEGER,
      required: false,
    },
    otpGenAt: {
      type: Sequelize.DATE,
      required: false,
    },
    verify: {
      type: Sequelize.BOOLEAN,
      defaultValue : false,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = Message;
