var fetch = require("node-fetch"); // for fetching the feed
var parser = require("fast-xml-parser");

fetch("http://rss.5ux.net/zcool/recommend/all")
    .then((res) => res.text())
    .then((content) => {
        let res = parser.parse(content, options);
        rss2(res, { belongToChannels: "60166c9ebabf3847ced8d0c2" });

        console.log("保存完成");
    });
function rss2(result, { belongToChannels }) {
    let array = result.rss.channel.item.map((i) => {
        let { author, description, link, pubDate = new Date(), title, category = [] } = i;

        return {
            author, //默认用户
            content: "author:" + author + "" + description,
            link,
            category,
            belongToChannels: [belongToChannels],
            pubDate: new Date(pubDate),
            title,
            isADraft: false,
            decodeType: "html",
            from: "RSS",
            MarkID: `${author}/${title}/${link}`,
        };
    });
    console.log(array);
}
var options = {
    ignoreAttributes: true,
    ignoreNameSpace: false,
    allowBooleanAttributes: true,
    parseNodeValue: true,
    parseAttributeValue: false,
    trimValues: true,
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
};
