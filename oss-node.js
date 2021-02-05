//测试用途
const OSS = require("ali-oss");
const AV = require("leancloud-storage");

async function list(accessKeyId, accessKeySecret) {
    const client = new OSS({
        region: "oss-cn-beijing",
        accessKeyId,
        accessKeySecret,
        bucket: "pictures-classwebsite",
    });
    // 不带任何参数，默认最多返回100个文件。
    await AV.User.logIn("github", "github20010206");
    let query = new AV.Query("Img");
    query.exists("url");
    query.select(["url", "name"]);
    query.limit(500);
    let imgs = await query.find();
    let urls = imgs.map((i) => i.attributes.url);
    console.log(urls);
    let result = await client.list({
        "max-keys": 500,
    });
    let deleteObjects = result.objects
        .filter((i) => {
            return !urls.includes(i.url);
        })
        .map((i) => i.name);
    await deleteMulti(deleteObjects);
    console.log(deleteObjects);
}
async function deleteMulti(obj) {
    try {
        let result = await client.deleteMulti(obj, {
            quiet: true,
        });
        console.log(result);
    } catch (e) {
        console.log(e);
    }
}

module.exports = list;
