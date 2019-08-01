Page({
  data: {
    shopList: [],
  },
  getShopList: function (lat, lng) {
    var that = this;
    wx.request({
      url: 'https://xcx3rd.oppo.cn/portal/offlineStore/list',
      data: {
        lat: lat,
        lng: lng,
        page: 0,
        limit: 3
      },
      method: 'GET',
      success: function (res) {
        // console.log(JSON.stringify(res.data.body.rows));
        res.data.errorCode === 0 && res.data.body.rows.length > 0 && that.setData({
          shopList: res.data.body.rows,
        });
      }
    })
  },
  gotoShop: function () {
    wx.pageScrollTo({
      scrollTop: 2000
    });
  },
  openMap: function (e) {
    var d = this.data.shopList[e.currentTarget.dataset.index];
    wx.openLocation({
      scale: 28,
      latitude: d.lat,
      longitude: d.lng,
      name: d.name,
      address: d.street
    });
  },
  onLoad: function (options) {
    var that = this,
      xy = wx.getStorageSync('lat_and_lng');
    xy ? that.getShopList(xy.latitude, xy.longitude) : wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.getShopList(res.latitude, res.longitude)
      }
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})