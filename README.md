# 简介
Nodcat 是 Node 端的类似 Dcat Admin 的后台开发框架。基于 Express + Amis 二次开发而成，只需很少的代码即可快速构建出一个功能完善的高颜值后台系统。支持一键生成 CURD 代码，开箱即用，让开发者告别冗杂的 HTML 代码。

# 开始
安装命令 demo 参数可修改为你的项目名，如果此命令无法连接到 github 请将 DNS 改为 8.8.8.8 再试。
```
curl -kv https://raw.githubusercontent.com/tmkook/nodcat/main/install.sh | bash -s demo
```

进入项目文件夹运行服务
```
node artisan
```
 
启动成功后即可访问
```
http://localhost:3000
```

# 访问后台
访问前需配置好 .env 文件的数据库然后执行迁移命令
```
node artisan db:up
```

访问初始账号 admin 密码 123456
```
http://localhost:3000/admin
```

# 查看命令
```
node artisan serve:list
```

# 路由规则
* GET      /admin/user/crud     page json
* GET      /admin/user          获取列表
* GET      /admin/user/1        获取ID为1的数据
* POST     /admin/user          新增或修改数据（body体必需包含id字段）
* DELETE   /admin/user?id=1,2,3  删除数据（豆号分隔为批量删除）

# express 文档
https://www.expressjs.com.cn/5x/api.html#express

# 模型ORM文档
https://sutando.org/zh_CN/guide/getting-started.html

# amis 文档
https://aisuda.bce.baidu.com/amis/zh-CN/docs/index