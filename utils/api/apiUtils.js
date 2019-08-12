function e(e, t) {
    var a = "";
    if (e && t) {
        for (var r in e) a = a + r + "=" + e[r] + "&";
        return a = a.substring(0, a.length - 1), t + a;
    }
    return null;
}

var t = require("hefeng.js"), a = require("API.js"), r = require("baidu.js"), n = require("../../libs/bmap-wx.js"), o = "imageUrlListKey", s = "imageUrlListDateKey";

module.exports = {
    getCurrentWeather: function(o, s, c, i, u, l) {
        var g = {
            location: s + "," + o,
            key: t.AUTH_KEY
        };
        var g2 = {
            location: s + "," + o,
            key: t.AUTH_KEY2
        };
        new n.BMapWX({
            ak: r.AK
        }).weather({
            location: s + "," + o,
            success: function(e) {
                console.log("实况天气（百度）", e), c(e);
            }
        });
        var d = e(g, a.HOURLY_WEATHER);
        wx.request({
            url: d,
            success: function(e) {
                console.log(e.data), i(e.data);
            }
        });
        var f = e(g, a.FORECAST_WEATHER);
        wx.request({
            url: f,
            success: function(e) {
                console.log(e.data), u(e.data);
            }
        });
        //iifeStyle
        var w = e(g2, a.LIFE_STYLE);

        wx.request({
            url: w,
            success: function(e) {
                console.log(e.data), l(e.data);
            }
        });
    },
    getDetailAddress: function(e) {
        new n.BMapWX({
            ak: r.AK
        }).regeocoding({
            fail: function(e) {
                console.log(e);
            },
            success: function(t) {
                console.log(t);
                var a = {
                    displayName: t.wxMarkerData[0].address,
                    latitude: t.wxMarkerData[0].latitude,
                    longitude: t.wxMarkerData[0].longitude
                };
                e(a);
            }
        });
    },
    getImageUrlList: function(e) {
        try {
            var t = wx.getStorageSync(o);
            t && e(t);
            var a = wx.getStorageSync(s);
            if (console.log("当前的日期", a), a == new Date().toLocaleDateString()) return;
        } catch (e) {}
        var r = "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&nc=" + new Date().getTime() + "&pid=hp";
        wx.request({
            url: r,
            success: function(t) {
                var a = [];
                t.data.images.forEach(function(e) {
                    a.push("https://cn.bing.com" + e.url);
                }), e(a), wx.setStorage({
                    key: o,
                    data: a
                }), wx.setStorage({
                    key: s,
                    data: new Date().toLocaleDateString()
                });
            }
        });
    }
};