// pages/my/member/privilege/privilege.js
var mock = require('../../../../utils/mock.js');  //TODO 图片链接是在我们服务器上传
var user = require('../../../../utils/user.js');
var app = getApp();
var index = {

  /**
   * 页面的初始数据
   */
  data: {
    gradeChangeTime: '',
    card: mock.card, //TODO 图片链接是在我们服务器上传
    linearGradient: {
      'commoncard': "linear-gradient(270deg, #2dc8a9, #2ec2c3)",
      'silvercard': "linear-gradient(270deg, #35AFD2, #529BDF)",
      'goldcard': "linear-gradient(270deg, #D2A33B, #DF934A)",
      'diamondcard': "linear-gradient(270deg, #7270E1, #9F73E9)",
    },
    nav: {
      'commoncard': [
        {
          id: '2',
          iconPath: '../../../../images/member/icon_member_1.png',
          name: '免费贴膜'
        },
        {
          id: '1',
          iconPath: '../../../../images/member/icon_member_3.png',
          name: '会员积分'
        },
        {
          id: '0',
          iconPath: '../../../../images/member/icon_member_2.png',
          name: '手机保修和维修'
        }
      ],
      'silvercard': [
        {
          id: '4',
          iconPath: '../../../../images/member/icon_member_4.png',
          name: '指定产品专属价'
        },
        {
          id: '3',
          iconPath: '../../../../images/member/icon_member_5.png',
          name: '维修备用机'
        },
        {
          id: '2',
          iconPath: '../../../../images/member/icon_member_1.png',
          name: '免费贴膜'
        },
        {
          id: '1',
          iconPath: '../../../../images/member/icon_member_3.png',
          name: '会员积分'
        },
        {
          id: '0',
          iconPath: '../../../../images/member/icon_member_2.png',
          name: '手机保修和维修'
        }
      ],
      'goldcard': [
        {
          id: '7',
          iconPath: '../../../../images/member/icon_member_6.png',
          name: '维修费折扣'
        },
        {
          id: '6',
          iconPath: '../../../../images/member/icon_member_3.png',
          name: '碎屏保'
        },
        {
          id: '5',
          iconPath: '../../../../images/member/icon_member_7.png',
          name: '新机试用申请权'
        },
        {
          id: '4',
          iconPath: '../../../../images/member/icon_member_4.png',
          name: '指定产品专属价'
        },
        {
          id: '3',
          iconPath: '../../../../images/member/icon_member_5.png',
          name: '维修备用机'
        },
        {
          id: '2',
          iconPath: '../../../../images/member/icon_member_1.png',
          name: '免费贴膜'
        },
        {
          id: '1',
          iconPath: '../../../../images/member/icon_member_3.png',
          name: '会员积分'
        },
        {
          id: '0',
          iconPath: '../../../../images/member/icon_member_2.png',
          name: '手机保修和维修'
        }
      ],
      'diamondcard': [
        {
          id: '8',
          iconPath: '../../../../images/member/icon_member_8.png',
          name: 'OPPO官方专属活动'
        },
        {
          id: '7',
          iconPath: '../../../../images/member/icon_member_6.png',
          name: '维修费折扣'
        },
        {
          id: '6',
          iconPath: '../../../../images/member/icon_member_3.png',
          name: '碎屏保'
        },
        {
          id: '5',
          iconPath: '../../../../images/member/icon_member_7.png',
          name: '新机试用申请权'
        },
        {
          id: '4',
          iconPath: '../../../../images/member/icon_member_4.png',
          name: '指定产品专属价'
        },
        {
          id: '3',
          iconPath: '../../../../images/member/icon_member_5.png',
          name: '维修备用机'
        },
        {
          id: '2',
          iconPath: '../../../../images/member/icon_member_1.png',
          name: '免费贴膜'
        },
        {
          id: '1',
          iconPath: '../../../../images/member/icon_member_3.png',
          name: '会员积分'
        },
        {
          id: '0',
          iconPath: '../../../../images/member/icon_member_2.png',
          name: '手机保修和维修'
        }
      ],
    },
    type: 'commoncard'
  },

  swiperChange(event) {
    let page = this;
    let current = event.detail.current;
    switch (current) {
      case 0:
        page.setData({
          type: 'commoncard'
        })
        break;
      case 1:
        page.setData({
          type: 'silvercard'
        })
        break;
      case 2:
        page.setData({
          type: 'goldcard'
        })
        break;
      case 3:
        page.setData({
          type: 'diamondcard'
        })
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    app.verifyLogin(function(data){
      let current;
      switch(options.type){
        case 'commoncard' :
          current = 0;
          break;
        case 'silvercard':
          current = 1;
          break;
        case 'goldcard':
          current = 2;
          break;
        case 'diamondcard':
          current = 3;
          break;      
      }
      page.setData({
        type:options.type,
        current: current
      })
      wx.getSystemInfo({
        success: function (res) {
          page.setData({
            windowWidth: res.windowWidth,
            windowHeight: res.windowHeight,
            scale: 750 / res.windowWidth,
          })
        }
      })
      var path = '/member/operation/memIndex.do';
      user.get(path, {
        openid: wx.getStorageSync('openid'),
      }, function (data) {
        let res = data.data;
        if ([200, 10000].indexOf(res.code) < 0) {

        } else {
          wx.setStorageSync('member', { ssoId: res.result.ssoId, phone: res.result.phone, imie: res.result.imie });
          page.setData({
            gradeChangeTime: res.result.data.gradeChangeTime,
            amount: res.result.data.amount,
          })
        }
      })
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