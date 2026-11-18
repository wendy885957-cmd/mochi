# Mochi Film 作品集

純靜態網站（index.html + style.css + script.js + works.js），推到 GitHub 後由 Vercel 自動上線。

## 新增一支作品（約 1 分鐘）
1. 把影片與封面放進 `portfolio/` 資料夾，例如 `portfolio/brand-name.mp4`、`portfolio/brand-name-cover.jpg`（直式 9:16，建議寬 406–720px、影片 720p 以內）。
2. 打開 `works.js`，在 `const WORKS = [` 的下一行貼上（越上面越前面）：

```js
  { title: "品牌／作品名稱", type: "保養品", tag: "網紅業配",
    cover: "portfolio/brand-name-cover.jpg", video: "portfolio/brand-name.mp4", link: "" },
```
   - 只想連到 IG／YouTube：`video: ""`，`link` 填網址。
   - `tag` 填新的分類名稱，網站會自動多一個篩選按鈕。
3. 存檔 → commit → push，網站會自動更新，首頁的「公開作品」數字也會自動更新。

## 其他區塊
- 品牌合作截圖：`BRAND_WORKS`；質感訪談：`INTERVIEWS`；合作藝人與網紅：`PEOPLE`（`times: "3 次合作"` 會顯示角標）；好評截圖：`REVIEWS`。
- 要拿掉作品，就刪掉 `works.js` 裡那一行。

## 備註
- 網站不顯示價格。`pricelist.html`、`pricing-notion.html` 保留網址並改為前往作品集的提示頁；`admin.html` 仍存在但未在任何頁面連結，以上三頁均設 noindex。
- 首頁影片使用 `intro-web.mp4`（由 `intro.mp4` 壓成 720p，約 1.7 MB），原檔保留。
