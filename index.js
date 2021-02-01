const AV = require("leancloud-storage");
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
AV.init({
    appId: "0ER6ub3jKGsff0bDnvcE3InS-gzGzoHsz",
    appKey: "U017BnxwoBNCxk0ls4Rxyzhl",
    serverURL: "https://0er6ub3j.lc-cn-n1-shared.com/",
});

function saveMessage(listName, array) {
    AV.Object.saveAll(array.map((i) => Creator(listName, i)));
}

var [, , username, password] = process.argv;

const rssfetch = require("./rssfetch.js");
const messageSpider = require("./messageSpider.js");
AV.User.logIn(username, password).then(async () => {
    let rss = await rssfetch();
    saveMessage("Articles", rss);
    let mihayou = await messageSpider();
    saveMessage("Articles", mihayou);
});
