var t = "currentCityModelKey", e = "currentLocationKey", o = {
    latitude: 31.22024,
    longitude: 121.42394,
    displayName: "上海",
    parentName: null,
    islocation: !1
};

module.exports = {
    saveCityModel: function(e) {
        try {
            console.log("保存当前选择城市数据", e), wx.setStorageSync(t, e);
        } catch (t) {}
    },
    saveLocationModel: function(t) {
        try {
            console.log("保存定位数据", t), wx.setStorageSync(e, t);
        } catch (t) {}
    },
    getCurrentCityModel: function() {
        try {
            var e = wx.getStorageSync(t);
            return console.log("获取当前选择城市数据", e), e;
        } catch (t) {
            return null;
        }
    },
    getLocationModel: function() {
        try {
            var t = wx.getStorageSync(e);
            return console.log("获取当前定位数据", t), t;
        } catch (t) {
            return null;
        }
    },
    currentDefaultCity: o
};