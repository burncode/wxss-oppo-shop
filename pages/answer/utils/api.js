//ajax工具类
//文件引用

function param() {
    let fun_base64 = require('base64.js');
    let key = '25a78c6db0fe49ea97dab3d4a8b7f298';
    let openid = wx.getStorageSync('openid');
    let platform = '0';
    let obj_base64 = new fun_base64.Base64();
    let token = obj_base64.encode(obj_base64.encode(openid + key + platform));
    return token;
}
function ajax(url, data, fn, method = "post") {
    let openid = wx.getStorageSync('openid');
    let page = getCurrentPages();
    let curPage = page[page.length - 1];
    let token_data = {
        token: param(),
        openid: openid,
        platform: 0
    };
    let obj = Object.assign(data, token_data,);
    wx.request({
        url: url,
        method: method ? method : 'get',
        data: obj,
        header: {"Content-Type": "application/x-www-form-urlencoded"},
        success: function (res) {
            let data = res.data.msg;
            if (data === '活动已结束') {
                curPage.setData({
                    errorMsg: '活动已结束'
                });
                curPage.showActivityEnd('end');
            }else{
                fn(res)
            }
        }
    });
}
function userlogin(cb) {
    var that = this;
    wx.login({
        success: function (res_1) {
            wx.getUserInfo({
                success: function (res) {
                    var userInfo = res.userInfo;
                    var nickName = userInfo.nickName;
                    var headImg = userInfo.avatarUrl;
                    var js_code = res_1.code;
                    wx.setStorage({
                        key: 'userInfo',
                        data: res.userInfo
                    });
                    wx.request({
                        url: getApp().globalData.host + '/answersmall/api/WxOpenApi/wzsSmallAuth.json',
                        method: 'post',
                        data: {
                            js_code: js_code
                        },
                        header: {"Content-Type": "application/x-www-form-urlencoded"},
                        success: function (res_openid) {
                            wx.setStorageSync('openid', res_openid.data.data);
                            if (cb) {
                                cb()
                            }
                        }
                    });
                },
                fail: function () {

                }
            })
        }
    })
}


module.exports = {
    ajax: ajax,
    userlogin: userlogin
}
