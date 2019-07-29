function t(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}

var n = function() {
    function t(t, e) {
        for (var n = 0; n < e.length; n++) {
            var a = e[n];
            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), 
            Object.defineProperty(t, a.key, a);
        }
    }
    return function(e, n, a) {
        return n && t(e.prototype, n), a && t(e, a), e;
    };
}(), a = function() {
    function t(t, e) {
        var n = [], a = !0, i = !1, o = void 0;
        try {
            for (var r, c = t[Symbol.iterator](); !(a = (r = c.next()).done) && (n.push(r.value), 
            !e || n.length !== e); a = !0) ;
        } catch (t) {
            i = !0, o = t;
        } finally {
            try {
                !a && c.return && c.return();
            } finally {
                if (i) throw o;
            }
        }
        return n;
    }
    return function(e, n) {
        if (Array.isArray(e)) return e;
        if (Symbol.iterator in Object(e)) return t(e, n);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
    };
}(), i = {
    setup: function(t) {
        var e = [];
        Object.assign(t, {
            on: function(t, n) {
                "function" == typeof n && e.push([ t, n ]);
            },
            emit: function(t) {
                for (var n = arguments.length, i = Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++) i[o - 1] = arguments[o];
                e.forEach(function(e) {
                    var n = a(e, 2), o = n[0], r = n[1];
                    return t == o && r.apply(void 0, i);
                });
            },
            removeAllListeners: function() {
                e = [];
            }
        });
    }
};

module.exports = function() {
    function a(e) {
        t(this, a), this.updateTable = function(t) {
            var e = {
                appKey: this.applicationId,
                tableName: t,
                objectId: "",
                action: "updateTable"
            };
            e = this.emitData("client_sub", e), this.emit(e);
        }, this.unsubUpdateTable = function(t) {
            var e = {
                appKey: this.applicationId,
                tableName: t,
                objectId: "",
                action: "unsub_updateTable"
            };
            e = this.emitData("client_sub", e), this.emit(e);
        }, this.updateRow = function(t, e) {
            var n = {
                appKey: this.applicationId,
                tableName: t,
                objectId: e,
                action: "updateRow"
            };
            n = this.emitData("client_sub", n), this.emit(n);
        }, this.unsubUpdateRow = function(t, e) {
            var n = {
                appKey: this.applicationId,
                tableName: t,
                objectId: e,
                action: "unsub_updateRow"
            };
            n = this.emitData("client_sub", n), this.emit(n);
        }, this.deleteTable = function(t) {
            var e = {
                appKey: this.applicationId,
                tableName: t,
                objectId: "",
                action: "deleteTable"
            };
            e = this.emitData("client_sub", e), this.emit(e);
        }, this.unsubDeleteTable = function(t) {
            var e = {
                appKey: this.applicationId,
                tableName: t,
                objectId: "",
                action: "unsub_deleteTable"
            };
            e = this.emitData("client_sub", e), this.emit(e);
        }, this.deleteRow = function(t, e) {
            var n = {
                appKey: this.applicationId,
                tableName: t,
                objectId: e,
                action: "deleteRow"
            };
            n = this.emitData("client_sub", n), this.emit(n);
        }, this.unsubDeleteRow = function(t, e) {
            var n = {
                appKey: this.applicationId,
                tableName: t,
                objectId: e,
                action: "unsub_deleteRow"
            };
            n = this.emitData("client_sub", n), this.emit(n);
        }, this.onUpdateTable = function(t, e) {}, this.onUpdateRow = function(t, e, n) {}, 
        this.onDeleteTable = function(t, e) {}, this.onDeleteRow = function(t, e, n) {}, 
        this.config = {
            host: "wss.bmobcloud.com"
        }, i.setup(this.emitter = {}), this.applicationId = e, this.initialize();
    }
    return n(a, [ {
        key: "handshake",
        value: function() {
            function t(t) {
                if (!(t instanceof Error)) return t.split(":")[0];
                self.connecting = !1, self.onError(t.message);
            }
            var n = "https://" + this.config.host + "/socket.io/1/?t=" + new Date().getTime(), a = {}, i = JSON.stringify(a);
            return new Promise(function(a, o) {
                wx.request({
                    method: "GET",
                    url: n,
                    data: i,
                    header: {
                        "content-type": "text/plain"
                    },
                    success: function(n) {
                        return n.data && n.data.statusCode ? a("request error", e) : 200 != n.statusCode ? a("request error", e) : a(t(n.data));
                    },
                    fail: function(t) {
                        return a("request error", t);
                    }
                });
            });
        }
    }, {
        key: "initialize",
        value: function() {
            var t = this;
            return this.handshake().then(function(e) {
                try {
                    t.connect("wss://" + t.config.host + "/socket.io/1/websocket/" + e, {});
                } catch (t) {
                    throw console.error({
                        connectError: t
                    }), t;
                }
            }), this.on("close", function() {
                console.log("连接已中断");
            }), new Promise(function(e, n) {
                t.on("server_pub", function(e) {
                    switch (e.action) {
                      case "updateTable":
                        t.onUpdateTable(e.tableName, e.data);
                        break;

                      case "updateRow":
                        t.onUpdateRow(e.tableName, e.objectId, e.data);
                        break;

                      case "deleteTable":
                        t.onDeleteTable(e.tableName, e.data);
                        break;

                      case "deleteRow":
                        t.onDeleteRow(e.tableName, e.objectId, e.data);
                    }
                }), t.on("client_send_data", function(e) {
                    t.onInitListen();
                });
            });
        }
    }, {
        key: "onInitListen",
        value: function() {}
    }, {
        key: "connect",
        value: function(t, e) {
            var n = this, a = Object.keys(e).map(function(t) {
                return t + "=" + encodeURIComponent(e[t]);
            }).join("&"), i = t.indexOf("?") > -1 ? "&" : "?";
            return t = [ t, a ].join(i), new Promise(function(a, i) {
                wx.onSocketOpen(a), wx.onSocketError(i), wx.onSocketMessage(function(t) {
                    try {
                        var e = t.data;
                        if ("2:::" === e.slice(0, 4) && n.emit(!1, !0), null == (e = e.slice(4)) || "" == e) return;
                        var a = function(t) {
                            var e = JSON.parse(t);
                            return {
                                name: e.name,
                                args: e.args
                            };
                        }(e), i = a.name, o = a.args, r = null == o ? "" : JSON.parse(o[0]);
                        n.emitter.emit(i, r);
                    } catch (e) {
                        console.log("Handle packet failed: " + t.data, e);
                    }
                }), wx.onSocketClose(function() {
                    return n.emitter.emit("close");
                }), wx.connectSocket({
                    url: t,
                    header: e
                });
            });
        }
    }, {
        key: "on",
        value: function(t, e) {
            this.emitter.on(t, e);
        }
    }, {
        key: "emit",
        value: function(t, e) {
            e = void 0 == e ? "5:::" : "2:::", t = t ? JSON.stringify(t) : "", wx.sendSocketMessage({
                data: e + t
            });
        }
    }, {
        key: "emitData",
        value: function(t, e) {
            return e = JSON.stringify(e), {
                name: t,
                args: [ e ]
            };
        }
    } ]), a;
}();