/**
 * amis crud 脚手架，文档如下
 * https://aisuda.bce.baidu.com/amis/zh-CN/docs/index
 */
module.exports = class crud {
    api = null;
    schema = null;
    operation = [];
    prefix = 'admin';
    userinfo = { id: 0, nickname: "guest", roles: "" };
    permission = { get: false, post: false, delete: false };

    /**
     * 初始化
     * @param {object} req 
     */
    constructor(req) {
        this.api = (req.baseUrl || req.path).replace('/schema', '');
        if (req.auth) {
            if (req.auth.user) {
                this.userinfo = req.auth.user.data;
            }
            this.prefix = req.auth.options.prefix;
            this.permission.get = req.auth.can(this.api, 'get');
            this.permission.post = req.auth.can(this.api, 'post');
            this.permission.delete = req.auth.can(this.api, 'delete');
        }

        this.schema = {
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

    /**
     * 表格显示字段
     * https://aisuda.bce.baidu.com/amis/zh-CN/components/crud
     * @param {json} json 
     */
    show(json) {
        this.schema.columns = json;
        return this;
    }

    /**
     * 详情显示字段
     * https://aisuda.bce.baidu.com/amis/zh-CN/components/crud
     * @param {json} json 
    */
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

    /**
     * 创建表单字段
     * https://aisuda.bce.baidu.com/amis/zh-CN/components/form/index
     * @param {json} data 
    */
    create(data) {
        let json = [];
        for (let i in data) {
            if (data[i].name != 'id') {
                json.push(data[i]);
            }
        }
        this.schema.headerToolbar.push({
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

    /**
     * 修改表单字段
     * https://aisuda.bce.baidu.com/amis/zh-CN/components/form/index
     * @param {json} data 
    */
    update(data) {
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
                    "body": data
                }
            }
        });
        return this;
    }

    /**
     * 新增和修改字段
     * 也可以分开 create 和 update 单独定义
     * https://aisuda.bce.baidu.com/amis/zh-CN/components/form/index
     * @param {json} data 
    */
    createAndUpdate(json) {
        return this.create(json).update(json);
    }

    /**
     * 搜索字段
     * https://aisuda.bce.baidu.com/amis/zh-CN/components/form/index
     * @param {json} data 
     */
    filter(data) {
        this.schema.filter = {
            "title": "条件搜索",
            "body": [
                {
                    "type": "group",
                    "body": data
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
        for (let i in data) {
            query.push(data[i].name + '=${' + data[i].name + '}');
        }
        if (query.length > 0) {
            this.schema.api += '&' + query.join('&');
        }
        return this;
    }

    /**
     * 列表操作字段
     * @param {json} data 
     */
    operation(data) {
        for (let i in data) {
            this.operation.push(data[i]);
        }
    }

    /**
     * 返回 crud
     * @param {undefined|json} page
     */
    render(page) {
        if (!this.schema) {
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
            this.schema.columns.push({
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
                "body": [this.schema]
            }
        } else {
            page.body.push(this.schema);
            return page;
        }
    }

    /**
     * 将数据转为 amis options source 格式
     * @param {json|array} data 
     * @param {string} label 
     * @param {string} value 
     * @returns 
     */
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

    /**
     * 登录页
     * @returns json
     */
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

    /**
     * 后台页面
     * @returns json
     */
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