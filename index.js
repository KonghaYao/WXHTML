const fetch = require("node-fetch");
const fs = require("fs-extra");
fetch("https://rsshub.app/pixiv/ranking/week")
    .then((res) => res.text())
    .then((res) => {
        fs.writeFile("./dist/file.html", res);
        console.log(res);
        console.log("保存完成");
    });
