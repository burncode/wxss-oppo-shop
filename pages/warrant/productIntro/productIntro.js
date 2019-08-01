Page({
  data: {
    shopList: [],
    noRes: false,
    getLocationFail: false
  },
  getShopList: function (lat, lng) {
    var that = this;
    wx.request({
      url: 'https://xcx3rd.oppo.cn/portal/offlineStore/list',
      data: {
        lat: lat,
        lng: lng,
        page: 0,
        limit: 3,
        ignoreActivity: true
      },
      method: 'GET',
      success: function (res) {
        if (res.data.errorCode === 0 && res.data.body.rows.length > 0) {
          that.setData({
            shopList: res.data.body.rows,
          })
        } else {
          that.setData({
            noRes: true
          })
        }
      }
    })
  },
  getLocation: function () {
    var that = this;
    var lat_and_lng = wx.getStorageSync('lat_and_lng');
    if (lat_and_lng == '' || lat_and_lng == null) {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          var lat = res.latitude;
          var lng = res.longitude;
          that.getShopList(lat, lng)
        },
        fail: function () {
          // that.openSetting();
        }
      });
    } else {
      var lat = lat_and_lng.latitude;
      var lng = lat_and_lng.longitude;
      that.getShopList(lat, lng)
    }
  },
  // openSetting: function () {
  //   var that = this
  //   wx.getSetting({
  //     success: function (res) {
  //       console.log(res.authSetting["scope.userLocation"])
  //       if (!res.authSetting["scope.userLocation"]) {
  //         //尝试再次登录
  //         wx.authorize({
  //           scope: 'scope.userLocation',
  //           success() {
  //             // console.log(path)
  //             wx.getLocation({
  //               type: 'wgs84',
  //               success: function (res) {
  //                 that.setData({
  //                   getLocationFail: false
  //                 })
  //                 var lat = res.latitude;
  //                 var lng = res.longitude;
  //                 that.getShopList(lat, lng)
  //               },
  //             })
  //           },
  //           fail: function () {
  //             wx.openSetting({
  //               success: (res) => {
  //                 res.authSetting = {
  //                   "scope.userLocation": true,
  //                 }
  //               }
  //             })
  //           }
  //         })
  //       } else if (res.authSetting['scope.userLocation']) {
  //         wx.getLocation({
  //           type: 'wgs84',
  //           success: function (res) {
  //             that.setData({
  //               getLocationFail: false
  //             })
  //             var lat = res.latitude;
  //             var lng = res.longitude;
  //             that.getShopList(lat, lng)
  //           },
  //         })
  //       }
  //     }, fail: function () {
  //       that.setData({
  //         getLocationFail: true
  //       })
  //     }
  //   })
  // },

  openMap: function (e) {
    var lat = e.currentTarget.dataset.lat;
    var lng = e.currentTarget.dataset.lng;
    var name = e.currentTarget.dataset.name;
    var address = e.currentTarget.dataset.address;
    wx.openLocation({
      latitude: lat,
      longitude: lng,
      scale: 28,
      name: name,
      address: address
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getLocation();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})