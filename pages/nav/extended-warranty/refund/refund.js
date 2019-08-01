// pages/nav/extended-warranty/refund/refund.js
var app = getApp(),
  apiHost = require('../../../../common/api_host.js'),
  httpJson = require('../../../../utils/http_json.js'),
  order = require('../../../../common/order.js'),
  dialog = require('../../../../common/dialog.js'),
  utils = require('../../../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  submit(event) {
    let page = this;
    let detectNo = event.detail.value.detectNo;
    if (detectNo == '') {
      app.errTip('手机检测码不能为空');
      return;
    }
    let path = apiHost.config.portalApiHost + 'portal/phoneWarrantyExtension/refund';
    dialog.showLoading('加载中');
    httpJson.post(path, {
      orderId: page.data.orderId,
      detectNo: detectNo
    }, function (data) {
      dialog.hideLoading();
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return;
      }
      app.errTip('申请成功');
      setTimeout(function () {
        wx.redirectTo({
          url: '../../../my-order/my-order'
        })
      }, 2000)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this;
    app.verifyLogin(function (data) {
      page.setData({
        orderId: options.orderId
      })
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
})