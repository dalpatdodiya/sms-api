const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
     process.env.DB_NAME,
     process.env.DB_USER,
     process.env.DB_PASSWORD, {
     dialect: "postgres",
     port: 5432,
     host: process.env.DB_HOST,
     // dialectOptions: {
     //      ssl: {
     //           require: true,
     //           rejectUnauthorized: false
     //      }
     // },
     timezone: "+05:30"
})

module.exports = sequelize;