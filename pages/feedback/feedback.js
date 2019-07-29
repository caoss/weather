function e(e) {
    if (i) {
        n.setData({
            loading: !0
        });
        var t = new (s.Object.extend("weather_feedback"))();
        t.set("userkey", l.globalData.userKey), t.set("time", e), t.set("content", i), t.save(null, {
            success: function(t) {
                console.log("反馈创建成功, objectId:" + t), o(e, !0);
            },
            error: function(e, t) {
                a();
            }
        });
    }
}

function t() {
    i || n.data.image ? n.setData({
        disabled: !1
    }) : n.setData({
        disabled: !0
    });
}

function o(e, t) {
    n.setData({
        loading: !1
    }), wx.showToast({
        title: "提交成功",
        icon: "success",
        duration: 2e3
    }), t && setTimeout(function() {
        wx.navigateBack();
    }, 1e3);
}

function a() {
    n.setData({
        loading: !1
    }), wx.showToast({
        title: "提交失败",
        icon: "none",
        duration: 2e3
    });
}

var n, s = require("../../libs/bmob/bmob.js"), i = "", l = getApp();

Page({
    data: {
        replys: null,
        showChoose: !0,
        showDelete: !1,
        image: null,
        loading: !1,
        disabled: !0
    },
    onLoad: function(e) {
        n = this;
        var t = s.Object.extend("weather_feedback"), o = new s.Query(t);
        o.equalTo("userkey", l.globalData.userKey), o.find({
            success: function(e) {
                console.log("共查询到 " + e.length + " 条记录");
                for (var t = [], o = 0; o < e.length; o++) {
                    var a = e[o], s = a.get("content"), i = a.get("reply");
                    i && t.push({
                        content: s,
                        reply: i
                    });
                }
                console.log("共查询回复记录", t), t.length > 0 && (t = [ t[t.length - 1] ], n.setData({
                    replys: t
                }));
            },
            error: function(e) {
                console.log("查询失败: " + e.code + " " + e.message);
            }
        });
    },
    chooseImage: function() {
        wx.chooseImage({
            count: 1,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(e) {
                var o = e.tempFilePaths[0];
                n.setData({
                    showChoose: !1,
                    showDelete: !0,
                    image: o
                }), t(), console.log(e);
            }
        });
    },
    deleteImage: function() {
        n.setData({
            showChoose: !0,
            showDelete: !1,
            image: null
        }), t();
    },
    previewImage: function() {
        wx.previewImage({
            urls: [ n.data.image ]
        });
    },
    submitContent: function() {
        var t = new Date().getTime();
        if (n.data.image) {
            n.setData({
                loading: !0
            });
            var o = [ n.data.image ], c = l.globalData.userKey + "_" + t + ".jpg";
            new s.File(c, o).save().then(function(o) {
                console.log(o.url()), i || (i = "默认评论"), e(t);
            }, function(e) {
                a();
            });
        } else e(t);
    },
    inputListener: function(e) {
        i = e.detail.value, console.log(i), t();
    }
});