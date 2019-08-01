var user = require('../../../utils/user.js');
var host = getApp().globalData.host;
var app = getApp();
Page({
  data: {
    clause: true,
    dialogSH: true,
    imeiUsed: '对不起，该设备已购买延保',
    imeiUnused: [
      '对不起，该设备有付费维修记录',
      '对不起，购机已超过6个月，不可购买'
    ],
    guize: false,
    tiaokuan: false,
  },
  //扫码
  scanCode: function () {
    var that = this;
    wx.scanCode({
      success: (res) => {
        that.setData({
          imei: res.result
        })
      }
    })
  },
  //勾选条款
  checkClasuse: function (e) {
    var status = e.currentTarget.dataset.clause;
    if (status === true) {
      this.setData({
        clause: false
      })
    } else {
      this.setData({
        clause: true
      })
    }
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
  //imei及信息验证
  authSub: function (e) {
    //验证
    var that = this;
    var formData = e.detail.value;
    var clause = that.data.clause;
    if (formData.imei === '') {
      that.setData({
        errTips: '请填写IMEI码！'
      })
    } else if (formData.name === '' || formData.name === " ") {
      that.setData({
        errTips: '请填写您的姓名！'
      })
    } else if (formData.phone === '' || formData.phone === " ") {
      that.setData({
        errTips: '请填写您的手机号码！'
      })
    } else if (!/^1(3|4|5|7|8)\d{9}$/.test(formData.phone)) {
      that.setData({
        errTips: '请填写正确的手机号码！'
      })
    } else if (clause == false) {
      that.setData({
        errTips: '请仔细阅读并同意《OPPO保障服务条款》'
      })
    }
    else {
      wx.showLoading({
        title: '正在校验~',
        mask: true
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 8000)
      wx.setStorageSync('phone', formData.phone);
      wx.setStorageSync('name', formData.name);
      wx.setStorageSync('imei', formData.imei);
      //验证请求
      user.post('/esa/card/authenticity.do', {
        imei: parseInt(formData.imei),
        model: "R11s",
        type: 0,
      }, function (data) {
        let res = data.data;
        if ([200, 10000].indexOf(res.code) < 0) {
          wx.hideLoading()
          app.errTip(res.msg)
        } else {
          wx.navigateTo({
            url: '/pages/warrant/choose/choose'
          })
          wx.hideLoading()
        }
      })
    }

  },
  //显示条款信息
  tiaokuan: function () {
    var that = this;
    that.setData({
      errTips: true,
      tiaokuan: true,
    })
  },
  //显示活动规则
  showGuize: function () {
    var that = this;
    that.setData({
      guize: true,

    })
  },
  //关闭弹出框
  closeDialog: function () {
    this.setData({
      errMsg: '',
      errTips: '',
      guize: false,
      tiaokuan: false,
    })
  },
  setMsg: function () {
    var that = this;
    var openid = wx.getStorageSync('openid');;
    console.log(openid)
    if (openid == undefined || openid == '') {
      that.setData({
        getUserInfo: false
      })
    } else {
      that.setData({
        getUserInfo: true
      })
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var openid = wx.getStorageSync('openid');
    if (openid == undefined || !openid || openid == '') {
      app.verifyLogin(function (data) {
        var userInfo = wx.getStorageSync('userInfo');
        var openid = wx.getStorageSync('openid');
        that.setData({
          userInfo: userInfo,
          openid: openid
        });
      })
    }
    that.setMsg();
    var imei = wx.getStorageSync('imei');
    var phone = wx.getStorageSync('phone');
    var name = wx.getStorageSync('name');
    if (imei != '' || imei != undefined || phone != '' || name != '') {
      that.setData({
        imei: imei,
        phone: phone,
        name: name,
      })
      // wx.setStorageSync('imei', imei)
    }

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