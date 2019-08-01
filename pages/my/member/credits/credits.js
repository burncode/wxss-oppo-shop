// pages/my/member/credits/credits.js
var user = require('../../../../utils/user.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    linearGradient: {
      'commoncard': "linear-gradient(270deg, #2dc8a9, #2ec2c3)",
      'silvercard': "linear-gradient(270deg, #35AFD2, #529BDF)",
      'goldcard': "linear-gradient(270deg, #D2A33B, #DF934A)",
      'diamondcard': "linear-gradient(270deg, #7270E1, #9F73E9)",
    },
    pageNum:1,
    maxSize:20,
    timeIndex:1,
    rows:[],
    total:0,
    nothing:false
  },

  subMonth: function (date, n) { //获取n月前日期
    date.setMonth(date.getMonth() - n);
    return date;
  },

  sortObj: function (obj) { //倒序对象返回数组
    var arr = [];
    for (var i in obj) {
      arr.push(obj[i]);
    };
    arr.reverse();
    return arr;
  },

  getList: function(totalType){
    var page = this, startTime, endTime,
      timeIndex = page.data.timeIndex,
      path = page.data.url;
    if (timeIndex == 1){
      startTime = user.util.formatTime(page.subMonth(new Date(), 3));
      endTime = user.util.formatTime(new Date());
    }else{
      startTime = user.util.formatTime(page.subMonth(new Date(), 3*timeIndex));
      endTime = user.util.formatTime(page.subMonth(new Date(), 3*(timeIndex - 1)));
      if (page.data.action == 1) {  //是积分才有创建时间
        let createTimestamp = page.data.createTime;  //积分或成长值的创建时间
        createTimestamp = new Date(Date.parse(createTimestamp.replace(/-/g, "/")));
        createTimestamp = createTimestamp.getTime();
        createTimestamp = new Date(createTimestamp)
        createTimestamp = page.subMonth(createTimestamp, 3).getTime(); //创建时间推前三个月
        let startTimestamp = page.subMonth(new Date(), 3 * timeIndex).getTime(); //请求开始时间
        if (startTimestamp < createTimestamp) { //判断请求的开始时间是否小于创建时间,如果是则表示无更多内容加载!!
          page.setData({
            nothing:true
          })
          return;
        }
      }
    }  
    user.get(path, {
      ssoId: wx.getStorageSync('member').ssoId,
      pageNum: page.data.pageNum,
      maxSize: page.data.maxSize,
      startTime: startTime,
      endTime: endTime
    }, function (data) {
      let obj = data.data.result.rows;
      let rows = page.sortObj(obj); //倒序
      let arr = page.data.rows;
      let monthArr = []; 
      if (arr.length != 0){
        arr.forEach(function (item, index) {
          monthArr.push(item.month)
          for (let i = 0; i < rows.length; i++) {
            if(page.data.action == 0){ //action为0 是成长值
              if (item.month == rows[i].month) {
                for (let j = 0; j < rows[i].records.length; j++) {
                  item.records.push(rows[i].records[j])
                }
              }
            } else { //action为0 是积分值
              if (item.month == rows[i].month) {
                for (let j = 0; j < rows[i].creditsList.length; j++) {
                  item.creditsList.push(rows[i].creditsList[j])
                }
              }
            }
          }
        })
        rows.forEach(function (item, index) {
          if (monthArr.indexOf(item.month) < 0) {
            arr.push(item)
          }
        })
      }else{
        arr = rows
      }
      let total;
      if(totalType){ //如果
        total = page.data.total + data.data.result.total
      }else{
        total = page.data.total
      }
      if(page.data.action == 0){
        if(rows == null){
          page.setData({
            nothing:true
          })
        }
      }
      page.setData({
        amount: data.data.result.amount,
        rows: arr,
        total: total,
        createTime: data.data.result.createTime
      });
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData([{
      url: '/member/operation/expListThree.do',
      title: '成长值',
      record: 'records',
      add: 'totalGain',
      sub: 'totalConsume',
      des: 'des',
      type: options.type,
      action: options.action
    }, {
      url: '/member/operation/creditsThree.do',
      title: '积分',
      record: 'creditsList',
      add: 'addTotAmount',
      sub: 'subTotAmount',
      des: 'description',
      type: options.type,
      action: options.action
    }][options.action || 0]);
    console.log(this.data.action)
    wx.setNavigationBarTitle({
      title: '我的' + this.data.title
    });
    this.getList(true);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // user.request({
    //   url: page.data.url,
    //   data: {
    //     ssoId: wx.getStorageSync('member').ssoId,
    //     pageNum: 1,
    //     maxSize: 20,
    //     startTime: user.util.formatTime(page.subMonth(new Date(), 3)),
    //     endTime: user.util.formatTime(new Date())
    //   },
    //   success: function (res) {
    //     page.setData({
    //       amount: res.amount,
    //       rows: res.rows
    //     });
    //   }
    // });
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
    let page = this;
    if(!page.data.nothing){  //判断是否没有更多内容了!!
      let pageNum = page.data.pageNum,
        maxSize = page.data.maxSize;
      page.setData({
        pageNum: pageNum + 1,
      })
      let rows = page.data.rows;
      let limit = 0;
      rows.forEach(function (item, index) {
        if (page.data.action == 0) {
          limit = limit + item.records.length;
        } else {
          limit = limit + item.creditsList.length;
        }
      })
      if (page.data.total == limit) {
        let timeIndex = page.data.timeIndex;
        page.setData({
          timeIndex: timeIndex + 1,
          pageNum: 1,
          maxSize: 20,
        })
        this.getList(true)
      } else {
        this.getList(false)
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})