const fetch = require("node-fetch");
const fs = require("fs");
const AV = require("leancloud-storage");
var crypto = require("crypto");

const websites = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
let hosts = JSON.parse(fs.readFileSync("./hosts.json", "utf-8"));
let apiKey = "kgxgevcziqw6p7vustmn9l1jyo4pgternvayg9in";

async function main() {
    console.log("登录成功");
    let promiseList = websites.map((i) => {
        return fetch(`https://api.rss2json.com/v1/api.json?order_by=pubDate&api_key=${apiKey}&count=100&rss_url=` + i.url.replace("${host}", hosts[0]))
            .then((res) => res.json())
            .then((content) => {
                console.log(i.name + "爬取完成");
                return rss2(content, { belongToChannels: i.belongToChannels });
            })
            .catch((err) => {
                console.log("error:" + i.name);
                console.log(err);
                return null;
            });
    });
    let Objs = await Promise.all(promiseList);
    return Objs.flat().filter((i) => i);
}
function rss2(result, { belongToChannels }) {
    return result.items.map((i) => {
        let { author, description, link, pubDate = new Date(), title, enclosure = [], category = [], thumbnail = "" } = i;
        let UserID = "60135d5ebabf3847ced4559c";
        return {
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
        };
    });
}

module.exports = main;
