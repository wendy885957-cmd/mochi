/* =========================================================
   Mochi Film — 作品資料（網站上所有作品都從這裡產生）
   ---------------------------------------------------------
   ▸ 新增一支影片作品：複製 WORKS 裡任一個 { ... }, 區塊，
     貼在想要的位置（越上面越前面），改掉內容即可。
       title : 作品名稱（顯示在卡片上）
       type  : 小標，例如「保養品」「3C 科技」
       tag   : 分類，篩選按鈕會自動依這個產生，例如「網紅業配」「Vlog」
       cover : 封面圖路徑（直式 9:16 最好看，例如 portfolio/xxx-cover.jpg）
       video : 影片路徑（放在 portfolio/ 資料夾，例如 portfolio/xxx.mp4）
       link  : 沒有影片檔、只想連到 IG/YouTube 時填網址（video 留空 ""）
   ▸ 品牌合作截圖：複製 BRAND_WORKS 裡一行，改 cover / type / name。
   ▸ 質感訪談：同上，改 INTERVIEWS。
   ▸ 合作藝人與網紅：複製 PEOPLE 裡一行；times 有填就會顯示「N 次合作」。
   改完存檔、推上 GitHub，Vercel 會自動更新網站。
   ========================================================= */

const WORKS = [
  { title: "日韓爆火穀胱甘肽", type: "保健食品", tag: "網紅業配",
    cover: "reel-01.jpg", video: "", link: "https://www.instagram.com/reel/DVvXGBoiYCl/" },
  { title: "苗栗山chill露營區", type: "露營紀錄", tag: "Vlog",
    cover: "portfolio/vlog-camping-cover.jpg", video: "portfolio/vlog-camping.mp4", link: "" },
  { title: "LADOR護髮", type: "護髮產品", tag: "網紅業配",
    cover: "portfolio/lador-yuan-cover.jpg", video: "portfolio/lador-yuan.mp4", link: "" },
  { title: "INNEX身體乳", type: "身體保養", tag: "網紅業配",
    cover: "portfolio/innex-yuan-cover.jpg", video: "portfolio/innex-yuan.mp4", link: "" },
  { title: "石頭掃地機器人", type: "家電產品", tag: "網紅業配",
    cover: "portfolio/roborock-yuan-cover.jpg", video: "portfolio/roborock-yuan.mp4", link: "" },
  { title: "Amor Fati 私密保養噴霧", type: "私密保養", tag: "網紅業配",
    cover: "portfolio/amorfati-yuan-cover.jpg", video: "portfolio/amorfati-yuan.mp4", link: "" },
  { title: "華納婚紗", type: "婚紗攝影", tag: "網紅業配",
    cover: "portfolio/huaner-yuan-cover.jpg", video: "portfolio/huaner-yuan.mp4", link: "" },
  { title: "膠原蛋白", type: "保健食品", tag: "網紅業配",
    cover: "portfolio/collagen-yuan-cover.jpg", video: "portfolio/collagen-yuan.mp4", link: "" },
  { title: "絕世好波健身服", type: "運動服飾", tag: "網紅業配",
    cover: "portfolio/sportswear-yuan-cover.jpg", video: "portfolio/sportswear-yuan.mp4", link: "" },
  { title: "Dr May紅外泌膠原安瓶", type: "保養品", tag: "網紅業配",
    cover: "portfolio/drmay-yuan-cover.jpg", video: "portfolio/drmay-yuan.mp4", link: "" },
  { title: "UNIKCY", type: "保養品", tag: "網紅業配",
    cover: "portfolio/unikcy-yuan-cover.jpg", video: "portfolio/unikcy-yuan.mp4", link: "" },
  { title: "Galaxy Z Flip 7", type: "3C 科技", tag: "網紅業配",
    cover: "portfolio/galaxy-zflip-yuan-cover.jpg", video: "portfolio/galaxy-zflip-yuan.mp4", link: "" },
];

