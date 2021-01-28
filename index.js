const fetch = require("node-fetch");
const AV = require("leancloud-storage");
AV.init({
    appId: "0ER6ub3jKGsff0bDnvcE3InS-gzGzoHsz",
    appKey: "U017BnxwoBNCxk0ls4Rxyzhl",
    serverURL: "https://0er6ub3j.lc-cn-n1-shared.com/",
});
const websites = [
    {
        name: "P站",
        url: "https://rsshub.app/pixiv/ranking/week",
    },
];
websites.forEach((i) => {
    fetch(i.url)
        .then((res) => res.text())
        .then((content) => {
            const RSS = AV.Object.extend("RSS");
            const todo = new RSS();
            todo.set("name", i.name);
            todo.set("fromWebsite", i.url);
            todo.set("content", content);
            // 将对象保存到云端
            todo.save().then(
                (todo) => {
                    // 成功保存之后，执行其他逻辑
                    console.log(`保存成功。objectId：${todo.id}`);
                },
                (error) => {
                    console.log("错误");
                }
            );
            console.log("保存完成");
        });
});
