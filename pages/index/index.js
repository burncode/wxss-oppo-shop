// pages/index/index.js
var app = getApp();
var dialog = require('../../common/dialog.js');
var apiHost = require('../../common/api_host.js');
var httpJson = require('../../utils/http_json.js');
var adList = require('../../components/ad-list/ad-list.js');
var compose = require('../../utils/compose.js');
var home = {

    /**
     * 页面的初始数据
     */
    data: {
        navList: [
          {
            coverImg: '../../images/nav/icon_nav_9.png',
            name: '预订查询',
            url: '../webview/index?url=oppo7.nplusgroup.net%2fresource%2freserve%2fh5%2findex.html%23%2fuser%2flogin'
          },
            {
                coverImg: '../../images/nav/icon_nav_1.png',
                name: '服务网点查询',
                url: '../nav/shop/shop'
            },
            {
                coverImg: '../../images/nav/icon_nav_2.png',
                name: '配件价格查询',
                url: '../nav/parts/parts/parts'
            },
            {
                coverImg: '../../images/nav/icon_nav_3.png',
                name: '维修进度查询',
                url: '../nav/repair/repair/repair'
            },
            {
                coverImg: '../../images/nav/icon_nav_5.png',
                name: '延长保',
                url: '../nav/extended-warranty/extended-warranty'
            },
            {
                coverImg: '../../images/nav/icon_nav_4.png',
                name: '预约服务',
                url: '../nav/reserve/reserve/reserve'
            },
            // {
            //   coverImg: '../../images/nav/icon_nav_7.png',
            //   name: '话费充值',
            //   url: '../nav/tel-recharge/tel-recharge'
            // },
            // {
            //   coverImg: '../../images/nav/icon_nav_8.png',
            //   name: '流量充值',
            //   url: '../nav/flow-recharge/flow-recharge'
            // }
        ],
        imgs: [],
        adListData: {
            type: 'HOME',
            page: 0,
            limit: 99999
        },
        activityData: {
            type: 'ACTIVITY',
            page: 0,
            limit: 99999
        },
        activity: [],
        // nearbyStore: wx.getStorageSync('nearbyStore')
    },

    gotoRecharge(event) {
        app.errTip('即将上线，敬请期待')
    },

    getAdList: function () { // 获取首页广告图列表
        let page = this,
            path = apiHost.config.portalApiHost + 'portal/banner/list';
        httpJson.get(path, page.data.adListData, function (data) {
            let res = data.data;
            if (res.errorCode != 0) {
                app.errTip(res.msg);
                return
            }
            let arr = res.body.rows;
            page.setData({
                imgs: arr
            })
        })
    },

    getActivityList: function () { // 获取活动广告图列表
        let page = this,
            path = apiHost.config.portalApiHost + 'portal/banner/list';
        httpJson.get(path, page.data.activityData, function (data) {
            let res = data.data;
            if (res.errorCode != 0) {
                app.errTip(res.msg);
                return
            }
            let arr = res.body.rows;
            page.setData({
                activity: arr
            })
        })
    },

    getOfflineStore: function () {  // 判断是否有附件门店的本地缓存
        let page = this;
        // let store = wx.getStorageSync('nearbyStore');
        // if (store == "" || store == null) { //判断是否有本地缓存
        page.getNearbyStore()
        // }else{
        //   //判断时间是否过期
        //   let currentTime = new Date().getTime(); //当前时间
        //   let stotageTime = store.stotageTime; //存储时间
        //   if ((currentTime - stotageTime) < 1000 * 60 * 10) {
        //     page.setData({
        //       nearbyStore: store
        //     })
        //   } else {
        //     page.getNearbyStore()
        //   }
        // }
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
                    // 121.467484,31.222479 (上海地区坐标一个)
                    // 121.160279,31.305376 (上海地区坐标两个)
                    // 114.02182,22.53015
                    lat: latitude,
                    lng: longitude,
                    page: 0,
                    limit: 5,
                    ignoreActivity: true
                }, function (data) {
                    let res = data.data;
                    if (res.errorCode != 0) {
                        app.errTip(res.msg);
                        return
                    }
                    let nearbyStore = res.body.rows;
                    console.log(nearbyStore)
                    // let stotageTime = new Date().getTime();
                    // nearbyStore.stotageTime = stotageTime;
                    // wx.setStorageSync('nearbyStore', nearbyStore);
                    // console.log(JSON.stringify(nearbyStore));
                    page.setData({
                        nearbyStore: nearbyStore
                    })
                })
            }
        });
    },

    onStore(event) {
        let page = this,
            target = event.currentTarget.dataset,
            couponName = target.couponname,
            code = target.code,
            lng = target.lng,
            lat = target.lat,
            name = target.name,
            street = target.street,
            province = target.province,
            city = target.city,
            area = target.area,
            phone = target.phone;    
        if (couponName === null || couponName === undefined) {
            wx.openLocation({
                longitude: Number(lng),
                latitude: Number(lat),
                scale: 18,
                name: name,
                address: street,
                success: function (res) {
                    console.log(res)
                },
                fail: function (res) {
                    console.log(res)
                }
            });
        } else {
            wx.navigateTo({
              url: `../my/coupon/coupon-list/coupon-list?code=${code}&couponName=${couponName}&lng=${lng}&lat=${lat}&name=${name}&street=${street}&province=${province}&city=${city}&area=${area}&phone=${phone}`,
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var page = this;
        //增加scene判断 从外部二维码识别进来的 如果有scene 现在默认去cny2017活动好友有页面
        //因为现在二维码
        if (options['scene']) {
            wx.redirectTo({
                url: '../activity/cny2017/friend/friend?sid=' + options['scene'],
            })
            return;
        }

        dialog.showLoading('加载中');
        app.verifyLogin(function (data) {
            dialog.hideLoading();
            page.getAdList();
            page.getActivityList();
            page.getOfflineStore();
            page.setData({
                loading: true
            })
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
        // if (this.data.loading){
        //   this.setData({
        //     nearbyStore: wx.getStorageSync('nearbyStore')
        //   })
        //   this.getOfflineStore()
        // }
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
}
home = compose(home, adList)
Page(home)