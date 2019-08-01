// pages/my/member/privilege-detail/privilege-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    privilege: {
      '0': {
        name: '手机保养和维护',
        desc: '普卡会员在OPPO专卖店享有专业的手机保养与维护服务，包括对OPPO手机外观清洗、系统升级、软件下载等。',
        iconPosition: 'background-position: -400rpx 0rpx;'
      },
      '1': {
        name: '会员积分',
        desc: '普卡会员可通过购买手机、维修服务、推荐、签到、下载等行为获得积分，积分可用于兑换各类积分礼品与服务。',
        iconPosition: 'background-position: -800rpx 0rpx;'
      },
      '2': {
        name: '免费贴膜',
        desc: '在OPPO专卖店，普卡会员享有每年4次免费贴膜（高清膜）服务;该项服务仅限于一年之内购买的手机。',
        iconPosition: 'background-position: -1200rpx 0rpx;'
      },
      '3': {
        name: '维修备用机',
        desc: '对于当天未能维修好手机的银卡会员用户，在OPPO客服中心有备用机的前提下，享有备用机使用权益。',
        iconPosition: 'background-position: 0rpx 0rpx;'
      },
      '4': {
        name: '指定产品专属价',
        desc: '银卡会员购买OPPO指定产品时可享有会员价格， 具体以官方发布为准。',
        iconPosition: 'background-position: -600rpx 0rpx;'
      },
      '5': {
        name: '新机试用申请权',
        desc: '金卡会员享有报名参与OPPO新款手机试用活动的权益，尊享新机试用体验。',
        iconPosition: 'background-position: -200rpx 0rpx;'
      },
      '6': {
        name: '屏碎保',
        desc: '金卡会员新购机时享有2次五折购买“屏碎保一年”服务。具体参考“屏碎保一年”服务相关条款和规则。“屏碎保一年”服务可在OPPO官网、OPPO专卖店及OPPO客服中心购买。',
        iconPosition: 'background-position: -800rpx 0rpx;'
      },
      '7': {
        name: '维修费折扣',
        desc: '金卡会员前往OPPO客服中心进行手机维修时可以享受维修费用9折优惠;维修折扣仅限会员帐号名下的手机使用;维修费折扣不可与其他优惠同时叠加使用。',
        iconPosition: 'background-position: -1400rpx 0rpx;'
      },
      '8': {
        name: 'OPPO官方专属活动',
        desc: '钻卡会员可优先参加OPPO公司官方举办的各类活动，如官方发布会、OPPO总部参观之旅等。',
        iconPosition: 'background-position: -1600rpx 0rpx;'
      }
    },
    currentId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentId: options.id
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
})