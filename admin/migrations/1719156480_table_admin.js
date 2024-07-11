const model = new (require('../models/admin'));
module.exports = new class migration {
    async up() {
        if (await model.getConnection().schema.hasTable(model.getTable())) return;
        await model.getConnection().schema.createTable(model.getTable(), table => {
            table.increments('id');
            table.string('avatar').nullable();
            table.string('username', 32).unique();
            table.string('nickname').nullable();
            table.string('password').nullable();
            table.string('roles').nullable();
            table.tinyint('risked').nullable().default(0); //登录风控次数，登录失败5次以上禁止24小时
            table.tinyint('status').nullable().default(1); //账号状态，禁用将不允许登录
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
        await model.getConnection().table(model.getTable()).insert([
            { username: "admin", nickname: "Admin", password: global.app.crypto.MD5('123456').toString(), created_at: '2024-05-20 13:14:20', roles: "admin", updated_at: '2024-6-20 13:14:20' },
        ]);
    }
}