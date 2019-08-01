var app = getApp(),
  dialog = require('../../../../common/dialog.js'),
  apiHost = require('../../../../common/api_host.js'),
  httpJson = require('../../../../utils/http_json');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    delBtnWidth: 140,
    address: [],
    myAddrListData: {
      page: 0,
      limit: 20
    },
    selectedAddrId: '',
    nothing: false
  },

  onSetDefault(event) {
    let page = this;
    let target = event.currentTarget.dataset;
    if (target.isdefault) {
      return;
    }
    let id = event.currentTarget.dataset.id
    let currentPage = getCurrentPages();
    var prevPage = currentPage[currentPage.length - 2];
    prevPage.setData({
      selectedAddrId: id
    })
    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      })
    }, 200)
  },

  getAddrList: function () {
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/shop/recipientAddr/getMyAddrList';
    dialog.showLoading('加载中');
    httpJson.get(path, page.data.myAddrListData, function (data) {
      dialog.hideLoading();
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return;
      }
      let selectedAddrId = page.data.selectedAddrId;
      let id;
      if (selectedAddrId != "") {
        id = selectedAddrId;
      } else {
        id = page.data.addressId;
      }
      let address;
      let myAddrListData = page.data.myAddrListData;
      let currentPage = myAddrListData.page;
      if (currentPage == 0) {
        address = []
      } else {
        address = page.data.address
      }
      let arr = res.body.rows;
      if (arr.length == 0 && currentPage == 0) {
        page.setData({
          nothing: true
        })
      }
      arr.forEach(function (value, index) {
        if (value.id == id) {
          value.isDefault = true;
        } else {
          value.isDefault = false;
        }
        address.push(value)
      })
      page.setData({
        address: address,
        totalPage: res.body.totalPage
      })
    })
  },

  deleteAddress(event) {
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/shop/recipientAddr/delete',
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
            let arr = page.data.address
            arr = arr.filter(item => item.id !== id);
            page.setData({
              address: arr
            })
          })
        }
      },
      fail: function (res) {

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this;
    app.verifyLogin(function (data) {
      page.setData({
        addressId: options.id
      })
      page.getAddrList();
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
      let myAddrListData = page.data.myAddrListData;
      myAddrListData.page = 0;
      page.setData({
        myAddrListData: myAddrListData,
        nothing: false
      })
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
    let that = this,
      myAddrListData = that.data.myAddrListData,
      page = myAddrListData.page,
      totalPage = that.data.totalPage;
    if ((page + 1) == totalPage) {
      return;
    }
    myAddrListData.page = page + 1;
    that.setData({
      myAddrListData: myAddrListData
    })
    that.getAddrList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})