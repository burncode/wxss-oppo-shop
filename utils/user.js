var app = getApp();
var user = {
  host: 'https://xcx.oppo.cn',
  appid: 'oppoxcx',
  secret: '999720123929cd7a63e0bf4dd7b32ceb',
  app: getApp(),
  util: require('util.js'),
  // request: function (obj) { //会员ajax请求
  //   var user = this,
  //     success = obj.success;
  //   obj.data.appid = user.appid;
  //   obj.data.time = user.util.timeStamp();
  //   obj.data.sign = user.util.md5(user.util.o2a(obj.data).join("&") + '&secret=' + user.secret).toUpperCase();
  //   obj.url.indexOf('http') < 0 && (obj.url = user.host + obj.url);
  //   obj.success = function (res) {
  //     if ([200, 10000].indexOf(res.code) < 0) {
  //       if ([97002, 97003].indexOf(res.code) > -1) {
  //         user.app.errTip(res.msg);
  //         setTimeout(function () {
  //           wx.redirectTo({
  //             url: '/pages/login/login'
  //           });
  //         }, 3000);
  //       } else {
  //         user.app.errTip(res.msg);  
  //       }
  //     } else {
  //       success(res.result);
  //     }
  //   };
  //   return user.app.request(obj);
  // },
  request: function (res, callback) { //会员请求判断
    let page = this;
    if ([200, 10000].indexOf(res.data.code) < 0) {
      if ([97002, 97003].indexOf(res.data.code) > -1) {
        page.app.errTip(res.data.msg);
        setTimeout(function () {
          wx.redirectTo({
            url: '/pages/login/login'
          });
        }, 2000);
      } else {
        callback(res)
      }
    } else {
      callback(res)
    }
  },
  param: function (obj) {
    let page = this;
    obj.appid = page.appid;
    obj.time = page.util.timeStamp();
    obj.sign = page.util.md5(page.util.o2a(obj).join("&") + '&secret=' + page.secret).toUpperCase();
    return obj;
  },
  get: function (url, data, callback){
    let page = this
    page.app.get(page.host + url, page.param(data),function(data){
      page.request(data, callback)
    })
  },
  post: function (url, data, callback){
    let page = this
    page.app.post(page.host + url, page.param(data), function (data) {
      page.request(data, callback)
    })
  }
}
module.exports = user