// 静态离线与 GitHub Pages 演示数据（由真实小红书抓取数据沉淀）
import type { ChannelItem, FeedResult } from "./api"
import type { Note } from "./index"

export const STATIC_CHANNELS: ChannelItem[] = [
  {
    "id": "homefeed.fashion_v3",
    "name": "穿搭"
  },
  {
    "id": "homefeed.food_v3",
    "name": "美食"
  },
  {
    "id": "homefeed.cosmetics_v3",
    "name": "彩妆"
  },
  {
    "id": "homefeed.movie_and_tv_v3",
    "name": "影视"
  },
  {
    "id": "homefeed.career_v3",
    "name": "职场"
  },
  {
    "id": "homefeed.love_v3",
    "name": "情感"
  },
  {
    "id": "homefeed.household_product_v3",
    "name": "家居"
  },
  {
    "id": "homefeed.gaming_v3",
    "name": "游戏"
  },
  {
    "id": "homefeed.travel_v3",
    "name": "旅行"
  },
  {
    "id": "homefeed.fitness_v3",
    "name": "健身"
  },
  {
    "id": "homefeed.video",
    "name": "视频",
    "originalId": "homefeed.video_v3"
  }
];

export const STATIC_FEEDS: Record<string, Note[]> = {
  "影视": [
    {
      "id": "64b345490000000035008602",
      "title": "当哪吒跟敖丙去茶啊二中上学强哥带哪吒翘课",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609212231/0f2398af2509d7274af862cc225a55ab/spectrum/1000g0k02qb1po3ik40005ocmveak1cekjs4puko!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1080,
      "type": "video",
      "likes": "169",
      "author": {
        "name": "心缘动物园",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/63b54e2baafe3e25fb808525.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64b345490000000035008602?xsec_token=ABNXsDE_bYwfBCzcY2xDqbXO1auSMbMo2BsMq9jMEUtwk=&xsec_source=pc_feed"
    },
    {
      "id": "64b27d430000000035008ce6",
      "title": "恳请所有校园偶像剧女主都按这个标准找‼️",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609212231/ff805b8d62722a1775f6398a7572a738/1000g0082q804eioji0005o3ahdogbnvdrs97v0g!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "637",
      "author": {
        "name": "牛角弯了",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo32043o15p2q005o3ahdogbnvd4uqkf2o"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64b27d430000000035008ce6?xsec_token=AB8EA_m8o7Ukv4EEjAjGIoEfcMqw6RHkfNQYSKc_WVvYc=&xsec_source=pc_feed"
    },
    {
      "id": "64b13bdd000000003500900e",
      "title": "不输《海蒂和爷爷》的冷门佳片！治愈又养眼",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609212231/9628b01e787abb84f67f4713d75b9406/spectrum/1000g0k02q32vbiek80005p3g7dtj6sd54n4s14o!nc_n_nwebp_mw_1",
      "coverWidth": 742,
      "coverHeight": 556,
      "type": "video",
      "likes": "468",
      "author": {
        "name": "白又白说",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/647045a292a8344d1009a4dc.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64b13bdd000000003500900e?xsec_token=AB6lNVqDM72Fi4zCJXEl6idYexl_2MO4GZLnIxEN_bHW8=&xsec_source=pc_feed"
    },
    {
      "id": "64bd2af8000000001701bdf3",
      "title": "大部分剧会让女主去见上位者，诀是相反的",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609212231/2b55ef4091f972415d9311d3f98f7ef8/1040g00830msdnlfa4i005p0noej4ibgedho9cf8!nc_n_nwebp_mw_1",
      "coverWidth": 1080,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "4926",
      "author": {
        "name": "七月夏安",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo3214fr14o7e005p0noej4ibge4f6fmsg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64bd2af8000000001701bdf3?xsec_token=AB3dhH9QEoTBkOR3jDmKNZr62JCmSdY7sDOqLde5IvZB0=&xsec_source=pc_feed"
    },
    {
      "id": "64b733620000000035009789",
      "title": "你这是在说什么啊！？",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609212231/4996bdc2acf76de45f0e126685f46703/1000g0082qqd26aajs0605o2sja6g837t0tsa0f0!nc_n_nwebp_mw_1",
      "coverWidth": 1080,
      "coverHeight": 1379,
      "type": "normal",
      "likes": "34",
      "author": {
        "name": "除了可爱一无是处",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo30mt96scbkq5g5o2sja6g837tghd6bc8"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64b733620000000035009789?xsec_token=ABm4oc1FpZryraNhczD4ssOECHCrX762r5j-066elkQr8=&xsec_source=pc_feed"
    },
    {
      "id": "64c3291b000000001701bbad",
      "title": "📣7.27V榜剧集角色/网剧/电视剧",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609212231/9b2f5a0b7764992f6dc90e17ad4b6b59/1040g00830n290cf35e6g4a0ao7q0ipik63qkf78!nc_n_nwebp_mw_1",
      "coverWidth": 1645,
      "coverHeight": 2558,
      "type": "normal",
      "likes": "25",
      "author": {
        "name": "AAA金牌红绿水果批发",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo3139qqu6knq6g4a0ao7q0ipik7gpkfj8"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64c3291b000000001701bbad?xsec_token=AB_mEKMLERZsXAXe8H2pGv_qc7Hv8EFtDoMbG7bd-zTmY=&xsec_source=pc_feed"
    },
    {
      "id": "64be62ec000000000800ecf2",
      "title": "我真的理解许沁，我支持她选择宋焰",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609212231/31d1b3263c9dfff3fea29c1121044e79/1040g00830mtjq7624o505o0inbfgbqoqku4i5jg!nc_n_nwebp_mw_1",
      "coverWidth": 1920,
      "coverHeight": 2560,
      "type": "normal",
      "likes": "1.1万",
      "author": {
        "name": "温柔刀批发中心主任",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo3228121vi7k605o0inbfgbqoq2r474p8"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64be62ec000000000800ecf2?xsec_token=AB4WKomGNOpXElUp9JeeYTeB7-eoP-PGXZ1zkriGW7AN8=&xsec_source=pc_feed"
    },
    {
      "id": "64baa39c000000000b02b7fd",
      "title": "剧说很好看 偷偷给顾九思加个小包袱～",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609212231/638f4a5b28a35c4feff77eafeac81994/1040g00830mpu2emm4i4g5noaj5f08adgbav8u80!nc_n_nwebp_mw_1",
      "coverWidth": 2560,
      "coverHeight": 1920,
      "type": "video",
      "likes": "473",
      "author": {
        "name": "不加糖",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo30ppulavtmq4g5noaj5f08adgk184n60"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64baa39c000000000b02b7fd?xsec_token=ABbCLHT5s3qlM3EnEPlnWhUIAGBaER86mreLk0KFyMLXA=&xsec_source=pc_feed"
    },
    {
      "id": "64b9c1070000000012018b15",
      "title": "一提起苏麻喇姑，大多数人都会想到她吧❤",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609212231/dd87d8aa89c7f327eee92ba905e96572/1000g0082r4c79imji0005no1n330bh61mfrnep0!nc_n_nwebp_mw_1",
      "coverWidth": 1414,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "386",
      "author": {
        "name": "就爱看电视胡说八道🌸",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/5fa479495cd3d6000132668c.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64b9c1070000000012018b15?xsec_token=ABNGv_cUrQ1rSyg5TSusdM1tH9xa17xfwJrb_9qkvtXmU=&xsec_source=pc_feed"
    },
    {
      "id": "64b3d7c7000000001c00ebc2",
      "title": "观众合影的正确方式，大家学会了吗🤗",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609212231/a9cd94a20301bb9af2eca20819c3fdd1/1000g0082qd9asqmjs06g5oeh8hr41d5002uri90!nc_n_nwebp_mw_1",
      "coverWidth": 1080,
      "coverHeight": 1549,
      "type": "normal",
      "likes": "381",
      "author": {
        "name": "猫猫殿下",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo313mlvnkd1q605oeh8hr41d50r9ijo5g"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64b3d7c7000000001c00ebc2?xsec_token=ABNXsDE_bYwfBCzcY2xDqbXM_kT6yBIRLcTDIQO950q1o=&xsec_source=pc_feed"
    },
    {
      "id": "64bbaa9d000000001700fded",
      "title": "【盖亚SSV 背部向图集】",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609212231/312eb5c1c5e9337663c912fecbf3af9a/1040g00830mqunqlt4m5g5opijpu8vsornqoidog!nc_n_nwebp_mw_1",
      "coverWidth": 960,
      "coverHeight": 1440,
      "type": "normal",
      "likes": "638",
      "author": {
        "name": "路过的俊宝📷不用记了",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo320s8hoadnk205opijpu8vsort3115h0"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64bbaa9d000000001700fded?xsec_token=ABnHK9_5i3BnakyZmKnBg4_3UG4Un40yVUaOqhBxP1NYk=&xsec_source=pc_feed"
    },
    {
      "id": "64bcf19b000000001201a850",
      "title": "18部小甜宠网剧❗❗❗太甜辣❗❗❗",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609212231/26cac5bf32b97ac0605bdf20079754a6/1040g00830ms6nits4g6g5oq804i63gb8h6pitvg!nc_n_nwebp_mw_1",
      "coverWidth": 1920,
      "coverHeight": 2560,
      "type": "normal",
      "likes": "649",
      "author": {
        "name": "双双爱追剧",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1000g2jo2pel0j7sjs0605oq804i63gb8r916vuo"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64bcf19b000000001201a850?xsec_token=AB0n4OPyD4K3Sp9K3uXoSAtIU5AeheZs4xw2_pcBcYpBI=&xsec_source=pc_feed"
    },
    {
      "id": "64c38abc000000000b029b86",
      "title": "封神真心好看（不涉及剧透）",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609212231/e1be306d9cf4952bf7fafb6fdb79f0cd/1040g00830n2ktnrjle605o0pge40895cbg6tke0!nc_n_nwebp_mw_1",
      "coverWidth": 389,
      "coverHeight": 389,
      "type": "normal",
      "likes": "171",
      "author": {
        "name": "古德文",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo30qma0bnl10605o0pge40895cd3m263o"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64c38abc000000000b029b86?xsec_token=AB_mEKMLERZsXAXe8H2pGv_irWme1AJrAKHw2xP0v83XY=&xsec_source=pc_feed"
    },
    {
      "id": "64c091c3000000000800e5ef",
      "title": "芭比暂无续集打算！",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609212231/384562e814d2b1c642f65441df8646cb/1040g00830mvo16cm50005o07oej09f5apf8i3mo!nc_n_nwebp_mw_1",
      "coverWidth": 1448,
      "coverHeight": 2048,
      "type": "normal",
      "likes": "1402",
      "author": {
        "name": "这里是好莱坞",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/64afcaa9c276686e06852880.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64c091c3000000000800e5ef?xsec_token=AB8GfF7dOtdlB0n_mqoz61fI3CD4hjeJkIN7ViF-BeNTM=&xsec_source=pc_feed"
    },
    {
      "id": "64c13275000000000a01bd8f",
      "title": "长相思男主到底是谁？好看吗？",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609212231/0e018cba8016692cab9817214f778c14/1040g00830n0bkto6525g5ou03frpie5f8m5t8h0!nc_n_nwebp_mw_1",
      "coverWidth": 1079,
      "coverHeight": 1145,
      "type": "normal",
      "likes": "34",
      "author": {
        "name": "Jinx",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo3222shj4hna6g5ou03frpie5fk9kducg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64c13275000000000a01bd8f?xsec_token=ABvRoUEwfsVkzMZwPSe3Xd-MHa1Gbf9pKnKzIb5kZmzeA=&xsec_source=pc_feed"
    },
    {
      "id": "64b8b35d000000000c035c8a",
      "title": "有没有在香港看完《奥本海默》的伙伴？",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609212231/d380aaa002b0a5d1bc2af7e1e6e33248/1000g0082r08hsjaju00g5o06rl4g97rhbbill1g!nc_n_nwebp_mw_1",
      "coverWidth": 1150,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "10",
      "author": {
        "name": "梦",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31j55cash34005o06rl4g97rh4mqost8"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64b8b35d000000000c035c8a?xsec_token=AB5nijiA-VcXeOH2WmPaQCYBKIGeP3o9HXQPx9djlbcqI=&xsec_source=pc_feed"
    },
    {
      "id": "64b3eb5a000000002b03be41",
      "title": "只因为没给老人让座，女人惨被网暴致死",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609212231/a8098f7059d398a065fdc0fa69040b29/spectrum/1000g0k02qdisg68k80005nq3gvcg8i7q60uf0p8!nc_n_nwebp_mw_1",
      "coverWidth": 2560,
      "coverHeight": 1920,
      "type": "video",
      "likes": "2518",
      "author": {
        "name": "漫威十级学者",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/5f4388a4b91185000178e645.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64b3eb5a000000002b03be41?xsec_token=ABNXsDE_bYwfBCzcY2xDqbXMjfTWL5dl0duccKn37uB90=&xsec_source=pc_feed"
    },
    {
      "id": "64b510a60000000015032841",
      "title": "君生我未生",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609212231/03a458b6a432874a5e6991e1c8d145f6/1000g0082qi1kdb8jm05g5n5f387kf69nj2cenjo!nc_n_nwebp_mw_1",
      "coverWidth": 1920,
      "coverHeight": 2560,
      "type": "video",
      "likes": "253",
      "author": {
        "name": "离小汐",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/612b97337fc58548726d6f68.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64b510a60000000015032841?xsec_token=ABy2RHMCPSQhWlFF8PzEAEZjaLE3iqL4CoE9xGyjmZtyA=&xsec_source=pc_feed"
    },
    {
      "id": "64b3da1f0000000010028f97",
      "title": "这个喘息🥺我垂直入坑",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609212231/c2200e259aa21943dfbd75f503876081/1000g0082qdaf0kajs0605n3t0fdlhk8mv37c9i8!nc_n_nwebp_mw_1",
      "coverWidth": 2560,
      "coverHeight": 1920,
      "type": "video",
      "likes": "639",
      "author": {
        "name": "LKo.",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo320sjhi9t7e305n3t0fdlhk8mh8dkumg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64b3da1f0000000010028f97?xsec_token=ABNXsDE_bYwfBCzcY2xDqbXLcjNlkFm9ey0YlOz-pn4S8=&xsec_source=pc_feed"
    }
  ],
  "推荐": [
    {
      "id": "6a7fd7420000000022014e06",
      "title": "被吹爆的护肤品！到底是营销还是真实力？",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/a9012d233aefc38973ac5fbd4005c815/note_pre_post_uhdr/1040g3r0323sfn2pe0m0g5or54fsnrtjia7nkpvg!nc_n_nwebp_mw_1",
      "coverWidth": 4284,
      "coverHeight": 5712,
      "type": "normal",
      "likes": "198",
      "author": {
        "name": "小茄总的美学生活🍅",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo3244qn4o972005or54fsnrtjiiqn9roo"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a7fd7420000000022014e06?xsec_token=ABX_mbwtysIdP_je5fcmHAECBafRq2GR-066tUcZSnSwM=&xsec_source=pc_feed"
    },
    {
      "id": "6a7d91360000000032022051",
      "title": "清仓福利款～",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/7b0d7231b1c9bb2f7f6450e160d9cfe2/1040g008323q77g9g72205op810novuk1vl1f9ho!nc_n_nwebp_mw_1",
      "coverWidth": 1080,
      "coverHeight": 1441,
      "type": "video",
      "likes": "552",
      "author": {
        "name": "半坊法式女鞋",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31o79l6f8ks005op810novuk1f2ub2gg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a7d91360000000032022051?xsec_token=ABwBDBEzhv8Fxz_wNvHTWNXhlMrgDh6Ppjm6MvUjmBGOg=&xsec_source=pc_feed"
    },
    {
      "id": "6a8a4d4a0000000016022bb2",
      "title": "9m！后悔没早买这个小蓝凳！！！",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/1c768c1a0c6b4bf70581e693468599d9/1040g2sg3246o5lornke05p12ju04c590ug07790!nc_n_nwebp_mw_1",
      "coverWidth": 2801,
      "coverHeight": 3733,
      "type": "video",
      "likes": "594",
      "author": {
        "name": "Arce Studio 家居",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/6baa8229-ab2f-34bc-b7db-3ad852c65b7b"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a8a4d4a0000000016022bb2?xsec_token=ABCZ_NL58szboKn4AG64ozNo_ATCtrR3kdDfusIQU0oM4=&xsec_source=pc_feed"
    },
    {
      "id": "6a8bbdbe0000000033011c12",
      "title": "新婚姻法已经彻底变了，女性一定要看懂❗",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/c44dd588f49281111cbaa488eaa6d876/1040g2sg32485037g0okg5q5lc726aji6sb07tkg!nc_n_nwebp_mw_1",
      "coverWidth": 1242,
      "coverHeight": 1656,
      "type": "normal",
      "likes": "2592",
      "author": {
        "name": "黎黎说法【直接私信】",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo323cvu8tbna6g5q5lc726aji68lh4eb0"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a8bbdbe0000000033011c12?xsec_token=ABmL4xejBp4np4wpMcSbHUr35xxcnoF1QRxNuQqNeFNWw=&xsec_source=pc_feed"
    },
    {
      "id": "6a8a2b640000000016022328",
      "title": "让家里变高档的居家神器，最后一件觉了",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/c0868918040cc921b21ac93a27b91186/1040g2sg3246jroke7a4g5qa8ntpdtktnrcu0l70!nc_n_nwebp_mw_1",
      "coverWidth": 720,
      "coverHeight": 1280,
      "type": "video",
      "likes": "2189",
      "author": {
        "name": "可可好物推荐",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo3243cj4n9n4105q7thtetopqedflpi3g"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a8a2b640000000016022328?xsec_token=ABCZ_NL58szboKn4AG64ozNoUSZFucefqTlRCuDwJocn4=&xsec_source=pc_feed"
    },
    {
      "id": "6a7d1d66000000002402ff98",
      "title": "目前为止0️⃣个人理解这条鱼的精神状态🤡",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/58a03722af8135853a7a6c4a5a19bc23/1040g2sg323prlp75numg5q0f5ebinivqfjqd2i0!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "video",
      "likes": "1.9万",
      "author": {
        "name": "雪球球",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31o1f5der6m005q0f5ebinivq5oi7ugg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a7d1d66000000002402ff98?xsec_token=ABwBDBEzhv8Fxz_wNvHTWNXi3VDsqqQ4J3kT-NuIilZFo=&xsec_source=pc_feed"
    },
    {
      "id": "6a7fdfb200000000270214e8",
      "title": "线下退回的库存💥💥不介意来薅🐏",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/740e143fe1c062e1ff883b33b7d966a1/spectrum/1040g0k0323si9dat0m005opu8vhm5g6qvimm2pg!nc_n_nwebp_mw_1",
      "coverWidth": 1516,
      "coverHeight": 2022,
      "type": "video",
      "likes": "254",
      "author": {
        "name": "嘉点厨房",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31t83b1n0lk005opu8vhm5g6qluck45o"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a7fdfb200000000270214e8?xsec_token=ABX_mbwtysIdP_je5fcmHAEECTgq9GDjckpCn1pbRmvv0=&xsec_source=pc_feed"
    },
    {
      "id": "6a81f3850000000032023498",
      "title": "披哥我劝你善良！！意难平啊～",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/698389e97e841ddb12745ee5ef7f17fd/1040g2sg323v88nh6gmkg4a01it80gm6k2to5108!nc_n_nwebp_mw_1",
      "coverWidth": 3072,
      "coverHeight": 4096,
      "type": "normal",
      "likes": "896",
      "author": {
        "name": "半糖浅言",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo30pbo2qsm3o6g4a01it80gm6kai21i8g"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a81f3850000000032023498?xsec_token=ABVUtYanRUcW7SZzQZARICP8604XiypFvBI_eOsGOBrmM=&xsec_source=pc_feed"
    },
    {
      "id": "6a93a73f0000000025018823",
      "title": "阿诗玛的悲剧✨高材生守疯妻27年，从未见过她最美模样",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/61882e8f2edc5527aad67f2883c9397c/1040g2sg324fscosrgoeg5p9khdkhgjg6nem8dio!nc_n_nwebp_mw_1",
      "coverWidth": 481,
      "coverHeight": 626,
      "type": "normal",
      "likes": "2746",
      "author": {
        "name": "说故事的小熙",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo311djd43d6m005p9khdkhgjg6rqfrll8"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a93a73f0000000025018823?xsec_token=ABDK0MtxGQTBlgTGrbpH9dl-6aOCkMGvVTZEO-_eZFcDY=&xsec_source=pc_feed"
    },
    {
      "id": "6a729f68000000003400fa0e",
      "title": "大学生暑假在展会第一天净挣9.5k",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/7ff3779dea319eb27ad3be252bebd8de/1040g008323fk2t1iga005nvidjcg8fsf01nsujg!nc_n_nwebp_mw_1",
      "coverWidth": 1170,
      "coverHeight": 1152,
      "type": "normal",
      "likes": "2.1万",
      "author": {
        "name": "Jackson",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/66fe736c9595d870d1e21da1.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a729f68000000003400fa0e?xsec_token=ABgKYGq72MJJJWO8OVQh3Mts0dxVwPm1YWLuBBru410RQ=&xsec_source=pc_feed"
    },
    {
      "id": "6a83dedb000000002202da0e",
      "title": "小户人家的五金，总共63克6.6万拿下！！",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/52766498258ffb4466165d9d2f782b6b/1040g2sg3240cpeltnk705pbqg4686a0k4ncjue0!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "video",
      "likes": "884",
      "author": {
        "name": "广州番禺恒泰黄金（百年恒泰）",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/657acc4e76954200019e0ab7.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a83dedb000000002202da0e?xsec_token=AB6Zx9vGiYTFPnSY8wIF8kN4UANqBLvJ86q7SUG1O-Hyw=&xsec_source=pc_feed"
    },
    {
      "id": "6a824e6d000000003300dfb7",
      "title": "第三只叫什么好呢？",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/d32a910e1b4d8d21d1fd22fd45eec701/1040g2sg323uu83p2na705qia0oj3v305tbblfu8!nc_n_nwebp_mw_1",
      "coverWidth": 1080,
      "coverHeight": 1436,
      "type": "video",
      "likes": "288",
      "author": {
        "name": "石头剪刀布🐱🐶",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo3229lof3lna5g5qia0oj3v305haibgi8"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a824e6d000000003300dfb7?xsec_token=AB7esHwJgaSaSlhVeq7GJlZJAGkHrZDeL87gue05lJScY=&xsec_source=pc_feed"
    },
    {
      "id": "6a8280e2000000002403d6e6",
      "title": "备注了我超级超级喜欢这对情侣，请多给几个杯套，结果收到这么多，开心[飞吻R]！我",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/c433096d5ff5301a79c00d46ab29dd89/note_pre_post_uhdr/1040g3r8323v48rhl0acg5p59fb5ik4abspnfuio!nc_n_nwebp_mw_1",
      "coverWidth": 3072,
      "coverHeight": 4096,
      "type": "normal",
      "likes": "502",
      "author": {
        "name": "多多指教",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31vjc09juig5g5p59fb5ik4aba6p7in8"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a8280e2000000002403d6e6?xsec_token=AB7esHwJgaSaSlhVeq7GJlZGcz20OGtwy9q9tQgzpYzFw=&xsec_source=pc_feed"
    },
    {
      "id": "6a725bcb000000002202dd39",
      "title": "凌晨5点，又一次因为备孕失败崩溃。",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/dbfaaedc2aaea4197caae4731ee78283/1040g008323eeongrga104asrmhm5rdqu3pfcjso!nc_n_nwebp_mw_1",
      "coverWidth": 3072,
      "coverHeight": 4096,
      "type": "normal",
      "likes": "953",
      "author": {
        "name": "心想事成",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31st6jnlfls604asrmhm5rdquvq3cmf8"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a725bcb000000002202dd39?xsec_token=ABgKYGq72MJJJWO8OVQh3MtpQnlT8z0EYpGNUGA0tV9qA=&xsec_source=pc_feed"
    },
    {
      "id": "6a87b632000000003a02d712",
      "title": "拍完这场戏立马就发高烧",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/45c38b000397d3d4b7ad143995925e0c/1040g2sg32446nrd6n28g5nl2vg2g9f45nnpasp8!nc_n_nwebp_mw_1",
      "coverWidth": 720,
      "coverHeight": 959,
      "type": "video",
      "likes": "1.4万",
      "author": {
        "name": "居龙红豆包",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/617ec57e14898e83bcdcb06f.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a87b632000000003a02d712?xsec_token=ABzp0Ud9Y6R-rXTfwiOnqYt_wkufEFpiY-IP5I4IrWAv4=&xsec_source=pc_feed"
    },
    {
      "id": "6a7fd71c00000000220335f7",
      "title": "“十字以内的封神文案”",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/e0d31fb00d9634a309090ae7649c532c/1040g008323sh83o6nu005pd5bh3gs30et2j0ns0!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1440,
      "type": "normal",
      "likes": "1.3万",
      "author": {
        "name": "茶色岛。",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31rkavh84ig6g5pd5bh3gs30enim6e1o"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a7fd71c00000000220335f7?xsec_token=ABX_mbwtysIdP_je5fcmHAEIK3VGl4FnJ5w9Y897qIGCU=&xsec_source=pc_feed"
    },
    {
      "id": "6a77edfc000000002500fbfd",
      "title": "为什么采访思潼的麦克风就这么迷你",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/f8abc0001446ac7e345fc27402b09f9e/1040g008323kq03spna6g4a1aqski4rqks8cflgo!nc_n_nwebp_mw_1",
      "coverWidth": 1080,
      "coverHeight": 1440,
      "type": "video",
      "likes": "1214",
      "author": {
        "name": "陆程",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/61e8ae8c8bc0b1aaa7863445.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a77edfc000000002500fbfd?xsec_token=ABz6eqgPea4GipiUrQ9FA4zd1RKqyWGFiXV6v1C1xh9JU=&xsec_source=pc_feed"
    },
    {
      "id": "6a825ed4000000002701d84f",
      "title": "朋友圈动态壁纸",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/19a2a0fcbb8695728585550b561ccbd4/notes_pre_post/1040g3k8323v093hb0o7049vnu1bfps6ggkr5n18!nc_n_nwebp_mw_1",
      "coverWidth": 720,
      "coverHeight": 720,
      "type": "normal",
      "likes": "6349",
      "author": {
        "name": "甜甜",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/5e2869e45497e800016816b1.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a825ed4000000002701d84f?xsec_token=AB7esHwJgaSaSlhVeq7GJlZCamjuTpYw4K84tjnpXqLes=&xsec_source=pc_feed"
    },
    {
      "id": "6a91c094000000000700597d",
      "title": "看完孙宇晨三段采访，宏大叙事之下，难掩空洞",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/cf46da46517faee7a8412122648e0778/1040g008324e0q2bvnk004a0t94hsqgp205g9tb8!nc_n_nwebp_mw_1",
      "coverWidth": 1080,
      "coverHeight": 1740,
      "type": "video",
      "likes": "2621",
      "author": {
        "name": "王富贵爱八卦",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo3238cv04t02704a0t94hsqgp2t461ruo"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a91c094000000000700597d?xsec_token=ABDuPW7VAggsv62hIizvI04vb21butDhuinZPPGiEqdMI=&xsec_source=pc_feed"
    },
    {
      "id": "6a8ff64e000000002a03a238",
      "title": "而且最近越来越明显了……",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/c004549d54607018d3dd6023c31585c3/1040g2sg324bv8nsk72jg5pnv2e5ne4ef8h0ovn8!nc_n_nwebp_mw_1",
      "coverWidth": 1080,
      "coverHeight": 1440,
      "type": "normal",
      "likes": "2225",
      "author": {
        "name": "呱呱呱菌",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31m72ffq058505pug5rbinnu7jbvdtl0"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a8ff64e000000002a03a238?xsec_token=ABWnTvkckQx2ezfe8E06CS-cP7eoFhEcfyU0e4Z4PjmD4=&xsec_source=pc_feed"
    },
    {
      "id": "6a7b59d1000000002403ec4f",
      "title": "又像刘亦菲又像张柏芝又像刘诗诗",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/d26b56583c14294c5b2084137960786c/1040g008323o4sr440o005omiaekgg077bu8755o!nc_n_nwebp_mw_1",
      "coverWidth": 1290,
      "coverHeight": 2030,
      "type": "normal",
      "likes": "577",
      "author": {
        "name": "朴尚武推荐官",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo322mj5mek7k005omiaekgg07728dejj0"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a7b59d1000000002403ec4f?xsec_token=AByUzUGbWV8SODDaCU1JL5mIyXuhXpR3PhMxU6SgxkBrg=&xsec_source=pc_feed"
    },
    {
      "id": "6a7aaa700000000026036d92",
      "title": "记录身边的真实事件",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/ee652b46986e0810f9b28d426ddff633/1040g008323nfh530mu5g5p32aki7u06ucidq7p8!nc_n_nwebp_mw_1",
      "coverWidth": 1200,
      "coverHeight": 1600,
      "type": "normal",
      "likes": "1097",
      "author": {
        "name": "jessie",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31tuns6821g605p32aki7u06ujm6af8o"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a7aaa700000000026036d92?xsec_token=ABQYGj284PsxGhhgO8RmnTGChvf887dY6KPnfOzcMVABQ=&xsec_source=pc_feed"
    },
    {
      "id": "6a8903b70000000023011bc2",
      "title": "这几段我愿意付费观看",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/9ffadcf685adcde21afc50344ca6c670/spectrum/1040g0k03245fs90i0s005qgbrau0ga03ti3rmjo!nc_n_nwebp_mw_1",
      "coverWidth": 960,
      "coverHeight": 720,
      "type": "video",
      "likes": "7759",
      "author": {
        "name": "憨豆小小酱",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo321pseu8ums005qgbrau0ga03jesk2a8"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a8903b70000000023011bc2?xsec_token=AB3lbyHoLt_XIhYh49eKP0YdJVhTY3nVC5cCtYLENIS0o=&xsec_source=pc_feed"
    },
    {
      "id": "6a7ac0660000000035016e2f",
      "title": "Hello, ALO 🤍",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/e18920ee9761127c562d5380c93ec9d6/notes_pre_post/1040g3k0323ni69c70a005ndiijug8ibrid5ngi0!nc_n_nwebp_mw_1",
      "coverWidth": 2880,
      "coverHeight": 3840,
      "type": "normal",
      "likes": "8.6万",
      "author": {
        "name": "赵露思工作室",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo320se59m17k005ndiijug8ibrfh9fvno"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a7ac0660000000035016e2f?xsec_token=ABQYGj284PsxGhhgO8RmnTGJrk88jRHRMYhRAyBtlT7LU=&xsec_source=pc_feed"
    },
    {
      "id": "6a925452000000000b026dd3",
      "title": "学姐留的旧物是宿舍改造外挂！",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/395e3aa145f6aaa72b79d24356e61385/1040g008324einrcn0m005qjuk8kkue02foo4ao0!nc_n_nwebp_mw_1",
      "coverWidth": 2880,
      "coverHeight": 3840,
      "type": "video",
      "likes": "953",
      "author": {
        "name": "淘淘小物",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo324d93snh72005qjuk8kkue029436nb0"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a925452000000000b026dd3?xsec_token=ABDf7_xKlR3V8Dje84mYHPe-Tb2LsDkAaVnSTbV-y91tw=&xsec_source=pc_feed"
    },
    {
      "id": "6a6dbf4700000000330106a0",
      "title": "老辈子旅游就是畅快，直接在长白山游泳！！旅游 万万没想到景点震惊",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/e3f520b20e7ec5a105a084987061ac5b/1040g2sg323arqces7akg5q2de8umsclbuknsjmo!nc_n_nwebp_mw_1",
      "coverWidth": 1080,
      "coverHeight": 1440,
      "type": "video",
      "likes": "5640",
      "author": {
        "name": "第二十五小时",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31udlf27kii605q2de8umsclbp9o2rno"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a6dbf4700000000330106a0?xsec_token=ABcUkF27N4lvF7LgXRld74HwCR-AEYE9W5er7kW_hq0hg=&xsec_source=pc_feed"
    },
    {
      "id": "6a8e37040000000020034966",
      "title": "尿不湿真实使用感受——黑金帮",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/4ab2bb561f7d38b5427ae8b82972f607/notes_pre_post/1040g3k0324ai52mknuk05om3rkrmtc23qrb2fso!nc_n_nwebp_mw_1",
      "coverWidth": 1920,
      "coverHeight": 2560,
      "type": "normal",
      "likes": "420",
      "author": {
        "name": "张闹闹想静静",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo323vgjpou0a5g5om3rkrmtc23vj1ocmo"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a8e37040000000020034966?xsec_token=ABzJO67rEEOTnCrKBqkUgvquyg6vR6ltE63eZODyLh0rI=&xsec_source=pc_feed"
    },
    {
      "id": "6a82480100000000060069dc",
      "title": "谢霆锋二儿子谢振南打排球，183又高又帅",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/79a33834fea24ed469e0aadf4f8ea61b/spectrum/1040g34o323utc657gm5g5p4bqrh43ti9rphgeu0!nc_n_nwebp_mw_1",
      "coverWidth": 1024,
      "coverHeight": 1280,
      "type": "normal",
      "likes": "1931",
      "author": {
        "name": "素素娱乐",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1000g2jo2qhgnh3ek80605p4bqrh43ti9rgb5s1g"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a82480100000000060069dc?xsec_token=AB7esHwJgaSaSlhVeq7GJlZF6GiMGg6_fyN18v8zQhP3Y=&xsec_source=pc_feed"
    },
    {
      "id": "6a925ab70000000025013829",
      "title": "原来我涂防晒一直都涂错了 校园生活 我的学生时代",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220037/6bc2022ce4e618bed859cb6df588bd0b/1040g008324eisi8dgo105qjkgvf4u200e2jia18!nc_n_nwebp_mw_1",
      "coverWidth": 1080,
      "coverHeight": 1920,
      "type": "video",
      "likes": "3.5万",
      "author": {
        "name": "超爱吃芋泥",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo3245gacpj0a005qjkgvf4u200aj22310"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6a925ab70000000025013829?xsec_token=ABDf7_xKlR3V8Dje84mYHPe9eL37g61qZZVlVOWRkAlm4=&xsec_source=pc_feed"
    }
  ],
  "穿搭": [
    {
      "id": "64aa8268000000002301fdbb",
      "title": "自己搭的一套光夜女主穿搭👗",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/86fbb0104ee3aab5dad7b25779c8dbd6/1000g0082p8qknj4k40005nmvqm6gbv6nbluii7g!nc_n_nwebp_mw_1",
      "coverWidth": 1706,
      "coverHeight": 2560,
      "type": "normal",
      "likes": "244",
      "author": {
        "name": "澜即是澜（燕云id同名",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31i0c9oven00g5nmvqm6gbv6nfcdgn1g"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64aa8268000000002301fdbb?xsec_token=AB6IVlhKW3peH0kdrjKXPwl-diKi9_Xlm1U24m9HfELLc=&xsec_source=pc_feed"
    },
    {
      "id": "64a3e89f000000002f02685b",
      "title": "156｜夏天🍃小白裙",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/065438e0fc58ff8369c5161946630684/1000g0082of1hkpgji0004a7epseghl1huerqaqo!nc_n_nwebp_mw_1",
      "coverWidth": 1284,
      "coverHeight": 1712,
      "type": "normal",
      "likes": "96",
      "author": {
        "name": "一小口锅",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31j966p8bia004a7epseghl1hmk9pre0"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a3e89f000000002f02685b?xsec_token=AB5j0tJkRGReVUgBJ6Phht0BRSkMVuVuU7L4NdM9b0rJo=&xsec_source=pc_feed"
    },
    {
      "id": "64a0116d000000001303db43",
      "title": "剪短了一半",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/4791444c387655e8ba134c1c28b0a1c4/1000g0082o01fib2k6000435c6nigmjgt14iu5lo!nc_n_nwebp_mw_1",
      "coverWidth": 1280,
      "coverHeight": 1707,
      "type": "normal",
      "likes": "251",
      "author": {
        "name": "西追",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo3220cepo4no00435c6nigmjgtie15050"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a0116d000000001303db43?xsec_token=AB7F7OTfM7z8Wy4FYWzkdUpmRwx3MPxwjSgxGBLHJzslI=&xsec_source=pc_feed"
    },
    {
      "id": "647a8ef5000000001301774a",
      "title": "OOTD｜这条裙子鲨疯啦🤍🫧",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/d86ae4f8849d8ed953cf36a4399e9e71/1000g0082jdgnqg0j800049ulc115177o3bv9o7o!nc_n_nwebp_mw_1",
      "coverWidth": 1920,
      "coverHeight": 2560,
      "type": "normal",
      "likes": "1932",
      "author": {
        "name": "周珈而",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/5eeef91f5f493600011e319f.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/647a8ef5000000001301774a?xsec_token=ABsyzeuCaB5MPqaxXLX4KN8wn2agH_MERAfEnU0dFwC_M=&xsec_source=pc_feed"
    },
    {
      "id": "6482b504000000001300e3f8",
      "title": "🌧️",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/5bb22dde04eecc012205ca1077abe7aa/1000g0082kdbbir4j20704a13tmsok3cr3d05r3g!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "99",
      "author": {
        "name": "懿",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31b1ga7oj7g004a13tmsok3crhmujkb8"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6482b504000000001300e3f8?xsec_token=ABQU-nYjUIede0YPwnsXnlwemlay98pta3EEZQofEpa9k=&xsec_source=pc_feed"
    },
    {
      "id": "648c31c9000000000703b0ab",
      "title": "【小公主和锦鲤通知】",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/720f2ad1f9a49e2f1bebcf5bb91046c4/1000g0082lid94usja0004bpisb1o7i8h7tkbp4g!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "235",
      "author": {
        "name": "山海记汉服",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/d87909fa-7219-3ea7-bc6e-213ae8687c46"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/648c31c9000000000703b0ab?xsec_token=ABDukh0tLYNvoC-O0e4TIRaxcM25o6oiqhR4Pt46n_HD8=&xsec_source=pc_feed"
    },
    {
      "id": "648a986c0000000014026fdb",
      "title": "无尽夏🎐",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/e2e84dd0fc93f2074d3acc45d6294ebf/1000g0082lc5ch3iio00043h9nntsnf5jmr5cbk0!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "127",
      "author": {
        "name": "NENE",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/66aba962239fb0f0db0d93de.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/648a986c0000000014026fdb?xsec_token=ABbYEbOAub8GGWS2woI3_ICt2UDzM1as8noTqBkJFye9o=&xsec_source=pc_feed"
    },
    {
      "id": "648afbef00000000270036e5",
      "title": "金粉中国娃娃🎀✨",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/b9e18b78cc1f5446c36493e481285057/1000g0082ldlvhjsj201049kjpqmh0novgvj8sig!nc_n_nwebp_mw_1",
      "coverWidth": 1619,
      "coverHeight": 2159,
      "type": "normal",
      "likes": "533",
      "author": {
        "name": "吴一酱",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/5e46de59145ea3000112c0c0.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/648afbef00000000270036e5?xsec_token=ABbYEbOAub8GGWS2woI3_ICqznKY056C-d1uTuyPOf3dE=&xsec_source=pc_feed"
    },
    {
      "id": "64800ac60000000012033367",
      "title": "156/108微胖🍒夏季色彩多巴胺outfits*3",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/8e63150d6effda4fb24230e096dd82d2/1000g0082k2u7md0j400048nlme13ps2ghol5d08!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "video",
      "likes": "701",
      "author": {
        "name": "eKe周",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/630246a064a8b6486225cebe.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64800ac60000000012033367?xsec_token=ABL6oZX4u1bGmiSKwa5mbSH4BtaXuaAsSPPgsM848Odqg=&xsec_source=pc_feed"
    },
    {
      "id": "64837e00000000001300054f",
      "title": "为了一条裙子要飞三次巴黎",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/e84ff615a7ac0d306fdce9e237832f55/spectrum/1040g34o3259s1sn1k4104a6skrb98avp3t0vt18!nc_n_nwebp_mw_1",
      "coverWidth": 1263,
      "coverHeight": 1684,
      "type": "video",
      "likes": "9274",
      "author": {
        "name": "Maggie杨斯淇",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo3247usqjpnk004a6skrb98avp36hbl68"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64837e00000000001300054f?xsec_token=ABDDXX9adbgs6d2SWJikToUYmS6gxrfDAd69Abr4KrTLs=&xsec_source=pc_feed"
    },
    {
      "id": "6485b907000000001303387e",
      "title": "量产型穿搭Lizlisa",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/e0b6a5cb49ace1cb72ea65552d443e38/1000g0082ku3thtcj20305nchn7808ul2p5ld8pg!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "341",
      "author": {
        "name": "糯米nya",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/62a05483ae45297a2bd0b753.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6485b907000000001303387e?xsec_token=ABK_tvb42uCPZ5221G2BsVyXZ-do9BCBkxQBpZ-OsgUnw=&xsec_source=pc_feed"
    },
    {
      "id": "648582660000000013036503",
      "title": "【民国女书生】我超爱！和我妈说我要一件同款",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/cae17137996095048529035ab1693564/1000g0082ko9kld8iu0005otte4mptfk1a4h74po!nc_n_nwebp_mw_1",
      "coverWidth": 1902,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "124",
      "author": {
        "name": "春蕾旗袍定制（关小黑屋了）",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/64264ca58fbfe1bdd2868c57.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/648582660000000013036503?xsec_token=ABK_tvb42uCPZ5221G2BsVyVM-BYSXChwzKUBQwVm89y0=&xsec_source=pc_feed"
    },
    {
      "id": "64805f7b00000000130351f4",
      "title": "月份牌女郎从画里走出来了",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/6db0011c5627971691b93239c62e13d4/1000g0082k47j0kij20005nnmv6508ojvqt2it5g!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "70",
      "author": {
        "name": "莺时织姝",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo30oqegnk3jc005nnmv6508ojv8sdrono"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64805f7b00000000130351f4?xsec_token=ABL6oZX4u1bGmiSKwa5mbSH_hLh9W4i9Z01NHl0i8ucpY=&xsec_source=pc_feed"
    },
    {
      "id": "64807b700000000013000481",
      "title": "永远对基本款心动",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/2a3867b78373af551deb057f28b10719/1000g0082k4l7riaiu0005n9ppar4318h6vhoa2o!nc_n_nwebp_mw_1",
      "coverWidth": 1255,
      "coverHeight": 1674,
      "type": "normal",
      "likes": "506",
      "author": {
        "name": "小烂橙是好橙子",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31bkg6sjngk005n9ppar4318h40as4og"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64807b700000000013000481?xsec_token=ABL6oZX4u1bGmiSKwa5mbSHzwpKRz9dQO7WBLMfCDLzz4=&xsec_source=pc_feed"
    },
    {
      "id": "64883e0e000000000800efc8",
      "title": "158cm小个子 小个子和粗腿女生看过来！",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/14e08823841b875a86cf3d0b50ddff42/1000g0082l2v7p70ja0005n3o1di45jqv5i8li40!nc_n_nwebp_mw_1",
      "coverWidth": 1280,
      "coverHeight": 1706,
      "type": "video",
      "likes": "1003",
      "author": {
        "name": "katherbe",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/5eb360f79af99700019acb7e.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64883e0e000000000800efc8?xsec_token=ABYzw9s_H_rNCIYFddc2KLdey8ycuyBdFLL7Ixwepfluk=&xsec_source=pc_feed"
    },
    {
      "id": "64874cdb0000000011011f95",
      "title": "hot girl summer ☀️👙🥥",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/05a538ed4ffc5e73e2190546a2dcfdd8/1000g0082kv9g16ej40005o1na1308ta76rc2hfo!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "276",
      "author": {
        "name": "刘Anna",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31qrd3o3kng0g5o1na1308ta7h02rmcg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64874cdb0000000011011f95?xsec_token=ABW8GIVi6dji9HTdXRS7rgUhruk1ld2nTgkG80YA8eJng=&xsec_source=pc_feed"
    },
    {
      "id": "648983df000000001300ebb1",
      "title": "160cm｜135斤你们要的背带裤背带裙来咯～",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/e821eef8485a0f043df0aba48dd7d7e1/1000g0082l7ubr30ja0005o6rc4b08efriihkf98!nc_n_nwebp_mw_1",
      "coverWidth": 1080,
      "coverHeight": 1440,
      "type": "video",
      "likes": "5530",
      "author": {
        "name": "甜辣酱135斤版",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/6222139cb5202b96d79c9fb9.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/648983df000000001300ebb1?xsec_token=ABGpCQtywisGr3Ym2k8XsNAYppACZ2AUNvpsTLZJRDqzM=&xsec_source=pc_feed"
    },
    {
      "id": "6479406e0000000011011e49",
      "title": "170 170｜大🍎型｜公主裙分享",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/714cc0162c92b2b0d1beaf948cd52ec4/1000g0082j8dcflkja0005omqighgg9kbl5s7c90!nc_n_nwebp_mw_1",
      "coverWidth": 1080,
      "coverHeight": 1440,
      "type": "video",
      "likes": "469",
      "author": {
        "name": "哦。",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/645d126412992764f5796f34.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/6479406e0000000011011e49?xsec_token=ABtkcQnFP-73URrNUeGSyeTaXWQQ_l3rXsJaWeuiN6Hzc=&xsec_source=pc_feed"
    }
  ],
  "美食": [
    {
      "id": "64b8fc06000000001201ac45",
      "title": "我妈做的拿手菜！！👍🏻好吃到💥",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/dd8129f20c9531fc504d7391ccb21517/1000g0082r1c10dmjq06g5nak19v40f6omdr8pl0!nc_n_nwebp_mw_1",
      "coverWidth": 1920,
      "coverHeight": 2560,
      "type": "normal",
      "likes": "924",
      "author": {
        "name": "佩奇吃不饱",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1000g2jo2j5ov9c8im0605nak19v40f6o8nj26pg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64b8fc06000000001201ac45?xsec_token=AB5nijiA-VcXeOH2WmPaQCYM18aiVg-gtNfbV1ZmvXoQs=&xsec_source=pc_feed"
    },
    {
      "id": "64c0b7d8000000001700c115",
      "title": "在武汉！！！江汉路！！！！",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/982525f714c46e84c5e37e92c67c9678/1040g00830mvslsbcl6005n56jf44lqveiq7ps8o!nc_n_nwebp_mw_1",
      "coverWidth": 1920,
      "coverHeight": 2560,
      "type": "normal",
      "likes": "258",
      "author": {
        "name": "惠啊惠",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/6059a5167eca893fae0236be.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64c0b7d8000000001700c115?xsec_token=AB8GfF7dOtdlB0n_mqoz61fIehw-Jf01ud_hK59oiMpVk=&xsec_source=pc_feed"
    },
    {
      "id": "64c284b0000000000800d4ab",
      "title": "深圳十亩地这家美式复古酒吧！好有氛围😭😭",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/b87874f390635e077e517ca336821824/1040g00830nsmooad1e3g4a6gqj801rrp0962fko!nc_n_nwebp_mw_1",
      "coverWidth": 1920,
      "coverHeight": 2560,
      "type": "normal",
      "likes": "63",
      "author": {
        "name": "Mallory.栗子",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo323so09jm7a004a6gqj801rrpdaib1u0"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64c284b0000000000800d4ab?xsec_token=ABEYLLyVLWG08-G_kO1QjaRdKF71FUc_TZKknrZ3TKiKI=&xsec_source=pc_feed"
    },
    {
      "id": "64b63916000000001c00f942",
      "title": "淮安no.115 刷到的mizi咪滋pizza",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/f64c5a6a8f80a71e34d66bc49ee75349/1000g0082qmira5mjs0005ojkq838cgaa59d1b2o!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "71",
      "author": {
        "name": "大鸟胃的胖子（碳水仙人）",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31q81c1k500005ojkq838cgaant5ong8"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64b63916000000001c00f942?xsec_token=ABUUOADRu6dI8NlNWT9_SMJ-GE5uW4lZq4vp-OH5ebS7o=&xsec_source=pc_feed"
    },
    {
      "id": "64aeb70e000000002b03c3ee",
      "title": "香干炒肉也太好吃了吧❗爱吃一切豆制品❗❗",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/a9ea41adecdca92c5d493b30308911eb/1040g00830muue48fl08g5n4unilkjnt1bh5c27o!nc_n_nwebp_mw_1",
      "coverWidth": 720,
      "coverHeight": 960,
      "type": "video",
      "likes": "188",
      "author": {
        "name": "张大锤",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/63b31a34d9c6d8fb9f85f6dd.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64aeb70e000000002b03c3ee?xsec_token=ABZH4iz_PXNTR3vE2I-1KB55YzRH8LGXvENmDADQiQO2k=&xsec_source=pc_feed"
    },
    {
      "id": "64a41197000000002f026642",
      "title": "夏天请和这些棒冰🔒锁死！！！清爽过瘾！",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/072ad4fb4458a0fc83885ff2e64f81bb/1000g0082ofli4o0jq0005obnld00jifss7858b0!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "video",
      "likes": "163",
      "author": {
        "name": "奈斯彭彭",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo317rib8v1k4005obnld00jifs4h9c2n8"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a41197000000002f026642?xsec_token=AB-cltee2fqQDTX7_NEj1kotjUCCC3-iuXUN3-fKIpIzs=&xsec_source=pc_feed"
    },
    {
      "id": "64af61e5000000001a012cd7",
      "title": "有空气炸锅的都去试试这个！0糖0油0面粉",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/73de499bf81cd3a20156d5b5c9b81eea/1000g0082prroqlijq00049rf89jcm4kv6nadsvg!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "1553",
      "author": {
        "name": "明天吃什么",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/62b8398f2be27b0145f774ab.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64af61e5000000001a012cd7?xsec_token=ABUs6nQ_nzJOf90ob0oMj4wAM35FtQi4fqtOHjOxBTNH4=&xsec_source=pc_feed"
    },
    {
      "id": "64afe43a000000003401654e",
      "title": "不减辣挑战一下正宗川菜…………",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/3f272677960eec8ea22661472dcb88ec/1000g0082ptrdaa2k400049pp8jdm91dquofllag!nc_n_nwebp_mw_1",
      "coverWidth": 1080,
      "coverHeight": 1440,
      "type": "video",
      "likes": "280",
      "author": {
        "name": "喂余师傅",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/5f5fc33e61d5d70001fce85b.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64afe43a000000003401654e?xsec_token=ABUs6nQ_nzJOf90ob0oMj4wMUgVMTlI1LioIjDQUecajU=&xsec_source=pc_feed"
    },
    {
      "id": "64a5909b000000003401760b",
      "title": "170/40一天吃什么 两天炫七个 臭显摆司康记",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/7a5240af85c4d428304d14df915910bd/1000g0082olgiojejs0005o7uhbdgbhm1vuo3p28!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "video",
      "likes": "276",
      "author": {
        "name": "小肖吃点啥呢",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo322870nc1n4005o7uhbdgbhm14uhqrmo"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a5909b000000003401760b?xsec_token=ABAGtrrS0w5pLKIte2XwU4DB0MRWUm33YCxm2RC0bOHvM=&xsec_source=pc_feed"
    },
    {
      "id": "64a2a49600000000350083f1",
      "title": "适合中国宝宝的减脂餐",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/3dd548ceb029ab75cb6f2ea602934095/1000g0082oa5kdaijq0005o5stgeg9asu540i16g!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "1.6万",
      "author": {
        "name": "土豆子超会吃",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31ns54hat58005o5stgeg9asu2i12fng"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a2a49600000000350083f1?xsec_token=ABGUhlIzHicpwnEvnvohYn1pY5Q5aJAjtvw_nZO5yVB6M=&xsec_source=pc_feed"
    },
    {
      "id": "64ab93e3000000003100b7fc",
      "title": "在成都好幸福！花纹漂亮的和牛烧肉！",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/ff9f5534d3b185064f25fb322c5b0e22/1000g0082peqtiask804g49t46t1nhmj2c5g6m40!nc_n_nwebp_mw_1",
      "coverWidth": 1536,
      "coverHeight": 2049,
      "type": "normal",
      "likes": "74",
      "author": {
        "name": "斧子和蓝二",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/5e7038006e6a370001519116.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64ab93e3000000003100b7fc?xsec_token=ABtBwHcu7rrk2ZOH0uuALyQJS61Nag96GQpj-lGfMT1po=&xsec_source=pc_feed"
    },
    {
      "id": "649fd8160000000012032586",
      "title": "2023年白色系有点高级的月饼礼盒",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/877229032376e7b15f77eff9c89839ba/1000g0082nv5fkkek406g5nktcqr09b6ijfu4pgo!nc_n_nwebp_mw_1",
      "coverWidth": 2560,
      "coverHeight": 2560,
      "type": "normal",
      "likes": "150",
      "author": {
        "name": "A大猫焙",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/5e9eceb8a4aed70001e1994b.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/649fd8160000000012032586?xsec_token=ABhWd1qG6hXifjzQR6gI6cRea13GOUgi2R-xKuqCWVZ6U=&xsec_source=pc_feed"
    },
    {
      "id": "64a39750000000002301d09c",
      "title": "全网最详细的阳朔啤酒鱼教学",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/8362f46117c16204342efec8c61a6109/spectrum/1000g0k02odpimomju0005opl60i6bvl04tp4v40!nc_n_nwebp_mw_1",
      "coverWidth": 1080,
      "coverHeight": 1440,
      "type": "video",
      "likes": "554",
      "author": {
        "name": "广西华南烹饪技工学校",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/4f55c040-3278-3976-9de9-000c380144a1"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a39750000000002301d09c?xsec_token=AB5j0tJkRGReVUgBJ6Phht0NzUdvFs8ZjsCfPDZCuoLYE=&xsec_source=pc_feed"
    },
    {
      "id": "64a02bc7000000000800ee05",
      "title": "脆皮软心砖",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/19d9b26e3c3cdfccfc1e8af3d3853017/1000g0082o0e8mqgjs06049vftuca8jk8g512tt8!nc_n_nwebp_mw_1",
      "coverWidth": 1280,
      "coverHeight": 720,
      "type": "video",
      "likes": "99",
      "author": {
        "name": "雨神解压",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo3200rt3dn3q0049vftuca8jk8f2bq0qg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a02bc7000000000800ee05?xsec_token=AB7F7OTfM7z8Wy4FYWzkdUpo5GjG8J8WUtlqeSaCwX55k=&xsec_source=pc_feed"
    },
    {
      "id": "64ad41cb000000002f0279f8",
      "title": "🐟🥚",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/53c215c5481473347623f4acb790f76b/1000g0082pji38mkji0005ocvke28d7psn5u9eq0!nc_n_nwebp_mw_1",
      "coverWidth": 1920,
      "coverHeight": 2560,
      "type": "normal",
      "likes": "1176",
      "author": {
        "name": "flattert0oi",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/65c33fa0b078c8a23956235e.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64ad41cb000000002f0279f8?xsec_token=AB8XxhD7hIPjXeHj7oPqfv4do8w7NbOz6wOCQuGkIeJ4U=&xsec_source=pc_feed"
    },
    {
      "id": "64a3a4c70000000031008629",
      "title": "我的素食生活，朋友家里做客，做了几道小菜",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/c0dea57c30695b3d64cf034699ca4c5a/1000g0082oe0dsfkk406g5n9f1tf5lei1k0ocob0!nc_n_nwebp_mw_1",
      "coverWidth": 1920,
      "coverHeight": 2560,
      "type": "video",
      "likes": "1248",
      "author": {
        "name": "杨鼎子的素食生活",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo323mdsd1bga005n9f1tf5lei1d1cjv50"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a3a4c70000000031008629?xsec_token=AB5j0tJkRGReVUgBJ6Phht0DeWKWFRTTbrTfg-mYvZAH4=&xsec_source=pc_feed"
    },
    {
      "id": "64a2c2e30000000012012832",
      "title": "我的周日都忙些什么",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/0c7b09858ea4e4f72bd43faae283b802/1000g0082oai4bd0ji0004a6kes00s9bbda0md60!nc_n_nwebp_mw_1",
      "coverWidth": 2560,
      "coverHeight": 1870,
      "type": "normal",
      "likes": "61",
      "author": {
        "name": "苏凯凯的半亩花田👒🌻",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31udjne152s004a6kes00s9bb7s73sp0"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a2c2e30000000012012832?xsec_token=ABGUhlIzHicpwnEvnvohYn1qc4RfmNUuMRksTTUUEG5wI=&xsec_source=pc_feed"
    },
    {
      "id": "64ae1fd6000000001e019f97",
      "title": "感觉收到的好晚啊",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/f2c97042fcc16f9b7417f6c5e99fba90/1000g0082pmuec7aji00g5nubcmh08dgu3b1v5b8!nc_n_nwebp_mw_1",
      "coverWidth": 1080,
      "coverHeight": 1440,
      "type": "video",
      "likes": "515",
      "author": {
        "name": "WRYUE-",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo3165ko0i3gm005nubcmh08dgusldeodo"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64ae1fd6000000001e019f97?xsec_token=ABZH4iz_PXNTR3vE2I-1KB53zmf2ta6cbE7sXQAlALeoI=&xsec_source=pc_feed"
    },
    {
      "id": "64a54db3000000003100b5c2",
      "title": "vlog日常｜芋泥香酥鸭+抱蛋肥牛饭+芋圆牛奶",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/c98fa3a04faf9b9f9abe9fd899037b35/1000g0082okftc12ji0005n176h91blgabgosaho!nc_n_nwebp_mw_1",
      "coverWidth": 1170,
      "coverHeight": 1560,
      "type": "video",
      "likes": "9363",
      "author": {
        "name": "阿顾吃不饱",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/5f16620ca736590001b1d915.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a54db3000000003100b5c2?xsec_token=ABAGtrrS0w5pLKIte2XwU4DJtpX8nPf6TWx_qZbMC-nZY=&xsec_source=pc_feed"
    },
    {
      "id": "64ad1e3a000000002b03cbe6",
      "title": "用云南的配方拌了个面！！这也太好吃了吧🥹",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/386d53251f86acc638979683ce2ed3ac/1000g0082piufpcek804g4bj48nhruc649pa0mio!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "116",
      "author": {
        "name": "石榴",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31cn5ietu0e005nqs4ncg884shlkqluo"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64ad1e3a000000002b03cbe6?xsec_token=AB8XxhD7hIPjXeHj7oPqfv4fkK1G8T-YeGRXarK2oxiGo=&xsec_source=pc_feed"
    },
    {
      "id": "64ab6ef20000000035008340",
      "title": "乌鲁木齐深店｜茹菲安西餐厅💕🍹",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/e8c0fb7de4fcef35e2ee1b079173f889/03037a01kszrrs4858y010mryt5058fl06!nc_n_nwebp_mw_1",
      "coverWidth": 1280,
      "coverHeight": 1706,
      "type": "normal",
      "likes": "45",
      "author": {
        "name": "sᴀʏɪᴅᴀ · ᴋ",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo3252b45vr3i005oesf0nk1c4icqqji68"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64ab6ef20000000035008340?xsec_token=ABtBwHcu7rrk2ZOH0uuALyQFcuSYVAqa1vwWGn7BREFGg=&xsec_source=pc_feed"
    },
    {
      "id": "64aa902b00000000230358f7",
      "title": "30岁单亲妈妈和儿子的晚餐",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/5efd96f4d0564ffc63e48af5ccaee52b/1000g0082p91bvnajq00g5p103up4ie12oh8r2cg!nc_n_nwebp_mw_1",
      "coverWidth": 1280,
      "coverHeight": 1707,
      "type": "normal",
      "likes": "209",
      "author": {
        "name": "小肥仔的妈妈",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/6468d77b80abdcddd7cdb736.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64aa902b00000000230358f7?xsec_token=AB6IVlhKW3peH0kdrjKXPwl3mi0pSpUgazAFBTlPCNLrY=&xsec_source=pc_feed"
    },
    {
      "id": "64afd2a7000000003102efc6",
      "title": "回家晚餐🛋️",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/b7e5bfbda3d79a0c7df99dc910eb890c/1000g0082ptiqe8mjs0005n926imka86ujr1dfdg!nc_n_nwebp_mw_1",
      "coverWidth": 1920,
      "coverHeight": 2560,
      "type": "normal",
      "likes": "5379",
      "author": {
        "name": "多忙丸丸",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/626a6f2f8e95ddcafcdf4ff9.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64afd2a7000000003102efc6?xsec_token=ABUs6nQ_nzJOf90ob0oMj4wM7ha_tABjkckXPJAEBlz0o=&xsec_source=pc_feed"
    },
    {
      "id": "64a38c85000000002301d7ac",
      "title": "东北人血脉觉醒的一餐",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/fb052f6cf0edc979a7e49a3d22ebbaa1/1000g0082odkdoq6jm0005n1gim41hglov5j38i8!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "75",
      "author": {
        "name": "豹饮豹食（减脂版",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo30vq5ql9lm6005n1gim41hgloutb4agg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a38c85000000002301d7ac?xsec_token=AB5j0tJkRGReVUgBJ6Phht0PpGVnjR5Z38lnOzUuhyMiw=&xsec_source=pc_feed"
    },
    {
      "id": "64a53501000000003500bcbf",
      "title": "𝑺𝒉𝒂𝒓𝒆 | 🧬多巴胺酸奶碗",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/d68d753c0bf24c4813948892dd89ed13/1000g0082ok3r416jm0005opbsd4oss3v6b5b1ag!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "7108",
      "author": {
        "name": "唯",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/6465fa14d642153b48929b8a.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a53501000000003500bcbf?xsec_token=ABAGtrrS0w5pLKIte2XwU4DPonBnyKzSpkhOVms_5tCx4=&xsec_source=pc_feed"
    },
    {
      "id": "64a555c3000000002301f90a",
      "title": "167 46kg一天吃什么｜好撑好撑(• ▽ •;)",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/36a878e221ba7f02a24a3342aa186bff/1000g0082okjp6e0ju0004a1hfdunt1d9snupas8!nc_n_nwebp_mw_1",
      "coverWidth": 1125,
      "coverHeight": 1500,
      "type": "video",
      "likes": "182",
      "author": {
        "name": "何饱不吃饱",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31blk0gvu10004a1hfdunt1d9tfolavo"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a555c3000000002301f90a?xsec_token=ABAGtrrS0w5pLKIte2XwU4DKXzV3F0VhvijnaxHq_JaPg=&xsec_source=pc_feed"
    },
    {
      "id": "64a3efca000000002301e072",
      "title": "脆皮抹茶奶酪派｜抹茶脑袋真的爱了！好好吃",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/139e59925271c7a5feb26b9841420e5e/1000g0082of51vsok600049vbjon811p67natb3g!nc_n_nwebp_mw_1",
      "coverWidth": 1080,
      "coverHeight": 1440,
      "type": "video",
      "likes": "1.3万",
      "author": {
        "name": "一只小谭呀",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/647dfefbbe0463ec9afe49d5.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a3efca000000002301e072?xsec_token=AB5j0tJkRGReVUgBJ6Phht0Mu-c6ymhEoT6ZjqASem3KM=&xsec_source=pc_feed"
    },
    {
      "id": "649fb8660000000013000463",
      "title": "6.13-6.30",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220008/f33006f856f8d527dcf01a282ae97b72/1000g0082nulsk8ojm01049rdlf2sfo8a8a00opg!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "27",
      "author": {
        "name": "一男的，",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/63f1e4741a5c041f3a67e173.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/649fb8660000000013000463?xsec_token=ABhWd1qG6hXifjzQR6gI6cRY9qbhm2HDbP9xxh4JA0Oyk=&xsec_source=pc_feed"
    }
  ],
  "职场": [
    {
      "id": "64a28e3e000000001a0136ef",
      "title": "如果你特别想要一份工作应该怎么办？",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220001/6107efaa18286d4436557193e7c8c2de/1000g0082onpggagji01049labg0v3kdfvthta6g!nc_n_nwebp_mw_1",
      "coverWidth": 1283,
      "coverHeight": 1686,
      "type": "normal",
      "likes": "1346",
      "author": {
        "name": "迎十里",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/63c29eb8904bb17aa585edd2.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a28e3e000000001a0136ef?xsec_token=ABGUhlIzHicpwnEvnvohYn1hIlOsqFLsAwkq8gC7TBZbg=&xsec_source=pc_feed"
    },
    {
      "id": "64a3c95300000000150310f7",
      "title": "千万工程，今日热点，我建议你全文背诵",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220001/b08281935f2e996a21b4626cfc866f54/1000g0082oebg4l8k803g450s5dlatprj061qs18!nc_n_nwebp_mw_1",
      "coverWidth": 1024,
      "coverHeight": 1024,
      "type": "normal",
      "likes": "228",
      "author": {
        "name": "大老师和他的朋友们",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31sq5v3435s6g450s5dlatprjrclo2h0"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a3c95300000000150310f7?xsec_token=AB5j0tJkRGReVUgBJ6Phht0MRS-gFVIUjDo48BOuUz-uA=&xsec_source=pc_feed"
    },
    {
      "id": "64a6851900000000310094d8",
      "title": "今日稿费327，抄人物故事也能赚钱",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220001/ae96115e8849dadeefacb151a7f5d54e/1000g0082op7uvhqjs0605otagrepi02l0f0jir0!nc_n_nwebp_mw_1",
      "coverWidth": 1920,
      "coverHeight": 2560,
      "type": "normal",
      "likes": "691",
      "author": {
        "name": "小能成长日记",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/643e11dbbb7ee62fdf90603e.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a6851900000000310094d8?xsec_token=AB76hIWISzJVOBWz3CirbT985uQOXPNut36MtTLqyKPqU=&xsec_source=pc_feed"
    },
    {
      "id": "64a63f23000000002b03eb0c",
      "title": "各位亲，别催了，习题班这不就来了",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220001/205fa4c2b27848eaa0fb73673f76f663/spectrum/1000g0k02onsromqji0005om2l5tmdfgprsm2v8g!nc_n_nwebp_mw_1",
      "coverWidth": 240,
      "coverHeight": 240,
      "type": "normal",
      "likes": "379",
      "author": {
        "name": "张敬富老师",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/634940a511cbff945d6a740a.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a63f23000000002b03eb0c?xsec_token=AB76hIWISzJVOBWz3CirbT9xrylDrbxUaTUYjbGTKisjE=&xsec_source=pc_feed"
    },
    {
      "id": "64ab96a8000000002f025efc",
      "title": "店铺升级后的HOLAHOLA🌟",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220001/d9d553bd4890e6afc2aed73c5aa12af9/1000g0082pd1gu9mju06g5opobc7m54fltc6slbg!nc_n_nwebp_mw_1",
      "coverWidth": 2560,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "308",
      "author": {
        "name": "HOLA HOLA KPOP",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31444vbun2e6g5opobc7m54fljnrcic8"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64ab96a8000000002f025efc?xsec_token=ABtBwHcu7rrk2ZOH0uuALyQNip9xu-AW8Sk2Bl0QIvsVA=&xsec_source=pc_feed"
    },
    {
      "id": "64ad356e000000001e019100",
      "title": "14岁女孩月入4位数!",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220001/6375d4cf3a62e90dbf51b7dfa486bbec/1000g0082pjc25k2jm06g5op58u18vo5h6bc57sg!nc_n_nwebp_mw_1",
      "coverWidth": 1080,
      "coverHeight": 1920,
      "type": "video",
      "likes": "2258",
      "author": {
        "name": "系妹纸",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31h6hu7ktj4005op58u18vo5hdue5rog"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64ad356e000000001e019100?xsec_token=AB8XxhD7hIPjXeHj7oPqfv4eebS2Kk4PAPE_FftF7oc74=&xsec_source=pc_feed"
    },
    {
      "id": "64a6f477000000001c00dc2a",
      "title": "大学生摆摊卖手串，能赚多少？第五天",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220001/4c8bbd4520d71c96a91b0e4756a692c7/1000g0082oquab92k80005omcmt13hi0ekte6bng!nc_n_nwebp_mw_1",
      "coverWidth": 1080,
      "coverHeight": 1440,
      "type": "video",
      "likes": "1263",
      "author": {
        "name": "羊万万的朋友圈.",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31jrkvmndj2005omcmt13hi0e5vnk65o"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a6f477000000001c00dc2a?xsec_token=AB76hIWISzJVOBWz3CirbT95fe523vuWPCdGO_KHgDIhw=&xsec_source=pc_feed"
    },
    {
      "id": "64a75d670000000035008ba2",
      "title": "昨晚群发260+ 早上一看手机全是PO",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220001/ebf99474f72321a5640cd5f8e970adbe/1000g0082oshil5ik40005nfkbur09eaejf9p090!nc_n_nwebp_mw_1",
      "coverWidth": 750,
      "coverHeight": 1334,
      "type": "normal",
      "likes": "40",
      "author": {
        "name": "外贸BOB",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo3218q9gh3ms005nfkbur09eae0gfcr9o"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a75d670000000035008ba2?xsec_token=ABiZBO7VhFKBtbIJuwS1YLbSb4bAkL2raq6z4mkT0smKc=&xsec_source=pc_feed"
    },
    {
      "id": "64a353a60000000031009d1d",
      "title": "早起学习3小时",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220001/759c426dc1102b6b9ab21dfb570ac2f5/1000g0082ocoqbngjm00g5o6vbd308hlu3nnpkvg!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "75",
      "author": {
        "name": "我又学习了",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/64498d991300c5cf9d372cc5.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a353a60000000031009d1d?xsec_token=AB5j0tJkRGReVUgBJ6Phht0CFqOlnImQepjFF6PAzUWU0=&xsec_source=pc_feed"
    },
    {
      "id": "64a119d4000000002700213f",
      "title": "招募看摊！招募兼职！漫展看摊",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220001/c45bcbfe535b12c5340f694c48a99727/1000g0082o42ith0ji0005ntffnf0831gt5ukc38!nc_n_nwebp_mw_1",
      "coverWidth": 1153,
      "coverHeight": 788,
      "type": "normal",
      "likes": "11",
      "author": {
        "name": "丸子元气工作室",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/641ad55d0e6651da5965fe84.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a119d4000000002700213f?xsec_token=ABAPu45bW13_SwHPWPuws4uPlzFMATQ5Tjd6er_WJtQJw=&xsec_source=pc_feed"
    },
    {
      "id": "64a53174000000001e011e8d",
      "title": "愿你合笔那一刻，有收刀入鞘的骄傲!",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220001/bc6ccf7e1a6025970d3218ddd316f30d/1000g0082ok23dlak606g4adbc1puqvnbrtllj8g!nc_n_nwebp_mw_1",
      "coverWidth": 1920,
      "coverHeight": 2559,
      "type": "normal",
      "likes": "42",
      "author": {
        "name": "小小妮的语文课",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31e5ef0li0s6g4adbc1puqvnb1tkt5s0"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a53174000000001e011e8d?xsec_token=ABAGtrrS0w5pLKIte2XwU4DKH4mIcHsI8so3yIXfWQHFY=&xsec_source=pc_feed"
    },
    {
      "id": "64a037bc0000000027010df7",
      "title": "英语教招面试｜板书设计思路",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220001/69e8131f6681b12ae4c988cf3f88c110/1000g0082o0k65gojs00048binqqkr0sorg8s5m0!nc_n_nwebp_mw_1",
      "coverWidth": 1280,
      "coverHeight": 1707,
      "type": "normal",
      "likes": "124",
      "author": {
        "name": "Zzz",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31djul7vlgm0048binqqkr0so4qr9ivg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a037bc0000000027010df7?xsec_token=AB7F7OTfM7z8Wy4FYWzkdUpvpLcaBVaarcy1AHe_sfAPI=&xsec_source=pc_feed"
    },
    {
      "id": "64a3e074000000003401421d",
      "title": "教师面试真题丨考生86.89分作答参考",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220001/28239236ef0034fda6ba3f7d76b07638/1000g0082oetie4mjq0605nhrj98g8iebblch6g0!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "video",
      "likes": "98",
      "author": {
        "name": "尚佰考编咨询服务",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo321oil6k37e005nhrj98g8iebh2ullr8"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a3e074000000003401421d?xsec_token=AB5j0tJkRGReVUgBJ6Phht0PmJ4q6BZzaO5MlgIgUcvlI=&xsec_source=pc_feed"
    },
    {
      "id": "64a3dad0000000003500a177",
      "title": "做模特赚了三千万",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220001/0009e8a1e511f3236b7a0dbd00154899/1000g0082oeqq6majs00g5n5kgr54n6nhqbv8ttg!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "525",
      "author": {
        "name": "Jin锦城",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/626ff5b78a4324004ed3ef8a.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a3dad0000000003500a177?xsec_token=AB5j0tJkRGReVUgBJ6Phht0ERjkRLAjRQ2hltwwgiGzCo=&xsec_source=pc_feed"
    },
    {
      "id": "64a6dfa8000000001602417b",
      "title": "实习一样不耽误姐嘎嘎学",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220001/b8299ebd5cdec9e000cd8f996cc9c27c/1000g0082oqk4kgik40005ofulvkk1laduaulusg!nc_n_nwebp_mw_1",
      "coverWidth": 1440,
      "coverHeight": 1920,
      "type": "normal",
      "likes": "905",
      "author": {
        "name": "一只蛋挞",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/645a2b4d1300c5cf9d3a22d3.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a6dfa8000000001602417b?xsec_token=AB76hIWISzJVOBWz3CirbT98qLG1E3T7WR2U4gJrioe5s=&xsec_source=pc_feed"
    },
    {
      "id": "64a9428f000000003401517c",
      "title": "这个方法看完秒懂！挤五瓣花小技巧",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220001/8a5164f74a19d45aaff22b77ada1b08b/1000g0082p3ufas8jm06g5obmbto0jbmb0dakjl8!nc_n_nwebp_mw_1",
      "coverWidth": 1920,
      "coverHeight": 2560,
      "type": "video",
      "likes": "943",
      "author": {
        "name": "米诺淇裱花郭老师",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo320bc7k5c5s705obmbto0jbmbtljfh9g"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a9428f000000003401517c?xsec_token=ABLoiHV-amiurHpzoLHH6U6QoEcV1O2bmk7kca9v1H-eU=&xsec_source=pc_feed"
    },
    {
      "id": "64aebea7000000001c00f332",
      "title": "✂️📏🥋这个工作室还是我的梦想服装工作室",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220001/26050a6e28584dfbfa3dd65a89563218/1000g0082ppc28baju000454g1vg4q98tpq7vndo!nc_n_nwebp_mw_1",
      "coverWidth": 600,
      "coverHeight": 756,
      "type": "normal",
      "likes": "855",
      "author": {
        "name": "静静的做衣服",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/61dd3620990745df4517d7e1.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64aebea7000000001c00f332?xsec_token=ABZH4iz_PXNTR3vE2I-1KB54eRIGBy7zM5ONbls15pAv4=&xsec_source=pc_feed"
    },
    {
      "id": "64ae5d0e000000002b03dcd2",
      "title": "98女生vlog ｜把期望降低 所有遇见都是礼物",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220001/cc41683ad3c5b8e7eaa2323f00de5e5e/1040g008325aoqe564q3g4924osmgev09rccfisg!nc_n_nwebp_mw_1",
      "coverWidth": 1080,
      "coverHeight": 1440,
      "type": "video",
      "likes": "741",
      "author": {
        "name": "小好梦",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/62c9aead160962dc1ecb930d.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64ae5d0e000000002b03dcd2?xsec_token=ABZH4iz_PXNTR3vE2I-1KB59LrlvuPs-r5HVGwtdkACqE=&xsec_source=pc_feed"
    },
    {
      "id": "64a156e5000000001303171c",
      "title": "一万流水到五万流水的蜕变之路",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220001/96d7404145de181ea4be49a69438fd2c/1000g0082o4vunlojm0405o76lt2gbm101jd2r28!nc_n_nwebp_mw_1",
      "coverWidth": 1920,
      "coverHeight": 2560,
      "type": "video",
      "likes": "764",
      "author": {
        "name": "电子运营orz夏天",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1000g2jo2oi9ucm2k40405o76lt2gbm1091okajo"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a156e5000000001303171c?xsec_token=ABAPu45bW13_SwHPWPuws4uDEHYwB1oo4H5gtNsEdN1mU=&xsec_source=pc_feed"
    },
    {
      "id": "64a372e1000000001c00cb4a",
      "title": "写作：青春与使命同行，奋进与荣光相伴",
      "cover": "https://sns-webpic-qc.xhscdn.com/202609220001/4ca2d6fca04453fa90e042a1dd4d932d/1000g0082od82ab6k406g5oa8k76gkh4pcqi0oa8!nc_n_nwebp_mw_1",
      "coverWidth": 1280,
      "coverHeight": 720,
      "type": "normal",
      "likes": "236",
      "author": {
        "name": "辅导员文老师",
        "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/6244837acd420bda597da830.jpg"
      },
      "noteUrl": "https://www.xiaohongshu.com/explore/64a372e1000000001c00cb4a?xsec_token=AB5j0tJkRGReVUgBJ6Phht0NVb1YaAc_n6nmonZMuMEU8=&xsec_source=pc_feed"
    }
  ]
};

export function getStaticFeed(channel: string, page = 1, pageSize = 20): FeedResult {
  const ch = channel || "推荐";
  let pool = STATIC_FEEDS[ch];
  if (!pool || pool.length === 0) {
    // 若特定频道没有单独缓存，使用推荐流笔记作为基础池
    pool = STATIC_FEEDS["推荐"] || [];
  }
  
  // 模拟分页与轮转加载
  const total = pool.length;
  const start = ((page - 1) * pageSize) % total;
  let notes: Note[] = [];
  if (total > 0) {
    for (let i = 0; i < Math.min(pageSize, total); i++) {
      const idx = (start + i) % total;
      notes.push(pool[idx]);
    }
  }

  return {
    channel: ch,
    channelId: "static_" + ch,
    fetchedAt: new Date().toISOString(),
    count: notes.length,
    notes,
    cached: true,
  };
}
