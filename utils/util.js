var t = function(t) {
    return (t = t.toString())[1] ? t : "0" + t;
};

module.exports = {
    formatTime: function(e) {
        var o = e.getFullYear(), n = e.getMonth() + 1, i = e.getDate(), u = e.getHours(), c = e.getMinutes(), g = e.getSeconds();
        return [ o, n, i ].map(t).join("/") + " " + [ u, c, g ].map(t).join(":");
    },
    getLocationMessage: function(t) {
        wx.getLocation({
            type: "gcj02",
            success: function(e) {
                console.log(e);
                var o = e.latitude, n = e.longitude;
                t(!0, o, n);
            },
            fail: function(e) {
                t(!1), console.log("定位失败", e);
            }
        });
    }
};