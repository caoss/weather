function e() {
    y = 1, r.setData({
        musicIcon: "../../resource/image/play.png"
    });
}

function t() {
    y = 0, r.setData({
        musicIcon: "../../resource/image/pause.png"
    });
}

function a(e) {
    function t() {
        var t = d.windowWidth, n = wx.createCanvasContext("qrCanvas"), o = f.getCurrentCityModel().displayName;
        if (n.drawImage(a, 0, 0, t, 300), n.setFillStyle("white"), n.fillRect(0, 240, t, 60), 
        n.drawImage("../../resource/image/weather_qr.jpg", 5, 243, 55, 55), n.moveTo(t / 2, 20), 
        n.setTextAlign("center"), n.setFillStyle("#333"), n.setFontSize(15), n.fillText("天气，不错哦！", t / 2, 275), 
        n.setFillStyle("white"), o && (n.setFontSize(13), n.fillText(o, t / 2, 30)), e.data.currentWeather) {
            var l = " " + e.data.currentWeather.currentTemperature + "°", r = e.data.currentWeather.weather, i = e.data.currentWeather.wind;
            l && (n.setFontSize(50), n.fillText(l, t / 2, 120)), r && (n.setFontSize(15), n.fillText(r, t / 2, 160)), 
            i && (n.setFontSize(15), n.fillText(i, t / 2, 190));
        }
        n.draw(), setTimeout(function() {
            wx.canvasToTempFilePath({
                canvasId: "qrCanvas",
                success: function(e) {
                    console.log(e), wx.hideLoading(), wx.previewImage({
                        urls: [ e.tempFilePath ]
                    });
                }
            }), e.setData({
                canvasHide: !0
            });
        }, 100);
    }
    e.setData({
        canvasHide: !1
    }), wx.showLoading({
        title: "加载中...",
        mask: !0
    });
    var a = "../../resource/image/bg1.png";
    e.data.imageUrlList ? wx.getImageInfo({
        src: e.data.imageUrlList[0],
        success: function(e) {
            a = e.path, t();
        },
        fail: function() {
            console.log("失败"), t();
        }
    }) : t();
}

function n(e) {
    var t = wx.createCanvasContext("forcastCanvas");
    console.log("forecastWeather", e);
    var a = d.windowWidth / 12, n = parseInt(e[0].tmp_max), o = parseInt(e[0].tmp_min);
    e.forEach(function(e) {
        n < parseInt(e.tmp_max) && (n = parseInt(e.tmp_max)), o > parseInt(e.tmp_min) && (o = parseInt(e.tmp_min));
    });
    for (var l = (o + n) / 2, r = n - l, i = 4; i * r > 35; ) i -= .5;
    console.log("倍数", i);
    var c = 1;
    t.beginPath(), e.forEach(function(e) {
        var n = c * a, o = 65 - (parseInt(e.tmp_max) - l) * i;
        e.maxX = n, e.maxY = o, 1 == c ? t.moveTo(n, o) : t.lineTo(n, o), t.arc(n, o, 3, 0, 2 * Math.PI), 
        c += 2;
    }), t.setStrokeStyle("#FF8C00"), t.stroke(), t.beginPath(), c = 1, e.forEach(function(e) {
        var n = c * a, o = 65 + (l - parseInt(e.tmp_min)) * i;
        e.minX = n, e.minY = o, 1 == c ? t.moveTo(n, o) : t.lineTo(n, o), t.arc(n, o, 3, 0, 2 * Math.PI), 
        c += 2;
    }), t.setStrokeStyle("#7cb5ec"), t.stroke(), console.log(e), t.setFontSize(12), 
    t.setTextAlign("center");
    for (var s = 0; s < e.length; s++) t.moveTo(e[s].maxX, 20), t.fillText(" " + e[s].tmp_max + "°", e[s].maxX, e[s].maxY - 10), 
    t.fillText(" " + e[s].tmp_min + "°", e[s].minX, e[s].minY + 20);
    t.draw();
}

function o(e) {
    r.setData({
        imageUrlList: e
    });
}

function l() {
    var e = u.Object.extend("music");
    new u.Query(e).first({
        success: function(e) {
            r.setData({
                musicShow: !0
            }), m = e.attributes.musicUrl;
        },
        error: function(e) {
            console.log("查询失败: " + e.code + " " + e.message);
        }
    });
}

