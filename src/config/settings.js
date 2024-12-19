const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    SECRET: process.env.JWT_SECRET || 'secrettoken',
}
