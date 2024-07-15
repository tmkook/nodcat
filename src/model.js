const { Model, SoftDeletes, compose } = require('sutando');
module.exports = class baseModel extends compose(Model, SoftDeletes) {
    connection = 'master';
}
