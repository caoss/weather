require("libs/bmob/bmob.js").initialize("4999e8ac87ff925db4927780be42a4aa", "e9db2c22f771bedf66fe747f3d546c09");

var e;

App({
    onLaunch: function() {
        e = this, wx.getStorage({
            key: "userKey",
            success: function(a) {
                console.log("用户Key:" + a.data), e.globalData.userKey = a.data;
            },
            fail: function() {
                console.log("用户没有Key");
                var a = "userKey" + new Date().getTime();
                e.globalData.userKey = a, wx.setStorage({
                    key: "userKey",
                    data: a
                });
            }
        });
    },
    globalData: {
        userKey: null
    }
});