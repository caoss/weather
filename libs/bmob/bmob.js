function e(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = n, e;
}

(function(t) {
    var n, i = require("underscore.js"), r = {};
    r.VERSION = "js0.0.1", r._ = i;
    var s = function() {};
    "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = r), 
    exports.Bmob = r) : t.Bmob = r;
    var a = function(e, t, n) {
        var i;
        return i = t && t.hasOwnProperty("constructor") ? t.constructor : function() {
            e.apply(this, arguments);
        }, r._.extend(i, e), s.prototype = e.prototype, i.prototype = new s(), t && r._.extend(i.prototype, t), 
        n && r._.extend(i, n), i.prototype.constructor = i, i.__super__ = e.prototype, i;
    };
    r.serverURL = "https://api.bmob.cn", r.fileURL = "http://file.bmob.cn", r.socketURL = "https://api.bmob.cn", 
    "undefined" != typeof process && process.versions && process.versions.node && (r._isNode = !0), 
    r.initialize = function(e, t, n) {
        r._initialize(e, t, n);
    }, r._initialize = function(e, t, n) {
        r.applicationId = e, r.applicationKey = t, r.masterKey = n, r._useMasterKey = !0, 
        r.serverURL = "https://api.bmobcloud.com";
    }, r._isNode && (r.initialize = r._initialize), r._getBmobPath = function(e) {
        if (!r.applicationId) throw "You need to call Bmob.initialize before using Bmob.";
        if (e || (e = ""), !r._.isString(e)) throw "Tried to get a localStorage path that wasn't a String.";
        return "/" === e[0] && (e = e.substring(1)), "Bmob/" + r.applicationId + "/" + e;
    }, r._getBmobPath = function(e) {
        if (!r.applicationId) throw "You need to call Bmob.initialize before using Bmob.";
        if (e || (e = ""), !r._.isString(e)) throw "Tried to get a localStorage path that wasn't a String.";
        return "/" === e[0] && (e = e.substring(1)), "Bmob/" + r.applicationId + "/" + e;
    }, r._installationId = null, r._getInstallationId = function() {
        if (r._installationId) return r._installationId;
        var e = r._getBmobPath("installationId");
        if (wx.getStorage({
            key: "key",
            success: function(e) {
                r._installationId = e.data, console.log(e.data);
            }
        }), !r._installationId || "" === r._installationId) {
            var t = function() {
                return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
            };
            r._installationId = t() + t() + "-" + t() + "-" + t() + "-" + t() + "-" + t() + t() + t(), 
            wx.setStorage({
                key: e,
                data: r._installationId
            });
        }
        return r._installationId;
    }, r._parseDate = function(e) {
        var t = new RegExp("^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,2})T([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})(.([0-9]+))?Z$").exec(e);
        if (!t) return null;
        var n = t[1] || 0, i = (t[2] || 1) - 1, r = t[3] || 0, s = t[4] || 0, a = t[5] || 0, o = t[6] || 0, u = t[8] || 0;
        return new Date(Date.UTC(n, i, r, s, a, o, u));
    }, r._ajax = function(e, t, n, i, s) {
        var s, a = {
            success: i,
            error: s
        }, o = new r.Promise(), u = JSON.parse(n);
        return wx.showNavigationBarLoading(), "wechatApp" == u.category ? wx.uploadFile({
            url: t,
            filePath: u.base64,
            name: "file",
            header: {
                "X-Bmob-SDK-Type": "wechatApp"
            },
            formData: u,
            success: function(e) {
                console.log(e);
                var t = JSON.parse(e.data);
                o.resolve(t, e.statusCode, e), wx.hideNavigationBarLoading();
            },
            fail: function(e) {
                console.log(e), o.reject(e), wx.hideNavigationBarLoading();
            }
        }).onProgressUpdate(function(e) {
            console.log("上传进度", e.progress), console.log("已经上传的数据长度", e.totalBytesSent), console.log("预期需要上传的数据总长度", e.totalBytesExpectedToSend);
        }) : wx.request({
            method: e,
            url: t,
            data: n,
            header: {
                "content-type": "text/plain"
            },
            success: function(e) {
                e.data && e.data.code ? o.reject(e) : 200 != e.statusCode ? o.reject(e) : o.resolve(e.data, e.statusCode, e), 
                wx.hideNavigationBarLoading();
            },
            fail: function(e) {
                o.reject(e), wx.hideNavigationBarLoading();
            }
        }), s ? r.Promise.error(s) : o._thenRunCallbacks(a);
    }, r._extend = function(e, t) {
        var n = a(this, e, t);
        return n.extend = this.extend, n;
    }, r._request = function(e, t, n, i, s) {
        if (!r.applicationId) throw "You must specify your applicationId using Bmob.initialize";
        if (!r.applicationKey && !r.masterKey) throw "You must specify a key using Bmob.initialize";
        var a = r.serverURL;
        "/" !== a.charAt(a.length - 1) && (a += "/"), e.indexOf("2/") < 0 ? a += "1/" + e : a += e, 
        t && (a += "/" + t), n && (a += "/" + n), "users" !== e && "classes" !== e || "PUT" !== i || !s._fetchWhenSave || (delete s._fetchWhenSave, 
        a += "?new=true"), s = r._.clone(s || {}), "POST" !== i && (s._Method = i, i = "POST"), 
        s._ApplicationId = r.applicationId, s._RestKey = r.applicationKey, r._useMasterKey && void 0 != r.masterKey && (s._MasterKey = r.masterKey), 
        s._ClientVersion = r.VERSION, s._InstallationId = r._getInstallationId();
        var o = r.User.current();
        o && o._sessionToken && (s._SessionToken = o._sessionToken);
        var u = JSON.stringify(s);
        return r._ajax(i, a, u).then(null, function(e) {
            var t;
            try {
                e.data.code && (t = new r.Error(e.data.code, e.data.error));
            } catch (e) {}
            return t = t || new r.Error(-1, e.data), r.Promise.error(t);
        });
    }, r._getValue = function(e, t) {
        return e && e[t] ? r._.isFunction(e[t]) ? e[t]() : e[t] : null;
    }, r._encode = function(e, t, n) {
        var i = r._;
        if (e instanceof r.Object) {
            if (n) throw "Bmob.Objects not allowed here";
            if (!t || i.include(t, e) || !e._hasData) return e._toPointer();
            if (!e.dirty()) return t = t.concat(e), r._encode(e._toFullJSON(t), t, n);
            throw "Tried to save an object with a pointer to a new, unsaved object.";
        }
        if (e instanceof r.ACL) return e.toJSON();
        if (i.isDate(e)) return {
            __type: "Date",
            iso: e.toJSON()
        };
        if (e instanceof r.GeoPoint) return e.toJSON();
        if (i.isArray(e)) return i.map(e, function(e) {
            return r._encode(e, t, n);
        });
        if (i.isRegExp(e)) return e.source;
        if (e instanceof r.Relation) return e.toJSON();
        if (e instanceof r.Op) return e.toJSON();
        if (e instanceof r.File) {
            if (!e.url()) throw "Tried to save an object containing an unsaved file.";
            return {
                __type: "File",
                cdn: e.cdn(),
                filename: e.name(),
                url: e.url()
            };
        }
        if (i.isObject(e)) {
            var s = {};
            return r._objectEach(e, function(e, i) {
                s[i] = r._encode(e, t, n);
            }), s;
        }
        return e;
    }, r._decode = function(e, t) {
        var n = r._;
        if (!n.isObject(t)) return t;
        if (n.isArray(t)) return r._arrayEach(t, function(e, n) {
            t[n] = r._decode(n, e);
        }), t;
        if (t instanceof r.Object) return t;
        if (t instanceof r.File) return t;
        if (t instanceof r.Op) return t;
        if (t.__op) return r.Op._decode(t);
        if ("Pointer" === t.__type) {
            var i = t.className, s = r.Object._create(i);
            return t.createdAt ? (delete t.__type, delete t.className, s._finishFetch(t, !0)) : s._finishFetch({
                objectId: t.objectId
            }, !1), s;
        }
        if ("Object" === t.__type) {
            i = t.className;
            delete t.__type, delete t.className;
            var a = r.Object._create(i);
            return a._finishFetch(t, !0), a;
        }
        if ("Date" === t.__type) return t.iso;
        if ("GeoPoint" === t.__type) return new r.GeoPoint({
            latitude: t.latitude,
            longitude: t.longitude
        });
        if ("ACL" === e) return t instanceof r.ACL ? t : new r.ACL(t);
        if ("Relation" === t.__type) {
            var o = new r.Relation(null, e);
            return o.targetClassName = t.className, o;
        }
        if ("File" === t.__type) {
            if (void 0 != t.url && null != t.url) if (t.url.indexOf("http") >= 0) u = {
                _name: t.filename,
                _url: t.url,
                url: t.url,
                _group: t.group
            }; else u = {
                _name: t.filename,
                _url: r.fileURL + "/" + t.url,
                url: t.url,
                _group: t.group
            }; else var u = {
                _name: t.filename,
                _url: t.url,
                url: t.url,
                _group: t.group
            };
            return u;
        }
        return r._objectEach(t, function(e, n) {
            t[n] = r._decode(n, e);
        }), t;
    }, r._arrayEach = r._.each, r._traverse = function(e, t, n) {
        if (e instanceof r.Object) {
            if (n = n || [], r._.indexOf(n, e) >= 0) return;
            return n.push(e), r._traverse(e.attributes, t, n), t(e);
        }
        return e instanceof r.Relation || e instanceof r.File ? t(e) : r._.isArray(e) ? (r._.each(e, function(i, s) {
            var a = r._traverse(i, t, n);
            a && (e[s] = a);
        }), t(e)) : r._.isObject(e) ? (r._each(e, function(i, s) {
            var a = r._traverse(i, t, n);
            a && (e[s] = a);
        }), t(e)) : t(e);
    }, r._objectEach = r._each = function(e, t) {
        var n = r._;
        n.isObject(e) ? n.each(n.keys(e), function(n) {
            t(e[n], n);
        }) : n.each(e, t);
    }, r._isNullOrUndefined = function(e) {
        return r._.isNull(e) || r._.isUndefined(e);
    }, r.Error = function(e, t) {
        this.code = e, this.message = t;
    }, i.extend(r.Error, (n = {
        OTHER_CAUSE: -1,
        OBJECT_NOT_FOUND: 101,
        INVALID_QUERY: 102,
        INVALID_CLASS_NAME: 103,
        RELATIONDOCNOTEXISTS: 104,
        INVALID_KEY_NAME: 105,
        INVALID_POINTER: 106,
        INVALID_JSON: 107,
        USERNAME_PASSWORD_REQUIRED: 108,
        INCORRECT_TYPE: 111,
        REQUEST_MUST_ARRAY: 112,
        REQUEST_MUST_OBJECT: 113,
        OBJECT_TOO_LARGE: 114,
        GEO_ERROR: 117,
        EMAIL_VERIFY_MUST_OPEN: 120,
        CACHE_MISS: 120,
        INVALID_DEVICE_TOKEN: 131,
        INVALID_INSTALLID: 132,
        INVALID_DEVICE_TYPE: 133,
        DEVICE_TOKEN_EXIST: 134,
        INSTALLID_EXIST: 135,
        DEVICE_TOKEN_NOT_FOR_ANDROID: 136,
        INVALID_INSTALL_OPERATE: 137,
        READ_ONLY: 138,
        INVALID_ROLE_NAME: 139,
        MISS_PUSH_DATA: 141,
        INVALID_PUSH_TIME: 142,
        INVALID_PUSH_EXPIRE: 143,
        PUSH_TIME_MUST_BEFORE_NOW: 144,
        FILE_SIZE_ERROR: 145,
        FILE_NAME_ERROR: 146
    }, e(n, "FILE_NAME_ERROR", 147), e(n, "FILE_LEN_ERROR", 148), e(n, "FILE_UPLOAD_ERROR", 150), 
    e(n, "FILE_DELETE_ERROR", 151), e(n, "IMAGE_ERROR", 160), e(n, "IMAGE_MODE_ERROR", 161), 
    e(n, "IMAGE_WIDTH_ERROR", 162), e(n, "IMAGE_HEIGHT_ERROR", 163), e(n, "IMAGE_LONGEDGE_ERROR", 164), 
    e(n, "IMAGE_SHORTEDGE_ERROR", 165), e(n, "USER_MISSING", 201), e(n, "USER_NAME_TOKEN", 202), 
    e(n, "EMAIL_EXIST", 203), e(n, "NO_EMAIL", 204), e(n, "NOT_FOUND_EMAIL", 205), e(n, "SESSIONTOKEN_ERROR", 206), 
    e(n, "VALID_ERROR", 301), n)), r.Events = {
        on: function(e, t, n) {
            var i, r, s, a, o;
            if (!t) return this;
            for (e = e.split(c), i = this._callbacks || (this._callbacks = {}), r = e.shift(); r; ) (s = (o = i[r]) ? o.tail : {}).next = a = {}, 
            s.context = n, s.callback = t, i[r] = {
                tail: a,
                next: o ? o.next : s
            }, r = e.shift();
            return this;
        },
        off: function(e, t, n) {
            var r, s, a, o, u, h;
            if (s = this._callbacks) {
                if (!(e || t || n)) return delete this._callbacks, this;
                for (r = (e = e ? e.split(c) : i.keys(s)).shift(); r; ) if (a = s[r], delete s[r], 
                a && (t || n)) {
                    for (o = a.tail, a = a.next; a !== o; ) u = a.callback, h = a.context, (t && u !== t || n && h !== n) && this.on(r, u, h), 
                    a = a.next;
                    r = e.shift();
                }
                return this;
            }
        },
        trigger: function(e) {
            var t, n, i, r, s, a, o;
            if (!(i = this._callbacks)) return this;
            for (a = i.all, e = e.split(c), o = slice.call(arguments, 1), t = e.shift(); t; ) {
                if (n = i[t]) for (r = n.tail; (n = n.next) !== r; ) n.callback.apply(n.context || this, o);
                if (n = a) for (r = n.tail, s = [ t ].concat(o); (n = n.next) !== r; ) n.callback.apply(n.context || this, s);
                t = e.shift();
            }
            return this;
        }
    }, r.Events.bind = r.Events.on, r.Events.unbind = r.Events.off, r.GeoPoint = function(e, t) {
        i.isArray(e) ? (r.GeoPoint._validate(e[0], e[1]), this.latitude = e[0], this.longitude = e[1]) : i.isObject(e) ? (r.GeoPoint._validate(e.latitude, e.longitude), 
        this.latitude = e.latitude, this.longitude = e.longitude) : i.isNumber(e) && i.isNumber(t) ? (r.GeoPoint._validate(e, t), 
        this.latitude = e, this.longitude = t) : (this.latitude = 0, this.longitude = 0);
        var n = this;
        this.__defineGetter__ && this.__defineSetter__ && (this._latitude = this.latitude, 
        this._longitude = this.longitude, this.__defineGetter__("latitude", function() {
            return n._latitude;
        }), this.__defineGetter__("longitude", function() {
            return n._longitude;
        }), this.__defineSetter__("latitude", function(e) {
            r.GeoPoint._validate(e, n.longitude), n._latitude = e;
        }), this.__defineSetter__("longitude", function(e) {
            r.GeoPoint._validate(n.latitude, e), n._longitude = e;
        }));
    }, r.GeoPoint._validate = function(e, t) {
        if (e < -90) throw "Bmob.GeoPoint latitude " + e + " < -90.0.";
        if (e > 90) throw "Bmob.GeoPoint latitude " + e + " > 90.0.";
        if (t < -180) throw "Bmob.GeoPoint longitude " + t + " < -180.0.";
        if (t > 180) throw "Bmob.GeoPoint longitude " + t + " > 180.0.";
    }, r.GeoPoint.current = function(e) {
        var t = new r.Promise();
        return navigator.geolocation.getCurrentPosition(function(e) {
            t.resolve(new r.GeoPoint({
                latitude: e.coords.latitude,
                longitude: e.coords.longitude
            }));
        }, function(e) {
            t.reject(e);
        }), t._thenRunCallbacks(e);
    }, r.GeoPoint.prototype = {
        toJSON: function() {
            return r.GeoPoint._validate(this.latitude, this.longitude), {
                __type: "GeoPoint",
                latitude: this.latitude,
                longitude: this.longitude
            };
        },
        radiansTo: function(e) {
            var t = Math.PI / 180, n = this.latitude * t, i = this.longitude * t, r = e.latitude * t, s = n - r, a = i - e.longitude * t, o = Math.sin(s / 2), u = Math.sin(a / 2), c = o * o + Math.cos(n) * Math.cos(r) * u * u;
            return c = Math.min(1, c), 2 * Math.asin(Math.sqrt(c));
        },
        kilometersTo: function(e) {
            return 6371 * this.radiansTo(e);
        },
        milesTo: function(e) {
            return 3958.8 * this.radiansTo(e);
        }
    };
    r.ACL = function(e) {
        var t = this;
        if (t.permissionsById = {}, i.isObject(e)) if (e instanceof r.User) t.setReadAccess(e, !0), 
        t.setWriteAccess(e, !0); else {
            if (i.isFunction(e)) throw "Bmob.ACL() called with a function.  Did you forget ()?";
            r._objectEach(e, function(e, n) {
                if (!i.isString(n)) throw "Tried to create an ACL with an invalid userId.";
                t.permissionsById[n] = {}, r._objectEach(e, function(e, r) {
                    if ("read" !== r && "write" !== r) throw "Tried to create an ACL with an invalid permission type.";
                    if (!i.isBoolean(e)) throw "Tried to create an ACL with an invalid permission value.";
                    t.permissionsById[n][r] = e;
                });
            });
        }
    }, r.ACL.prototype.toJSON = function() {
        return i.clone(this.permissionsById);
    }, r.ACL.prototype._setAccess = function(e, t, n) {
        if (t instanceof r.User ? t = t.id : t instanceof r.Role && (t = "role:" + t.getName()), 
        !i.isString(t)) throw "userId must be a string.";
        if (!i.isBoolean(n)) throw "allowed must be either true or false.";
        var s = this.permissionsById[t];
        if (!s) {
            if (!n) return;
            s = {}, this.permissionsById[t] = s;
        }
        n ? this.permissionsById[t][e] = !0 : (delete s[e], i.isEmpty(s) && delete s[t]);
    }, r.ACL.prototype._getAccess = function(e, t) {
        t instanceof r.User ? t = t.id : t instanceof r.Role && (t = "role:" + t.getName());
        var n = this.permissionsById[t];
        return !!n && !!n[e];
    }, r.ACL.prototype.setReadAccess = function(e, t) {
        this._setAccess("read", e, t);
    }, r.ACL.prototype.getReadAccess = function(e) {
        return this._getAccess("read", e);
    }, r.ACL.prototype.setWriteAccess = function(e, t) {
        this._setAccess("write", e, t);
    }, r.ACL.prototype.getWriteAccess = function(e) {
        return this._getAccess("write", e);
    }, r.ACL.prototype.setPublicReadAccess = function(e) {
        this.setReadAccess("*", e);
    }, r.ACL.prototype.getPublicReadAccess = function() {
        return this.getReadAccess("*");
    }, r.ACL.prototype.setPublicWriteAccess = function(e) {
        this.setWriteAccess("*", e);
    }, r.ACL.prototype.getPublicWriteAccess = function() {
        return this.getWriteAccess("*");
    }, r.ACL.prototype.getRoleReadAccess = function(e) {
        if (e instanceof r.Role && (e = e.getName()), i.isString(e)) return this.getReadAccess("role:" + e);
        throw "role must be a Bmob.Role or a String";
    }, r.ACL.prototype.getRoleWriteAccess = function(e) {
        if (e instanceof r.Role && (e = e.getName()), i.isString(e)) return this.getWriteAccess("role:" + e);
        throw "role must be a Bmob.Role or a String";
    }, r.ACL.prototype.setRoleReadAccess = function(e, t) {
        e instanceof r.Role && (e = e.getName());
        {
            if (!i.isString(e)) throw "role must be a Bmob.Role or a String";
            this.setReadAccess("role:" + e, t);
        }
    }, r.ACL.prototype.setRoleWriteAccess = function(e, t) {
        e instanceof r.Role && (e = e.getName());
        {
            if (!i.isString(e)) throw "role must be a Bmob.Role or a String";
            this.setWriteAccess("role:" + e, t);
        }
    }, r.Op = function() {
        this._initialize.apply(this, arguments);
    }, r.Op.prototype = {
        _initialize: function() {}
    }, i.extend(r.Op, {
        _extend: r._extend,
        _opDecoderMap: {},
        _registerDecoder: function(e, t) {
            r.Op._opDecoderMap[e] = t;
        },
        _decode: function(e) {
            var t = r.Op._opDecoderMap[e.__op];
            return t ? t(e) : void 0;
        }
    }), r.Op._registerDecoder("Batch", function(e) {
        var t = null;
        return r._arrayEach(e.ops, function(e) {
            e = r.Op._decode(e), t = e._mergeWithPrevious(t);
        }), t;
    }), r.Op.Set = r.Op._extend({
        _initialize: function(e) {
            this._value = e;
        },
        value: function() {
            return this._value;
        },
        toJSON: function() {
            return r._encode(this.value());
        },
        _mergeWithPrevious: function(e) {
            return this;
        },
        _estimate: function(e) {
            return this.value();
        }
    }), r.Op._UNSET = {}, r.Op.Unset = r.Op._extend({
        toJSON: function() {
            return {
                __op: "Delete"
            };
        },
        _mergeWithPrevious: function(e) {
            return this;
        },
        _estimate: function(e) {
            return r.Op._UNSET;
        }
    }), r.Op._registerDecoder("Delete", function(e) {
        return new r.Op.Unset();
    }), r.Op.Increment = r.Op._extend({
        _initialize: function(e) {
            this._amount = e;
        },
        amount: function() {
            return this._amount;
        },
        toJSON: function() {
            return {
                __op: "Increment",
                amount: this._amount
            };
        },
        _mergeWithPrevious: function(e) {
            if (e) {
                if (e instanceof r.Op.Unset) return new r.Op.Set(this.amount());
                if (e instanceof r.Op.Set) return new r.Op.Set(e.value() + this.amount());
                if (e instanceof r.Op.Increment) return new r.Op.Increment(this.amount() + e.amount());
                throw "Op is invalid after previous op.";
            }
            return this;
        },
        _estimate: function(e) {
            return e ? e + this.amount() : this.amount();
        }
    }), r.Op._registerDecoder("Increment", function(e) {
        return new r.Op.Increment(e.amount);
    }), r.Op.Add = r.Op._extend({
        _initialize: function(e) {
            this._objects = e;
        },
        objects: function() {
            return this._objects;
        },
        toJSON: function() {
            return {
                __op: "Add",
                objects: r._encode(this.objects())
            };
        },
        _mergeWithPrevious: function(e) {
            if (e) {
                if (e instanceof r.Op.Unset) return new r.Op.Set(this.objects());
                if (e instanceof r.Op.Set) return new r.Op.Set(this._estimate(e.value()));
                if (e instanceof r.Op.Add) return new r.Op.Add(e.objects().concat(this.objects()));
                throw "Op is invalid after previous op.";
            }
            return this;
        },
        _estimate: function(e) {
            return e ? e.concat(this.objects()) : i.clone(this.objects());
        }
    }), r.Op._registerDecoder("Add", function(e) {
        return new r.Op.Add(r._decode(void 0, e.objects));
    }), r.Op.AddUnique = r.Op._extend({
        _initialize: function(e) {
            this._objects = i.uniq(e);
        },
        objects: function() {
            return this._objects;
        },
        toJSON: function() {
            return {
                __op: "AddUnique",
                objects: r._encode(this.objects())
            };
        },
        _mergeWithPrevious: function(e) {
            if (e) {
                if (e instanceof r.Op.Unset) return new r.Op.Set(this.objects());
                if (e instanceof r.Op.Set) return new r.Op.Set(this._estimate(e.value()));
                if (e instanceof r.Op.AddUnique) return new r.Op.AddUnique(this._estimate(e.objects()));
                throw "Op is invalid after previous op.";
            }
            return this;
        },
        _estimate: function(e) {
            if (e) {
                var t = i.clone(e);
                return r._arrayEach(this.objects(), function(e) {
                    if (e instanceof r.Object && e.id) {
                        var n = i.find(t, function(t) {
                            return t instanceof r.Object && t.id === e.id;
                        });
                        if (n) {
                            var s = i.indexOf(t, n);
                            t[s] = e;
                        } else t.push(e);
                    } else i.contains(t, e) || t.push(e);
                }), t;
            }
            return i.clone(this.objects());
        }
    }), r.Op._registerDecoder("AddUnique", function(e) {
        return new r.Op.AddUnique(r._decode(void 0, e.objects));
    }), r.Op.Remove = r.Op._extend({
        _initialize: function(e) {
            this._objects = i.uniq(e);
        },
        objects: function() {
            return this._objects;
        },
        toJSON: function() {
            return {
                __op: "Remove",
                objects: r._encode(this.objects())
            };
        },
        _mergeWithPrevious: function(e) {
            if (e) {
                if (e instanceof r.Op.Unset) return e;
                if (e instanceof r.Op.Set) return new r.Op.Set(this._estimate(e.value()));
                if (e instanceof r.Op.Remove) return new r.Op.Remove(i.union(e.objects(), this.objects()));
                throw "Op is invalid after previous op.";
            }
            return this;
        },
        _estimate: function(e) {
            if (e) {
                var t = i.difference(e, this.objects());
                return r._arrayEach(this.objects(), function(e) {
                    e instanceof r.Object && e.id && (t = i.reject(t, function(t) {
                        return t instanceof r.Object && t.id === e.id;
                    }));
                }), t;
            }
            return [];
        }
    }), r.Op._registerDecoder("Remove", function(e) {
        return new r.Op.Remove(r._decode(void 0, e.objects));
    }), r.Op.Relation = r.Op._extend({
        _initialize: function(e, t) {
            this._targetClassName = null;
            var n = this, s = function(e) {
                if (e instanceof r.Object) {
                    if (!e.id) throw "You can't add an unsaved Bmob.Object to a relation.";
                    if (n._targetClassName || (n._targetClassName = e.className), n._targetClassName !== e.className) throw "Tried to create a Bmob.Relation with 2 different types: " + n._targetClassName + " and " + e.className + ".";
                    return e.id;
                }
                return e;
            };
            this.relationsToAdd = i.uniq(i.map(e, s)), this.relationsToRemove = i.uniq(i.map(t, s));
        },
        added: function() {
            var e = this;
            return i.map(this.relationsToAdd, function(t) {
                var n = r.Object._create(e._targetClassName);
                return n.id = t, n;
            });
        },
        removed: function() {
            var e = this;
            return i.map(this.relationsToRemove, function(t) {
                var n = r.Object._create(e._targetClassName);
                return n.id = t, n;
            });
        },
        toJSON: function() {
            var e = null, t = null, n = this, r = function(e) {
                return {
                    __type: "Pointer",
                    className: n._targetClassName,
                    objectId: e
                };
            };
            return this.relationsToAdd.length > 0 && (e = {
                __op: "AddRelation",
                objects: i.map(this.relationsToAdd, r)
            }), this.relationsToRemove.length > 0 && (t = {
                __op: "RemoveRelation",
                objects: i.map(this.relationsToRemove, r)
            }), e && t ? {
                __op: "Batch",
                ops: [ e, t ]
            } : e || t || {};
        },
        _mergeWithPrevious: function(e) {
            if (e) {
                if (e instanceof r.Op.Unset) throw "You can't modify a relation after deleting it.";
                if (e instanceof r.Op.Relation) {
                    if (e._targetClassName && e._targetClassName !== this._targetClassName) throw "Related object must be of class " + e._targetClassName + ", but " + this._targetClassName + " was passed in.";
                    var t = i.union(i.difference(e.relationsToAdd, this.relationsToRemove), this.relationsToAdd), n = i.union(i.difference(e.relationsToRemove, this.relationsToAdd), this.relationsToRemove), s = new r.Op.Relation(t, n);
                    return s._targetClassName = this._targetClassName, s;
                }
                throw "Op is invalid after previous op.";
            }
            return this;
        },
        _estimate: function(e, t, n) {
            if (e) {
                if (e instanceof r.Relation) {
                    if (this._targetClassName) if (e.targetClassName) {
                        if (e.targetClassName !== this._targetClassName) throw "Related object must be a " + e.targetClassName + ", but a " + this._targetClassName + " was passed in.";
                    } else e.targetClassName = this._targetClassName;
                    return e;
                }
                throw "Op is invalid after previous op.";
            }
            new r.Relation(t, n).targetClassName = this._targetClassName;
        }
    }), r.Op._registerDecoder("AddRelation", function(e) {
        return new r.Op.Relation(r._decode(void 0, e.objects), []);
    }), r.Op._registerDecoder("RemoveRelation", function(e) {
        return new r.Op.Relation([], r._decode(void 0, e.objects));
    }), r.Relation = function(e, t) {
        this.parent = e, this.key = t, this.targetClassName = null;
    }, r.Relation.reverseQuery = function(e, t, n) {
        var i = new r.Query(e);
        return i.equalTo(t, n._toPointer()), i;
    }, r.Relation.prototype = {
        _ensureParentAndKey: function(e, t) {
            if (this.parent = this.parent || e, this.key = this.key || t, this.parent !== e) throw "Internal Error. Relation retrieved from two different Objects.";
            if (this.key !== t) throw "Internal Error. Relation retrieved from two different keys.";
        },
        add: function(e) {
            i.isArray(e) || (e = [ e ]);
            var t = new r.Op.Relation(e, []);
            this.parent.set(this.key, t), this.targetClassName = t._targetClassName;
        },
        remove: function(e) {
            i.isArray(e) || (e = [ e ]);
            var t = new r.Op.Relation([], e);
            this.parent.set(this.key, t), this.targetClassName = t._targetClassName;
        },
        toJSON: function() {
            return {
                __type: "Relation",
                className: this.targetClassName
            };
        },
        query: function() {
            var e, t;
            return this.targetClassName ? (e = r.Object._getSubclass(this.targetClassName), 
            t = new r.Query(e)) : (e = r.Object._getSubclass(this.parent.className), t = new r.Query(e), 
            t._extraOptions.redirectClassNameForKey = this.key), t._addCondition("$relatedTo", "object", this.parent._toPointer()), 
            t._addCondition("$relatedTo", "key", this.key), t;
        }
    }, r.Promise = function() {
        this._resolved = !1, this._rejected = !1, this._resolvedCallbacks = [], this._rejectedCallbacks = [];
    }, i.extend(r.Promise, {
        is: function(e) {
            return e && e.then && i.isFunction(e.then);
        },
        as: function() {
            var e = new r.Promise();
            return e.resolve.apply(e, arguments), e;
        },
        error: function() {
            var e = new r.Promise();
            return e.reject.apply(e, arguments), e;
        },
        when: function(e) {
            var t, n = (t = e && r._isNullOrUndefined(e.length) ? arguments : e).length, i = !1, s = [], a = [];
            if (s.length = t.length, a.length = t.length, 0 === n) return r.Promise.as.apply(this, s);
            var o = new r.Promise(), u = function() {
                0 === (n -= 1) && (i ? o.reject(a) : o.resolve.apply(o, s));
            };
            return r._arrayEach(t, function(e, t) {
                r.Promise.is(e) ? e.then(function(e) {
                    s[t] = e, u();
                }, function(e) {
                    a[t] = e, i = !0, u();
                }) : (s[t] = e, u());
            }), o;
        },
        _continueWhile: function(e, t) {
            return e() ? t().then(function() {
                return r.Promise._continueWhile(e, t);
            }) : r.Promise.as();
        }
    }), i.extend(r.Promise.prototype, {
        resolve: function(e) {
            if (this._resolved || this._rejected) throw "A promise was resolved even though it had already been " + (this._resolved ? "resolved" : "rejected") + ".";
            this._resolved = !0, this._result = arguments;
            var t = arguments;
            r._arrayEach(this._resolvedCallbacks, function(e) {
                e.apply(this, t);
            }), this._resolvedCallbacks = [], this._rejectedCallbacks = [];
        },
        reject: function(e) {
            if (this._resolved || this._rejected) throw "A promise was rejected even though it had already been " + (this._resolved ? "resolved" : "rejected") + ".";
            this._rejected = !0, this._error = e, r._arrayEach(this._rejectedCallbacks, function(t) {
                t(e);
            }), this._resolvedCallbacks = [], this._rejectedCallbacks = [];
        },
        then: function(e, t) {
            var n = new r.Promise(), i = function() {
                var t = arguments;
                e && (t = [ e.apply(this, t) ]), 1 === t.length && r.Promise.is(t[0]) ? t[0].then(function() {
                    n.resolve.apply(n, arguments);
                }, function(e) {
                    n.reject(e);
                }) : n.resolve.apply(n, t);
            }, s = function(e) {
                var i = [];
                t ? 1 === (i = [ t(e) ]).length && r.Promise.is(i[0]) ? i[0].then(function() {
                    n.resolve.apply(n, arguments);
                }, function(e) {
                    n.reject(e);
                }) : n.reject(i[0]) : n.reject(e);
            };
            return this._resolved ? i.apply(this, this._result) : this._rejected ? s(this._error) : (this._resolvedCallbacks.push(i), 
            this._rejectedCallbacks.push(s)), n;
        },
        _thenRunCallbacks: function(e, t) {
            var n;
            if (i.isFunction(e)) {
                var s = e;
                n = {
                    success: function(e) {
                        s(e, null);
                    },
                    error: function(e) {
                        s(null, e);
                    }
                };
            } else n = i.clone(e);
            return n = n || {}, this.then(function(e) {
                return n.success ? n.success.apply(this, arguments) : t && t.trigger("sync", t, e, n), 
                r.Promise.as.apply(r.Promise, arguments);
            }, function(e) {
                return n.error ? i.isUndefined(t) ? n.error(e) : n.error(t, e) : t && t.trigger("error", t, e, n), 
                r.Promise.error(e);
            });
        },
        _continueWith: function(e) {
            return this.then(function() {
                return e(arguments, null);
            }, function(t) {
                return e(null, t);
            });
        }
    });
    var o = function(e, t) {
        var n = new r.Promise();
        if ("undefined" == typeof FileReader) return r.Promise.error(new r.Error(-1, "Attempted to use a FileReader on an unsupported browser."));
        var i = new FileReader();
        return i.onloadend = function() {
            n.resolve(i.result);
        }, i.readAsBinaryString(e), n;
    };
    r.File = function(e, t, n) {
        var i = /\.([^.]*)$/.exec(e);
        t = "mp4" == i[1] ? t : t[0], this._name = e;
        var s = r.User.current();
        this._metaData = {
            owner: null != s ? s.id : "unknown"
        }, i && (i = i[1].toLowerCase());
        var a = n || "text/plain";
        this._guessedType = a, "undefined" != typeof File && t instanceof File ? this._source = o(t) : (this._source = r.Promise.as(t, a), 
        this._metaData.size = t.length);
    }, r.File.prototype = {
        name: function() {
            return this._name;
        },
        setName: function(e) {
            this._name = e;
        },
        url: function() {
            return this._url;
        },
        setUrl: function(e) {
            this._url = e;
        },
        cdn: function() {
            return this._cdn;
        },
        metaData: function(e, t) {
            return null != e && null != t ? (this._metaData[e] = t, this) : null != e ? this._metaData[e] : this._metaData;
        },
        destroy: function(e) {
            if (!this._url && !this._cdn) return r.Promise.error("The file url and cdn is not eixsts.")._thenRunCallbacks(e);
            var t = {
                cdn: this._cdn,
                _ContentType: "application/json",
                url: this._url,
                metaData: self._metaData
            };
            return r._request("2/files", null, null, "DELETE", t)._thenRunCallbacks(e);
        },
        save: function(e) {
            var t = this;
            if (!t._previousSave) {
                if (!t._source) throw "not source file";
                t._previousSave = t._source.then(function(e, n) {
                    var i = {
                        base64: e,
                        _ContentType: "text/plain",
                        mime_type: "text/plain",
                        metaData: t._metaData,
                        category: "wechatApp"
                    };
                    return t._metaData.size || (t._metaData.size = e.length), r._request("2/files", t._name, null, "POST", i);
                }).then(function(e) {
                    return t._name = e.filename, t._url = e.url, t._cdn = e.cdn, t;
                });
            }
            return t._previousSave._thenRunCallbacks(e);
        }
    }, r.Files = r.Files || {}, r.Files.del = function(e, t) {
        var n = e.split(".com");
        if (!n) return r.Promise.error("The file url and cdn is not eixsts.")._thenRunCallbacks(t);
        var i = {
            _ContentType: "application/json"
        };
        return r._request("2/files/upyun", n[1], null, "DELETE", i).then(function(e) {
            return r._decode(null, e);
        })._thenRunCallbacks(t);
    }, r.Object = function(e, t) {
        if (i.isString(e)) return r.Object._create.apply(this, arguments);
        e = e || {}, t && t.parse && (e = this.parse(e));
        var n = r._getValue(this, "defaults");
        if (n && (e = i.extend({}, n, e)), t && t.collection && (this.collection = t.collection), 
        this._serverData = {}, this._opSetQueue = [ {} ], this.attributes = {}, this._hashedJSON = {}, 
        this._escapedAttributes = {}, this.cid = i.uniqueId("c"), this.changed = {}, this._silent = {}, 
        this._pending = {}, !this.set(e, {
            silent: !0
        })) throw new Error("Can't create an invalid Bmob.Object");
        this.changed = {}, this._silent = {}, this._pending = {}, this._hasData = !0, this._previousAttributes = i.clone(this.attributes), 
        this.initialize.apply(this, arguments);
    }, r.Object.saveAll = function(e, t) {
        return r.Object._deepSaveAsync(e)._thenRunCallbacks(t);
    }, i.extend(r.Object.prototype, r.Events, {
        _existed: !1,
        _fetchWhenSave: !1,
        initialize: function() {},
        fetchWhenSave: function(e) {
            if ("boolean" != typeof e) throw "Expect boolean value for fetchWhenSave";
            this._fetchWhenSave = e;
        },
        toJSON: function() {
            var e = this._toFullJSON();
            return r._arrayEach([ "__type", "className" ], function(t) {
                delete e[t];
            }), e;
        },
        _toFullJSON: function(e) {
            var t = i.clone(this.attributes);
            return r._objectEach(t, function(n, i) {
                t[i] = r._encode(n, e);
            }), r._objectEach(this._operations, function(e, n) {
                t[n] = e;
            }), i.has(this, "id") && (t.objectId = this.id), i.has(this, "createdAt") && (i.isDate(this.createdAt) ? t.createdAt = this.createdAt.toJSON() : t.createdAt = this.createdAt), 
            i.has(this, "updatedAt") && (i.isDate(this.updatedAt) ? t.updatedAt = this.updatedAt.toJSON() : t.updatedAt = this.updatedAt), 
            t.__type = "Object", t.className = this.className, t;
        },
        _refreshCache: function() {
            var e = this;
            e._refreshingCache || (e._refreshingCache = !0, r._objectEach(this.attributes, function(t, n) {
                t instanceof r.Object ? t._refreshCache() : i.isObject(t) && e._resetCacheForKey(n) && e.set(n, new r.Op.Set(t), {
                    silent: !0
                });
            }), delete e._refreshingCache);
        },
        dirty: function(e) {
            this._refreshCache();
            var t = i.last(this._opSetQueue);
            return e ? !!t[e] : !this.id || i.keys(t).length > 0;
        },
        _toPointer: function() {
            return {
                __type: "Pointer",
                className: this.className,
                objectId: this.id
            };
        },
        get: function(e) {
            return this.attributes[e];
        },
        relation: function(e) {
            var t = this.get(e);
            if (t) {
                if (!(t instanceof r.Relation)) throw "Called relation() on non-relation field " + e;
                return t._ensureParentAndKey(this, e), t;
            }
            return new r.Relation(this, e);
        },
        escape: function(e) {
            var t = this._escapedAttributes[e];
            if (t) return t;
            var n, s = this.attributes[e];
            return n = r._isNullOrUndefined(s) ? "" : i.escape(s.toString()), this._escapedAttributes[e] = n, 
            n;
        },
        has: function(e) {
            return !r._isNullOrUndefined(this.attributes[e]);
        },
        _mergeMagicFields: function(e) {
            var t = this, n = [ "id", "objectId", "createdAt", "updatedAt" ];
            r._arrayEach(n, function(n) {
                e[n] && ("objectId" === n ? t.id = e[n] : t[n] = e[n], delete e[n]);
            });
        },
        _startSave: function() {
            this._opSetQueue.push({});
        },
        _cancelSave: function() {
            var e = i.first(this._opSetQueue);
            this._opSetQueue = i.rest(this._opSetQueue);
            var t = i.first(this._opSetQueue);
            r._objectEach(e, function(n, i) {
                var r = e[i], s = t[i];
                r && s ? t[i] = s._mergeWithPrevious(r) : r && (t[i] = r);
            }), this._saving = this._saving - 1;
        },
        _finishSave: function(e) {
            var t = {};
            r._traverse(this.attributes, function(e) {
                e instanceof r.Object && e.id && e._hasData && (t[e.id] = e);
            });
            var n = i.first(this._opSetQueue);
            this._opSetQueue = i.rest(this._opSetQueue), this._applyOpSet(n, this._serverData), 
            this._mergeMagicFields(e);
            var s = this;
            r._objectEach(e, function(e, n) {
                s._serverData[n] = r._decode(n, e);
                var i = r._traverse(s._serverData[n], function(e) {
                    if (e instanceof r.Object && t[e.id]) return t[e.id];
                });
                i && (s._serverData[n] = i);
            }), this._rebuildAllEstimatedData(), this._saving = this._saving - 1;
        },
        _finishFetch: function(e, t) {
            this._opSetQueue = [ {} ], this._mergeMagicFields(e);
            var n = this;
            r._objectEach(e, function(e, t) {
                "Object" != e.__type ? n._serverData[t] = r._decode(t, e) : n._serverData[t] = e;
            }), this._rebuildAllEstimatedData(), this._refreshCache(), this._opSetQueue = [ {} ], 
            this._hasData = t;
        },
        _applyOpSet: function(e, t) {
            var n = this;
            r._objectEach(e, function(e, i) {
                t[i] = e._estimate(t[i], n, i), t[i] === r.Op._UNSET && delete t[i];
            });
        },
        _resetCacheForKey: function(e) {
            var t = this.attributes[e];
            if (i.isObject(t) && !(t instanceof r.Object) && !(t instanceof r.File)) {
                t = t.toJSON ? t.toJSON() : t;
                var n = JSON.stringify(t);
                if (this._hashedJSON[e] !== n) return this._hashedJSON[e] = n, !0;
            }
            return !1;
        },
        _rebuildEstimatedDataForKey: function(e) {
            var t = this;
            delete this.attributes[e], this._serverData[e] && (this.attributes[e] = this._serverData[e]), 
            r._arrayEach(this._opSetQueue, function(n) {
                var i = n[e];
                i && (t.attributes[e] = i._estimate(t.attributes[e], t, e), t.attributes[e] === r.Op._UNSET ? delete t.attributes[e] : t._resetCacheForKey(e));
            });
        },
        _rebuildAllEstimatedData: function() {
            var e = this, t = i.clone(this.attributes);
            this.attributes = i.clone(this._serverData), r._arrayEach(this._opSetQueue, function(t) {
                e._applyOpSet(t, e.attributes), r._objectEach(t, function(t, n) {
                    e._resetCacheForKey(n);
                });
            }), r._objectEach(t, function(t, n) {
                e.attributes[n] !== t && e.trigger("change:" + n, e, e.attributes[n], {});
            }), r._objectEach(this.attributes, function(n, r) {
                i.has(t, r) || e.trigger("change:" + r, e, n, {});
            });
        },
        set: function(e, t, n) {
            var s;
            if (i.isObject(e) || r._isNullOrUndefined(e) ? (s = e, r._objectEach(s, function(e, t) {
                s[t] = r._decode(t, e);
            }), n = t) : (s = {})[e] = r._decode(e, t), n = n || {}, !s) return this;
            s instanceof r.Object && (s = s.attributes), n.unset && r._objectEach(s, function(e, t) {
                s[t] = new r.Op.Unset();
            });
            var a = i.clone(s), o = this;
            if (r._objectEach(a, function(e, t) {
                e instanceof r.Op && (a[t] = e._estimate(o.attributes[t], o, t), a[t] === r.Op._UNSET && delete a[t]);
            }), !this._validate(s, n)) return !1;
            this._mergeMagicFields(s), n.changes = {};
            var u = this._escapedAttributes;
            this._previousAttributes;
            return r._arrayEach(i.keys(s), function(e) {
                var t = s[e];
                t instanceof r.Relation && (t.parent = o), t instanceof r.Op || (t = new r.Op.Set(t));
                var a = !0;
                t instanceof r.Op.Set && i.isEqual(o.attributes[e], t.value) && (a = !1), a && (delete u[e], 
                n.silent ? o._silent[e] = !0 : n.changes[e] = !0);
                var c = i.last(o._opSetQueue);
                c[e] = t._mergeWithPrevious(c[e]), o._rebuildEstimatedDataForKey(e), a ? (o.changed[e] = o.attributes[e], 
                n.silent || (o._pending[e] = !0)) : (delete o.changed[e], delete o._pending[e]);
            }), n.silent || this.change(n), this;
        },
        unset: function(e, t) {
            return t = t || {}, t.unset = !0, this.set(e, null, t);
        },
        increment: function(e, t) {
            return (i.isUndefined(t) || i.isNull(t)) && (t = 1), this.set(e, new r.Op.Increment(t));
        },
        add: function(e, t) {
            return this.set(e, new r.Op.Add([ t ]));
        },
        addUnique: function(e, t) {
            return this.set(e, new r.Op.AddUnique([ t ]));
        },
        remove: function(e, t) {
            return this.set(e, new r.Op.Remove([ t ]));
        },
        op: function(e) {
            return i.last(this._opSetQueue)[e];
        },
        clear: function(e) {
            (e = e || {}).unset = !0;
            var t = i.extend(this.attributes, this._operations);
            return this.set(t, e);
        },
        _getSaveJSON: function() {
            var e = i.clone(i.first(this._opSetQueue));
            return r._objectEach(e, function(t, n) {
                e[n] = t.toJSON();
            }), e;
        },
        _canBeSerialized: function() {
            return r.Object._canBeSerializedAsValue(this.attributes);
        },
        fetch: function(e) {
            var t = this;
            return r._request("classes", this.className, this.id, "GET").then(function(e, n, i) {
                return t._finishFetch(t.parse(e, n, i), !0), t;
            })._thenRunCallbacks(e, this);
        },
        save: function(e, t, n) {
            var s, a, o;
            if (i.isObject(e) || r._isNullOrUndefined(e) ? (s = e, o = t) : ((s = {})[e] = t, 
            o = n), !o && s && 0 === i.reject(s, function(e, t) {
                return i.include([ "success", "error", "wait" ], t);
            }).length) {
                var u = !0;
                if (i.has(s, "success") && !i.isFunction(s.success) && (u = !1), i.has(s, "error") && !i.isFunction(s.error) && (u = !1), 
                u) return this.save(null, s);
            }
            (o = i.clone(o) || {}).wait && (a = i.clone(this.attributes));
            var c = i.clone(o) || {};
            c.wait && (c.silent = !0);
            var h;
            if (c.error = function(e, t) {
                h = t;
            }, s && !this.set(s, c)) return r.Promise.error(h)._thenRunCallbacks(o, this);
            var l = this;
            l._refreshCache();
            var d = [], _ = [];
            return r.Object._findUnsavedChildren(l.attributes, d, _), d.length + _.length > 0 ? r.Object._deepSaveAsync(this.attributes).then(function() {
                return l.save(null, o);
            }, function(e) {
                return r.Promise.error(e)._thenRunCallbacks(o, l);
            }) : (this._startSave(), this._saving = (this._saving || 0) + 1, this._allPreviousSaves = this._allPreviousSaves || r.Promise.as(), 
            this._allPreviousSaves = this._allPreviousSaves._continueWith(function() {
                var e = l.id ? "PUT" : "POST", t = l._getSaveJSON();
                "PUT" === e && l._fetchWhenSave && (t._fetchWhenSave = !0);
                var n = "classes", u = l.className;
                "_User" !== l.className || l.id || (n = "users", u = null);
                var h = r._request(n, u, l.id, e, t);
                return h = h.then(function(e, t, n) {
                    var r = l.parse(e, t, n);
                    return o.wait && (r = i.extend(s || {}, r)), l._finishSave(r), o.wait && l.set(a, c), 
                    l;
                }, function(e) {
                    return l._cancelSave(), r.Promise.error(e);
                })._thenRunCallbacks(o, l);
            }), this._allPreviousSaves);
        },
        destroy: function(e) {
            e = e || {};
            var t = this, n = function() {
                t.trigger("destroy", t, t.collection, e);
            };
            return this.id ? (e.wait || n(), r._request("classes", this.className, this.id, "DELETE").then(function() {
                return e.wait && n(), t;
            })._thenRunCallbacks(e, this)) : n();
        },
        parse: function(e, t, n) {
            var r = i.clone(e);
            return i([ "createdAt", "updatedAt" ]).each(function(e) {
                r[e] && (r[e] = r[e]);
            }), r.updatedAt || (r.updatedAt = r.createdAt), t && (this._existed = 201 !== t), 
            r;
        },
        clone: function() {
            return new this.constructor(this.attributes);
        },
        isNew: function() {
            return !this.id;
        },
        change: function(e) {
            e = e || {};
            var t = this._changing;
            this._changing = !0;
            var n = this;
            r._objectEach(this._silent, function(e) {
                n._pending[e] = !0;
            });
            var s = i.extend({}, e.changes, this._silent);
            if (this._silent = {}, r._objectEach(s, function(t, i) {
                n.trigger("change:" + i, n, n.get(i), e);
            }), t) return this;
            for (;!i.isEmpty(this._pending); ) this._pending = {}, this.trigger("change", this, e), 
            r._objectEach(this.changed, function(e, t) {
                n._pending[t] || n._silent[t] || delete n.changed[t];
            }), n._previousAttributes = i.clone(this.attributes);
            return this._changing = !1, this;
        },
        existed: function() {
            return this._existed;
        },
        hasChanged: function(e) {
            return arguments.length ? this.changed && i.has(this.changed, e) : !i.isEmpty(this.changed);
        },
        changedAttributes: function(e) {
            if (!e) return !!this.hasChanged() && i.clone(this.changed);
            var t = {}, n = this._previousAttributes;
            return r._objectEach(e, function(e, r) {
                i.isEqual(n[r], e) || (t[r] = e);
            }), t;
        },
        previous: function(e) {
            return arguments.length && this._previousAttributes ? this._previousAttributes[e] : null;
        },
        previousAttributes: function() {
            return i.clone(this._previousAttributes);
        },
        isValid: function() {
            return !this.validate(this.attributes);
        },
        validate: function(e, t) {
            return !(!i.has(e, "ACL") || e.ACL instanceof r.ACL) && new r.Error(r.Error.OTHER_CAUSE, "ACL must be a Bmob.ACL.");
        },
        _validate: function(e, t) {
            if (t.silent || !this.validate) return !0;
            e = i.extend({}, this.attributes, e);
            var n = this.validate(e, t);
            return !n || (t && t.error ? t.error(this, n, t) : this.trigger("error", this, n, t), 
            !1);
        },
        getACL: function() {
            return this.get("ACL");
        },
        setACL: function(e, t) {
            return this.set("ACL", e, t);
        }
    }), r.Object.createWithoutData = function(e, t, n) {
        var i = new r.Object(e);
        return i.id = t, i._hasData = n, i;
    }, r.Object.destroyAll = function(e, t) {
        if (null == e || 0 == e.length) return r.Promise.as()._thenRunCallbacks(t);
        var n = e[0].className, s = "", a = !0;
        e.forEach(function(e) {
            if (e.className != n) throw "Bmob.Object.destroyAll requires the argument object array's classNames must be the same";
            if (!e.id) throw "Could not delete unsaved object";
            a ? (s = e.id, a = !1) : s = s + "," + e.id;
        });
        var o = i.map(e, function(e) {
            e._getSaveJSON();
            var t = "POST", n = "/1/classes/" + e.className;
            return e.id && (n = n + "/" + e.id, t = "DELETE"), e._startSave(), {
                method: t,
                path: n
            };
        });
        return r._request("batch", null, null, "POST", {
            requests: o
        })._thenRunCallbacks(t);
    }, r.Object._getSubclass = function(e) {
        if (!i.isString(e)) throw "Bmob.Object._getSubclass requires a string argument.";
        var t = r.Object._classMap[e];
        return t || (t = r.Object.extend(e), r.Object._classMap[e] = t), t;
    }, r.Object._create = function(e, t, n) {
        return new (r.Object._getSubclass(e))(t, n);
    }, r.Object._classMap = {}, r.Object._extend = r._extend, r.Object.extend = function(e, t, n) {
        if (!i.isString(e)) {
            if (e && i.has(e, "className")) return r.Object.extend(e.className, e, t);
            throw new Error("Bmob.Object.extend's first argument should be the className.");
        }
        "User" === e && (e = "_User");
        var s = null;
        if (i.has(r.Object._classMap, e)) {
            var a = r.Object._classMap[e];
            s = a._extend(t, n);
        } else (t = t || {}).className = e, s = this._extend(t, n);
        return s.extend = function(t) {
            if (i.isString(t) || t && i.has(t, "className")) return r.Object.extend.apply(s, arguments);
            var n = [ e ].concat(r._.toArray(arguments));
            return r.Object.extend.apply(s, n);
        }, r.Object._classMap[e] = s, s;
    }, r.Object._findUnsavedChildren = function(e, t, n) {
        r._traverse(e, function(e) {
            if (e instanceof r.Object) return e._refreshCache(), void (e.dirty() && t.push(e));
            e instanceof r.File && (e.url() || n.push(e));
        });
    }, r.Object._canBeSerializedAsValue = function(e) {
        var t = !0;
        return e instanceof r.Object ? t = !!e.id : i.isArray(e) ? r._arrayEach(e, function(e) {
            r.Object._canBeSerializedAsValue(e) || (t = !1);
        }) : i.isObject(e) && r._objectEach(e, function(e) {
            r.Object._canBeSerializedAsValue(e) || (t = !1);
        }), t;
    }, r.Object._deepSaveAsync = function(e) {
        var t = [], n = [];
        r.Object._findUnsavedChildren(e, t, n);
        var s = r.Promise.as();
        i.each(n, function(e) {
            s = s.then(function() {
                return e.save();
            });
        });
        var a = i.uniq(t), o = i.uniq(a);
        return s.then(function() {
            return r.Promise._continueWhile(function() {
                return o.length > 0;
            }, function() {
                var e = [], t = [];
                if (r._arrayEach(o, function(n) {
                    e.length > 20 ? t.push(n) : n._canBeSerialized() ? e.push(n) : t.push(n);
                }), o = t, 0 === e.length) return r.Promise.error(new r.Error(r.Error.OTHER_CAUSE, "Tried to save a batch with a cycle."));
                var n = r.Promise.when(i.map(e, function(e) {
                    return e._allPreviousSaves || r.Promise.as();
                })), s = new r.Promise();
                return r._arrayEach(e, function(e) {
                    e._allPreviousSaves = s;
                }), n._continueWith(function() {
                    return r._request("batch", null, null, "POST", {
                        requests: i.map(e, function(e) {
                            var t = e._getSaveJSON(), n = "POST", i = "/1/classes/" + e.className;
                            return e.id && (i = i + "/" + e.id, n = "PUT"), e._startSave(), {
                                method: n,
                                path: i,
                                body: t
                            };
                        })
                    }).then(function(t, n, i) {
                        var s;
                        if (r._arrayEach(e, function(e, r) {
                            t[r].success ? e._finishSave(e.parse(t[r].success, n, i)) : (s = s || t[r].error, 
                            e._cancelSave());
                        }), s) return r.Promise.error(new r.Error(s.code, s.error));
                    }).then(function(e) {
                        return s.resolve(e), e;
                    }, function(e) {
                        return s.reject(e), r.Promise.error(e);
                    });
                });
            });
        }).then(function() {
            return e;
        });
    }, r.Role = r.Object.extend("_Role", {
        constructor: function(e, t) {
            i.isString(e) && t instanceof r.ACL ? (r.Object.prototype.constructor.call(this, null, null), 
            this.setName(e), this.setACL(t)) : r.Object.prototype.constructor.call(this, e, t);
        },
        getName: function() {
            return this.get("name");
        },
        setName: function(e, t) {
            return this.set("name", e, t);
        },
        getUsers: function() {
            return this.relation("users");
        },
        getRoles: function() {
            return this.relation("roles");
        },
        validate: function(e, t) {
            if ("name" in e && e.name !== this.getName()) {
                var n = e.name;
                if (this.id && this.id !== e.objectId) return new r.Error(r.Error.OTHER_CAUSE, "A role's name can only be set before it has been saved.");
                if (!i.isString(n)) return new r.Error(r.Error.OTHER_CAUSE, "A role's name must be a String.");
                if (!/^[0-9a-zA-Z\-_ ]+$/.test(n)) return new r.Error(r.Error.OTHER_CAUSE, "A role's name can only contain alphanumeric characters, _, -, and spaces.");
            }
            return !!r.Object.prototype.validate && r.Object.prototype.validate.call(this, e, t);
        }
    }), r.Collection = function(e, t) {
        (t = t || {}).comparator && (this.comparator = t.comparator), t.model && (this.model = t.model), 
        t.query && (this.query = t.query), this._reset(), this.initialize.apply(this, arguments), 
        e && this.reset(e, {
            silent: !0,
            parse: t.parse
        });
    }, i.extend(r.Collection.prototype, r.Events, {
        model: r.Object,
        initialize: function() {},
        toJSON: function() {
            return this.map(function(e) {
                return e.toJSON();
            });
        },
        add: function(e, t) {
            var n, s, a, o, u, c, h = {}, l = {};
            for (t = t || {}, n = 0, a = (e = i.isArray(e) ? e.slice() : [ e ]).length; n < a; n++) {
                if (e[n] = this._prepareModel(e[n], t), !(o = e[n])) throw new Error("Can't add an invalid model to a collection");
                if (u = o.cid, h[u] || this._byCid[u]) throw new Error("Duplicate cid: can't add the same model to a collection twice");
                if (c = o.id, !r._isNullOrUndefined(c) && (l[c] || this._byId[c])) throw new Error("Duplicate id: can't add the same model to a collection twice");
                l[c] = o, h[u] = o;
            }
            for (n = 0; n < a; n++) (o = e[n]).on("all", this._onModelEvent, this), this._byCid[o.cid] = o, 
            o.id && (this._byId[o.id] = o);
            if (this.length += a, s = r._isNullOrUndefined(t.at) ? this.models.length : t.at, 
            this.models.splice.apply(this.models, [ s, 0 ].concat(e)), this.comparator && this.sort({
                silent: !0
            }), t.silent) return this;
            for (n = 0, a = this.models.length; n < a; n++) h[(o = this.models[n]).cid] && (t.index = n, 
            o.trigger("add", o, this, t));
            return this;
        },
        remove: function(e, t) {
            var n, r, s, a;
            for (t = t || {}, n = 0, r = (e = i.isArray(e) ? e.slice() : [ e ]).length; n < r; n++) (a = this.getByCid(e[n]) || this.get(e[n])) && (delete this._byId[a.id], 
            delete this._byCid[a.cid], s = this.indexOf(a), this.models.splice(s, 1), this.length--, 
            t.silent || (t.index = s, a.trigger("remove", a, this, t)), this._removeReference(a));
            return this;
        },
        get: function(e) {
            return e && this._byId[e.id || e];
        },
        getByCid: function(e) {
            return e && this._byCid[e.cid || e];
        },
        at: function(e) {
            return this.models[e];
        },
        sort: function(e) {
            if (e = e || {}, !this.comparator) throw new Error("Cannot sort a set without a comparator");
            var t = i.bind(this.comparator, this);
            return 1 === this.comparator.length ? this.models = this.sortBy(t) : this.models.sort(t), 
            e.silent || this.trigger("reset", this, e), this;
        },
        pluck: function(e) {
            return i.map(this.models, function(t) {
                return t.get(e);
            });
        },
        reset: function(e, t) {
            var n = this;
            return e = e || [], t = t || {}, r._arrayEach(this.models, function(e) {
                n._removeReference(e);
            }), this._reset(), this.add(e, {
                silent: !0,
                parse: t.parse
            }), t.silent || this.trigger("reset", this, t), this;
        },
        fetch: function(e) {
            void 0 === (e = i.clone(e) || {}).parse && (e.parse = !0);
            var t = this;
            return (this.query || new r.Query(this.model)).find().then(function(n) {
                return e.add ? t.add(n, e) : t.reset(n, e), t;
            })._thenRunCallbacks(e, this);
        },
        create: function(e, t) {
            var n = this;
            if (t = t ? i.clone(t) : {}, !(e = this._prepareModel(e, t))) return !1;
            t.wait || n.add(e, t);
            var r = t.success;
            return t.success = function(i, s, a) {
                t.wait && n.add(i, t), r ? r(i, s) : i.trigger("sync", e, s, t);
            }, e.save(null, t), e;
        },
        parse: function(e, t) {
            return e;
        },
        chain: function() {
            return i(this.models).chain();
        },
        _reset: function(e) {
            this.length = 0, this.models = [], this._byId = {}, this._byCid = {};
        },
        _prepareModel: function(e, t) {
            if (e instanceof r.Object) e.collection || (e.collection = this); else {
                var n = e;
                t.collection = this, (e = new this.model(n, t))._validate(e.attributes, t) || (e = !1);
            }
            return e;
        },
        _removeReference: function(e) {
            this === e.collection && delete e.collection, e.off("all", this._onModelEvent, this);
        },
        _onModelEvent: function(e, t, n, i) {
            ("add" !== e && "remove" !== e || n === this) && ("destroy" === e && this.remove(t, i), 
            t && "change:objectId" === e && (delete this._byId[t.previous("objectId")], this._byId[t.id] = t), 
            this.trigger.apply(this, arguments));
        }
    });
    var u = [ "forEach", "each", "map", "reduce", "reduceRight", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "sortBy", "sortedIndex", "toArray", "size", "first", "initial", "rest", "last", "without", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "groupBy" ];
    r._arrayEach(u, function(e) {
        r.Collection.prototype[e] = function() {
            return i[e].apply(i, [ this.models ].concat(i.toArray(arguments)));
        };
    }), r.Collection.extend = r._extend, r.View = function(e) {
        this.cid = i.uniqueId("view"), this._configure(e || {}), this._ensureElement(), 
        this.initialize.apply(this, arguments), this.delegateEvents();
    };
    var c = /^(\S+)\s*(.*)$/, h = [ "model", "collection", "el", "id", "attributes", "className", "tagName" ];
    i.extend(r.View.prototype, r.Events, {
        tagName: "div",
        $: function(e) {
            return this.$el.find(e);
        },
        initialize: function() {},
        render: function() {
            return this;
        },
        remove: function() {
            return this.$el.remove(), this;
        },
        make: function(e, t, n) {
            var i = document.createElement(e);
            return t && r.$(i).attr(t), n && r.$(i).html(n), i;
        },
        setElement: function(e, t) {
            return this.$el = r.$(e), this.el = this.$el[0], !1 !== t && this.delegateEvents(), 
            this;
        },
        delegateEvents: function(e) {
            if (e = e || r._getValue(this, "events")) {
                this.undelegateEvents();
                var t = this;
                r._objectEach(e, function(n, r) {
                    if (i.isFunction(n) || (n = t[e[r]]), !n) throw new Error('Event "' + e[r] + '" does not exist');
                    var s = r.match(c), a = s[1], o = s[2];
                    n = i.bind(n, t), a += ".delegateEvents" + t.cid, "" === o ? t.$el.bind(a, n) : t.$el.delegate(o, a, n);
                });
            }
        },
        undelegateEvents: function() {
            this.$el.unbind(".delegateEvents" + this.cid);
        },
        _configure: function(e) {
            this.options && (e = i.extend({}, this.options, e));
            var t = this;
            i.each(h, function(n) {
                e[n] && (t[n] = e[n]);
            }), this.options = e;
        },
        _ensureElement: function() {
            if (this.el) this.setElement(this.el, !1); else {
                var e = r._getValue(this, "attributes") || {};
                this.id && (e.id = this.id), this.className && (e.class = this.className), this.setElement(this.make(this.tagName, e), !1);
            }
        }
    }), r.View.extend = r._extend, r.User = r.Object.extend("_User", {
        _isCurrentUser: !1,
        _mergeMagicFields: function(e) {
            e.sessionToken && (this._sessionToken = e.sessionToken, delete e.sessionToken), 
            r.User.__super__._mergeMagicFields.call(this, e);
        },
        _cleanupAuthData: function() {
            if (this.isCurrent()) {
                var e = this.get("authData");
                e && r._objectEach(this.get("authData"), function(t, n) {
                    e[n] || delete e[n];
                });
            }
        },
        _synchronizeAllAuthData: function() {
            if (this.get("authData")) {
                var e = this;
                r._objectEach(this.get("authData"), function(t, n) {
                    e._synchronizeAuthData(n);
                });
            }
        },
        _synchronizeAuthData: function(e) {
            if (this.isCurrent()) {
                var t;
                i.isString(e) ? (t = e, e = r.User._authProviders[t]) : t = e.getAuthType();
                var n = this.get("authData");
                n && e && (e.restoreAuthentication(n[t]) || this._unlinkFrom(e));
            }
        },
        _handleSaveResult: function(e) {
            e && (this._isCurrentUser = !0), this._cleanupAuthData(), this._synchronizeAllAuthData(), 
            delete this._serverData.password, this._rebuildEstimatedDataForKey("password"), 
            this._refreshCache(), (e || this.isCurrent()) && r.User._saveCurrentUser(this);
        },
        _linkWith: function(e, t) {
            var n, s = this;
            if (i.isString(e) ? (n = e, e = r.User._authProviders[e]) : n = e.getAuthType(), 
            !t) return e.authenticate().then(function(t) {
                return s._linkWith(e, t);
            });
            var a = this.get("authData") || {};
            a[n] = t, this.set("authData", a);
            var o = new r.Promise();
            return this.save({
                authData: a
            }, u).then(function(e) {
                e._handleSaveResult(!0), o.resolve(e);
            }), o._thenRunCallbacks({});
            var u;
        },
        loginWithWeapp: function(e) {
            var t = new r.Promise();
            return r.User.requestOpenId(e, {
                success: function(e) {
                    r.Object._create("_User")._linkWith("weapp", e).then(function(e) {
                        t.resolve(e);
                    }, function(e) {
                        t.reject(e);
                    });
                },
                error: function(e) {
                    t.reject(e);
                }
            }), t._thenRunCallbacks({});
        },
        auth: function() {
            var e = this;
            wx.checkSession({
                success: function() {},
                fail: function() {
                    wx.login({
                        success: function(t) {
                            e.loginWithWeapp(t.code).then(function(e) {
                                var t = e.get("authData").weapp.openid;
                                wx.setStorageSync("openid", t), wx.getUserInfo({
                                    success: function(n) {
                                        var i = n.userInfo, s = i.nickName, a = i.avatarUrl, o = r.Object.extend("_User");
                                        new r.Query(o).get(e.id, {
                                            success: function(e) {
                                                e.set("nickName", s), e.set("userPic", a), e.set("openid", t), e.save();
                                            }
                                        });
                                    }
                                });
                            }, function(e) {
                                console.log(e, "errr");
                            });
                        }
                    });
                }
            });
        },
        _unlinkFrom: function(e, t) {
            i.isString(e) ? (e, e = r.User._authProviders[e]) : e.getAuthType();
            var n = i.clone(t), s = this;
            return n.authData = null, n.success = function(n) {
                s._synchronizeAuthData(e), t.success && t.success.apply(this, arguments);
            }, this._linkWith(e, n);
        },
        _isLinked: function(e) {
            var t;
            return t = i.isString(e) ? e : e.getAuthType(), !!(this.get("authData") || {})[t];
        },
        _logOutWithAll: function() {
            if (this.get("authData")) {
                var e = this;
                r._objectEach(this.get("authData"), function(t, n) {
                    e._logOutWith(n);
                });
            }
        },
        _logOutWith: function(e) {
            this.isCurrent() && (i.isString(e) && (e = r.User._authProviders[e]), e && e.deauthenticate && e.deauthenticate());
        },
        signUp: function(e, t) {
            var n;
            t = t || {};
            var s = e && e.username || this.get("username");
            if (!s || "" === s) return n = new r.Error(r.Error.OTHER_CAUSE, "Cannot sign up user with an empty name."), 
            t && t.error && t.error(this, n), r.Promise.error(n);
            var a = e && e.password || this.get("password");
            if (!a || "" === a) return n = new r.Error(r.Error.OTHER_CAUSE, "Cannot sign up user with an empty password."), 
            t && t.error && t.error(this, n), r.Promise.error(n);
            var o = i.clone(t);
            return o.success = function(e) {
                e._handleSaveResult(!0), t.success && t.success.apply(this, arguments);
            }, this.save(e, o);
        },
        logIn: function(e) {
            var t = this;
            return r._request("login", null, null, "GET", this.toJSON()).then(function(e, n, i) {
                var r = t.parse(e, n, i);
                return t._finishFetch(r), t._handleSaveResult(!0), t;
            })._thenRunCallbacks(e, this);
        },
        save: function(e, t, n) {
            var s, a;
            i.isObject(e) || i.isNull(e) || i.isUndefined(e) ? (s = e, a = t) : ((s = {})[e] = t, 
            a = n), a = a || {};
            var o = i.clone(a);
            return o.success = function(e) {
                e._handleSaveResult(!1), a.success && a.success.apply(this, arguments);
            }, r.Object.prototype.save.call(this, s, o);
        },
        fetch: function(e) {
            var t = e ? i.clone(e) : {};
            return t.success = function(t) {
                t._handleSaveResult(!1), e && e.success && e.success.apply(this, arguments);
            }, r.Object.prototype.fetch.call(this, t);
        },
        isCurrent: function() {
            return this._isCurrentUser;
        },
        getUsername: function() {
            return this.get("username");
        },
        setUsername: function(e, t) {
            return this.set("username", e, t);
        },
        setPassword: function(e, t) {
            return this.set("password", e, t);
        },
        getEmail: function() {
            return this.get("email");
        },
        setEmail: function(e, t) {
            return this.set("email", e, t);
        },
        authenticated: function() {
            return !!this._sessionToken && r.User.current() && r.User.current().id === this.id;
        }
    }, {
        _currentUser: null,
        _currentUserMatchesDisk: !1,
        _CURRENT_USER_KEY: "currentUser",
        _authProviders: {},
        signUp: function(e, t, n, i) {
            return (n = n || {}).username = e, n.password = t, r.Object._create("_User").signUp(n, i);
        },
        logIn: function(e, t, n) {
            var i = r.Object._create("_User");
            return i._finishFetch({
                username: e,
                password: t
            }), i.logIn(n);
        },
        logOut: function() {
            null !== r.User._currentUser && (r.User._currentUser._logOutWithAll(), r.User._currentUser._isCurrentUser = !1), 
            r.User._currentUserMatchesDisk = !0, r.User._currentUser = null, wx.removeStorage({
                key: r._getBmobPath(r.User._CURRENT_USER_KEY),
                success: function(e) {
                    console.log(e.data);
                }
            });
        },
        requestPasswordReset: function(e, t) {
            var n = {
                email: e
            };
            return r._request("requestPasswordReset", null, null, "POST", n)._thenRunCallbacks(t);
        },
        requestEmailVerify: function(e, t) {
            var n = {
                email: e
            };
            return r._request("requestEmailVerify", null, null, "POST", n)._thenRunCallbacks(t);
        },
        requestOpenId: function(e, t) {
            var n = {
                code: e
            };
            return r._request("wechatApp", e, null, "POST", n)._thenRunCallbacks(t);
        },
        current: function() {
            if (r.User._currentUser) return r.User._currentUser;
            if (r.User._currentUserMatchesDisk) return r.User._currentUser;
            r.User._currentUserMatchesDisk = !0;
            var e = !1;
            try {
                if (e = wx.getStorageSync(r._getBmobPath(r.User._CURRENT_USER_KEY))) {
                    r.User._currentUser = r.Object._create("_User"), r.User._currentUser._isCurrentUser = !0;
                    var t = JSON.parse(e);
                    return r.User._currentUser.id = t._id, delete t._id, r.User._currentUser._sessionToken = t._sessionToken, 
                    delete t._sessionToken, r.User._currentUser.set(t), r.User._currentUser._synchronizeAllAuthData(), 
                    r.User._currentUser._refreshCache(), r.User._currentUser._opSetQueue = [ {} ], r.User._currentUser;
                }
            } catch (e) {
                return null;
            }
        },
        _saveCurrentUser: function(e) {
            r.User._currentUser !== e && r.User.logOut(), e._isCurrentUser = !0, r.User._currentUser = e, 
            r.User._currentUserMatchesDisk = !0;
            var t = e.toJSON();
            t._id = e.id, t._sessionToken = e._sessionToken, wx.setStorage({
                key: r._getBmobPath(r.User._CURRENT_USER_KEY),
                data: JSON.stringify(t)
            });
        },
        _registerAuthenticationProvider: function(e) {
            r.User._authProviders[e.getAuthType()] = e, r.User.current() && r.User.current()._synchronizeAuthData(e.getAuthType());
        },
        _logInWith: function(e, t) {
            return r.Object._create("_User")._linkWith(e, t);
        }
    }), r.Query = function(e) {
        i.isString(e) && (e = r.Object._getSubclass(e)), this.objectClass = e, this.className = e.prototype.className, 
        this._where = {}, this._include = [], this._limit = -1, this._skip = 0, this._extraOptions = {};
    }, r.Query.or = function() {
        var e = i.toArray(arguments), t = null;
        r._arrayEach(e, function(e) {
            if (i.isNull(t) && (t = e.className), t !== e.className) throw "All queries must be for the same class";
        });
        var n = new r.Query(t);
        return n._orQuery(e), n;
    }, r.Query.Bql = function(e, t, n) {
        var s = {
            bql: e
        };
        return i.isArray(t) ? s.pvalues = t : n = t, r._request("cloudQuery", null, null, "GET", s, n).then(function(e) {
            var t = new r.Query("bmob");
            return i.map(e.results, function(n) {
                var i = t._newObject(e);
                return i._finishFetch && i._finishFetch(t._processResult(n), !0), i;
            });
        });
    }, r.Query._extend = r._extend, r.Query.prototype = {
        _processResult: function(e) {
            return e;
        },
        get: function(e, t) {
            var n = this;
            return n.equalTo("objectId", e), n.first().then(function(e) {
                if (e) return e;
                var t = new r.Error(r.Error.OBJECT_NOT_FOUND, "Object not found.");
                return r.Promise.error(t);
            })._thenRunCallbacks(t, null);
        },
        toJSON: function() {
            var e = {
                where: this._where
            };
            return this._include.length > 0 && (e.include = this._include.join(",")), this._select && (e.keys = this._select.join(",")), 
            this._limit >= 0 && (e.limit = this._limit), this._skip > 0 && (e.skip = this._skip), 
            void 0 !== this._order && (e.order = this._order), r._objectEach(this._extraOptions, function(t, n) {
                e[n] = t;
            }), e;
        },
        _newObject: function(e) {
            if (void 0 === t) var t;
            return t = e && e.className ? new r.Object(e.className) : new this.objectClass();
        },
        _createRequest: function(e) {
            return r._request("classes", this.className, null, "GET", e || this.toJSON());
        },
        find: function(e) {
            var t = this;
            return this._createRequest().then(function(e) {
                return i.map(e.results, function(n) {
                    var i = t._newObject(e);
                    return i._finishFetch(t._processResult(n), !0), i;
                });
            })._thenRunCallbacks(e);
        },
        destroyAll: function(e) {
            return this.find().then(function(e) {
                return r.Object.destroyAll(e);
            })._thenRunCallbacks(e);
        },
        count: function(e) {
            var t = this.toJSON();
            return t.limit = 0, t.count = 1, this._createRequest(t).then(function(e) {
                return e.count;
            })._thenRunCallbacks(e);
        },
        first: function(e) {
            var t = this, n = this.toJSON();
            return n.limit = 1, this._createRequest(n).then(function(e) {
                return i.map(e.results, function(e) {
                    var n = t._newObject();
                    return n._finishFetch(t._processResult(e), !0), n;
                })[0];
            })._thenRunCallbacks(e);
        },
        collection: function(e, t) {
            return t = t || {}, new r.Collection(e, i.extend(t, {
                model: this._objectClass || this.objectClass,
                query: this
            }));
        },
        skip: function(e) {
            return this._skip = e, this;
        },
        limit: function(e) {
            return this._limit = e, this;
        },
        equalTo: function(e, t) {
            return this._where[e] = r._encode(t), this;
        },
        _addCondition: function(e, t, n) {
            return this._where[e] || (this._where[e] = {}), this._where[e][t] = r._encode(n), 
            this;
        },
        notEqualTo: function(e, t) {
            return this._addCondition(e, "$ne", t), this;
        },
        lessThan: function(e, t) {
            return this._addCondition(e, "$lt", t), this;
        },
        greaterThan: function(e, t) {
            return this._addCondition(e, "$gt", t), this;
        },
        lessThanOrEqualTo: function(e, t) {
            return this._addCondition(e, "$lte", t), this;
        },
        greaterThanOrEqualTo: function(e, t) {
            return this._addCondition(e, "$gte", t), this;
        },
        containedIn: function(e, t) {
            return this._addCondition(e, "$in", t), this;
        },
        notContainedIn: function(e, t) {
            return this._addCondition(e, "$nin", t), this;
        },
        containsAll: function(e, t) {
            return this._addCondition(e, "$all", t), this;
        },
        exists: function(e) {
            return this._addCondition(e, "$exists", !0), this;
        },
        doesNotExist: function(e) {
            return this._addCondition(e, "$exists", !1), this;
        },
        matches: function(e, t, n) {
            return this._addCondition(e, "$regex", t), n || (n = ""), t.ignoreCase && (n += "i"), 
            t.multiline && (n += "m"), n && n.length && this._addCondition(e, "$options", n), 
            this;
        },
        matchesQuery: function(e, t) {
            var n = t.toJSON();
            return n.className = t.className, this._addCondition(e, "$inQuery", n), this;
        },
        doesNotMatchQuery: function(e, t) {
            var n = t.toJSON();
            return n.className = t.className, this._addCondition(e, "$notInQuery", n), this;
        },
        matchesKeyInQuery: function(e, t, n) {
            var i = n.toJSON();
            return i.className = n.className, this._addCondition(e, "$select", {
                key: t,
                query: i
            }), this;
        },
        doesNotMatchKeyInQuery: function(e, t, n) {
            var i = n.toJSON();
            return i.className = n.className, this._addCondition(e, "$dontSelect", {
                key: t,
                query: i
            }), this;
        },
        _orQuery: function(e) {
            var t = i.map(e, function(e) {
                return e.toJSON().where;
            });
            return this._where.$or = t, this;
        },
        _quote: function(e) {
            return "\\Q" + e.replace("\\E", "\\E\\\\E\\Q") + "\\E";
        },
        contains: function(e, t) {
            return this._addCondition(e, "$regex", this._quote(t)), this;
        },
        startsWith: function(e, t) {
            return this._addCondition(e, "$regex", "^" + this._quote(t)), this;
        },
        endsWith: function(e, t) {
            return this._addCondition(e, "$regex", this._quote(t) + "$"), this;
        },
        ascending: function(e) {
            return r._isNullOrUndefined(this._order) ? this._order = e : this._order = this._order + "," + e, 
            this;
        },
        cleanOrder: function(e) {
            return this._order = null, this;
        },
        descending: function(e) {
            return r._isNullOrUndefined(this._order) ? this._order = "-" + e : this._order = this._order + ",-" + e, 
            this;
        },
        near: function(e, t) {
            return t instanceof r.GeoPoint || (t = new r.GeoPoint(t)), this._addCondition(e, "$nearSphere", t), 
            this;
        },
        withinRadians: function(e, t, n) {
            return this.near(e, t), this._addCondition(e, "$maxDistance", n), this;
        },
        withinMiles: function(e, t, n) {
            return this.withinRadians(e, t, n / 3958.8);
        },
        withinKilometers: function(e, t, n) {
            return this.withinRadians(e, t, n / 6371);
        },
        withinGeoBox: function(e, t, n) {
            return t instanceof r.GeoPoint || (t = new r.GeoPoint(t)), n instanceof r.GeoPoint || (n = new r.GeoPoint(n)), 
            this._addCondition(e, "$within", {
                $box: [ t, n ]
            }), this;
        },
        include: function() {
            var e = this;
            return r._arrayEach(arguments, function(t) {
                i.isArray(t) ? e._include = e._include.concat(t) : e._include.push(t);
            }), this;
        },
        select: function() {
            var e = this;
            return this._select = this._select || [], r._arrayEach(arguments, function(t) {
                i.isArray(t) ? e._select = e._select.concat(t) : e._select.push(t);
            }), this;
        },
        each: function(e, t) {
            if (t = t || {}, this._order || this._skip || this._limit >= 0) {
                return r.Promise.error("Cannot iterate on a query with sort, skip, or limit.")._thenRunCallbacks(t);
            }
            new r.Promise();
            var n = new r.Query(this.objectClass);
            n._limit = t.batchSize || 100, n._where = i.clone(this._where), n._include = i.clone(this._include), 
            n.ascending("objectId");
            var s = !1;
            return r.Promise._continueWhile(function() {
                return !s;
            }, function() {
                return n.find().then(function(t) {
                    var i = r.Promise.as();
                    return r._.each(t, function(t) {
                        i = i.then(function() {
                            return e(t);
                        });
                    }), i.then(function() {
                        t.length >= n._limit ? n.greaterThan("objectId", t[t.length - 1].id) : s = !0;
                    });
                });
            })._thenRunCallbacks(t);
        }
    }, r.FriendShipQuery = r.Query._extend({
        _objectClass: r.User,
        _newObject: function() {
            return new r.User();
        },
        _processResult: function(e) {
            var t = e[this._friendshipTag];
            return "Pointer" === t.__type && "_User" === t.className && (delete t.__type, delete t.className), 
            t;
        }
    }), r.History = function() {
        this.handlers = [], i.bindAll(this, "checkUrl");
    };
    var l = /^[#\/]/, d = /msie [\w.]+/;
    r.History.started = !1, i.extend(r.History.prototype, r.Events, {
        interval: 50,
        getHash: function(e) {
            var t = (e ? e.location : window.location).href.match(/#(.*)$/);
            return t ? t[1] : "";
        },
        getFragment: function(e, t) {
            if (r._isNullOrUndefined(e)) if (this._hasPushState || t) {
                e = window.location.pathname;
                var n = window.location.search;
                n && (e += n);
            } else e = this.getHash();
            return e.indexOf(this.options.root) || (e = e.substr(this.options.root.length)), 
            e.replace(l, "");
        },
        start: function(e) {
            if (r.History.started) throw new Error("Bmob.history has already been started");
            r.History.started = !0, this.options = i.extend({}, {
                root: "/"
            }, this.options, e), this._wantsHashChange = !1 !== this.options.hashChange, this._wantsPushState = !!this.options.pushState, 
            this._hasPushState = !!(this.options.pushState && window.history && window.history.pushState);
            var t = this.getFragment(), n = document.documentMode, s = d.exec(navigator.userAgent.toLowerCase()) && (!n || n <= 7);
            s && (this.iframe = r.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow, 
            this.navigate(t)), this._hasPushState ? r.$(window).bind("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !s ? r.$(window).bind("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = window.setInterval(this.checkUrl, this.interval)), 
            this.fragment = t;
            var a = window.location, o = a.pathname === this.options.root;
            return this._wantsHashChange && this._wantsPushState && !this._hasPushState && !o ? (this.fragment = this.getFragment(null, !0), 
            window.location.replace(this.options.root + "#" + this.fragment), !0) : (this._wantsPushState && this._hasPushState && o && a.hash && (this.fragment = this.getHash().replace(l, ""), 
            window.history.replaceState({}, document.title, a.protocol + "//" + a.host + this.options.root + this.fragment)), 
            this.options.silent ? void 0 : this.loadUrl());
        },
        stop: function() {
            r.$(window).unbind("popstate", this.checkUrl).unbind("hashchange", this.checkUrl), 
            window.clearInterval(this._checkUrlInterval), r.History.started = !1;
        },
        route: function(e, t) {
            this.handlers.unshift({
                route: e,
                callback: t
            });
        },
        checkUrl: function(e) {
            var t = this.getFragment();
            if (t === this.fragment && this.iframe && (t = this.getFragment(this.getHash(this.iframe))), 
            t === this.fragment) return !1;
            this.iframe && this.navigate(t), this.loadUrl() || this.loadUrl(this.getHash());
        },
        loadUrl: function(e) {
            var t = this.fragment = this.getFragment(e);
            return i.any(this.handlers, function(e) {
                if (e.route.test(t)) return e.callback(t), !0;
            });
        },
        navigate: function(e, t) {
            if (!r.History.started) return !1;
            t && !0 !== t || (t = {
                trigger: t
            });
            var n = (e || "").replace(l, "");
            if (this.fragment !== n) {
                if (this._hasPushState) {
                    0 !== n.indexOf(this.options.root) && (n = this.options.root + n), this.fragment = n;
                    var i = t.replace ? "replaceState" : "pushState";
                    window.history[i]({}, document.title, n);
                } else this._wantsHashChange ? (this.fragment = n, this._updateHash(window.location, n, t.replace), 
                this.iframe && n !== this.getFragment(this.getHash(this.iframe)) && (t.replace || this.iframe.document.open().close(), 
                this._updateHash(this.iframe.location, n, t.replace))) : window.location.assign(this.options.root + e);
                t.trigger && this.loadUrl(e);
            }
        },
        _updateHash: function(e, t, n) {
            if (n) {
                var i = e.toString().replace(/(javascript:|#).*$/, "");
                e.replace(i + "#" + t);
            } else e.hash = t;
        }
    }), r.Router = function(e) {
        (e = e || {}).routes && (this.routes = e.routes), this._bindRoutes(), this.initialize.apply(this, arguments);
    };
    var _ = /:\w+/g, f = /\*\w+/g, p = /[\-\[\]{}()+?.,\\\^\$\|#\s]/g;
    i.extend(r.Router.prototype, r.Events, {
        initialize: function() {},
        route: function(e, t, n) {
            return r.history = r.history || new r.History(), i.isRegExp(e) || (e = this._routeToRegExp(e)), 
            n || (n = this[t]), r.history.route(e, i.bind(function(i) {
                var s = this._extractParameters(e, i);
                n && n.apply(this, s), this.trigger.apply(this, [ "route:" + t ].concat(s)), r.history.trigger("route", this, t, s);
            }, this)), this;
        },
        navigate: function(e, t) {
            r.history.navigate(e, t);
        },
        _bindRoutes: function() {
            if (this.routes) {
                var e = [];
                for (var t in this.routes) this.routes.hasOwnProperty(t) && e.unshift([ t, this.routes[t] ]);
                for (var n = 0, i = e.length; n < i; n++) this.route(e[n][0], e[n][1], this[e[n][1]]);
            }
        },
        _routeToRegExp: function(e) {
            return e = e.replace(p, "\\$&").replace(_, "([^/]+)").replace(f, "(.*?)"), new RegExp("^" + e + "$");
        },
        _extractParameters: function(e, t) {
            return e.exec(t).slice(1);
        }
    }), r.Router.extend = r._extend, r.generateCode = r.generateCode || {}, r.generateCode = function(e, t) {
        return r._request("wechatApp/qr/generatecode", null, null, "POST", r._encode(e, null, !0)).then(function(e) {
            return r._decode(null, e);
        })._thenRunCallbacks(t);
    }, r.sendMessage = r.sendMessage || {}, r.sendMessage = function(e, t) {
        return r._request("wechatApp/SendWeAppMessage", null, null, "POST", r._encode(e, null, !0)).then(function(e) {
            return r._decode(null, e);
        })._thenRunCallbacks(t);
    }, r.sendMasterMessage = r.sendMasterMessage || {}, r.sendMasterMessage = function(e, t) {
        return r._request("wechatApp/notifyMsg", null, null, "POST", r._encode(e, null, !0)).then(function(e) {
            return r._decode(null, e);
        })._thenRunCallbacks(t);
    }, r.Sms = r.Sms || {}, i.extend(r.Sms, {
        requestSms: function(e, t) {
            return r._request("requestSms", null, null, "POST", r._encode(e, null, !0)).then(function(e) {
                return r._decode(null, e);
            })._thenRunCallbacks(t);
        },
        requestSmsCode: function(e, t) {
            return r._request("requestSmsCode", null, null, "POST", r._encode(e, null, !0)).then(function(e) {
                return r._decode(null, e);
            })._thenRunCallbacks(t);
        },
        verifySmsCode: function(e, t, n) {
            var i = {
                mobilePhoneNumber: e
            };
            return r._request("verifySmsCode/" + t, null, null, "POST", r._encode(i, null, !0)).then(function(e) {
                return r._decode(null, e);
            })._thenRunCallbacks(n);
        },
        querySms: function(e, t) {
            return r._request("querySms/" + e, null, null, "GET", null).then(function(e) {
                return r._decode(null, e);
            })._thenRunCallbacks(t);
        }
    }), r.Pay = r.Pay || {}, i.extend(r.Pay, {
        wechatPay: function(e, t, n, i, s) {
            var a = {
                order_price: e,
                product_name: t,
                body: n,
                open_id: i,
                pay_type: 4
            };
            return r._request("pay", null, null, "POST", r._encode(a, null, !0)).then(function(e) {
                return r._decode(null, e);
            })._thenRunCallbacks(s);
        },
        queryOrder: function(e, t) {
            return r._request("pay/" + e, null, null, "GET", null).then(function(e) {
                return r._decode(null, e);
            })._thenRunCallbacks(t);
        }
    }), r.Cloud = r.Cloud || {}, i.extend(r.Cloud, {
        run: function(e, t, n) {
            return r._request("functions", e, null, "POST", r._encode(t, null, !0)).then(function(e) {
                return r._decode(null, e).result;
            })._thenRunCallbacks(n);
        }
    }), r.Installation = r.Object.extend("_Installation"), r.Push = r.Push || {}, r.Push.send = function(e, t) {
        if (e.where && (e.where = e.where.toJSON().where), e.push_time && (e.push_time = e.push_time.toJSON()), 
        e.expiration_time && (e.expiration_time = e.expiration_time.toJSON()), e.expiration_time && e.expiration_time_interval) throw "Both expiration_time and expiration_time_interval can't be set";
        return r._request("push", null, null, "POST", e)._thenRunCallbacks(t);
    };
    "undefined" == typeof module || module.exports;
    var m = {};
    exports.BmobSocketIo = m;
}).call(void 0);