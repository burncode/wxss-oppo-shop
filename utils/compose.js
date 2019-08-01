module.exports = function () {
  var ret = {};
  var key = void 0;
  var obj = void 0;
  var len = arguments.length;
  for (var i = len; i >= 0; i--) {
    obj = arguments[i];
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        ret[key] = obj[key]
      }
    }
  }
  return ret
};