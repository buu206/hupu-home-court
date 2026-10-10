# 媒资来源与处理

全部运行资源保存在 `assets/`，页面不请求远程媒资。人物均为真实照片，没有 AI 人脸。

## 官方品牌与球星

- 虎扑：[官网PNG](https://w1.hoopchina.com.cn/channel/website/static/images/basketball-nba-logo.png)。`hupu-logo-red.svg` 原样内嵌官方轮廓，用滤镜着色 `#C8102E`，没有改写字形。
- NBA：[官方SVG](https://cdn.nba.com/logos/leagues/logo-nba.svg)。16队队徽取自 `https://cdn.nba.com/logos/nba/<team-id>/primary/L/logo.svg`。
- Hero：[湖人官方詹姆斯1920×2304写真](https://lalweb.blob.core.windows.net/public/lakers/product-marketing/web/player-page/2023-2024/2324_PlayerImage_James_1920x2304.jpg)。原件 `originals/lebron-lakers.jpg`，WebP质量94显示版 `hero-portrait.webp`。黑白人物与黄色球衣是原图视觉。
- 戴维斯：[湖人官方1920×2304写真](https://lalweb.blob.core.windows.net/public/lakers/product-marketing/web/player-page/2023-2024/2324_PlayerImage_Davis_1920x2304.jpg)。原件 `originals/davis-lakers.jpg`。
- 评分卡 `player-lebron.png` / `player-davis.png`：官方历史写真裁为1040×760，纯黑背景处理为透明度，没有修改人物五官。
- 其他球员：NBA官方1040×760头像，`https://cdn.nba.com/headshots/nba/latest/1040x760/<id>.png`。Curry 201939、Green 203110、Tatum 1628369、Brown 1627759、Jokić 203999、Murray 1627750。

## 当前球衣与赛场摄影

已逐张用接触表检查内容和清晰度，替换了印刷签名图、错误球队图与不能下载的来源。只做格式和尺寸压缩，JPEG质量91。

| 本地文件 | 来源 |
|---|---|
| `jerseys/lal.jpg` | [原始资源](https://fanatics.frgimages.com/los-angeles-lakers/unisex-nike-lebron-james-gold-los-angeles-lakers-swingman-jersey-icon-edition_ss5_p-200040747%2Bpv-2%2Bu-9ahuglaastmovr3gjzjv%2Bv-gn6ts96gduj7aubwqxm6.jpg?_hv=2&w=900) |
| `jerseys/gsw.jpg` | [原始资源](https://cdn.afew-store.com/assets/49/495317/600/nike-swingman-jersey-icon-edition-22-23-golden-state-warriors-stephan-curry-rush-blue-curry-stephen-dn2005-401-apparel%20%3E%20jerseys-packshots-0.jpg) |
| `jerseys/bos.jpg` | [原始资源](https://images.footballfanatics.com/boston-celtics/unisex-nike-jayson-tatum-green-boston-celtics-swingman-player-jersey-icon-edition_pi4660000_altimages_ff_4660874-d26234c91b2fdb8df885alt1_full.jpg?_hv=2&w=1018) |
| `jerseys/chi.jpg` | [原始资源](https://d3nt9em9l1urz8.cloudfront.net/media/catalog/product/cache/3/image/1100x/040ec09b1e35df139433887a97daa66f/m/n/mnajy4gs18399cb-1.jpg) |
| `jerseys/dal.jpg` | [原始资源](https://throwbackstore.com.au/cdn/shop/files/Nike_Luka_Doncic_Dallas_Mavericks_Icon_Edition_Swingman_Jersey_DN2002-480_Blue_hero_3500x.jpg?v=1689319128) |
| `jerseys/mia.jpg` | [原始资源](https://fanatics.frgimages.com/miami-heat/mens-fanatics-jimmy-butler-black-miami-heat-fast-break-replica-player-jersey-icon-edition_pi3662000_ff_3662256-d834a76b1067efbe6a61_full.jpg?_hv=2) |
| `jerseys/mil.jpg` | [原始资源](https://images.prodirectsport.com/ProductImages/Main/273634_Main_Thumb_1398027.jpg) |
| `jerseys/phx.jpg` | [原始资源](https://cdn.shopify.com/s/files/1/0603/3031/1875/products/main-square_a621cdb3-a423-4095-a9ce-fcf77fae1e6d.jpg?v=1694784599) |
| `jerseys/den.jpg` | [原始资源](https://fanatics.frgimages.com/denver-nuggets/mens-nike-nikola-jokic-navy-denver-nuggets-swingman-jersey-icon-edition_pi3774000_ff_3774101-d1d803120c03a7a56e9b_full.jpg?_hv=2) |
| `jerseys/nyk.jpg` | [原始资源](https://fanatics.frgimages.com/new-york-knicks/unisex-nike-jalen-brunson-blue-new-york-knicks-swingman-jersey-icon-edition_ss5_p-5270594%2Bu-wjkmhasdp9s5wwzt2bmb%2Bv-vsc8v0podzqmoive9ewb.jpg?_hv=2) |
| `jerseys/phi.jpg` | [原始资源](https://fanatics.frgimages.com/philadelphia-76ers/mens-nike-joel-embiid-royal-philadelphia-76ers-swingman-jersey-icon-edition_pi2711000_altimages_ff_2711160alt1_full.jpg?_hv=2&w=1018) |
| `jerseys/mem.jpg` | [原始资源](https://images.footballfanatics.com/memphis-grizzlies/mens-nike-ja-morant-navy-memphis-grizzlies-2019-nba-draft-first-round-pick-swingman-jersey-icon-edition_pi3596000_ff_3596121-caebc889f73f5a10a304_full.jpg?_hv=2) |
| `jerseys/sas.jpg` | [原始资源](https://images.footballfanatics.com/san-antonio-spurs/san-antonio-spurs-nike-icon-edition-swingman-jersey-2023-nba-draft-first-round-pick-black-victor-wembanyama-unisex_ss5_p-200340709%2Bu-voqsjqqzupudg9acihpb%2Bv-7mzyvkv6luqgusjydijn.jpg?_hv=2) |
| `jerseys/okc.jpg` | [原始资源](https://static.nike.com/a/images/t_PDP_1728_v1/f_auto%2Cq_auto%3Aeco%2Cc_scale%2Cw_300%2Cu_9ddf04c7-2a9a-4d76-add1-d15af8f0263d%2Cc_scale%2Cfl_relative%2Cw_1.0%2Ch_1.0%2Cfl_layer_apply/eedc940c-ffb6-4a53-accb-b1ed8b0af751/BOYS%2BICON%2BSWINGMAN%2BJERSEY.png) |
| `jerseys/cle.jpg` | [原始资源](https://images.footballfanatics.com/cleveland-cavaliers/unisex-nike-donovan-mitchell-wine-cleveland-cavaliers-swingman-jersey-icon-edition_pi5109000_ff_5109833-39f389f5a073b8ab597f_full.jpg?_hv=2) |
| `jerseys/tor.jpg` | [原始资源](https://images.footballfanatics.com/toronto-raptors/mens-jordan-brand-scottie-barnes-black-toronto-raptors-swingman-replica-jersey-statement-edition_pi4970000_altimages_ff_4970616-0167a90b5786e5c8ddddalt1_full.jpg?_hv=2&w=1018) |
| `photos/lal.jpg` | [原始资源](https://cdn.nba.com/teams/uploads/sites/1610612747/2024/04/james-dunk-mem-240412-1130x635-GettyImages-2148460085.jpg) |
| `photos/bos.jpg` | [原始资源](https://cloudfront-us-east-1.images.arcpublishing.com/bostonglobe/A244ISUFEEP36APLDGIPZIYE34.JPG) |
| `photos/phx.jpg` | [原始资源](https://a.espncdn.com/photo/2023/0421/r1162158_1296x729_16-9.jpg) |
| `photos/mia.jpg` | [原始资源](https://static.foxnews.com/foxnews.com/content/uploads/2023/05/Jimmy-Butler.jpg) |
| `photos/gsw.jpg` | [原始资源](https://i5.hoopchina.com.cn/5aee8b1381be847de89010f0bbcc4847_w_1179_h_1087_.jpg?imageMogr2%2Fformat%2Fwebp%2Fauto-orient%3Fx-oss-process=image%2Fresize) |
| `photos/dal.jpg` | [原始资源](https://img.bleacherreport.net/img/images/photos/003/871/669/hi-res-7acd1b49f353d540a90ee2740ab17037_crop_exact.jpg?h=1200&q=75&w=1200) |
| `photos/mil.jpg` | [原始资源](https://images.complex.com/complex/image/upload/v1723859344/sanity-new/giannis-antetokounmpo-dunk-bucks-76ers-2019-133403825.jpg) |
| `photos/den.jpg` | [原始资源](https://sportshub.cbsistatic.com/i/r/2023/06/13/f34bcb21-92d1-47c8-b2f2-dc7c3e81c47f/thumbnail/1200x675/b45f304cf5e42a2d775d3169858c39a1/jokic-title-getty-1.png) |
| `photos/nyk.jpg` | [原始资源](https://livesport-ott-images.ssl.cdn.cra.cz/r1200xfq60/8295d7f4-3054-4e61-9b9e-44387c59b45a.jpeg) |
| `photos/phi.jpg` | [原始资源](https://staticg.sportskeeda.com/editor/2023/03/95fb7-16792367630722-1920.jpg) |
| `photos/mem.jpg` | [原始资源](https://wallpaperaccess.com/full/6578520.jpg) |
| `photos/sas.jpg` | [原始资源](https://images2.minutemediacdn.com/image/upload/c_crop%2Cw_4326%2Ch_2433%2Cx_0%2Cy_0/c_fill%2Cw_1440%2Car_16%3A9%2Cf_auto%2Cq_auto%2Cg_auto/images/ImagnImages/mmsport/thebiglead_en_international_web/01jab7vn3bwwjq8v0gqv.jpg) |
| `photos/okc.jpg` | [原始资源](https://cdn.nba.com/teams/uploads/sites/1610612760/2026/04/8-260402_JIMMYDO_OKCVSLAL_0034.jpg) |
| `photos/cle.jpg` | [原始资源](https://cdn.nba.com/teams/uploads/sites/1610612739/2025/04/CLE03919.jpg) |
| `photos/tor.jpg` | [原始资源](https://cdn.hoopsrumors.com/files/2025/11/Scottie-Barnes-900x600.jpg) |
| `photos/chi.jpg` | [原始资源](https://d.ibtimes.com.au/en/full/1354886/chicago-bulls-michael-jordan-sinks-championship-winning-basket-utah-jazz-bryon-russell-watches.jpg) |

## 其他照片和实拍视频

- `hero-athlete.webp` / `nba-media-day.jpg`：[NBA湖人2023媒体日](https://cdn.nba.com/teams/uploads/sites/1610612747/2023/10/2324_lal_product_mediaday_gallery_27.jpg)。
- `lebron-card.webp`：[媒体日原始摄影](https://images.squarespace-cdn.com/content/v1/56c6586337013bf807abd4ac/b8e7e252-9bd9-46e8-9971-2169d1b484d5/IMG_0183.JPG)。
- `basketball.jpg`：[Unsplash球场](https://images.unsplash.com/photo-1546519638-68e109498ffc)。
- `football.jpg`：[Unsplash足球](https://images.unsplash.com/photo-1574629810360-7efbbe195018)。
- `tech.jpg`：[Unsplash数码](https://images.unsplash.com/photo-1511707171634-5f897ff02aa9)。
- `street.jpg`：[Unsplash夜景](https://images.unsplash.com/photo-1519608487953-e999c86e7455)。
- `court-highlights.mp4`：1280×720、约7秒，[Mixkit真实篮球训练](https://mixkit.co/free-stock-video/one-on-one-in-basketball-training-44468/) / [原始MP4](https://assets.mixkit.co/videos/44468/44468-720.mp4)。这是真实训练短片，不是NBA比赛录像。

## 品牌墙、字体与库

16个SVG来自 [Simple Icons 13.21.0](https://www.jsdelivr.com/package/npm/simple-icons)。ESPN、Gatorade、GoPro和HUPU用文字标识，共20格。文化墙仅作课堂视觉研究，不暗示真实商业合作。

字体由Google Fonts下载：Anton、Barlow Condensed 600/700、Bodoni Moda Italic 500、Caveat 600。GSAP与ScrollTrigger3.13.0、Lenis1.3.11由jsDelivr下载。

当前滚动与收藏墙结构参考 [Lando Norris官网](https://landonorris.com/)。原型备份在 `archive/`，不参与当前页面加载。

## 迭代交互参考

磁性噪声圆环参考 Codrops Custom Cursors Demo 4：https://tympanus.net/Tutorials/CustomCursors/index4.html 。保留八节点平滑轮廓、缓动、磁性与噪声行为，以原生 SVG 实现。SimplexNoise 2.4.0 来自 cdnjs，并保存在 assets/vendor/simplex-noise.min.js。Hero 已移除 WebGL 图像扭曲。
