/*!
 * 整合Macy.js(瀑布流布局插件)
 * freshxf
 * 2018/6/29
 */
;layui.define(function(exports){
  !function (t, n) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define(n) : t.Macy = n();
    //输出macy接口
    exports('macy', n());
  }(this, function () {
    "use strict";

    function t(t, n) {
      var e = void 0;
      return function () {
        e && clearTimeout(e), e = setTimeout(t, n)
      }
    }

    function n(t, n) {
      for (var e = t.length, o = e, r = []; e--;) r.push(n(t[o - e - 1]));
      return r
    }

    function e(t, n) {
      A(t, n, arguments.length > 2 && void 0 !== arguments[2] && arguments[2])
    }

    function o(t) {
      for (var n = t.options, e = t.responsiveOptions, o = t.keys, r = t.docWidth, i = void 0, s = 0; s < o.length; s++) {
        var a = parseInt(o[s], 10);
        r >= a && (i = n.breakAt[a], O(i, e))
      }
      return e
    }

    function r(t) {
      for (var n = t.options, e = t.responsiveOptions, o = t.keys, r = t.docWidth, i = void 0, s = o.length - 1; s >= 0; s--) {
        var a = parseInt(o[s], 10);
        r <= a && (i = n.breakAt[a], O(i, e))
      }
      return e
    }

    function i(t) {
      var n = document.body.clientWidth, e = {columns: t.columns};
      L(t.margin) ? e.margin = {x: t.margin.x, y: t.margin.y} : e.margin = {x: t.margin, y: t.margin};
      var i = Object.keys(t.breakAt);
      return t.mobileFirst ? o({options: t, responsiveOptions: e, keys: i, docWidth: n}) : r({
        options: t,
        responsiveOptions: e,
        keys: i,
        docWidth: n
      })
    }

    function s(t) {
      return i(t).columns
    }

    function a(t) {
      return i(t).margin
    }

    function c(t) {
      var n = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], e = s(t), o = a(t).x, r = 100 / e;
      return n ? 1 === e ? "100%" : (o = (e - 1) * o / e, "calc(" + r + "% - " + o + "px)") : r
    }

    function u(t, n) {
      var e = s(t.options), o = 0, r = void 0, i = void 0;
      return 1 === ++n ? 0 : (i = a(t.options).x, r = (i - (e - 1) * i / e) * (n - 1), o += c(t.options, !1) * (n - 1), "calc(" + o + "% + " + r + "px)")
    }

    function l(t) {
      var n = 0, e = t.container;
      m(t.rows, function (t) {
        n = t > n ? t : n
      }), e.style.height = n + "px"
    }

    function p(t, n) {
      var e = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
        o = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], r = s(t.options), i = a(t.options).y;
      C(t, r, e), m(n, function (n) {
        var e = 0, r = parseInt(n.offsetHeight, 10);
        isNaN(r) || (t.rows.forEach(function (n, o) {
          n < t.rows[e] && (e = o)
        }), n.style.position = "absolute", n.style.top = t.rows[e] + "px", n.style.left = "" + t.cols[e], t.rows[e] += isNaN(r) ? 0 : r + i, o && (n.dataset.macyComplete = 1))
      }), o && (t.tmpRows = null), l(t)
    }

    function h(t, n) {
      var e = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
        o = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], r = s(t.options), i = a(t.options).y;
      C(t, r, e), m(n, function (n) {
        t.lastcol === r && (t.lastcol = 0);
        var e = M(n, "height");
        e = parseInt(n.offsetHeight, 10), isNaN(e) || (n.style.position = "absolute", n.style.top = t.rows[t.lastcol] + "px", n.style.left = "" + t.cols[t.lastcol], t.rows[t.lastcol] += isNaN(e) ? 0 : e + i, t.lastcol += 1, o && (n.dataset.macyComplete = 1))
      }), o && (t.tmpRows = null), l(t)
    }

    var f = function t(n, e) {
      if (!(this instanceof t)) return new t(n, e);
      if (n = n.replace(/^\s*/, "").replace(/\s*$/, ""), e) return this.byCss(n, e);
      for (var o in this.selectors) if (e = o.split("/"), new RegExp(e[1], e[2]).test(n)) return this.selectors[o](n);
      return this.byCss(n)
    };
    f.prototype.byCss = function (t, n) {
      return (n || document).querySelectorAll(t)
    }, f.prototype.selectors = {}, f.prototype.selectors[/^\.[\w\-]+$/] = function (t) {
      return document.getElementsByClassName(t.substring(1))
    }, f.prototype.selectors[/^\w+$/] = function (t) {
      return document.getElementsByTagName(t)
    }, f.prototype.selectors[/^\#[\w\-]+$/] = function (t) {
      return document.getElementById(t.substring(1))
    };
    var m = function (t, n) {
      for (var e = t.length, o = e; e--;) n(t[o - e - 1])
    }, v = function () {
      var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      this.running = !1, this.events = [], this.add(t)
    };
    v.prototype.run = function () {
      if (!this.running && this.events.length > 0) {
        var t = this.events.shift();
        this.running = !0, t(), this.running = !1, this.run()
      }
    }, v.prototype.add = function () {
      var t = this, n = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      return !!n && (Array.isArray(n) ? m(n, function (n) {
        return t.add(n)
      }) : (this.events.push(n), void this.run()))
    }, v.prototype.clear = function () {
      this.events = []
    };
    var d = function (t) {
      var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      return this.instance = t, this.data = n, this
    }, g = function () {
      var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      this.events = {}, this.instance = t
    };
    g.prototype.on = function () {
      var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
        n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
      return !(!t || !n) && (Array.isArray(this.events[t]) || (this.events[t] = []), this.events[t].push(n))
    }, g.prototype.emit = function () {
      var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
        n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      if (!t || !Array.isArray(this.events[t])) return !1;
      var e = new d(this.instance, n);
      m(this.events[t], function (t) {
        return t(e)
      })
    };
    var y = function (t) {
      return !("naturalHeight" in t && t.naturalHeight + t.naturalWidth === 0) || t.width + t.height !== 0
    }, E = function (t, n) {
      var e = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
      return new Promise(function (t, e) {
        if (n.complete) return y(n) ? t(n) : e(n);
        n.addEventListener("load", function () {
          return y(n) ? t(n) : e(n)
        }), n.addEventListener("error", function () {
          return e(n)
        })
      }).then(function (n) {
        e && t.emit(t.constants.EVENT_IMAGE_LOAD, {img: n})
      }).catch(function (n) {
        return t.emit(t.constants.EVENT_IMAGE_ERROR, {img: n})
      })
    }, w = function (t, e) {
      var o = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
      return n(e, function (n) {
        return E(t, n, o)
      })
    }, A = function (t, n) {
      var e = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
      return Promise.all(w(t, n, e)).then(function () {
        t.emit(t.constants.EVENT_IMAGE_COMPLETE)
      })
    }, I = function (n) {
      return t(function () {
        n.emit(n.constants.EVENT_RESIZE), n.queue.add(function () {
          return n.recalculate(!0, !0)
        })
      }, 100)
    }, N = function (t) {
      if (t.container = f(t.options.container), t.container instanceof f || !t.container) return !!t.options.debug && console.error("Error: Container not found");
      delete t.options.container, t.container.length && (t.container = t.container[0]), t.container.style.position = "relative"
    }, T = function (t) {
      t.queue = new v, t.events = new g(t), t.rows = [], t.resizer = I(t)
    }, b = function (t) {
      var n = f("img", t.container);
      window.addEventListener("resize", t.resizer), t.on(t.constants.EVENT_IMAGE_LOAD, function () {
        return t.recalculate(!1, !1)
      }), t.on(t.constants.EVENT_IMAGE_COMPLETE, function () {
        return t.recalculate(!0, !0)
      }), t.options.useOwnImageLoader || e(t, n, !t.options.waitForImages), t.emit(t.constants.EVENT_INITIALIZED)
    }, _ = function (t) {
      N(t), T(t), b(t)
    }, L = function (t) {
      return t === Object(t) && "[object Array]" !== Object.prototype.toString.call(t)
    }, O = function (t, n) {
      L(t) || (n.columns = t), L(t) && t.columns && (n.columns = t.columns), L(t) && t.margin && !L(t.margin) && (n.margin = {
        x: t.margin,
        y: t.margin
      }), L(t) && t.margin && L(t.margin) && t.margin.x && (n.margin.x = t.margin.x), L(t) && t.margin && L(t.margin) && t.margin.y && (n.margin.y = t.margin.y)
    }, M = function (t, n) {
      return window.getComputedStyle(t, null).getPropertyValue(n)
    }, C = function (t, n) {
      var e = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
      if (t.lastcol || (t.lastcol = 0), t.rows.length < 1 && (e = !0), e) {
        t.rows = [], t.cols = [], t.lastcol = 0;
        for (var o = n - 1; o >= 0; o--) t.rows[o] = 0, t.cols[o] = u(t, o)
      } else if (t.tmpRows) {
        t.rows = [];
        for (var o = n - 1; o >= 0; o--) t.rows[o] = t.tmpRows[o]
      } else {
        t.tmpRows = [];
        for (var o = n - 1; o >= 0; o--) t.tmpRows[o] = t.rows[o]
      }
    }, V = function (t) {
      var n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
        e = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2],
        o = n ? t.container.children : f(':scope > *:not([data-macy-complete="1"])', t.container), r = c(t.options);
      return m(o, function (t) {
        n && (t.dataset.macyComplete = 0), t.style.width = r
      }), t.options.trueOrder ? (h(t, o, n, e), t.emit(t.constants.EVENT_RECALCULATED)) : (p(t, o, n, e), t.emit(t.constants.EVENT_RECALCULATED))
    }, R = Object.assign || function (t) {
      for (var n = 1; n < arguments.length; n++) {
        var e = arguments[n];
        for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o])
      }
      return t
    }, x = {
      columns: 4,
      margin: 2,
      trueOrder: !1,
      waitForImages: !1,
      useImageLoader: !0,
      breakAt: {},
      useOwnImageLoader: !1,
      onInit: !1
    };
    !function () {
      try {
        document.createElement("a").querySelector(":scope *")
      } catch (t) {
        !function () {
          function t(t) {
            return function (e) {
              if (e && n.test(e)) {
                var o = this.getAttribute("id");
                o || (this.id = "q" + Math.floor(9e6 * Math.random()) + 1e6), arguments[0] = e.replace(n, "#" + this.id);
                var r = t.apply(this, arguments);
                return null === o ? this.removeAttribute("id") : o || (this.id = o), r
              }
              return t.apply(this, arguments)
            }
          }

          var n = /:scope\b/gi, e = t(Element.prototype.querySelector);
          Element.prototype.querySelector = function (t) {
            return e.apply(this, arguments)
          };
          var o = t(Element.prototype.querySelectorAll);
          Element.prototype.querySelectorAll = function (t) {
            return o.apply(this, arguments)
          }
        }()
      }
    }();
    var q = function t() {
      var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : x;
      if (!(this instanceof t)) return new t(n);
      this.options = {}, R(this.options, x, n), _(this)
    };
    return q.init = function (t) {
      return console.warn("Depreciated: Macy.init will be removed in v3.0.0 opt to use Macy directly like so Macy({ /*options here*/ }) "), new q(t)
    }, q.prototype.recalculateOnImageLoad = function () {
      var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      return e(this, f("img", this.container), !t)
    }, q.prototype.runOnImageLoad = function (t) {
      var n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], o = f("img", this.container);
      return this.on(this.constants.EVENT_IMAGE_COMPLETE, t), n && this.on(this.constants.EVENT_IMAGE_LOAD, t), e(this, o, n)
    }, q.prototype.recalculate = function () {
      var t = this, n = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
        e = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
      return e && this.queue.clear(), this.queue.add(function () {
        return V(t, n, e)
      })
    }, q.prototype.remove = function () {
      window.removeEventListener("resize", this.resizer), m(this.container.children, function (t) {
        t.removeAttribute("data-macy-complete"), t.removeAttribute("style")
      }), this.container.removeAttribute("style")
    }, q.prototype.reInit = function () {
      this.recalculate(!0, !0), this.emit(this.constants.EVENT_INITIALIZED), window.addEventListener("resize", this.resizer), this.container.style.position = "relative"
    }, q.prototype.on = function (t, n) {
      this.events.on(t, n)
    }, q.prototype.emit = function (t, n) {
      this.events.emit(t, n)
    }, q.constants = {
      EVENT_INITIALIZED: "macy.initialized",
      EVENT_RECALCULATED: "macy.recalculated",
      EVENT_IMAGE_LOAD: "macy.image.load",
      EVENT_IMAGE_ERROR: "macy.image.error",
      EVENT_IMAGE_COMPLETE: "macy.images.complete",
      EVENT_RESIZE: "macy.resize"
    }, q.prototype.constants = q.constants, q
  });
});
