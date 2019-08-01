var host = getApp().globalData.host;
var app = getApp();
Page({
  data: {
    starPic: '',
    myScore: '99',
    myRank: '暂无',
    voteList: '',
    shortBtn: '',
    awardTrue: false,
    showLocation: false
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
  //进入排行页面
  enterRankList: function () {
    wx.redirectTo({
      url: '/pages/warrant/myRank/myRank'
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
  //分享领延保
  onShareAppMessage: function (res) {
    var that = this;
    var opendid = this.data.openid;
    var imei = this.data.imei;
    var phone = this.data.phone;
    var name = this.data.name;
    var nickName = this.data.nickName;
    var headImage = this.data.headImage;
    return {
      title: '帮我助力，OPPO R11s送你好礼！',
      path: '/pages/warrant/giveWarrant/giveWarrant?openid=' + opendid + '&imei=' + imei + '&nickName=' + nickName + '&headImage=' + headImage,
      success: function (res) {
        thst.setData({
          errMsg:'分享成功！'
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //保存imei信息
  saveImeiInfo: function () {
    var that = this;
    var imei = this.data.imei;
    var phone = this.data.phone;
    var name = this.data.name;
    var nickName = this.data.nickName;
    var headImage = this.data.headImage;
    var openid = this.data.openid;
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
          return true;
        } else {
          return false;
        }
      }
    })
  },
  //关闭地址填写弹框
  closeAddDialog: function () {
    this.setData({
      showLocation: false,
    })
  },
  //显示地址填写弹框
  showLocaBox: function () {
    this.setData({
      showLocation: true
    })
  },
  //检测是否已经填写过地址
  checkAddress: function () {
    var that = this;
    var imei = that.data.imei;
    wx.request({
      url: host + '/praisesmall/phone/PraiseChouJiang/checkAwardInfo.json',
      data: {
        imei: imei,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.status == 'true') {
          that.setData({
            showLocation: true
          })
        } else {
          if (res.data.msg == '已经填写过地址') {
            that.setData({
              errMsg: "您已经提交过地址信息了，不可再次修改"
            })
          } else {
            that.setData({
              errMsg: res.data.msg
            })
          }
        }
      }
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
            tag: res.data.data.tag,
            comment: res.data.data.comment,
            nickName: res.data.data.nickName,
            headImage: res.data.data.headImage,
          })
          that.setStarPic(res.data.data.tag);
        }
      }
    })
  },
  //获取朋友助力信息
  getVote: function () {
    var that = this;
    var imei = that.data.imei;
    wx.request({
      url: host + '/praisesmall/phone/PraiseVoteLog/getVotesList.json',
      data: {
        imei: imei,
        offset: 0,
        pagesize: 5
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.status == 'true') {
          if (res.data.data != '' || res.data.data != null) {
            that.setData({
              voteList: res.data.data,
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
  //验证是否中奖
  checkAward: function () {
    var that = this;
    var imei = that.data.imei;
    wx.request({
      url: host + '/praisesmall/phone/PraiseChouJiang/checkPreviousAward.json',
      data: {
        imei: imei,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.status == 'true') {
          if (res.data.msg == "中奖!") {
            that.setData({
              shortBtn: 'short-btn',
              awardTrue: true
            })
          }
        } else {
          return false;
        }
      }
    })
  },
  //保存中奖信息
  subLocaInfo: function (e) {
    var that = this;
    var subInfo = e.detail.value;
    var imei = that.data.imei;
    if (subInfo.name === '' || subInfo.name === " ") {
      that.setData({
        errMsg: '请填写您的姓名！'
      })
    } else if (subInfo.phone === '' || subInfo.phone === " ") {
      that.setData({
        errMsg: '请填写您的手机号码！'
      })
    } else if (!/^1(3|4|5|7|8)\d{9}$/.test(subInfo.phone)) {
      that.setData({
        errMsg: '请填写正确的手机号码！'
      })
    } else if (subInfo.address === '' || subInfo.address === " ") {
      that.setData({
        errMsg: '请填写您的详细地址！'
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '请您确认是否提交信息，提交信息后不可修改。',
        confirmText: '确认提交',
        cancelText: '取消提交',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: host + '/praisesmall/phone/PraiseImeiInfo/saveAwardInfo.json',
              data: {
                imei: imei,
                awardName: subInfo.name,
                awardPhone: subInfo.phone,
                awardAddress: subInfo.address,
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success: function (res) {
                if (res.data.status == 'true') {
                  if (res.data.msg == "保存成功") {
                    that.setData({
                      errMsg: '提交成功！',
                      showLocation: false,
                    })
                  }
                } else {
                  that.setData({
                    errMsg: res.data.msg
                  })
                }
              }
            })
          } else if (res.cancel) {
            return false;
          }
        }
      })
    }

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var page = this;
    var userInfo = wx.getStorageSync('userInfo');
    var openid = wx.getStorageSync('openid');
    var phone = wx.getStorageSync('phone');
    var name = wx.getStorageSync('name');
    if (openid == undefined || !openid || openid == '') {
      app.verifyLogin();
    }
    var imei = wx.getStorageSync('imei');
    page.setData({
      phone: phone,
      imei: imei,
      openid: openid,
      name: name,
    })
    page.getComment();
    page.getMyRank();
    page.getVote();
    page.checkAward();
    page.saveImeiInfo();
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