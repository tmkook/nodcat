const model = new (require('../models/__filename__'));
module.exports = new class migration {
    async up() {
        if (await model.getConnection().schema.hasTable(model.getTable())) return;
        await model.getConnection().schema.createTable(model.getTable(), table => {
            table.increments('id');
            table.timestamps();
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
