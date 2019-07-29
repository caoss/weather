var t, e = require("../../resource/data/citys.js"), a = require("../../utils/currentCityManager.js");

Page({
    data: {
        showListView: !1,
        citylist: [],
        locationCityModel: null,
        historyCites: null
    },
    searchListener: function(a) {
        var o = [], i = a.detail.value;
        i ? (e.datas.forEach(function(t) {
            t.children.forEach(function(e) {
                -1 != e.name.indexOf(i) && (e.parent = t.name, o.push(e));
            });
        }), t.setData({
            showListView: !0,
            citylist: o
        }), console.log(o)) : t.setData({
            showListView: !1
        });
    },
    goBack: function(t) {
        a.saveCityModel(t);
        var e = getCurrentPages();
        e[e.length - 2].refreshView(t), wx.navigateBack();
    },
    locationclick: function() {
        var e = a.getLocationModel();
        e.islocation = !0, t.goBack(e);
    },
    historyItemLcick: function(e) {
        var a = e.currentTarget.dataset.index;
        console.log("点击历史", a), t.goBack(a);
    },
    searchItemLcick: function(e) {
        var a = e.currentTarget.dataset.index, o = {
            latitude: a.lat,
            longitude: a.log,
            displayName: a.name,
            parentName: a.parent,
            islocation: !1
        };
        try {
            var i = wx.getStorageSync("historySearch");
            i || (i = []);
            for (var n = i.length; n--; ) i[n].displayName == o.displayName && i[n].parentName == o.parentName && i.splice(n, 1);
            i.length > 6 && i.pop(), i.unshift(o), wx.setStorageSync("historySearch", i);
        } catch (t) {
            console.log(t);
        }
        t.goBack(o);
    },
    onLoad: function(e) {
        t = this;
        var o = a.getLocationModel();
        o && t.setData({
            locationCityModel: o
        });
        try {
            var i = wx.getStorageSync("historySearch");
            console.log("搜索历史", i), t.setData({
                historyCites: i
            });
        } catch (t) {}
    }
});