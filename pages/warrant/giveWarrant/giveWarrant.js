var host = getApp().globalData.host;
var app = getApp();
// var user = require('../../utils/user.js');
Page({
  data: {
    starPic: '',
    myScore: '99',
    myRank: '暂无'
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
  //显示活动规则
  showGuize: function () {
    var that = this;
    that.setData({
      guize: true,
    })
  },
  closeDialog: function (e) {
    console.log(e)
    this.setData({
      authErrMsg: '',
      errMsg: '',
      guize: false
    })
  },
  //获取口碑文案
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
  //抽奖、点赞
  awardAct: function () {
    var that = this;
    var imei = that.data.imei;
    var nickName = that.data.userInfo.nickName;
    var votenickName = that.data.nickName;
    var openid = that.data.openid;
    var votedImei = that.data.imei;
    var voted = that.data.voted;
    wx.request({
      url: host + '/praisesmall/phone/PraiseChouJiang/drawAward.htm',
      data: {
        imei: imei,
        openid: openid,
        nickName: nickName
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.status == 'true') {
          if (res.data.data.awardName != '') {
            that.setData({
              awardName: res.data.data.awardName,
              ticketNumber: res.data.data.ticketNumber,
              awardId: res.data.data.award.id,
            })
            wx.navigateTo({
              url: '/pages/warrant/giftTicket/giftTicket?nickName=' + votenickName
            })
          } else {
            return false;
          }
        } else if (res.data.status == 'false') {
          console.log(res)
          if (res.data.msg == '您已经抽过奖!') {
            that.setData({
              errMsg: '您已经投过票了'
            })
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/warrant/giftTicket/giftTicket?nickName=' + votenickName
              })
            }, 1500)

          } else if (res.data.msg == '未中奖!') {
            wx.navigateTo({
              url: '/pages/warrant/giftTicket/giftTicket?nickName=' + votenickName
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
  //为好友投票
  voteAct: function () {
    var that = this;
    var votedImei = that.data.imei;
    var commonNickName = that.data.userInfo.nickName;
    var votedOpenid = that.data.votedOpenid;
    var commonOpenid = that.data.openid;
    var nickName = that.data.nickName;
    wx.showLoading({
      title: '正在投票~',
      mask: true
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 8000)
    if (commonOpenid == undefined || !commonOpenid) {
      app.verifyLogin();
    }
    wx.request({
      url: host + '/praisesmall/phone/PraiseLike/vote.json',
      data: {
        votedImei: votedImei,
        commonOpenid: commonOpenid,
        votedOpenid: votedOpenid,
        commonNickName: commonNickName,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.status == 'true') {
          if (res.data.data.addVotes != '' && res.data.data.addVotes != null) {
            that.setData({
              voted: true
            })
            that.awardAct();
          }
        } else if (res.data.status == 'false') {
          console.log(res)
          wx.hideLoading()
          if (res.data.msg == '您已经投过票') {
            that.setData({
              voted: true
            })
            that.awardAct();
          } else {
            //  that.awardAct(res.data.data.addVotes);
            that.setData({
              errMsg: res.data.msg
            })
          }
        }
      },
      fail: function () {
        that.voteAct(0);
      }
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var page = this;
    wx.clearStorage({
      success: function (res) {
        console.log(options)
        var nickName = options.nickName;
        var headImage = options.headImage;
        var imei = options.imei;
        var openid = options.openid;
        wx.setStorageSync('imei', imei);
        page.setData({
          nickName: nickName,
          headImage: headImage,
          imei: imei,
          votedOpenid: openid,
        })
        page.getComment();
        page.getMyRank();
        app.verifyLogin(function (data) {
          var userInfo = wx.getStorageSync('userInfo');
          var openid = wx.getStorageSync('openid');
          console.log(userInfo)
          console.log(openid)
          page.setData({
            userInfo: userInfo,
            openid: openid
          });

        })
      }
    })

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