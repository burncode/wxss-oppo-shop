// components/ad-list/ad-list.js
var adList = {
  goto: function (event) {
    let pagepath = event.currentTarget.dataset.pagepath;
    let appid = event.currentTarget.dataset.appid;
    if (pagepath == undefined && appid == undefined) return;
    if (appid != '' && appid != null){
      var page = this;
      var data = {};
      data.appId = appid;
      if (pagepath != undefined){
        data.path = pagepath
      }
      data.envVersion = 'trial';
      data.success = function(res){
        console.log('打开成功')
      }
      wx.navigateToMiniProgram(data)
    }else{
      wx.navigateTo({
        url: pagepath
      })
    }
  }
}
module.exports = adList;