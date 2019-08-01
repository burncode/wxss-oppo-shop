let app = getApp();
let API = require('../utils/api.js');
let host = app.globalData.host;
let lotteryTimer = null;
let countdown = 60;
let settime = function (that) {
    if (countdown == 0) {
        that.setData({
            is_show: true
        });
        countdown = 60;
        return;
    } else {
        that.setData({
            is_show: false,
            last_time: countdown
        });

        countdown--;
    }
    setTimeout(function () {
        settime(that)
    }, 1000)
};
let fun_base64 = require('../utils/base64.js');
let obj_base64 = new fun_base64.Base64();
Page({
    data: {
        submitAble: true,
        progress_txt: '0', //倒计时数字默认值
        count: 0, // 设置 计数器 初始为0 环形圈的计数器
        countTimer: null, // 设置 定时器 初始为null 环形圈的计数器
        countTimeNum: null, // 设置 定时器 初始为null 数字的计数器
        countNum: 15, // 设置 计数器 初始为0 数字的计数器
        questionNumNow: 0,//当前题目序号
        questionGroup: [], //题目池
        questionNow: '',//当前题目
        questionRightNo: '',//答对题目序号
        questionErrorNo: '',//答错题目序号
        optionId: 100,//选项ID
        tabAble: 'true',//防止重复点击
        solution: '',//正确答案
        questionStatus: false,
        shareTitle: '张一山、杨紫直播带你赢手机',
        loadShow: true,//控制loading
        //弹出框数据
        dialogData: {
            status: false,
            title: '',
            text: '',
            address: '',
            dialogBtnData: [
                {
                    type: '',
                    text: ''
                },
            ]
        },
        //抽奖数据
        lottery: {
            lotteryData: [{
                icon: 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoAnswer/d-img1.png',
                name: 'OPPO R15'
            }, {
                icon: 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoAnswer/d-img2.png',
                name: '配件券'
            }, {
                icon: 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoAnswer/d-img3.png',
                name: 'wi-fi音箱sonica'
            }, {
                icon: 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoAnswer/d-img2.png',
                name: '配件券'
            }, {
                icon: 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoAnswer/d-img8.png',
                name: '自拍杆'
            }, {
                icon: 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoAnswer/d-img7.png',
                name: '谢谢参与'
            }, {
                icon: 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoAnswer/d-img2.png',
                name: '配件券'
            }, {
                icon: 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoAnswer/d-img4.png',
                name: '巴萨双肩背包'
            }],
            luckynum: 0,//当前运动到的位置，在界面渲染
            content: {
                index: 0, //当前转动到哪个位置，起点位置
                count: 0, //总共有多少个位置
                speed: 50, //初始转动速度
                cycle: 3 * 8, //转动基本次数：即至少需要转动多少次再进入抽奖环节，这里设置的是转动三次后进入抽奖环节
            },
            prize: 0,//中奖的位置
            luckyTapStatus: true,//判断现在是否可以点击
            status: false,
            title: ''
        },
        //预约数据
        appointment: {
            status: false,
            title: '预约手机参与答题',
            text: '预约成功的用户，4月1日在官网购买 OPPO R15 即可获得定制礼盒。',
            errorText: '',
            errorCode: '',
            errorPhone: '',
            phone: '',
            code: ''
        },
        //倒计时数据
        last_time: '',
        is_show: true,
        //打开类型
        helpAnswer: "helpAnswer",
        //好友帮答记录数据
        friendHelp: {
            status: false,
            icon: '',
            noRight: false,
            right: false,
            friendBtnGroup: [
                {
                    type: '',
                    id: '',
                    title: ''
                }
            ]
        },
        //中奖表单数据
        awardSubmitData: {
            name: '',
            address: '',
            phone: ''
        },
        //跳转倒计时
        hrefCountNum: ''
    },
    //绘制进度背景
    drawProgressbg: function () {
        // 使用 wx.createContext 获取绘图上下文 context
        var ctx = wx.createCanvasContext('canvasProgressbg')
        ctx.setLineWidth(4);// 设置圆环的宽度
        ctx.setStrokeStyle('#ffffff'); // 设置圆环的颜色
        ctx.setLineCap('round') // 设置圆环端点的形状
        ctx.beginPath();//开始一个新的路径
        ctx.arc(35, 35, 25, 0, 2 * Math.PI, false);
        //设置一个原点(110,110)，半径为100的圆的路径到当前路径
        ctx.stroke();//对当前路径进行描边
        ctx.draw();
    },
    //绘制环形图案
    drawCircle: function (step) {
        var context = wx.createCanvasContext('canvasProgress');
        // 设置渐变
        var gradient = context.createLinearGradient(200, 100, 100, 200);
        gradient.addColorStop("0", "#ed7534");
        gradient.addColorStop("0.5", "#e8554d");
        gradient.addColorStop("1.0", "#df2e6a");
        context.setLineWidth(10);
        context.setStrokeStyle(gradient);
        context.setLineCap('round')
        context.beginPath();
        // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
        context.arc(35, 35, 25, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
        context.stroke();
        context.draw()
    },
    //设置定时器
    countInterval: function () {
        // 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时10秒绘一圈
        let that = this;
        //题目池
        let questionGroup = this.data.questionGroup;
        //当前题目序列号
        let questionNumNow = this.data.questionNumNow;
        //当前题目
        let questionNow = this.data.questionNow;
        this.countTimer = setInterval(() => {
            if (this.data.count <= 150) {
                /* 绘制彩色圆环进度条
                 注意此处 传参 step 取值范围是0到2，
                 所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
                 */
                this.drawCircle(this.data.count / (150 / 2))
                // this.setData({
                //   progress_txt: this.data.count
                // });
                this.data.count++;
            } else {
                clearInterval(this.countTimer);
            }
        }, 100);
        this.countTimeNum = setInterval(() => {
            // 设置倒计时 定时器 每1秒执行一次，计数器count+1,数字计数器和环形计数器分开计时
            if (this.data.countNum > 0) {
                this.data.countNum--;
                this.setData({
                    progress_txt: this.data.countNum
                });
            } else {
                if (that.data.player === "helpAnswer") {
                    let userInfo = wx.getStorageSync('userInfo');
                    let openid = wx.getStorageSync('openid');
                    that.stopCircleTimer();
                    API.ajax(
                        host + '/answersmall/phone/Question/friendHelp.json',
                        {
                            openid: openid,
                            nickename: userInfo.nickName,
                            headimage: userInfo.avatarUrl,
                            questionNo: that.data.questionErrorNo,
                            userId: that.data.userId,
                            helpResult: 0
                        },
                        function (res) {
                            that.AppointmentStatus(function (res) {
                                if (res === 'true') {
                                    that.dialogShow({
                                        dialogData: {
                                            status: true,
                                            title: '回答超时！',
                                            dialogBtnData: [{type: 'common', id: 'enterAnswer', text: '我也要答题'},]
                                        }
                                    })
                                } else if (res === 'false') {
                                    that.dialogShow({
                                        dialogData: {
                                            status: true,
                                            title: '回答超时！',
                                            dialogBtnData: [{type: 'common', id: 'myAnswer', text: '查看我的答题情况'},]
                                        }
                                    })
                                }
                            });
                        }
                    );

                } else {
                    that.stopCircleTimer();
                    that.setData({
                        questionId: this.data.questionNow.question.id,
                        questionErrorNo: this.data.questionNow.index,
                        helpAnswer: 'helpAnswer'
                    });
                    API.ajax(
                        host + '/answersmall/phone/Question/sendErrorOrTimeOutInfo.json',
                        {
                            questionNo: that.data.questionNow.index,
                            userId: that.data.userId
                        },
                        function (res) {
                        }
                    );
                    if (that.data.questionNow.index >= 5) {
                        that.dialogShow({
                            dialogData: {
                                status: true,
                                title: '你已成功答对 ' + (parseInt(that.data.questionNow.index) - 1) + ' 题，\n已获得抽奖机会，是否继续\n答题？',
                                dialogBtnData: [

                                    {
                                        type: 'common',
                                        id: 'share',
                                        text: '喊好友帮你答题',
                                        class: 'friendShareElement'
                                    }, {type: 'normal', id: 'lottery', text: '抽奖'}
                                ]
                            }
                        })
                    } else {
                        that.dialogShow(
                            {
                                dialogData: {
                                    status: true,
                                    title: '回答超时！',
                                    text: '分享给好友可帮你复活，\n继续闯关抽奖！',
                                    dialogBtnData: [
                                        {
                                            type: 'common',
                                            id: 'share',
                                            text: '喊好友帮你答题',
                                            class: 'friendShareElement'
                                        },
                                    ]
                                }
                            }
                        )
                    }
                }
            }
        }, 1000);
    },


    //分享求助
    onShareAppMessage: function (res) {
        let that = this;
        if (res.target.dataset.tip !== "commonShare") {
            return {
                title: that.data.shareTitle,
                path: '/pages/answer/answerPage/answerPage?type=' + that.data.helpAnswer + '&questionId=' + that.data.questionId + '&userId=' + that.data.userId + '&questionNo=' + that.data.questionErrorNo + '&openid=' + wx.getStorageSync('openid'),
                imageUrl: 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoAnswer/share-pic.jpg',
                success: function (res) {
                    console.log('answerPage')
                }
            }
        } else {
            return {
                title: that.data.shareTitle,
                path: '/pages/answer/activityIndex/activityIndex',
                imageUrl: 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoAnswer/share-pic.jpg',
                success: function (res) {
                    console.log('activityIndex')
                }
            }
        }

    },


    //获取题目信息
    getQuestions: function (phone, cb) {
        let that = this;
        let questionNumNow = that.data.questionNumNow;
        let questionNow = that.data.questionNow;
        let solution;
        API.ajax(
            host + '/answersmall/phone/Question/beginAnswerQuestions.json',
            {
                mobile: phone,
                platform: 0
            }, function (res) {
                //给每个选项前加上字母序列
                if (cb) {
                    cb(res)
                }
                if (res.data.status === 'true' && res.data.data !== null) {
                    let optionGroup = [];
                    for (let i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].optionGroup = optionGroup;
                        let answer = obj_base64.decode(res.data.data[i].question.anser)
                        let answer_ = obj_base64.decode(answer);
                        res.data.data[i].question.anser = answer_;
                        for (let a = 0; a < 4; a++) {
                            if (res.data.data[i].question.anser === "A") {
                                res.data.data[i].question.solution = 1
                            } else if (res.data.data[i].question.anser === "B") {
                                res.data.data[i].question.solution = 2
                            } else if (res.data.data[i].question.anser === "C") {
                                res.data.data[i].question.solution = 3
                            } else if (res.data.data[i].question.anser === "D") {
                                res.data.data[i].question.solution = 4
                            }
                        }
                    }
                    //设置初始题目
                    that.setData({
                        questionGroup: res.data.data,
                        questionNow: res.data.data[questionNumNow],
                    })
                } else {
                    if (res.data.msg === '已经全部6题答完了') {
                        //显示抽奖
                        let lottery = that.data.lottery;
                        lottery.status = true;
                        lottery.title = '恭喜你答对6道题！';
                        that.setData({
                            questionStatus: false,
                            lottery: lottery,
                            dialogData: {
                                status: false
                            }
                        });
                    }
                }
            });
    },


    //选择答案
    selectOption: function (e) {
        let that = this;
        //获取当前点击按钮的序列号
        let index = e.currentTarget.dataset.index;
        //禁止点击状态
        let tabAble = that.data.tabAble;
        //获取当前题目的答案序列号
        let solution = that.data.questionGroup[that.data.questionNumNow].question.solution;
        //题目池
        let questionGroup = that.data.questionGroup;
        //当前题目序列号
        let questionNumNow = that.data.questionNumNow;
        //当前题目
        let questionNow = that.data.questionNow;
        //设置数据（选中状态）
        let userInfo = wx.getStorageSync('userInfo');
        let openid = wx.getStorageSync('openid');
        if (tabAble === 'true') {
            that.setData({
                optionId: index,
            });
            that.setData({
                tabAble: "false"
            });
            setTimeout(function () {
                //判断是否是好友帮忙答题
                if (that.data.player === "helpAnswer") {
                    that.stopCircleTimer();
                    if ((parseInt(index) + 1) == solution) {
                        //提交好友答对
                        that.setRightInfo("helpAnswer", function () {
                            that.AppointmentStatus(function (res) {
                                if (res === 'true') {
                                    that.dialogShow(
                                        {
                                            dialogData: {
                                                status: true,
                                                title: '回答正确！',
                                                dialogBtnData: [
                                                    {
                                                        type: 'common',
                                                        id: 'enterAnswer',
                                                        text: '我也要答题'
                                                    },
                                                ]
                                            }
                                        }
                                    );
                                } else if (res === 'false') {
                                    that.dialogShow(
                                        {
                                            dialogData: {
                                                status: true,
                                                title: '回答正确！',
                                                dialogBtnData: [
                                                    {
                                                        type: 'common',
                                                        id: 'myAnswer',
                                                        text: '查看我的答题情况'
                                                    },
                                                ]
                                            }
                                        }
                                    );
                                }
                            });

                            that.setData({
                                tabAble: 'true'
                            })
                        });

                    } else {
                        that.setErrorInfo("helpAnswer", function () {
                            that.AppointmentStatus(function (res) {
                                if (res === 'true') {
                                    that.dialogShow(
                                        {
                                            dialogData: {
                                                status: true,
                                                title: '回答错误！',
                                                dialogBtnData: [
                                                    {
                                                        type: 'common',
                                                        id: 'enterAnswer',
                                                        text: '我也要答题'
                                                    },
                                                ]
                                            }
                                        }
                                    );
                                } else if (res === 'false') {
                                    that.dialogShow(
                                        {
                                            dialogData: {
                                                status: true,
                                                title: '回答错误！',
                                                dialogBtnData: [
                                                    {
                                                        type: 'common',
                                                        id: 'myAnswer',
                                                        text: '查看我的答题情况'
                                                    },
                                                ]
                                            }
                                        }
                                    );
                                }
                            });
                        });
                    }
                } else {
                    //判断是否答对
                    if ((parseInt(index) + 1) == solution) {
                        //提交答对
                        that.setRightInfo('commonAnswer', function () {
                            that.setCircleTimer();
                            if (questionNow.index < 6 && questionGroup.length > 1) {
                                that.setData({
                                    questionNumNow: questionNumNow + 1,
                                    questionNow: questionGroup[questionNumNow + 1],
                                    solution: questionGroup[questionNumNow + 1].question.solution,
                                    optionId: 100,
                                    questionRightNo: questionNow.index
                                })
                            } else {
                                //显示抽奖
                                let lottery = that.data.lottery;
                                lottery.status = true;
                                lottery.title = '恭喜你答对' + (questionNow.index) + '道题！';
                                that.setData({
                                    questionStatus: false,
                                    lottery: lottery,
                                    questionRightNo: questionNow.index
                                });
                                that.stopCircleTimer();
                            }
                            that.setData({
                                tabAble: 'true'
                            })
                        });
                    } else {
                        //提交答错记录
                        that.setErrorInfo('commonAnswer', function () {
                            //停止计时器
                            that.stopCircleTimer();
                            //设置错题序列号，错误ID
                            that.setData({
                                questionId: that.data.questionNow.question.id,
                                questionErrorNo: that.data.questionNow.index,
                                helpAnswer: 'helpAnswer'
                            });

                            if (questionNow.index >= 5) {
                                that.dialogShow(
                                    {
                                        dialogData: {
                                            status: true,
                                            title: '回答错误！',
                                            text: '你已答对' + (parseInt(questionNow.index) - 1) + '题并拥有一次抽奖机会，是否找好友复活继续闯关',
                                            dialogBtnData: [

                                                {
                                                    type: 'common',
                                                    id: 'share',
                                                    text: '喊好友帮你答题',
                                                    class: 'friendShareElement'
                                                }, {
                                                    type: 'normal',
                                                    id: 'lottery',
                                                    text: '抽奖'
                                                }
                                            ]
                                        }
                                    }
                                )
                            } else {
                                that.dialogShow(
                                    {
                                        dialogData: {
                                            status: true,
                                            title: '回答错误！',
                                            text: '分享给好友可帮你复活，\n继续闯关抽奖！',
                                            dialogBtnData: [
                                                {
                                                    type: 'common',
                                                    id: 'share',
                                                    text: '喊好友帮你答题',
                                                    class: 'friendShareElement'
                                                },
                                            ]
                                        }
                                    }
                                )
                            }
                        });
                    }
                }
            }, 300)
        }

    },
    //记录答错
    setErrorInfo: function (type, cb) {
        let that = this;
        if (type === 'helpAnswer') {
            API.ajax(
                host + '/answersmall/phone/Question/friendHelp.json',
                {
                    openid: wx.getStorageSync('openid'),
                    nickename: wx.getStorageSync('userInfo').nickName,
                    headimage: wx.getStorageSync('userInfo').avatarUrl,
                    questionNo: that.data.questionErrorNo,
                    userId: that.data.userId,
                    helpResult: 0
                },
                function (res) {
                    if (res.data.status === 'true') {
                        cb()
                    } else {
                        if (res.data.msg === "这道题已经被好友帮答成功") {
                            that.AppointmentStatus(function (res) {
                                if (res === 'true') {
                                    that.dialogShow(
                                        {
                                            dialogData: {
                                                status: true,
                                                title: '已有人帮他回答正确。',
                                                dialogBtnData: [
                                                    {
                                                        type: 'common',
                                                        id: 'enterAnswer',
                                                        text: '我也要答题'
                                                    },
                                                ]
                                            }
                                        }
                                    )
                                } else if (res === 'false') {
                                    that.dialogShow(
                                        {
                                            dialogData: {
                                                status: true,
                                                title: '已有人帮他回答正确。',
                                                dialogBtnData: [
                                                    {
                                                        type: 'common',
                                                        id: 'myAnswer',
                                                        text: '查看我的答题情况'
                                                    },
                                                ]
                                            }
                                        }
                                    );
                                }
                            });
                        }
                    }
                }
            )
        } else {
            API.ajax(
                host + '/answersmall/phone/Question/sendErrorOrTimeOutInfo.json',
                {
                    questionNo: that.data.questionNow.index,
                    userId: that.data.userId
                },
                function (res) {
                    if (res.data.status === 'true') {
                        cb()
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none'
                        })
                    }
                }
            );
        }
    },
    //记录答对
    setRightInfo: function (type, cb) {
        let that = this;
        if (type === 'helpAnswer') {
            API.ajax(
                host + '/answersmall/phone/Question/friendHelp.json',
                {
                    openid: wx.getStorageSync('openid'),
                    nickename: wx.getStorageSync('userInfo').nickName,
                    headimage: wx.getStorageSync('userInfo').avatarUrl,
                    questionNo: that.data.questionErrorNo,
                    userId: that.data.userId,
                    helpResult: 1
                },
                function (res) {
                    if (res.data.status === 'true') {
                        cb()
                    } else {
                        if (res.data.msg === "这道题已经被好友帮答成功") {
                            that.AppointmentStatus(function (res) {
                                if (res === 'true') {
                                    that.dialogShow(
                                        {
                                            dialogData: {
                                                status: true,
                                                title: '已有人帮他回答正确。',
                                                dialogBtnData: [
                                                    {
                                                        type: 'common',
                                                        id: 'enterAnswer',
                                                        text: '我也要答题'
                                                    },
                                                ]
                                            }
                                        }
                                    )
                                } else if (res === 'false') {
                                    that.dialogShow(
                                        {
                                            dialogData: {
                                                status: true,
                                                title: '已有人帮他回答正确。',
                                                dialogBtnData: [
                                                    {
                                                        type: 'common',
                                                        id: 'myAnswer',
                                                        text: '查看我的答题情况'
                                                    },
                                                ]
                                            }
                                        }
                                    );
                                }
                            });
                        }
                    }
                }
            );
        } else {
            API.ajax(
                host + '/answersmall/phone/Question/updateRightInfo.json',
                {
                    questionNo: that.data.questionNow.index,
                    userId: that.data.userId
                },
                function (res) {
                    if (res.data.status === 'true') {
                        cb()
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none'
                        })
                    }
                }
            );
        }
    },

    //调用弹框方法
    dialogShow(data) {
        let that = this;
        that.setData(data);
        that.setData({
            questionStatus: false,
        })
    },
    //弹框事件处理
    dialogAction: function (e) {
        let that = this;
        let id = e.currentTarget.dataset.id;
        let lottery = that.data.lottery;
        //当前题目序列号
        let questionNumNow = that.data.questionNumNow;
        //显示抽奖组件
        if (id === 'lottery') {
            lottery.status = true;
            that.getRightInfo({id: that.data.userId}, function (right_num) {
                lottery.title = '恭喜你答对' + right_num + '道题！';
                that.setData({
                    lottery: lottery
                })
            });
            //显示答题组件
        } else if (id === 'startAnswer') {
            that.getQuestions(that.data.phone, function (res) {
                if (res.data.status === 'true' && res.data.data !== null) {
                    that.setData({
                        dialogData: {
                            status: false
                        },
                        questionStatus: true
                    });
                    that.setCircleTimer();
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }

            });

        } else if (id === "friendAnswer") {
            that.getHelpQuestion(function (res) {
                if (res.data.msg === "这道题已经被好友帮答成功") {
                    that.AppointmentStatus(function (res) {
                        if (res === 'true') {
                            that.dialogShow(
                                {
                                    dialogData: {
                                        status: true,
                                        title: '已有人帮他回答正确。',
                                        dialogBtnData: [
                                            {
                                                type: 'common',
                                                id: 'enterAnswer',
                                                text: '我也要答题'
                                            },
                                        ]
                                    }
                                }
                            )
                        } else if (res === 'false') {
                            that.dialogShow(
                                {
                                    dialogData: {
                                        status: true,
                                        title: '已有人帮他回答正确。',
                                        dialogBtnData: [
                                            {
                                                type: 'common',
                                                id: 'myAnswer',
                                                text: '查看我的答题情况'
                                            },
                                        ]
                                    }
                                }
                            );
                        }
                    });
                } else if (res.data.msg === "只能帮好友答一次") {
                    that.AppointmentStatus(function (res) {
                        if (res === 'true') {
                            that.dialogShow(
                                {
                                    dialogData: {
                                        status: true,
                                        title: '只能帮好友答一次。',
                                        dialogBtnData: [
                                            {
                                                type: 'common',
                                                id: 'enterAnswer',
                                                text: '我也要答题'
                                            },
                                        ]
                                    }
                                }
                            )
                        } else if (res === 'false') {
                            that.dialogShow(
                                {
                                    dialogData: {
                                        status: true,
                                        title: '只能帮好友答一次。',
                                        dialogBtnData: [
                                            {
                                                type: 'common',
                                                id: 'myAnswer',
                                                text: '查看我的答题情况'
                                            },
                                        ]
                                    }
                                }
                            );
                        }
                    });
                    that.dialogShow(
                        {
                            dialogData: {
                                status: true,
                                title: '只能帮好友答一次。',
                                dialogBtnData: [
                                    {
                                        type: 'common',
                                        id: 'enterAnswer',
                                        text: '我也要答题'
                                    },
                                ]
                            }
                        }
                    )
                }
            });
        } else if (id === 'enterAnswer') {
            let appointment = that.data.appointment;
            appointment.status = true;
            //清空页面进入时好友数据
            that.setData({
                player: '',
                questionId: '',
                questionErrorNo: '',
                userId: '',
                optionId: 100
            });
            that.setData({
                dialogData: {
                    status: false
                },
                appointment: appointment
            });
        } else if (id === 'myAnswer') {
            //清空好友帮忙标识
            that.setData({
                helpAnswer: '',
                player: '',
                optionId: 100
            });
            that.checkAppointment();
        } else if (id === "AwardSubmit") {
            let awardSubmitData = that.data.awardSubmitData;
            // let phoneRge = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
            let phoneRge = /^1\d{10}$/;
            if (awardSubmitData.name === '') {
                wx.showToast({
                    title: '请输入收件人姓名',
                    icon: 'none'
                })
            } else if (awardSubmitData.phone === '' || !phoneRge.test(awardSubmitData.phone)) {
                wx.showToast({
                    title: '请输入正确的手机号码',
                    icon: 'none'
                })
            } else if (awardSubmitData.address === '') {
                wx.showToast({
                    title: '请输入收件地址',
                    icon: 'none'
                })
            } else {
                API.ajax(
                    host + '/answersmall/phone/QuestionSmallAward/saveWinnerInfo.json',
                    {
                        openid: wx.getStorageSync('openid'),
                        realname: awardSubmitData.name,
                        awardmobile: awardSubmitData.phone,
                        address: awardSubmitData.address
                    },
                    function (res) {
                        if (res.data.status === 'true') {
                            that.dialogShow(
                                {
                                    dialogData: {
                                        status: true,
                                        title: '提交成功！',
                                        text: "奖品将在活动结束后的 7 个\n工作日内安排发出，请注意查收。",
                                        dialogBtnData: [
                                            {
                                                type: 'common',
                                                id: 'enterR15',
                                                text: '了解R15',
                                                class: 'enterR15'
                                            },
                                            {
                                                type: 'normal',
                                                id: 'makePicShare',
                                                text: '炫耀一下'
                                            }
                                        ]
                                    }
                                }
                            )
                        } else {
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none'
                            })
                        }
                    }
                )
            }
        } else if (id === 'makePicShare') {
            wx.navigateTo({
                url: '../../answer/makeImgShare/makeImgShare?questionRightNo=' + that.data.questionRightNo
            })
        } else if (id === 'share') {
            that.setData({
                helpAnswer: 'helpAnswer'
            })
        } else if (id === 'enterR15') {
            wx.navigateTo({
                url: '../../goods-details/goods-details?id=6368094'
            })
        }
    },
    //好友帮助弹框点击事件
    helpEnter: function (e) {
        let that = this;
        let id = e.target.id;
        if (id === "goOnAnswer") {
            that.setData({
                friendHelp: {
                    status: false
                },
            });
            that.setData({
                dialogData: {
                    status: false
                },
                questionStatus: true
            });
            that.getQuestions(that.data.phone);
            that.setCircleTimer();
        } else if (id === "lottery") {
            let lottery = that.data.lottery;
            let questionNo = that.data.questionRightNo;
            that.getRightInfo({id: that.data.userId}, function (right_num) {
                lottery.status = true;
                lottery.title = '恭喜你答对' + right_num + '道题！';
                that.setData({
                    lottery: lottery,
                    friendHelp: {
                        status: false
                    }
                })
            });
        } else if (e.currentTarget.dataset.tip === 'commonShare') {
            that.setData({
                helpAnswer: ''
            })
        } else if (id === 'share') {
            that.setData({
                helpAnswer: 'helpAnswer'
            })
        }
    },

    //设置环形倒计时
    setCircleTimer: function () {
        this.setData({
            count: 0, // 设置 计数器 初始为0 环形圈的计数器
            countTimer: null, // 设置 定时器 初始为null 环形圈的计数器
            countTimeNum: null, // 设置 定时器 初始为null 数字的计数器
            countNum: 15, // 设置 计数器 初始为0 数字的计数器,
            progress_txt: 15
        })
        clearInterval(this.countTimeNum);
        clearInterval(this.countTimer);
        this.drawProgressbg();
        this.drawCircle(0);
        this.countInterval();
    },
    //停止环形倒计时
    stopCircleTimer: function () {
        this.setData({
            count: 0, // 设置 计数器 初始为0 环形圈的计数器
            countTimer: null, // 设置 定时器 初始为null 环形圈的计数器
            countTimeNum: null, // 设置 定时器 初始为null 数字的计数器
            countNum: 15, // 设置 计数器 初始为0 数字的计数器,
        });
        clearInterval(this.countTimeNum);
        clearInterval(this.countTimer);
    },


    //抽奖
    //点击抽奖
    luckyTap: function () {
        var i = 0,
            that = this,
            luckyTapStatus = this.data.lottery.luckyTapStatus,//获取现在处于的状态
            luckynum = this.data.lottery.luckynum;//当前所在的格子
        if (luckyTapStatus === true) {
            this.data.lottery.luckyTapStatus = false;
            API.ajax(
                host + '/answersmall/phone/QuestionSmallAward/drawAward.json',
                {
                    userId: that.data.userId,
                    openid: wx.getStorageSync('openid'),
                    nickname: wx.getStorageSync('userInfo').nickName,
                    mobile: that.data.phone,
                }, function (res) {
                    let data = res.data;
                    that.setData({
                        lotteryData: data
                    });
                    if (data.status === 'true') {
                        if (data.data.award.id === 1) {
                            that.startRoll(0)
                        } else if (data.data.award.id === 2) {
                            that.startRoll(2)
                        } else if (data.data.award.id === 3) {
                            that.startRoll(7)
                        } else if (data.data.award.id === 4) {
                            that.startRoll(4)
                        } else if (data.data.award.id === 5) {
                            let prize_arr = [1, 3, 6];
                            that.startRoll(prize_arr[Math.floor(Math.random() * prize_arr.length)]);
                        }
                    } else if (data.status === 'false' && data.msg === "未中奖!") {
                        that.startRoll(5)
                    }
                }
            );
        }

    },
    //触发抽奖
    startRoll: function (prize) {
        this.data.lottery.content.count = this.data.lottery.lotteryData.length;
        this.data.luckyTapStatus = false;//设置为抽奖状态
        this.data.prize = prize;//中奖的序号
        this.roll();//运行抽奖函数
    },
    //抽奖
    roll: function () {
        var content = this.data.lottery.content,
            prize = this.data.prize,//中奖序号
            luckynum = this.data.lottery.luckynum,//当前所在的格子
            that = this;
        if (content.cycle - (content.count - prize) > 0) {//最后一轮的时间进行抽奖
            content.index++;
            content.cycle--;
            this.setData({
                luckynum: content.index % 8 //当前应该反映在界面上的位置
            });
            setTimeout(this.roll, content.speed);//继续运行抽奖函数
        } else {
            if (content.index < (content.count * 3 + prize)) {//判断是否停止

                content.index++;
                content.speed += (800 / 30);//最后一轮的速度，匀加速，最后停下时的速度为550+50
                this.data.content = content;
                this.setData({
                    luckynum: content.index % 8
                });
                setTimeout(this.roll, content.speed);
            } else {
                //完成抽奖，初始化数据
                content.index = 0;
                content.cycle = 3 * 8;
                content.speed = 50;
                this.data.luckyTapStatus = true;
                clearTimeout(lotteryTimer);
                setTimeout(function () {
                    that.checkAwardType(that.data.lotteryData)
                }, 800)
            }

        }
    },
    //判断中奖类型，1为实物奖，显示信息填写框，2为虚拟奖，显示奖券码
    checkAwardType: function (data) {
        let that = this;
        that.setData({
            lottery: {
                status: false
            }
        });
        if (data.status === 'false' && data.msg === '未中奖!') {
            that.dialogShow(
                {
                    dialogData: {
                        status: true,
                        title: '很遗憾，没有中奖。',
                        text: "新品活动期间，\n我们会有更多惊喜等着你。",
                        dialogBtnData: [
                            {
                                type: 'common',
                                id: 'enterR15',
                                text: '了解R15',
                                class: 'enterR15'
                            }
                        ]
                    }
                }
            )
        } else {
            if (data.data.award.awardType === 1) {
                if (data.data.award.id === 1 || data.data.award.id === 2) {
                    data.data.award.unit = '台'
                } else if (data.data.award.id === 3 || data.data.award.id === 4) {
                    data.data.award.unit = '个'
                }
                that.dialogShow(
                    {
                        dialogData: {
                            status: true,
                            title: '恭喜你抽中\n' + data.data.awardName + ' 一' + data.data.award.unit + '！',
                            address: true,
                            dialogBtnData: [
                                {
                                    type: 'common',
                                    id: 'AwardSubmit',
                                    text: '提交'
                                }
                            ]
                        }
                    }
                )
            } else if (data.data.award.awardType === 2) {
                that.dialogShow(
                    {
                        dialogData: {
                            status: true,
                            title: '恭喜你获得\n 10 元配件优惠码！',
                            textLeft: 'text-left',
                            text: "使用条件：满 49 元减 10 元。仅支持在官网购买配件使用。\n有效期：截止2018年5月1日0点。",
                            dialogBtnData: [
                                {
                                    type: 'common',
                                    id: 'enterR15',
                                    text: '了解R15',
                                    class: 'enterR15'
                                }, {
                                    type: 'normal',
                                    id: 'makePicShare',
                                    text: '炫耀一下'
                                }
                            ]
                        }
                    }
                )
            }
        }
    },
    //获取奖品提交表单数据
    getInputVal: function (e) {
        let that = this;
        let id = e.currentTarget.dataset.id;
        let value = e.detail.value;
        let awardSubmitData = that.data.awardSubmitData;
        if (id === 'name') {
            awardSubmitData.name = value;
        } else if (id === 'phone') {
            awardSubmitData.phone = value;
        } else if (id === 'address') {
            awardSubmitData.address = value;
        }
        that.setData({
            awardSubmitData: awardSubmitData
        });
    },

    //好友获取求助题目
    getHelpQuestion: function (cb) {
        let that = this;
        let userInfo = wx.getStorageSync('userInfo');
        let openid = wx.getStorageSync('openid');
        API.ajax(
            host + '/answersmall/phone/Question/friendGetQuestion.json',
            {
                questionId: that.data.questionId,
                openid: openid,
                questionNo: that.data.questionErrorNo,
                userId: that.data.userId
            },
            function (res) {
                let data = res.data;
                //设置当前题目
                if (data.status === 'true') {
                    let answer = obj_base64.decode(data.data.anser);
                    let answer_ = obj_base64.decode(answer);
                    data.data.anser = answer_;
                    if (data.data.anser === "A") {
                        data.data.solution = 1
                    } else if (data.data.anser === "B") {
                        data.data.solution = 2
                    } else if (data.data.anser === "C") {
                        data.data.solution = 3
                    } else if (data.data.anser === "D") {
                        data.data.solution = 4
                    }
                    that.setData({
                        questionStatus: true,
                        questionGroup: [
                            {
                                index: that.data.questionErrorNo,
                                question: data.data
                            }
                        ],
                        questionNow: {
                            index: that.data.questionErrorNo,
                            question: data.data
                        },
                        questionNumNow: 0,
                        dialogData: {
                            status: false
                        }
                    });
                    that.setCircleTimer();
                } else {
                    if (cb) {
                        cb(res);
                    }
                }
            }
        )
    },


    //号码格式检测
    checkPhoneReg: function (event) {
        let that = this;
        let phone = event.detail.value;
        // let phoneRge = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
        let phoneRge = /^1\d{10}$/;
        let appointment = that.data.appointment;
        if (phone.length == 0) {
            appointment.errorText = '请输入手机号码';
            appointment.errorPhone = 'errorStyle';
        } else if (phone.length < 11) {
            appointment.errorText = '请输入11位手机号码';
            appointment.errorPhone = 'errorStyle';
        } else if (!phoneRge.test(phone)) {
            appointment.errorText = '手机号码格式不正确';
            appointment.errorPhone = 'errorStyle';
        } else {
            appointment.errorText = '';
            appointment.errorPhone = '';
            appointment.phone = phone;
            wx.hideKeyboard()
        }
        that.setData({
            appointment: appointment
        })
    },
    checkPhoneBlur: function (event) {
        let that = this;
        let phone = event.detail.value;
        // let phoneRge = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
        let phoneRge = /^1\d{10}$/;
        if (phoneRge.test(phone)) {
            wx.hideKeyboard()
        }
    },
    //验证码格式检测
    checkCodeReg: function (event) {
        let that = this;
        let code = event.detail.value;
        let codeRge = /^\d{6}$/;
        let appointment = that.data.appointment;
        if (code.length == 0) {
            appointment.errorText = '请输入验证码';
            appointment.errorCode = 'errorStyle';
        } else if (code.length < 6) {
            appointment.errorText = '请输入6位验证码';
            appointment.errorCode = 'errorStyle';
        } else if (!codeRge.test(code)) {
            appointment.errorText = '验证码格式不正确';
            appointment.errorCode = 'errorStyle';
        } else {
            appointment.errorText = '';
            appointment.errorCode = '';
            appointment.code = code;
            wx.hideKeyboard()
        }
        that.setData({
            appointment: appointment
        })
    },
    checkCodeBlur: function (event) {
        let that = this;
        let code = event.detail.value;
        let codeRge = /^\d{6}$/;
        if (codeRge.test(code)) {
            wx.hideKeyboard()
        }
    },
    //表单倒计时
    clickVerify: function () {
        let that = this;
        // 将获取验证码按钮隐藏60s，60s后再次显示
        let appointment = that.data.appointment;
        if (appointment.phone == '') {
            appointment.errorText = '请输入正确的手机号码';
            appointment.errorPhone = 'errorStyle';
            that.setData({
                appointment: appointment
            });
        } else {
            that.getCode();
            that.setData({
                is_show: (!that.data.is_show)  //false
            });
            settime(that);
        }
    },
    //获取验证码
    getCode: function () {
        let that = this;
        wx.showToast({
            title: '正在发送请稍候',
            icon: 'loading',
            duration: 2000
        });
        setTimeout(function () {
            API.ajax(
                host + '/answersmall/phone/Index/sendMsg.json',
                {
                    mobile: that.data.appointment.phone,
                    platform: 0
                }, function (res) {
                    let data = res.data;
                    if (data.status === "true") {

                    } else {
                        wx.showToast({
                            title: data.msg,
                            icon: 'none',
                            duration: 2000
                        })
                    }
                }
            )
        }, (parseInt(3 * Math.random()) + 1) * 1000)
    },
    //预约表单提交
    appointment: function (e) {
        let that = this;
        let appointment = that.data.appointment;
        let code = appointment.code;
        let phone = appointment.phone;
        let userInfo = wx.getStorageSync('userInfo');
        let openid = wx.getStorageSync('openid');
        // let phoneRge = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
        let phoneRge = /^1\d{10}$/;
        let codeRge = /^\d{6}$/;
        if (code != '' && phone != '' && phoneRge.test(phone) && codeRge.test(code)) {
            that.setData({
                submitAble: false
            });
            API.ajax(
                host + '/answersmall/phone/Index/appointment.json',
                {
                    mobile: that.data.appointment.phone,
                    validNum: that.data.appointment.code,
                    platform: 0,
                    openid: openid,
                    nickname: userInfo.nickName,
                    headimage: userInfo.avatarUrl,
                }, function (res) {
                    that.setData({
                        submitAble: true
                    });
                    let data = res.data;
                    if (data.status === "true") {
                        that.dialogShow(
                            {
                                dialogData: {
                                    status: true,
                                    title: 'OPPO R15 预约成功，\n我们去答题！',
                                    dialogBtnData: [
                                        {
                                            type: 'common',
                                            id: 'startAnswer',
                                            text: '开始答题'
                                        }
                                    ]
                                }
                            }
                        );
                        appointment.status = false;
                        that.setData({
                            userId: data.data.id,
                            phone: data.data.mobile,
                            questionErrorNo: data.data.currentQuestionIndex,
                            appointment: appointment
                        });
                    } else {
                        if (data.msg === '验证码已经过期,请重新发送短信' || data.msg === "您已经预约过,并且已经答过题" || data.msg === "验证码不匹配,请重新发送短信") {
                            wx.showToast({
                                title: data.msg,
                                icon: 'none',
                                duration: 3000
                            });
                        } else {
                            appointment.status = false;
                            that.setData({
                                userId: data.data.id,
                                phone: data.data.mobile,
                                questionErrorNo: data.data.currentQuestionIndex,
                                appointment: appointment
                            });
                            that.checkAppointment();
                        }
                    }
                }
            )
        } else {
            if (phone == '') {
                appointment.errorText = '请输入正确的手机号码';
                appointment.errorPhone = 'errorStyle';
                that.setData({
                    appointment: appointment
                });
            } else if (code == '') {
                appointment.errorText = '验证码格式不正确';
                appointment.errorCode = 'errorStyle';
                that.setData({
                    appointment: appointment
                });
            }
        }
    },

    //是否预约
    AppointmentStatus: function (cb) {
        let that = this;
        API.ajax(
            host + '/answersmall/phone/Index/checkAppointmentOfSmall.json',
            {
                openid: wx.getStorageSync('openid')
            },
            function (res) {
                let status = res.data.status;
                if (status === 'true') {
                    that.setData({
                        hasAppointment: false,
                    });
                    if (cb) {
                        cb(status)
                    }
                } else if (status === 'false') {
                    that.setData({
                        hasAppointment: true,
                    });
                    if (cb) {
                        cb(status)
                    }
                }
            }
        )
    },
    //检验预约状态
    checkAppointment: function () {
        let that = this;
        let appointment = that.data.appointment;
        wx.getStorage({
            key: 'openid',
            success: function (openid) {
                //检验预约状态接口
                API.ajax(
                    host + '/answersmall/phone/Index/checkAppointmentOfSmall.json',
                    {
                        openid: openid.data
                    },
                    function (res) {
                        that.setData({
                            loadShow: false
                        });
                        let data = res.data.data.appointmentUser;
                        let status = res.data.status;
                        let address = res.data.data.address;
                        if (status === 'true') {
                            //显示预约状态
                            appointment.status = true;
                            that.setData({
                                appointment: appointment,
                            })
                        } else if (status === 'false') {
                            that.setData({
                                userId: res.data.data.appointmentUser.id
                            });
                            if (address === true) {
                                that.getRightInfo(data);
                                that.dialogShow(
                                    {
                                        dialogData: {
                                            status: true,
                                            title: '请填写收货地址！',
                                            address: true,
                                            dialogBtnData: [
                                                {
                                                    type: 'common',
                                                    id: 'AwardSubmit',
                                                    text: '提交'
                                                }
                                            ]
                                        }
                                    }
                                )
                            } else {
                                that.getRightInfo(data, function (questionRightNo) {
                                    //获取答错题的ID
                                    if (data.currentQuestionIndex !== null && data.answerIds !== null) {
                                        let questionId = data.answerIds.split(',')[parseInt(data.currentQuestionIndex) - 1];
                                        that.setData({
                                            questionErrorNo: data.currentQuestionIndex,
                                            questionId: questionId
                                        })

                                    }
                                    that.setData({
                                        userId: data.id,
                                        phone: data.mobile,
                                    });
                                    //获取好友帮忙记录
                                    if (data.awardStatus === 0) {

                                        if (data.answerStatus === 1 && data.answerAble === 1) {
                                            //答过题并且不可以答题
                                            //获取好友帮助数据
                                            that.checkAward(data, function () {
                                                that.getFriendHelpInfo(data);
                                            });

                                        } else if (data.answerStatus === 1 && data.answerAble === 0) {
                                            //答过题并且可以继续答题
                                            that.setData({
                                                userId: data.id,
                                                phone: data.mobile,
                                            });
                                            //获取答对记录数据
                                            that.checkAward(data, function () {
                                                that.getFriendHelpInfo(data, function (data) {
                                                    let data_1 = {
                                                        data: {
                                                            id: that.data.id
                                                        }
                                                    };
                                                    that.getRightInfo(data_1, function (res) {
                                                        if (res !== null && res !== 'noRight') {
                                                            that.setData({
                                                                helpAnswer: 'helpAnswer'
                                                            });
                                                            that.dialogShow(
                                                                {
                                                                    dialogData: {
                                                                        status: true,
                                                                        title: '已经预约，\n我们去答题！',
                                                                        dialogBtnData: [
                                                                            {
                                                                                type: 'common',
                                                                                id: 'startAnswer',
                                                                                text: '继续答题'
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            )
                                                        } else {
                                                            that.setData({
                                                                helpAnswer: 'helpAnswer'
                                                            });
                                                            that.dialogShow(
                                                                {
                                                                    dialogData: {
                                                                        status: true,
                                                                        title: '已经预约，\n我们去答题！',
                                                                        dialogBtnData: [
                                                                            {
                                                                                type: 'common',
                                                                                id: 'startAnswer',
                                                                                text: '开始答题'
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            )
                                                        }
                                                    });
                                                });

                                            });

                                        } else {
                                            that.setData({
                                                helpAnswer: 'helpAnswer'
                                            });
                                            that.dialogShow(
                                                {
                                                    dialogData: {
                                                        status: true,
                                                        title: '已经预约，\n我们去答题！',
                                                        dialogBtnData: [
                                                            {
                                                                type: 'common',
                                                                id: 'startAnswer',
                                                                text: '开始答题'
                                                            }
                                                        ]
                                                    }
                                                }
                                            )
                                        }
                                    } else {
                                        that.setData({
                                            helpAnswer: ''
                                        })
                                        //抽过奖不能再次参与答题
                                        that.setData({
                                            friendHelp: {
                                                status: true,
                                                icon: 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoAnswer/noTime.png',
                                                noRight: true,
                                                type: "end",
                                                right: false,
                                                text: '你已经参与过游戏了哦！',
                                                friendBtnGroup: [
                                                    {
                                                        type: 'common',
                                                        id: 'share',
                                                        tip: 'commonShare',
                                                        title: '分享给好友参与',
                                                        class: 'shareElement'
                                                    }
                                                ]
                                            }
                                        })
                                    }
                                });
                            }
                        }
                    }
                )
            }
        });

    },
    //进入时判断是否可以抽奖
    checkAward: function (data, cb) {
        let that = this;
        if (that.data.questionRightNo === 6 && data.answerAble === 1) {
            that.dialogShow(
                {
                    dialogData: {
                        status: true,
                        title: '你已成功答对 ' + (that.data.questionRightNo) + ' 题，\n已获得抽奖机会。',
                        dialogBtnData: [
                            {
                                type: 'common',
                                id: 'lottery',
                                text: '抽奖'
                            }
                        ]
                    }
                }
            )
        } else if (that.data.questionRightNo === 5 || that.data.questionRightNo === 4 && data.answerAble === 1) {
            that.setData({
                helpAnswer: 'helpAnswer'
            });
            that.setData({
                friendHelp: {
                    status: true,
                    icon: 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoAnswer/noHelp.png',
                    noRight: true,
                    right: false,
                    text: '暂时没有好友帮你作答哦！',
                    friendBtnGroup: [
                        {
                            type: 'common',
                            id: 'share',
                            title: '喊好友帮你答题',
                            class: 'friendShareElement'
                        }, {
                            type: 'normal',
                            id: 'lottery',
                            title: '抽奖'
                        }
                    ]
                }
            })
        } else {
            if (cb) {
                cb()
            }
        }
    },

    //获取好友帮忙记录
    getFriendHelpInfo: function (data, cb) {
        let that = this;
        if (data.currentQuestionIndex !== 0 && data.currentQuestionIndex !== null) {
            let questionErrorNo = that.data.questionErrorNo;
            let questionRightNo = parseInt(that.data.questionRightNo);
            API.ajax(
                host + '/answersmall/phone/Index/getFriendHeloInfoLog.json',
                {
                    userId: data.id,

                    questionNo: questionErrorNo,

                }, function (res_help) {
                    let helpInfo = res_help.data;
                    if (helpInfo.status === 'true') {

                        if (data.answerAble === 1 && parseInt(helpInfo.data.error) === 0) {
                            that.setData({
                                helpAnswer: 'helpAnswer'
                            });
                            if (questionRightNo >= 4) {
                                that.setData({
                                    friendHelp: {
                                        status: true,
                                        icon: 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoAnswer/noHelp.png',
                                        noRight: true,
                                        right: false,
                                        text: '暂时没有好友帮你作答哦！',
                                        friendBtnGroup: [
                                            {
                                                type: 'common',
                                                id: 'share',
                                                title: '喊好友帮你答题',
                                                class: 'friendShareElement'
                                            }, {
                                                type: 'normal',
                                                id: 'lottery',
                                                title: '抽奖'
                                            }
                                        ]
                                    }
                                })
                            } else {
                                that.setData({
                                    friendHelp: {
                                        status: true,
                                        icon: 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoAnswer/noHelp.png',
                                        noRight: true,
                                        right: false,
                                        text: '暂时没有好友帮你作答哦！',
                                        friendBtnGroup: [
                                            {
                                                type: 'common',
                                                id: 'share',
                                                title: '喊好友帮你答题',
                                                class: 'friendShareElement'
                                            }
                                        ]
                                    }
                                })
                            }
                        } else if (data.answerAble === 1 && parseInt(helpInfo.data.error) > 0) {
                            that.setData({
                                helpAnswer: 'helpAnswer'
                            });
                            that.setData({
                                friendHelp: {
                                    status: true,
                                    icon: 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoAnswer/noRight.png',
                                    noRight: true,
                                    right: false,
                                    type: "end",
                                    text: '已有' + parseInt(helpInfo.data.error) + '位好友帮忙作答，\n暂时没有出现正确答案。',
                                    friendBtnGroup: [
                                        {
                                            type: 'common',
                                            id: 'share',
                                            title: '喊好友帮你答题',
                                            class: 'friendShareElement'
                                        }
                                    ]
                                }
                            })
                        } else if (data.answerAble === 0 && parseInt(helpInfo.data.right.length) > 0) {
                            that.setData({
                                player: ''
                            });
                            if (questionRightNo < 4) {
                                if (helpInfo.data.question.anser === "A") {
                                    var solution = helpInfo.data.question.optionA;
                                } else if (helpInfo.data.question.anser === "B") {
                                    var solution = helpInfo.data.question.optionB;
                                } else if (helpInfo.data.question.anser === "C") {
                                    var solution = helpInfo.data.question.optionC;
                                } else if (helpInfo.data.question.anser === "D") {
                                    var solution = helpInfo.data.question.optionD;
                                }
                                that.setData({
                                    friendHelp: {
                                        status: true,
                                        icon: 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoAnswer/answerRight.png',
                                        noRight: false,
                                        right: true,
                                        type: 'help',
                                        option: {
                                            title: helpInfo.data.question.title,
                                            solution: solution,
                                        },
                                        title: '好友' + helpInfo.data.right[0].nickename + '帮你回答正确！',
                                        friendBtnGroup: [
                                            {
                                                type: 'common',
                                                id: 'goOnAnswer',
                                                title: '继续答题'
                                            }
                                        ]
                                    }
                                })
                            } else if (questionRightNo >= 4 && questionRightNo < 6) {
                                if (helpInfo.data.question.anser === "A") {
                                    var solution = helpInfo.data.question.optionA;
                                } else if (helpInfo.data.question.anser === "B") {
                                    var solution = helpInfo.data.question.optionB;
                                } else if (helpInfo.data.question.anser === "C") {
                                    var solution = helpInfo.data.question.optionC;
                                } else if (helpInfo.data.question.anser === "D") {
                                    var solution = helpInfo.data.question.optionD;
                                }
                                that.setData({
                                    friendHelp: {
                                        status: true,
                                        icon: 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoAnswer/answerRight.png',
                                        noRight: false,
                                        right: true,
                                        type: 'help',
                                        option: {
                                            title: helpInfo.data.question.title,
                                            solution: solution,
                                        },
                                        title: '好友' + helpInfo.data.right[0].nickename + '帮你回答正确！',
                                        friendBtnGroup: [
                                            {
                                                type: 'common',
                                                id: 'goOnAnswer',
                                                title: '继续答题'
                                            }, {
                                                type: 'normal',
                                                id: 'lottery',
                                                title: '我要抽奖'
                                            }
                                        ]
                                    }
                                })
                            } else if (questionRightNo === 6) {
                                if (helpInfo.data.question.anser === "A") {
                                    var solution = helpInfo.data.question.optionA;
                                } else if (helpInfo.data.question.anser === "B") {
                                    var solution = helpInfo.data.question.optionB;
                                } else if (helpInfo.data.question.anser === "C") {
                                    var solution = helpInfo.data.question.optionC;
                                } else if (helpInfo.data.question.anser === "D") {
                                    var solution = helpInfo.data.question.optionD;
                                }
                                that.setData({
                                    friendHelp: {
                                        status: true,
                                        icon: 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoAnswer/answerRight.png',
                                        noRight: false,
                                        right: true,
                                        type: 'help',
                                        option: {
                                            title: helpInfo.data.question.title,
                                            solution: solution,
                                        },
                                        title: '好友' + helpInfo.data.right[0].nickename + '帮你回答正确！',
                                        text: '',
                                        friendBtnGroup: [
                                            {
                                                type: 'common',
                                                id: 'lottery',
                                                title: '我要抽奖'
                                            }
                                        ]
                                    }
                                })
                            }
                        } else if (data.answerAble === 0 && parseInt(helpInfo.data.right.length) === 0) {
                            if (cb) {
                                cb()
                            }
                        }
                    }
                }
            );
        } else {
            that.getRightInfo(data, function (res) {
                if (res !== null && res !== 'noRight') {
                    that.dialogShow(
                        {
                            dialogData: {
                                status: true,
                                title: '已经预约，\n我们去答题！',
                                dialogBtnData: [
                                    {
                                        type: 'common',
                                        id: 'startAnswer',
                                        text: '继续答题'
                                    }
                                ]
                            }
                        }
                    )
                } else {
                    that.dialogShow(
                        {
                            dialogData: {
                                status: true,
                                title: '已经预约，\n我们去答题！',
                                dialogBtnData: [
                                    {
                                        type: 'common',
                                        id: 'startAnswer',
                                        text: '开始答题'
                                    }
                                ]
                            }
                        }
                    )
                }
            });
        }
    },
    //获取答对到第几题
    getRightInfo: function (data, cb) {
        let that = this;
        API.ajax(
            host + '/answersmall/phone/Question/getRightInfo.json',
            {
                userId: data.id
            }, function (res_info) {
                if (res_info.data.data !== null) {
                    that.setData({
                        questionRightNo: res_info.data.data,
                    });
                    if (cb) {
                        cb(res_info.data.data);
                    }
                } else {
                    if (cb) {
                        cb('noRight');
                    }
                }
            }
        )
    },
    //进入时的判断账号状态
    checkAccount: function (options) {
        let player = options.type;
        let questionId = options.questionId;
        let questionNo = options.questionNo;
        let userId = options.userId;
        let openid = options.openid;
        let that = this;
        let localOpenid = wx.getStorageSync('openid');
        if (player === 'helpAnswer') {
            //判断是否是自己打开分享
            if (openid === localOpenid) {
                //如果是自己打开则显示好友帮忙记录
                that.checkAppointment();
            } else {
                that.dialogShow(
                    {
                        dialogData: {
                            status: true,
                            title: '帮好友答题赢中奖机会\n你准备好了吗？',
                            text: '',
                            dialogBtnData: [
                                {
                                    type: 'common',
                                    id: 'friendAnswer',
                                    text: '开始答题'
                                },
                            ]
                        }
                    }
                );
                that.setData({
                    player: player,
                    questionId: questionId,
                    questionErrorNo: questionNo,
                    userId: userId
                })
            }
        } else {
            //检验预约状态
            that.checkAppointment()
        }
    },

    //显示活动结束
    showActivityEnd: function (status) {
        let that = this;
        that.setData({
            showActivityEnd: true
        });
        if (status === 'end') {
            let hrefCountdown = 3;
            let settime = function (that) {
                if (parseInt(hrefCountdown) === 0) {
                    hrefCountdown = 3;
                    wx.redirectTo({
                        url: '../../goods-details/goods-details?id=6368094'
                    });
                } else {
                    that.setData({
                        hrefCountNum: hrefCountdown
                    });
                    hrefCountdown--;
                    setTimeout(function () {
                        settime(that)
                    }, 1000)
                }

            };
            settime(that)
        }
    },


    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        wx.hideShareMenu();
        let that = this;
        //登录获取openid
        let localOpenid = wx.getStorageSync('openid');
        if (localOpenid !== '' && localOpenid !== null && localOpenid !== undefined) {
            that.checkAccount(options)
        } else {
            app.verifyLogin(function () {
                that.checkAccount(options)
            })
        }
        //登录获取openid
        // let localOpenid = wx.getStorageSync('openid');
        // if (localOpenid !== '' && localOpenid !== null && localOpenid !== undefined) {
        //     that.checkAccount(options)
        // } else {
        //     API.userlogin(function () {
        //         that.checkAccount(options)
        //     })
        // }

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
        this.stopCircleTimer();
    }
});