const BRAND_WORKS = [
  { cover: "portfolio/company-01-cover.jpg", type: "門市介紹", name: "王中平" },
  { cover: "portfolio/company-02-cover.jpg", type: "門市介紹", name: "王中平" },
  { cover: "portfolio/company-06-cover.jpg", type: "產品介紹", name: "李又汝" },
  { cover: "portfolio/company-16-cover.jpg", type: "門市介紹", name: "宇風＆家妤" },
  { cover: "portfolio/company-17-cover.jpg", type: "門市介紹", name: "宇風＆家妤" },
  { cover: "portfolio/company-20-cover.jpg", type: "門市介紹", name: "江國賓" },
  { cover: "portfolio/company-21-cover.jpg", type: "門市介紹", name: "顏曉筠" },
  { cover: "portfolio/company-22-cover.jpg", type: "門市介紹", name: "吳皓昇＆文汶" },
  { cover: "portfolio/company-23-cover.jpg", type: "門市介紹", name: "林祐星" },
  { cover: "portfolio/company-03-cover.jpg", type: "門市介紹", name: "家庭組合" },
  { cover: "portfolio/company-05-cover.jpg", type: "產品介紹", name: "外國人" },
  { cover: "portfolio/company-07-cover.jpg", type: "門市介紹", name: "築夢者婷雅" },
  { cover: "portfolio/company-09-cover.jpg", type: "產品介紹", name: "陳晨威" },
  { cover: "portfolio/company-10-cover.jpg", type: "商品介紹", name: "Joy" },
  { cover: "portfolio/company-13-cover.jpg", type: "商品介紹", name: "網紅" },
  { cover: "portfolio/company-14-cover.jpg", type: "商品介紹", name: "網紅" },
  { cover: "portfolio/company-15-cover.jpg", type: "商品介紹", name: "網紅" },
  { cover: "portfolio/company-24-cover.jpg", type: "門市介紹", name: "網紅" },
  { cover: "portfolio/company-25-cover.jpg", type: "門市介紹", name: "網紅" },
  { cover: "portfolio/company-26-cover.jpg", type: "門市介紹", name: "梓梓" },
];

const INTERVIEWS = [
  { cover: "portfolio/company-18-cover.jpg", type: "品牌訪談", name: "BaNAna 阿蕉・林彥良" },
  { cover: "portfolio/company-19-cover.jpg", type: "質感訪談", name: "王中平" },
];

const PEOPLE = [
  { name: "王中平", role: "藝人 / 演員 / 歌手", photo: "collab/wang-zhongping.jpg", times: "5 次合作", photos: ["collab/wang-zhongping.jpg", "collab/wang-hanjing.jpg", "collab/wang-3rd.jpg", "collab/wang-4th.jpg", "collab/wang-5th.jpg"], names: ["王中平", "王中平＆韓靖", "王中平", "王中平", "王中平"] },
  { name: "吳皓昇＆文汶", role: "藝人 / 演員夫妻檔", photo: "collab/wu-wenwen.jpg", times: "" },
  { name: "江國賓", role: "藝人 / 演員 / 歌手", photo: "collab/jiang-guobin.jpg", times: "" },
  { name: "林祐星", role: "藝人 / 演員", photo: "collab/lin-youxing.jpg", times: "" },
  { name: "林道遠＆靜香", role: "藝人夫妻檔", photo: "collab/lin-jingxiang.jpg", times: "" },
  { name: "顏曉筠", role: "藝人 / 演員", photo: "collab/yan-xiaojun.jpg", times: "" },
  { name: "宇風＆家妤", role: "藝人 / 演員夫妻檔", photo: "collab/yufeng-jiayu.jpg", times: "" },
  { name: "李又汝", role: "藝人", photo: "collab/li-youru.jpg", times: "" },
  { name: "謝京穎", role: "藝人 / 啦啦隊", photo: "collab/xie-jingying.jpg", times: "" },
  { name: "張媛", role: "網紅 / 三星拍攝", photo: "collab/zhangyan-samsung.jpg", times: "" },
  { name: "董梓甯（梓梓）", role: "網紅 / 啦啦隊", photo: "collab/dong-zining.jpg", times: "" },
  { name: "奎丁", role: "網紅", photo: "collab/kuiding.jpg", times: "" },
  { name: "瑋哥", role: "網紅", photo: "collab/weige.jpg", times: "" },
  { name: "浩克爸爸", role: "網紅 / 健身教練", photo: "collab/hulk-dad.jpg", times: "" },
  { name: "蕭志瑋（八弟）", role: "網紅", photo: "collab/xiao-zhiwei.jpg", times: "2 次合作" },
  { name: "陳伊", role: "網紅 / 啦啦隊", photo: "collab/chenyi.jpg", times: "" },
  { name: "任伃柔（魚肉）", role: "網紅 / 啦啦隊", photo: "collab/yurou.jpg", times: "" },
  { name: "陳晨威", role: "職棒選手", photo: "collab/baseball.jpg", times: "" },
  { name: "K大", role: "網紅 / 汽車美容", photo: "collab/kda.jpg", times: "" },
  { name: "網紅們", role: "多人合作拍攝", photo: "collab/group.jpg", times: "" },
];

// 好評截圖（放在 reviews/ 資料夾）
const REVIEWS = ["reviews/IMG_3252.jpg", "reviews/IMG_3253.jpg", "reviews/IMG_3254.jpg", "reviews/IMG_3256.jpg", "reviews/IMG_3257.jpg", "reviews/IMG_3258.jpg", "reviews/IMG_3259.jpg", "reviews/IMG_3260.jpg", "reviews/IMG_3261.jpg", "reviews/IMG_3262.jpg", "reviews/IMG_3263.jpg", "reviews/IMG_3264.jpg"];
