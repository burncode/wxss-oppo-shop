var httpJson = {
  app:getApp(),
  dialog: require('../common/dialog.js'),
  getCookie: function (callback){
    let header
    let sessionId = wx.getStorageSync('sessionId')
    if (sessionId != "" && sessionId != null) {
      header = { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'JSESSIONID=' + sessionId }
    } else {
      header = { 'content-type': 'application/x-www-form-urlencoded' }
    }
    if (callback) {
      callback(header)
    }
  },
  get: function (url, data, callback){
    let page = this;
    page.getCookie(function (header) {
      wx.request({
        url: url,
        data: data,
        header: header,
        success: function success(res) {
          if(res.statusCode == 500){
            page.dialog.hideLoading();
            page.app.errTip('服务器繁忙')
          }
          callback(res)
        }, fail: function fail(err) {
          page.dialog.hideLoading();
          page.app.errTip('服务器繁忙')
        }
      })
    })
  },
  post: function (url, data, callback){
    let page = this;
    page.getCookie(function (header) {
      wx.request({
        url: url,
        data: data,
        method: 'POST',
        header: header,
        success: function success(res) {
          if (res.statusCode == 500) {
            page.dialog.hideLoading();
            page.app.errTip('服务器繁忙')
          }
          callback(res)
        },
        fail: function fail(err) {
          page.dialog.hideLoading();
          page.app.errTip('服务器繁忙')
        }
      })
    })
  }
}
module.exports = httpJson;
