// pages/nav/reserve/reserve-list/reserve-list.js
var app = getApp(),
  user = require('../../../../utils/user.js'),
  shopCommon = require('../../../../utils/shop.js'),
  compose = require('../../../../utils/compose.js');
var reserveList = {

  /**
   * 页面的初始数据
   */
  data: {
    reserveList:[],
    QueryOffset:0,
    QueryLimit: 20,
    isEmptyData:false,
    nothing:false
  },

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

  getTime: function (n) { //时间格式转换
    return n + ':00-' + (Number(n) + 1) + ':00'
  },

  QueryMultiAppoint: function () { //获取预约记录列表
    var page = this,
      path = '/Appoint/QueryMultiAppoint.ashx',
      ssoid = wx.getStorageSync('openid'),
      data = page.util.param({
        ssoid: ssoid,
        mobile: '',
        start_time: '',
        end_time: '',
        offset: page.data.QueryOffset,
        limit: page.data.QueryLimit
      }, path, page.secret) ;
    page.app.get(page.host + path, data, function (data) {
      let res = data.data;
      if (res.status == 0) {
        page.setData({
          isEmptyData:true
        })
        if(page.data.QueryOffset == 0) {
          page.setData({
            nothing: true
          })
        }
      } else if (res.status == 33){
        page.app.errTip(res.message)
      }else {
        var arr;
        if (page.data.QueryOffset == 0){
          arr = []
        }else{
          arr = page.data.reserveList
        }
        res.appointlist.forEach(function (v) {
          arr.push({
            time: page.util.formatTime(new Date(v.date * 1000), '-') + ' ' + page.getTime(v.time),
            description: v.description,
            formstatusText: page.orderStatus[v.formstatus],
            formstatus: v.formstatus,
            problem_category_name: v.problem_category_name,
            reserve_id: v.reserve_id,
            service_name: v.service_name,
            mobile: v.mobile,
            name: v.name
          });
        });
        page.setData({
          reserveList: arr
        })
      }
    })
  },

  cancelService: function (event){
    var page = this,
      path = '/Appoint/CancelAppoint.ashx',
      reserve_id = event.currentTarget.dataset.reserveid,
      data = page.util.param({
        reserve_id: reserve_id
      }, path, page.secret);
    page.app.post(page.host + path, data, function (data) {
      let res = data.data;
      if (res.status == 0 || res.status == 33) {
        page.app.errTip(res.message)
      } else if (res.status == 1){
        let arr = page.data.reserveList;
        arr.forEach(function(item,index){
          if (item.reserve_id == reserve_id){
            item.formstatus = 4;
            item.formstatusText = page.orderStatus[item.formstatus];
          }
        })
        page.setData({
          reserveList:arr
        })
        page.app.errTip('取消成功');
      }
    })
  },

  gotoDetail(event){ //查看详情
    let reserve_id = event.currentTarget.dataset.reserveid;
    wx.navigateTo({
      url: '../../inform/inform?reserveid=' + reserve_id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this;
    app.verifyLogin(function (data) {
      page.QueryMultiAppoint()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    let page = this,
      offset = page.data.QueryOffset,
      limit = page.data.QueryLimit;
    if(!page.data.isEmptyData){
      page.setData({
        QueryOffset: limit,
        QueryLimit: limit + 20
      })
      page.QueryMultiAppoint()
    }  

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}
reserveList = compose(reserveList, shopCommon)
Page(reserveList)