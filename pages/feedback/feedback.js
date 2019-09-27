var t = getApp(),o = require("../../B36AB165C1D2A6DFD50CD962BB254AB5.js");

Page({
    data: {
        imgUrls: [ "../../img/home_btn_play.png" ],
        dots: !0,
        dotColor: "rgba(0, 0, 0, .3)",
        dotAcColor: "rgba(255, 255, 255, 1)",
        isPopShow: !1,
        time: "",
        url: "",
        video_url: "",
        result: !1,
        showDialog: !1,
        text: "",
        tempvideo_url: "",
        is_auth: t.globalData.is_auth,
        showPic: !1,
        showpop: !1,
        statusBarHeight: t.globalData.statusBarHeight
    },
    onLoad: function(t) {
        this.getBanner(), t.from_uid && this.getStat(t.from_uid, t.from_mission_id);
    },
    onShow: function(a) {
        var o = this;
        wx.getStorage({
            key: "userToken",
            success: function(a) {
                t.globalData.uid = a.data.uid, t.globalData.token = a.data.token;
            },
            fail: function(t) {}
        }), wx.getStorage({
            key: "isPopShow",
            success: function(t) {
                o.setData({
                    isPopShow: !1
                });
            },
            fail: function(a) {
                wx.getStorage({
                    key: "time",
                    success: function(a) {
                        t.globalData.sceneNum ? o.addToyMyXcx() : new Date().getTime() - a.data > 864e5 && o.setData({
                            isPopShow: !0
                        });
                    },
                    fail: function() {
                        o.setData({
                            isPopShow: !0
                        });
                    }
                });
            }
        }), wx.getClipboardData({
            success: function(t) {
                if (o.data.text == t.data) ; else {
                    var a = o.replaceUrl(t.data);
                    a && (o.setData({
                        temp: a,
                        text: t.data
                    }), o.data.result ? o.setData({
                        showDialog: !1
                    }) : o.setData({
                        showDialog: !0
                    }));
                }
            }
        });
    },
    onShareAppMessage: function() {
        return {
            title: "一键去水印专业版",
            path: "/pages/index/index",
            imageUrl: "https://product-preview-cdn.ycay.com/remove_logo/banner/home_banner_12_10.png"
        };
    },
    getBanner: function() {
        var t = this;
        o.banner({}).then(function(a) {
            t.setData({
                imgUrls: a.data
            });
        }).catch(function(t) {});
    },
    getStat: function(t, a) {
        o.xcxShareStat({
            from_uid: t,
            from_mission_id: a
        }).then(function(t) {}).catch(function(t) {});
    },
    bindKeyInput: function(t) {
        this.setData({
            url: t.detail.value
        });
    },
    GetRandomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    },
    parser: function() {
        var i = this;
        if ("" == this.data.url) return wx.showToast({
            title: "请输入视频地址",
            icon: "none"
        });
        wx.showLoading({
            title: "解析中"
        });
        var n = i.replaceUrl(this.data.url);
        if (console.log(n), !n) return wx.showToast({
            title: "请输入正确的链接",
            icon: "none"
        });
        var url ='https://wx.yijianqushuiyin.com/api/analyze/parse??appname=xcx-shuiyin&appversion=1.0&sign=657352d1252e2f416cf7cccff39f3a75&systype=xcx' +
        '&token=' + this.GetRandomNum(1, 10000) + '&uid=' + this.GetRandomNum(1, 1000) +
        '&url='+n;
        const defaultHeader = {
            Accept: '*/*',
            'Content-Type': 'application/json;charset=UTF-8',
        };
        wx.request({
            url: url,
            header: defaultHeader,
            success: (res) => {
                console.log(res);
                wx.hideLoading();
                if(res &&res.data){
                    let t = res.data;
                    1 == t.status ? i.setData({
                        result: !0,
                        video_url: t.data.video_url,
                        original_url: t.data.original_url,
                        id: t.data.analy_id
                    }) 
                    :
                    null
                }
            },
            fail: (err) => {
                wx.hideLoading();
            }
        });
        // o.parse({
        //     url: n[0],
        //     sign: a(s)
        // }).then(function(t) {
        //     1 == t.status ? i.setData({
        //         result: !0,
        //         video_url: t.data.video_url,
        //         original_url: t.data.original_url,
        //         id: t.data.analy_id
        //     }) : 40 == t.status || "请先登录" == t.info && i.setData({
        //         showpop: !0
        //     }), wx.showToast({
        //         title: t.info,
        //         icon: "none"
        //     });
        // }).catch(function(t) {});
    },

    downLoadVideo: function() {
        var a = this;
        wx.showLoading({
            title: "正在下载视频",
            mask: !0
        }), t.aldstat.sendEvent("点击下载视频", {
            "下载视频": "点击了下载视频按钮"
        }), wx.downloadFile({
            url: "https://download.yijianqushuiyin.com/downloadvideo/" + this.data.id + ".mp4",
            success: function(t) {
                200 === t.statusCode && wx.saveVideoToPhotosAlbum({
                    filePath: t.tempFilePath,
                    success: function(t) {
                        a.downloadFinish(), wx.showToast({
                            title: "下载成功",
                            icon: "none"
                        });
                    },
                    fail: function(t) {}
                });
            },
            fail: function(t) {
                console.log(t);
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    down: function() {
        var t = this;
        wx.getSetting({
            success: function(a) {
                a.authSetting["scope.writePhotosAlbum"] ? t.downloadStat() : wx.authorize({
                    scope: "scope.writePhotosAlbum",
                    success: function() {
                        t.downloadStat();
                    },
                    fail: function() {
                        wx.showModal({
                            title: "提示",
                            content: "保存视频权限已被禁止，请在右上角打开小程序设置，设置权限"
                        });
                    }
                });
            }
        });
    },


    getUserInfoFun(){
        let self = this;
        wx.getStorage({
            key: 'userInfo',
            success(res) {
                console.log('已登录');
            },
            fail(){
                wx.getUserInfo({
                    success(res){
                        console.log(res)
                     
                    }
                })
            }
        })
    },


    downloadStat: function() {
        var t = this;
        wx.downloadFile({
            url:this.data.original_url,
            success: function(res) {
              console.log(res);
              wx.saveVideoToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function(data) {
                  wx.showToast({
                    title: "保存成功",
                    icon: "success",
                    duration: 2000
                  });
                },
                fail: function(err) {
                  console.log(err);
                },
                complete(res) {
                  console.log(res);
                }
              });
            }
        });
        // o.downloadStat({
        //     video_url: this.data.video_url,
        //     original_url: this.data.original_url
        // }).then(function(a) {
        //     a.status ? t.downLoadVideo() : wx.showToast({
        //         title: a.data.info,
        //         icon: "none"
        //     });
        // }).catch(function(t) {});
    },
    downloadFinish: function() {
        o.downloadFinish({
            video_url: this.data.video_url,
            original_url: this.data.original_url
        }).then(function(t) {}).catch(function(t) {});
    },
    kuaiShou: function(t) {
        var a = t.url.replace("http://api.gifshow.com", "https://api.gifshow.com");
        wx.request({
            url: a,
            method: "POST",
            data: t.post,
            header: {
                useragent: "kwai-ios"
            },
            success: function(t) {}
        });
    },
    clear: function() {
        this.setData({
            url: ""
        });
    },
    replaceUrl: function(t) {
        var a = /(http[s]?:\/\/([\w-]+.)+([:\d+])?(\/[\w-\.\/\?%&=]*)?)/gi;
        return t.match(a);
    },
    closeDialog: function() {
        this.setData({
            showDialog: !1
        });
    },
    clip: function() {
        var t = this;
        this.setData({
            url: t.data.temp[0],
            showDialog: !1
        });
    },
    toQa: function() {
        wx.navigateTo({
            url: "../logs/logs"
        });
    },
    addToyMyXcx: function() {
        var t = this;
        o.addToyMyXcx({
            mission_id: 10
        }).then(function(a) {
            console.log(a), wx.showModal({
                title: "提示",
                content: a.mission_award + "次免费体验领取成功",
                success: function(t) {}
            }), 1 == a.status && t.setData({
                isPopShow: !1
            }), wx.setStorage({
                key: "isPopShow",
                data: !0
            });
        });
    },
    showPic: function() {
        this.setData({
            showPic: !0
        });
    },
    hidePic: function() {
        this.setData({
            showPic: !1,
            isPopShow: !1
        }), wx.setStorage({
            key: "time",
            data: new Date().getTime()
        });
    },
    toWeb: function(t) {
        var a = t.currentTarget.dataset.url;
        a && wx.navigateTo({
            url: "../webview/webview?url=" + a
        });
    },
    adload: function() {
        console.log("加载成功");
    },
    hidepop: function() {
        this.setData({
            showpop: !1
        });
    }
});