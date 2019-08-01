// pages/activity/cny2017/friend/friend.js

const innerAudioContext = wx.createInnerAudioContext();
const bgmAudio = wx.createInnerAudioContext();
var api = require('../api.js');
var dialog = require('../../../../common/dialog.js');
var app = getApp();
let goTime = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isHide: true,
        isOpen: false,
        toView: 0,
        soundOpen: false,
        avatarTemp: "",
        isPlaySound: false,
        isOpenCard: false,
        msgList: [],
        localAuth: false,
        isSelf: false,
        greetings: "",
        loadingShow: true,

        loadingPer: 0,
        loadingIndex: 100
    },

    goIndex: function () {
        let bool = api.checkUser();
        if (!bool) return;
        let leftTime = new Date().getTime() - goTime;
        console.log('leftTime:' + leftTime);
        if (leftTime > api.clickTime) {
            goTime = new Date().getTime();
            bgmAudio.stop();
            innerAudioContext.stop();
            wx.redirectTo({
                url: '/pages/activity/cny2017/home/home?needLoading=1'
            })
        } else {
            console.log('别点太快');
        }

    },

    /**
     * 去我的新春礼盒
     */
    goToMyGift: function () {
        let bool = api.checkUser();
        if (!bool) return;
        let leftTime = new Date().getTime() - goTime;
        console.log('leftTime:' + leftTime);
        if (leftTime > api.clickTime) {
            goTime = new Date().getTime();
            bgmAudio.stop();
            innerAudioContext.stop();
            let openid = wx.getStorageSync('openid');
            api.getState(openid, (res) => {
                console.log(res);
                if (res == 'True') {
                    wx.redirectTo({
                        url: '/pages/activity/cny2017/gift/gift'
                    })
                } else {
                    wx.redirectTo({
                        url: '/pages/activity/cny2017/home/home?needLoading=1'
                    })
                }
            });
        } else {
            console.log('别点太快');
        }
        
    },

    openCard: function () {
        this.setData({
            isOpen: true
        })
        setTimeout(() => {
            this.setData({
                isOpenCard: true
            });
        });
        setTimeout(() => {
            api.Adlist(this.data.sid, (res) => {
                this.parseMsg(res);
            });
            this.setData({
                soundOpen: true
            });
        }, 2000);
    },

    playSound: function () {
        let isOpenCard = this.data.isOpenCard;
        if (!isOpenCard) return;
        console.log("this.data.shareRecord:" + this.data.shareRecord);
        if (this.data.shareRecord == "") {
            wx.showModal({
                title: '提示',
                content: '你的好友啥也没说呢，生成你的祝福吧',
            })
            return;
        }
        let soundOpen = this.data.soundOpen;
        if (soundOpen) {
            innerAudioContext.src = this.data.shareRecord;
            innerAudioContext.stop();
            innerAudioContext.play();

            bgmAudio.src = "https://oppowx.beats-digital.com/activity/cny2017/bgm.mp3";
            bgmAudio.startTime = 0;
            bgmAudio.play();
            innerAudioContext.onEnded(() => {
                this.setData({
                    isPlaySound: false
                });
                bgmAudio.stop();
            })
            innerAudioContext.onError(() => {
                this.setData({
                    isPlaySound: false
                });
                bgmAudio.stop();
            })
            this.setData({
                isPlaySound: true
            });
        }
    },
    stopSound: function () {
        this.setData({
            isPlaySound: false
        });
        innerAudioContext.stop();
        bgmAudio.stop();
    },

    parseMsg: function (arr) {
        let list = [];
        //获得了xxx的新春礼盒
        for (let i = 0; i < arr.length; i++) {
            let obj = arr[i];
            list.push(obj.nickname + '获得了' + obj.nickname1 + '的新春礼盒');
        }

        var page = this;
        var msgList = [];
        var index = 0;
        var total = list.length;
        if (total > 0) {
            var msgID = setInterval(function () {
                if (index < total) {
                    msgList.push(list[index]);
                    page.setData({
                        toView: 'item' + (index),
                        msgList: msgList
                    });
                } else {
                    clearInterval(msgID);
                }
                index++;

            }, 500);
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.showLoading();
        api.checkEnd(this);
        console.log("isEnd", this.data.isEnd);
        if (this.data.isEnd) {
            wx.redirectTo({
                url: '../home/home'
            });
            return;
        }
        let shareid = options.sid;
        this.setData({
            shareid: shareid
        });
        console.log(shareid);

        // wx.showLoading({
        //     title: '稍等哦~',
        // })
    },

    /**
     * 修改祝福语
     */
    changeGreetings: function () {
        let openid = wx.getStorageSync('openid');
        if (this.data.sid == openid) {
            //如果是自己就不会播放动画了
            this.setData({
                isOpen: true,
                isSelf: true,
                isOpenCard: true,
                soundOpen: true,
                greetings: this.data.nickName + "：正在送出新年祝福"
            });
            api.Adlist(this.data.sid, (res) => {
                this.parseMsg(res);
            });
        }
        else {
            if (this.data.shareRecord == "") {
                this.setData({
                    greetings: this.data.nickName + "：千言万语不如一份新年礼，送你一份小惊喜！"
                });
            }
            else {
                this.setData({
                    greetings: this.data.nickName + "：有些重要的话，今天一定要讲给你听！记得把声音调大哦~"
                });
            }
        }
    },

    checkIsGet: function(cb){
        let openid = wx.getStorageSync('openid');
        api.Adlist(this.data.sid, (res) => {
            console.log(res);
            var isGet = false;
            var list = res;
            if (list){
                try{
                    var total = list.length;
                    if (total > 0) {
                        for (var i = 0; i < total; i++) {
                            var obj = list[i];
                            if (obj.openid == openid) {
                                isGet = true;
                                break;
                            }
                        }
                    }
                }catch(e){
                    console.log('adlist:' + res);
                }

            }
            if(isGet){
                //如果自己领过了
                this.setData({
                    isOpen: true,
                    isSelf: true,
                    isOpenCard: true,
                    soundOpen: true,
                    greetings: this.data.nickName + "：正在送出新年祝福"
                });
                this.parseMsg(res.slice(0, 20));
            }
            cb(isGet);
        });
    },

    checkLocal: function (cb) {
        //判断是否有授权地址功能
        wx.getSetting({
            success: (res) => {
                console.log(res);
                if (res.authSetting['scope.userLocation'] != undefined) {
                    if (!res.authSetting['scope.userLocation']) {
                        wx.openSetting({
                            success: (res) => {
                                if (!res.authSetting['scope.userLocation']) {
                                    app.errTip('未授权地址访问');
                                    cb(false);
                                } else {
                                    app.errTip('地址访问授权成功');
                                    cb(true);
                                }
                            }
                        })
                    } else {
                        console.log('gogo');
                        cb(true);
                    }
                } else {
                    cb(true);
                }
            },
            fail: function () {
                app.errTip('getSetting error');
            }
        })
    },

    initUser: function (local, fromid){
        let openid = wx.getStorageSync('openid');
        let userInfo = wx.getStorageSync('userInfo');
        if (this.data.sid == openid) {
            console.log('isSelf true');
            api.initUser(openid, userInfo.nickName, userInfo.avatarUrl, local, userInfo.gender, fromid, () => {
                console.log('api.cnyUserInfo:', api.cnyUserInfo);
                if (api.cnyUserInfo.OpenID == undefined || api.cnyUserInfo.OpenID == "" || api.cnyUserInfo.OpenID == null) {
                    wx.showModal({
                        title: '提示',
                        content: '用户信息错误，请重新进入',
                        showCancel: false,
                        success: () => {

                        }
                    })
                    wx.hideLoading();
                } else {
                    console.log('api.cnyUserInfo:', api.cnyUserInfo);
                    api.GetKey(api.cnyUserInfo.OpenID, api.cnyUserInfo.Area, (keyData) => {
                        console.log(keyData);
                        this.changeGreetings();
                        this.setData({
                            isHide: false,
                            hasGift: (keyData.state == 'True')
                        });
                        wx.hideLoading();
                    });
                }
            });
        } else {
            console.log('isSelf false');
            //如果不是自己  检测是否领了
            this.checkIsGet((bol) => {
                console.log('checkIsGet:' + bol);
                if (!bol) {
                    api.initUser(openid, userInfo.nickName, userInfo.avatarUrl, local, userInfo.gender, fromid, () => {
                        api.GetKey(api.cnyUserInfo.OpenID, api.cnyUserInfo.Area, (keyData) => {
                            console.log(keyData);
                            this.changeGreetings();
                            this.setData({
                                isHide: false,
                                hasGift: (keyData.state == 'True')
                            });

                            wx.hideLoading();
                        });
                    });
                } else {
                    api.initUser(openid, userInfo.nickName, userInfo.avatarUrl, local, userInfo.gender, fromid, () => {
                        app.errTip('你已打开过TA的祝福，生成你的祝福吧');
                        this.setData({
                            isHide: false
                        });
                        wx.hideLoading();
                    });
                }
            });
        }
    },
    verifyLogin: function (fromid){
        app.verifyLogin((data) => {
            let userInfo = wx.getStorageSync('userInfo');
            let userData = data.body;
            let lat_and_lng = wx.getStorageSync('lat_and_lng');
            console.log(userInfo);
            console.log(userData);
            if (lat_and_lng){
                let location = lat_and_lng.latitude + "," + lat_and_lng.longitude;
                this.initUser(location, fromid);
            }else{
                wx.getLocation({
                    type: 'wgs84',
                    success: (res) => {
                        let latitude = res.latitude;
                        let longitude = res.longitude;
                        let lat_and_lng = {
                            latitude: latitude,
                            longitude: longitude
                        }
                        //存储一下
                        wx.setStorageSync('lat_and_lng', lat_and_lng);
                        let location = latitude + "," + longitude;
                        this.initUser(location, fromid);
                    },
                    fail: () => {
                        this.initUser('', fromid);
                    }
                })
            }
            

        })
    },
    appInit: function (fromid) {
        let localAuth = this.data.localAuth;
        if (!localAuth) {
            this.checkLocal((bol) => {
                this.setData({
                    localAuth: bol
                });
                if (bol) {
                    this.appInit(fromid);
                }else{
                    this.verifyLogin(fromid);
                }
            });
        } else {
            this.verifyLogin(fromid);
        }
    },
    createHideAnimation: function (time) {
        var animation = wx.createAnimation({
            duration: time,
            timingFunction: 'ease',
        })
        animation.opacity(0).step();
        return animation;
    },
    showLoading: function () {
        // console.log('图片加载完成', err, data.src)
        let loadingIndex = 1;
        let loadingMax = 100;
        loadingIndex++;
        let per = Math.floor(loadingIndex / loadingMax * 50);
        // console.log('loadingIndex:' + loadingIndex);
        // console.log('loading:'+per);
        this.setData({
            loadingPer: per,
            loadingIndex: loadingIndex
        });
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
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        if (this.data.isEnd) {
            return;
        }
        let shareid = this.data.shareid;
        //先去拿分享信息
        api.GetShare(shareid, (getShareRes) => {
            if (getShareRes && getShareRes.length > 0){
                console.log(getShareRes);
                getShareRes = getShareRes[0];
                this.setData({
                    nickName: getShareRes.NickName,
                    shareImgName: getShareRes.Image,
                    shareImg: api.uploadImgPath(getShareRes.Image).big,
                    shareRecord: (getShareRes.Record == "") ? "" : api.cdnPath(getShareRes.Record),
                    avatarTemp: api.cdnPath(getShareRes.Headimg),
                    sid: getShareRes.OpenID
                });
                let lat_and_lng = wx.getStorageSync('lat_and_lng');
                if (lat_and_lng){
                    this.verifyLogin(getShareRes.OpenID);
                }else{
                    //自己去授权
                    this.appInit(getShareRes.OpenID);
                }
                
            }else{
                wx.showModal({
                    title: '提示',
                    content: 'GetShare error',
                    showCancel: false
                })
            }
            
        });

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
            imageUrl: 'https://upload.cdn.be-xx.com/oppox/share.jpg'
        }
    }
})