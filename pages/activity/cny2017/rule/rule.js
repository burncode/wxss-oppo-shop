// pages/activity/cny2017/rule/rule.js

let scrollBound;
let barBound;

function getRect(selector) {
    let bound = {};
    wx.createSelectorQuery().select(selector).boundingClientRect(function (rect) {
        bound.left = rect.left    // 节点的左边界坐标
        bound.right = rect.right   // 节点的右边界坐标
        bound.top = rect.top     // 节点的上边界坐标
        bound.bottom = rect.bottom  // 节点的下边界坐标
        bound.width = rect.width   // 节点的宽度
        bound.height = rect.height  // 节点的高度
    }).exec();
    return bound;
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        barTop: 0,
        barHt: 0
    },

    scroll: function (e) {
        // console.log(e);
        // let scrollHeight = e.detail.scrollHeight;
        // let scrollTop = e.detail.scrollTop;
        // // let barHt = barBound.height;//滚动条bar的高度从css里读取
        // // let barHt=200;//手动设定滚动条bar的高度
        // let barHt = (scrollBound.height / scrollHeight) * scrollBound.height;//滚动条bar高度根据显示区域占内容区域的比例显示
        // console.log('barHt:' + barHt);
        // let barTop = (scrollTop / (scrollHeight - scrollBound.height) * (scrollBound.height - barHt));
        // // console.log(scrollBound);
        // // console.log(barBound);
        // console.log('barTop:' + barTop);
        // this.setData({
        //     barTop: barTop,
        //     barHt: barHt
        // });
    },

    goBack: function () {
        wx.navigateBack();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // scrollBound = getRect('#scroll');
        // console.log(scrollBound);
        // barBound = getRect('.scrollBar .bar');
        // console.log(barBound);
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
    },

    takePhone: function () {
        console.log("call")
        wx.makePhoneCall({
            phoneNumber: "400-166-6888"
        });
    }
})

