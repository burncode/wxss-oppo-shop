// pages/cart/cart.js
var app = getApp();
var dialog = require('../../common/dialog.js');
var apiHost = require('../../common/api_host.js');
var httpJson = require('../../utils/http_json.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    delBtnWidth: 140,
    cartListData:{
      page:0,
      limit:20
    },
    cart:[],
    goodJson:[],
    totalPrice:0,
    isInput:false,
    nothing:false
  },

  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var cart = this.data.cart;
      cart[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        cart: cart
      });
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var cart = this.data.cart;
      cart[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        cart: cart
      });
    }
  },

  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },

  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },

  getNum(num){
    let n = parseFloat(num.toPrecision(12))
    return n;
  },

  onFocusGoodsNum(event){
    
  },

  onInputStopEvent(event) { //阻止数量输入框事件冒泡

  },

  onMinus(event) { //数量减一
    let page = this,
      target = event.target.dataset,
      goodsNum = target.goodsnum;
    if (goodsNum == 1) {
      return
    }
    page.shoppingCartUpdata(target,'minus')
  },

  onPlus(event) { //数量加一
    let page = this,
      target = event.target.dataset,
      goodsNum = target.goodsnum;
    if (goodsNum >= 200) {
      app.errTip('最多只能购买200件哦!');
      return;
    }
    page.shoppingCartUpdata(target,'plus')
  },

  onFocusGoodsNum(event){ //商品数量input获取焦点
     this.setData({
       isInput:true
     })
  },

  onBlurGoodsNum(event) { //商品数量input失去焦点
    let page = this,
      target = event.target.dataset;
    target.value = event.detail.value;
    if (target.value > 200) {
      app.errTip('最多只能购买200件哦!');
      page.recoverGoodsNum();
      return;
    }
    // let arr = page.data.cart;
    // arr.forEach(function(item,index){
    //   if (item.goodsNum == target.value){
    //     return
    //   }
    // })
    page.shoppingCartUpdata(target,'input');
  },

  recoverGoodsNum:function(){ //如数量超过200或请求出错时恢复修改之前
    this.setData({
      cart: this.data.cart,
      isInput:false
    })
  },

  gotoDetails(event){ //跳转详情页
    if (!this.data.isInput){
      this.setData({
        isBack: true
      })
      let id = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../goods-details/goods-details?id=' + id,
      })
    }
  },

  recountTotalNum:function(){
    let page = this,
      cart = page.data.cart,
      totalPrice = 0;
    cart.forEach(function(item,value){
      if(item.selected){
        totalPrice = page.getNum(totalPrice + item.shopGoods.currentGoodsEntity.price * item.goodsNum)
      } 
    })
    page.setData({
      totalPrice: totalPrice
    })  
  },

  onSelectedItem(event){ //选择单个商品
    let page = this;
    let index = event.currentTarget.dataset.index;
    let entityId = event.currentTarget.dataset.entityid;
    let num = event.currentTarget.dataset.num;
    let price = event.currentTarget.dataset.price;
    let arr = page.data.cart;
    let goodJson = page.data.goodJson;
    let totalPrice = page.data.totalPrice;
    arr.forEach(function(value,ind){
      if(index == ind){
        if (value.selected){
          value.selected = false;
          goodJson = goodJson.filter(item => item.entityId !== entityId);
          totalPrice = page.getNum(totalPrice - price * num)
        }else{
          value.selected = true;
          goodJson.push({ entityId: entityId, num: num });
          totalPrice = page.getNum(totalPrice + price * num);
        }
      }
    })
    page.setData({
      cart:arr,
      goodJson: goodJson,
      totalPrice: totalPrice
    })
  },

  onSelectedAll(event){ //全选全不选
    let page = this;
    let goodJson = page.data.goodJson;
    let arr = page.data.cart;
    let totalPrice = 0;
    if (goodJson.length == 0){
      arr.forEach(function (value, ind) {
        value.selected = true;
        totalPrice = page.getNum(totalPrice + value.shopGoods.currentGoodsEntity.price * value.goodsNum);
        goodJson.push({ entityId: value.goodsEntityId, num: value.goodsNum });
      })
    }else{
      arr.forEach(function (value, ind) {
        value.selected = false;
        totalPrice = 0;
        goodJson = [];
      })
    }
    page.setData({
      cart:arr,
      goodJson: goodJson,
      totalPrice: totalPrice
    })
  },

  delete(event){
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/shop/shoppingCart/delete',
      id = event.currentTarget.dataset.id,
      entityid = event.currentTarget.dataset.entityid,
      price = event.currentTarget.dataset.price,
      goodsNum = event.currentTarget.dataset.goodsnum;
    wx.showActionSheet({
      itemList: ['删除'],
      itemColor: '#EE0000',
      success: function (res) {
        if(!res.cancel){
          httpJson.post(path, {
            id: id
          }, function (data) {
            let res = data.data;
            if (res.errorCode != 0) {
              app.errTip(res.msg);
              return;
            }
            let arr = page.data.cart;
            let goodJson = page.data.goodJson;
            goodJson = goodJson.filter(item => item.entityId !== entityid);
            let totalPrice = page.data.totalPrice;
            if (goodJson.length != 0 ){
              totalPrice = page.getNum(totalPrice - price * goodsNum);
            }
            arr = arr.filter(item => item.id !== id);
            if (arr.length == 0){
              page.setData({
                nothing: true
              })
            }
            page.setData({
              cart: arr,
              goodJson: goodJson,
              totalPrice: totalPrice
            })
          })
        }
      },
      fail: function (res) {

      }
    })  
  },

  getCartList:function(){
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/shop/shoppingCart/list';
    dialog.showLoading('加载中');  
    httpJson.get(path, page.data.cartListData,function(data){
      dialog.hideLoading();
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return
      }
      let arr;
      let cartListData = page.data.cartListData;
      let currentPage = cartListData.page;
      if (currentPage == 0){
        arr = [];
      }else{
        arr = page.data.cart;
      }
      let cart = res.body.rows;
      cart.forEach(function(value,index){
        if (!value.isOffShelve && value.isOffShelve != null){
          value.selected = false;
          arr.push(value)
        }
      })
      if (arr.length == 0 && currentPage == 0) {
        page.setData({
          nothing: true
        })
      }
      page.setData({
        cart: arr,
        totalPage: res.body.totalPage
      })
    })  
  },

  shoppingCartUpdata:function(itemValue,type){  //购物车数量更新
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/shop/shoppingCart/update';
    let goodsNum;  
    if (type == 'minus') {
      goodsNum = Number(itemValue.goodsnum) - 1
    } else if (type == 'plus'){
      goodsNum = Number(itemValue.goodsnum) + 1
    } else{
      goodsNum = itemValue.value
    } 
    dialog.showLoading('加载中');
    httpJson.post(path, {
      id: itemValue.id,
      goodsEntityId: itemValue.goodsentityid,
      goodsNum: goodsNum
    }, function (data) {
      dialog.hideLoading();
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        page.recoverGoodsNum();
        return
      }
      let arr = page.data.cart;
      arr.forEach(function(item,index){
        if(item.id == itemValue.id){
          item.goodsNum = goodsNum
        }
      })
      page.setData({
        cart:arr,
        isInput: false
      })
      page.recountTotalNum()
    })
  },

  onPay(event){
    let page = this,
      goodsJson = page.data.goodJson;
    if (goodsJson.length == 0){
      app.errTip('请先选择商品');
    }else{
      wx.navigateTo({
        url: '../order/details/details?goodsJson=' + JSON.stringify(goodsJson) + '&type=submit'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this;
    app.verifyLogin(function(data){
      page.setData({
        isBack:false
      })
      page.initEleWidth();
      page.getCartList();
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
    let page = this;
    let isBack = page.data.isBack;
    if (isBack){
      let cartListData = page.data.cartListData;
      cartListData.page = 0;
      page.setData({
        cartListData: cartListData,
        goodJson:[],
        totalPrice:0
      })
      page.getCartList()
    }
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
      cartListData = that.data.cartListData,
      page = cartListData.page,
      totalPage = that.data.totalPage;
    if ((page + 1) == totalPage) {
      return;
    }
    cartListData.page = page + 1;
    that.setData({
      cartListData: cartListData
    })
    that.getCartList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})