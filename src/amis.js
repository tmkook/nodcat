"use strict";
module.exports = class Amis {
    api = null;
    crud = null;
    operation = [];
    prefix = 'admin';
    userinfo = { id: 0, nickname: "guest", roles: "" };
    permission = { get: false, post: false, delete: false };

    constructor(req) {
        this.api = (req.baseUrl || req.path).replace('/crud', '');
        if (req.auth) {
            if (req.auth.user) {
                this.userinfo = req.auth.user.data;
            }
            this.prefix = req.auth.options.prefix;
            this.permission.get = req.auth.can(this.api, 'get');
            this.permission.post = req.auth.can(this.api, 'post');
            this.permission.delete = req.auth.can(this.api, 'delete');
        }

        this.crud = {
            "type": "crud",
            "perPage": 20,
            "syncLocation": false,
            "filterTogglable": true,
            "filterDefaultVisible": false,
            "placeholder": "暂无数据",
            "api": this.api + '?page=${page}&perpage=${perPage}',
            "footerToolbar": [
                "statistics",
                "switch-per-page",
                "pagination"
            ],
            "headerToolbar": [
                "bulkActions",
                "filter-toggler",
            ],
            "bulkActions": [
                {
                    "label": "批量删除",
                    "confirmText": "确定要批量删除?",
                    "actionType": "ajax",
                    "api": "delete:" + this.api + "?id=${ids}",
                    "visible": this.permission.delete,
                }
            ]
        }
    }

    show(json) {
        this.crud.columns = json;
        return this;
    }

    detail(json) {
        this.operation.push({
            "type": "button",
            "label": "详情",
            "actionType": "dialog",
            "visible": this.permission.get,
            "dialog": {
                "title": "查看",
                "body": {
                    "type": "form",
                    "initApi": "get:" + this.api + "/${id}",
                    "body": json
                }
            }
        });
        return this;
    }

    create(data) {
        let json = [];
        for (let i in data) {
            if (data[i].name != 'id') {
                json.push(data[i]);
            }
        }
        this.crud.headerToolbar.push({
            "type": "button",
            "label": "新建",
            "level": "primary",
            "icon": "fa fa-add",
            "actionType": "dialog",
            "visible": this.permission.post,
            "dialog": {
                "title": "新建",
                "body": {
                    "type": "form",
                    "api": this.api,
                    "body": json
                }
            }
        });
        return this;
    }

    update(json) {
        this.operation.push({
            "type": "button",
            "label": "修改",
            "actionType": "dialog",
            "visible": this.permission.post,
            "dialog": {
                "title": "修改",
                "body": {
                    "type": "form",
                    "api": this.api,
                    "body": json
                }
            }
        });
        return this;
    }

    createAndUpdate(json) {
        return this.create(json).update(json);
    }

    filter(json) {
        this.crud.filter = {
            "title": "条件搜索",
            "body": [
                {
                    "type": "group",
                    "body": json
                }
            ],
            "actions": [
                {
                    "type": "reset",
                    "label": "重置"
                },
                {
                    "type": "submit",
                    "level": "primary",
                    "label": "搜索"
                }
            ]
        };
        let query = [];
        for (let i in json) {
            query.push(json[i].name + '=${' + json[i].name + '}');
        }
        if (query.length > 0) {
            this.crud.api += '&' + query.join('&');
        }
        return this;
    }

    operation(json) {
        for (let i in json) {
            this.operation.push(json[i]);
        }
    }

    render(page) {
        if (!this.crud) {
            throw Error('Please set up the API first');
        }
        if (this.operation.length > 0) {
            this.operation.push({
                "type": "button",
                "label": "删除",
                "visible": this.permission.delete,
                "actionType": "ajax",
                "confirmText": "确认删除?",
                "api": "delete:" + this.api + "?id=$id"
            });
            this.crud.columns.push({
                "type": "operation",
                "label": "操作",
                "align": "right",
                "width": 50,
                "buttons": [{
                    "type": "dropdown-button",
                    "icon": "fa fa-ellipsis-h",
                    "level": "link",
                    "hideCaret": true,
                    "buttons": this.operation
                }]
            });
        }
        if (!page) {
            return {
                "type": "page",
                "title": "",
                "body": [this.crud]
            }
        } else {
            page.body.push(this.crud);
            return page;
        }
    }

    makeOptions(data, label, value) {
        let options = [];
        if (label && value) {
            for (let i in data) {
                options.push({ label: data[i][label], value: data[i][value] });
            }
        } else {
            if (data[0]) {
                for (let key in data) {
                    options.push({ label: data[key], value: data[key] });
                }
            } else {
                for (let key in data) {
                    options.push({ label: data[key], value: key });
                }
            }
        }
        return options;
    }

    getLogin() {
        return {
            "type": "page",
            "style": {
                "backgroundImage": "linear-gradient(180deg, #86a4e9, transparent)"
            },
            "cssVars": {
                "--Form-input-onFocused-borderColor": "#e8e9eb",
                "--Form-input-onHover-borderColor": "#e8e9eb",
            },
            "body": {
                "type": "grid-2d",
                "cols": 12,
                "grids": [{
                    "x": 5,
                    "y": 5,
                    "h": 1,
                    "w": 4,
                    "width": 200,
                    "type": 'form',
                    "title": "",
                    "mode": 'horizontal',
                    "panelClassName": "p-r p-l p-b-md",
                    "api": '/' + this.prefix + '/auth/login',
                    "redirect": "/" + this.prefix,
                    "body": [{
                        "type": "tpl",
                        "tpl": "<div><p>登录</p></div>"
                    },
                    {
                        "type": "input-text",
                        "label": false,
                        "name": "username",
                        "size": "full",
                        "placeholder": "账号",
                        "addOn": {
                            "label": "",
                            "type": "text",
                            "position": "left",
                            "icon": "fa fa-user"
                        },
                    },
                    {
                        "type": "input-password",
                        "label": false,
                        "name": "password",
                        "size": "full",
                        "placeholder": "密码",
                        "addOn": {
                            "label": "",
                            "type": "text",
                            "position": "left",
                            "icon": "fa fa-lock"
                        },
                    },
                    {
                        "type": "checkbox",
                        "label": false,
                        "name": "remember",
                        "option": "记住密码"
                    },
                    {
                        "type": "control",
                        "label": false,
                        "body": {
                            "type": "button",
                            "level": "primary",
                            "actionType": "submit",
                            "block": true,
                            "label": "登录"
                        }
                    }
                    ]
                }
                ]
            }
        };
    }

    getAdmin() {
        return {
            "type": "app",
            "brandName": "Admin",
            "logo": '/favicon.ico',
            "api": '/' + this.prefix + '/auth/user/menus',
            "header": {
                "type": "grid",
                "columns": [
                    {
                        "md": 6,
                        "body": ""
                    },
                    {
                        "md": 6,
                        "body": {
                            "type": "flex",
                            "justify": "flex-end",
                            "items": [
                                {
                                    "type": "button",
                                    "icon": "fa fa-sync",
                                    "onClick": "window.location.reload()",
                                },
                                {
                                    "type": "button",
                                    "icon": "fa fa-moon",
                                },
                                {
                                    "icon": "fa fa-user-circle",
                                    "type": "dropdown-button",
                                    "label": this.userinfo.nickname,
                                    "buttons": [
                                        {
                                            "type": "button",
                                            "label": "个人设置",
                                            "actionType": "dialog",
                                            "dialog": {
                                                "title": "个人设置",
                                                "body": {
                                                    "type": "form",
                                                    "api": '/' + this.prefix + '/system/reset',
                                                    "body": [
                                                        {
                                                            "type": "input-text",
                                                            "name": "nickname",
                                                            "label": "用户昵称",
                                                            "value": this.userinfo.nickname,
                                                            "required": true
                                                        },
                                                        {
                                                            "type": "input-password",
                                                            "name": "oldpassword",
                                                            "label": "验证原密码",
                                                        },
                                                        {
                                                            "type": "input-password",
                                                            "name": "newpassword",
                                                            "label": "设置新密码",
                                                        },
                                                        {
                                                            "type": "input-password",
                                                            "name": "repassword",
                                                            "label": "确定新密码",
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            "type": "button",
                                            "label": "退出登录",
                                            "onClick": "window.location.href='/" + this.prefix + "/auth/logout'"
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                ]
            },
        }
    }
}