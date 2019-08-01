// pages/nav/repair/repair-query/repair-query.js
var host = 'https://service.myoppo.com/',
  secret = 'BF6B5332094F470785E7791BD1DEB8C4', //签名密钥
  dialog = require('../../../../common/dialog.js'),
  util = require('../../../../utils/util.js'),
  app = getApp();
var repairQuery = {
  /**
   * 页面的初始数据
   */
  data: {
    
  },

  submit: function (key) {  //查询维修进度
    let page = this,
      path = 'ocsmapi/WorkOrderQuery.ashx'; 
    app.get(host + path, util.param({
        key: key
    }, path, secret),function(data){
      let res = data.data;
      if (res.resultCode != '0001') {
        page.setData({
          desc: res.resultDesc,
        });
      } else {
        page.setData({
          record: res.data,
        });
      }
    })
  }, 

  makePhoneCall(event){ //拨打电话
    let phone = event.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone 
    })
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this;
    let key = options.key;
    app.verifyLogin(function(data){
      page.submit(key)
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
Page(repairQuery)