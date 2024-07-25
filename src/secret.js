const crypto = require("crypto-js");
/**
 * 安全加密
 */
module.exports = new class secure {
    crypto = crypto;

    /**
     * 生成雪花字符串
     * @param {integer} length 
     * @param {bool} isStrong 
     * @returns 
     */
    snow(length, isStrong) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        if (isStrong) {
            characters += './-&$@';
        }
        for (let i = 0; i < length; i++) {
            let randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    }

    /**
     * JWT 加密
     * @param {*} data 
     * @param {integer} exp 
     * @param {string} key 
     * @returns 
     */
    encrypt(data, exp, key) {
        let sign = JSON.stringify({ est: parseInt(((new Date).getTime()) / 1000), exp: exp, data: data });
        sign = crypto.enc.Base64url.stringify(crypto.enc.Utf8.parse(crypto.AES.encrypt(sign, key).toString()));
        return sign;
    }

    /**
     * JWT 解密
     * @param {string} sign 
     * @param {string} key 
     * @returns 
     */
    decrypt(sign, key) {
        if (sign && key) {
            try {
                sign = crypto.enc.Base64url.parse(sign).toString(crypto.enc.Utf8);
                let dec = crypto.AES.decrypt(sign, key).toString(crypto.enc.Utf8);
                if (dec) {
                    let ret = JSON.parse(dec);
                    if (ret.exp) {
                        let now = parseInt(((new Date).getTime()) / 1000);
                        return now - ret.est > ret.exp ? null : ret;
                    } else {
                        return ret;
                    }

                }
            } catch (e) {
                return null;
            }
        } else {
            return null;
        }
    }

    /**
     * MD5 签名
     * @param {json} query 
     * @param {string} key 
     * @returns 
     */
    sign(query, key) {
        let list = [];
        let keys = Object.keys(query).sort();
        for (let i in keys) {
            list.push(keys[i] + '=' + decodeURIComponent(query[keys[i]]));
        }
        let str = list.join('&');
        return crypto.MD5(str + '&' + key).toString();
    }

    /**
     * 验证签名
     * @param {json} query 
     * @param {string} key 
     * @param {integer} exp 
     * @returns 
     */
    issign(query, sign, key, exp) {
        let verf = this.sign(query, key);
        if (sign == verf) {
            if (exp > 0) {
                let now = parseInt(Date.now() / 1000);
                return now - query.ts < exp;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }
}