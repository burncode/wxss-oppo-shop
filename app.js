//app.js
var apiHost = require('./common/api_host.js'),
    dialog = require('./common/dialog.js'),
    httpJson = require('./common/http_json.js');
App({
    verifyLogin: function (cb) { //判断是否登录
        let page = this,
            path = apiHost.config.portalApiHost + 'base/login/wx/verify_login';
        httpJson.post(path, {}, function (data) {
            let res = data.data;
            if (res.errorCode == 2) {
                page.wxlogin(cb);
                return;
            }
            if (cb) {
                cb(res)
            }
        })
    },
    wxlogin: function (cb) { //微信登录
        let page = this;
        page.getLogin(cb)
    },
    getLogin: function (cb) { //登录
        let page = this,
            path = apiHost.config.portalApiHost + 'base/login/wx/login';
        wx.login({
            success: function (res) {
                let code = res.code;
                wx.getUserInfo({ //获取用户信息
                    success: function (res) {
                        wx.setStorageSync('userInfo', res.userInfo); //缓存用户信息
                        let rawData = JSON.parse(res.rawData);
                        if (rawData.province.length > 10) { //判断省份长度是否超过10个,是的清空传值
                            rawData.province = ''
                        }
                        if (rawData.city.length > 10) { //判断城市长度是否超过10个,是的清空传值
                            rawData.city = ''
                        }
                        page.get(path, { //请求微信登录
                            code: code,
                            rawData: JSON.stringify(rawData)
                        }, function (data) {
                            let res = data.data;
                            if (res.errorCode != 0) {
                                page.errTip(res.msg);
                                return;
                            }
                            let sessionId = wx.getStorageSync('sessionId')
                            if (sessionId == "" || sessionId == null || sessionId != res.body) {
                                wx.setStorageSync('sessionId', res.body.JSESSIONID) //如果本地没有就说明第一次请求 把返回的session id 存入本地  
                            }
                            wx.setStorageSync('openid', res.body.openid);
                            if (cb) {
                                cb(res)
                            }
                        })
                    },
                    fail: function (res) {
                        dialog.hideLoading();
                        wx.showModal({
                            title: '温馨提示',
                            content: '若不授权微信获取用户信息，则无法正常使用该小程序。点击授权，可正常使用；若点击不授权，后期还需使用该小程序，会重新显示授权提示。',
                            cancelText: '不授权',
                            confirmText: '授权',
                            success: function (res) {
                                if (res.confirm) {
                                    wx.openSetting({
                                        success: function (res) {
                                            res.authSetting = {
                                                "scope.userInfo": true
                                            }
                                            page.getLogin(cb)
                                        }
                                    })
                                } else if (res.cancel) {
                                    page.errTip('获取权限失败~');
                                }
                            }
                        })
                    }
                })
            },
            fail: function (res) {

            }
        });
    },
    login: function (cb) { //模拟登录
        let page = this,
            path = apiHost.config.portalApiHost + 'base/login/portal/login';
        httpJson.post(path, {
            loginName: 'portal',
            password: '123456'
        }, function (data) {
            let res = data.data;
            if (res.errorCode != 0) {
                page.errTip(res.msg);
                return;
            }
            let sessionId = wx.getStorageSync('sessionId')
            if (sessionId == "" || sessionId == null || sessionId != res.body) {
                wx.setStorageSync('sessionId', res.body) //如果本地没有就说明第一次请求 把返回的session id 存入本地  
            }
            if (cb) {
                cb(res)
            }
        })
    },
    post: function (url, data, success) { //post请求
        var app = this;
        wx.request({
            url: url,
            header: {
                "Content-Type": "application/json"
            },
            method: "POST",
            data: data,
            success: function (res) {
                success(res)
            },
            fail: function (res) {
              dialog.hideLoading();
              page.errTip('服务器繁忙')
            }
        });
    },
    get: function (url, data, success) { //get请求
        var app = this;
        wx.request({
            url: url,
            header: {
                "Content-Type": "application/json"
            },
            method: "GET",
            data: data,
            success: function (res) {
                success(res)
            },
            fail: function (res) {
              dialog.hideLoading();
              page.errTip('服务器繁忙')
            }
        });
    },
    request: function (obj) { //请求
        var app = this,
            success = obj.success;
        obj.header = {
            'Content-Type': obj.method == 'post' ? 'application/x-www-form-urlencoded' : 'application/json'
        };
        obj.success = function (res) {
            if (res.statusCode != 200) {
                app.errTip(res.errMsg);
            } else {
                success(res.data);
            }
        };
        return wx.request(obj);
    },
    errTip: function (msg) { //错误提示
        //这里修改一下 api变了
        //var page = this.getCurrentPage();
        var pages = getCurrentPages();
        //当前页面是最后一个 
        var curPage = pages[pages.length - 1];
        curPage.setData({
            errMsg: msg
        });
        setTimeout(() => {
            curPage.setData({
                errMsg: ''
            });
        }, 2000);
    },
    globalData: {
        host: "https://oppo7.nplusgroup.net"
    },
    onLaunch: function (options) {
        console.log("[onLaunch] 场景值:", options.scene)
    },
    onShow: function (options) {
        console.log("[onShow] 场景值:", options.scene)
    },
    onHide: function () { // 小程序关闭时清除附件门店缓存和经纬度缓存
        // wx.removeStorageSync('nearbyStore');
        // wx.removeStorageSync('lat_and_lng');
    },
    onUnload: function () {

    }
})