var r, i = require("../../utils/util.js"), c = require("../../utils/api/apiUtils.js"), s = require("../../component/toast/toast.js"), u = require("../../libs/bmob/bmob.js"), f = require("../../utils/currentCityManager.js"), g = require("lifeStyleUtil.js"), d = wx.getSystemInfoSync(), h = void 0, m = void 0, y = 0, p = wx.getBackgroundAudioManager();

p.onError(function(e) {
    console.log(e);
}), p.onPlay(function(t) {
    console.log(t), e();
}), p.onPause(function(e) {
    console.log(e), t();
}), p.onStop(function(e) {
    console.log(e), t();
}), p.onEnded(function(e) {
    console.log(e), t();
}), Page({
    data: {
        currentLocationData: {
            latitude: null,
            longitude: null,
            speed: null,
            accuracy: null
        },
        bgIcon: null,
        currentCityModel: null,
        currentWeather: null,
        hourlyWeather: null,
        forecastWeather1: null,
        forecastWeather2: null,
        fish_state:{},
        fish_state2:'2weqr',
        lifestyle: null,
        currentDate: "星期" + "日一二三四五六".charAt(new Date().getDay()),
        canvasHide: !0,
        imageUrlList: null,
        musicIcon: "../../resource/image/pause.png",
        musicShow: !1
    },
    onLoad: function(e) {
        this._getDY();
        r = this, new s.ToastPannel();
        var t = 2 * d.windowWidth, a = 2 * Math.round(d.windowHeight / 7 * 6), n = new Date().toLocaleDateString();
        h = "https://cn.bing.com/ImageResolution.aspx?w=" + t + "&h=" + a + "&t=" + n, r.setData({
            bgIcon: h
        });
        var u = f.getCurrentCityModel();

        console.log('ssss',u);
        u && (r.setData({
            currentCityModel: u
        }), c.getCurrentWeather(u.latitude, u.longitude, r.currentWeatherCallBack, r.hourlyCallBack, r.forecastCallBack, r.lifeStyleCallBack)), 
        i.getLocationMessage(r.locationCallBack), c.getImageUrlList(o), l();
    },
    musicClick: function() {
        0 == y ? p.src ? p.play() : (p.title = "要不要去钓鱼？", p.coverImgUrl = h, p.src = m) : p.pause();
    },
    onReady: function() {
        console.log("监听页面初次渲染完成");
    },
    onShow: function() {
        console.log("监听页面显示");
    },
    clickScenery: function() {
        r.data.imageUrlList && wx.previewImage({
            urls: r.data.imageUrlList
        });
    },
    bgImageLoad: function(e) {
        console.log("bgImageLoad", e);
    },
    onShareAppMessage() {

        let title = this.data.fish_state && this.data.fish_state[['brf']] ?'今天钓鱼'+this.data.fish_state.brf:"要不要去钓鱼？";
        // let title = "要不要去钓鱼？";
        return {
            title:title,
        }
    },

    
    onPullDownRefresh: function() {
        var e = f.getCurrentCityModel();
        e && (r.setData({
            currentCityModel: e
        }), c.getCurrentWeather(e.latitude, e.longitude, r.currentWeatherCallBack, r.hourlyCallBack, r.forecastCallBack, r.lifeStyleCallBack)), 
        i.getLocationMessage(r.locationCallBack), c.getImageUrlList(o), wx.stopPullDownRefresh();
    },
    detailAddressCallBack: function(e) {
        f.saveLocationModel(e);
        var t = f.getCurrentCityModel();
        (t && t.islocation || !t) && (e.islocation = !0, f.saveCityModel(e), r.setData({
            currentCityModel: e
        }));
    },
    currentWeatherCallBack: function(e) {
        r.setData({
            currentWeather: e
        });
    },
    hourlyCallBack: function(e) {
        e.HeWeather6[0].hourly.forEach(function(e) {
            e.time = e.time.substr(11);
        }), r.setData({
            hourlyWeather: e.HeWeather6[0]
        });
    },
    forecastCallBack: function(e) {
        var t = [], a = [];
        e.HeWeather6[0].daily_forecast.forEach(function(e) {
            var n = new Date(e.date), o = "周" + "日一二三四五六".charAt(n.getDay());
            n.getDay() == new Date().getDay() && (o = "今天"), e.date = e.date.substr(5);
            var l = e.date, r = e.cond_code_d, i = e.cond_code_n, c = e.wind_dir, s = e.wind_sc;
            t.push({
                optimizedDate: o,
                finalDate: l,
                cond_code_d: r
            }), a.push({
                cond_code_n: i,
                wind_dir: c,
                wind_sc: s
            });
        }), e.HeWeather6[0].daily_forecast.length > 6 && (e.HeWeather6[0].daily_forecast.pop(), 
        t.pop(), a.pop()), r.setData({
            forecastWeather1: t,
            forecastWeather2: a
        }), console.log("forecastWeather1", t), setTimeout(function() {
            n(e.HeWeather6[0].daily_forecast);
        }, 800);
    },
    lifeStyleCallBack: function(e) {
        if( e.HeWeather6[0]&& e.HeWeather6[0].lifestyle &&  e.HeWeather6[0].lifestyle[14]){
            this.setData({
                fish_state:e.HeWeather6[0].lifestyle[14]
            })
        }

        var t = null, a = null;
        e.HeWeather6[0].lifestyle.forEach(function(e) {
            var t = e.type, a = g.lifeStyleJson[t], n = g.lifeStyleJsonIcon[t];
            e.lifeIcon = n, e.lefeStyleName = a;
        }), e.HeWeather6[0].lifestyle.length >= 4 && (t = e.HeWeather6[0].lifestyle.slice(0, 4)), 
        e.HeWeather6[0].lifestyle.length >= 8 && (a = e.HeWeather6[0].lifestyle.slice(4, 8));
        var n = [];
        t && n.push(t), a && n.push(a), console.log("arrayLifeStyle", n), r.setData({
            lifestyle: n
        });
    },
    jumpCityPage: function() {
        wx.navigateTo({
            url: "../city/city"
        });
    },
    clickLifeStyle: function(e) {
        var t = e.currentTarget.dataset.index;
        this.show(t.txt);
    },
    newtodo: function() {
        wx.navigateToMiniProgram({
            appId: "wxbd548891e96001b7"
        });
    },
    _toHefg:function(){
        wx.navigateTo({
            url:"/pages/hefeng/aboutme",
        })
    },
    createPicture: function() {
        a(r);
    },
    refreshView: function(e) {
        r.setData({
            currentCityModel: e
        }), console.log("经纬度", e.latitude, e.longitude), c.getCurrentWeather(e.latitude, e.longitude, r.currentWeatherCallBack, r.hourlyCallBack, r.forecastCallBack, r.lifeStyleCallBack);
    },
    locationCallBack: function(e, t, a) {
        var n = f.getCurrentCityModel();
        e ? ((n && n.islocation || !n) && (console.log("经纬度", t, a), c.getCurrentWeather(t, a, r.currentWeatherCallBack, r.hourlyCallBack, r.forecastCallBack, r.lifeStyleCallBack)), 
        c.getDetailAddress(r.detailAddressCallBack)) : wx.getSetting({
            success: function(e) {
                console.log(e.authSetting), e.authSetting["scope.userLocation"] ? (console.log("用户有定位权限"), 
                r.configDefaultData(n)) : wx.showModal({
                    title: "提示",
                    content: "亲，定位失败了，要去设置定位权限吗？",
                    success: function(e) {
                        e.confirm ? wx.openSetting({
                            success: function(e) {
                                console.log(e.authSetting), e.authSetting["scope.userLocation"] ? (console.log("用户设置了定位"), 
                                i.getLocationMessage(r.locationCallBack)) : r.configDefaultData(n);
                            }
                        }) : e.cancel && (console.log("用户点击取消"), r.configDefaultData(n));
                    }
                });
            }
        });
    },
    configDefaultData: function(e) {
        var t = null;
        e ? t = e : (t = f.currentDefaultCity, f.saveCityModel(t), wx.showToast({
            title: "默认定位上海"
        })), r.setData({
            currentCityModel: t
        }), c.getCurrentWeather(t.latitude, t.longitude, r.currentWeatherCallBack, r.hourlyCallBack, r.forecastCallBack, r.lifeStyleCallBack);
    },
    clickMe: function() {
        wx.navigateTo({
            url: "../aboutme/aboutme"
        });
    },
    feedback: function() {
        wx.navigateTo({
            url: "../feedback/feedback"
        });
    },

    _getDY(){
        const defaultHeader = {
            Accept: '*/*',
            'Content-Type': 'application/json;charset=UTF-8',
        };
        wx.request({
            url: 'https://widget-api.heweather.net/s6/plugin/h5?key=fa9116118ec3489bb847aee6573e8404&location=CN101190404&lang=cn',
            header: defaultHeader,
            success: (res) => {
                console.log('resssss',res);
            },
            fail: (err) => {
            }
        });
    }
});