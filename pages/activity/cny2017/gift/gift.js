// pages/activity/cny2017/gift/gift.js
var api = require('../api.js');
var apiHost = require('../../../../common/api_host.js');
var httpJson = require('../../../../common/http_json.js');
var resetShopTime = 0;
// var QR = require("../../../../common/qrcode.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        scrollHeight: 0,
        shopList: [
            // { id: 1, name: "附近门店1", address: "附近门店1附近门店1", latitude: 1, longitude: 1},
            // { id: 2, name: "附近门店2", address: "附近门店1附近门店1门店1",latitude: 1, longitude: 1},
            // { id: 3, name: "附近门店3", address: "附近门店1附近门近门店1",latitude: 2, longitude: 1},
            // { id: 4, name: "附近门店4", address: "附近门店1附近门店1附近门店1",latitude: 3, longitude: 1},
            // { id: 5, name: "附近门店5", address: "附近门店1附近门店近门店1",latitude: 4, longitude: 1},
            // { id: 6, name: "附近门店6", address: "附近门店1附近门店1附近门店1",latitude: 5, longitude: 1},
            // { id: 7, name: "附近门店7", address: "附近门店1附门店1门店1",latitude: 6, longitude: 1},
        ],
        isHide: true,
        hasGift: true,
        //一个奖项
        prizeCount: 1,
        awname: '',
        //是否可以显示刷新商店按钮了
        showResetShhop: false
    },

    showMap: function(value){
        let dataSet = value.currentTarget.dataset;
        let name = dataSet.name;
        console.log(dataSet);
        if (dataSet && dataSet.latitude && dataSet.longitude){
            wx.openLocation({
                name: name,
                latitude: Number(dataSet.latitude),
                longitude: Number(dataSet.longitude),
                scale: 18
            })
        }else{
            wx.showModal({
                title: '提示',
                content: '定位信息不存在',
            })
        }
        
    },

    goShop: function(){
        wx.navigateTo({
            url: '../../../nav/shop/shop',
        })
    },
    resetShop: function(){
        let shopList = this.data.shopList;
        let len = shopList.length;
        if (len <= 0){
            let letTime = new Date().getTime() - resetShopTime;
            let getTime = 15 * 1000; //15秒一次
            if (letTime > getTime) {
                console.log('resetShop');
                resetShopTime = new Date().getTime();
                this.getNearbyStore();
            } else {
                wx.showModal({
                    title: '提示',
                    content: '每15秒才能更新一次哦~',
                    showCancel: false
                })
            }
        }
    },
    getNearbyStore: function () { // 获取附近门店
        let page = this;
        let path = apiHost.config.portalApiHost + 'portal/offlineStore/list';
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                let latitude = res.latitude;
                let longitude = res.longitude;
                let lat_and_lng = {
                    latitude: latitude,
                    longitude: longitude
                }
                wx.setStorageSync('lat_and_lng', lat_and_lng);
                httpJson.get(path, {
                    lat: latitude,
                    lng: longitude,
                    page: 0,
                    limit: 10
                }, function (data) {
                    let res = data.data;
                    if (res.errorCode != 0) {
                        app.errTip(res.msg);
                        return
                    }
                    let nearbyStore = res.body.rows;
                    console.log(nearbyStore);
                    let showResetShhop = false;
                    if (nearbyStore.length == 0) {
                        showResetShhop = true;
                    }
                    page.setData({
                        showResetShhop: showResetShhop,
                        shopList: nearbyStore
                    })
                })
            },
            fail: function () {
                page.setData({
                    showResetShhop: true
                });
                wx.openSetting({
                    success: function (res) {
                        resetShopTime = 0;
                    }
                })
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        api.checkEnd(this);
        console.log("isEnd", this.data.isEnd);
        if (this.data.isEnd){
            wx.redirectTo({
                url: '../home/home'
            });
            return;
        }
        console.log("options", options);
        if (options['shareImgName']){
            let shareImgName = options.shareImgName;
            let shareRecord = options.shareRecord;
            this.setData({
                shareImgName: shareImgName,
                shareRecord: shareRecord
            });
        }
        console.log('api.cnyUserInfo:', api.cnyUserInfo);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        var page = this;
        wx.showLoading({
            title: '稍等哦~',
        })
        wx.getSystemInfo({
            success: function (res) {
                var scrollHeight = res.windowHeight - 795 * (res.windowWidth / 750);
                page.setData({
                    scrollHeight: scrollHeight
                });
            }
        })
        // console.log(api.cnyUserInfo.Area);
        this.getNearbyStore();
        //oaH4S0eF6l63d4IhNNkKLpl9b5B0
        //上海市
        // api.GetKey('oaH4S0eF6l63d4IhNNkKLpl9b5B0', '上海市', (keyData) => {
        api.GetKey(api.cnyUserInfo.OpenID, api.cnyUserInfo.Area, (keyData) => {
            console.log(keyData);
            this.setData({
                isHide: false,
                codePath: "http://upload.be-xx.com/qrcode?s=" + keyData.key + "&color=000",
                hasGift: (keyData.state=='True'),
                prizeCount: (keyData.award == "0" || keyData.award == null || keyData.award == 'null')?1:2,
                awname: keyData.awname
            });
            wx.hideLoading();
        });

        // this.setData({
        //     isHide: false,
        //     hasGift: true,
        //     prizeCount: 2,
        //     awname: "自拍杆"
        // });
        // wx.hideLoading();
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
        let u = '/pages/activity/cny2017/home/home?sid=' + api.cnyUserInfo.OpenID;
        return {
            // title: 'oppo cny2017',
            path: u,
            title: '千言万语不如一份新年礼，送你一份小惊喜！',
            imageUrl: 'https://upload.cdn.be-xx.com/oppox/share.jpg',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
})