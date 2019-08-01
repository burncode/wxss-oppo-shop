var host = getApp().globalData.host;
var app = getApp();
Page({
  data: {
    nickName: '',
    headImage: '',
    rankTotal: '2333',
  },
  enterMyWarr: function () {
    wx.navigateTo({
      url: '/pages/warrant/myWarrant/myWarrant'
    })
  },
  getComment: function (imei) {
    var that = this;
    wx.request({
      url: host + '/praisesmall/phone/PraiseMessage/getMessage.json',
      data: {
        imei: imei
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.status == 'true') {
          that.setData({
            nickName: res.data.data.nickName,
            headImage: res.data.data.headImage,
          })
        }
      }
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var imei = options.imei;
    that.getComment(imei);
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})