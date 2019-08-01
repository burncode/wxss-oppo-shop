var host = getApp().globalData.host;
var app = getApp();
Page({
  data: {
    giftType: "",
    awardGroup: [],
    useBoxShow: false,
    addVotes: 0
  },
  //设置奖品图标
  setAward: function (awardId) {
    var that = this;
    if (awardId == 1) {
      that.setData({
        giftType: 'qiyi'
      })
    } else if (awardId == 2) {
      that.setData({
        giftType: 'QQYY'
      })
    } else if (awardId == 3) {
      that.setData({
        giftType: 'elong'
      })
    }
  },
  //显示活动规则
  showGuize: function () {
    var that = this;
    that.setData({
      guize: true,
    })
  },
  //打开使用规则弹框
  openUse: function () {
    var that = this;
    that.setData({
      useBoxShow: true
    });
  },
  //关闭弹框
  closeDialog: function () {
    this.setData({
      useBoxShow: false,
      errMsg: '',
      guize: false
    })
  },
  //获取助力好友中奖列表
  getAwardList: function (imei) {
    var that = this;
    wx.request({
      url: host + '/praisesmall/phone/PraiseChouJiang/getAllFriends.json',
      data: {
        imei: imei,
        offset: 1,
        pageSize: 5
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.status == 'true') {
          var awardGroup = res.data.data;
          that.setData({
            awardGroup: awardGroup
          })
        } else if (res.data.status == 'false') {
          return false;
        }
      }
    })
  },
  //获取中奖信息以及投票信息
  getAwardVote: function (openid, imei) {
    var that = this;
    wx.request({
      url: host + '/praisesmall/phone/PraiseLike/getHelpInfo.json',
      data: {
        imei: imei,
        openid: openid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.status == 'true') {
          if (res.data.data.vote == "没有投票信息") {
            that.setData({
              addVotes: 0
            })
          } else {
            if (res.data.data.vote.addVotes || res.data.data.vote.addVotes != '' || res.data.data.vote.addVotes != null || res.data.data.vote.addVotes != undefined) {
              that.setData({
                addVotes: res.data.data.vote.addVotes
              })
            } else {
              that.setData({
                addVotes: 0
              })
            }

          }
          if (res.data.data.award == "没有中奖信息") {
            return false;
          } else {
            that.setData({
              awardname: res.data.data.award.awardname,
              ticketnumber: res.data.data.award.ticketnumber,
              awardid: res.data.data.award.awardid,
            })
            that.setAward(res.data.data.award.awardid);
          }
        } else if (res.data.status == 'false') {
          return false;
        }
      }
    })
  },
  //进入产品页面
  enterIntro: function () {
    wx.navigateTo({
      url: '/pages/warrant/productIntro/productIntro'
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var nickName = options.nickName;
    var openid = wx.getStorageSync('openid');
    if(openid==undefined||!openid||openid==''){
      app.verifyLogin();
    }
    var imei = wx.getStorageSync('imei');
    that.setData({
      nickName: nickName,
      openid: openid,
      imei: imei
    });

    that.getAwardVote(openid, imei);
    that.getAwardList(imei);
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