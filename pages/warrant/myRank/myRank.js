var host = getApp().globalData.host;
var app = getApp();
Page({
  data: {
    nickName: '',
    rankList: [],
    rankInfo: {
      rankTotal: '',
      month: 11,
      day: 10,
      rankNum: 123
    }

  },
  //进入我的口碑页面
  enterMyarr: function () {
    wx.redirectTo({
      url: '/pages/warrant/myWarrant/myWarrant'
    })
  },
  //显示活动规则
  showGuize: function () {
    var that = this;
    that.setData({
      guize: true,
    })
  },
  closeDialog: function () {
    this.setData({
      authErrMsg: '',
      errMsg: '',
      guize: false
    })
  },
  //获取口碑文案
  getComment: function () {
    var that = this;
    var id = that.data.imei;
    wx.request({
      url: host + '/praisesmall/phone/PraiseMessage/getMessage.json',
      data: {
        imei: id
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
  //获取所有排名信息
  getRankList: function () {
    var that = this;
    var imei = that.data.imei;
    wx.request({
      url: host + '/praisesmall/phone/PraiseLike/getAllRrange.json', //仅为示例，并非真实的接口地址
      data: {
        imei: imei,
        offset: 1,
        pageSize: 10
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.data == '' || res.data.data == null || res.data.data == 'null') {
          return false;
        } else {
          var rankList = res.data.data;
          if (rankList[0]) {
            rankList[0].fontStyle = "firStyle";
          }
          if (rankList[1]) {
            rankList[1].fontStyle = "secStyle";
          }
          rankList = rankList;
          that.setData({
            rankList: rankList
          })
        }
      }
    })
  },
  //获取自己的排名信息
  getMyRank: function () {
    var that = this;
    var imei = that.data.imei;
    wx.request({
      url: host + '/praisesmall/phone/PraiseLike/getRrange.json', //仅为示例，并非真实的接口地址
      data: {
        imei: imei,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.status == 'true') {
          var date = res.data.data.timestamp;
          var d = new Date(date);
          that.setData({
            rankInfo: {
              rankTotal: res.data.data.score,
              rankNum: res.data.data.range,
              month: parseInt(d.getMonth()) + 1,
              day: parseInt(d.getDate())
            }

          })
        } else {
          that.setData({
            rankInfo: false
          })
        }
      }
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    //从本地储存中获取用户信息
    var userInfo = wx.getStorageSync('userInfo');
    var openid = wx.getStorageSync('openid');
    var imei = wx.getStorageSync('imei');
    if (openid == undefined || !openid || openid == '') {
      app.verifyLogin();
    }
    this.setData({
      // nickName: userInfo.nickName,
      // headImage: userInfo.avatarUrl,
      openid: openid,
      imei: imei
    })
    this.getComment();
    this.getRankList();
    this.getMyRank();
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