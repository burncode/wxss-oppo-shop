// pages/my/address/add/add.js
var app = getApp(),
  dialog = require('../../../../common/dialog.js'),
  apiHost = require('../../../../common/api_host.js'),
  httpJson = require('../../../../utils/http_json.js'),
  utils = require('../../../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    province: [],
    provinceIndex: 0,
    city: [],
    cityIndex: 0,
    area: [],
    areaIndex: 0,
    type: '',
    isDefault: false
  },

  getProvince: function (name) { //省份列表
    let page = this,
      path = apiHost.config.portalApiHost + 'base/address/province/list';
    httpJson.get(path, {}, function (data) {
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return;
      }
      let province = res.body;
      page.setData({
        province: province
      })
      if (name == null) {
        page.getCity(res.body[0].code, false)
      } else {
        let code, provinceIndex;
        province.forEach(function (value, index) {
          if (value.name == name) {
            code = value.code;
            provinceIndex = index
          }
        })
        page.setData({
          provinceIndex: provinceIndex
        })
        page.getCity(code, true)
      }
    })
  },
  getCity: function (code, type) { //城市列表
    let page = this,
      path = apiHost.config.portalApiHost + 'base/address/city/list';
    httpJson.get(path, {
      provinceCode: code
    }, function (data) {
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return;
      }
      let city = res.body;
      page.setData({
        city: res.body
      })
      if (!type) {
        page.getArea(res.body[0].code, false)
      } else {
        let code, cityIndex,
          cityName = page.data.addrDetail.city;
        city.forEach(function (value, index) {
          if (value.name == cityName) {
            code = value.code;
            cityIndex = index;
          }
        })
        page.setData({
          cityIndex: cityIndex
        })
        page.getArea(code, true)
      }
    })
  },
  getArea: function (code, type) { //地区列表
    let page = this,
      path = apiHost.config.portalApiHost + 'base/address/area/list';
    httpJson.get(path, {
      cityCode: code
    }, function (data) {
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return;
      }
      let area = res.body;
      page.setData({
        area: area
      })
      if (type) {
        let areaIndex;
        let areaName = page.data.addrDetail.area;
        area.forEach(function (value, index) {
          if (value.name == areaName) {
            areaIndex = index;
          }
        })
        page.setData({
          areaIndex: areaIndex
        })
      }
    })
  },

  provinceChange: function (e) { //变更省
    var i = e.detail.value,
      code = this.data.province[i].code;
    this.setData({
      provinceIndex: i,
      cityIndex: 0,
      areaIndex: 0
    })
    this.getCity(code, false);
  },

  cityChange: function (e) { //变更市
    var i = e.detail.value,
      code = this.data.city[i].code;
    this.setData({
      cityIndex: i,
      areaIndex: 0
    })
    this.getArea(code, false);
  },

  areaChange: function (e) { //变更地区
    var i = e.detail.value;
    this.setData({
      areaIndex: i
    })
  },

  getAddrDetail: function (id) {
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/shop/recipientAddr/get';
    httpJson.get(path, {
      id: id
    }, function (data) {
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return;
      }
      page.setData({
        addrDetail: res.body
      })
      let province = res.body.province;
      page.getProvince(province)
    })
  },

  submit(event) {
    let page = this,
      value = event.detail.value,
      type = page.data.type,
      path;
    if (value.recipientName == '') {
      app.errTip('请填写姓名');
      return;
    }
    if (value.phone == '') {
      app.errTip('请填写手机号');
      return;
    }
    if (value.street == '') {
      app.errTip('请填写详细街道地址');
      return;
    }
    if (!utils.verifyPhone(value.phone)) {
      app.errTip('请填写正确的手机号码！');
      return;
    }
    let param = Object.assign({
      isDefault: page.data.isDefault,
      province: page.data.province[page.data.provinceIndex].name,
      city: page.data.city[page.data.cityIndex].name,
      area: page.data.area[page.data.areaIndex].name,
    }, value)
    if (type == 'add') {
      path = apiHost.config.portalApiHost + 'portal/shop/recipientAddr/create'
    } else {
      path = apiHost.config.portalApiHost + 'portal/shop/recipientAddr/update';
      param.id = page.data.id;
    }
    dialog.showLoading('加载中');
    httpJson.post(path, param, function (data) {
      dialog.hideLoading();
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return;
      }
      if (type == 'add') {
        app.errTip('添加成功');
      } else {
        app.errTip('保存成功');
      }
      let url;
      let isSelected = page.data.isSelected;
      if (isSelected == 'true') {
        let currentPage = getCurrentPages();
        let prevPage = currentPage[currentPage.length - 2];
        let selectedAddrId = page.data.selectedAddrId;
        if (selectedAddrId == undefined) {
          prevPage.setData({
            selectedAddrId: res.body.id
          })
        } else {
          prevPage.setData({
            selectedAddrId: page.data.selectedAddrId
          })
        }
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      } else {
        let currentPage = getCurrentPages();
        let prevPage = currentPage[currentPage.length - 2];
        prevPage.setData({
          isBack: true
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
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
        type: options.type,
        isSelected: options.isSelected,
        selectedAddrId: options.selectedAddrId
      })
      if (options.type == 'add') {
        page.getProvince(null)
      } else {
        let id = options.id;
        page.getAddrDetail(id);
        page.setData({
          id: options.id,
          isDefault: options.isDefault
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