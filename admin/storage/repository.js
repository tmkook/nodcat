const { repository, config } = require('nodcat');
const model = require('../models/__filename__');
module.exports = class __filename___repository extends repository {

    /**
     * 仓库模型
     */
    model = model.query();

    /**
     * 加密 ID 密钥
     * 如果不设置即不加密
     */
    safeid_key = config('app.id')

    /**
     * 加密 ID 有效期(秒)
     * 0 为永久有效
     */
    safeid_exp = 0;
}