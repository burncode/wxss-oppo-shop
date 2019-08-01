// pages/nav/phone-info/phone-info.js
var app = getApp(),
  user = require('../../../utils/user.js'),
  apiHost = require('../../../common/api_host.js'),
  httpJson = require('../../../utils/http_json.js'),
  dialog = require('../../../common/dialog.js'),
  compose = require('../../../utils/compose.js'),
  utils = require('../../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    extensionId: '',
    price: '',
    model: '',
    imei: '',
    phone: '',
    imeiError: '', //串码错误信息
    isImeiError: false
  },

  onScan() { //扫码
    let page = this;
    wx.scanCode({
      success: (res) => {
        page.setData({
          imei: res.result
        })
      }
    })
  },

  getImei(e) { //获取手机串码
    this.setData({
      imei: e.detail.value
    });
  },

  verImei: function (e) { //验证imei
    var page = this,
      path = '/esa/card/authenticity.do';
    dialog.showLoading('加载中');
    user.get(path, {
      imei: e.detail.value.imei,
      model: page.data.model,
      type: page.data.type
    }, function (data) {
      dialog.hideLoading();
      let res = data.data;
      if ([200, 10000].indexOf(res.code) < 0) {
        app.errTip(res.msg);
      } else {
        page.prepay(e)
      }
    })
  },

  prepay(e) {
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/order/pay/prepay_warranty_extension';
    httpJson.post(path, Object.assign({
      extensionId: page.data.extensionId
    }, e.detail.value), function (data) {
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
    wx.requestPayment({
      timeStamp: param.timestamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function (res) {
        wx.navigateTo({
          url: '../extended-warranty/detail/detail?id=' + orderId
        })
      },
      fail: function (res) {

      }
    })
  },

  submit(e) { //提交延保
    var page = this,
      path = '/esa/card/register.do';
    // 判断输入框是否有值
    if (e.detail.value.imei == '') {
      app.errTip('请填写串码');
      return
    }
    if (e.detail.value.userName == '') {
      app.errTip('请填写姓名');
      return
    }
    if (e.detail.value.userPhone == '') {
      app.errTip('请填写手机号');
      return
    }
    if (!utils.verifyPhone(e.detail.value.userPhone)) {
      app.errTip('请输入正确的手机号');
      return
    }
    if (apiHost.config.debug) { //判断是否为本地调试 是的话则执行支付 否则执行验证
      page.prepay(e);
    } else {
      page.verImei(e);
    }
    // page.verImei(e);
    // page.prepay(e)
    // user.get(path, compose({
    //   premium: page.data.price,
    //   type: 1,
    //   model: page.data.model
    // }, e.detail.value),function(data){
    //   let res = data.data;
    //   if ([200, 10000].indexOf(res.code) < 0) {
    //     app.errTip(res.msg)
    //   } else {
    //     wx.showToast({
    //       title: '延保成功'
    //     });
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this;
    app.verifyLogin(function (data) {
      page.setData({
        type: options.type,
        price: options.price,
        extensionId: options.extensionid
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