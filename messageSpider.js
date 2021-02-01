const fetch = require("node-fetch");
var crypto = require("crypto");
var UserID = "60135d5ebabf3847ced4559c";
var belongToChannels = "60174eefbabf3847ced92211";
const saveMessage = require("./index.js");
//米游社爬虫
const puppeteer = require("puppeteer");

module.exports = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let res = await fetch("https://bbs-api.mihoyo.com/post/wapi/userPost?gids=2&size=10&uid=75276557")
        .then((res) => res.json())
        .then(async (res) => {
            if (res.message === "OK" && res.data.list.length) {
                let PromiseList = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    try {
                        let author = res.data.list[i].User.nickname;
                        let title = res.data.list[i].post.subject;
                        let BackgroundImg = res.data.list[i].post.image;
                        let pubDate = res.data.list[i].post.created_at;
                        let link = "https://bbs.mihoyo.com/ys/article/" + res.data.list[i]["post_id"];

                        await page.goto(link, { waitUntil: "networkidle2" });
                        console.log("转向");

                        let description = await page.$eval(".mhy-article-page__main.mhy-container", (ele) => ele.outerHTML);
                        let result = {
                            authorName: author, //创作者的名字
                            content: description,
                            link,
                            category: [],
                            belongToChannels: [belongToChannels],
                            pubDate,
                            title,
                            enclosure: {},
                            BackgroundImg,
                            description: res.data.list[i].post.content,
                            isADraft: false,
                            decodeType: "html",
                            from: "RSS",
                            MarkID: crypto.createHash("md5").update(`${UserID}/${title}/${link}`).digest("hex"),
                        };
                        PromiseList.push(result);
                    } catch (e) {
                        console.log("二段爬取错误一个", e);
                    }
                }

                return PromiseList;
            } else {
                console.log("一段爬取错误");
            }
        })
        .catch((err) => {
            console.log("错误");
        });

    await browser.close();
    return res;
};
