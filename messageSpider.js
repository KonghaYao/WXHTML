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
    let res = await fetch("https://bbs-api.mihoyo.com/post/wapi/userPost?gids=2&size=50&uid=75276557")
        .then((res) => res.json())
        .then(async (res) => {
            if (res.message === "OK" && res.data.list.length) {
                let PromiseList = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    try {
                        let {
                            User: { nickname: author },
                            post: {
                                subject: title,
                                image: [BackgroundImg],
                            },
                            postID,
                        } = res.data.list[i];
                        let link = "https://bbs.mihoyo.com/ys/article/" + postID;

                        await page.goto(link, { waitUntil: "networkidle2" });
                        console.log("转向");

                        let description = await page.$eval(".mhy-article-page__main.mhy-container", (ele) => ele.outerHTML);
                        let result = {
                            authorName: author, //创作者的名字
                            content: description,
                            link,
                            category: [],
                            belongToChannels: [belongToChannels],
                            pubDate: new Date(pubDate),
                            title,
                            enclosure: {},
                            BackgroundImg,
                            description: description.slice(0, 100),
                            isADraft: false,
                            decodeType: "html",
                            from: "RSS",
                            MarkID: crypto.createHash("md5").update(`${UserID}/${title}/${link}`).digest("hex"),
                        };
                        PromiseList.push(result);
                    } catch (e) {
                        console.log("二段爬取错误一个");
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
    saveMessage(res);
    await browser.close();
};
