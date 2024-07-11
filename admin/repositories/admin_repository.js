const repository = require('../../src/repository');
const secret = require('../../src/secret');
const admin = require('../models/admin');

module.exports = class admin_repository extends repository {

    /**
     * 仓库所对应的模型
     * 如果有
     */
    model = admin.query();

    /**
    * 登录验证
    */
    async login(username, password) {
        let maxrisk = 5;
        let user = await this.model.where('status', 1).where('username', username).first();
        if (user) {
            //是否风控
            if (user.risked > maxrisk) {
                if ((Date.now() - user.updated_at.getTime()) / 1000 > 86400) {
                    user.risked = 0;
                    user.save();
                }
            }

            //登录成功
            if (user.risked < maxrisk && user.password == secret.crypto.MD5(password).toString()) {
                if (user.status == 1) {
                    user.risked = 0;
                    user.save();
                    let data = user.makeHidden(['updated_at', 'deleted_at', 'password', 'risked']).toData();
                    return Promise.resolve(data);
                } else {
                    return Promise.reject('the user has been disabled');
                }
            } else {
                user.risked += 1;
                user.save();
                if (user.risked > maxrisk) {
                    return Promise.reject('frequent login, disabled for 24 hours');
                } else {
                    return Promise.reject('login failed');
                }
            }
        }
        return Promise.reject('login failed');
    }

    /**
    * 修改资料
    */
    async profile(auth, oldpassword, newpassword, avatar, nickname) {
        let user = await this.model.where('id', auth.id).firstOrFail();
        if (oldpassword && newpassword) {
            if (newpassword.length < 5) {
                return Promise.reject('password invalid');
            } else if (oldpassword == newpassword) {
                return Promise.reject('new password invalid');
            } else if (secret.crypto.MD5(oldpassword).toString() != user.password) {
                return Promise.reject('old password invalid');
            }
            user.password = secret.crypto.MD5(newpassword).toString();
        }

        if (user.avatar != avatar) {
            user.avatar = avatar;
        }

        if (user.nickname != nickname) {
            user.nickname = nickname;
        }

        await user.save();
        let data = user.makeHidden(['updated_at', 'deleted_at', 'password', 'risked']).toData();
        return Promise.resolve(data);
    }
}
