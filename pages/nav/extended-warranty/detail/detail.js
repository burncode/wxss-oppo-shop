// pages/nav/extended-warranty/detail/detail.js
var app = getApp(),
  apiHost = require('../../../../common/api_host.js'),
  httpJson = require('../../../../utils/http_json.js');
var detail = {
  /**
   * 页面的初始数据
   */
  data: {

  },

  getDetail: function (id) {
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/phoneWarrantyExtension/record/getByOrderId';
    httpJson.get(path, {
      orderId: id
    }, function (data) {
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return;
      }
      page.setData({
        orderDetail: res.body
      })
    })
  },

  gotoIndex: function () {
    wx.switchTab({
      url: '../../../index/index'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this;
    let id = options.id;
    app.verifyLogin(function (data) {
      page.getDetail(id)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}
Page(detail)