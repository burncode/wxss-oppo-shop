// pages/my-order/my-order.js
var app = getApp(),
  dialog = require('../../common/dialog.js'),
  apiHost = require('../../common/api_host.js'),
  httpJson = require('../../utils/http_json.js'),
  order = require('../../common/order.js'),
  utils = require('../../utils/utils.js');
var myOrder = {

  /**
   * 页面的初始数据
   */
  data: {
    nothing: false,
    orderParam: {
      status: '',
      bizType: '',
      page: 0,
      limit: 20
    },
    navCurrentIndex: 0,
    orderList: [],
    status: order.status,
  },

  onNav(event) {
    let page = this;
    let index = event.currentTarget.dataset.index;
    let status = event.currentTarget.dataset.status;
    let data = page.data.orderParam;
    data.status = status;
    data.page = 0;
    page.setData({
      navCurrentIndex: index,
      orderParam: data
    })
    page.getList()
  },

  getList: function () {
    var page = this,
      path = apiHost.config.portalApiHost + 'portal/order/manage/list';
    dialog.showLoading('加载中');
    httpJson.get(path, page.data.orderParam, function (data) {
      dialog.hideLoading();
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return;
      }
      // 判断是否为从第0页开始 如果是,清空订单列表
      let currentPage = page.data.orderParam.page;
      if (currentPage == 0) {
        page.setData({
          orderList: []
        })
      }
      // 返回接口长度为0,为空内容
      if (res.body.rows.length == 0) {
        page.setData({
          orderList: res.body.rows,
          nothing: true,
          totalPage: res.body.totalPage
        })
      } else {
        let orderList = page.data.orderList;
        let arr = res.body.rows;
        arr.forEach(function (value, index) {
          let createdTime = value.createdTime;
          let date = utils.formatDate(new Date(createdTime), 'yyyy-mm-dd hh:ii');
          value.date = date;
          if (value.bizType == 'SHOP') {
            let list = value.shopOrderGoodsList;
            list.forEach(function (listValue, index) {
              let specs = [];
              let arr = JSON.parse(listValue.goodsSpecs);
              for (let name in arr) {
                specs.push(arr[name])
              }
              listValue.goodsSpecs = specs;
            })
          }
          if (page.data.orderParam.status != 'PAID') {
            orderList.push(value)
          } else {
            if (value.bizType == 'SHOP') {
              orderList.push(value)
            }
          }
        })
        let nothing;
        if (orderList.length == 0) {
          nothing = true
        } else {
          nothing = false
        }
        page.setData({
          orderList: orderList,
          nothing: nothing,
          totalPage: res.body.totalPage
        })
      }
    })
  },

  ondeleteOrder(event) {
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/order/manage/delete',
      id = event.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList: ['删除'],
      itemColor: '#EE0000',
      success: function (res) {
        if (!res.cancel) {
          httpJson.post(path, {
            id: id
          }, function (data) {
            let res = data.data;
            if (res.errorCode != 0) {
              app.errTip(res.msg);
              return;
            }
            let arr = page.data.orderList
            arr = arr.filter(item => item.id !== id);
            page.setData({
              orderList: arr
            })
          })
        }
      },
      fail: function (res) {

      }
    })
  },

  onConfirm(event) {
    let page = this,
      path = apiHost.config.portalApiHost + '/portal/order/manage/received',
      id = event.currentTarget.dataset.id;
    httpJson.post(path, {
      orderId: id
    }, function (data) {
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return;
      }
      let arr = page.data.orderList;
      arr.forEach(function (value, index) {
        if (value.id == id) {
          value.status = 'RECEIVED'
        }
      })
      page.setData({
        orderList: arr
      })
      app.errTip('确认收货成功');
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this;
    app.verifyLogin(function (data) {
      page.getList()
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
      orderParam = that.data.orderParam,
      page = orderParam.page,
      totalPage = that.data.totalPage;
    if ((page + 1) == totalPage) {
      return;
    }
    orderParam.page = page + 1;
    that.setData({
      orderParam: orderParam
    })
    that.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}
Page(myOrder)