// pages/activity/cny2017/rank/rank.js
var api = require('../api.js');
let goTime = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rankList: [],
        selfRank: { topnum: '-', NickName: '-', topcut: '-' },
        //是否显示保存信息UI
        saveShow: false,
        //姓名
        saveName: "",
        //手机号码
        saveTel: "",
        //联系地址
        saveAddress: ""
    },

    btnGetClick: function () {
        let openid = wx.getStorageSync('openid');
        if (openid) {
            let leftTime = new Date().getTime() - goTime;
            console.log('leftTime:' + leftTime);
            if (leftTime > api.clickTime) {
                goTime = new Date().getTime();
                api.getState(api.cnyUserInfo.OpenID, (res) => {
                    console.log(res);
                    if (res == 'True') {
                        wx.navigateTo({
                            url: '../gift/gift',
                        })
                    } else {
                        wx.navigateBack();
                    }
                });
            } else {
                console.log('别点太快');
            }
        }
    },
    btnRuleClick: function () {
        let leftTime = new Date().getTime() - goTime;
        console.log('leftTime:' + leftTime);
        if (leftTime > api.clickTime) {
            goTime = new Date().getTime();
            wx.navigateTo({
                url: '../rule/rule',
            })
        } else {
            console.log('别点太快');
        }
    },

    getRankList: function () {

        let openid = wx.getStorageSync('openid');
        let userInfo = wx.getStorageSync('userinfo');
        console.log(userInfo);
        if (openid) {
            wx.showLoading({
                title: '排行榜数据获取中...',
            })
            api.topList(openid, (topListData) => {
                wx.hideLoading();
                console.log(topListData);
                let rankList = [];
                let selfRank = { topnum: '-', NickName: userInfo.nickName, topcut: '-' }
                if (topListData){
                    if (topListData.length == 1) {
                        rankList = JSON.parse(topListData[0]);
                    } else if (topListData.length == 2) {
                        rankList = JSON.parse(topListData[0]);
                        let selfRankList = JSON.parse(topListData[1]);
                        if (selfRankList.length > 0) {
                            selfRank = selfRankList[0];
                        }

                    }
                }
                
                console.log(selfRank);
                let saveShow = false;
                //排行榜前10的才会弹框
                if (selfRank.topnum <= 10){
                    saveShow = true;
                }
                api.checkMsg(openid, (checkRes)=>{
                    console.log('checkRes:' + checkRes);
                    checkRes = parseInt(checkRes);
                    if (checkRes == 0){
                        
                    }else{
                        saveShow = false;
                    }
                    console.log(checkRes);
                    this.setData({
                        saveShow: saveShow
                    });
                });
                this.setData({
                    rankList: rankList,
                    selfRank: selfRank
                });
            });
        } else {

        }

    },
    
    onSaveInfo: function(){
        let name = this.data.saveName;
        let tel = this.data.saveTel;
        let address = this.data.saveAddress;
        let needTip = false;
        let tipWord = "";
        if(name == ""){
            tipWord = "姓名不能为空";
            needTip = true;
        } else if (tel == "") {
            tipWord = "手机不能为空";
            needTip = true;
        } else if (address == "") {
            tipWord = "地址不能为空";
            needTip = true;
        }

        if (needTip){
            wx.showModal({
                title: '提示',
                content: tipWord,
                showCancel: false
            })
        }else{
            let openid = wx.getStorageSync('openid');
            //发送数据到服务器保存
            console.log('要提交的信息:', name, tel, address);
            wx.showLoading({
                title: '保存信息中......',
            })
            api.saveInfo(openid, name, tel, address, (saveInfoRes) => {
                wx.hideLoading();
                console.log('saveInfoRes:' + saveInfoRes);
                saveInfoRes = parseInt(saveInfoRes);
                if (saveInfoRes > 0){
                    if (saveInfoRes == 405 || saveInfoRes == 404){
                        wx.showModal({
                            title: '提示',
                            content: '网络异常 请重新提交',
                            showCancel: false
                        })
                    }else{
                        wx.showModal({
                            title: '提示',
                            content: '提交成功！',
                            showCancel: false,
                            success: ()=>{
                                this.setData({
                                    saveShow: false
                                });
                            }
                        })
                    }
                }else{
                    wx.showModal({
                        title: '提示',
                        content: '网络异常 请重新提交',
                        showCancel: false
                    })
                }
            });
        }
    },
    saveNameInput: function(e){
        console.log('saveName:', e.detail.value);
        this.setData({
            saveName: e.detail.value
        });
    },
    saveTelInput: function (e) {
        console.log('saveTel:', e.detail.value);
        this.setData({
            saveTel: e.detail.value
        });
    },
    saveAddressInput: function (e) {
        console.log('saveAddress:', e.detail.value);
        this.setData({
            saveAddress: e.detail.value
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        api.checkEnd(this);
        console.log("isEnd", this.data.isEnd);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.getRankList();
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