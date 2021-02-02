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
    const query = new AV.Query(listName);
    query.select(["MarkID"]);
    query.descending("updatedAt");
    query.limit(1000);
    query.find().then((mark) => {
        let Mark = mark.map((i) => i.attributes.MarkID);
        let needUpload = array
            .map((i) => {
                if (!Mark.includes(i.MarkID)) {
                    return Creator(listName, i);
                } else {
                    return null;
                }
            })
            .filter((i) => i);
        console.log(needUpload.length + "个数据被保存");
        return AV.Object.saveAll(needUpload);
    });
}

var [, , username, password] = process.argv;

const rssfetch = require("./rssfetch.js");
const messageSpider = require("./messageSpider.js");
AV.User.logIn(username, password).then(async () => {
    let rss = await rssfetch();
    saveMessage("Articles", rss);
    // let mihayou = await messageSpider();
    // saveMessage("Articles", mihayou);
});
