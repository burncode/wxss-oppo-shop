var host = getApp().globalData.host;
var app = getApp();
var user = require('../../../utils/user.js');
Page({
  data: {
    starPic: '',
    myScore: '99',
    myRank: '暂无',
    imeiUsed: '对不起，该设备已购买延保',
    imeiUnused: [
      '对不起，该设备有付费维修记录',
      '对不起，购机已超过6个月，不可购买'
    ]
  },
  setStarPic: function (tag) {
    var that = this;
    var tag = parseInt(tag);
    var starPic = that.data.starPic;
    switch (tag) {
      case 1:
        starPic = 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoYanBao/tfb.jpg';
        break;
      case 2:
        starPic = 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoYanBao/yangm.jpg';
        break;
      case 3:
        starPic = 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoYanBao/yangy.jpg';
        break;
      case 4:
        starPic = 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoYanBao/chenwt.jpg';
        break;
      case 5:
        starPic = 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoYanBao/dilireba.jpg';
        break;
      case 6:
        starPic = 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoYanBao/liyi.jpg';
        break;
      case 7:
        starPic = 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoYanBao/yangm.jpg';
        break;
      case 8:
        starPic = 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoYanBao/yangy.jpg';
        break;
      case 9:
        starPic = 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoYanBao/jay.jpg';
        break;
      case 10:
        starPic = 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoYanBao/xo.png';
        break;
    }
    that.setData({
      starPic: starPic
    })
  },
  //进入产品信息
  enterIntro: function () {
    wx.navigateTo({
      url: '/pages/warrant/productIntro/productIntro'
    })
  },
  //进入我的口碑
  enterMyArr: function () {
    wx.navigateTo({
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
  getComment: function () {
    var that = this;
    var imei = that.data.imei;
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
            comment: res.data.data.comment,
            tag: res.data.data.tag,
            nickName: res.data.data.nickName,
            headImage: res.data.data.headImage,
          })
          that.setStarPic(res.data.data.tag);
        }
      }
    })
  },
  //获取自己的排名信息
  getMyRank: function () {
    var that = this;
    var imei = that.data.imei;
    wx.request({
      url: host + '/praisesmall/phone/PraiseLike/getRrange.json',
      data: {
        imei: imei,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.status == 'true') {
          if (res.data.data.range) {
            that.setData({
              myRank: res.data.data.range,
            })
          } else {
            return false;
          }
          if (res.data.data.score) {
            that.setData({
              myScore: res.data.data.score,
            })
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    })
  },
  //分享领延保
  onShareAppMessage: function (res) {
    var that = this;
    var openid = wx.getStorageSync('openid');
    var imei = this.data.imei;
    var phone = this.data.phone;
    var name = this.data.name;
    var nickName = this.data.nickName;
    var headImage = this.data.headImage;
    console.log(openid)
    if (openid == undefined || !openid || openid == '') {
      app.verifyLogin();
      var openid = wx.getStorageSync('openid');
      return {
        title: '帮我助力，OPPO R11s送你好礼！',
        path: '/pages/warrant/giveWarrant/giveWarrant?openid=' + openid + '&imei=' + imei + '&nickName=' + nickName + '&headImage=' + headImage,
        success: function (res) {
          wx.showLoading({
            title: '正在领取延保~',
            mask: true
          })
          user.post('/esa/card/register.do', {
            premium: '39.5',
            type: 0,
            model: "R11s",
            imei: imei,
            phone: phone,
            name: name
          }, function (data) {
            let res = data.data;
            if ([200, 10000].indexOf(res.code) < 0) {
              wx.hideLoading();
              app.errTip(res.msg)
            } else {
              that.saveImeiInfo();
              wx.hideLoading();
            }
          })
        },
        fail: function (res) {
          // 转发失败
        }
      }
    } else {
      return {
        title: '快来帮我增加OPPO R11s口碑影响力',
        path: '/pages/warrant/giveWarrant/giveWarrant?openid=' + openid + '&imei=' + imei + '&nickName=' + nickName + '&headImage=' + headImage,
        success: function (res) {
          wx.showLoading({
            title: '正在领取延保~',
            mask: true
          })
          user.post('/esa/card/register.do', {
            premium: '39.5',
            type: 0,
            model: "R11s",
            imei: imei,
            phone: phone,
            name: name
          }, function (data) {
            let res = data.data;
            if ([200, 10000].indexOf(res.code) < 0) {
              wx.hideLoading();
              app.errTip(res.msg)
            } else {
              that.saveImeiInfo();
              wx.hideLoading();
            }
          })
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
  },
  saveImeiInfo: function () {
    var that = this;
    var imei = this.data.imei;
    var phone = this.data.phone;
    var name = this.data.name;
    var nickName = this.data.nickName;
    var headImage = this.data.headImage;
    var openid = this.data.openid;
    if (openid == undefined || openid == '' || !openid) {
      var openid = wx.getStorageSync('openid');
    }
    wx.request({
      url: host + '/praisesmall/phone/PraiseImeiInfo/saveImeiInfo.json',
      data: {
        imei: imei,
        phone: phone,
        name: name,
        nickName: nickName,
        headImage: headImage,
        openid: openid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.status == 'true') {
          wx.navigateTo({
            url: "/pages/warrant/warrantyCard/warrantyCard?imei=" + imei
          });
        } else {
          return false;
        }
      }
    })
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var page = this;
    var userInfo = wx.getStorageSync('userInfo');
    var imei = wx.getStorageSync('imei');
    var phone = wx.getStorageSync('phone');
    var name = wx.getStorageSync('name');
    var openid = wx.getStorageSync('openid');
    if (openid == undefined || !openid || openid == '') {
      app.verifyLogin();
    }
    page.setData({
      nickName: userInfo.nickName,
      name: name,
      phone: phone,
      imei: imei,
      openid: openid,
      headImage: userInfo.avatarUrl,
    })
    page.getComment();
    page.getMyRank();
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