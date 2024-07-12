const { repository } = require('nodcat');
const model = require('../models/user');
module.exports = class user_repository extends repository {
    model = model.query();
}