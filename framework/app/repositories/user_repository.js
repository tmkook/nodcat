const { repository } = require('nodcat');
const user = require('../models/user');
module.exports = class user_repository extends repository {
    model = user.query();
}