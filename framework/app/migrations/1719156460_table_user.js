const model = new (require('../models/user'));
module.exports = new class Migration {
    async up() {
        if (await model.getConnection().schema.hasTable(model.getTable())) return;
        await model.getConnection().schema.createTable(model.getTable(), table => {
            table.increments('id');
            table.string('avatar').nullable();
            table.string('username', 32).unique();
            table.string('nickname').nullable();
            table.string('password').nullable();
            table.tinyint('status').nullable().default(1);
            table.timestamps();
            table.timestamp('deleted_at').nullable();
        });
    }
    async down() {
        await model.getConnection().schema.dropTableIfExists(model.getTable());
    }
    async fake() {
        // await model.getConnection().table(model.getTable()).insert();
    }
    async seed() {
        // await model.getConnection().table(model.getTable()).insert();
    }
}