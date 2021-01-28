const fetch = require("node-fetch");
const fs = require("fs-extra");
fetch("https://www.baidu.com")
    .then((res) => res.text())
    .then((res) => {
        fs.writeFile("./dist/file.html", res);
        console.log("保存完成");
    });
