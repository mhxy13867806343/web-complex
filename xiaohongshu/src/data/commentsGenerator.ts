import type { CommentItem } from './index'

export const XHS_USERS_POOL = [
  { name: '海盐芝士桃桃', avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/60fae49403408d92e68f4952.jpg' },
  { name: '双鱼小丸子', avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/639bfe10057e361e364e028f.jpg' },
  { name: '嘻嘻琪mq', avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/5e76215f14abbc00017e6f73.jpg' },
  { name: '姜涞的世界', avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/64337fadd3e7380001eb4124.jpg' },
  { name: '抹茶小可可', avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/623f2a741de1aea6b4e5e2cb.jpg' },
  { name: '一只橘猫路过', avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/6497121fbbeea8114fed42bd.jpg' },
  { name: '一颗小番茄', avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/6102a9000000000001025a1e.jpg' },
  { name: '晚风吹行舟', avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/617b01b600000000010041eb.jpg' },
  { name: '碳水爱好者小陈', avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/619890f5000000000102bed6.jpg' },
  { name: '早睡早起身体好', avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/61ba889d0000000001026526.jpg' },
  { name: '落日飞车', avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/625fd9f800000000100084fc.jpg' },
  { name: '乌龙不加冰', avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/62a4a350000000001b023fc6.jpg' },
  { name: '暴躁网友在线摸鱼', avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/631481b9000000001201d4a0.jpg' },
  { name: '爱喝冰美式的小张', avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/63a566ee000000001f01cba6.jpg' },
  { name: 'momo', avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/642a8b94000000001300aa38.jpg' },
  { name: '芝士奶盖不加糖', avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/648b2611000000001300cb21.jpg' },
  { name: '七秒记忆的鱼', avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/64a95472000000001e018e48.jpg' },
  { name: '人间观察员', avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/64ab464e000000001a010df9.jpg' },
]

export const PROVINCES = [
  '广东', '北京', '上海', '浙江', '江苏', '四川', '山东', '福建',
  '湖北', '河南', '湖南', '陕西', '辽宁', '重庆', '天津', '安徽'
]

export const CATEGORY_COMMENTS: Record<string, Array<{ content: string; sub: string }>> = {
  // 搞笑 / 萌宠 / 鱼 / 抽象 / 精神状态
  humor_pet: [
    {
      content: '哈哈哈哈救命！这条鱼演我周一上班的状态，死气沉沉又不得不活着[笑哭R]',
      sub: '真相了，眼神里充满了对鱼生的看破和绝望',
    },
    {
      content: '鱼：你礼貌吗？我只是在思考鱼生[捂脸R]',
      sub: '鱼：累了，这个世界毁灭吧，赶紧的',
    },
    {
      content: '怎么能这么抽象又真实，当代打工人精神状态具象化！',
      sub: '',
    },
    {
      content: '太真实了，简直是我本人的日常写照，已经火速保存做表情包了',
      sub: '已偷图！朋友问我为什么笑得这么大声哈哈哈哈',
    },
    {
      content: '哈哈哈哈哈哈点开前没想到这么好笑，承包了我今天的快乐源泉',
      sub: '已经在工位上憋笑憋到内伤了哈哈哈哈',
    },
  ],
  // 美妆 / 护肤 / 口红 / 防晒 / 面霜 / 彩妆
  beauty_skincare: [
    {
      content: '混油皮用这个会闷痘或者搓泥吗？求姐妹真实使用反馈！',
      sub: '同混油痘肌，亲测做好水乳打底完全不闷，而且早上起来控油很不错！',
    },
    {
      content: '刚入手同款！香味真的很高级很治愈，希望坚持用一个月能明显改善毛孔[害羞R]',
      sub: '',
    },
    {
      content: '被博主疯狂种草了，想问下干皮秋冬用滋润度够不够呀？',
      sub: '干皮可以直接冲面霜，保湿力超级扎实，上妆完全不卡粉了',
    },
    {
      content: '博主能出个详细的手法按摩教程吗？手法看着太专业了，立马关注收藏！',
      sub: '同蹲！想看眼部和提拉手法教程',
    },
    {
      content: '用空两瓶的老粉举手！抗老紧致效果确实肉眼可见，回购清单第一名',
      sub: '',
    },
  ],
  // 穿搭 / 时尚 / OOTD / 衣服 / 鞋包
  fashion_outfit: [
    {
      content: '这个配色太高级了！请问博主身高体重多少呀，想做个尺码参考～',
      sub: '博主163cm/48kg，买的S码正合适，版型巨显瘦！',
    },
    {
      content: '疯狂心动！蹲一个外套和裤子的货号或者关键词，求链接！',
      sub: '同蹲！裤型真的修饰腿型绝了',
    },
    {
      content: '松弛感拉满，整个色系搭配看着好舒服，审美真的太在线了',
      sub: '',
    },
    {
      content: '这套真的好有高级感，请把这套衣服直接焊在身上！',
      sub: '',
    },
    {
      content: '日常通勤完全可以照抄！实用又时髦，已经火速码住',
      sub: '终于找到适合微胖身材的穿搭模板了，感谢博主！',
    },
  ],
  // 美食 / 探店 / 做饭 / 烘焙 / 食谱
  food_cooking: [
    {
      content: '看得我口水直流！请问这个酱汁的调料比例是多少呀？',
      sub: '生抽2勺、香醋1勺、蚝油半勺、蒜末小米辣少许，热油一泼绝了！',
    },
    {
      content: '这家店我也去过！招牌真的超级惊艳，一定要趁热吃',
      sub: '没错！他们家的招牌必点，分量也很足',
    },
    {
      content: '深夜刷到这个太折磨了，肚子不争气地叫了，明天必须安排上！',
      sub: '',
    },
    {
      content: '手残党看了都觉得能学会，步骤拍得好清晰，太贴心了',
      sub: '周末照着博主教程做成功了！家人都夸好吃',
    },
    {
      content: '隔着屏幕都能闻到香味，博主太会做了，立马马住周末照做！',
      sub: '',
    },
  ],
  // 影视 / 演员 / 演技 / 台词 / 电影 / 电视剧
  film_acting: [
    {
      content: '说实话 大院就会给这种表演高分 因为现在大家都这样模式化 没有任何灵气 随便翻一个艺考拿大院前几名的 哪一个是真情 而且人家长得好看不管演成什么样都会给高分',
      sub: '真相了，大院都喜欢这种台词腔',
    },
    {
      content: '很多台词都把重点放在功底，咬字，用标准的声音变成了张力，忘了真正的表演是浸润情境',
      sub: '非常赞同，很多年轻演员缺少了生活体验，演得很紧绷',
    },
    {
      content: '演员的情绪转折很自然，最后那个眼神戏真的很有感染力，看哭了',
      sub: '',
    },
    {
      content: '台词功底太扎实了，声音很有辨识度，未来可期！',
      sub: '',
    },
    {
      content: '分析得太到位了，完全说出了我的心声，专业！',
      sub: '终于有人说出这一点了，大赞',
    },
  ],
  // 职场 / 工作 / 搞钱 / 简历 / 面试
  workplace_career: [
    {
      content: '太真实了，简直世另我！职场遇到这种情况真的会内耗死[捂脸R]',
      sub: '千万别内耗，上班是来搞钱的，下班立刻开启自己的人生！',
    },
    {
      content: '干货满满，学到了很多高情商沟通和向上汇报的技巧，受教了',
      sub: '',
    },
    {
      content: '同感！成年人的职场生存法则，及时止损比什么都重要',
      sub: '',
    },
    {
      content: '看完醍醐灌顶，明天上班就按博主的方法去试试看',
      sub: '亲测有效！领导态度明显变温和了，沟通效率翻倍',
    },
  ],
  // 旅行 / 攻略 / 拍照 / 景点 / 露营
  travel_outdoor: [
    {
      content: '太美了！请问博主是几月份去的呀？现在去需要提前多久预约门票？',
      sub: '建议提前3-5天在官方公众号预约哦，上午10点光线拍照最出片！',
    },
    {
      content: '已经被种草了！赶紧收藏进我的旅行心愿单，感谢博主的保姆级攻略',
      sub: '',
    },
    {
      content: '风景绝了，构图和色调拍得好高级，求个滤镜参数～',
      sub: '',
    },
    {
      content: '这里真的超级适合放空，远离城市喧嚣，太治愈了',
      sub: '请问附近有推荐的住宿吗？带父母去方便吗？',
    },
  ],
  // 游戏 / 手游 / 数码 / 攻略
  gaming_tech: [
    {
      content: '这一关卡了我整整三天！看完博主的打法终于一把过了，怒赞！',
      sub: '哈哈过关了就好，关键就是第二阶段注意走位和控怒气',
    },
    {
      content: '这个阵容搭配思路太绝了，低练度也能照抄作业，太牛了',
      sub: '',
    },
    {
      content: '吸欧气吸欧气！希望我下一发十连也能直接出金！',
      sub: '',
    },
    {
      content: '测评好硬核，优缺点都讲得很客观，果断关注了',
      sub: '',
    },
  ],
  // 通用生活 / 默认兜底
  general_lifestyle: [
    {
      content: '太治愈了，日常就喜欢刷这种真实又有干货的笔记，给博主点赞啦～',
      sub: '同喜欢博主的风格，很真实很接地气',
    },
    {
      content: '看了博主的分享感觉生活又充满了动力，认真生活的人都在闪闪发光✨',
      sub: '',
    },
    {
      content: '好喜欢这个色调和排版，审美真的在线，果断关注了！',
      sub: '',
    },
    {
      content: '不知不觉看了好几遍，内容做得太用心了，必须给个大大的赞！',
      sub: '已经分享给闺蜜了，一起学习！',
    },
  ],
}

export function detectNoteCategory(text: string): string {
  const t = (text || '').toLowerCase()
  if (/鱼|精神状态|动物|猫|狗|宠物|搞笑|幽默|抽象|演我|治愈|段子|笑话|沙雕/.test(t)) return 'humor_pet'
  if (/护肤|面霜|防晒|水乳|神仙水|敏感肌|混油|干皮|油皮|痘|口红|粉底|遮瑕|卸妆|眼霜|精华|彩妆|美妆|sk2|眼影|修容/.test(t)) return 'beauty_skincare'
  if (/穿搭|ootd|外套|裤|裙|显瘦|鞋|包|搭配|复古|卫衣|毛衣|大衣|西装|风衣|气质|氛围感|女装|男装|光夜|首饰/.test(t)) return 'fashion_outfit'
  if (/美食|吃|好吃|做法|食谱|菜谱|做饭|烘焙|蛋糕|面包|甜品|甜点|奶茶|咖啡|餐厅|探店|减脂餐|蒜香|火锅|烤肉|炸鸡/.test(t)) return 'food_cooking'
  if (/演技|表演|台词|电影|剧|大院|艺考|导演|演员|剧情|角色|影评|追剧|综艺|短剧/.test(t)) return 'film_acting'
  if (/职场|工作|同事|领导|辞职|面试|实习|搞钱|打工人|升职|汇报|下班|跳槽|简历/.test(t)) return 'workplace_career'
  if (/旅行|旅游|攻略|拍照|酒店|门票|路线|景点|自驾|露营|徒步|风景|打卡|古镇|海边|游玩/.test(t)) return 'travel_outdoor'
  if (/游戏|手游|通关|阵容|副本|抽卡|段位|王者|原神|数码|手机|电脑|测评/.test(t)) return 'gaming_tech'
  return 'general_lifestyle'
}

export function hashString(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

/** 生成基于笔记主题的动态专属评论（零外部请求，零 404） */
export function generateDynamicComments(
  noteId: string,
  title = '',
  tags: string[] = [],
  commentCount = ''
): { count: number; comments: CommentItem[] } {
  const cleanTitle = (title || '').trim()
  const combinedText = `${cleanTitle} ${tags.join(' ')}`
  const cat = detectNoteCategory(combinedText)

  let countNumber = 28
  if (commentCount) {
    if (commentCount.includes('万')) {
      countNumber = Math.round(parseFloat(commentCount) * 10000)
    } else {
      const parsed = parseInt(commentCount, 10)
      if (!Number.isNaN(parsed) && parsed > 0) countNumber = parsed
    }
  } else {
    countNumber = 18 + (hashString(noteId) % 80)
  }

  const seed = hashString(noteId)
  const pool = CATEGORY_COMMENTS[cat] || CATEGORY_COMMENTS.general_lifestyle
  const userOffset = seed % XHS_USERS_POOL.length
  const provOffset = seed % PROVINCES.length

  const comments: CommentItem[] = []

  // 1. 2~3 条分类专属深度评论
  const chosenIndexes = [seed % pool.length, (seed + 2) % pool.length, (seed + 4) % pool.length]
  const uniqueIndexes = [...new Set(chosenIndexes)]

  uniqueIndexes.forEach((idx, i) => {
    const item = pool[idx]
    if (!item) return
    const u = XHS_USERS_POOL[(userOffset + i * 2) % XHS_USERS_POOL.length]
    const p = PROVINCES[(provOffset + i * 3) % PROVINCES.length]
    const day = 10 + ((seed + i * 4) % 12)
    const likes = i === 0 ? '10+' : String(12 + ((seed * (i + 1)) % 88))
    const cId = `c_${noteId}_${i + 1}`

    const subComments: CommentItem[] = []
    if (item.sub) {
      const subUser = XHS_USERS_POOL[(userOffset + i * 2 + 1) % XHS_USERS_POOL.length]
      const subProv = PROVINCES[(provOffset + i * 3 + 2) % PROVINCES.length]
      subComments.push({
        id: `sub_${noteId}_${i + 1}`,
        user: subUser,
        content: item.sub,
        time: `09-${day + 1}`,
        location: subProv,
        likes: '10+',
      })
    }

    comments.push({
      id: cId,
      user: u,
      content: item.content,
      time: `09-${day}`,
      location: p,
      likes,
      subComments,
    })
  })

  // 2. 紧扣笔记标题的互动评论
  const shortTitle = cleanTitle.slice(0, 24).replace(/^[！!#\s]+/, '')
  const titleUser = XHS_USERS_POOL[(userOffset + 7) % XHS_USERS_POOL.length]
  const titleProv = PROVINCES[(provOffset + 5) % PROVINCES.length]
  comments.push({
    id: `c_${noteId}_title`,
    user: titleUser,
    content: shortTitle
      ? `刷到「${shortTitle}」真的是眼前一亮，太会拍了，细节处理得特别细腻！`
      : '完全同意！细节处理得特别细腻，很有生活感，立马先码住。',
    time: `09-${11 + (seed % 10)}`,
    location: titleProv,
    likes: '56',
    subComments: [
      {
        id: `sub_${noteId}_title`,
        user: XHS_USERS_POOL[(userOffset + 8) % XHS_USERS_POOL.length],
        content: '已经在评论区学到了，立马马住收藏！',
        time: `09-${12 + (seed % 10)}`,
        location: PROVINCES[(provOffset + 7) % PROVINCES.length],
        likes: '12',
      },
    ],
  })

  // 3. 高赞社区互动评论
  const generalItem = CATEGORY_COMMENTS.general_lifestyle[seed % CATEGORY_COMMENTS.general_lifestyle.length]
  comments.push({
    id: `c_${noteId}_gen`,
    user: XHS_USERS_POOL[(userOffset + 9) % XHS_USERS_POOL.length],
    content: generalItem.content,
    time: `09-${13 + (seed % 8)}`,
    location: PROVINCES[(provOffset + 9) % PROVINCES.length],
    likes: '28',
    subComments: [],
  })

  return { count: countNumber, comments }
}
