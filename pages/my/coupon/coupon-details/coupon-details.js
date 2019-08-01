// pages/my/coupon/coupon-details/coupon-details.js
var app = getApp(),
  dialog = require('../../../../common/dialog.js'),
  apiHost = require('../../../../common/api_host.js'),
  httpJson = require('../../../../utils/http_json'),
  Utils = require('../../../../utils/utils');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponType:"", // 该类型是判断入口为商家优惠券列表或为个人中心优惠券
    couponId:"",
    couponDetails:"",
    modal:false,
    storesListParam: {
      pageNum: 0,
      pageSize: 1
    },
    nothing:false
  },

  // 使用说明按钮
  onExplain:function(){
    let modal = this.data.modal;
    this.setData({
      modal: !modal
    })
  },

  // 立即获取优惠券
  getCoupon:function(event){
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/coupons/takeCoupon';
    dialog.showLoading('加载中');  
    httpJson.get(path,{
      couponId: page.data.couponId
    },function(data){
      dialog.hideLoading();
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return
      }
      let couponDetails = page.data.couponDetails;
      couponDetails.coupon.canTaken = false;
      couponDetails.coupon.takenCount = couponDetails.coupon.takenCount +　1;
      couponDetails.code = res.body.code;
      page.setData({
        couponDetails: couponDetails
      })
      wx.showModal({
        title: '提示',
        content: '领取成功，请前往我的优惠券查看',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    })
  },

  // 获取优惠券详情
  getCouponDetails:function(){
    let page = this, path, param = {};
    let couponType = page.data.couponType;
    if (couponType === "shops"){
      path = apiHost.config.portalApiHost + 'portal/coupons/couponListDetail';
      param.couponId = page.data.couponId;
      param = Object.assign(param, page.data.storesListParam);
    }else{
      path = apiHost.config.portalApiHost + 'portal/coupons/myCouponDetail';
      param.couponDetailId = page.data.couponId;
      param = Object.assign(param, page.data.storesListParam);
    }
    dialog.showLoading('加载中');
    httpJson.get(path, param, function (data) {
      dialog.hideLoading();
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return
      }
      let couponDetails = res.body;
      couponDetails.coupon.startTime = Utils.formatDate(new Date(couponDetails.coupon.startTime),"yyyy-mm-dd")
      couponDetails.coupon.endTime = Utils.formatDate(new Date(couponDetails.coupon.endTime), "yyyy-mm-dd")
      // if (couponType === "shops"){
      //   if (couponDetails.stores.length < 20){
      //     page.setData({
      //       nothing:true
      //     })
      //   }
      //   let arr;
      //   if (page.data.couponDetails.stores){
      //     arr = page.data.couponDetails.stores;
      //   }else{
      //     arr = []
      //   }
      //   for (let i = 0; i < couponDetails.stores.length; i++){
      //     arr.push(couponDetails.stores[i]);
      //   }
      //   couponDetails.stores = arr;
      // }
      page.setData({
        couponDetails: couponDetails
      })
    })
  },

  // 打开地图
  openMap: function (event) {
    let data = event.currentTarget.dataset;
    wx.openLocation({
      scale: 28,
      latitude: data.latitude,
      longitude: data.longitude,
      name: data.name,
      address: data.city + data.area + data.street
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this;
    app.verifyLogin(function (data) {
      page.setData({
        couponType: options.couponType,
        couponId: options.couponId
      })
      page.getCouponDetails()
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
    // let that = this,
    //   storesListParam = that.data.storesListParam,
    //   nothing = that.data.nothing,
    //   couponType = that.data.couponType;
    // if (couponType === "shops") {
    //   if (!nothing) {
    //     storesListParam.pageNum = storesListParam.pageNum + 1; 
    //     that.setData({
    //       storesListParam: storesListParam
    //     });
    //     that.getCouponDetails()
    //   }
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})