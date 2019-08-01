// pages/my/member/index/index.js
var mock = require('../../../../utils/mock.js');
var user = require('../../../../utils/user.js');
var index = {

  /**
   * 页面的初始数据
   */
  data: {
    gradeChangeTime:'',
    card: mock.card,
    linearGradient:{
      'commoncard': "linear-gradient(270deg, #2dc8a9, #2ec2c3)",
      'silvercard': "linear-gradient(270deg, #35AFD2, #529BDF)",
      'goldcard': "linear-gradient(270deg, #D2A33B, #DF934A)",
      'diamondcard': "linear-gradient(270deg, #7270E1, #9F73E9)", 
    },
    type:'default'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this,
      path = '/member/operation/memIndex.do';    
    user.get(path, {
      openid: wx.getStorageSync('openid'),
    },function(data){
      let res = data.data;
      if ([200, 10000].indexOf(res.code) < 0) {
        
      } else {
        wx.setStorageSync('member', { ssoId: res.result.ssoId, phone: res.result.phone, imie: res.result.imie });
        page.setData({
          gradeChangeTime: res.result.data.gradeChangeTime,
          type: res.result.data.gradeCode,
        })
      }
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
Page(index)