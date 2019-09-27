Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.xcxpay = exports.vipPackage = exports.config = exports.getUserInfo = exports.banner = exports.xcxShareStat = exports.parse = exports.downloadStat = exports.downloadFinish = exports.addToyMyXcx = exports.xcxLogin = exports.API_ROOT = void 0;

var t = require("800B50F7C1D2A6DFE66D38F0E0554AB5.js"), o = exports.API_ROOT = "https://wx.yijianqushuiyin.com";

exports.xcxLogin = function(e) {
    return (0, t.post)(o + "/api/User/xcxLogin", e);
}, exports.addToyMyXcx = function(e) {
    return (0, t.post)(o + "/api/mission/addToyMyXcx", e);
}, exports.downloadFinish = function(e) {
    return (0, t.post)(o + "/api/Analyze/downloadFinish", e);
}, exports.downloadStat = function(e) {
    return (0, t.post)(o + "/api/Analyze/downloadStat", e);
}, exports.parse = function(e) {
    return (0, t.post)(o + "/api/analyze/parse", e);
}, exports.xcxShareStat = function(e) {
    return (0, t.post)(o + "/api/mission/xcxShareStat", e);
}, exports.banner = function(e) {
    return (0, t.post)(o + "/api/banner", e);
}, exports.getUserInfo = function(e) {
    return (0, t.post)(o + "/api/user/getUserInfo", e);
}, exports.config = function(e) {
    return (0, t.post)(o + "/api/config", e);
}, exports.vipPackage = function(e) {
    return (0, t.post)(o + "/api/Vip/package", e);
}, exports.xcxpay = function(e) {
    return (0, t.post)(o + "/api/order/xcxpay", e);
};