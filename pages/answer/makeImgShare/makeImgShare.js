/**
 * Created by Gavin on 2018/3/18.
 */
Page({
    data: {
        canvas_width: '',
        canvas_height: '',
        loadShow:true
    },
    //获取容器宽高
    getRect: function (callbak) {
        let that = this;
        wx.createSelectorQuery().select('.share-content').boundingClientRect(function (rect) {
            rect.width   // 节点的宽度
            rect.height  // 节点的高度
            that.setData({
                canvas_width: rect.width,
                canvas_height: rect.height
            },function () {
                callbak()
            })
        }).exec();

    },
    //绘制
    drawShareImg: function (questionRightNo) {
        let that = this;
        const ctx = wx.createCanvasContext('shareBox');
        // ctx.drawImage(that.data.bgImage, 0, 0, that.data.canvas_width, that.data.canvas_height);
        ctx.drawImage('../image/bg.png', 0, 0, that.data.canvas_width, that.data.canvas_height);
        let titleFS = 45.29 / 750 * that.data.canvas_width;
        let textFS = 30.88 / 750 * that.data.canvas_width;
        if (parseInt(questionRightNo) === 4) {
            let titleLeft = 283 / 750 * that.data.canvas_width;
            let titleTop = 225 / 1066 * that.data.canvas_height;
            let textLeft = 290 / 750 * that.data.canvas_width;
            let textTop = 300 / 1066 * that.data.canvas_height;
            ctx.setFillStyle('#111111');
            ctx.setFontSize(titleFS);
            ctx.fillText('不服来战！', titleLeft, titleTop);
            ctx.setFillStyle('#111111');
            ctx.setFontSize(textFS);
            ctx.fillText('答对了4道题', textLeft, textTop);
        } else if (parseInt(questionRightNo) === 5) {
            let titleLeft = 235 / 750 * that.data.canvas_width;
            let titleTop = 225 / 1066 * that.data.canvas_height;
            let textLeft = 290 / 750 * that.data.canvas_width;
            let textTop = 300 / 1066 * that.data.canvas_height;
            ctx.setFillStyle('#111111');
            ctx.setFontSize(titleFS);
            ctx.fillText('厉害了我的哥！', titleLeft, titleTop);
            ctx.setFillStyle('#111111');
            ctx.setFontSize(textFS);
            ctx.fillText('答对了5道题', textLeft, textTop);
        } else if (parseInt(questionRightNo) === 6) {
            let titleLeft = 165 / 750 * that.data.canvas_width;
            let titleTop = 225 / 1066 * that.data.canvas_height;
            let textLeft = 270 / 750 * that.data.canvas_width;
            let textTop = 300 / 1066 * that.data.canvas_height;
            ctx.setFillStyle('#111111');
            ctx.setFontSize(titleFS);
            ctx.fillText('走路带风，谁与争锋！', titleLeft, titleTop);
            ctx.setFillStyle('#111111');
            ctx.setFontSize(textFS);
            ctx.fillText('6道题全部答对！', textLeft, textTop);
        }
        ctx.draw();
        that.setData({
            loadShow:false
        })
    },
    //下载背景图片文件
    // downLoadBg: function (cb) {
    //     let that = this;
    //     wx.downloadFile({
    //         url: 'http://opponplusgroup.oss-cn-hangzhou.aliyuncs.com/oppoAnswer/bg.png',
    //         success: function (res) {
    //             that.setData({
    //                 bgImage: res.tempFilePath
    //             });
    //             if (cb) {
    //                 cb();
    //             }
    //         }
    //     })
    // },
    //保存图片
    savePic: function () {
        wx.canvasToTempFilePath({
            canvasId: 'shareBox',
            success: function (res) {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success() {
                        wx.showToast({
                            title: '保存成功',
                            icon: 'success',
                            duration: 2000
                        })
                    }
                });
            }
        })
    },
    onLoad: function (options) {
        let that = this;
        wx.hideShareMenu();
        let questionRightNo = options.questionRightNo;
        // that.downLoadBg(function () {
        //     that.drawShareImg(questionRightNo);
        // });
        that.getRect(function () {
            that.drawShareImg(questionRightNo);
        });
    }
});