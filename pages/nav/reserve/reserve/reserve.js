// pages/nav/reserve/reserve/reserve.js
var mock = require('../../../../utils/mock.js'),
  user = require('../../../../utils/user.js'),
  shopCommon = require('../../../../utils/shop.js'),
  compose = require('../../../../utils/compose.js'),
  utils = require('../../../../utils/utils.js');
var reserve = {
  /**
   * 页面的初始数据
  */
  data: {
    /* 商店 */
    currentCheckboxIdn:-1,
    /* 选择到服务中心的日期 */
    dayList: mock.dayList,
    currentDayIndex:-1,
    /* 选择到服务中心的时间 */
    hourList: mock.hourList,
    currentHourIndex: -1,
    /* 故障信息 */
    problem: ['死机重启', '无法连接网络', '其他', '不开机', '不读SIM卡', '通话异常', '不充电', '无法收到信息', '系统升级', '屏裂', '触摸屏失灵','通话没声音'],
    problemIndex:0,
    /* 流程步骤 */
    stepLength:1,
    step1: true,
    step2: false,
    step3: false,
    /* 提交预约参数 */
    param: { 
      ssoid: wx.getStorageSync('openid'),
      username: wx.getStorageSync('userInfo').nickName,
      original: 2,
      imei: '',
      model: '',
      problem_category_id: 1
    },
    arrWeek: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    showTimeBox:false,
    nothingShop: false
  },
  time: {}, //预约时间
  orderStatus: { //预约状态
    0: '已预约',
    1: '维修中',
    3: '已完成',
    4: '已取消',
    5: '已过期',
    6: '已评价',
    7: '已回访',
    8: '经销商送修'
  },
  shopStatus: { //网点状态
    1: "临时休假",
    2: "正在搬迁",
    3: "预约已满",
    4: "繁忙时段",
    5: "空闲时段",
    6: "已过期"
  },

  /* 顶部流程圆圈点击事件 */
  onStepCircle(event){
    let _this = this;
    let index = event.currentTarget.dataset.index;
    let stepLength = _this.data.stepLength;
    if (stepLength >= index){
      switch(index){
        case '1' :
          _this.setData({
            step1: true,
            step2: false,
            step3: false,
            stepLength:1
          })
          break
        case '2' :
          _this.setData({
            step1: false,
            step2: true,
            step3: false,
            stepLength: 2
          })
          break
        case '3' :
          _this.setData({
            step1: false,
            step2: false,
            step3: true,
            stepLength: 3
          })
          break  
      }
    }
  },

  /* 服务中心(商店)选择 */
  onShopSelected(event){
    let target = event.currentTarget.dataset; 
    let index = target.index;
    let sid = target.sid;
    let site_num = target.sitenum;
    if (site_num == ''){
      return;
    }
    this.setData({
      currentCheckboxIdn:index,
    })
    this.GetSiteAppointTime(event)
  },

  /* 时间选择事件 */
  onDateSelected(event){
    let status = event.currentTarget.dataset.status;
    if (status < 0){
      return
    }
    let index = event.currentTarget.dataset.index;
    this.setData({
      currentDayIndex: index,
      currentHourIndex: -1,
    })
    this.dateChange(event)
  },

  onTimeSelected(event) {
    let status = event.currentTarget.dataset.status;
    let index = event.currentTarget.dataset.index;
    if (status == 6) {
      return
    }
    this.setData({
      currentHourIndex: index
    })
    this.timeChange(event)
  },

  /* 下一步 或 提交按钮 */
  submit(event){
    let _this = this;
    // 第一次时获取不到openid 或 获取不到姓名
    if (_this.data.param.ssoid == '' || _this.data.param.username == ''){
      _this.data.param.ssoid = wx.getStorageSync('openid');
      _this.data.param.username = wx.getStorageSync('userInfo').nickName,
      _this.setData({
        param:_this.data.param
      })
    }
    // 提交
    let path = '/Appoint/CreateAppoint.ashx';
    let data = _this.util.param(compose(_this.data.param, event.detail.value), path, _this.secret)
    _this.app.post(_this.host + path,JSON.stringify(data),function(data){
      let res = data.data;
      if (res.status == 0 || res.status == 33){
        _this.app.errTip(res.message)
      }else{
        _this.dialog.showToast('预约成功');
        setTimeout(function(){
          res.reserve_id && wx.navigateTo({
            //url: '../../inform/inform?reserveid=' + res.reserve_id
            url: '../reserve-list/reserve-list'
          })
        },2000)
      }
    })
  },

  GetSiteAppointTime: function (e) { //获取预约时间
    var page = this,
      path = '/Appoint/GetSiteAppointTime.ashx',
      s = e.currentTarget.dataset.sid;
    page.app.get(page.host + path,page.util.param({
      sid:s
    }, path, page.secret),function(data){
      if (data.data.status == 0) {
        page.app.errTip(data.data.message);
        page.setData({
          showTimeBox: false
        });
      } else {
        let res = data.data;
        page.time = res.dailyappoint;
        var arr = [];
        for (var n in page.time) {
          var v = page.time[n];
          arr.push({
            date: n,
            week: page.data.arrWeek[new Date(n.replace(/-/g, "/")).getDay()],
            status: v.status,
            statusDes: page.shopStatus[v.status]
          });
        }
        page.data.param.sid = s;
        page.setData({
          date: arr,
          param: page.data.param,
          showTimeBox:true
        });
      }
    })
  },

  getTime: function (n) { //时间格式转换
    return n + ':00-' + (Number(n) + 1) + ':00'
  },

  dateChange: function (e) { //变更日期
    var dataset = e.currentTarget.dataset,
      d = dataset.date,
      obj = this.time[d].times,
      arr = [];
    for (var n in obj) {
      var v = obj[n];
      arr.push({
        time: n,
        hour: this.getTime(n),
        status: v,
        statusDes: this.shopStatus[v]
      });
    }
    this.data.param.date = d;
    dataset.status > -1 && this.setData({
      time: arr,
      param: this.data.param
    });
  },

  timeChange: function (e) { //变更时间
    var dataset = e.currentTarget.dataset;
    this.data.param.time = dataset.time;
    dataset.status > 3 && this.setData({
      param: this.data.param
    });
  },

  problemChange: function (e) { //变更问题
    var i = e.detail.value;
    this.data.param.problem_category_id = Number(i) + 1;
    this.setData({
      problemIndex:i,
      param: this.data.param
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}
reserve = compose(reserve, shopCommon)
Page(reserve)