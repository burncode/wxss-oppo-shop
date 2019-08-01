// pages/nav/parts/parts-query/parts-query.js
var user = require('../../../../utils/user.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    partsList:[],
    product:''
  },

  submit: function (product){ //获取配件信息
    var page = this;
    var path = '/ocsm/mes/partsPriceList.do';
    var data = {
      product: product
    }
    user.get(path,data,function(data){
      let res = data.data;
      if ([200, 10000].indexOf(res.code) < 0) {
        app.errTip(res.msg)
      } else {
        let partsList = res.result;
        partsList.forEach(function(value,index){
          let type = value.partsType;
          switch (type){
            case 'USB线':
              value.icon = 'icon_parts_0';
              break
            case '主板':
              value.icon = 'icon_parts_1';
              break
            case '前置摄像头':
              value.icon = 'icon_parts_2';
              break
            case '后置摄像头':
              value.icon = 'icon_parts_3';
              break
            case '屏幕组件':
              value.icon = 'icon_parts_4';
              break
            case '电池':
              value.icon = 'icon_parts_5';
              break
            case '电池盖组件':
              value.icon = 'icon_parts_6';
              break
            case '电源适配器':
              value.icon = 'icon_parts_7';
              break
            case '耳机':
              value.icon = 'icon_parts_8';
              break
            case '旋转体组件':
              value.icon = 'icon_parts_1';
              break
            case '后置双摄像头':
              value.icon = 'icon_parts_3';
              break        
            case '转接线':
              value.icon = 'icon_parts_0';
              break
            case '滑动中框组件':
              value.icon = 'icon_parts_3';
              break  
          }
        })
        page.setData({
          partsList: res.result
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this;
    let product = options.product; 
    app.verifyLogin(function(data){
      page.setData({
        product: product
      })
      page.submit(product)
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