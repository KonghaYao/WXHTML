const fetch = require("node-fetch");
const parser = require("fast-xml-parser");
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
            rss2(parser.parse(content), { belongToChannels: "60166c9ebabf3847ced8d0c2" });

            console.log("保存完成");
        });
});
function rss2(result, { belongToChannels }) {
    let array = result.rss.channel.item.map((i) => {
        let { author, description, link, pubDate = new Date(), title } = i;

        return Creator("RSS", {
            author,
            content: description,
            link,
            belongToChannels: [belongToChannels],
            pubDate: new Date(pubDate),
            title,
            decodeType: "html",
        });
    });
    AV.Object.saveAll(array);
}

function Creator(where, what) {
    //创建一个数据库对象实例
    const Pos = AV.Object.extend(where);
    const pos = new Pos();
    Object.entries(what).forEach(([key, val]) => {
        pos.set(key, val);
    });
    // 将对象保存到云端
    return pos;
}
