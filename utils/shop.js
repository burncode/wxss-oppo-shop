//网点
var QQMapWX = require('../libs/qqmap-wx-jssdk.min.js');
var oppoApiHost = require('../common/oppo_api_host.js');
var dialog = require('../common/dialog.js');
var shop = {
  host: 'https://service.myoppo.com/ocsmapi',
  secret: 'BF6B5332094F470785E7791BD1DEB8C4', //签名密钥
  util: require('util.js'),
  dialog: require('../common/dialog.js'),
  app: getApp(),
  area: {}, //省市
  site: {}, //网点
  data: {
    province: [],
    provinceIndex: 0,
    city: [],
    cityIndex: 0,
    shop: []
  },
  onReady: function () {
    dialog.showLoading('加载中');
    let page = this;
    page.app.verifyLogin(function(data){
      page.map = new QQMapWX({
        key: 'VIRBZ-E4SW6-HZXSU-MDNO7-XPJG6-HMF2J'
      });
      page.getLocation();
    })
  },
  request: function (obj) {
    var reserve = this,
      success = obj.success;
    obj.data = reserve.util.param(obj.data, obj.url, reserve.secret);
    obj.method == 'post' && (obj.data = JSON.stringify(obj.data));
    obj.url.indexOf('http') < 0 && (obj.url = reserve.host + obj.url);
    obj.success = function (res) {
      if (res.status != 1) {
        reserve.app.errTip(res.message);
      } else {
        success(res)
      }
    };
    return reserve.app.request(obj)
  },
  provinceChange: function (e) { //变更省
    var i = e.detail.value,
      p = this.data.province[i],
      c = this.area[p];
    this.setData({
      provinceIndex: i,
      city: c,
      cityIndex: 0
    });
    this.GetSiteInfo(p, c[0]);
  },
  cityChange: function (e) { //变更城市
    var i = e.detail.value,
      nothingShop,
      shop = this.site[this.data.city[i]]; 
    if(shop == undefined){
      nothingShop = true
    }else{
      nothingShop = false
    }  
    this.setData({
      cityIndex: i,
      shop: shop,
      currentCheckboxIdn: -1,
      nothingShop: nothingShop
    });
  },
  GetAreaInfo: function (p, c) { //获取省市列表
    var page = this,
      path = '/Appoint/GetAreaInfo.ashx';
    page.app.get(page.host + path, page.util.param({}, path, page.secret),function(data){
      dialog.hideLoading();
      if (data.data.status != 1){
        page.app.errTip(data.message)
      }else{
        var res = data.data;
        var index = {},
        province = [],
        city = [];
        res.area.forEach(function (v, i) {
          if (v.pid == '0') {
            province.push(v.name);
            index[v.id] = v.name;
            page.area[v.name] = [];
          } else {
            page.area[index[v.pid]].push(v.name);
          }
        })
        city = page.area[p];
        page.setData({
          province: province,
          provinceIndex: province.indexOf(p),
          city: city,
          cityIndex: city.indexOf(c)
        });
      }
    })
  },
  GetSiteInfo: function (p, c) { //获取网点列表
    var page = this,
      path = '/Appoint/GetSiteInfo.ashx';
    page.app.get(page.host + path, page.util.param({
      areaname: p,
      cityname: c,
      sid: ''
    }, path, page.secret), function (data) {
      if (data.data.status != 1) {
        page.app.errTip(data.message)
      } else {
        var res = data.data;
        res.site.forEach(function (v) {
          var coordinate = v.coordinate.split(',');
          !page.site[v.cityname] && (page.site[v.cityname] = []);
          page.site[v.cityname].push({
            sid: v.sid,
            siteName: v.netname,
            address: v.addr,
            phone: v.phone_number,
            workingHours: v.work_time.replace('工作时间:', ''),
            coordinate: coordinate,
            site_num: v.site_num
          });
        });
        page.setData({
          shop: page.site[c]
        });
      }
    })
  },
  getLocation: function () { //获取当前省市
    var page = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        page.map.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            var adInfo = res.result.ad_info;
            page.GetAreaInfo(adInfo.province, adInfo.city);
            page.GetSiteInfo(adInfo.province, adInfo.city);
          },
          fail: function (res) {
            console.log(res);
          }
        });
      }
    });
  },
  openLocation: function (e) { //打开网点地图
    var v = this.data.shop[e.currentTarget.dataset.index],
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
          name: v.siteName,
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
};

module.exports = shop;