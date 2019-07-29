var t = {
    "_toast_.isHide": !1,
    "_toast_.content": ""
}, s = {
    show: function(t) {
        var s = this;
        this.setData({
            "_toast_.isHide": !0,
            "_toast_.content": t
        }), setTimeout(function() {
            s.setData({
                "_toast_.isHide": !1
            });
        }, 3500);
    }
};

module.exports = {
    ToastPannel: function() {
        var e = getCurrentPages(), a = e[e.length - 1];
        return Object.assign(a, s), a.setData(t), this;
    }
};