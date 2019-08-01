// 拨打电话
function makePhoneCall(phoneNumber) {
  wx.makePhoneCall({
    phoneNumber: phoneNumber,
    success: function (res) {

    },
    fail: function (res) {

    },
    complete: function (res) {

    },
  })
}

// 提示消息
function showToast(title, icon, image) {
  wx.showToast({
    title: title,
    icon: icon,
    image: image,
    duration: 2000,
    mask: true,
    success: function (res) {

    },
    fail: function (res) {

    },
    complete: function (res) {

    },
  })
}

// 从本地相册选择图片或使用相机拍照
function chooseImage(count, cb) {
  wx.chooseImage({
    count: count,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {
      if (cb) {
        cb(res)
      }
    },
    fail: function (res) {

    },
    complete: function (res) {

    },
  })
}

module.exports = {
  makePhoneCall: makePhoneCall,
  showToast: showToast,
  chooseImage: chooseImage
};