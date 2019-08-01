// pages/shop/shop.js
var mock = require('../../utils/mock.js');
var app = getApp();
var dialog = require('../../common/dialog.js');
var apiHost = require('../../common/api_host.js');
var httpJson = require('../../utils/http_json.js');
var adList = require('../../components/ad-list/ad-list.js');
var compose = require('../../utils/compose.js');
var shop = {

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    goods: [],
    adListData: {
      type: 'SHOP',
      page: 0,
      limit: 99999
    },
    goodsData: {
      page: 0,
      limit: 20
    },
    proclamationTitle: null
  },

  getAdList: function () { // 获取广告图列表
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/banner/list';
    httpJson.get(path, page.data.adListData, function (data) {
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return
      }
      let arr = res.body.rows;
      page.setData({
        imgUrls: arr
      })
    })
  },

  getGoodsList: function () { // 获取商品列表
    let that = this,
      path = apiHost.config.portalApiHost + 'portal/goods/list';
    dialog.showLoading('加载中');  
    httpJson.get(path, that.data.goodsData, function (data) {
      dialog.hideLoading();
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return
      }
      let goods = that.data.goods;
      let arr = res.body.rows;
      arr.forEach(function(value,index){
        goods.push(value)
      }) 
      that.setData({
        goods: goods,
        totalPage: res.body.totalPage
      })
    })
  },

  getProclamation:function(){
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/announcement/get';
    httpJson.get(path, {}, function (data) {
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return
      }
      page.setData({
        proclamationTitle: res.body.title
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this;
    app.verifyLogin(function (data) {
      page.getAdList();
      page.getProclamation();
      page.getGoodsList();
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
      goodsData = that.data.goodsData,
      page = goodsData.page,
      totalPage = that.data.totalPage;
    if ((page + 1) == totalPage) {
      return;
    }
    goodsData.page = page + 1;
    that.setData({
      goodsData: goodsData
    })
    that.getGoodsList()  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}
shop = compose(shop,adList)
Page(shop)