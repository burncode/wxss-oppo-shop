var app = getApp(),
  apiHost = require('../../../common/api_host.js')
Page({
  getShop: function (e) {
    var page = this,
      n = e.detail.value.shopname.trim();
    if (n == '') {
      app.errTip('店名不能空');
      return;
    }
    wx.showLoading();
    app.request({
      url: apiHost.config.portalApiHost + '/base/offlineStore/list',
      data: {
        name: n,
        page: 0,
        limit: 50
      },
      success: function (res) {
        wx.hideLoading();
        if (res.exMsg) {
          app.errTip(res.exMsg);
        } else {
          page.setData({
            shopList: res.body.rows
          });
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '获取数据失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  reLocation: function (e) {
    var page = this,
      d = e.target.dataset;
    wx.chooseLocation({
      success: function (loc) {
        wx.showLoading();
        app.request({
          url: apiHost.config.portalApiHost + '/base/offlineStore/update',
          method: "post",
          data: {
            id: d.id,
            lat: loc.latitude,
            lng: loc.longitude
          },
          success: function (res) {
            if (res.exMsg) {
              app.errTip(res.exMsg);
            } else {
              page.data.shopList[d.index] = res.body;
              page.setData({
                shopList: page.data.shopList
              });
              //page.openLocation(res.body);
              wx.hideLoading();
              wx.showToast({
                title: '修复成功',
                icon: 'success',
                duration: 5000
              });
            }
          },
          fail: function () {
            wx.hideLoading();
            wx.showToast({
              title: '修复失败，请重试',
              icon: 'none',
              duration: 5000
            });
          }
        });
      }
    });
  },
  goLocation: function (e) {
    this.openLocation(e.target.dataset);
  },
  openLocation: function (v) {
    wx.openLocation({
      longitude: Number(v.lng),
      latitude: Number(v.lat),
      scale: 18,
      name: v.name,
      address: v.street,
      success: function () { },
      fail: function () { }
    });
  }
});