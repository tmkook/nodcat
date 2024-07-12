#!/bin/bash

mkdir $1
cd $1

cat>artisan<<EOF
const app = require("nodcat");
app.cmd(app.config, app.logger);
EOF

cat>package.json<<EOF
{
  "name": "$1",
  "version": "1.0.0",
  "main": "artisan",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "nodcat": "github:tmkook/nodcat"
  }
}
EOF

npm install

node artisan serve:install

echo "done!"