"use strict";
const { Model, SoftDeletes, compose } = require('sutando');
module.exports = class baseModel extends compose(Model, SoftDeletes) {
    connection = 'master';
    scopeOfAdmin(query, admin) {
        return query.where('admin_id', admin.id);
    }
}
