const SERVER_PATH = "https://oppowx.beats-digital.com";
const CDN_PATH = "https://upload.cdn.be-xx.com/";
const SERVER_API = SERVER_PATH + "/handler/proc.ashx";
//小于这个时间活动会关闭一些功能
const END_TIME = new Date("2018/02/09 23:59:59").getTime();
console.log(END_TIME);
var api = {
    isOs: true,
    //用户是否可用 false就是非法的用户
    userFail: true,
    cnyUserInfo: null,
    //是否拿到了地理位置 这个参数废除了
    hasLocal: false,
    //凡是按钮都延迟2000毫秒
    clickTime: 2000,

    //检测用户是否非法
    checkUser: function(){
        if (!api.userFail){
            wx.showModal({
                title: '提示',
                content: '服务器繁忙',
                showCancel: false
            })
        }
        return api.userFail;
    },

    callUA: function(){
        // api.send('http://oppowx.beats-digital.com/handler/test.ashx?mod=UA');
        let url = "https://oppowx.beats-digital.com/handler/test.ashx?mod=UA";
        let data = {};
        api.wxSend(url, data, function(dd){
            console.log(dd);
        });
    },

    isEnd: function(){
        var nowTime = new Date().getTime();
        var leftTime = nowTime - END_TIME;
        return (leftTime >= 0);
    },
    //检测是否结束了
    checkEnd: function(page){
        page.setData({
            isEnd: api.isEnd()
        });
    },

    //头像地址
    avatarPath: function(id){
        return SERVER_PATH + '/upload/tmp/'+id+'.jpg';
    },
    //上传的图片地址
    uploadImgPath: function(id){
        return {
            big: CDN_PATH + id,
            small: CDN_PATH + id
        };
    },
    cdnPath: function(id){
        return CDN_PATH + id;
    },
    //录音地址
    recordPath: function(value){
        return SERVER_PATH + value;
    },
    wxSend: function(url, data, cb){
        wx.request({
            url: url, //仅为示例，并非真实的接口地址
            data: data,
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                // console.log("success", res.data)
                cb(res.data);
            },
            fail: function (res) {
                // console.log("fail", res)
                cb(null);
            }
        })
    },
    initUser: function (openid, nickname, headimg, location, gender, fromid, cb) {
        console.log('initUser');
        console.log('openid:' + openid);
        console.log('nickname:' + nickname);
        console.log('headimg:' + headimg);
        console.log('location:' + location);
        console.log('gender:' + gender);
        console.log('fromid:' + fromid);
        // console.log(openid, nickname, headimg, location, gender, fromid);
        let url = SERVER_API + "?mod=Init";
        let data = {
            openid: openid,
            nickname: nickname,
            headimg: headimg,
            location: location,
            gender: gender,
            fromid: fromid
        };
        api.wxSend(url, data, (userData) => {
            if (userData == 405 || userData == undefined || userData == 'undefined'){
                api.userFail = false;
                api.checkUser();
            }else{
                api.cnyUserInfo = userData;
                cb();
                console.log(api.cnyUserInfo);
            }
        });
    },
    //同意推送
    start: function(openid, ischeck, tempid, cb){
        let url = SERVER_API + "?mod=Start";
        let data = {
            openid: openid,
            ischeck: ischeck,
            tempid: tempid
        };
        api.wxSend(url, data, cb);
    },
    //获取是否中奖
    getState: function (openid, cb){
        let url = SERVER_API + "?mod=GetState";
        let data = {
            openid: openid
        };
        api.wxSend(url, data, cb);
    },

    imgToBase: function (openid, cb){
        let url = SERVER_API + "?mod=Img64";
        let data = {
            openid: openid
        };
        api.wxSend(url, data, cb);
    },
    /**
     * 上传录音
     * tempFilePath 录音的文件地址
     * */    
    uploadRecord: function (openid, tempFilePath, cb){
        let url = SERVER_API + "?mod=SaveRec";
        wx.uploadFile({
            url: url, //仅为示例，非真实的接口地址
            filePath: tempFilePath,
            name: 'file',
            formData: {
                'openid': openid
            },
            success: function (res) {
                var data = res.data;
                //do something
                cb(data);
            },
            fail: function(){
                cb(null);
            }
        })
    },
    /**
     * 上传图片
     */
    uploadImg: function (openid, tempFilePath, cb){
        let url = SERVER_API + "?mod=SaveImg";
        wx.uploadFile({
            url: url, //仅为示例，非真实的接口地址
            filePath: tempFilePath,
            name: 'file', 
            formData: {
                'openid': openid
            },
            success: function (res) {
                var data = res.data;
                console.log("uploadImg success", res);
                cb(data);
                //do something
            },
            fail: function (res) {
                console.log("uploadImg success", res);
            }
        })
    },
    //抽奖接口
    GetKey: function(openid, area, cb){
        let url = SERVER_API + "?mod=GetKey";
        let data = {
            openid: openid,
            area: area
        };
        api.wxSend(url, data, cb);
        
    },
    Adlist: function(fromOpenid, cb){
        let url = SERVER_API + "?mod=Adlist";
        let data = {
            openid: fromOpenid
        };
        api.wxSend(url, data, cb);
    },
    topList: function (openid, cb){
        let url = SERVER_API + "?mod=TopList";
        let data = {
            openid: openid
        };
        api.wxSend(url, data, cb);
    },
    QRDown: function(page, scene, width, cb){
        let url = SERVER_API + "?mod=QRDown";
        let data = {
            scene: scene,
            page: page,
            width: width
        };
        api.wxSend(url, data, cb);
    },
    SetShare: function (openid, nickName, shareRecord, shareImgName, cb){
        let url = SERVER_API + "?mod=SetShare";
        let data = {
            openid: openid,
            nickname: nickName,
            shareRecord: shareRecord,
            shareImgName: shareImgName
        };
        api.wxSend(url, data, cb);
    },
    GetShare: function (id, cb) {
        let url = SERVER_API + "?mod=GetShare";
        let data = {
            shareid: id
        };
        api.wxSend(url, data, cb);
    },
    //保存用户中奖信息
    saveInfo: function (openid, name, tel, address, cb){
        let url = SERVER_API + "?mod=SaveMsg";
        let data = {
            openid: openid,
            name: name,
            phone: tel,
            address: address,
        };
        api.wxSend(url, data, cb);
    },
    //检测是否填过信息了
    checkMsg: function (openid, cb) {
        let url = SERVER_API + "?mod=CheckMsg";
        let data = {
            openid: openid
        };
        api.wxSend(url, data, cb);
    }

    

};

module.exports = api;