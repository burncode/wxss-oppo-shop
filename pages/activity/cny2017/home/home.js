// pages/activity/cny2017/home/home.js
var app = getApp();
var dialog = require('../../../../common/dialog.js');
var api = require('../api.js');
var ImgLoader = require('../../../../components/img-loader/img-loader.js');
let fromid = '';
let goTime = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loadingShow: true,
        loadingAni: null,
        loadingPer: 0,
        loadingIndex: 0,
        //是否统一小程序推送信息
        isAgree: true,
        localAuth: false,
        runView: "",    //要跳的view页面
        //要预加载的图
        imgLoadList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        api.checkEnd(this);
        console.log("isEnd", this.data.isEnd);
        console.log("options", options);
        //callUA
        // api.callUA();
        if (options['sid']) {
            //说明点击的是别人分享进来的
            fromid = options['sid'];
        }
        
        options.source && this.setData({ source: options.source });
        if (options['scene'] && !this.data.isEnd) {
            wx.reLaunch({
                url: '../friend/friend?sid=' + options['scene'],
            })
            return;
        }
        if (options['view'] && !this.data.isEnd) {
            this.setData({
                runView: options['view']
            });
        }
        var page = this;
        
        let systemInfo = wx.getSystemInfoSync();
        if (systemInfo.system.search('iOS') == -1) {
            console.log('no iOS');
            api.isOs = false;
        }
        if (options['needLoading']) {
            this.setData({
                loadingShow: false
            });
        }else{
            page.checkLoading();
        }
        

        // wx.showLoading({
        //     title: '用户信息获取中...',
        // })
        //授权拿信息
        app.verifyLogin(function (data) {
            //拿到了授权信息再去loading
            page.apiInit();
        });

    },

    apiInit: function () {
        let page = this; 
        let lat_and_lng = wx.getStorageSync('lat_and_lng');
        if (lat_and_lng) {
            let latitude = lat_and_lng.latitude;
            let longitude = lat_and_lng.longitude;
            let location = latitude + "," + longitude;
            console.log('有地址了');
            api.hasLocal = true;
            wx.hideLoading();
            page.initUser(location);
        }else{
            wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                    wx.hideLoading();
                    //有地址了设置本地地址
                    api.hasLocal = true;
                    let latitude = res.latitude;
                    let longitude = res.longitude;
                    let lat_and_lng = {
                        latitude: latitude,
                        longitude: longitude
                    }
                    //存储一下
                    wx.setStorageSync('lat_and_lng', lat_and_lng);
                    let location = latitude + "," + longitude;
                    page.initUser(location);

                },
                fail: function () {
                    //有地址了设置本地地址
                    api.hasLocal = true;
                    //app.errTip('地理位置获取失败，请确认定位设置已开启');
                    wx.hideLoading();
                    page.initUser('');
                }
            })

        }
        
    },
    initUser: function (location) {
        let page = this;
        let openid = wx.getStorageSync('openid');
        let userInfo = wx.getStorageSync('userInfo');
        api.initUser(openid, userInfo.nickName, userInfo.avatarUrl, location, userInfo.gender, fromid, () => {
            let avatar = null;
            if (avatar == null || avatar == '') {
                console.log('头像数据没有 存一下');
                wx.downloadFile({
                    url: api.cdnPath(api.cnyUserInfo.Headimg),
                    success: function (res) {
                        console.log('头像', res);
                        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                        if (res.statusCode === 200) {
                            wx.setStorageSync('cny2017Avatar', res.tempFilePath);
                            console.log('page.runView', page.runView);
                            if (page.data.runView != "") {
                                if (page.data.runView == "gift") {
                                    wx.redirectTo({
                                        url: '../gift/gift'
                                    })
                                }
                            }
                        }
                    }
                })
            }
        });
    },
    

    getLoadImgs: function () {
        let arr = [];
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/btn_rank.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/arrow_left.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/arrow_right.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/bg.jpg');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/border.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/btn_arrow.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/btn_friend.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/btn_get.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/btn_index.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/btn_join.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/btn_me.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/btn_share.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/card.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/card_back.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/card_icon.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/dog.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/gift.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/gift_btn.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/gift_code.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/gift_icon.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/gift_title.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/gift_txt.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/icon_record.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/icon_record_on.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/icon_ok.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/icon_reset.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/radio.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/result_tip.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/rule.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/rule_btn_back.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/rule_txt.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/slogan.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/wish_1.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/wish_2.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/wish_3.png');
        arr.push('http://img.cdn.be-xx.com/oppo_wxapp/activity/cny2017/wish_icon.png');
        return arr.map(item => {
            return {
                url: item,
                loaded: false
            }
        })
    },
    imageOnLoad: function (err, data) {
        // console.log('图片加载完成', err, data.src)
        let loadingIndex = this.data.loadingIndex;
        let loadingMax = this.data.loadingMax;
        loadingIndex++;
        let per = Math.floor(loadingIndex / loadingMax * 50);
        // console.log('loadingIndex:' + loadingIndex);
        // console.log('loading:'+per);
        this.setData({
            loadingPer: per,
            loadingIndex: loadingIndex
        });
        if (per >= 50) {
            let speed = 30;
            let timeid = setInterval(() => {
                if (per > 100) {
                    clearInterval(timeid);
                    let ani = this.createHideAnimation(500);
                    this.setData({
                        loadingAni: ani.export()
                    });
                    setTimeout(() => {
                        this.setData({
                            loadingShow: false
                        });
                    }, 600);
                } else {
                    this.setData({
                        loadingPer: per
                    });
                }
                per++;
            }, speed);
        }
    },
    checkLoading: function () {
        let per = 0;
        let speed = 30;
        let imgList = this.getLoadImgs();
        this.setData({
            loadingMax: imgList.length
        });
        let imgLoader = new ImgLoader(this, this.imageOnLoad.bind(this))
        imgList.forEach(item => {
            imgLoader.load(item.url);
        })

    },

    createHideAnimation: function (time) {
        var animation = wx.createAnimation({
            duration: time,
            timingFunction: 'ease',
        })
        animation.opacity(0).step();
        return animation;
    },

    agreeChange: function () {
        let isAgree = this.data.isAgree;
        isAgree = !isAgree;
        this.setData({
            isAgree: isAgree
        });
    },

    btnBookTap: function (e) {
        let bool = api.checkUser();
        if (!bool)return;
        //增加活动结束判断
        let isEnd = this.data.isEnd;
        if(isEnd){
            wx.showModal({
                title: '提示',
                content: '活动已结束，祝你新年快乐！',
                showCancel: false
            })
            return;
        }
        let openid = wx.getStorageSync('openid');
        console.log(e.detail);
        console.log(api.cnyUserInfo);
        console.log("openid:" + openid);
        if (openid) {
            let leftTime = new Date().getTime() - goTime;
            console.log('leftTime:' + leftTime);
            if (leftTime > api.clickTime){
                goTime = new Date().getTime();
                let formId = e.detail.formId;
                let isAgree = this.data.isAgree;
                api.start(openid, isAgree, formId, () => {
                    wx.navigateTo({
                        url: '../make/make',
                    })
                })
            }else{
                console.log('别点太快');
            }
            
        } else {
            wx.showModal({
                title: '提示',
                content: '未识别到你的微信身份\n请到发现->小程序中\n删除OPPO官方+后\n重新搜索进入',
                showCancel: false
            })
        }

    },

    goRank: function(){
        let bool = api.checkUser();
        if (bool){
            let leftTime = new Date().getTime() - goTime;
            if (leftTime > api.clickTime) {
                goTime = new Date().getTime();
                wx.navigateTo({
                    url: '../rank/rank',
                })
            } else {
                console.log('别点太快');
            }
        }
        
    },
    goRule: function () {
        let bool = api.checkUser();
        if (bool) {
            let leftTime = new Date().getTime() - goTime;
            if (leftTime > api.clickTime) {
                goTime = new Date().getTime();
                wx.navigateTo({
                    url: '../rule/rule',
                })
            } else {
                console.log('别点太快');
            }
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        // wx.navigateTo({
        //     url: '../friend/friend',
        // })
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