// pages/my/address/list/list.js
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
    nothing: false
  },

  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.address;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        address: list
      });
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.address;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        address: list
      });
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },

  onSetDefault(event) {
    let target = event.currentTarget.dataset;
    if (target.isdefault) {
      return;
    }
    this.updateAddress(target)
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
            if (arr.length == 0) {
              page.setData({
                nothing: true
              })
            }
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

  updateAddress(value) {
    let page = this,
      path = apiHost.config.portalApiHost + 'portal/shop/recipientAddr/update';
    dialog.showLoading('保存中');
    httpJson.post(path, {
      id: value.id,
      isDefault: true,
      recipientName: value.recipientname,
      phone: value.phone,
      province: value.province,
      city: value.city,
      area: value.area,
      street: value.street
    }, function (data) {
      dialog.hideLoading();
      let res = data.data;
      if (res.errorCode != 0) {
        app.errTip(res.msg);
        return;
      }
      app.errTip('设置默认地址成功')
      let index = value.index;
      let list = page.data.address;
      list.forEach(function (currentValue, ind) {
        if (index == ind) {
          currentValue.isDefault = true
        } else {
          currentValue.isDefault = false
        }
      })
      page.setData({
        address: list
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this;
    app.verifyLogin(function (data) {
      page.initEleWidth();
      page.getAddrList()
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
    let isBack = page.data.isBack;
    if (isBack) {
      let myAddrListData = page.data.myAddrListData;
      myAddrListData.page = 0;
      page.setData({
        myAddrListData: myAddrListData,
        nothing: false
      })
      page.getAddrList()
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