// pages/nav/tel-recharge/tel-recharge.js
var util = require('../../../utils/util.js'),
  app = getApp(),
  dataHost = 'https://cz.oppomobile.com', //流量
  fareHost = "https://pay.oppopay.com/wallet", //话费
  payAppid = '', //支付appid
  payKey = ''; //支付密钥
var fpObj = {
  partner_id: "3245289",
  tp: "e0b7681e98dc4f3eb62cd52c53a2ee02",
  rv: "4HGvFlPt",
  app_package: "com.nearme.atlas",
  sdk_version: "162"
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    priceList:[
      {
        totalNum:'30元',
        realPrice:29.94
      },
      {
        totalNum: '50元',
        realPrice: 49.94
      },
      {
        totalNum: '100元',
        realPrice: 99.94
      },
      {
        totalNum: '200元',
        realPrice: 199.94
      },
      {
        totalNum: '300元',
        realPrice: 299.94
      },
      {
        totalNum: '500元',
        realPrice: 499.94
      }
    ]
  },

  getMobile: function (e) { //获取手机号
    this.setData({
      mobile: e ? e.detail.value : wx.getStorageSync('mobile')
    });
    if (/^1\d{10}$/.test(this.data.mobile)) {
      this.data.action ? this.getDataList() : this.getFareList();
      e && wx.setStorageSync('mobile', this.data.mobile);
    }
  },

  getFareParam: function (b) {
    var a = {
      phoneno: this.data.mobile,
      version: "0.0",
      sdkVer: fpObj.sdk_version,
      t_p: fpObj.tp,
      r_v: fpObj.rv,
      apppackage: fpObj.app_package
    };
    return 'hail' + JSON.stringify(b ? Object.assign(a, b) : a) + 'ng'
  },

  pay: function (pack) { //支付
    var o = {
      timeStamp: util.timeStamp(),
      nonceStr: util.nonceStr(),
      package: pack,
      signType: 'MD5',
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res);
        app.errTip(res.err_desc);
      }
    };
    o.paySign = util.md5('appId=' + payAppid + '&nonceStr=' + o.nonceStr + '&package=' + o.package + '&signType=' + o.signType + '&timeStamp=' + o.timeStamp + '&key=' + payKey);
    wx.requestPayment(o);
  },

  getDataList: function () { //获取流量列表
    var page = this;
    app.post(dataHost + '/recharge/service/queryValidPackages', {
      phone: this.data.mobile
    }, function (res) {
      page.setData({
        dataList: res.body
      });
    });
  },

  createData: function (e) { //创建流量订单
    var page = this,
      param = {
        app_key: '80093095',
        timestamp: util.timeStamp(1),
        format: "json",
        v: 2,
        sign_method: "md5",
        method: "add.flow.process.start",
        phone: this.data.mobile,
        chl: 'moneybox',
        process_def_id: 1,
        user_id: "",
        role_id: 1,
        variable: "",
        per_value: e.currentTarget.dataset.pervalue
      },
      getSign = function (e) {
        var t = [],
          secret_key = "c6d4ce3c10fd2afcd60bcc9011ec9510";
        for (var n in e) t.push(n + e[n]);
        t = t.sort();
        return util.md5(secret_key + t.join("") + secret_key);
      };
    param.sign = getSign(param);
    param.pay_type = 'wechat';
    app.post(dataHost + '/service/open_api', param, function (res) {
      if (res.code != 0) {
        app.errTip(res.desc);
      } else {
        page.pay(res.pay_url.match(/prepay_id\=(\w+)/)[0])
      }
    });
  },

  getFareList: function () { //获取话费列表
    var page = this;
    app.post(fareHost + '/telfeelist', page.getFareParam(), function (res) {
      res.code == '0000' ? page.setData({
        fareList: res.priceList
      }) : app.errTip(res.msg);;
    });
  },

  createFare: function (e) { //创建话费订单
    var page = this;
    app.post(fareHost + '/checkmobile', page.getFareParam({
      price: e.currentTarget.dataset.price,
      partnercode: fpObj.partner_id
    }), function (res) {
      if (res.code != '0000') {
        app.errTip(res.desc);
      } else {
        page.pay('prepay_id=' + res.partnerOrder);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      action: Number(options.action)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getMobile();
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