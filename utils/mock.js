const shopList = [
  {
    siteName: '广州市天河区客服中心',
    address: '广东省广州市天河区天河路598号百脑汇OPPO体验店二楼',
    workingHours: '09:30-18:00 周一至周日',
    phone: '020-38886812'
  },
  {
    siteName: '广州市番禺区市桥客服中心',
    address: '广东省广州市番禺区市桥大北路1号OPPO体验店二楼',
    workingHours: '09:30-18:00 周一至周日',
    phone: '020-39212093'
  }
]

const dayList = [
  {
    time:'10月19日',
    status:'星期四'
  },
  {
    time: '10月20日',
    status: '星期五'
  },
  {
    time: '10月21日',
    status: '星期六'
  },
  {
    time: '10月22日',
    status: '星期日'
  },
  {
    time: '10月23日',
    status: '星期一'
  },
  {
    time: '10月24日',
    status: '星期二'
  },
  {
    time: '10月25日',
    status: '星期三'
  },
]

const hourList = [
  {
    time: '9:00-10:00',
    status: '空闲时段'
  },
  {
    time: '10:00-11:00',
    status: '繁忙时段'
  },
  {
    time: '11:00-12:00',
    status: '繁忙时段'
  },
  {
    time: '12:00-13:00',
    status: '繁忙时段'
  },
  {
    time: '13:00-14:00',
    status: '繁忙时段'
  },
  {
    time: '14:00-15:00',
    status: '繁忙时段'
  },
  {
    time: '15:00-16:00',
    status: '空闲时段'
  },
  {
    time: '16:00-17:00',
    status: '空闲时段'
  }
]

const address = [
  {
    name:'陈先生',
    phone:'13800138000',
    addr:'广东省深圳市南山区科技园大道科技大厦18楼',
    txtStyle:''
  },
  {
    name: '陈先生',
    phone: '13800138000',
    addr: '广东省深圳市南山区科技园大道科技大厦18楼广东省深圳市南山区科技园大道科技大厦18楼',
    txtStyle: ''
  }
]

const goods = [
  {
    id:'1',
    coverImg:'http://static.oppo.com/archives/201702/201702060402225898323e56db4.png',
    name: 'OPPO时尚单品自拍杆',
    price: '3499'
  },
  {
    id: '2',
    coverImg: 'http://static.oppo.com/archives/201708/20170809030807598abc1be49ba.png',
    name: 'R11 巴萨限量版',
    price: '3499'
  },
  {
    id: '3',
    coverImg: 'http://static.oppo.com/archives/201706/20170612010616593e2b2044eae.png',
    name: 'R11 热力红 旗舰爆款',
    price: '3499'
  },
  {
    id: '4',
    coverImg: 'http://static.oppo.com/archives/201708/20170811040807598d6533c656e.png',
    name: 'A59s 1600万金属自拍神器 ',
    price: '3499'
  },
]

const card = {
  'default': "about:bank",
  'commoncard': "http://wximg-oppo-cn.oss-cn-hangzhou.aliyuncs.com/vl/img/7b14d8b87ee84dec99ef737efab975f9.png",
  'silvercard': "http://wximg-oppo-cn.oss-cn-hangzhou.aliyuncs.com/vl/img/6d97395752f443eb8c48b4a599254f4f.png",
  'goldcard': "http://wximg-oppo-cn.oss-cn-hangzhou.aliyuncs.com/vl/img/e8747ae6090c4232b032de629cd7590f.png",
  'diamondcard': "http://wximg-oppo-cn.oss-cn-hangzhou.aliyuncs.com/vl/img/2e7679a837ed4bf5b382681eced9ecaa.png",
}

module.exports = {
  shopList: shopList,
  dayList: dayList,
  hourList: hourList,
  address: address,
  goods: goods,
  card: card
}