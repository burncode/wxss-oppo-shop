// pages/nav/inform/inform.js
var shopCommon = require('../../../utils/shop.js'),
  dialog = require('../../../common/dialog.js'),
  compose = require('../../../utils/compose.js');
var inform = {

  /**
   * 页面的初始数据
   */
  data: {
    reserve_id: ''
  },

  getTime: function (n) { //时间格式转换
    return n + ':00-' + (Number(n) + 1) + ':00'
  },

  QuerySingleAppoint: function (i) { //获取预约记录详情
    var page = this,
      path = '/Appoint/QuerySingleAppoint.ashx';
    dialog.showLoading('加载中')
    page.app.get(page.host + path, page.util.param({
      reserve_id: i
    }, path, page.secret), function (data) {
      dialog.hideLoading()
      let res = data.data;
      if (res.status == 0) {
        page.app.errTip(res.message);
      } else {
        page.setData({
          orderDetail: {
            reserve_id: res.reserve_id,
            name: res.name,
            mobile: res.mobile,
            time: page.util.formatTime(new Date(res.date * 1000), '-') + ' ' + page.getTime(res.time),
            service_name: res.service_name,
            display: 'block'
          }
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      reserve_id: options.reserveid
    })
    this.QuerySingleAppoint(options.reserveid)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}
inform = compose(inform, shopCommon)
Page(inform)