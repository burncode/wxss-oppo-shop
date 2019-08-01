var user = require('../../../utils/user.js'),
  shopCommon = require('../../../utils/shop.js'),
  compose = require('../../../utils/compose.js');
var shop = {
  data: {
    shopType: ['所有门店类型', '体验店', '客服店'],
    shopTypeIndex: 0,
    nothingShop: false
  },
  shopTypeChange: function (event) {
    let index = event.detail.value;
    this.setData({
      shopTypeIndex: index
    })
  },
  cityChange: function (e) { //变更城市
    var i = e.detail.value;
    this.setData({
      cityIndex: i,
    });
    let p = this.data.province[this.data.provinceIndex];
    let c = this.data.city[i];
    this.GetSiteInfo(p, c)
  },
  GetSiteInfo: function (p, c) { //获取网点列表
    var page = this,
      path = '/ocsm/mes/siteList.do';
    user.get(path, {
      province: p,
      city: c
    }, function (data) {
      let res = data.data;
      if ([200, 10000].indexOf(res.code) < 0) {
        app.errTip(res.msg)
      } else {
        let rows = res.result;
        if (rows != undefined) {
          let shop = [];
          let authorize_shop = [];
          rows.forEach(function (v) {
            var coordinate = v.coordinate.split(',');
            if (v.buildType == 3) {
              authorize_shop.push({
                siteName: v.siteName,
                address: v.address,
                phone: v.phone,
                workingHours: v.workingHours.replace('工作时间:', '') + '(休息时间:' + v.restDay + ')',
                coordinate: coordinate,
              })
            } else {
              shop.push({
                siteName: v.siteName,
                address: v.address,
                phone: v.phone,
                workingHours: v.workingHours.replace('工作时间:', '') + '(休息时间:' + v.restDay + ')',
                coordinate: coordinate,
              })
            }
          })
          page.setData({
            shop: shop,
            authorize_shop: authorize_shop,
            nothingShop: false
          })
        } else {
          page.setData({
            nothingShop: true
          })
        }
      }
    })
  },
  openLocation: function (e) { //打开网点地图
    var v = e.target.dataset,
      coordinate = v.coordinate;
    this.map.reverseGeocoder({
      location: {
        longitude: coordinate[0],
        latitude: coordinate[1]
      },
      coord_type: 3,
      success: function (res) {
        var location = res.result.location;
        wx.openLocation({
          longitude: Number(location.lng),
          latitude: Number(location.lat),
          scale: 18,
          name: v.sitename,
          address: v.address,
          success: function (res) {
            console.log(res)
          },
          fail: function (res) {
            console.log(res)
          }
        });
      }
    });
  }
}
shop = compose(shop, shopCommon)
Page(shop)  