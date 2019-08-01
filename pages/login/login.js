// pages/login/login.js
var user = require('../../utils/user.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    token: ''
  },

  getMobile(event) { //获取手机号
    let mobile = event.detail.value;
    this.setData({
      mobile: mobile
    })
  },
  sendSMS: function () { //发送验证码
    let page = this,
      path = '/member/register/verifyCodeThree.do';
    let mobile = page.data.mobile;
    if (mobile == ''){
      app.errTip('请输入手机号');
      return
    }
    if (!/^1\d{10}$/.test(mobile)) {
      app.errTip('请填写正确的手机号码！');
      return
    }
    wx.request({
      url: user.host + path,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: user.param({
        mobile: page.data.mobile
      }),
      success: function (data) {
        user.request(data, function (data) {
          if (data.statusCode == 200) {
            if(data.data.code == 500){
              app.errTip(data.data.msg);
              return;
            }
            app.errTip('发送成功')
            page.setData({
              token: data.data.result.token
            })
          }
        })
      },
      fail: function (data) {

      }
    });
  },
  submit: function (e) { //登录
    var page = this,
      u = wx.getStorageSync('userInfo'),
      path = '/member/register/submitNoWxtoken.do';
    wx.request({
      url: user.host + path,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: user.param({
        mobile: page.data.mobile,
        token: page.data.token,
        verifyCode: e.detail.value.verifyCode,
        openid: wx.getStorageSync('openid'),
        city: u.city,
        province: u.province,
        country: u.country,
        gender: u.gender,
        avatarUrl: u.avatarUrl,
        nickName: u.nickName
      }),
      success: function (data) {
        user.request(data, function (data) {
          let res = data.data;
          if ([200, 10000].indexOf(res.code) < 0) {
            app.errTip(res.msg)
          } else {
            wx.navigateBack(1)
          }
        })
      },
      fail: function (data) {

      }
    });  
    // user.post(path, {
    //   mobile: page.data.mobile,
    //   token: page.data.token,
    //   verifyCode: e.detail.value.verifyCode,
    //   openid: wx.getStorageSync('openid'),
    //   city: u.city,
    //   province: u.province,
    //   country: u.country,
    //   gender: u.gender,
    //   avatarUrl: u.avatarUrl,
    //   nickName: u.nickName
    // }, function (data) {
    //   let res = data.data;
    //   if ([200, 10000].indexOf(res.code) < 0) {
    //     app.errTip(res.msg)
    //   } else {
    //     wx.navigateBack(1)
    //   }
    // })
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