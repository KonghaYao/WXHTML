const fetch = require("node-fetch");
const fs = require("fs");
const AV = require("leancloud-storage");
var crypto = require("crypto");

AV.init({
    appId: "0ER6ub3jKGsff0bDnvcE3InS-gzGzoHsz",
    appKey: "U017BnxwoBNCxk0ls4Rxyzhl",
    serverURL: "https://0er6ub3j.lc-cn-n1-shared.com/",
});
// 获取配置文件
var [, , username, password] = process.argv;
const websites = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
let hosts = JSON.parse(fs.readFileSync("./hosts.json", "utf-8"));
let apiKey = "kgxgevcziqw6p7vustmn9l1jyo4pgternvayg9in";
// 登录并开始爬虫
AV.User.logIn(username, password).then(
    async function () {
        console.log("登录成功");
        let promiseList = websites.map((i) => {
            return fetch(`https://api.rss2json.com/v1/api.json?order_by=pubDate&api_key=${apiKey}&count=100&rss_url=` + i.url.replace("${host}", hosts[0]))
                .then((res) => res.text())
                .then((content) => {
                    console.log(i.name + "爬取完成");
                    return rss2(JSON.parse(content), { belongToChannels: i.belongToChannels });
                })
                .catch((err) => {
                    console.log("error:" + i.name);
                    console.log(err);
                    return null;
                });
        });
        let Objs = await Promise.all(promiseList);
        AV.Object.saveAll(Objs.flat().filter((i) => i)).then((result) => {
            console.log("上传完成");
        });
    },
    function (error) {
        console.log(error);
        return false;
    }
);

function rss2(result, { belongToChannels }) {
    return result.items.map((i) => {
        let { author, description, link, pubDate = new Date(), title, enclosure, category = [], thumbnail = "" } = i;
        let UserID = "60135d5ebabf3847ced4559c";
        return Creator("Articles", {
            author: new AV.Object.createWithoutData("User", UserID), //默认用户
            authorName: author, //创作者的名字
            content: description,
            link,
            category,
            belongToChannels: [belongToChannels],
            pubDate: new Date(pubDate),
            title,
            enclosure,
            BackgroundImg: thumbnail,
            description: description.slice(0, 100),
            isADraft: false,
            decodeType: "html",
            from: "RSS",
            MarkID: crypto.createHash("md5").update(`${UserID}/${title}/${link}`).digest("hex"),
        });
    });
}

function Creator(where, what) {
    //创建一个数据库对象实例
    const Pos = AV.Object.extend(where);
    const pos = new Pos();
    Object.entries(what).forEach(([key, val]) => {
        pos.set(key, val);
    });
    // 将对象返回
    return pos;
}
