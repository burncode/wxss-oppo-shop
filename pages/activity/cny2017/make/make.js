// pages/activity/cny2017/make/make.js

var app = getApp();
var api = require('../api.js');
var dialog = require('../../../../common/dialog.js');
var apiHost = require('../../../../common/api_host.js');
var httpJson = require('../../../../common/http_json.js');
var user = require('../../../../utils/user.js');
var timeid;
var recordLineId;
let goTime = 0;
const recorderManager = wx.getRecorderManager();
const recordOptions = {
    duration: 10000,        //录音的时长，单位 ms 
    sampleRate: 44100,      //采样率，有效值 8000/16000/44100
    numberOfChannels: 1,    //录音通道数，有效值 1/2
    encodeBitRate: 192000,  //编码码率
    format: 'mp3',          //音频格式，有效值 aac/mp3
    frameSize: 50           //指定帧大小，单位 KB
}
const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = true;

const bgmAudio = wx.createInnerAudioContext();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {
            avatarUrl: 'about:bank'
        },
        //这些图片放本地是因为要在canvas里面绘制
        listData: [
            { id: 1, value: "../../../../images/activity/cny2017/wish_1.png", select: false, width: 270, height: 34, scale: 1.4 },
            { id: 2, value: "../../../../images/activity/cny2017/wish_2.png", select: false, width: 451, height: 40, scale: 0.88 },
            { id: 3, value: "../../../../images/activity/cny2017/wish_3.png", select: false, width: 276, height: 38, scale: 1.4 },
            { id: 4, value: "../../../../images/activity/cny2017/wish_4.png", select: false, width: 270, height: 34, scale: 1.4 },
            { id: 5, value: "../../../../images/activity/cny2017/wish_5.png", select: false, width: 451, height: 40, scale: 0.88 },
            { id: 6, value: "../../../../images/activity/cny2017/wish_6.png", select: false, width: 276, height: 38, scale: 1.4 }
        ],
        listItemIndex: 0,
        avatarTemp: "",
        //如果用户选了默认图片 就会有值
        wishPic: { id: 1, value: "../../../../images/activity/cny2017/wish_6.png", select: false, width: 270, height: 34, scale: 1.4 },
        wishWord: "",
        isRecord: false,
        recordTime: 0,
        //是否开始播放声音了
        isPlay: false,
        recordAuth: false,
        recordPath: "",
        //录音倒计时
        recordTimeStr: "00:00",
        touchMsg:"touchMsg"
    },

    testStart: function(){
        this.setData({
            touchMsg: "testStart"
        });
        this.startRecord();
    },
    testEnd: function () { 
        this.setData({
            touchMsg: "testEnd"
        });
        this.stopRecord();
    },

    showResult: function(){
        let leftTime = new Date().getTime() - goTime;
        console.log('leftTime:' + leftTime);
        if (leftTime > api.clickTime) {
            goTime = new Date().getTime();
            //如果在录音的情况 先把录音停了
            this.stopRecord();
            innerAudioContext.stop();
            bgmAudio.stop();
            let recordPath = this.data.recordPath;
            // if (recordPath == ""){
            //     app.errTip('你不说点什么吗？');
            //     return;
            // }
            let wishWord = this.data.wishWord;
            let wishPic = this.data.wishPic;
            let u = '';
            //1用的图片 2用的文字
            let mode = 1;
            if (wishWord == "") {
                mode = 2;
            }
            let resultData = {
                mode: mode,
                wishWord: wishWord,
                wishPic: wishPic,
                recordPath: recordPath
            };
            //停掉
            innerAudioContext.stop();
            this.setData({
                isPlay: false,
                isRecord: false,
                cardIconAni: false
            });

            console.log(resultData);
            //将结果数据存下来 方便后面预览使用
            wx.setStorageSync('cny2017Result', JSON.stringify(resultData));
            wx.navigateTo({
                url: '../result/result',
                fail: () => {
                    wx.redirectTo({
                        url: '../result/result'
                    })
                }
            })
        } else {
            console.log('别点太快');
        }
        
    },
    // //祝福语选择
    // listItemTap: function(e){
    //     // console.log(e.currentTarget.dataset);
    //     let index = parseInt(e.currentTarget.dataset.listindex);
    //     this.setData({
    //         listItemIndex: index,
    //         wishPic: this.data.listData[index]
    //     });
    // },
    changeWish: function(){
        let listItemIndex = this.data.listItemIndex;
        let listData = this.data.listData;
        let total = listData.length - 1;
        listItemIndex++;
        if(listItemIndex > total){
            listItemIndex = 0;
        }
        this.setData({
            listItemIndex: listItemIndex,
            wishPic: listData[listItemIndex],
            wishWord: ""
        });
    },
    //开启输入框
    openInput: function(){
        this.setData({
            wishPic: null
        });
    },
    closeInput: function(e){
        let wishWord = e.detail.value;
        //如果为空 默认选一个祝福
        if(wishWord == ''){
            this.setData({
                listItemIndex: 0,
                wishPic: this.data.listData[0]
            });
        }else{
            this.setData({
                wishWord: wishWord,
            });
        }
        console.log(e.detail);
    },
    checkAuthRecord: function(cb){
        //判断是否有授权录音功能
        wx.getSetting({
            success: (res) => {
                console.log(res);
                if (res.authSetting['scope.record'] != undefined) {
                    if (!res.authSetting['scope.record']) {
                        wx.openSetting({
                            success: (res) => {
                                if (!res.authSetting['scope.record']) {
                                    // app.errTip('未授权录音');
                                    cb(false);
                                } else {
                                    app.errTip('请说出你的祝福');
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
            }
        })
    },
    //开始录音
    startRecord: function(){
        console.log('startRecord');
        let recordAuth = this.data.recordAuth;
        if (!recordAuth){
            this.checkAuthRecord((bol)=>{
                this.setData({
                    recordAuth: bol
                });
                if (bol){
                    // this.startRecord();
                }
            });
        }else{
            let isPlay = this.data.isPlay;
            let isRecord = this.data.isRecord;
            if (isRecord)this.stopRecord();
            let time = 10;
            let recordTime = 0;
            //如果正在试听就关闭
            if (isPlay) {
                innerAudioContext.stop();
                this.setData({
                    isPlay: false,
                    cardIconAni: false
                });
            }
            if (timeid) clearInterval(timeid);
            //每次录音开始就把上一次的录音数据暂时关闭
            this.setData({
                cardIconAni: true,
                isRecord: true,
                recordPath: ""
            });
            //录音开始的时候 如果有试听 就关闭
            innerAudioContext.stop();
            recorderManager.onStop((res) => {
                console.log('recorder stop', res)
                app.errTip('录音结束');
                if (timeid) clearInterval(timeid);
                if (recordTime < 10){
                    recordTime = "0" + recordTime;
                }
                this.setData({
                    recordPath: res.tempFilePath,
                    isRecord: false,
                    cardIconAni: false,
                    recordTimeStr: "00:" + recordTime,
                    recordTime: recordTime
                });
            });
            recorderManager.onError(() => {
                console.log('recorder onError');
                if (timeid) clearInterval(timeid);
                // app.errTip('录音失败');
                recorderManager.stop();
                this.stopRecord();
                // this.setData({
                //     isRecord: false,
                //     cardIconAni: false
                // });
            });
            recorderManager.start(recordOptions);
            this.setData({
                recordTimeStr: "00:10"
            });
            timeid = setInterval(() => {
                time--;
                recordTime++;
                if (time < 0) {
                    recordTime = 10;
                    clearInterval(timeid);
                } else {
                    let recordTimeStr = "00:0" + time;
                    this.setData({
                        recordTimeStr: recordTimeStr,
                        recordTime: recordTime
                    });
                }
            }, 1000);
        }
    },
    //停止录音
    stopRecord: function () {
        let isRecord = this.data.isRecord;
        if (timeid) clearInterval(timeid);
        if (isRecord){
            this.setData({
                isRecord: false,
                cardIconAni: false
            });
            recorderManager.stop();
        }
        
    },
    playRecord: function(){
        let recordPath = this.data.recordPath;
        console.log(recordPath);
        if (recordPath == ""){
            app.errTip('请先录音');
        }else{
            let isPlay = this.data.isPlay;
            console.log('innerAudioContext.paused:' + innerAudioContext.paused);
            if (isPlay){
                innerAudioContext.stop();
                bgmAudio.stop();
                if (timeid) clearInterval(timeid);
                let recordTime = this.data.recordTime;
                this.setData({
                    isPlay: false,
                    cardIconAni: false,
                    recordTimeStr: "00:" + recordTime
                });
            }else{
                bgmAudio.src = "https://oppowx.beats-digital.com/activity/cny2017/bgm.mp3";
                bgmAudio.startTime = 0;
                bgmAudio.play();
                innerAudioContext.src = recordPath;
                innerAudioContext.play();
                innerAudioContext.startTime = 0;
                innerAudioContext.onPlay(() => {
                    if (timeid) clearInterval(timeid);
                    this.setData({
                        isPlay: true,
                        cardIconAni: true
                    });
                    console.log('开始播放')
                    let time = 0;
                    this.setData({
                        recordTimeStr: "00:00"
                    });
                    timeid = setInterval(() => {
                        time++;
                        if (time > 10) {
                            clearInterval(timeid);
                        } else {
                            let recordTimeStr = "00:0" + time;
                            if (time == 10){
                                recordTimeStr = "00:10";
                            }
                            this.setData({
                                recordTimeStr: recordTimeStr
                            });
                        }

                    }, 1000);
                })
                innerAudioContext.onEnded(() => {
                    if (timeid) clearInterval(timeid);
                    let recordTime = this.data.recordTime;
                    this.setData({
                        isPlay: false,
                        cardIconAni: false,
                        recordTimeStr: "00:" + recordTime
                    });
                    bgmAudio.stop();
                    console.log('结束播放')
                })
                innerAudioContext.onError((res) => {
                    // console.log(res.errMsg)
                    // console.log(res.errCode)
                    bgmAudio.stop();
                })
                innerAudioContext.onTimeUpdate((res) => {
                    // console.log(res);
                })
            }
        }
    },
    wishInputBlur: function(e){
        console.log(e.detail);
        let word = e.detail.value;
        console.log(word);
        this.setData({
            wishWord: word
        });
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var page = this;
        wx.hideShareMenu();
        this.setData({
            userInfo: wx.getStorageSync('userInfo')
        });
        wx.authorize({
            scope: 'scope.record',
            success: ()=> {
                this.setData({
                    recordAuth: true
                });
            },
            fail:()=>{
                this.setData({
                    recordAuth: false
                });
            }
        })
        // wx.getSetting({
        //     success: (res) => {
        //         console.log(res);
        //         if (res.authSetting['scope.record'] != undefined) {
        //             if (res.authSetting['scope.record']) {
        //                 this.setData({
        //                     recordAuth: true
        //                 });
        //             }
        //         }
        //     }
        // })
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

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        console.log('onhide');
        // this.stopRecord();

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