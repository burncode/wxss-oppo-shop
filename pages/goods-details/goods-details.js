// pages/goods-details/goods-details.js
var app = getApp();
var dialog = require('../../common/dialog.js');
var adList = require('../../components/ad-list/ad-list.js');
var apiHost = require('../../common/api_host.js');
var httpJson = require('../../utils/http_json.js');
var compose = require('../../utils/compose.js');
var WxParse = require('../../wxParse/wxParse.js');
var goodsDateils = {

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图列表
    imgUrls: [],
    // tags当前的值
    tagsCurrentIndex: 0,
    //规格box
    specBox: false,
    // 规格当前的值
    colorIndex: 0,
    networkIndex: 0,
    configurationIndex: 0,
    warrantyIndex: -1,
    screenWarrantyIndex: -1,
    // 商品详情
    goodsDetail: '',
    goodsEntity: '',
    selectedSpecArr: '',
    goodsNum: 1
  },

  onMinus() { //减一
    let value = this.data.goodsNum;
    if (value == 1) {
      return
    }
    this.setData({
      goodsNum: Number(value) - 1
    })
  },

  onPlus() { //加一
    let goodsNum = this.data.goodsNum;
    goodsNum = Number(goodsNum) + 1;
    if (goodsNum > 200) {
      app.errTip('最多只能购买200件哦!');
      goodsNum = 200
    }
    this.setData({
      goodsNum: goodsNum
    })
  },

  onInputGoodsNum(event) {  //数量输入框
    let goodsNum = event.detail.value;
    if (goodsNum > 200) {
      app.errTip('最多只能购买200件哦!')
      goodsNum = 200
    }
    this.setData({
      goodsNum: goodsNum
    })
  },

  onBlurGoodsNum(event) {  //数量输入框失去焦点
    let goodsNum = event.detail.value;
    if (goodsNum == 0 || goodsNum == '') {
      goodsNum = 1
    }
    this.setData({
      goodsNum: goodsNum
    })
  },

  onSpec(event) { //显示隐藏规格
    let page = this;
    let type = event.currentTarget.dataset.type;
    if (type == 'show') {
      page.setData({
        specBox: true
      })
    } else {
      page.setData({
        specBox: false
      })
    }
  },

  onTags(event) { //tags切换点击事件
    let index = event.target.dataset.index;
    this.setData({
      tagsCurrentIndex: index
    })
  },

  getGoodsDetail: function (id) { //获取商品详情
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/goods/get';
    dialog.showLoading("加载中");
    httpJson.get(path, {
      goodsId: id
    }, function (data) {
      dialog.hideLoading();
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return
      }
      let details = res.body;
      let specList = details.shopGoodsSpecList;
      let selectedArr = [];
      let specListArr = [];
      for (let i = 0; i < specList.length; i++) {
        let list = [];
        let arr = JSON.parse(specList[i].specValues);
        arr.forEach(function (currentValue, index) {
          let value = currentValue;
          let ind = index;
          let selected = '';
          if (ind == 0) {
            selected = true;
            selectedArr.push({ specName: specList[i].specName, specValue: value });
          } else {
            selected = false
          }
          list[list.length] = { specValue: currentValue, selected: selected }
        })
        specList[i].specValues = list;
      }
      let goodsEntity = page.getGoodsEntity(details.shopGoodsEntityList, selectedArr);
      if (details.introduction != null) {
        WxParse.wxParse('introduction', 'html', details.introduction, page, 0);
      }
      if (details.specIntroduction != null) {
        WxParse.wxParse('specIntroduction', 'html', details.specIntroduction, page, 0);
      }
      // 商品轮播图
      let adList = []
      let summaryImgsArr = JSON.parse(details.summaryImgs)
      for (let i = 0; i < summaryImgsArr.length; i++) {
        adList.push({ img: summaryImgsArr[i] })
      }
      page.setData({
        goodsDetail: details,
        imgUrls: adList,
        goodsEntity: goodsEntity,
        selectedSpecArr: selectedArr
      })
    })
  },

  getGoodsEntity: function (goodSpeList, selectedArr) { //获取商品规格主体
    var goodSpeListScope = goodSpeList;
    if (selectedArr.length == 0) {
      return goodSpeListScope[0]
    } else {
      for (var i in selectedArr) {
        var selected = selectedArr[i];
        var tempGoodSpeList = [];
        for (var j in goodSpeListScope) {
          var goodSpe = goodSpeListScope[j];
          var speList = goodSpe.shopGoodsEntitySpecList;
          for (var k in speList) {
            var spe = speList[k];
            if (spe.specName == selected.specName && spe.specValue == selected.specValue) {
              tempGoodSpeList[tempGoodSpeList.length] = goodSpe;
              break;
            }
          }
        }
        goodSpeListScope = tempGoodSpeList;
      }
      if (goodSpeListScope.length == 1) {
        return goodSpeListScope[0]
      }
      return null;
    }
  },

  selectedSpec(event) { //选中规格
    let page = this,
      tar = event.currentTarget.dataset,
      outerIndex = tar.outerindex,
      specIndex = tar.specindex,
      specName = tar.specname,
      specValue = tar.specvalue,
      selectedArr = page.data.selectedSpecArr,
      goodsDetail = page.data.goodsDetail;
    goodsDetail.shopGoodsSpecList[outerIndex].specValues.forEach(function (currentValue, index) {
      if (specIndex == index) {
        currentValue.selected = true
      } else {
        currentValue.selected = false
      }
    })
    selectedArr.forEach(function (currentValue, index) { //替换已选中规格
      if (currentValue.specName == specName) {
        currentValue.specValue = specValue
      }
    })
    let goodsEntity = page.getGoodsEntity(page.data.goodsDetail.shopGoodsEntityList, selectedArr)
    page.setData({
      goodsEntity: goodsEntity,
      selectedSpecArr: selectedArr,
      goodsDetail: goodsDetail
    })
  },

  addCar: function (event) {
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/shop/shoppingCart/create';
    httpJson.post(path, {
      goodsId: page.data.goodsDetail.id,
      goodsEntityId: page.data.goodsEntity.id,
      goodsNum: page.data.goodsNum
    }, function (data) {
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return
      }
      dialog.showToast('加入购物车成功');
    })
  },

  onPay(event) { //立即购买
    let page = this;
    let goodsJson = [];
    goodsJson.push({ entityId: page.data.goodsEntity.id, num: page.data.goodsNum });
    wx.navigateTo({
      url: '../order/details/details?goodsJson=' + JSON.stringify(goodsJson) + '&type=submit'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this;
    app.verifyLogin(function (data) {
      page.setData({
        id: options.id
      })
      page.getGoodsDetail(options.id)
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
goodsDateils = compose(goodsDateils, adList)
Page(goodsDateils)