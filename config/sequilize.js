const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT,
    }
);

sequelize.authenticate()
    .then(() => {
        console.log('Database Connected');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


module.exports = {sequelize};