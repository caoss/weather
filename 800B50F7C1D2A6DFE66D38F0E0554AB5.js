function e(e, r, o) {
    var a = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {
        "content-type": "application/json"
    }, c = {};
    if (-1 != s.indexOf(r)) {
        var u = wx.getStorageSync("userToken");
        u && (c = u);
    } else try {
        var i = wx.getStorageSync("userToken");
        i && (c = i);
    } catch (e) {
        c = {};
    }
    var p = t({}, o, c, {
        appversion: "1.0",
        systype: "xcx",
        appname: n
    });
    return new Promise(function(t, n) {
        var s = {}, o = p;
        wx.request({
            url: r,
            method: e,
            data: o,
            header: a,
            success: function(e) {
                return s.success = e.data;
            },
            fail: function(e) {
                return s.fail = e;
            },
            complete: function() {
                s.success ? t(s.success) : n(s.fail);
            }
        });
    });
}

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var t = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t];
        for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
};

exports.request = e;

var r = exports.API_ROOT = "https://wx.yijianqushuiyin.com", n = exports.APP_NAME = "xcx-shuiyin", s = [ r + "/api/User/xcxLogin", r + "/api/banner" ];

exports.get = function(t, r, n) {
    return e("GET", t, r, n);
}, exports.post = function(t, r, n) {
    return e("POST", t, r, n);
}, exports.put = function(t, r, n) {
    return e("PUT", t, r, n);
}, exports.del = function(t, r, n) {
    return e("DELETE", t, r, n);
};