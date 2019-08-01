// pages/my/coupon/coupon.js
var app = getApp(),
  dialog = require('../../../common/dialog.js'),
  apiHost = require('../../../common/api_host.js'),
  httpJson = require('../../../utils/http_json'),
  Utils = require('../../../utils/utils');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentNavInd: 0,
    myCouponParam: {
      pageNum: 0,
      pageSize: 15,
      status: "UNUSED"
    },
    couponList: [],
    totalPage: "",
    nothing: false,
  },

  // 导航栏点击
  onNav: function (event) {
    let ind = event.currentTarget.dataset.index;
    let status = event.currentTarget.dataset.status;
    let myCouponParam = this.data.myCouponParam;
    myCouponParam.pageNum = 0;
    myCouponParam.status = status;
    this.setData({
      currentNavInd: ind,
      myCouponParam: myCouponParam
    })
    this.getMycoupon()
  },

  // 获取我的优惠券列表
  getMycoupon: function () {
    let page = this,
      myCouponParam = page.data.myCouponParam,
      path = apiHost.config.portalApiHost + 'portal/coupons/getMyCoupon';
    dialog.showLoading('加载中');
    httpJson.get(path, myCouponParam, function (data) {
      dialog.hideLoading();
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return
      }
      let rows = res.body.rows;
      let currentPage = myCouponParam.pageNum;
      let couponList;
      if (currentPage === 0) {
        couponList = []
      } else {
        couponList = page.data.couponList;
      }
      if (rows.length === 0) {
        if (currentPage === 0) {
          page.setData({
            couponList: rows,
            nothing: true,
            totalPage: res.body.totalPage
          })
        } else {

        }
      } else {
        rows.forEach(function (item, index) {
          item.coupon.endTime = Utils.formatDate(new Date(item.coupon.endTime), "yyyy-mm-dd");
          couponList.push(item)
        })
        page.setData({
          couponList: couponList,
          nothing: false,
          totalPage: res.body.totalPage
        })
      }
    })
  },

  // 点击跳转详情页
  gotoDetails: function (event) {
    let id = event.currentTarget.dataset.id;
    let status = event.currentTarget.dataset.status;
    if (status === "UNUSED") {
      wx.navigateTo({
        url: './coupon-details/coupon-details?couponType=personal&couponId=' + id,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this;
    app.verifyLogin(function (data) {
      page.getMycoupon()
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
    let that = this,
      myCouponParam = that.data.myCouponParam,
      pageNum = myCouponParam.pageNum,
      totalPage = that.data.totalPage;
    if ((pageNum + 1) == totalPage) {
      return;
    }
    myCouponParam.pageNum = pageNum + 1;
    that.setData({
      myCouponParam: myCouponParam
    })
    that.getMycoupon()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})