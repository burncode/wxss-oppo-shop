// pages/nav/extended-warranty/extended-warranty.js
var app = getApp(),
  apiHost = require('../../../common/api_host.js'),
  httpJson = require('../../../utils/http_json.js'),
  dialog = require('../../../common/dialog.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: true
  },

  checkboxChange(event) { //勾选
    var val = event.detail.value;
    if (val.length == 0) {
      this.setData({
        checked: false
      })
    } else {
      this.setData({
        checked: true
      })
    }
  },

  gotoPhoneInfo(event) { //跳转到填写信息页
    let checked = this.data.checked;
    if (!checked) {
      app.errTip('请仔细阅读并同意《OPPO保障服务条款》');
      return;
    }
    let price = event.currentTarget.dataset.price;
    let extensionid = event.currentTarget.dataset.extensionid;
    let type = event.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../phone-info/phone-info?price=' + price + '&type=' + type + '&extensionid=' + extensionid
    })
  },

  gotoWarrantyServiceDesc() { //跳转到服务保障页面
    wx.navigateTo({
      url: '../warranty-service-desc/warranty-service-desc'
    })
  },

  getPhoneWarrantyExtension: function () {
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/phoneWarrantyExtension/list';
    dialog.showLoading('加载中');
    httpJson.get(path, {}, function (data) {
      dialog.hideLoading();
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return;
      }
      page.setData({
        phoneWarranty: res.body
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this;
    app.verifyLogin(function (data) {
      page.getPhoneWarrantyExtension()
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