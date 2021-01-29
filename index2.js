var fetch = require("node-fetch"); // for fetching the feed
var parser = require("fast-xml-parser");
fetch("https://creatorsdaily.com/api/rss")
    .then((i) => i.text())
    .then((res) => {
        let final = parser.parse(res);
        console.log(final);
    });
