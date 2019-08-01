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

function showModal(title,content,cb){
  wx.showModal({
    title: title,
    content: content,
    showCancel: true,
    cancelText: '',
    cancelColor: '',
    confirmText: '',
    confirmColor: '',
    success: function(res) {
      if(cb){
        cb(res)
      }
    },
    fail: function(res) {
      
    },
    complete: function(res) {

    },
  })
}

function showInfo(title, content, confirmText){
  wx.showModal({
    title: title,
    content: content,
    showCancel: false,
    confirmText: confirmText,
    confirmColor: '#1cb5ff',
    success: function (res) {

    },
    fail: function (res) {

    },
    complete: function (res) {

    },
  })
}

function showLoading(title){
  wx.showLoading({
    title: title,
    mask: true,
    success: function (res) {

    },
    fail: function (res) {

    },
    complete: function (res) {

    },
  })
}

function hideLoading() {
  wx.hideLoading()
}

module.exports = {
  showToast: showToast,
  showModal: showModal,
  showInfo: showInfo,
  showLoading: showLoading,
  hideLoading: hideLoading
};