/**
 * Created by Gavin on 2018/3/18.
 */
let app = getApp();
let API = require('../utils/api.js');
let host = app.globalData.host;
Page({
    data: {
        expStatus: false,
        enterShow: false,
        //跳转倒计时
        hrefCountNum: ''
    },
    enterActivity: function () {
        wx.navigateTo({
            url: '../../answer/answerPage/answerPage'
        })
    },
    showExp: function () {
        this.setData({
            expStatus: true
        })
    },
    closeExp: function () {
        this.setData({
            expStatus: false
        })
    },
    checkAppointment: function () {
        let localOpenid = wx.getStorageSync('openid');
        if (localOpenid !== '' && localOpenid !== null && localOpenid !== undefined) {
            API.ajax(
                host + '/answersmall/phone/Index/checkAppointmentOfSmall.json',
                {
                    openid: localOpenid
                },
                function (res) {
                    if (res.data.status === 'false') {
                        wx.navigateTo({
                            url: '../../answer/answerPage/answerPage'
                        })
                    }
                })
        }
    },
    //显示活动结束
    showActivityEnd: function (status) {
        let that = this;
        that.setData({
            showActivityEnd: true
        });
        if (status === 'end') {
            let hrefCountdown = 3;
            let settime = function (that) {
                if (parseInt(hrefCountdown) === 0) {
                    hrefCountdown = 3;
                    wx.redirectTo({
                        url: '../../goods-details/goods-details?id=6368094'
                    });
                } else {
                    that.setData({
                        hrefCountNum: hrefCountdown
                    });
                    hrefCountdown--;
                    setTimeout(function () {
                        settime(that)
                    }, 1000)
                }

            };
            settime(that)
        }
    },
    onLoad: function (options) {
        let that = this;
        let localOpenid = wx.getStorageSync('openid');
        if (localOpenid !== '' && localOpenid !== null && localOpenid !== undefined) {
            that.checkAppointment();
        } else {
            app.verifyLogin(function () {
                that.checkAppointment();
            })
        }
        // let localOpenid = wx.getStorageSync('openid');
        // if (localOpenid !== '' && localOpenid !== null && localOpenid !== undefined) {
        //     that.checkAppointment();
        // } else {
        //     API.userlogin(function () {
        //         that.checkAppointment();
        //     })
        // }
        setTimeout(function () {
            that.setData({
                show_1: 'show-1'
            })
        }, 1200);
        setTimeout(function () {
            that.setData({
                show_2: 'show-1'
            })
        }, 2400);
        setTimeout(function () {
            that.setData({
                show_3: 'show-1'
            })
        }, 3600);
        setTimeout(function () {
            that.setData({
                show_4: 'show-1'
            })
        }, 4800);
        setTimeout(function () {
            that.setData({
                enterShow: true
            })
        }, 6000)
    }
});