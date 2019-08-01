// pages/activity/cny2017/result/result.js
// let divW = 718*2;
// let divH = 561 * 2;
let divScale = 2;
let divW = 718 * divScale;
let divH = 561 * divScale;

let codeDivW = 750 * 2;
let codeDivH = 1331 * 2;
var app = getApp();
var api = require('../api.js');
let goTime = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cavansWidth: 0,
        cavansHeight: 0,
        scale: 1,
        bgTemp: "../../../../images/activity/cny2017/card.png",
        avatarRadius: 55*2,
        avatarPos: {x:152*2,y:100*2},
        avatarTemp:"",
        drawImgUrl: '../../../../images/activity/cny2017/card.png',
        //要下载的合成图
        downImgUrl: "",
        shareid: -1,
        shareImg: '',
        downAuth: false
    },

    goBack: function(){
        wx.navigateBack();
    },

    openShare: function(){
        
    },

    goGift: function(){
        let leftTime = new Date().getTime() - goTime;
        console.log('leftTime:' + leftTime);
        if (leftTime > api.clickTime) {
            goTime = new Date().getTime();
            let hasLocal = api.hasLocal;
            let page = this;
            wx.navigateTo({
                url: '../gift/gift?shareImgName=' + this.data.shareImgName + "&shareRecord=" + this.data.shareRecord,
            })
        } else {
            console.log('别点太快');
        }
        
    },
    initUser: function (location) {
        let page = this;
        let openid = wx.getStorageSync('openid');
        let userInfo = wx.getStorageSync('userInfo');
        api.initUser(openid, userInfo.nickName, userInfo.avatarUrl, location, userInfo.gender, '', () => {
            wx.navigateTo({
                url: '../gift/gift'
            })
        });
    },

    createImg: function(){
        var w = this.data.cavansWidth;
        var h = this.data.cavansHeight;
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: w,
            height: h,
            destWidth: w,
            destHeight: h,
            // fileType:'jpg',
            canvasId: 'cnyPic',
            success: (res) => {
                console.log('toPhoto success', res);
                console.log(res.tempFilePath)
                this.setData({
                    drawImgUrl: res.tempFilePath
                });
                //这里做一个一定要拿到数据后才隐藏loading 否则分享图看不到
                let openid = wx.getStorageSync('openid');
                //上传图片
                api.uploadImg(openid, res.tempFilePath, (res) => {
                    console.log('uploadImg', res);
                    this.setData({
                        shareImgName: res
                    });
                    //可以不录音
                    if (this.data.viewData.recordPath == "") {
                        this.setData({
                            shareRecord: ''
                        });
                        this.startDrawCode();
                    } else {
                        api.uploadRecord(openid, this.data.viewData.recordPath, (res) => {
                            console.log("uploadRecord:", res);
                            if (res == 601) {
                                this.setData({
                                    shareRecord: ''
                                });
                                this.startDrawCode();
                            } else {
                                this.setData({
                                    shareRecord: res
                                });
                                this.startDrawCode();
                            }
                        });
                    }
                });
            },
            fail: (failRes)=> {
                wx.hideLoading();
                wx.showModal({
                    title: '提示',
                    content: '图片生成失败,请重新编辑',
                    showCancel: false,
                    success: function(){
                        wx.navigateBack();
                    }
                })
                console.log('toPhoto fail', failRes);
            }
        })
    },
    //开始绘制磁带
    drawCard: function (scale){
        var context = wx.createCanvasContext('cnyPic');
        context.scale(scale, scale);
        context.drawImage(this.data.bgTemp, 0, 0, divW, divH);
        
        //拿得到文字数据 解析一下
        var viewData = this.data.viewData;
        if (viewData.mode == 1) {
            //文字
            context.setFillStyle("#f9c768");
            context.setTextAlign('center');
            context.setTextBaseline('middel');
            context.setFontSize(40 * divScale);
            context.fillText(viewData.wishWord, divW / 2, 120 * divScale);
        }
        else {
            //图片
            var wishPic = viewData.wishPic;
            context.drawImage(wishPic.value, 90 * divScale, 50, 550 * divScale, 114 * divScale);
        }
        //滚轮
        context.drawImage('../../../../images/activity/cny2017/card_icon.png', 170 * divScale, 194 * divScale, 76 * divScale, 76 * divScale);
        context.drawImage('../../../../images/activity/cny2017/card_icon.png', 474 * divScale, 194 * divScale, 76 * divScale, 76 * divScale);

        wx.drawCanvas({
            canvasId: "cnyPic",
            actions: context.getActions()
        });
    },
    //开始绘制二维码合成图 
    startDrawCode: function () {
        let openid = wx.getStorageSync('openid');
        let userInfo = wx.getStorageSync('userInfo');
        api.SetShare(openid, userInfo.nickName, this.data.shareRecord, this.data.shareImgName, (setShareRes) => {
            console.log(setShareRes);
            if (setShareRes <= 0) {
                wx.hideLoading();
                wx.showModal({
                    title: '提示',
                    content: '保存分享信息失败',
                    showCancel: false,
                    success: function () { }
                })
            }else{
                //成功拿到分享ID 
                this.setData({
                    shareid: setShareRes
                });
                api.QRDown('pages/index/index', setShareRes, 500, (qrDownRes) => {
                    console.log('QRDOWN:',qrDownRes);
                    
                    //拿到服务器的qrcode图片 下载到本地
                    wx.downloadFile({
                        url: api.cdnPath(qrDownRes),
                        success: (res)=> {
                            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                            if (res.statusCode === 200) {
                                this.setData({
                                    appCodeUrl: res.tempFilePath
                                });
                            }else{
                                this.setData({
                                    appCodeUrl: ''
                                });
                                wx.showModal({
                                    title: '提示',
                                    content: '远程code下载失败',
                                    showCancel: false
                                })
                            }
                            this.drawCardToPic();
                        }
                    })
                    
                });
            }
        });
      
    },
    //合成二维码图片
    drawCardToPic: function(){
        this.drawCodePic(this.data.scale);
        setTimeout(() => {
            var w = this.data.canvasCodeWidth;
            var h = this.data.canvasCodeHeight;
            // w = 750 * 2;
            // h = 1331;
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: w,
                height: h,
                destWidth: w,
                destHeight: h,
                // fileType:'jpg',
                canvasId: 'codePic',
                success: (res) => {
                    console.log(res.tempFilePath)
                    this.setData({
                        downImgUrl: res.tempFilePath
                    });
                    wx.hideLoading();
                },
                fail: (failRes) => {
                    wx.hideLoading();
                    wx.showModal({
                        title: '提示',
                        content: '转换二维码合成图失败',
                        showCancel: false,
                        success: function () {
                        }
                    })
                }
            })
        }, 500);
    },

    checkDown: function (cb) {
        //判断是否有授权录音功能
        wx.getSetting({
            success: (res) => {
                console.log(res);
                if (res.authSetting['scope.writePhotosAlbum'] != undefined) {
                    if (!res.authSetting['scope.writePhotosAlbum']) {
                        wx.openSetting({
                            success: (res) => {
                                if (!res.authSetting['scope.writePhotosAlbum']) {
                                    app.errTip('未授权保存到相册，如需保存，请重新编辑你的祝福');
                                    cb(false);
                                } else {
                                    // app.errTip('保存到相册授权成功');
                                    cb(true);
                                }
                            }
                        })
                    } else {
                        cb(true);
                    }
                }else{
                  cb(true);
                }
            }
        })
    },

    downCodePic: function(){
        let downAuth = this.data.downAuth;
        if (!downAuth){
            this.checkDown((bol)=>{
                this.setData({
                    downAuth: bol
                });
                if (bol) {
                    this.downCodePic();
                }
            });
        }else{
            let downImgUrl = this.data.downImgUrl;
            if (downImgUrl == "") {
                wx.showModal({
                    title: '提示',
                    content: '二维码合成图还未准备好\n稍后再试一试',
                    showCancel: false
                })
            } else {
                wx.saveImageToPhotosAlbum({
                    filePath: downImgUrl,
                    success: function (res) {
                        console.log(res);
                        wx.showModal({
                            title: '提示',
                            content: '卡片保存成功，分享给更多好友吧！',
                            showCancel: false
                        })
                    },
                    fail: function (res) {
                        console.log(res);
                        wx.showModal({
                            title: '提示',
                            content: '未授权保存到相册，如需保存，请重新编辑你的祝福',
                            showCancel: false
                        })
                    }
                })
            }
        }
    },
    //合成二维码图片
    drawCodePic: function (scale){
        var context = wx.createCanvasContext('codePic');
        // context.scale(scale, scale);
        //先来背景

        context.drawImage('../../../../images/activity/cny2017/bg.jpg', 0, 0, 750, 1331);

        //logo
        context.drawImage('../../../../images/activity/cny2017/logo.png', 467, 0, 184, 85);

        //头像
        var avatarTemp = this.data.avatarTemp;
        var avatarPos = {
            x: 750/2,
            y: 200
        };
        var avatarRadius = 60;
        var avatarSize = avatarRadius * 2;
        if (avatarTemp != "") {
            context.save();
            context.beginPath();
            context.arc(avatarPos.x, avatarPos.y, avatarRadius, 0, 2 * Math.PI);
            context.clip();
            context.drawImage(avatarTemp, avatarPos.x - avatarRadius, avatarPos.y - avatarRadius, avatarSize, avatarSize);
            context.setLineWidth(5);
            context.setStrokeStyle('#f3cf9d');
            context.stroke()
            context.restore();
        }
        //祝福文字
        let userInfo = wx.getStorageSync('userInfo');
        let userWord = "";
        context.setFillStyle("#f3cf9d");
        context.setTextAlign('center');
        context.setTextBaseline('middel');
        context.setFontSize(24);
        if (this.data.shareRecord != ""){
            userWord = userInfo.nickName + "有些重要的话，今天一定要讲给你听！";
        }else{
            userWord = "千言万语不如一份新年礼，送你一份小惊喜！";
        }
        context.fillText(userWord, 750 / 2, avatarPos.y + avatarRadius + 40);

        //卡片
        context.drawImage('../../../../images/activity/cny2017/code_card_bottom.png', 22, 470, 706, 857);
        context.rotate(-10 * Math.PI / 180)
        //之前合成的图片
        context.drawImage(this.data.drawImgUrl, -70, 420, 650, 508);
        //旋转过了记得还原
        context.rotate(10 * Math.PI / 180);
        context.drawImage('../../../../images/activity/cny2017/code_card_top.png', 22, 470, 706, 857);
        //绘制一下二维码 又是圆的
        var codePos = {
            x: 750 / 2,
            y: 915
        };
        var codeRadius = 147;
        var codeSize = codeRadius * 2;
        context.save();
        context.beginPath();
        context.arc(codePos.x, codePos.y, codeRadius, 0, 2 * Math.PI);
        context.clip();
        context.drawImage(this.data.appCodeUrl, codePos.x - codeRadius, codePos.y - codeRadius, codeSize, codeSize);
        context.restore();
        wx.drawCanvas({
            canvasId: "codePic",
            actions: context.getActions()
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let viewData = wx.getStorageSync('cny2017Result');
        let avatarData = wx.getStorageSync('cny2017Avatar');
        console.log(viewData);
        // console.log(avatarData);
        this.setData({
            viewData: JSON.parse(viewData),
            avatarTemp: avatarData
        });
        wx.hideShareMenu();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        var page = this;
        wx.showLoading({
            title: '祝福卡生成中',
            mask:true
        })
        wx.getSystemInfo({
            success: function (res) {
                var scale = res.windowWidth / 750;
                page.setData({
                    cavansWidth: divW,
                    cavansHeight: divH,
                    canvasCodeWidth: codeDivW,
                    canvasCodeHeight: codeDivH,
                    scale: scale
                });
                page.drawCard(scale);
                setTimeout(function(){
                    page.createImg();
                },500);
            }
        })
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
        let imageUrl = "";
        let shareImgName = this.data.shareImgName;
        let title = "千言万语不如一份新年礼，送你一份小惊喜！";
        console.log("shareImgName:" + shareImgName);
        if (shareImgName == "" || shareImgName == undefined || shareImgName == null){
            // return null;
        }else{
            let imageObj = api.uploadImgPath(shareImgName);
            imageUrl = imageObj.small;
        }
        if(this.data.shareRecord != ""){
            title = "有些重要的话，今天一定要讲给你听！";
        }
        console.log(imageUrl);
        let u = '/pages/activity/cny2017/friend/friend?sid=' + this.data.shareid;
        console.log(u);
        return {
            title: title,
            path: u,
            imageUrl: imageUrl,
            success: function (res) {
                // 转发成功
                wx.navigateTo({
                    url: '../rank/rank',
                })
                console.log(res);
            },
            fail: function (res) {
                // 转发失败
            }
        }     
    }
})