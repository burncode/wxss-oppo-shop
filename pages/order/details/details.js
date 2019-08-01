// pages/order/details/details.js
var app = getApp();
var dialog = require('../../../common/dialog.js');
var apiHost = require('../../../common/api_host.js');
var httpJson = require('../../../utils/http_json.js');
var order = require('../../../common/order.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoice: [
      { name: 'PERSON', value: '个人', checked: true },
      { name: 'COMPANY', value: '公司' }
    ],
    // deliveryWayList: [
    //   { name: 'SF', value: '顺丰' },
    //   { name: 'YTO', value: '圆通' },
    //   { name: 'EMS', value: 'EMS' },
    // ],
    deliveryWayList: [
      { name: 'YTO', value: '圆通' },
    ],
    deliveryWay: '',
    invoiceType: 'PERSON',
    myAddrListData: {
      page: 0,
      limit: 99999
    },
    entityIds: '',
    goods: '',
    status: order.status,
    totalPrice: 0,
    selectedAddrId: '',
    buyerMessage: '',
    invoiceTitle: '',
    personInvoiceTitle: '',
    dutyNo: ''
  },

  getNum(num) {
    let n = parseFloat(num.toPrecision(12))
    return n;
  },

  radioChange(event) { //发票抬头选择个人或公司
    let name = event.detail.value;
    this.setData({
      invoiceType: name
    })
  },

  deliveryWayRadioChange(event) { //快递方式选择
    let value = event.detail.value;
    this.setData({
      deliveryWay: value
    })
  },

  onBuyerMessage(event) {  //留言
    let value = event.detail.value;
    this.setData({
      buyerMessage: value
    })
  },

  onPersonInvoiceTitle(event) {
    let value = event.detail.value;
    this.setData({
      personInvoiceTitle: value
    })
  },

  onInvoiceTitle(event) { //发表抬头
    let value = event.detail.value;
    this.setData({
      invoiceTitle: value
    })
  },

  onDutyNo(event) { //税号
    let value = event.detail.value;
    this.setData({
      dutyNo: value
    })
  },

  onSelectedAddress(event) { //选择地址
    let page = this,
      address = page.data.address;
    if (address) {
      wx.navigateTo({
        url: '../../my/address/select-list/select-list?id=' + page.data.address.id
      })
    } else {
      wx.navigateTo({
        url: '../../my/address/add/add?type=add&isSelected=true'
      })
    }
  },

  findCurrentGoods: function (id) { //商品信息回填
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/goods/findCurrentGoods',
      goodsJson = page.data.goodsJson;
    let goodsEntityIds = [];
    goodsJson.forEach(function (value, index) {
      goodsEntityIds.push(value.entityId)
    })
    httpJson.get(path, {
      goodsEntityIds: goodsEntityIds.join(",")
    }, function (data) {
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return;
      }
      let list = res.body,
        totalPrice = 0,
        postage = 0;
      console.log(list)
      list.forEach(function (value, index) {
        if (value.postage > postage) {
          postage = value.postage
        }
        for (let i = 0; i < goodsJson.length; i++) {
          if (value.currentGoodsEntity.id == goodsJson[i].entityId) {
            value.goodsNum = goodsJson[i].num
          }
        }
        totalPrice = page.getNum(totalPrice + value.currentGoodsEntity.price * value.goodsNum)
      })
      let total = page.getNum(totalPrice + postage);
      let deliveryWay;
      let deliveryWayList = page.data.deliveryWayList;
      deliveryWayList[0].checked = true;
      deliveryWay = 'YTO'
      // if (total >= 79) {
      //   deliveryWayList[0].checked = true;
      //   deliveryWay = 'SF'
      // } else {
      //   deliveryWayList = [deliveryWayList[deliveryWayList.length - 2], deliveryWayList[deliveryWayList.length - 1]];
      //   deliveryWayList[0].checked = true;
      //   deliveryWay = 'YTO'
      // }
      page.setData({
        goods: res.body,
        totalPrice: page.getNum(totalPrice + postage),
        postage: postage,
        deliveryWayList: deliveryWayList,
        deliveryWay: deliveryWay
      })
    })
  },

  getAddrList: function () {  //获取地址列表
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/shop/recipientAddr/getMyAddrList';
    httpJson.get(path, page.data.myAddrListData, function (data) {
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return;
      }
      let arr = res.body.rows;
      let address;
      if (arr.length == 0) {

      } else {
        let selectedAddrId = page.data.selectedAddrId;
        if (selectedAddrId != "") {
          arr.forEach(function (value, index) {
            if (value.id == selectedAddrId) {
              address = value;
            }
          })
        } else {
          arr.forEach(function (value, index) {
            if (value.isDefault) {
              address = value;
            }
          })
          if (address == undefined) {
            address = arr[0]
          }
        }
        page.setData({
          address: address,
          personInvoiceTitle: address.recipientName
        })
      }
    })
  },

  submit(event) {  //提交支付
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/order/pay/prepay_shop',
      goodsJson = [];
    goodsJson.push({ entityId: page.data.entityIds, num: page.data.goodsNum });
    if (!page.data.address) {
      app.errTip('请先添加地址');
      return;
    }
    let data = {
      goodsJson: JSON.stringify(page.data.goodsJson),
      recipientName: page.data.address.recipientName,
      recipientPhone: page.data.address.phone,
      recipientProvince: page.data.address.province,
      recipientCity: page.data.address.city,
      recipientArea: page.data.address.area,
      recipientStreet: page.data.address.street,
      deliveryWay: page.data.deliveryWay
    }
    let buyerMessage = page.data.buyerMessage,
      invoiceTitle = page.data.invoiceTitle,
      dutyNo = page.data.dutyNo,
      invoiceType = page.data.invoiceType;
    if (buyerMessage != '') {
      data.buyerMessage = buyerMessage
    }
    if (invoiceType == 'PERSON') {
      if (page.data.personInvoiceTitle == '') {
        app.errTip('请输入发票抬头');
        return
      }
      data.invoiceTitle = page.data.personInvoiceTitle;
    } else {
      if (invoiceTitle == '') {
        app.errTip('请输入发票抬头');
        return
      }
      if (dutyNo == '') {
        app.errTip('请输入纳税人识别号');
        return
      }
      data.invoiceTitle = invoiceTitle;
      data.dutyNo = dutyNo
    }
    dialog.showLoading('加载中');
    httpJson.post(path, data, function (data) {
      dialog.hideLoading();
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return;
      }
      let param = res.body.jssdkPayConfig;
      let orderId = res.body.orderId;
      page.requestPayment(param, orderId);
    })
  },

  pay(event) { //去支付(状态为待支付)
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/order/pay/prepay_order',
      orderId = event.currentTarget.dataset.orderid;
    dialog.showLoading('加载中');
    httpJson.post(path, {
      orderId: orderId
    }, function (data) {
      dialog.hideLoading();
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return;
      }
      let param = res.body.jssdkPayConfig;
      let orderId = res.body.orderId;
      page.requestPayment(param, orderId);
    })
  },

  requestPayment(param, orderId) { //调用小程序支付api
    wx.requestPayment({
      timeStamp: param.timestamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function (res) {
        dialog.showLoading('加载中');
        setTimeout(() => {
          dialog.hideLoading();
          wx.navigateTo({
            url: '../../my-order/my-order'
          })
        }, 5000);
      },
      fail: function (res) {

      }
    })
  },

  getOrderDetail: function (id) {  //订单列表进来渲染订单详情
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/order/manage/get';
    httpJson.get(path, {
      id: id
    }, function (data) {
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return;
      }
      let list = res.body.shopOrderGoodsList;
      let totalPrice = 0;
      let postage = res.body.postage;
      list.forEach(function (value, index) {
        let specs = [];
        let arr = JSON.parse(value.goodsSpecs);
        for (let name in arr) {
          specs.push(arr[name])
        }
        value.goodsSpecs = specs;
        totalPrice = page.getNum(totalPrice + value.totalAmount);
      })
      let deliveryWayText,
        deliveryWay = res.body.deliveryWay;
      switch (deliveryWay) {
        case 'SF':
          deliveryWayText = '顺丰快递';
          break;
        case 'YTO':
          deliveryWayText = '圆通快递';
          break;
        case 'EMS':
          deliveryWayText = 'EMS快递';
          break;
      }
      res.body.deliveryWayText = deliveryWayText;
      page.setData({
        postage: postage,
        goods: list,
        orderDetail: res.body,
        totalPrice: page.getNum(totalPrice + postage)
      })
    })
  },

  onReturns(event) {  //退换货按钮
    app.errTip('请咨询微信公众号或官方客服')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this;
    app.verifyLogin(function (data) {
      if (options.type == 'submit') {
        page.setData({
          goodsJson: JSON.parse(options.goodsJson),
          type: options.type,
        })
        page.findCurrentGoods();
        page.getAddrList();
      } else {
        page.getOrderDetail(options.id)
        page.setData({
          type: options.type,
        })
      }
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
    let selectedAddrId = page.data.selectedAddrId;
    if (selectedAddrId != "") {
      page.getAddrList();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})