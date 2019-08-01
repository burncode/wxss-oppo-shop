// pages/my/coupon/coupon-list/coupon-list.js
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
    shopList:[],
    shopCurrentIndex: 0,
    // 地图图标列表
    markers: [],
    // 优惠券
    getCouponParam:{
      pageNum:0,
      pageSize:999,
      StoreCode:""
    },
    couponList:[],
    couponNothing:false,
    isBack:false,
    storeDetails:{}
  },

  // 获取附近门店
  getShopList: function (lat, lng){
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/offlineStore/list';
    httpJson.get(path, {
      lat: lat,
      lng: lng,
      page: 0,
      limit: 5,
    }, function (data) {
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return
      }
      let arr = res.body.rows,
        markers = [],
        shopList = []; 
      arr.forEach(function(value,index){
        let iconPath = '../../../../images/icon/icon_marker.png';
        if (index == 0){
          iconPath = '../../../../images/icon/icon_marker_selected.png'
        }
        markers.push({
          id:index,
          longitude: value.lng,
          latitude: value.lat,
          iconPath: iconPath,
          width: '30',
          height: '38'
        })
        if (value.code !== page.data.storeDetails.code) {
          shopList.push(value)
        }
      })
      page.setData({
        shopList: shopList,
        markers: markers
      })
    })
  },

  // 拨打电话
  onMakePhoneCall:function(event){
    let phoneNumber = event.currentTarget.dataset.phone;
    if (phoneNumber === ""){
      app.errTip("该门店未填写电话号码");
    }else{
      wx.makePhoneCall({
        phoneNumber: phoneNumber,
        success: function (res) {

        },
        fail: function (res) {

        },
        complete: function (res) {

        },
      })
    }
  },

  // 打开地图
  openMap:function(event){
    let data = event.currentTarget.dataset;
    wx.openLocation({
      scale: 28,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      name: data.name,
      address: data.city + data.area + data.street
    });
  },

  // 选择地图中标记的门店
  gotoShops:function(event){
    let id = event.markerId;
    if (id !== this.data.shopCurrentIndex){
      let markers = this.data.markers;
      markers.forEach(function(item,index){
        let iconPath = '../../../../images/icon/icon_marker.png';
        if (index == id) {
          iconPath = '../../../../images/icon/icon_marker_selected.png'
        }
        item.iconPath = iconPath;
      })
      this.setData({
        shopCurrentIndex:id,
        markers: markers
      })
    }
  },

  // 点击附近推荐门店
  onShop:function(event){
    let page = this,
      index = event.currentTarget.dataset.index,
      code = event.currentTarget.dataset.code,
      getCouponParam = page.data.getCouponParam,
      shopList = page.data.shopList;
    getCouponParam.StoreCode = code; 
    page.setData({
      storeDetails: shopList[index],
      shopCurrentIndex:index,
      getCouponParam: getCouponParam
    })
    page.getCouponList(function(){
      wx.pageScrollTo({
        scrollTop: 0
      })
    })
  },

  // 获取当前门店的优惠券列表
  getCouponList: function(cb){
    let page = this,
      getCouponParam = page.data.getCouponParam,
      path = apiHost.config.portalApiHost + 'portal/coupons/getCouponByStoreCode';
    dialog.showLoading('加载中')  
    httpJson.get(path,getCouponParam,function(data){
      dialog.hideLoading();
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return
      }
      let rows = res.body.rows;
      if(rows.length === 0){
        page.setData({
          couponNothing:true,
          couponList: rows
        })
      }else{
        let arr = rows.map(function (item, index) {
          let statusCode = '';
          let statusText = '';
          if (item.takenCount !== item.totalCount){
            if (item.canTaken){
              statusText = "立即领取"
              statusCode = "TAKE_NOW"
            } else if(item.canEnter){
              statusText = "立即使用"
              statusCode = "USE_NOW"
            }else{
              statusText = "已使用"
              statusCode = "USED"
            }
          }else{
            if (!item.canTaken && !item.canEnter){
              if(item.hasToken){
                statusText = "已使用"
                statusCode = "USED"
              }else{
                statusText = "已领完"
                statusCode = "USED_UP"
              }
            }else{
              if(item.canEnter){
                statusText = "立即使用"
                statusCode = "USE_NOW"
              }
            }
          }
          item.statusText = statusText;
          item.statusCode = statusCode;
          item.endTime = Utils.formatDate(new Date(item.endTime), "yyyy-mm-dd");
          return item;
        })
        page.setData({
          couponList: arr,
          couponNothing:false
        })
      }
      if(cb){
        cb()
      }
    })
  },

  // 进入详情页
  gotoDetails:function(event){
    let id = event.currentTarget.dataset.id,
      cantaken = event.currentTarget.dataset.cantaken,
      canenter = event.currentTarget.dataset.canenter,
      statusCode = event.currentTarget.dataset.statuscode;
    if (statusCode === 'USED'){
      app.errTip('您已使用过优惠券了');
    } else if (statusCode === 'USED_UP'){
      app.errTip('优惠券已领完了');
    }else{
      wx.navigateTo({
        url: `../coupon-details/coupon-details?couponType=shops&couponId=${id}`
      })
    }  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    debugger;
    var that = this;
    let getCouponParam = that.data.getCouponParam;
    getCouponParam.StoreCode = options.code;
    let storeDetails = options;
    that.setData({
      getCouponParam: getCouponParam,
      storeDetails: storeDetails
    })
    app.verifyLogin(function (data) {
      // 获取优惠券
      that.getCouponList();
      // 获取附近门店
      var xy = wx.getStorageSync('lat_and_lng');
      xy ? that.getShopList(xy.latitude, xy.longitude) : wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          that.getShopList(res.latitude, res.longitude)
        }
      });
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
    let isBack = this.data.isBack;
    if (isBack) {
      this.getCouponList()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isBack:true
    })
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