const { controller } = require('nodcat');
module.exports = class welcome_controller extends controller {
    menus(req, res) {
        let isAdmin = req.auth && req.auth.isRole('admin');
        this.success({
            "pages": [
                {
                    "label": "系统",
                    "redirect": "dashboard",
                    "children": [
                        {
                            "icon": "fa fa-dashboard",
                            "label": "仪表板",
                            "url": "/",
                            "schemaApi": req.admin_uri('/auth/user/dashboard'),
                        },
                        {
                            "label": "管理员",
                            "icon": "fa fa-bars",
                            "visible": isAdmin,
                            "children": [
                                {
                                    "label": "账号管理",
                                    "url": "admin-auth",
                                    "schemaApi": req.admin_uri('/auth/user/crud'),
                                },
                                {
                                    "label": "系统日志",
                                    "url": "admin-log",
                                    "schemaApi": req.admin_uri('/auth/logs/crud')
                                },
                                {
                                    "label": "代码生成",
                                    "url": "admin-code",
                                    "schemaApi": req.admin_uri('/auth/code/crud')
                                }
                            ],
                        },
                    ]
                }
            ]
        });
    }

    dashboard(req, res) {
        this.success({
            "type": "page",
            "body": {
                "type": "chart",
                "data": {
                    "line": [65, 63, 10, 73, 42, 21]
                },
                "config": {
                    "xAxis": {
                        "type": "category",
                        "data": [
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat"
                        ]
                    },
                    "yAxis": {
                        "type": "value"
                    },
                    "series": [
                        {
                            "data": "${line || []}",
                            "type": "line"
                        }
                    ]
                }
            }
        });
    }
}