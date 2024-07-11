"use strict";
const crypto = require("crypto-js");
module.exports = new class secure {
    crypto = crypto;

    //rand str
    snow(length, isStrong, isBase64) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        if (isStrong) {
            characters += '~`!@#$%^&*()_-=+[{]}|;:,<.>/?';
        }
        for (let i = 0; i < length; i++) {
            let randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        if (isBase64) {
            result = btoa(result);
        }
        return result;
    }

    //jwt encode
    encrypt(data, exp, key) {
        let str = JSON.stringify({ est: parseInt(((new Date).getTime()) / 1000), exp: exp, data: data });
        return encodeURIComponent(btoa(crypto.AES.encrypt(str, key).toString()));
    }

    //jwt decode
    decrypt(sign, key) {
        if (sign && key) {
            let dec = crypto.AES.decrypt(atob(decodeURIComponent(sign)), key).toString(crypto.enc.Utf8);
            if (dec) {
                try {
                    let ret = JSON.parse(dec);
                    if (ret.exp) {
                        let now = parseInt(((new Date).getTime()) / 1000);
                        return now - ret.est > ret.exp ? null : ret;
                    } else {
                        return ret;
                    }
                } catch (e) {
                    return null;
                }
            }
        } else {
            return null;
        }
    }

    //sign
    sign(query, key) {
        let list = [];
        if (!query.ts) {
            query.ts = parseInt((new Date).getTime() / 1000);
        }
        if (query.sign) {
            delete query.sign;
        }
        let keys = Object.keys(query).sort();
        for (let i in keys) {
            list.push(keys[i] + '=' + decodeURIComponent(query[keys[i]]));
        }
        let str = list.join('&');
        query.sign = crypto.MD5(str + '&' + key).toString();
        return query;
    }

    issign(query, key) {
        let sign = query.sign;
        return sign == this.sign(query, key);
    }
}