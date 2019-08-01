// pages/nav/extended-warranty/warranty-detail/warranty-detail.js
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
    status: order.status,
    auditStatus: {
      "TO_AUDIT": "待审核",
      "AUDITED": "审核通过",
      "REFUSE": "审核不通过"
    }
  },

  getDetail(id) {
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/phoneWarrantyExtension/record/getByOrderId';
    dialog.showLoading('加载中');
    httpJson.get(path, {
      orderId: id
    }, function (data) {
      dialog.hideLoading();
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return;
      }
      let detail = res.body;
      detail.date = utils.formatDate(new Date(detail.createdTime), 'yyyy-mm-dd hh:ii')
      page.setData({
        orderDetail: detail
      })
    })
  },

  pay(event) { //去支付(状态为待支付)
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/order/pay/prepay_order',
      orderId = event.currentTarget.dataset.orderid;
    dialog.showLoading('加载中');
    httpJson.post(path, {
      orderId: orderId
    }, function (data) {
      dialog.hideLoading();
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return;
      }
      let param = res.body.jssdkPayConfig;
      let orderId = res.body.orderId;
      page.requestPayment(param, orderId);
    })
  },

  requestPayment(param, orderId) { //调用小程序支付api
    let page = this;
    wx.requestPayment({
      timeStamp: param.timestamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function (res) {
        wx.navigateTo({
          url: '../detail/detail?id=' + page.data.orderId
        })
      },
      fail: function (res) {

      }
    })
  },

  onRefund(event) {
    app.errTip('请咨询微信公众号或官方客服')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this;
    app.verifyLogin(function (value, index) {
      page.setData({
        orderId: options.id
      })
      page.getDetail(options.id)
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