function t(t, a) {
    if (!(t instanceof a)) throw new TypeError("Cannot call a class as a function");
}

var a = function() {
    function t(t, a) {
        for (var e = 0; e < a.length; e++) {
            var i = a[e];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), 
            Object.defineProperty(t, i.key, i);
        }
    }
    return function(a, e, i) {
        return e && t(a.prototype, e), i && t(a, i), a;
    };
}(), e = function() {
    function e(a) {
        t(this, e), this.ak = a.ak;
    }
    return a(e, [ {
        key: "getWXLocation",
        value: function(t, a, e, i) {
            t = t || "gcj02", a = a || function() {}, e = e || function() {}, i = i || function() {}, 
            wx.getLocation({
                type: t,
                success: a,
                fail: e,
                complete: i
            });
        }
    }, {
        key: "search",
        value: function(t) {
            var a = this, e = {
                query: (t = t || {}).query || "生活服务$美食&酒店",
                scope: t.scope || 1,
                filter: t.filter || "",
                coord_type: t.coord_type || 2,
                page_size: t.page_size || 10,
                page_num: t.page_num || 0,
                output: t.output || "json",
                ak: a.ak,
                sn: t.sn || "",
                timestamp: t.timestamp || "",
                radius: t.radius || 2e3,
                ret_coordtype: "gcj02ll"
            }, i = {
                iconPath: t.iconPath,
                iconTapPath: t.iconTapPath,
                width: t.width,
                height: t.height,
                alpha: t.alpha || 1,
                success: t.success || function() {},
                fail: t.fail || function() {}
            }, o = function(t) {
                e.location = t.latitude + "," + t.longitude, wx.request({
                    url: "https://api.map.baidu.com/place/v2/search",
                    data: e,
                    header: {
                        "content-type": "application/json"
                    },
                    method: "GET",
                    success: function(t) {
                        var a = t.data;
                        if (0 === a.status) {
                            var e = a.results, o = {};
                            o.originalData = a, o.wxMarkerData = [];
                            for (var n = 0; n < e.length; n++) o.wxMarkerData[n] = {
                                id: n,
                                latitude: e[n].location.lat,
                                longitude: e[n].location.lng,
                                title: e[n].name,
                                iconPath: i.iconPath,
                                iconTapPath: i.iconTapPath,
                                address: e[n].address,
                                telephone: e[n].telephone,
                                alpha: i.alpha,
                                width: i.width,
                                height: i.height
                            };
                            i.success(o);
                        } else i.fail({
                            errMsg: a.message,
                            statusCode: a.status
                        });
                    },
                    fail: function(t) {
                        i.fail(t);
                    }
                });
            };
            if (t.location) {
                var n = t.location.split(",")[1];
                o({
                    errMsg: "input location",
                    latitude: t.location.split(",")[0],
                    longitude: n
                });
            } else a.getWXLocation("gcj02", o, function(t) {
                i.fail(t);
            }, function(t) {});
        }
    }, {
        key: "suggestion",
        value: function(t) {
            var a = this, e = {
                query: (t = t || {}).query || "",
                region: t.region || "全国",
                city_limit: t.city_limit || !1,
                output: t.output || "json",
                ak: a.ak,
                sn: t.sn || "",
                timestamp: t.timestamp || "",
                ret_coordtype: "gcj02ll"
            }, i = {
                success: t.success || function() {},
                fail: t.fail || function() {}
            };
            wx.request({
                url: "https://api.map.baidu.com/place/v2/suggestion",
                data: e,
                header: {
                    "content-type": "application/json"
                },
                method: "GET",
                success: function(t) {
                    var a = t.data;
                    0 === a.status ? i.success(a) : i.fail({
                        errMsg: a.message,
                        statusCode: a.status
                    });
                },
                fail: function(t) {
                    i.fail(t);
                }
            });
        }
    }, {
        key: "regeocoding",
        value: function(t) {
            var a = this, e = {
                coordtype: (t = t || {}).coordtype || "gcj02ll",
                pois: t.pois || 0,
                output: t.output || "json",
                ak: a.ak,
                sn: t.sn || "",
                timestamp: t.timestamp || "",
                ret_coordtype: "gcj02ll"
            }, i = {
                iconPath: t.iconPath,
                iconTapPath: t.iconTapPath,
                width: t.width,
                height: t.height,
                alpha: t.alpha || 1,
                success: t.success || function() {},
                fail: t.fail || function() {}
            }, o = function(t) {
                e.location = t.latitude + "," + t.longitude, wx.request({
                    url: "https://api.map.baidu.com/geocoder/v2/",
                    data: e,
                    header: {
                        "content-type": "application/json"
                    },
                    method: "GET",
                    success: function(a) {
                        var e = a.data;
                        if (0 === e.status) {
                            var o = e.result, n = {};
                            n.originalData = e, n.wxMarkerData = [], n.wxMarkerData[0] = {
                                id: 0,
                                latitude: t.latitude,
                                longitude: t.longitude,
                                address: o.formatted_address,
                                iconPath: i.iconPath,
                                iconTapPath: i.iconTapPath,
                                desc: o.sematic_description,
                                business: o.business,
                                alpha: i.alpha,
                                width: i.width,
                                height: i.height
                            }, i.success(n);
                        } else i.fail({
                            errMsg: e.message,
                            statusCode: e.status
                        });
                    },
                    fail: function(t) {
                        i.fail(t);
                    }
                });
            };
            if (t.location) {
                var n = t.location.split(",")[1];
                o({
                    errMsg: "input location",
                    latitude: t.location.split(",")[0],
                    longitude: n
                });
            } else a.getWXLocation("gcj02", o, function(t) {
                i.fail(t);
            }, function(t) {});
        }
    }, {
        key: "weather",
        value: function(t) {
            var a = this, e = {
                coord_type: (t = t || {}).coord_type || "gcj02",
                output: t.output || "json",
                ak: a.ak,
                sn: t.sn || "",
                timestamp: t.timestamp || ""
            }, i = {
                success: t.success || function() {},
                fail: t.fail || function() {}
            }, o = function(t) {
                e.location = t.longitude + "," + t.latitude, wx.request({
                    url: "https://api.map.baidu.com/telematics/v3/weather",
                    data: e,
                    header: {
                        "content-type": "application/json"
                    },
                    method: "GET",
                    success: function(t) {
                        var a = t.data;
                        if (0 === a.error && "success" === a.status) {
                            var e = a.results;
                            console.log("weatherArr", e);
                            var o = e[0].weather_data[0].date, n = o.indexOf("："), s = o.indexOf("℃"), c = o.substring(n + 1, s), u = e[0].weather_data[0].dayPictureUrl, r = e[0].weather_data[0].weather, l = e[0].weather_data[0].wind, p = e[0].pm25;
                            i.success({
                                currentTemperature: c,
                                weather: r,
                                weatherIcon: u,
                                wind: l,
                                pm25: p
                            });
                        } else i.fail({
                            errMsg: a.message,
                            statusCode: a.status
                        });
                    },
                    fail: function(t) {
                        i.fail(t);
                    }
                });
            };
            if (t.location) {
                var n = t.location.split(",")[0];
                o({
                    errMsg: "input location",
                    latitude: t.location.split(",")[1],
                    longitude: n
                });
            } else a.getWXLocation("gcj02", o, function(t) {
                i.fail(t);
            }, function(t) {});
        }
    } ]), e;
}();

module.exports.BMapWX = e;