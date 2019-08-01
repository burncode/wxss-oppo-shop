// pages/me/me.js
var app = getApp();
var dialog = require('../../common/dialog.js');
var apiHost = require('../../common/api_host.js');
var httpJson = require('../../utils/http_json.js');
var user = require('../../utils/user.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: 'about:bank'
    },
    member: {
      'default': '',
      'commoncard': 'OPPO普卡会员',
      'silvercard': 'OPPO银卡会员',
      'goldcard': 'OPPO金卡会员',
      'diamondcard': 'OPPO钻卡会员',
    },
    type: "default"
  },

  getMemberInfo: function () {
    let page = this,
      path = '/member/operation/memIndex.do';
    let data = user.param(
      {
        openid: wx.getStorageSync('openid')
      }
    )
    httpJson.get(user.host + path, data, function (data) {
      let res = data.data;
      if (res.code == 200) {
        let type = res.result.data.gradeCode;
        page.setData({
          type: type
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    app.verifyLogin(function (data) {
      page.setData({
        userInfo: wx.getStorageSync('userInfo')
      });
      page.getMemberInfo()
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