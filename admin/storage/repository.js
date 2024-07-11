const { repository } = require('nodcat');
const model = require('../models/__filename__');
module.exports = class __filename___repository extends repository {
    model = model.query();
}