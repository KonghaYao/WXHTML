const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log("转向开始");

    await page.goto("https://bbs.mihoyo.com/ys/article/3235389", {
        waitUntil: "networkidle2", // 网络空闲说明已加载完毕
    });
    console.log("转向");
    let description = await page.$eval(".mhy-article-page__main.mhy-container", (ele) => ele.outerHTML);
    console.log(description);
    console.log("等待完成");
    await browser.close();
})();
