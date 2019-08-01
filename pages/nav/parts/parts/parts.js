// pages/nav/parts/parts/parts.js
var user = require('../../../../utils/user.js');
var dialog = require('../../../../common/dialog.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    model: [],
    modelIndex: 0,
    product:''
  },

  modelChange: function (e) { //变更机型
    this.setData({
      modelIndex: e.detail.value,
      product: this.data.model[e.detail.value]
    });
  },

  onQuery(event) { //查询按钮
    let page = this;
    wx.navigateTo({
      url: '../parts-query/parts-query?product=' + page.data.product
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    dialog.showLoading('加载中');
    var page = this;
    app.verifyLogin(function(data){
      var path = '/ocsm/mes/productList.do';
      user.get(path, {}, function (data) {
        dialog.hideLoading();
        let res = data.data;
        if ([200, 10000].indexOf(res.code) < 0) {
          app.errTip(res.msg)
        } else {
          page.setData({
            model: res.result,
            product: res.result[0]
          });
        }
      })
    })
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