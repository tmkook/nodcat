"use strict";
const { Model, SoftDeletes, compose } = require('sutando');
module.exports = class admin extends compose(Model, SoftDeletes) {
    dateFormat = 'X'
    table = 'admin_users'
    connection = 'master';
}
