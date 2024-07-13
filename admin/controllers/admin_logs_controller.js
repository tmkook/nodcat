const controller = require('../../src/controller');
const crud = require('../../src/crud');
const fs = require('fs');
module.exports = class admin_logs_controller extends controller {
    crud(req, res) {
        let amis = new crud(res);
        amis.show([
            {
                "name": "id",
                "label": "ID",
                "sortable": true
            },
            {
                "name": "type",
                "label": "类别",
            },
            {
                "name": "content",
                "label": "日志",
            },
            {
                "type": "datetime",
                "name": "created_at",
                "label": "创建",
            }
        ]);

        //搜索字段
        amis.filter([
            {
                "type": "input-text",
                "name": "content",
                "label": "日志",
                "required": true
            }
        ]);

        amis.crud.headerToolbar.push({
            "type": "button",
            "label": "清除",
            "confirmText": "确定清除当前日志文件?",
            "actionType": "ajax",
            "api": "delete:" + req.admin_uri('/auth/logs') + "?id=clean",
        });

        res.success(amis.render());
    }

    getFiles() {
        let files = [];
        let dir = fs.readdirSync(process.cwd() + '/storage/logs/');
        for (let i in dir) {
            if (dir[i].indexOf('.log') > 0) {
                files.push(dir[i]);
            }
        }
        files.sort();
        return files;
    }

    //表格
    grid(req, res) {
        let logs = [];
        let total = 0;
        let files = this.getFiles();
        let page = parseInt(req.query.page ?? 1);
        let perpage = parseInt(req.query.perpage ?? 20);
        if (files.length) {
            let file = process.cwd() + '/storage/logs/' + files[0];
            let content = fs.readFileSync(file, 'utf-8').split("\r\n").reverse();
            let start = (page - 1) * perpage;
            let search = req.query.content;
            total = content.length;
            for (let o = start; o < start + perpage; o++) {
                if (content[o]) {
                    let row = content[o].match(new RegExp(/(\w+) \[(\d+\/\d+\/+\d+ \d+:\d+:\d+)\] (.*)/is));
                    let item = { id: o, type: row[1], content: row[3], created_at: row[2] };
                    if (search) {
                        if (item.content.indexOf(search) > -1) {
                            logs.push(item);
                        }
                    } else {
                        logs.push(item);
                    }
                }
            }
        }
        let data = {
            "items": logs,
            "total": total,
            "count": logs.length,
            "page": page,
            "perPage": perpage,
            "lastPage": Math.ceil(logs.length / perpage)
        }
        res.success(data);
    }

    delete(req, res) {
        let files = this.getFiles();
        if (files.length) {
            let file = process.cwd() + '/storage/logs/' + files[0];
            if (req.query.id == 'clean') {
                fs.rmSync(file);
            } else {
                let content = fs.readFileSync(file, 'utf-8').split("\r\n").reverse();
                let id = req.query.id.split(',');
                for (let i in id) {
                    content.splice(id[i], 1);
                }
                fs.writeFileSync(file, content.reverse().join("\r\n"));
            }
            res.success(file);
        } else {
            res.error('not found log file');
        }
    }
}
