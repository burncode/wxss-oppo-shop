var host = getApp().globalData.host;
var app = getApp();
Page({
  data: {
    praiseName: [
      {
        name: '全面屏',
        star: 'TFBOYS',
        title: '为R11s全面屏代言',
        text: [
          '空灵自由的全面屏，才配得上我自由的灵魂。',
          '大一点，更多精彩，我为全面屏R11s代言。',
          '85.8%的超高屏占比，用R11s上王者，队友都为我打cal！'
        ]
      },
      {
        name: '月牙弯',
        star: '杨幂',
        title: '为R11s月牙弯代言',
        text: [
          'R11s和我一样，追求每一处细节的极致之美！',
          '和杨幂一起，为R11s月牙弯代言！',
          '有了月牙弯，再也不怕听不见队友喊“回防高地”了！'
        ]
      },
      {
        name: '更大的电池容量',
        star: 'TFBOYS',
        title: '为R11s更大的电池容量代言',
        text: [
          '3205mAh的更大的电池容量，让精彩久一点！',
          '更大的电池容量，再也不用带充电器出门了！',
          '不多储存点电量，怎么了解随时变化的世界！'
        ]
      },
      {
        name: '后置2000万',
        star: '陈伟霆',
        title: '为R11s智选双摄代言',
        text: [
          '夜晚人像更明亮，白天人像更自然。用R11s，谁都可以成为人像摄影大师！',
          'R11s就是我会拍照的男朋友！',
          '一天有24小时，我就有24种不同的状态，当然需要R11s来全程记录啦！',
          '手残党的福音，有了R11s，摄影小白的我也可以拍出人像大片！'
        ]
      },
      {
        name: '时尚外观',
        star: '迪丽热巴',
        title: '为R11s时尚外观代言',
        text: [
          '明星潮人都在用，我当然也要马上get一台！',
          '时尚达人要360度全方位武装，手机当然要选最时尚的R11s！',
          '颜值即正义，这句话同样适用R11s！'
        ]
      },
      {
        name: '前置2000万',
        star: '李易峰',
        title: '为R11s前置AI美颜代言',
        text: [
          'R11s的AI智慧美颜，就是我的专属化妆师！',
          '想要靠脸吃饭，从拥有一部R11s开始！',
          '和爱豆用同款手机自拍，感觉自己萌萌哒！'
        ]
      },
      {
        name: '颜色',
        star: '杨幂',
        title: '为R11s时尚外观代言',
        text: [
          '年度时尚红色R11s，又一样街拍时尚单品get！',
          '手握香槟金R11s，向时尚生活干杯！',
          'R11s的颜色这么美，再也不想用手机套了！'
        ]
      },
      {
        name: '闪充',
        star: '杨洋',
        title: '为R11s闪充代言',
        text: [
          '充电5分钟，跟爱的人通话2小时！',
          '充电5分钟，我还能再上3个段位！',
          '别花时间等充电，花时间去爱！'
        ]
      },
      {
        name: '星幕屏',
        star: '周杰伦',
        title: '为R11s星幕屏代言',
        text: [
          '在屏幕上望到一片星空，这大概是最有诗意的一款手机了吧！',
          '生活不只眼前的苟且，还有握在手中的星辰大海！',
        ]
      },
      {
        name: '其他',
        star: '小欧 ',
        title: '为前后2000万OPPO R11s代言',
        text: [
          '拍照强大、外观时尚、性能强劲，选择R11s难道还缺理由吗？！',
        ]
      },
    ],
    praiseActive: 'null',
    canTypeNum: 36,
    praiseText: '',
    star: '',
    title: '',
    textareaShow: true,
    guize: false,
    poShow: 'none',
    subPraise: 'subPraise'
  },
  //显示活动规则
  showGuize: function () {
    var that = this;
    that.setData({
      errMsg: true,
      guize: true,
      textareaShow: 'none',
      poShow: 'block',
    })
  },
  //选择口碑标签
  selectPraise: function (e) {
    var index = e.currentTarget.id
    this.setData({
      praiseActive: index
    });
    var text = this.data.praiseName[index].text;
    var length = text.length;
    var pointNum = Math.floor(Math.random() * length)
    this.setData({
      praiseText: text[pointNum],
      canTypeNum: 36 - (text[pointNum].length),
    })
  },
  //文字输入提示
  praiseInput: function (e) {
    var that = this;
    var content = e.detail.value;
    var reg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig
    if (reg.test(content)) {
      content = content.replace(reg, "")
      that.setData({
        praiseText: content
      })
    } else {
      that.setData({
        canTypeNum: 36 - (content.length),
        praiseText: content
      })
    }
  },
  //生成口碑
  subPraise: function () {
    var comment = this.data.praiseText;
    var nickName = this.data.nickName;
    var tag = parseInt(this.data.praiseActive) + 1;
    var headImage = this.data.headImage;
    var imei = this.data.imei;
    var openid = this.data.openid;
    if (openid == undefined || !openid || openid == '') {
      app.verifyLogin(function () {
        var that = this;
        if (tag != '' && comment != '') {
          wx.showLoading({
            title: '正在提交~',
            // mask:true
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 8000)
          that.setData({
            subPraise: 'none'
          })
          wx.request({
            url: host + '/praisesmall/phone/PraiseMessage/saveMessage.json',
            data: {
              openid: openid,
              headImage: headImage,
              nickName: nickName,
              tag: tag,
              comment: comment,
              imei: imei
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              wx.hideLoading();
              that.setData({
                subPraise: 'subPraise'
              })
              if (res.data.status == 'true') {
                wx.redirectTo({
                  url: '/pages/warrant/receiveWarrant/receiveWarrant?tag=' + tag + '&comment=' + comment
                })
              } else if (res.data.status == 'false') {
                if (res.data.msg == '已经生成口碑') {
                  wx.redirectTo({
                    url: '/pages/warrant/receiveWarrant/receiveWarrant?tag=' + tag + '&comment=' + comment
                  })
                } else {
                  that.setData({
                    errMsg: res.data.msg
                  })
                }
              }
            },
            fail: function () {
              that.setData({
                subPraise: 'subPraise'
              })
            }
          })
        } else {
          that.setData({
            errMsg: '请选择你喜欢R11s的理由'
          })
        }
      });
    }
    var that = this;
    if (tag != '' && comment != '') {
      wx.showLoading({
        title: '正在提交~',
        // mask:true
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 8000)
      that.setData({
        subPraise: 'none'
      })
      wx.request({
        url: host + '/praisesmall/phone/PraiseMessage/saveMessage.json',
        data: {
          openid: openid,
          headImage: headImage,
          nickName: nickName,
          tag: tag,
          comment: comment,
          imei: imei
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          wx.hideLoading();
          that.setData({
            subPraise: 'subPraise'
          })
          if (res.data.status == 'true') {
            wx.redirectTo({
              url: '/pages/warrant/receiveWarrant/receiveWarrant?tag=' + tag + '&comment=' + comment
            })
          } else if (res.data.status == 'false') {
            if (res.data.msg == '已经生成口碑') {
              wx.redirectTo({
                url: '/pages/warrant/receiveWarrant/receiveWarrant?tag=' + tag + '&comment=' + comment
              })
            } else {
              that.setData({
                errMsg: res.data.msg
              })
            }
          }
        },
        fail: function () {
          that.setData({
            subPraise: 'subPraise'
          })
        }
      })
    } else {
      that.setData({
        errMsg: '请选择你喜欢R11s的理由'
      })
    }
  },
  //关闭弹框
  closeDialog: function () {
    this.setData({
      errMsg: '',
      guize: false,
      textareaShow: '',
      poShow: 'none',
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var userInfo = wx.getStorageSync('userInfo');
    var imei = wx.getStorageSync('imei');
    var openid = wx.getStorageSync('openid');

    if (openid == undefined || !openid || openid == '') {
      app.verifyLogin();
    }
    this.setData({
      nickName: userInfo.nickName,
      imei: imei,
      openid: openid,
      headImage: userInfo.avatarUrl
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})