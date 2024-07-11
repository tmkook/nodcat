# Nodcat
Nodcat 是 Node 端的类似 Dcat Admin 的后台开发框架。基于 Express + Amis 二次开发而成，只需很少的代码即可快速构建出一个功能完善的高颜值后台系统。支持一键生成 CURD 代码，开箱即用，让开发者告别冗杂的 HTML 代码。

# Start
```
// 安装依赖
npm install git@github.com:tmkook/nodcat.git

// vi artisan 生成 cli 文件 
const app = require("nodcat);
app.cli();

// 执行安装命令
node artisan serve:install

// 运行服务
node artisan serve:run
```

# Admin
```
// 执行迁移文件创建表结构
node artisan db:migrate

// 执行迁移文件写入初始数据
node artisan db:seed

// 访问后台，初始账号 admin 密码 123456
http://localhost:3000/admin
```

# Resetfull 路由规则
* GET      /admin/user          获取列表
* GET      /admin/user/1        获取ID为1的数据
* POST     /admin/user          新增或修改数据（body体必需包含id字段）
* DELETE   admin/user?id=1,2,3  删除数据（豆号分隔为批量删除）


# 查看命令
```
node artisan list
```

# express 文档
https://www.expressjs.com.cn/5x/api.html#express

# 模型ORM文档
https://sutando.org/zh_CN/guide/getting-started.html

# amis 文档
https://aisuda.bce.baidu.com/amis/zh-CN/docs/index