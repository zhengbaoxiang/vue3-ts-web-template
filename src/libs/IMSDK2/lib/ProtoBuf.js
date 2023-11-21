!(function (global, undefined) {
  'use strict';
  !(function (e, t, r) {
    function n(r) {
      var i = t[r];
      return (
        i || e[r][0].call((i = t[r] = { exports: {} }), n, i, i.exports),
        i.exports
      );
    }
    if (
      window.WebSocket &&
      'undefined' != typeof ArrayBuffer &&
      'undefined' != typeof Uint8Array
    ) {
      var i = (global.protobuf = n(r[0]));
      'function' == typeof define &&
        define.amd &&
        define(['long'], function (e) {
          return e && e.isLong && ((i.util.Long = e), i.configure()), i;
        }),
        'object' == typeof module &&
          module &&
          module.exports &&
          (module.exports = i);
    }
  })(
    {
      1: [
        function (e, t, r) {
          function n(e, t) {
            for (var r = [], n = 2; n < arguments.length; )
              r.push(arguments[n++]);
            var i = !0;
            return new Promise(function (n, o) {
              r.push(function (e) {
                if (i)
                  if (((i = !1), e)) o(e);
                  else {
                    for (var t = [], r = 1; r < arguments.length; )
                      t.push(arguments[r++]);
                    n.apply(null, t);
                  }
              });
              try {
                e.apply(t || this, r);
              } catch (s) {
                i && ((i = !1), o(s));
              }
            });
          }
          window.WebSocket &&
            'undefined' != typeof ArrayBuffer &&
            'undefined' != typeof Uint8Array &&
            (t.exports = n);
        },
        {},
      ],
      2: [
        function (e, t, r) {
          var n = r;
          n.length = function (e) {
            var t = e.length;
            if (!t) return 0;
            for (var r = 0; --t % 4 > 1 && '=' === e.charAt(t); ) ++r;
            return Math.ceil(3 * e.length) / 4 - r;
          };
          for (var i = Array(64), o = Array(123), s = 0; 64 > s; )
            o[
              (i[s] =
                26 > s
                  ? s + 65
                  : 52 > s
                  ? s + 71
                  : 62 > s
                  ? s - 4
                  : (s - 59) | 43)
            ] = s++;
          n.encode = function (e, t, r) {
            for (var n, o = [], s = 0, u = 0; r > t; ) {
              var f = e[t++];
              switch (u) {
                case 0:
                  (o[s++] = i[f >> 2]), (n = (3 & f) << 4), (u = 1);
                  break;
                case 1:
                  (o[s++] = i[n | (f >> 4)]), (n = (15 & f) << 2), (u = 2);
                  break;
                case 2:
                  (o[s++] = i[n | (f >> 6)]), (o[s++] = i[63 & f]), (u = 0);
              }
            }
            return (
              u && ((o[s++] = i[n]), (o[s] = 61), 1 === u && (o[s + 1] = 61)),
              String.fromCharCode.apply(String, o)
            );
          };
          var u = 'invalid encoding';
          (n.decode = function (e, t, r) {
            for (var n, i = r, s = 0, f = 0; f < e.length; ) {
              var a = e.charCodeAt(f++);
              if (61 === a && s > 1) break;
              if ((a = o[a]) === undefined) throw Error(u);
              switch (s) {
                case 0:
                  (n = a), (s = 1);
                  break;
                case 1:
                  (t[r++] = (n << 2) | ((48 & a) >> 4)), (n = a), (s = 2);
                  break;
                case 2:
                  (t[r++] = ((15 & n) << 4) | ((60 & a) >> 2)),
                    (n = a),
                    (s = 3);
                  break;
                case 3:
                  (t[r++] = ((3 & n) << 6) | a), (s = 0);
              }
            }
            if (1 === s) throw Error(u);
            return r - i;
          }),
            (n.test = function (e) {
              return /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/.test(
                e
              );
            });
        },
        {},
      ],
      3: [
        function (e, t, r) {
          function n() {
            function e() {
              for (var t = [], r = 0; r < arguments.length; )
                t.push(arguments[r++]);
              var n = i.apply(null, t),
                l = h;
              if (p.length) {
                var d = p[p.length - 1];
                o.test(d) ? (l = ++h) : f.test(d) && ++l,
                  u.test(d) && !u.test(n)
                    ? ((l = ++h), (c = !0))
                    : c && a.test(d) && ((l = --h), (c = !1)),
                  s.test(n) && (l = --h);
              }
              for (r = 0; l > r; ++r) n = '	' + n;
              return p.push(n), e;
            }
            function t(e) {
              return (
                'function' +
                (e ? ' ' + e.replace(/[^\w_$]/g, '_') : '') +
                '(' +
                l.join(',') +
                ') {\n' +
                p.join('\n') +
                '\n}'
              );
            }
            function r(t, r) {
              'object' == typeof t && ((r = t), (t = undefined));
              var i = e.str(t);
              n.verbose &&
                console.log(
                  '--- codegen ---\n' +
                    i.replace(/^/gm, '> ').replace(/\t/g, '  ')
                );
              var o = Object.keys(r || (r = {}));
              return Function.apply(null, o.concat('return ' + i)).apply(
                null,
                o.map(function (e) {
                  return r[e];
                })
              );
            }
            for (
              var l = [], p = [], h = 1, c = !1, d = 0;
              d < arguments.length;

            )
              l.push(arguments[d++]);
            return (e.str = t), (e.eof = r), e;
          }
          function i(e) {
            for (var t = [], r = 1; r < arguments.length; )
              t.push(arguments[r++]);
            if (
              ((r = 0),
              (e = e.replace(/%([dfjs])/g, function (e, n) {
                switch (n) {
                  case 'd':
                    return Math.floor(t[r++]);
                  case 'f':
                    return +t[r++];
                  case 'j':
                    return JSON.stringify(t[r++]);
                  default:
                    return t[r++];
                }
              })),
              r !== t.length)
            )
              throw Error('argument count mismatch');
            return e;
          }
          t.exports = n;
          var o = /[{[]$/,
            s = /^[}\]]/,
            u = /:$/,
            f = /^\s*(?:if|}?else if|while|for)\b|\b(?:else)\s*$/,
            a = /\b(?:break|continue)(?: \w+)?;?$|^\s*return\b/;
          (n.sprintf = i), (n.supported = !1);
          try {
            n.supported = 1 === n('a', 'b')('return a-b').eof()(2, 1);
          } catch (l) {}
          n.verbose = !1;
        },
        {},
      ],
      4: [
        function (e, t, r) {
          function n() {
            this._listeners = {};
          }
          (t.exports = n),
            (n.prototype.on = function (e, t, r) {
              return (
                (this._listeners[e] || (this._listeners[e] = [])).push({
                  fn: t,
                  ctx: r || this,
                }),
                this
              );
            }),
            (n.prototype.off = function (e, t) {
              if (e === undefined) this._listeners = {};
              else if (t === undefined) this._listeners[e] = [];
              else
                for (var r = this._listeners[e], n = 0; n < r.length; )
                  r[n].fn === t ? r.splice(n, 1) : ++n;
              return this;
            }),
            (n.prototype.emit = function (e) {
              var t = this._listeners[e];
              if (t) {
                for (var r = [], n = 1; n < arguments.length; )
                  r.push(arguments[n++]);
                for (n = 0; n < t.length; ) t[n].fn.apply(t[n++].ctx, r);
              }
              return this;
            });
        },
        {},
      ],
      5: [
        function (e, t, r) {
          function n(e, t, r) {
            return (
              'function' == typeof t ? ((r = t), (t = {})) : t || (t = {}),
              r
                ? !t.xhr && s && s.readFile
                  ? s.readFile(e, function (i, o) {
                      return i && 'undefined' != typeof XMLHttpRequest
                        ? n.xhr(e, t, r)
                        : i
                        ? r(i)
                        : r(null, t.binary ? o : o.toString('utf8'));
                    })
                  : n.xhr(e, t, r)
                : i(n, this, e, t)
            );
          }
          t.exports = n;
          var i = e(1),
            o = e(7),
            s = o('fs');
          n.xhr = function (e, t, r) {
            var n = new XMLHttpRequest();
            (n.onreadystatechange = function () {
              if (4 !== n.readyState) return undefined;
              if (0 !== n.status && 200 !== n.status)
                return r(Error('status ' + n.status));
              if (t.binary) {
                var e = n.response;
                if (!e) {
                  e = [];
                  for (var i = 0; i < n.responseText.length; ++i)
                    e.push(255 & n.responseText.charCodeAt(i));
                }
                return r(
                  null,
                  'undefined' != typeof Uint8Array ? new Uint8Array(e) : e
                );
              }
              return r(null, n.responseText);
            }),
              t.binary &&
                ('overrideMimeType' in n &&
                  n.overrideMimeType('text/plain; charset=x-user-defined'),
                (n.responseType = 'arraybuffer')),
              n.open('GET', e),
              n.send();
          };
        },
        { 1: 1, 7: 7 },
      ],
      6: [
        function (e, t, r) {
          function n(e) {
            return (
              'undefined' != typeof Float32Array
                ? (function () {
                    function t(e, t, r) {
                      (o[0] = e),
                        (t[r] = s[0]),
                        (t[r + 1] = s[1]),
                        (t[r + 2] = s[2]),
                        (t[r + 3] = s[3]);
                    }
                    function r(e, t, r) {
                      (o[0] = e),
                        (t[r] = s[3]),
                        (t[r + 1] = s[2]),
                        (t[r + 2] = s[1]),
                        (t[r + 3] = s[0]);
                    }
                    function n(e, t) {
                      return (
                        (s[0] = e[t]),
                        (s[1] = e[t + 1]),
                        (s[2] = e[t + 2]),
                        (s[3] = e[t + 3]),
                        o[0]
                      );
                    }
                    function i(e, t) {
                      return (
                        (s[3] = e[t]),
                        (s[2] = e[t + 1]),
                        (s[1] = e[t + 2]),
                        (s[0] = e[t + 3]),
                        o[0]
                      );
                    }
                    var o = new Float32Array([-0]),
                      s = new Uint8Array(o.buffer),
                      u = 128 === s[3];
                    (e.writeFloatLE = u ? t : r),
                      (e.writeFloatBE = u ? r : t),
                      (e.readFloatLE = u ? n : i),
                      (e.readFloatBE = u ? i : n);
                  })()
                : (function () {
                    function t(e, t, r, n) {
                      var i = 0 > t ? 1 : 0;
                      if ((i && (t = -t), 0 === t))
                        e(1 / t > 0 ? 0 : 2147483648, r, n);
                      else if (isNaN(t)) e(2143289344, r, n);
                      else if (t > 3.4028234663852886e38)
                        e(((i << 31) | 2139095040) >>> 0, r, n);
                      else if (1.1754943508222875e-38 > t)
                        e(
                          ((i << 31) |
                            Math.round(t / 1.401298464324817e-45)) >>>
                            0,
                          r,
                          n
                        );
                      else {
                        var o = Math.floor(Math.log(t) / Math.LN2),
                          s =
                            8388607 & Math.round(t * Math.pow(2, -o) * 8388608);
                        e(((i << 31) | ((o + 127) << 23) | s) >>> 0, r, n);
                      }
                    }
                    function r(e, t, r) {
                      var n = e(t, r),
                        i = 2 * (n >> 31) + 1,
                        o = (n >>> 23) & 255,
                        s = 8388607 & n;
                      return 255 === o
                        ? s
                          ? NaN
                          : i * (1 / 0)
                        : 0 === o
                        ? 1.401298464324817e-45 * i * s
                        : i * Math.pow(2, o - 150) * (s + 8388608);
                    }
                    (e.writeFloatLE = t.bind(null, i)),
                      (e.writeFloatBE = t.bind(null, o)),
                      (e.readFloatLE = r.bind(null, s)),
                      (e.readFloatBE = r.bind(null, u));
                  })(),
              'undefined' != typeof Float64Array
                ? (function () {
                    function t(e, t, r) {
                      (o[0] = e),
                        (t[r] = s[0]),
                        (t[r + 1] = s[1]),
                        (t[r + 2] = s[2]),
                        (t[r + 3] = s[3]),
                        (t[r + 4] = s[4]),
                        (t[r + 5] = s[5]),
                        (t[r + 6] = s[6]),
                        (t[r + 7] = s[7]);
                    }
                    function r(e, t, r) {
                      (o[0] = e),
                        (t[r] = s[7]),
                        (t[r + 1] = s[6]),
                        (t[r + 2] = s[5]),
                        (t[r + 3] = s[4]),
                        (t[r + 4] = s[3]),
                        (t[r + 5] = s[2]),
                        (t[r + 6] = s[1]),
                        (t[r + 7] = s[0]);
                    }
                    function n(e, t) {
                      return (
                        (s[0] = e[t]),
                        (s[1] = e[t + 1]),
                        (s[2] = e[t + 2]),
                        (s[3] = e[t + 3]),
                        (s[4] = e[t + 4]),
                        (s[5] = e[t + 5]),
                        (s[6] = e[t + 6]),
                        (s[7] = e[t + 7]),
                        o[0]
                      );
                    }
                    function i(e, t) {
                      return (
                        (s[7] = e[t]),
                        (s[6] = e[t + 1]),
                        (s[5] = e[t + 2]),
                        (s[4] = e[t + 3]),
                        (s[3] = e[t + 4]),
                        (s[2] = e[t + 5]),
                        (s[1] = e[t + 6]),
                        (s[0] = e[t + 7]),
                        o[0]
                      );
                    }
                    var o = new Float64Array([-0]),
                      s = new Uint8Array(o.buffer),
                      u = 128 === s[7];
                    (e.writeDoubleLE = u ? t : r),
                      (e.writeDoubleBE = u ? r : t),
                      (e.readDoubleLE = u ? n : i),
                      (e.readDoubleBE = u ? i : n);
                  })()
                : (function () {
                    function t(e, t, r, n, i, o) {
                      var s = 0 > n ? 1 : 0;
                      if ((s && (n = -n), 0 === n))
                        e(0, i, o + t), e(1 / n > 0 ? 0 : 2147483648, i, o + r);
                      else if (isNaN(n))
                        e(0, i, o + t), e(2146959360, i, o + r);
                      else if (n > 1.7976931348623157e308)
                        e(0, i, o + t),
                          e(((s << 31) | 2146435072) >>> 0, i, o + r);
                      else {
                        var u;
                        if (2.2250738585072014e-308 > n)
                          (u = n / 5e-324),
                            e(u >>> 0, i, o + t),
                            e(((s << 31) | (u / 4294967296)) >>> 0, i, o + r);
                        else {
                          var f = Math.floor(Math.log(n) / Math.LN2);
                          1024 === f && (f = 1023),
                            (u = n * Math.pow(2, -f)),
                            e((4503599627370496 * u) >>> 0, i, o + t),
                            e(
                              ((s << 31) |
                                ((f + 1023) << 20) |
                                ((1048576 * u) & 1048575)) >>>
                                0,
                              i,
                              o + r
                            );
                        }
                      }
                    }
                    function r(e, t, r, n, i) {
                      var o = e(n, i + t),
                        s = e(n, i + r),
                        u = 2 * (s >> 31) + 1,
                        f = (s >>> 20) & 2047,
                        a = 4294967296 * (1048575 & s) + o;
                      return 2047 === f
                        ? a
                          ? NaN
                          : u * (1 / 0)
                        : 0 === f
                        ? 5e-324 * u * a
                        : u * Math.pow(2, f - 1075) * (a + 4503599627370496);
                    }
                    (e.writeDoubleLE = t.bind(null, i, 0, 4)),
                      (e.writeDoubleBE = t.bind(null, o, 4, 0)),
                      (e.readDoubleLE = r.bind(null, s, 0, 4)),
                      (e.readDoubleBE = r.bind(null, u, 4, 0));
                  })(),
              e
            );
          }
          function i(e, t, r) {
            (t[r] = 255 & e),
              (t[r + 1] = (e >>> 8) & 255),
              (t[r + 2] = (e >>> 16) & 255),
              (t[r + 3] = e >>> 24);
          }
          function o(e, t, r) {
            (t[r] = e >>> 24),
              (t[r + 1] = (e >>> 16) & 255),
              (t[r + 2] = (e >>> 8) & 255),
              (t[r + 3] = 255 & e);
          }
          function s(e, t) {
            return (
              (e[t] | (e[t + 1] << 8) | (e[t + 2] << 16) | (e[t + 3] << 24)) >>>
              0
            );
          }
          function u(e, t) {
            return (
              ((e[t] << 24) | (e[t + 1] << 16) | (e[t + 2] << 8) | e[t + 3]) >>>
              0
            );
          }
          t.exports = n(n);
        },
        {},
      ],
      7: [
        function (require, module, exports) {
          function inquire(moduleName) {
            try {
              var mod = eval('quire'.replace(/^/, 're'))(moduleName);
              if (mod && (mod.length || Object.keys(mod).length)) return mod;
            } catch (e) {}
            return null;
          }
          module.exports = inquire;
        },
        {},
      ],
      8: [
        function (e, t, r) {
          var n = r,
            i = (n.isAbsolute = function (e) {
              return /^(?:\/|\w+:)/.test(e);
            }),
            o = (n.normalize = function (e) {
              e = e.replace(/\\/g, '/').replace(/\/{2,}/g, '/');
              var t = e.split('/'),
                r = i(e),
                n = '';
              r && (n = t.shift() + '/');
              for (var o = 0; o < t.length; )
                '..' === t[o]
                  ? o > 0 && '..' !== t[o - 1]
                    ? t.splice(--o, 2)
                    : r
                    ? t.splice(o, 1)
                    : ++o
                  : '.' === t[o]
                  ? t.splice(o, 1)
                  : ++o;
              return n + t.join('/');
            });
          n.resolve = function (e, t, r) {
            return (
              r || (t = o(t)),
              i(t)
                ? t
                : (r || (e = o(e)),
                  (e = e.replace(/(?:\/|^)[^\/]+$/, '')).length
                    ? o(e + '/' + t)
                    : t)
            );
          };
        },
        {},
      ],
      9: [
        function (e, t, r) {
          function n(e, t, r) {
            var n = r || 8192,
              i = n >>> 1,
              o = null,
              s = n;
            return function (r) {
              if (1 > r || r > i) return e(r);
              s + r > n && ((o = e(n)), (s = 0));
              var u = t.call(o, s, (s += r));
              return 7 & s && (s = (7 | s) + 1), u;
            };
          }
          t.exports = n;
        },
        {},
      ],
      10: [
        function (e, t, r) {
          var n = r;
          (n.length = function (e) {
            for (var t = 0, r = 0, n = 0; n < e.length; ++n)
              (r = e.charCodeAt(n)),
                128 > r
                  ? (t += 1)
                  : 2048 > r
                  ? (t += 2)
                  : 55296 === (64512 & r) &&
                    56320 === (64512 & e.charCodeAt(n + 1))
                  ? (++n, (t += 4))
                  : (t += 3);
            return t;
          }),
            (n.read = function (e, t, r) {
              var n = r - t;
              if (1 > n) return '';
              for (var i, o = null, s = [], u = 0; r > t; )
                (i = e[t++]),
                  128 > i
                    ? (s[u++] = i)
                    : i > 191 && 224 > i
                    ? (s[u++] = ((31 & i) << 6) | (63 & e[t++]))
                    : i > 239 && 365 > i
                    ? ((i =
                        (((7 & i) << 18) |
                          ((63 & e[t++]) << 12) |
                          ((63 & e[t++]) << 6) |
                          (63 & e[t++])) -
                        65536),
                      (s[u++] = 55296 + (i >> 10)),
                      (s[u++] = 56320 + (1023 & i)))
                    : (s[u++] =
                        ((15 & i) << 12) |
                        ((63 & e[t++]) << 6) |
                        (63 & e[t++])),
                  u > 8191 &&
                    ((o || (o = [])).push(String.fromCharCode.apply(String, s)),
                    (u = 0));
              return o
                ? (u &&
                    o.push(String.fromCharCode.apply(String, s.slice(0, u))),
                  o.join(''))
                : String.fromCharCode.apply(String, s.slice(0, u));
            }),
            (n.write = function (e, t, r) {
              for (var n, i, o = r, s = 0; s < e.length; ++s)
                (n = e.charCodeAt(s)),
                  128 > n
                    ? (t[r++] = n)
                    : 2048 > n
                    ? ((t[r++] = (n >> 6) | 192), (t[r++] = (63 & n) | 128))
                    : 55296 === (64512 & n) &&
                      56320 === (64512 & (i = e.charCodeAt(s + 1)))
                    ? ((n = 65536 + ((1023 & n) << 10) + (1023 & i)),
                      ++s,
                      (t[r++] = (n >> 18) | 240),
                      (t[r++] = ((n >> 12) & 63) | 128),
                      (t[r++] = ((n >> 6) & 63) | 128),
                      (t[r++] = (63 & n) | 128))
                    : ((t[r++] = (n >> 12) | 224),
                      (t[r++] = ((n >> 6) & 63) | 128),
                      (t[r++] = (63 & n) | 128));
              return r - o;
            });
        },
        {},
      ],
      11: [
        function (e, t, r) {
          function n(t, r) {
            if ((i || (i = e(35)), !(t instanceof i)))
              throw TypeError('type must be a Type');
            if (r) {
              if ('function' != typeof r)
                throw TypeError('ctor must be a function');
            } else r = n.generate(t).eof(t.name);
            (r.constructor = n),
              ((r.prototype = new o()).constructor = r),
              s.merge(r, o, !0),
              (r.$type = t),
              (r.prototype.$type = t);
            for (var u = 0; u < t.fieldsArray.length; ++u)
              r.prototype[t._fieldsArray[u].name] = Array.isArray(
                t._fieldsArray[u].resolve().defaultValue
              )
                ? s.emptyArray
                : s.isObject(t._fieldsArray[u].defaultValue) &&
                  !t._fieldsArray[u]['long']
                ? s.emptyObject
                : t._fieldsArray[u].defaultValue;
            var f = {};
            for (u = 0; u < t.oneofsArray.length; ++u)
              f[t._oneofsArray[u].resolve().name] = {
                get: s.oneOfGetter(t._oneofsArray[u].oneof),
                set: s.oneOfSetter(t._oneofsArray[u].oneof),
              };
            return (
              u && Object.defineProperties(r.prototype, f),
              (t.ctor = r),
              r.prototype
            );
          }
          t.exports = n;
          var i,
            o = e(22),
            s = e(37);
          (n.generate = function (e) {
            for (
              var t, r = s.codegen('p'), n = 0;
              n < e.fieldsArray.length;
              ++n
            )
              (t = e._fieldsArray[n]).map
                ? r('this%s={}', s.safeProp(t.name))
                : t.repeated && r('this%s=[]', s.safeProp(t.name));
            return r(
              'if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)'
            )('this[ks[i]]=p[ks[i]]');
          }),
            (n.create = n),
            (n.prototype = o);
        },
        { 22: 22, 35: 35, 37: 37 },
      ],
      12: [
        function (e, t, r) {
          function n(e, t) {
            i.test(e) ||
              ((e = 'google/protobuf/' + e + '.proto'),
              (t = {
                nested: { google: { nested: { protobuf: { nested: t } } } },
              })),
              (n[e] = t);
          }
          t.exports = n;
          var i = /\/|\./;
          n('any', {
            Any: {
              fields: {
                type_url: { type: 'string', id: 1 },
                value: { type: 'bytes', id: 2 },
              },
            },
          });
          var o;
          n('duration', {
            Duration: (o = {
              fields: {
                seconds: { type: 'int64', id: 1 },
                nanos: { type: 'int32', id: 2 },
              },
            }),
          }),
            n('timestamp', { Timestamp: o }),
            n('empty', { Empty: { fields: {} } }),
            n('struct', {
              Struct: {
                fields: { fields: { keyType: 'string', type: 'Value', id: 1 } },
              },
              Value: {
                oneofs: {
                  kind: {
                    oneof: [
                      'nullValue',
                      'numberValue',
                      'stringValue',
                      'boolValue',
                      'structValue',
                      'listValue',
                    ],
                  },
                },
                fields: {
                  nullValue: { type: 'NullValue', id: 1 },
                  numberValue: { type: 'double', id: 2 },
                  stringValue: { type: 'string', id: 3 },
                  boolValue: { type: 'bool', id: 4 },
                  structValue: { type: 'Struct', id: 5 },
                  listValue: { type: 'ListValue', id: 6 },
                },
              },
              NullValue: { values: { NULL_VALUE: 0 } },
              ListValue: {
                fields: { values: { rule: 'repeated', type: 'Value', id: 1 } },
              },
            }),
            n('wrappers', {
              DoubleValue: { fields: { value: { type: 'double', id: 1 } } },
              FloatValue: { fields: { value: { type: 'float', id: 1 } } },
              Int64Value: { fields: { value: { type: 'int64', id: 1 } } },
              UInt64Value: { fields: { value: { type: 'uint64', id: 1 } } },
              Int32Value: { fields: { value: { type: 'int32', id: 1 } } },
              UInt32Value: { fields: { value: { type: 'uint32', id: 1 } } },
              BoolValue: { fields: { value: { type: 'bool', id: 1 } } },
              StringValue: { fields: { value: { type: 'string', id: 1 } } },
              BytesValue: { fields: { value: { type: 'bytes', id: 1 } } },
            });
        },
        {},
      ],
      13: [
        function (e, t, r) {
          function n(e, t, r, n) {
            if (t.resolvedType)
              if (t.resolvedType instanceof s) {
                e('switch(d%s){', n);
                for (
                  var i = t.resolvedType.values, o = Object.keys(i), u = 0;
                  u < o.length;
                  ++u
                )
                  t.repeated && i[o[u]] === t.typeDefault && e('default:'),
                    e('case%j:', o[u])('case %j:', i[o[u]])(
                      'm%s=%j',
                      n,
                      i[o[u]]
                    )('break');
                e('}');
              } else
                e('if(typeof d%s!=="object")', n)(
                  'throw TypeError(%j)',
                  t.fullName + ': object expected'
                )('m%s=types[%d].fromObject(d%s)', n, r, n);
            else {
              var f = !1;
              switch (t.type) {
                case 'double':
                case 'float':
                  e('m%s=Number(d%s)', n, n);
                  break;
                case 'uint32':
                case 'fixed32':
                  e('m%s=d%s>>>0', n, n);
                  break;
                case 'int32':
                case 'sint32':
                case 'sfixed32':
                  e('m%s=d%s|0', n, n);
                  break;
                case 'uint64':
                  f = !0;
                case 'int64':
                case 'sint64':
                case 'fixed64':
                case 'sfixed64':
                  e('if(util.Long)')(
                    '(m%s=util.Long.fromValue(d%s)).unsigned=%j',
                    n,
                    n,
                    f
                  )('else if(typeof d%s==="string")', n)(
                    'm%s=parseInt(d%s,10)',
                    n,
                    n
                  )('else if(typeof d%s==="number")', n)(
                    'm%s=d%s',
                    n,
                    n
                  )('else if(typeof d%s==="object")', n)(
                    'm%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)',
                    n,
                    n,
                    n,
                    f ? 'true' : ''
                  );
                  break;
                case 'bytes':
                  e('if(typeof d%s==="string")', n)(
                    'util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)',
                    n,
                    n,
                    n
                  )('else if(d%s.length)', n)('m%s=d%s', n, n);
                  break;
                case 'string':
                  e('m%s=String(d%s)', n, n);
                  break;
                case 'bool':
                  e('m%s=Boolean(d%s)', n, n);
              }
            }
            return e;
          }
          function i(e, t, r, n) {
            if (t.resolvedType)
              t.resolvedType instanceof s
                ? e(
                    'd%s=o.enums===String?types[%d].values[m%s]:m%s',
                    n,
                    r,
                    n,
                    n
                  )
                : e('d%s=types[%d].toObject(m%s,o)', n, r, n);
            else {
              var i = !1;
              switch (t.type) {
                case 'uint64':
                  i = !0;
                case 'int64':
                case 'sint64':
                case 'fixed64':
                case 'sfixed64':
                  e('if(typeof m%s==="number")', n)(
                    'd%s=o.longs===String?String(m%s):m%s',
                    n,
                    n,
                    n
                  )('else')(
                    'd%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s',
                    n,
                    n,
                    n,
                    n,
                    i ? 'true' : '',
                    n
                  );
                  break;
                case 'bytes':
                  e(
                    'd%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s',
                    n,
                    n,
                    n,
                    n,
                    n
                  );
                  break;
                default:
                  e('d%s=m%s', n, n);
              }
            }
            return e;
          }
          var o = r,
            s = e(16),
            u = e(37);
          (o.fromObject = function (e) {
            var t = e.fieldsArray,
              r = u.codegen('d')('if(d instanceof this.ctor)')('return d');
            if (!t.length) return r('return new this.ctor');
            r('var m=new this.ctor');
            for (var i = 0; i < t.length; ++i) {
              var o = t[i].resolve(),
                f = u.safeProp(o.name);
              o.map
                ? (r('if(d%s){', f)('if(typeof d%s!=="object")', f)(
                    'throw TypeError(%j)',
                    o.fullName + ': object expected'
                  )('m%s={}', f)(
                    'for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){',
                    f
                  ),
                  n(r, o, i, f + '[ks[i]]')('}')('}'))
                : o.repeated
                ? (r('if(d%s){', f)('if(!Array.isArray(d%s))', f)(
                    'throw TypeError(%j)',
                    o.fullName + ': array expected'
                  )('m%s=[]', f)('for(var i=0;i<d%s.length;++i){', f),
                  n(r, o, i, f + '[i]')('}')('}'))
                : (o.resolvedType instanceof s || r('if(d%s!=null){', f),
                  n(r, o, i, f),
                  o.resolvedType instanceof s || r('}'));
            }
            return r('return m');
          }),
            (o.toObject = function (e) {
              var t = e.fieldsArray.slice().sort(u.compareFieldsById);
              if (!t.length) return u.codegen()('return {}');
              for (
                var r = u.codegen('m', 'o')('if(!o)')('o={}')('var d={}'),
                  n = [],
                  o = [],
                  f = [],
                  a = 0;
                a < t.length;
                ++a
              )
                t[a].partOf ||
                  (t[a].resolve().repeated ? n : t[a].map ? o : f).push(t[a]);
              if (n.length) {
                for (r('if(o.arrays||o.defaults){'), a = 0; a < n.length; ++a)
                  r('d%s=[]', u.safeProp(n[a].name));
                r('}');
              }
              if (o.length) {
                for (r('if(o.objects||o.defaults){'), a = 0; a < o.length; ++a)
                  r('d%s={}', u.safeProp(o[a].name));
                r('}');
              }
              if (f.length) {
                for (r('if(o.defaults){'), a = 0; a < f.length; ++a) {
                  var l = f[a],
                    p = u.safeProp(l.name);
                  l.resolvedType instanceof s
                    ? r(
                        'd%s=o.enums===String?%j:%j',
                        p,
                        l.resolvedType.valuesById[l.typeDefault],
                        l.typeDefault
                      )
                    : l['long']
                    ? r('if(util.Long){')(
                        'var n=new util.Long(%d,%d,%j)',
                        l.typeDefault.low,
                        l.typeDefault.high,
                        l.typeDefault.unsigned
                      )(
                        'd%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():n',
                        p
                      )('}else')(
                        'd%s=o.longs===String?%j:%d',
                        p,
                        '' + l.typeDefault,
                        l.typeDefault.toNumber()
                      )
                    : l.bytes
                    ? r(
                        'd%s=o.bytes===String?%j:%s',
                        p,
                        String.fromCharCode.apply(String, l.typeDefault),
                        '[' +
                          Array.prototype.slice.call(l.typeDefault).join(',') +
                          ']'
                      )
                    : r('d%s=%j', p, l.typeDefault);
                }
                r('}');
              }
              var h = !1;
              for (a = 0; a < t.length; ++a) {
                var l = t[a],
                  c = e._fieldsArray.indexOf(l),
                  p = u.safeProp(l.name);
                l.map
                  ? (h || ((h = !0), r('var ks2')),
                    r(
                      'if(m%s&&(ks2=Object.keys(m%s)).length){',
                      p,
                      p
                    )(
                      'd%s={}',
                      p
                    )('for(var j=0;j<ks2.length;++j){'),
                    i(r, l, c, p + '[ks2[j]]')('}'))
                  : l.repeated
                  ? (r('if(m%s&&m%s.length){', p, p)('d%s=[]', p)(
                      'for(var j=0;j<m%s.length;++j){',
                      p
                    ),
                    i(r, l, c, p + '[j]')('}'))
                  : (r('if(m%s!=null&&m.hasOwnProperty(%j)){', p, l.name),
                    i(r, l, c, p),
                    l.partOf &&
                      r('if(o.oneofs)')(
                        'd%s=%j',
                        u.safeProp(l.partOf.name),
                        l.name
                      )),
                  r('}');
              }
              return r('return d');
            });
        },
        { 16: 16, 37: 37 },
      ],
      14: [
        function (e, t, r) {
          function n(e) {
            return "missing required '" + e.name + "'";
          }
          function i(e) {
            var t = u.codegen('r', 'l')('if(!(r instanceof Reader))')(
              'r=Reader.create(r)'
            )(
              'var c=l===undefined?r.len:r.pos+l,m=new this.ctor' +
                (e.fieldsArray.filter(function (e) {
                  return e.map;
                }).length
                  ? ',k'
                  : '')
            )('while(r.pos<c){')('var t=r.uint32()');
            e.group && t('if((t&7)===4)')('break'), t('switch(t>>>3){');
            for (var r = 0; r < e.fieldsArray.length; ++r) {
              var i = e._fieldsArray[r].resolve(),
                f = i.resolvedType instanceof o ? 'uint32' : i.type,
                a = 'm' + u.safeProp(i.name);
              t('case %d:', i.id),
                i.map
                  ? (t('r.skip().pos++')('if(%s===util.emptyObject)', a)(
                      '%s={}',
                      a
                    )(
                      'k=r.%s()',
                      i.keyType
                    )('r.pos++'),
                    s['long'][i.keyType] !== undefined
                      ? s.basic[f] === undefined
                        ? t(
                            '%s[typeof k==="object"?util.longToHash(k):k]=types[%d].decode(r,r.uint32())',
                            a,
                            r
                          )
                        : t(
                            '%s[typeof k==="object"?util.longToHash(k):k]=r.%s()',
                            a,
                            f
                          )
                      : s.basic[f] === undefined
                      ? t('%s[k]=types[%d].decode(r,r.uint32())', a, r)
                      : t('%s[k]=r.%s()', a, f))
                  : i.repeated
                  ? (t('if(!(%s&&%s.length))', a, a)('%s=[]', a),
                    s.packed[f] !== undefined &&
                      t('if((t&7)===2){')('var c2=r.uint32()+r.pos')(
                        'while(r.pos<c2)'
                      )(
                        '%s.push(r.%s())',
                        a,
                        f
                      )('}else'),
                    s.basic[f] === undefined
                      ? t(
                          i.resolvedType.group
                            ? '%s.push(types[%d].decode(r))'
                            : '%s.push(types[%d].decode(r,r.uint32()))',
                          a,
                          r
                        )
                      : t('%s.push(r.%s())', a, f))
                  : s.basic[f] === undefined
                  ? t(
                      i.resolvedType.group
                        ? '%s=types[%d].decode(r)'
                        : '%s=types[%d].decode(r,r.uint32())',
                      a,
                      r
                    )
                  : t('%s=r.%s()', a, f),
                t('break');
            }
            for (
              t('default:')('r.skipType(t&7)')('break')('}')('}'), r = 0;
              r < e._fieldsArray.length;
              ++r
            ) {
              var l = e._fieldsArray[r];
              l.required &&
                t('if(!m.hasOwnProperty(%j))', l.name)(
                  'throw util.ProtocolError(%j,{instance:m})',
                  n(l)
                );
            }
            return t('return m');
          }
          t.exports = i;
          var o = e(16),
            s = e(36),
            u = e(37);
        },
        { 16: 16, 36: 36, 37: 37 },
      ],
      15: [
        function (e, t, r) {
          function n(e, t, r, n) {
            return t.resolvedType.group
              ? e(
                  'types[%d].encode(%s,w.uint32(%d)).uint32(%d)',
                  r,
                  n,
                  ((t.id << 3) | 3) >>> 0,
                  ((t.id << 3) | 4) >>> 0
                )
              : e(
                  'types[%d].encode(%s,w.uint32(%d).fork()).ldelim()',
                  r,
                  n,
                  ((t.id << 3) | 2) >>> 0
                );
          }
          function i(e) {
            for (
              var t,
                r,
                i = u.codegen('m', 'w')('if(!w)')('w=Writer.create()'),
                f = e.fieldsArray.slice().sort(u.compareFieldsById),
                t = 0;
              t < f.length;
              ++t
            ) {
              var a = f[t].resolve(),
                l = e._fieldsArray.indexOf(a),
                p = a.resolvedType instanceof o ? 'uint32' : a.type,
                h = s.basic[p];
              (r = 'm' + u.safeProp(a.name)),
                a.map
                  ? (i(
                      'if(%s!=null&&m.hasOwnProperty(%j)){',
                      r,
                      a.name
                    )('for(var ks=Object.keys(%s),i=0;i<ks.length;++i){', r)(
                      'w.uint32(%d).fork().uint32(%d).%s(ks[i])',
                      ((a.id << 3) | 2) >>> 0,
                      8 | s.mapKey[a.keyType],
                      a.keyType
                    ),
                    h === undefined
                      ? i(
                          'types[%d].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()',
                          l,
                          r
                        )
                      : i('.uint32(%d).%s(%s[ks[i]]).ldelim()', 16 | h, p, r),
                    i('}')('}'))
                  : a.repeated
                  ? (i('if(%s!=null&&%s.length){', r, r),
                    a.packed && s.packed[p] !== undefined
                      ? i('w.uint32(%d).fork()', ((a.id << 3) | 2) >>> 0)(
                          'for(var i=0;i<%s.length;++i)',
                          r
                        )(
                          'w.%s(%s[i])',
                          p,
                          r
                        )('w.ldelim()')
                      : (i('for(var i=0;i<%s.length;++i)', r),
                        h === undefined
                          ? n(i, a, l, r + '[i]')
                          : i(
                              'w.uint32(%d).%s(%s[i])',
                              ((a.id << 3) | h) >>> 0,
                              p,
                              r
                            )),
                    i('}'))
                  : (a.optional &&
                      i('if(%s!=null&&m.hasOwnProperty(%j))', r, a.name),
                    h === undefined
                      ? n(i, a, l, r)
                      : i(
                          'w.uint32(%d).%s(%s)',
                          ((a.id << 3) | h) >>> 0,
                          p,
                          r
                        ));
            }
            return i('return w');
          }
          t.exports = i;
          var o = e(16),
            s = e(36),
            u = e(37);
        },
        { 16: 16, 36: 36, 37: 37 },
      ],
      16: [
        function (e, t, r) {
          function n(e, t, r) {
            if ((i.call(this, e, r), t && 'object' != typeof t))
              throw TypeError('values must be an object');
            if (
              ((this.valuesById = {}),
              (this.values = Object.create(this.valuesById)),
              (this.comments = {}),
              t)
            )
              for (var n = Object.keys(t), o = 0; o < n.length; ++o)
                this.valuesById[(this.values[n[o]] = t[n[o]])] = n[o];
          }
          t.exports = n;
          var i = e(25);
          ((n.prototype = Object.create(i.prototype)).constructor =
            n).className = 'Enum';
          var o = e(37);
          (n.fromJSON = function (e, t) {
            return new n(e, t.values, t.options);
          }),
            (n.prototype.toJSON = function () {
              return { options: this.options, values: this.values };
            }),
            (n.prototype.add = function (e, t, r) {
              if (!o.isString(e)) throw TypeError('name must be a string');
              if (!o.isInteger(t)) throw TypeError('id must be an integer');
              if (this.values[e] !== undefined) throw Error('duplicate name');
              if (this.valuesById[t] !== undefined) {
                if (!this.options || !this.options.allow_alias)
                  throw Error('duplicate id');
                this.values[e] = t;
              } else this.valuesById[(this.values[e] = t)] = e;
              return (this.comments[e] = r || null), this;
            }),
            (n.prototype.remove = function (e) {
              if (!o.isString(e)) throw TypeError('name must be a string');
              var t = this.values[e];
              if (t === undefined) throw Error('name does not exist');
              return (
                delete this.valuesById[t],
                delete this.values[e],
                delete this.comments[e],
                this
              );
            });
        },
        { 25: 25, 37: 37 },
      ],
      17: [
        function (e, t, r) {
          function n(e, t, r, n, o, s) {
            if (
              (f.isObject(n)
                ? ((s = n), (n = o = undefined))
                : f.isObject(o) && ((s = o), (o = undefined)),
              i.call(this, e, s),
              !f.isInteger(t) || 0 > t)
            )
              throw TypeError('id must be a non-negative integer');
            if (!f.isString(r)) throw TypeError('type must be a string');
            if (n !== undefined && !a.test((n = ('' + n).toLowerCase())))
              throw TypeError('rule must be a string rule');
            if (o !== undefined && !f.isString(o))
              throw TypeError('extend must be a string');
            (this.rule = n && 'optional' !== n ? n : undefined),
              (this.type = r),
              (this.id = t),
              (this.extend = o || undefined),
              (this.required = 'required' === n),
              (this.optional = !this.required),
              (this.repeated = 'repeated' === n),
              (this.map = !1),
              (this.message = null),
              (this.partOf = null),
              (this.typeDefault = null),
              (this.defaultValue = null),
              (this['long'] = f.Long ? u['long'][r] !== undefined : !1),
              (this.bytes = 'bytes' === r),
              (this.resolvedType = null),
              (this.extensionField = null),
              (this.declaringField = null),
              (this._packed = null);
          }
          t.exports = n;
          var i = e(25);
          ((n.prototype = Object.create(i.prototype)).constructor =
            n).className = 'Field';
          var o,
            s = e(16),
            u = e(36),
            f = e(37),
            a = /^required|optional|repeated$/;
          Object.defineProperty(n.prototype, 'packed', {
            get: function () {
              return (
                null === this._packed &&
                  (this._packed = this.getOption('packed') !== !1),
                this._packed
              );
            },
          }),
            (n.prototype.setOption = function (e, t, r) {
              return (
                'packed' === e && (this._packed = null),
                i.prototype.setOption.call(this, e, t, r)
              );
            }),
            (n.fromJSON = function (e, t) {
              return new n(e, t.id, t.type, t.rule, t.extend, t.options);
            }),
            (n.prototype.toJSON = function () {
              return {
                rule: ('optional' !== this.rule && this.rule) || undefined,
                type: this.type,
                id: this.id,
                extend: this.extend,
                options: this.options,
              };
            }),
            (n.prototype.resolve = function () {
              if (this.resolved) return this;
              if (
                ((this.typeDefault = u.defaults[this.type]) === undefined &&
                  (o || (o = e(35)),
                  (this.resolvedType = (
                    this.declaringField
                      ? this.declaringField.parent
                      : this.parent
                  ).lookupTypeOrEnum(this.type)),
                  this.resolvedType instanceof o
                    ? (this.typeDefault = null)
                    : (this.typeDefault =
                        this.resolvedType.values[
                          Object.keys(this.resolvedType.values)[0]
                        ])),
                this.options &&
                  this.options['default'] !== undefined &&
                  ((this.typeDefault = this.options['default']),
                  this.resolvedType instanceof s &&
                    'string' == typeof this.typeDefault &&
                    (this.typeDefault =
                      this.resolvedType.values[this.typeDefault])),
                !this.options ||
                  this.options.packed === undefined ||
                  !this.resolvedType ||
                  this.resolvedType instanceof s ||
                  delete this.options.packed,
                this['long'])
              )
                (this.typeDefault = f.Long.fromNumber(
                  this.typeDefault,
                  'u' === this.type.charAt(0)
                )),
                  Object.freeze && Object.freeze(this.typeDefault);
              else if (this.bytes && 'string' == typeof this.typeDefault) {
                var t;
                f.base64.test(this.typeDefault)
                  ? f.base64.decode(
                      this.typeDefault,
                      (t = f.newBuffer(f.base64.length(this.typeDefault))),
                      0
                    )
                  : f.utf8.write(
                      this.typeDefault,
                      (t = f.newBuffer(f.utf8.length(this.typeDefault))),
                      0
                    ),
                  (this.typeDefault = t);
              }
              return (
                this.map
                  ? (this.defaultValue = f.emptyObject)
                  : this.repeated
                  ? (this.defaultValue = f.emptyArray)
                  : (this.defaultValue = this.typeDefault),
                i.prototype.resolve.call(this)
              );
            });
        },
        { 16: 16, 25: 25, 35: 35, 36: 36, 37: 37 },
      ],
      18: [
        function (e, t, r) {
          function n(e, t, r) {
            return (
              'function' == typeof t
                ? ((r = t), (t = new o.Root()))
                : t || (t = new o.Root()),
              t.load(e, r)
            );
          }
          function i(e, t) {
            return t || (t = new o.Root()), t.loadSync(e);
          }
          var o = (t.exports = e(19));
          (o.build = 'light'),
            (o.load = n),
            (o.loadSync = i),
            (o.encoder = e(15)),
            (o.decoder = e(14)),
            (o.verifier = e(40)),
            (o.converter = e(13)),
            (o.ReflectionObject = e(25)),
            (o.Namespace = e(24)),
            (o.Root = e(30)),
            (o.Enum = e(16)),
            (o.Type = e(35)),
            (o.Field = e(17)),
            (o.OneOf = e(26)),
            (o.MapField = e(21)),
            (o.Service = e(33)),
            (o.Method = e(23)),
            (o.Class = e(11)),
            (o.Message = e(22)),
            (o.types = e(36)),
            (o.util = e(37)),
            o.ReflectionObject._configure(o.Root),
            o.Namespace._configure(o.Type, o.Service),
            o.Root._configure(o.Type);
        },
        {
          11: 11,
          13: 13,
          14: 14,
          15: 15,
          16: 16,
          17: 17,
          19: 19,
          21: 21,
          22: 22,
          23: 23,
          24: 24,
          25: 25,
          26: 26,
          30: 30,
          33: 33,
          35: 35,
          36: 36,
          37: 37,
          40: 40,
        },
      ],
      19: [
        function (e, t, r) {
          function n() {
            i.Reader._configure(i.BufferReader), i.util._configure();
          }
          var i = r;
          (i.build = 'minimal'),
            (i.roots = {}),
            (i.Writer = e(41)),
            (i.BufferWriter = e(42)),
            (i.Reader = e(28)),
            (i.BufferReader = e(29)),
            (i.util = e(39)),
            (i.rpc = e(31)),
            (i.configure = n),
            i.Writer._configure(i.BufferWriter),
            n();
        },
        { 28: 28, 29: 29, 31: 31, 39: 39, 41: 41, 42: 42 },
      ],
      20: [
        function (e, t, r) {
          var n = (t.exports = e(18));
          (n.build = 'full'),
            (n.tokenize = e(34)),
            (n.parse = e(27)),
            (n.common = e(12)),
            n.Root._configure(n.Type, n.parse, n.common);
        },
        { 12: 12, 18: 18, 27: 27, 34: 34 },
      ],
      21: [
        function (e, t, r) {
          function n(e, t, r, n, o) {
            if ((i.call(this, e, t, n, o), !s.isString(r)))
              throw TypeError('keyType must be a string');
            (this.keyType = r), (this.resolvedKeyType = null), (this.map = !0);
          }
          t.exports = n;
          var i = e(17);
          ((n.prototype = Object.create(i.prototype)).constructor =
            n).className = 'MapField';
          var o = e(36),
            s = e(37);
          (n.fromJSON = function (e, t) {
            return new n(e, t.id, t.keyType, t.type, t.options);
          }),
            (n.prototype.toJSON = function () {
              return {
                keyType: this.keyType,
                type: this.type,
                id: this.id,
                extend: this.extend,
                options: this.options,
              };
            }),
            (n.prototype.resolve = function () {
              if (this.resolved) return this;
              if (o.mapKey[this.keyType] === undefined)
                throw Error('invalid key type: ' + this.keyType);
              return i.prototype.resolve.call(this);
            });
        },
        { 17: 17, 36: 36, 37: 37 },
      ],
      22: [
        function (e, t, r) {
          function n(e) {
            if (e)
              for (var t = Object.keys(e), r = 0; r < t.length; ++r)
                this[t[r]] = e[t[r]];
          }
          t.exports = n;
          var i = e(37);
          (n.encode = function (e, t) {
            return this.$type.encode(e, t);
          }),
            (n.encodeDelimited = function (e, t) {
              return this.$type.encodeDelimited(e, t);
            }),
            (n.decode = function (e) {
              return this.$type.decode(e);
            }),
            (n.decodeDelimited = function (e) {
              return this.$type.decodeDelimited(e);
            }),
            (n.verify = function (e) {
              return this.$type.verify(e);
            }),
            (n.fromObject = function (e) {
              return this.$type.fromObject(e);
            }),
            (n.from = n.fromObject),
            (n.toObject = function (e, t) {
              return this.$type.toObject(e, t);
            }),
            (n.prototype.toObject = function (e) {
              return this.$type.toObject(this, e);
            }),
            (n.prototype.toJSON = function () {
              return this.$type.toObject(this, i.toJSONOptions);
            });
        },
        { 37: 37 },
      ],
      23: [
        function (e, t, r) {
          function n(e, t, r, n, s, u, f) {
            if (
              (o.isObject(s)
                ? ((f = s), (s = u = undefined))
                : o.isObject(u) && ((f = u), (u = undefined)),
              t !== undefined && !o.isString(t))
            )
              throw TypeError('type must be a string');
            if (!o.isString(r)) throw TypeError('requestType must be a string');
            if (!o.isString(n))
              throw TypeError('responseType must be a string');
            i.call(this, e, f),
              (this.type = t || 'rpc'),
              (this.requestType = r),
              (this.requestStream = s ? !0 : undefined),
              (this.responseType = n),
              (this.responseStream = u ? !0 : undefined),
              (this.resolvedRequestType = null),
              (this.resolvedResponseType = null);
          }
          t.exports = n;
          var i = e(25);
          ((n.prototype = Object.create(i.prototype)).constructor =
            n).className = 'Method';
          var o = e(37);
          (n.fromJSON = function (e, t) {
            return new n(
              e,
              t.type,
              t.requestType,
              t.responseType,
              t.requestStream,
              t.responseStream,
              t.options
            );
          }),
            (n.prototype.toJSON = function () {
              return {
                type: ('rpc' !== this.type && this.type) || undefined,
                requestType: this.requestType,
                requestStream: this.requestStream,
                responseType: this.responseType,
                responseStream: this.responseStream,
                options: this.options,
              };
            }),
            (n.prototype.resolve = function () {
              return this.resolved
                ? this
                : ((this.resolvedRequestType = this.parent.lookupType(
                    this.requestType
                  )),
                  (this.resolvedResponseType = this.parent.lookupType(
                    this.responseType
                  )),
                  i.prototype.resolve.call(this));
            });
        },
        { 25: 25, 37: 37 },
      ],
      24: [
        function (e, t, r) {
          function n(e) {
            if (!e || !e.length) return undefined;
            for (var t = {}, r = 0; r < e.length; ++r)
              t[e[r].name] = e[r].toJSON();
            return t;
          }
          function i(e, t) {
            s.call(this, e, t),
              (this.nested = undefined),
              (this._nestedArray = null);
          }
          function o(e) {
            return (e._nestedArray = null), e;
          }
          t.exports = i;
          var s = e(25);
          ((i.prototype = Object.create(s.prototype)).constructor =
            i).className = 'Namespace';
          var u,
            f,
            a = e(16),
            l = e(17),
            p = e(37);
          (i.fromJSON = function (e, t) {
            return new i(e, t.options).addJSON(t.nested);
          }),
            (i.arrayToJSON = n),
            Object.defineProperty(i.prototype, 'nestedArray', {
              get: function () {
                return (
                  this._nestedArray ||
                  (this._nestedArray = p.toArray(this.nested))
                );
              },
            }),
            (i.prototype.toJSON = function () {
              return { options: this.options, nested: n(this.nestedArray) };
            }),
            (i.prototype.addJSON = function (e) {
              var t = this;
              if (e)
                for (var r, n = Object.keys(e), o = 0; o < n.length; ++o)
                  (r = e[n[o]]),
                    t.add(
                      (r.fields !== undefined
                        ? u.fromJSON
                        : r.values !== undefined
                        ? a.fromJSON
                        : r.methods !== undefined
                        ? f.fromJSON
                        : r.id !== undefined
                        ? l.fromJSON
                        : i.fromJSON)(n[o], r)
                    );
              return this;
            }),
            (i.prototype.get = function (e) {
              return (this.nested && this.nested[e]) || null;
            }),
            (i.prototype.getEnum = function (e) {
              if (this.nested && this.nested[e] instanceof a)
                return this.nested[e].values;
              throw Error('no such enum');
            }),
            (i.prototype.add = function (e) {
              if (
                !(
                  (e instanceof l && e.extend !== undefined) ||
                  e instanceof u ||
                  e instanceof a ||
                  e instanceof f ||
                  e instanceof i
                )
              )
                throw TypeError('object must be a valid nested object');
              if (this.nested) {
                var t = this.get(e.name);
                if (t) {
                  if (
                    !(t instanceof i && e instanceof i) ||
                    t instanceof u ||
                    t instanceof f
                  )
                    throw Error("duplicate name '" + e.name + "' in " + this);
                  for (var r = t.nestedArray, n = 0; n < r.length; ++n)
                    e.add(r[n]);
                  this.remove(t),
                    this.nested || (this.nested = {}),
                    e.setOptions(t.options, !0);
                }
              } else this.nested = {};
              return (this.nested[e.name] = e), e.onAdd(this), o(this);
            }),
            (i.prototype.remove = function (e) {
              if (!(e instanceof s))
                throw TypeError('object must be a ReflectionObject');
              if (e.parent !== this)
                throw Error(e + ' is not a member of ' + this);
              return (
                delete this.nested[e.name],
                Object.keys(this.nested).length || (this.nested = undefined),
                e.onRemove(this),
                o(this)
              );
            }),
            (i.prototype.define = function (e, t) {
              if (p.isString(e)) e = e.split('.');
              else if (!Array.isArray(e)) throw TypeError('illegal path');
              if (e && e.length && '' === e[0])
                throw Error('path must be relative');
              for (var r = this; e.length > 0; ) {
                var n = e.shift();
                if (r.nested && r.nested[n]) {
                  if (((r = r.nested[n]), !(r instanceof i)))
                    throw Error('path conflicts with non-namespace objects');
                } else r.add((r = new i(n)));
              }
              return t && r.addJSON(t), r;
            }),
            (i.prototype.resolveAll = function () {
              for (var e = this.nestedArray, t = 0; t < e.length; )
                e[t] instanceof i ? e[t++].resolveAll() : e[t++].resolve();
              return this.resolve();
            }),
            (i.prototype.lookup = function (e, t, r) {
              if (
                ('boolean' == typeof t
                  ? ((r = t), (t = undefined))
                  : t && !Array.isArray(t) && (t = [t]),
                p.isString(e) && e.length)
              ) {
                if ('.' === e) return this.root;
                e = e.split('.');
              } else if (!e.length) return this;
              if ('' === e[0]) return this.root.lookup(e.slice(1), t);
              var n = this.get(e[0]);
              if (n)
                if (1 === e.length) {
                  if (!t || t.indexOf(n.constructor) > -1) return n;
                } else if (n instanceof i && (n = n.lookup(e.slice(1), t, !0)))
                  return n;
              return null === this.parent || r
                ? null
                : this.parent.lookup(e, t);
            }),
            (i.prototype.lookupType = function (e) {
              var t = this.lookup(e, [u]);
              if (!t) throw Error('no such type');
              return t;
            }),
            (i.prototype.lookupEnum = function (e) {
              var t = this.lookup(e, [a]);
              if (!t) throw Error("no such Enum '" + e + "' in " + this);
              return t;
            }),
            (i.prototype.lookupTypeOrEnum = function (e) {
              var t = this.lookup(e, [u, a]);
              if (!t)
                throw Error("no such Type or Enum '" + e + "' in " + this);
              return t;
            }),
            (i.prototype.lookupService = function (e) {
              var t = this.lookup(e, [f]);
              if (!t) throw Error("no such Service '" + e + "' in " + this);
              return t;
            }),
            (i._configure = function (e, t) {
              (u = e), (f = t);
            });
        },
        { 16: 16, 17: 17, 25: 25, 37: 37 },
      ],
      25: [
        function (e, t, r) {
          function n(e, t) {
            if (!o.isString(e)) throw TypeError('name must be a string');
            if (t && !o.isObject(t))
              throw TypeError('options must be an object');
            (this.options = t),
              (this.name = e),
              (this.parent = null),
              (this.resolved = !1),
              (this.comment = null),
              (this.filename = null);
          }
          (t.exports = n), (n.className = 'ReflectionObject');
          var i,
            o = e(37);
          Object.defineProperties(n.prototype, {
            root: {
              get: function () {
                for (var e = this; null !== e.parent; ) e = e.parent;
                return e;
              },
            },
            fullName: {
              get: function () {
                for (var e = [this.name], t = this.parent; t; )
                  e.unshift(t.name), (t = t.parent);
                return e.join('.');
              },
            },
          }),
            (n.prototype.toJSON = function () {
              throw Error();
            }),
            (n.prototype.onAdd = function (e) {
              this.parent && this.parent !== e && this.parent.remove(this),
                (this.parent = e),
                (this.resolved = !1);
              var t = e.root;
              t instanceof i && t._handleAdd(this);
            }),
            (n.prototype.onRemove = function (e) {
              var t = e.root;
              t instanceof i && t._handleRemove(this),
                (this.parent = null),
                (this.resolved = !1);
            }),
            (n.prototype.resolve = function () {
              return this.resolved
                ? this
                : (this.root instanceof i && (this.resolved = !0), this);
            }),
            (n.prototype.getOption = function (e) {
              return this.options ? this.options[e] : undefined;
            }),
            (n.prototype.setOption = function (e, t, r) {
              return (
                (r && this.options && this.options[e] !== undefined) ||
                  ((this.options || (this.options = {}))[e] = t),
                this
              );
            }),
            (n.prototype.setOptions = function (e, t) {
              if (e)
                for (var r = Object.keys(e), n = 0; n < r.length; ++n)
                  this.setOption(r[n], e[r[n]], t);
              return this;
            }),
            (n.prototype.toString = function () {
              var e = this.constructor.className,
                t = this.fullName;
              return t.length ? e + ' ' + t : e;
            }),
            (n._configure = function (e) {
              i = e;
            });
        },
        { 37: 37 },
      ],
      26: [
        function (e, t, r) {
          function n(e, t, r) {
            if (
              (Array.isArray(t) || ((r = t), (t = undefined)),
              o.call(this, e, r),
              t !== undefined && !Array.isArray(t))
            )
              throw TypeError('fieldNames must be an Array');
            (this.oneof = t || []), (this.fieldsArray = []);
          }
          function i(e) {
            if (e.parent)
              for (var t = 0; t < e.fieldsArray.length; ++t)
                e.fieldsArray[t].parent || e.parent.add(e.fieldsArray[t]);
          }
          t.exports = n;
          var o = e(25);
          ((n.prototype = Object.create(o.prototype)).constructor =
            n).className = 'OneOf';
          var s = e(17);
          (n.fromJSON = function (e, t) {
            return new n(e, t.oneof, t.options);
          }),
            (n.prototype.toJSON = function () {
              return { oneof: this.oneof, options: this.options };
            }),
            (n.prototype.add = function (e) {
              if (!(e instanceof s)) throw TypeError('field must be a Field');
              return (
                e.parent && e.parent !== this.parent && e.parent.remove(e),
                this.oneof.push(e.name),
                this.fieldsArray.push(e),
                (e.partOf = this),
                i(this),
                this
              );
            }),
            (n.prototype.remove = function (e) {
              if (!(e instanceof s)) throw TypeError('field must be a Field');
              var t = this.fieldsArray.indexOf(e);
              if (0 > t) throw Error(e + ' is not a member of ' + this);
              return (
                this.fieldsArray.splice(t, 1),
                (t = this.oneof.indexOf(e.name)),
                t > -1 && this.oneof.splice(t, 1),
                (e.partOf = null),
                this
              );
            }),
            (n.prototype.onAdd = function (e) {
              o.prototype.onAdd.call(this, e);
              for (var t = this, r = 0; r < this.oneof.length; ++r) {
                var n = e.get(this.oneof[r]);
                n && !n.partOf && ((n.partOf = t), t.fieldsArray.push(n));
              }
              i(this);
            }),
            (n.prototype.onRemove = function (e) {
              for (var t, r = 0; r < this.fieldsArray.length; ++r)
                (t = this.fieldsArray[r]).parent && t.parent.remove(t);
              o.prototype.onRemove.call(this, e);
            });
        },
        { 17: 17, 25: 25 },
      ],
      27: [
        function (e, t, r) {
          function n(e) {
            return (
              e.substring(0, 1) +
              e.substring(1).replace(S, function (e, t) {
                return t.toUpperCase();
              })
            );
          }
          function i(e, t, r) {
            function S(e, t, r) {
              var n = i.filename;
              return (
                r || (i.filename = null),
                Error(
                  'illegal ' +
                    (t || 'token') +
                    " '" +
                    e +
                    "' (" +
                    (n ? n + ', ' : '') +
                    'line ' +
                    re.line() +
                    ')'
                )
              );
            }
            function T() {
              var e,
                t = [];
              do {
                if ('"' !== (e = ne()) && "'" !== e) throw S(e);
                t.push(ne()), se(e), (e = oe());
              } while ('"' === e || "'" === e);
              return t.join('');
            }
            function _(e) {
              var t = ne();
              switch (t) {
                case "'":
                case '"':
                  return ie(t), T();
                case 'true':
                case 'TRUE':
                  return !0;
                case 'false':
                case 'FALSE':
                  return !1;
              }
              try {
                return N(t, !0);
              } catch (r) {
                if (e && j.test(t)) return t;
                throw S(t, 'value');
              }
            }
            function E(e, t) {
              var r, n;
              do
                !t || ('"' !== (r = oe()) && "'" !== r)
                  ? e.push([(n = B(ne())), se('to', !0) ? B(ne()) : n])
                  : e.push(T());
              while (se(',', !0));
              se(';');
            }
            function N(e, t) {
              var r = 1;
              switch (
                ('-' === e.charAt(0) && ((r = -1), (e = e.substring(1))), e)
              ) {
                case 'inf':
                case 'INF':
                case 'Inf':
                  return r * (1 / 0);
                case 'nan':
                case 'NAN':
                case 'Nan':
                case 'NaN':
                  return NaN;
                case '0':
                  return 0;
              }
              if (m.test(e)) return r * parseInt(e, 10);
              if (g.test(e)) return r * parseInt(e, 16);
              if (w.test(e)) return r * parseInt(e, 8);
              if (k.test(e)) return r * parseFloat(e);
              throw S(e, 'number', t);
            }
            function B(e, t) {
              switch (e) {
                case 'max':
                case 'MAX':
                case 'Max':
                  return 536870911;
                case '0':
                  return 0;
              }
              if (!t && '-' === e.charAt(0)) throw S(e, 'id');
              if (v.test(e)) return parseInt(e, 10);
              if (b.test(e)) return parseInt(e, 16);
              if (O.test(e)) return parseInt(e, 8);
              throw S(e, 'id');
            }
            function I() {
              if (X !== undefined) throw S('package');
              if (((X = ne()), !j.test(X))) throw S(X, 'name');
              (le = le.define(X)), se(';');
            }
            function D() {
              var e,
                t = oe();
              switch (t) {
                case 'weak':
                  (e = Y || (Y = [])), ne();
                  break;
                case 'public':
                  ne();
                default:
                  e = Q || (Q = []);
              }
              (t = T()), se(';'), e.push(t);
            }
            function L() {
              if (
                (se('='),
                (ee = T()),
                (ae = 'proto3' === ee),
                !ae && 'proto2' !== ee)
              )
                throw S(ee, 'syntax');
              se(';');
            }
            function F(e, t) {
              switch (t) {
                case 'option':
                  return M(e, t), se(';'), !0;
                case 'message':
                  return R(e, t), !0;
                case 'enum':
                  return z(e, t), !0;
                case 'service':
                  return Z(e, t), !0;
                case 'extend':
                  return G(e, t), !0;
              }
              return !1;
            }
            function J(e, t, r) {
              var n = re.line();
              if (
                (e && ((e.comment = ue()), (e.filename = i.filename)),
                se('{', !0))
              ) {
                for (var o; '}' !== (o = ne()); ) t(o);
                se(';', !0);
              } else
                r && r(),
                  se(';'),
                  e && 'string' != typeof e.comment && (e.comment = ue(n));
            }
            function R(e, t) {
              if (!A.test((t = ne()))) throw S(t, 'type name');
              var r = new u(t);
              J(r, function (e) {
                if (!F(r, e))
                  switch (e) {
                    case 'map':
                      V(r, e);
                      break;
                    case 'required':
                    case 'optional':
                    case 'repeated':
                      P(r, e);
                      break;
                    case 'oneof':
                      $(r, e);
                      break;
                    case 'extensions':
                      E(r.extensions || (r.extensions = []));
                      break;
                    case 'reserved':
                      E(r.reserved || (r.reserved = []), !0);
                      break;
                    default:
                      if (!ae || !j.test(e)) throw S(e);
                      ie(e), P(r, 'optional');
                  }
              }),
                e.add(r);
            }
            function P(e, t, r) {
              var n = ne();
              if ('group' === n) return q(e, t), undefined;
              if (!j.test(n)) throw S(n, 'type');
              var i = ne();
              if (!A.test(i)) throw S(i, 'name');
              (i = pe(i)), se('=');
              var o = new f(i, B(ne()), n, t, r);
              J(
                o,
                function (e) {
                  if ('option' !== e) throw S(e);
                  M(o, e), se(';');
                },
                function () {
                  W(o);
                }
              ),
                e.add(o),
                !ae && o.repeated && o.setOption('packed', !1, !0);
            }
            function q(e, t) {
              var r = ne();
              if (!A.test(r)) throw S(r, 'name');
              var n = y.lcFirst(r);
              r === n && (r = y.ucFirst(r)), se('=');
              var o = B(ne()),
                s = new u(r);
              s.group = !0;
              var a = new f(n, o, r, t);
              (a.filename = i.filename),
                J(s, function (e) {
                  switch (e) {
                    case 'option':
                      M(s, e), se(';');
                      break;
                    case 'required':
                    case 'optional':
                    case 'repeated':
                      P(s, e);
                      break;
                    default:
                      throw S(e);
                  }
                }),
                e.add(s).add(a);
            }
            function V(e) {
              se('<');
              var t = ne();
              if (d.mapKey[t] === undefined) throw S(t, 'type');
              se(',');
              var r = ne();
              if (!j.test(r)) throw S(r, 'type');
              se('>');
              var n = ne();
              if (!A.test(n)) throw S(n, 'name');
              se('=');
              var i = new a(pe(n), B(ne()), t, r);
              J(
                i,
                function (e) {
                  if ('option' !== e) throw S(e);
                  M(i, e), se(';');
                },
                function () {
                  W(i);
                }
              ),
                e.add(i);
            }
            function $(e, t) {
              if (!A.test((t = ne()))) throw S(t, 'name');
              var r = new l(pe(t));
              J(r, function (e) {
                'option' === e ? (M(r, e), se(';')) : (ie(e), P(r, 'optional'));
              }),
                e.add(r);
            }
            function z(e, t) {
              if (!A.test((t = ne()))) throw S(t, 'name');
              var r = new p(t);
              J(r, function (e) {
                'option' === e ? (M(r, e), se(';')) : C(r, e);
              }),
                e.add(r);
            }
            function C(e, t) {
              if (!A.test(t)) throw S(t, 'name');
              se('=');
              var r = B(ne(), !0),
                n = {};
              J(
                n,
                function (e) {
                  if ('option' !== e) throw S(e);
                  M(n, e), se(';');
                },
                function () {
                  W(n);
                }
              ),
                e.add(t, r, n.comment);
            }
            function M(e, t) {
              var r = se('(', !0);
              if (!j.test((t = ne()))) throw S(t, 'name');
              var n = t;
              r &&
                (se(')'),
                (n = '(' + n + ')'),
                (t = oe()),
                x.test(t) && ((n += t), ne())),
                se('='),
                U(e, n);
            }
            function U(e, t) {
              if (se('{', !0)) {
                do {
                  if (!A.test((te = ne()))) throw S(te, 'name');
                  '{' === oe()
                    ? U(e, t + '.' + te)
                    : (se(':'), H(e, t + '.' + te, _(!0)));
                } while (!se('}', !0));
              } else H(e, t, _(!0));
            }
            function H(e, t, r) {
              e.setOption && e.setOption(t, r);
            }
            function W(e) {
              if (se('[', !0)) {
                do M(e, 'option');
                while (se(',', !0));
                se(']');
              }
              return e;
            }
            function Z(e, t) {
              if (!A.test((t = ne()))) throw S(t, 'service name');
              var r = new h(t);
              J(r, function (e) {
                if (!F(r, e)) {
                  if ('rpc' !== e) throw S(e);
                  K(r, e);
                }
              }),
                e.add(r);
            }
            function K(e, t) {
              var r = t;
              if (!A.test((t = ne()))) throw S(t, 'name');
              var n,
                i,
                o,
                s,
                u = t;
              if ((se('('), se('stream', !0) && (i = !0), !j.test((t = ne()))))
                throw S(t);
              if (
                ((n = t),
                se(')'),
                se('returns'),
                se('('),
                se('stream', !0) && (s = !0),
                !j.test((t = ne())))
              )
                throw S(t);
              (o = t), se(')');
              var f = new c(u, r, n, o, i, s);
              J(f, function (e) {
                if ('option' !== e) throw S(e);
                M(f, e), se(';');
              }),
                e.add(f);
            }
            function G(e, t) {
              if (!j.test((t = ne()))) throw S(t, 'reference');
              var r = t;
              J(null, function (t) {
                switch (t) {
                  case 'required':
                  case 'repeated':
                  case 'optional':
                    P(e, t, r);
                    break;
                  default:
                    if (!ae || !j.test(t)) throw S(t);
                    ie(t), P(e, 'optional', r);
                }
              });
            }
            t instanceof s || ((r = t), (t = new s())), r || (r = i.defaults);
            for (
              var X,
                Q,
                Y,
                ee,
                te,
                re = o(e),
                ne = re.next,
                ie = re.push,
                oe = re.peek,
                se = re.skip,
                ue = re.cmnt,
                fe = !0,
                ae = !1,
                le = t,
                pe = r.keepCase
                  ? function (e) {
                      return e;
                    }
                  : n;
              null !== (te = ne());

            )
              switch (te) {
                case 'package':
                  if (!fe) throw S(te);
                  I();
                  break;
                case 'import':
                  if (!fe) throw S(te);
                  D();
                  break;
                case 'syntax':
                  if (!fe) throw S(te);
                  L();
                  break;
                case 'option':
                  if (!fe) throw S(te);
                  M(le, te), se(';');
                  break;
                default:
                  if (F(le, te)) {
                    fe = !1;
                    continue;
                  }
                  throw S(te);
              }
            return (
              (i.filename = null),
              { package: X, imports: Q, weakImports: Y, syntax: ee, root: t }
            );
          }
          (t.exports = i), (i.filename = null), (i.defaults = { keepCase: !1 });
          var o = e(34),
            s = e(30),
            u = e(35),
            f = e(17),
            a = e(21),
            l = e(26),
            p = e(16),
            h = e(33),
            c = e(23),
            d = e(36),
            y = e(37),
            m = /^[1-9][0-9]*$/,
            v = /^-?[1-9][0-9]*$/,
            g = /^0[x][0-9a-fA-F]+$/,
            b = /^-?0[x][0-9a-fA-F]+$/,
            w = /^0[0-7]+$/,
            O = /^-?0[0-7]+$/,
            k = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/,
            A = /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            j = /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)+$/,
            x = /^(?:\.[a-zA-Z][a-zA-Z_0-9]*)+$/,
            S = /_([a-z])/g;
        },
        {
          16: 16,
          17: 17,
          21: 21,
          23: 23,
          26: 26,
          30: 30,
          33: 33,
          34: 34,
          35: 35,
          36: 36,
          37: 37,
        },
      ],
      28: [
        function (e, t, r) {
          function n(e, t) {
            return RangeError(
              'index out of range: ' + e.pos + ' + ' + (t || 1) + ' > ' + e.len
            );
          }
          function i(e) {
            (this.buf = e), (this.pos = 0), (this.len = e.length);
          }
          function o() {
            var e = new l(0, 0),
              t = 0;
            if (!(this.len - this.pos > 4)) {
              for (; 3 > t; ++t) {
                if (this.pos >= this.len) throw n(this);
                if (
                  ((e.lo =
                    (e.lo | ((127 & this.buf[this.pos]) << (7 * t))) >>> 0),
                  this.buf[this.pos++] < 128)
                )
                  return e;
              }
              return (
                (e.lo =
                  (e.lo | ((127 & this.buf[this.pos++]) << (7 * t))) >>> 0),
                e
              );
            }
            for (; 4 > t; ++t)
              if (
                ((e.lo =
                  (e.lo | ((127 & this.buf[this.pos]) << (7 * t))) >>> 0),
                this.buf[this.pos++] < 128)
              )
                return e;
            if (
              ((e.lo = (e.lo | ((127 & this.buf[this.pos]) << 28)) >>> 0),
              (e.hi = (e.hi | ((127 & this.buf[this.pos]) >> 4)) >>> 0),
              this.buf[this.pos++] < 128)
            )
              return e;
            if (((t = 0), this.len - this.pos > 4)) {
              for (; 5 > t; ++t)
                if (
                  ((e.hi =
                    (e.hi | ((127 & this.buf[this.pos]) << (7 * t + 3))) >>> 0),
                  this.buf[this.pos++] < 128)
                )
                  return e;
            } else
              for (; 5 > t; ++t) {
                if (this.pos >= this.len) throw n(this);
                if (
                  ((e.hi =
                    (e.hi | ((127 & this.buf[this.pos]) << (7 * t + 3))) >>> 0),
                  this.buf[this.pos++] < 128)
                )
                  return e;
              }
            throw Error('invalid varint encoding');
          }
          function s(e, t) {
            return (
              (e[t - 4] |
                (e[t - 3] << 8) |
                (e[t - 2] << 16) |
                (e[t - 1] << 24)) >>>
              0
            );
          }
          function u() {
            if (this.pos + 8 > this.len) throw n(this, 8);
            return new l(
              s(this.buf, (this.pos += 4)),
              s(this.buf, (this.pos += 4))
            );
          }
          t.exports = i;
          var f,
            a = e(39),
            l = a.LongBits,
            p = a.utf8,
            h =
              'undefined' != typeof Uint8Array
                ? function (e) {
                    if (e instanceof Uint8Array || Array.isArray(e))
                      return new i(e);
                    throw Error('illegal buffer');
                  }
                : function (e) {
                    if (Array.isArray(e)) return new i(e);
                    throw Error('illegal buffer');
                  };
          (i.create = a.Buffer
            ? function (e) {
                return (i.create = function (e) {
                  return a.Buffer.isBuffer(e) ? new f(e) : h(e);
                })(e);
              }
            : h),
            (i.prototype._slice =
              a.Array.prototype.subarray || a.Array.prototype.slice),
            (i.prototype.uint32 = (function () {
              var e = 4294967295;
              return function () {
                if (
                  ((e = (127 & this.buf[this.pos]) >>> 0),
                  this.buf[this.pos++] < 128)
                )
                  return e;
                if (
                  ((e = (e | ((127 & this.buf[this.pos]) << 7)) >>> 0),
                  this.buf[this.pos++] < 128)
                )
                  return e;
                if (
                  ((e = (e | ((127 & this.buf[this.pos]) << 14)) >>> 0),
                  this.buf[this.pos++] < 128)
                )
                  return e;
                if (
                  ((e = (e | ((127 & this.buf[this.pos]) << 21)) >>> 0),
                  this.buf[this.pos++] < 128)
                )
                  return e;
                if (
                  ((e = (e | ((15 & this.buf[this.pos]) << 28)) >>> 0),
                  this.buf[this.pos++] < 128)
                )
                  return e;
                if ((this.pos += 5) > this.len)
                  throw ((this.pos = this.len), n(this, 10));
                return e;
              };
            })()),
            (i.prototype.int32 = function () {
              return 0 | this.uint32();
            }),
            (i.prototype.sint32 = function () {
              var e = this.uint32();
              return ((e >>> 1) ^ -(1 & e)) | 0;
            }),
            (i.prototype.bool = function () {
              return 0 !== this.uint32();
            }),
            (i.prototype.fixed32 = function () {
              if (this.pos + 4 > this.len) throw n(this, 4);
              return s(this.buf, (this.pos += 4));
            }),
            (i.prototype.sfixed32 = function () {
              if (this.pos + 4 > this.len) throw n(this, 4);
              return 0 | s(this.buf, (this.pos += 4));
            }),
            (i.prototype['float'] = function () {
              if (this.pos + 4 > this.len) throw n(this, 4);
              var e = a['float'].readFloatLE(this.buf, this.pos);
              return (this.pos += 4), e;
            }),
            (i.prototype['double'] = function () {
              if (this.pos + 8 > this.len) throw n(this, 4);
              var e = a['float'].readDoubleLE(this.buf, this.pos);
              return (this.pos += 8), e;
            }),
            (i.prototype.bytes = function () {
              var e = this.uint32(),
                t = this.pos,
                r = this.pos + e;
              if (r > this.len) throw n(this, e);
              return (
                (this.pos += e),
                t === r
                  ? new this.buf.constructor(0)
                  : this._slice.call(this.buf, t, r)
              );
            }),
            (i.prototype.string = function () {
              var e = this.bytes();
              return p.read(e, 0, e.length);
            }),
            (i.prototype.skip = function (e) {
              if ('number' == typeof e) {
                if (this.pos + e > this.len) throw n(this, e);
                this.pos += e;
              } else
                do if (this.pos >= this.len) throw n(this);
                while (128 & this.buf[this.pos++]);
              return this;
            }),
            (i.prototype.skipType = function (e) {
              switch (e) {
                case 0:
                  this.skip();
                  break;
                case 1:
                  this.skip(8);
                  break;
                case 2:
                  this.skip(this.uint32());
                  break;
                case 3:
                  for (;;) {
                    if (4 === (e = 7 & this.uint32())) break;
                    this.skipType(e);
                  }
                  break;
                case 5:
                  this.skip(4);
                  break;
                default:
                  throw Error(
                    'invalid wire type ' + e + ' at offset ' + this.pos
                  );
              }
              return this;
            }),
            (i._configure = function (e) {
              f = e;
              var t = a.Long ? 'toLong' : 'toNumber';
              a.merge(i.prototype, {
                int64: function () {
                  return o.call(this)[t](!1);
                },
                uint64: function () {
                  return o.call(this)[t](!0);
                },
                sint64: function () {
                  return o.call(this).zzDecode()[t](!1);
                },
                fixed64: function () {
                  return u.call(this)[t](!0);
                },
                sfixed64: function () {
                  return u.call(this)[t](!1);
                },
              });
            });
        },
        { 39: 39 },
      ],
      29: [
        function (e, t, r) {
          function n(e) {
            i.call(this, e);
          }
          t.exports = n;
          var i = e(28);
          (n.prototype = Object.create(i.prototype)).constructor = n;
          var o = e(39);
          o.Buffer && (n.prototype._slice = o.Buffer.prototype.slice),
            (n.prototype.string = function () {
              var e = this.uint32();
              return this.buf.utf8Slice(
                this.pos,
                (this.pos = Math.min(this.pos + e, this.len))
              );
            });
        },
        { 28: 28, 39: 39 },
      ],
      30: [
        function (e, t, r) {
          function n(e) {
            s.call(this, '', e), (this.deferred = []), (this.files = []);
          }
          function i() {}
          function o(e, t) {
            var r = t.parent.lookup(t.extend);
            if (r) {
              var n = new l(
                t.fullName,
                t.id,
                t.type,
                t.rule,
                undefined,
                t.options
              );
              return (
                (n.declaringField = t), (t.extensionField = n), r.add(n), !0
              );
            }
            return !1;
          }
          t.exports = n;
          var s = e(24);
          ((n.prototype = Object.create(s.prototype)).constructor =
            n).className = 'Root';
          var u,
            f,
            a,
            l = e(17),
            p = e(16),
            h = e(37);
          (n.fromJSON = function (e, t) {
            return (
              t || (t = new n()),
              e.options && t.setOptions(e.options),
              t.addJSON(e.nested)
            );
          }),
            (n.prototype.resolvePath = h.path.resolve),
            (n.prototype.load = function d(e, t, r) {
              function n(e, t) {
                if (r) {
                  var n = r;
                  if (((r = null), l)) throw e;
                  n(e, t);
                }
              }
              function o(e, r) {
                try {
                  if (
                    (h.isString(r) &&
                      '{' === r.charAt(0) &&
                      (r = JSON.parse(r)),
                    h.isString(r))
                  ) {
                    f.filename = e;
                    var i,
                      o = f(r, u, t),
                      a = 0;
                    if (o.imports)
                      for (; a < o.imports.length; ++a)
                        (i = u.resolvePath(e, o.imports[a])) && s(i);
                    if (o.weakImports)
                      for (a = 0; a < o.weakImports.length; ++a)
                        (i = u.resolvePath(e, o.weakImports[a])) && s(i, !0);
                  } else u.setOptions(r.options).addJSON(r.nested);
                } catch (c) {
                  n(c);
                }
                l || p || n(null, u);
              }
              function s(e, t) {
                var i = e.lastIndexOf('google/protobuf/');
                if (i > -1) {
                  var s = e.substring(i);
                  s in a && (e = s);
                }
                if (!(u.files.indexOf(e) > -1)) {
                  if ((u.files.push(e), e in a))
                    return (
                      l
                        ? o(e, a[e])
                        : (++p,
                          setTimeout(function () {
                            --p, o(e, a[e]);
                          })),
                      undefined
                    );
                  if (l) {
                    var f;
                    try {
                      f = h.fs.readFileSync(e).toString('utf8');
                    } catch (c) {
                      return t || n(c), undefined;
                    }
                    o(e, f);
                  } else
                    ++p,
                      h.fetch(e, function (i, s) {
                        return (
                          --p,
                          r
                            ? i
                              ? (t ? p || n(null, u) : n(i), undefined)
                              : (o(e, s), undefined)
                            : undefined
                        );
                      });
                }
              }
              'function' == typeof t && ((r = t), (t = undefined));
              var u = this;
              if (!r) return h.asPromise(d, u, e, t);
              var l = r === i,
                p = 0;
              h.isString(e) && (e = [e]);
              for (var c, y = 0; y < e.length; ++y)
                (c = u.resolvePath('', e[y])) && s(c);
              return l ? u : (p || n(null, u), undefined);
            }),
            (n.prototype.loadSync = function (e, t) {
              if (!h.isNode) throw Error('not supported');
              return this.load(e, t, i);
            }),
            (n.prototype.resolveAll = function () {
              if (this.deferred.length)
                throw Error(
                  'unresolvable extensions: ' +
                    this.deferred
                      .map(function (e) {
                        return (
                          "'extend " + e.extend + "' in " + e.parent.fullName
                        );
                      })
                      .join(', ')
                );
              return s.prototype.resolveAll.call(this);
            });
          var c = /^[A-Z]/;
          (n.prototype._handleAdd = function (e) {
            if (e instanceof l)
              e.extend === undefined ||
                e.extensionField ||
                o(this, e) ||
                this.deferred.push(e);
            else if (e instanceof p)
              c.test(e.name) && (e.parent[e.name] = e.values);
            else {
              if (e instanceof u)
                for (var t = 0; t < this.deferred.length; )
                  o(this, this.deferred[t]) ? this.deferred.splice(t, 1) : ++t;
              for (var r = 0; r < e.nestedArray.length; ++r)
                this._handleAdd(e._nestedArray[r]);
              c.test(e.name) && (e.parent[e.name] = e);
            }
          }),
            (n.prototype._handleRemove = function (e) {
              if (e instanceof l) {
                if (e.extend !== undefined)
                  if (e.extensionField)
                    e.extensionField.parent.remove(e.extensionField),
                      (e.extensionField = null);
                  else {
                    var t = this.deferred.indexOf(e);
                    t > -1 && this.deferred.splice(t, 1);
                  }
              } else if (e instanceof p)
                c.test(e.name) && delete e.parent[e.name];
              else if (e instanceof s) {
                for (var r = 0; r < e.nestedArray.length; ++r)
                  this._handleRemove(e._nestedArray[r]);
                c.test(e.name) && delete e.parent[e.name];
              }
            }),
            (n._configure = function (e, t, r) {
              (u = e), (f = t), (a = r);
            });
        },
        { 16: 16, 17: 17, 24: 24, 37: 37 },
      ],
      31: [
        function (e, t, r) {
          var n = r;
          n.Service = e(32);
        },
        { 32: 32 },
      ],
      32: [
        function (e, t, r) {
          function n(e, t, r) {
            if ('function' != typeof e)
              throw TypeError('rpcImpl must be a function');
            i.EventEmitter.call(this),
              (this.rpcImpl = e),
              (this.requestDelimited = !!t),
              (this.responseDelimited = !!r);
          }
          t.exports = n;
          var i = e(39);
          ((n.prototype = Object.create(i.EventEmitter.prototype)).constructor =
            n),
            (n.prototype.rpcCall = function o(e, t, r, n, s) {
              if (!n) throw TypeError('request must be specified');
              var u = this;
              if (!s) return i.asPromise(o, u, e, t, r, n);
              if (!u.rpcImpl)
                return (
                  setTimeout(function () {
                    s(Error('already ended'));
                  }, 0),
                  undefined
                );
              try {
                return u.rpcImpl(
                  e,
                  t[u.requestDelimited ? 'encodeDelimited' : 'encode'](
                    n
                  ).finish(),
                  function (t, n) {
                    if (t) return u.emit('error', t, e), s(t);
                    if (null === n) return u.end(!0), undefined;
                    if (!(n instanceof r))
                      try {
                        n =
                          r[u.responseDelimited ? 'decodeDelimited' : 'decode'](
                            n
                          );
                      } catch (t) {
                        return u.emit('error', t, e), s(t);
                      }
                    return u.emit('data', n, e), s(null, n);
                  }
                );
              } catch (f) {
                return (
                  u.emit('error', f, e),
                  setTimeout(function () {
                    s(f);
                  }, 0),
                  undefined
                );
              }
            }),
            (n.prototype.end = function (e) {
              return (
                this.rpcImpl &&
                  (e || this.rpcImpl(null, null, null),
                  (this.rpcImpl = null),
                  this.emit('end').off()),
                this
              );
            });
        },
        { 39: 39 },
      ],
      33: [
        function (e, t, r) {
          function n(e, t) {
            o.call(this, e, t),
              (this.methods = {}),
              (this._methodsArray = null);
          }
          function i(e) {
            return (e._methodsArray = null), e;
          }
          t.exports = n;
          var o = e(24);
          ((n.prototype = Object.create(o.prototype)).constructor =
            n).className = 'Service';
          var s = e(23),
            u = e(37),
            f = e(31);
          (n.fromJSON = function (e, t) {
            var r = new n(e, t.options);
            if (t.methods)
              for (var i = Object.keys(t.methods), o = 0; o < i.length; ++o)
                r.add(s.fromJSON(i[o], t.methods[i[o]]));
            return t.nested && r.addJSON(t.nested), r;
          }),
            (n.prototype.toJSON = function () {
              var e = o.prototype.toJSON.call(this);
              return {
                options: (e && e.options) || undefined,
                methods: o.arrayToJSON(this.methodsArray) || {},
                nested: (e && e.nested) || undefined,
              };
            }),
            Object.defineProperty(n.prototype, 'methodsArray', {
              get: function () {
                return (
                  this._methodsArray ||
                  (this._methodsArray = u.toArray(this.methods))
                );
              },
            }),
            (n.prototype.get = function (e) {
              return this.methods[e] || o.prototype.get.call(this, e);
            }),
            (n.prototype.resolveAll = function () {
              for (var e = this.methodsArray, t = 0; t < e.length; ++t)
                e[t].resolve();
              return o.prototype.resolve.call(this);
            }),
            (n.prototype.add = function (e) {
              if (this.get(e.name))
                throw Error("duplicate name '" + e.name + "' in " + this);
              return e instanceof s
                ? ((this.methods[e.name] = e), (e.parent = this), i(this))
                : o.prototype.add.call(this, e);
            }),
            (n.prototype.remove = function (e) {
              if (e instanceof s) {
                if (this.methods[e.name] !== e)
                  throw Error(e + ' is not a member of ' + this);
                return delete this.methods[e.name], (e.parent = null), i(this);
              }
              return o.prototype.remove.call(this, e);
            }),
            (n.prototype.create = function (e, t, r) {
              for (
                var n = new f.Service(e, t, r), i = 0;
                i < this.methodsArray.length;
                ++i
              )
                n[u.lcFirst(this._methodsArray[i].resolve().name)] = u
                  .codegen(
                    'r',
                    'c'
                  )('return this.rpcCall(m,q,s,r,c)')
                  .eof(u.lcFirst(this._methodsArray[i].name), {
                    m: this._methodsArray[i],
                    q: this._methodsArray[i].resolvedRequestType.ctor,
                    s: this._methodsArray[i].resolvedResponseType.ctor,
                  });
              return n;
            });
        },
        { 23: 23, 24: 24, 31: 31, 37: 37 },
      ],
      34: [
        function (e, t, r) {
          function n(e) {
            return e.replace(p, function (e, t) {
              switch (t) {
                case '\\':
                case '':
                  return t;
                default:
                  return h[t] || '';
              }
            });
          }
          function i(e) {
            function t(e) {
              return Error('illegal ' + e + ' (line ' + b + ')');
            }
            function r() {
              var r = "'" === j ? u : s;
              r.lastIndex = v - 1;
              var i = r.exec(e);
              if (!i) throw t('string');
              return (v = r.lastIndex), c(j), (j = null), n(i[1]);
            }
            function i(t) {
              return e.charAt(t);
            }
            function p(t, r) {
              (w = e.charAt(t++)), (k = b);
              for (var n = e.substring(t, r).split(a), i = 0; i < n.length; ++i)
                n[i] = n[i].replace(f, '').trim();
              O = n.join('\n').trim();
            }
            function h() {
              if (A.length > 0) return A.shift();
              if (j) return r();
              var n, s, u, f, a;
              do {
                if (v === g) return null;
                for (n = !1; l.test((u = i(v))); )
                  if (('\n' === u && ++b, ++v === g)) return null;
                if ('/' === i(v)) {
                  if (++v === g) throw t('comment');
                  if ('/' === i(v)) {
                    for (a = '/' === i((f = v + 1)); '\n' !== i(++v); )
                      if (v === g) return null;
                    ++v, a && p(f, v - 1), ++b, (n = !0);
                  } else {
                    if ('*' !== (u = i(v))) return '/';
                    a = '*' === i((f = v + 1));
                    do {
                      if (('\n' === u && ++b, ++v === g)) throw t('comment');
                      (s = u), (u = i(v));
                    } while ('*' !== s || '/' !== u);
                    ++v, a && p(f, v - 2), (n = !0);
                  }
                }
              } while (n);
              var h = v;
              o.lastIndex = 0;
              var c = o.test(i(h++));
              if (!c) for (; g > h && !o.test(i(h)); ) ++h;
              var d = e.substring(v, (v = h));
              return ('"' === d || "'" === d) && (j = d), d;
            }
            function c(e) {
              A.push(e);
            }
            function d() {
              if (!A.length) {
                var e = h();
                if (null === e) return null;
                c(e);
              }
              return A[0];
            }
            function y(e, r) {
              var n = d(),
                i = n === e;
              if (i) return h(), !0;
              if (!r) throw t("token '" + n + "', '" + e + "' expected");
              return !1;
            }
            function m(e) {
              var t;
              return (
                e === undefined
                  ? (t = (k === b - 1 && O) || null)
                  : (O || d(), (t = (k === e && '/' === w && O) || null)),
                (w = O = null),
                (k = 0),
                t
              );
            }
            e = '' + e;
            var v = 0,
              g = e.length,
              b = 1,
              w = null,
              O = null,
              k = 0,
              A = [],
              j = null;
            return {
              next: h,
              peek: d,
              push: c,
              skip: y,
              line: function () {
                return b;
              },
              cmnt: m,
            };
          }
          t.exports = i;
          var o = /[\s{}=;:[\],'"()<>]/g,
            s = /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g,
            u = /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g,
            f = /^ *[*\/]+ */,
            a = /\n/g,
            l = /\s/,
            p = /\\(.?)/g,
            h = { 0: '\x00', r: '\r', n: '\n', t: '	' };
          i.unescape = n;
        },
        {},
      ],
      35: [
        function (e, t, r) {
          function n(e, t) {
            o.call(this, e, t),
              (this.fields = {}),
              (this.oneofs = undefined),
              (this.extensions = undefined),
              (this.reserved = undefined),
              (this.group = undefined),
              (this._fieldsById = null),
              (this._fieldsArray = null),
              (this._oneofsArray = null),
              (this._ctor = null);
          }
          function i(e) {
            return (
              (e._fieldsById =
                e._fieldsArray =
                e._oneofsArray =
                e._ctor =
                  null),
              delete e.encode,
              delete e.decode,
              delete e.verify,
              e
            );
          }
          t.exports = n;
          var o = e(24);
          ((n.prototype = Object.create(o.prototype)).constructor =
            n).className = 'Type';
          var s = e(16),
            u = e(26),
            f = e(17),
            a = e(21),
            l = e(33),
            p = e(11),
            h = e(22),
            c = e(28),
            d = e(41),
            y = e(37),
            m = e(15),
            v = e(14),
            g = e(40),
            b = e(13);
          Object.defineProperties(n.prototype, {
            fieldsById: {
              get: function () {
                if (this._fieldsById) return this._fieldsById;
                this._fieldsById = {};
                for (
                  var e = Object.keys(this.fields), t = 0;
                  t < e.length;
                  ++t
                ) {
                  var r = this.fields[e[t]],
                    n = r.id;
                  if (this._fieldsById[n])
                    throw Error('duplicate id ' + n + ' in ' + this);
                  this._fieldsById[n] = r;
                }
                return this._fieldsById;
              },
            },
            fieldsArray: {
              get: function () {
                return (
                  this._fieldsArray ||
                  (this._fieldsArray = y.toArray(this.fields))
                );
              },
            },
            oneofsArray: {
              get: function () {
                return (
                  this._oneofsArray ||
                  (this._oneofsArray = y.toArray(this.oneofs))
                );
              },
            },
            ctor: {
              get: function () {
                return this._ctor || (this._ctor = p(this).constructor);
              },
              set: function (e) {
                !e || e.prototype instanceof h ? (this._ctor = e) : p(this, e);
              },
            },
          }),
            (n.fromJSON = function (e, t) {
              var r = new n(e, t.options);
              (r.extensions = t.extensions), (r.reserved = t.reserved);
              for (var i = Object.keys(t.fields), p = 0; p < i.length; ++p)
                r.add(
                  (undefined !== t.fields[i[p]].keyType
                    ? a.fromJSON
                    : f.fromJSON)(i[p], t.fields[i[p]])
                );
              if (t.oneofs)
                for (i = Object.keys(t.oneofs), p = 0; p < i.length; ++p)
                  r.add(u.fromJSON(i[p], t.oneofs[i[p]]));
              if (t.nested)
                for (i = Object.keys(t.nested), p = 0; p < i.length; ++p) {
                  var h = t.nested[i[p]];
                  r.add(
                    (h.id !== undefined
                      ? f.fromJSON
                      : h.fields !== undefined
                      ? n.fromJSON
                      : h.values !== undefined
                      ? s.fromJSON
                      : h.methods !== undefined
                      ? l.fromJSON
                      : o.fromJSON)(i[p], h)
                  );
                }
              return (
                t.extensions &&
                  t.extensions.length &&
                  (r.extensions = t.extensions),
                t.reserved && t.reserved.length && (r.reserved = t.reserved),
                t.group && (r.group = !0),
                r
              );
            }),
            (n.prototype.toJSON = function () {
              var e = o.prototype.toJSON.call(this);
              return {
                options: (e && e.options) || undefined,
                oneofs: o.arrayToJSON(this.oneofsArray),
                fields:
                  o.arrayToJSON(
                    this.fieldsArray.filter(function (e) {
                      return !e.declaringField;
                    })
                  ) || {},
                extensions:
                  this.extensions && this.extensions.length
                    ? this.extensions
                    : undefined,
                reserved:
                  this.reserved && this.reserved.length
                    ? this.reserved
                    : undefined,
                group: this.group || undefined,
                nested: (e && e.nested) || undefined,
              };
            }),
            (n.prototype.resolveAll = function () {
              for (var e = this.fieldsArray, t = 0; t < e.length; )
                e[t++].resolve();
              var r = this.oneofsArray;
              for (t = 0; t < r.length; ) r[t++].resolve();
              return o.prototype.resolve.call(this);
            }),
            (n.prototype.get = function (e) {
              return (
                this.fields[e] ||
                (this.oneofs && this.oneofs[e]) ||
                (this.nested && this.nested[e]) ||
                null
              );
            }),
            (n.prototype.add = function (e) {
              if (this.get(e.name))
                throw Error("duplicate name '" + e.name + "' in " + this);
              if (e instanceof f && e.extend === undefined) {
                if (
                  this._fieldsById
                    ? this._fieldsById[e.id]
                    : this.fieldsById[e.id]
                )
                  throw Error('duplicate id ' + e.id + ' in ' + this);
                if (this.isReservedId(e.id))
                  throw Error('id ' + e.id + ' is reserved in ' + this);
                if (this.isReservedName(e.name))
                  throw Error("name '" + e.name + "' is reserved in " + this);
                return (
                  e.parent && e.parent.remove(e),
                  (this.fields[e.name] = e),
                  (e.message = this),
                  e.onAdd(this),
                  i(this)
                );
              }
              return e instanceof u
                ? (this.oneofs || (this.oneofs = {}),
                  (this.oneofs[e.name] = e),
                  e.onAdd(this),
                  i(this))
                : o.prototype.add.call(this, e);
            }),
            (n.prototype.remove = function (e) {
              if (e instanceof f && e.extend === undefined) {
                if (!this.fields || this.fields[e.name] !== e)
                  throw Error(e + ' is not a member of ' + this);
                return (
                  delete this.fields[e.name],
                  (e.parent = null),
                  e.onRemove(this),
                  i(this)
                );
              }
              if (e instanceof u) {
                if (!this.oneofs || this.oneofs[e.name] !== e)
                  throw Error(e + ' is not a member of ' + this);
                return (
                  delete this.oneofs[e.name],
                  (e.parent = null),
                  e.onRemove(this),
                  i(this)
                );
              }
              return o.prototype.remove.call(this, e);
            }),
            (n.prototype.isReservedId = function (e) {
              if (this.reserved)
                for (var t = 0; t < this.reserved.length; ++t)
                  if (
                    'string' != typeof this.reserved[t] &&
                    this.reserved[t][0] <= e &&
                    this.reserved[t][1] >= e
                  )
                    return !0;
              return !1;
            }),
            (n.prototype.isReservedName = function (e) {
              if (this.reserved)
                for (var t = 0; t < this.reserved.length; ++t)
                  if (this.reserved[t] === e) return !0;
              return !1;
            }),
            (n.prototype.create = function (e) {
              return new this.ctor(e);
            }),
            (n.prototype.setup = function () {
              for (
                var e = this.fullName, t = [], r = 0;
                r < this.fieldsArray.length;
                ++r
              )
                t.push(this._fieldsArray[r].resolve().resolvedType);
              return (
                (this.encode = m(this).eof(e + '$encode', {
                  Writer: d,
                  types: t,
                  util: y,
                })),
                (this.decode = v(this).eof(e + '$decode', {
                  Reader: c,
                  types: t,
                  util: y,
                })),
                (this.verify = g(this).eof(e + '$verify', {
                  types: t,
                  util: y,
                })),
                (this.fromObject = this.from =
                  b
                    .fromObject(this)
                    .eof(e + '$fromObject', { types: t, util: y })),
                (this.toObject = b
                  .toObject(this)
                  .eof(e + '$toObject', { types: t, util: y })),
                this
              );
            }),
            (n.prototype.encode = function (e, t) {
              return this.setup().encode(e, t);
            }),
            (n.prototype.encodeDelimited = function (e, t) {
              return this.encode(e, t && t.len ? t.fork() : t).ldelim();
            }),
            (n.prototype.decode = function (e, t) {
              return this.setup().decode(e, t);
            }),
            (n.prototype.decodeDelimited = function (e) {
              return (
                e instanceof c || (e = c.create(e)), this.decode(e, e.uint32())
              );
            }),
            (n.prototype.verify = function (e) {
              return this.setup().verify(e);
            }),
            (n.prototype.fromObject = function (e) {
              return this.setup().fromObject(e);
            }),
            (n.prototype.from = n.prototype.fromObject),
            (n.prototype.toObject = function (e, t) {
              return this.setup().toObject(e, t);
            });
        },
        {
          11: 11,
          13: 13,
          14: 14,
          15: 15,
          16: 16,
          17: 17,
          21: 21,
          22: 22,
          24: 24,
          26: 26,
          28: 28,
          33: 33,
          37: 37,
          40: 40,
          41: 41,
        },
      ],
      36: [
        function (e, t, r) {
          function n(e, t) {
            var r = 0,
              n = {};
            for (t |= 0; r < e.length; ) n[s[r + t]] = e[r++];
            return n;
          }
          var i = r,
            o = e(37),
            s = [
              'double',
              'float',
              'int32',
              'uint32',
              'sint32',
              'fixed32',
              'sfixed32',
              'int64',
              'uint64',
              'sint64',
              'fixed64',
              'sfixed64',
              'bool',
              'string',
              'bytes',
            ];
          (i.basic = n([1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2, 2])),
            (i.defaults = n([
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              !1,
              '',
              o.emptyArray,
              null,
            ])),
            (i['long'] = n([0, 0, 0, 1, 1], 7)),
            (i.mapKey = n([0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2], 2)),
            (i.packed = n([1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0]));
        },
        { 37: 37 },
      ],
      37: [
        function (e, t, r) {
          var n = (t.exports = e(39));
          (n.codegen = e(3)),
            (n.fetch = e(5)),
            (n.path = e(8)),
            (n.fs = n.inquire('fs')),
            (n.toArray = function (e) {
              var t = [];
              if (e)
                for (var r = Object.keys(e), n = 0; n < r.length; ++n)
                  t.push(e[r[n]]);
              return t;
            });
          var i = /\\/g,
            o = /"/g;
          (n.safeProp = function (e) {
            return '["' + e.replace(i, '\\\\').replace(o, '\\"') + '"]';
          }),
            (n.ucFirst = function (e) {
              return e.charAt(0).toUpperCase() + e.substring(1);
            }),
            (n.compareFieldsById = function (e, t) {
              return e.id - t.id;
            });
        },
        { 3: 3, 39: 39, 5: 5, 8: 8 },
      ],
      38: [
        function (e, t, r) {
          function n(e, t) {
            (this.lo = e >>> 0), (this.hi = t >>> 0);
          }
          t.exports = n;
          var i = e(39),
            o = (n.zero = new n(0, 0));
          (o.toNumber = function () {
            return 0;
          }),
            (o.zzEncode = o.zzDecode =
              function () {
                return this;
              }),
            (o.length = function () {
              return 1;
            });
          var s = (n.zeroHash = '\x00\x00\x00\x00\x00\x00\x00\x00');
          (n.fromNumber = function (e) {
            if (0 === e) return o;
            var t = 0 > e;
            t && (e = -e);
            var r = e >>> 0,
              i = ((e - r) / 4294967296) >>> 0;
            return (
              t &&
                ((i = ~i >>> 0),
                (r = ~r >>> 0),
                ++r > 4294967295 && ((r = 0), ++i > 4294967295 && (i = 0))),
              new n(r, i)
            );
          }),
            (n.from = function (e) {
              if ('number' == typeof e) return n.fromNumber(e);
              if (i.isString(e)) {
                if (!i.Long) return n.fromNumber(parseInt(e, 10));
                e = i.Long.fromString(e);
              }
              return e.low || e.high ? new n(e.low >>> 0, e.high >>> 0) : o;
            }),
            (n.prototype.toNumber = function (e) {
              if (!e && this.hi >>> 31) {
                var t = (~this.lo + 1) >>> 0,
                  r = ~this.hi >>> 0;
                return t || (r = (r + 1) >>> 0), -(t + 4294967296 * r);
              }
              if ('undefined' != typeof dcodeIO) {
                var i = new n(this.lo, this.hi),
                  o = new dcodeIO.Long(i.lo, i.hi, !1);
                return '' + o;
              }
              return this.lo + 4294967296 * this.hi;
            }),
            (n.prototype.toLong = function (e) {
              return i.Long
                ? new i.Long(0 | this.lo, 0 | this.hi, !!e)
                : { low: 0 | this.lo, high: 0 | this.hi, unsigned: !!e };
            });
          var u = String.prototype.charCodeAt;
          (n.fromHash = function (e) {
            return e === s
              ? o
              : new n(
                  (u.call(e, 0) |
                    (u.call(e, 1) << 8) |
                    (u.call(e, 2) << 16) |
                    (u.call(e, 3) << 24)) >>>
                    0,
                  (u.call(e, 4) |
                    (u.call(e, 5) << 8) |
                    (u.call(e, 6) << 16) |
                    (u.call(e, 7) << 24)) >>>
                    0
                );
          }),
            (n.prototype.toHash = function () {
              return String.fromCharCode(
                255 & this.lo,
                (this.lo >>> 8) & 255,
                (this.lo >>> 16) & 255,
                this.lo >>> 24,
                255 & this.hi,
                (this.hi >>> 8) & 255,
                (this.hi >>> 16) & 255,
                this.hi >>> 24
              );
            }),
            (n.prototype.zzEncode = function () {
              var e = this.hi >> 31;
              return (
                (this.hi = (((this.hi << 1) | (this.lo >>> 31)) ^ e) >>> 0),
                (this.lo = ((this.lo << 1) ^ e) >>> 0),
                this
              );
            }),
            (n.prototype.zzDecode = function () {
              var e = -(1 & this.lo);
              return (
                (this.lo = (((this.lo >>> 1) | (this.hi << 31)) ^ e) >>> 0),
                (this.hi = ((this.hi >>> 1) ^ e) >>> 0),
                this
              );
            }),
            (n.prototype.length = function () {
              var e = this.lo,
                t = ((this.lo >>> 28) | (this.hi << 4)) >>> 0,
                r = this.hi >>> 24;
              return 0 === r
                ? 0 === t
                  ? 16384 > e
                    ? 128 > e
                      ? 1
                      : 2
                    : 2097152 > e
                    ? 3
                    : 4
                  : 16384 > t
                  ? 128 > t
                    ? 5
                    : 6
                  : 2097152 > t
                  ? 7
                  : 8
                : 128 > r
                ? 9
                : 10;
            });
        },
        { 39: 39 },
      ],
      39: [
        function (e, t, r) {
          function n(e, t, r) {
            for (var n = Object.keys(t), i = 0; i < n.length; ++i)
              (e[n[i]] !== undefined && r) || (e[n[i]] = t[n[i]]);
            return e;
          }
          function i(e) {
            function t(e, r) {
              return this instanceof t
                ? (Object.defineProperty(this, 'message', {
                    get: function () {
                      return e;
                    },
                  }),
                  Error.captureStackTrace
                    ? Error.captureStackTrace(this, t)
                    : Object.defineProperty(this, 'stack', {
                        value: Error().stack || '',
                      }),
                  r && n(this, r),
                  undefined)
                : new t(e, r);
            }
            return (
              ((t.prototype = Object.create(Error.prototype)).constructor = t),
              Object.defineProperty(t.prototype, 'name', {
                get: function () {
                  return e;
                },
              }),
              (t.prototype.toString = function () {
                return this.name + ': ' + this.message;
              }),
              t
            );
          }
          var o = r;
          (o.asPromise = e(1)),
            (o.base64 = e(2)),
            (o.EventEmitter = e(4)),
            (o['float'] = e(6)),
            (o.inquire = e(7)),
            (o.utf8 = e(10)),
            (o.pool = e(9)),
            (o.LongBits = e(38)),
            (o.emptyArray = Object.freeze ? Object.freeze([]) : []),
            (o.emptyObject = Object.freeze ? Object.freeze({}) : {}),
            (o.isNode = !!(
              global.process &&
              global.process.versions &&
              global.process.versions.node
            )),
            (o.isInteger =
              Number.isInteger ||
              function (e) {
                return (
                  'number' == typeof e && isFinite(e) && Math.floor(e) === e
                );
              }),
            (o.isString = function (e) {
              return 'string' == typeof e || e instanceof String;
            }),
            (o.isObject = function (e) {
              return e && 'object' == typeof e;
            }),
            (o.isset = o.isSet =
              function (e, t) {
                var r = e[t];
                return null != r && e.hasOwnProperty(t)
                  ? 'object' != typeof r ||
                      (Array.isArray(r) ? r.length : Object.keys(r).length) > 0
                  : !1;
              }),
            (o.Buffer = (function () {
              try {
                var e = o.inquire('buffer').Buffer;
                return e.prototype.utf8Write ? e : null;
              } catch (t) {
                return null;
              }
            })()),
            (o._Buffer_from = null),
            (o._Buffer_allocUnsafe = null),
            (o.newBuffer = function (e) {
              return 'number' == typeof e
                ? o.Buffer
                  ? o._Buffer_allocUnsafe(e)
                  : new o.Array(e)
                : o.Buffer
                ? o._Buffer_from(e)
                : 'undefined' == typeof Uint8Array
                ? e
                : new Uint8Array(e);
            }),
            (o.Array = 'undefined' != typeof Uint8Array ? Uint8Array : Array),
            (o.Long =
              (global.dcodeIO && global.dcodeIO.Long) || o.inquire('long')),
            (o.key2Re = /^true|false|0|1$/),
            (o.key32Re = /^-?(?:0|[1-9][0-9]*)$/),
            (o.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/),
            (o.longToHash = function (e) {
              return e ? o.LongBits.from(e).toHash() : o.LongBits.zeroHash;
            }),
            (o.longFromHash = function (e, t) {
              var r = o.LongBits.fromHash(e);
              return o.Long ? o.Long.fromBits(r.lo, r.hi, t) : r.toNumber(!!t);
            }),
            (o.merge = n),
            (o.lcFirst = function (e) {
              return e.charAt(0).toLowerCase() + e.substring(1);
            }),
            (o.newError = i),
            (o.ProtocolError = i('ProtocolError')),
            (o.oneOfGetter = function (e) {
              for (var t = {}, r = 0; r < e.length; ++r) t[e[r]] = 1;
              return function () {
                for (var e = Object.keys(this), r = e.length - 1; r > -1; --r)
                  if (
                    1 === t[e[r]] &&
                    this[e[r]] !== undefined &&
                    null !== this[e[r]]
                  )
                    return e[r];
              };
            }),
            (o.oneOfSetter = function (e) {
              return function (t) {
                for (var r = 0; r < e.length; ++r)
                  e[r] !== t && delete this[e[r]];
              };
            }),
            (o.lazyResolve = function (e, t) {
              for (var r = 0; r < t.length; ++r)
                for (var n = Object.keys(t[r]), i = 0; i < n.length; ++i) {
                  for (var o = t[r][n[i]].split('.'), s = e; o.length; )
                    s = s[o.shift()];
                  t[r][n[i]] = s;
                }
            }),
            (o.toJSONOptions = { longs: String, enums: String, bytes: String }),
            (o._configure = function () {
              var e = o.Buffer;
              return e
                ? ((o._Buffer_from =
                    (e.from !== Uint8Array.from && e.from) ||
                    function (t, r) {
                      return new e(t, r);
                    }),
                  (o._Buffer_allocUnsafe =
                    e.allocUnsafe ||
                    function (t) {
                      return new e(t);
                    }),
                  undefined)
                : ((o._Buffer_from = o._Buffer_allocUnsafe = null), undefined);
            });
        },
        { 1: 1, 10: 10, 2: 2, 38: 38, 4: 4, 6: 6, 7: 7, 9: 9 },
      ],
      40: [
        function (e, t, r) {
          function n(e, t) {
            return (
              e.name +
              ': ' +
              t +
              (e.repeated && 'array' !== t
                ? '[]'
                : e.map && 'object' !== t
                ? '{k:' + e.keyType + '}'
                : '') +
              ' expected'
            );
          }
          function i(e, t, r, i) {
            if (t.resolvedType)
              if (t.resolvedType instanceof u) {
                e('switch(%s){', i)('default:')('return%j', n(t, 'enum value'));
                for (
                  var o = Object.keys(t.resolvedType.values), s = 0;
                  s < o.length;
                  ++s
                )
                  e('case %d:', t.resolvedType.values[o[s]]);
                e('break')('}');
              } else
                e('var e=types[%d].verify(%s);', r, i)('if(e)')(
                  'return%j+e',
                  t.name + '.'
                );
            else
              switch (t.type) {
                case 'int32':
                case 'uint32':
                case 'sint32':
                case 'fixed32':
                case 'sfixed32':
                  e('if(!util.isInteger(%s))', i)('return%j', n(t, 'integer'));
                  break;
                case 'int64':
                case 'uint64':
                case 'sint64':
                case 'fixed64':
                case 'sfixed64':
                  e(
                    'if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))',
                    i,
                    i,
                    i,
                    i
                  )('return%j', n(t, 'integer|Long'));
                  break;
                case 'float':
                case 'double':
                  e('if(typeof %s!=="number")', i)('return%j', n(t, 'number'));
                  break;
                case 'bool':
                  e('if(typeof %s!=="boolean")', i)(
                    'return%j',
                    n(t, 'boolean')
                  );
                  break;
                case 'string':
                  e('if(!util.isString(%s))', i)('return%j', n(t, 'string'));
                  break;
                case 'bytes':
                  e(
                    'if(!(%s&&typeof %s.length==="number"||util.isString(%s)))',
                    i,
                    i,
                    i
                  )('return%j', n(t, 'buffer'));
              }
            return e;
          }
          function o(e, t, r) {
            switch (t.keyType) {
              case 'int32':
              case 'uint32':
              case 'sint32':
              case 'fixed32':
              case 'sfixed32':
                e('if(!util.key32Re.test(%s))', r)(
                  'return%j',
                  n(t, 'integer key')
                );
                break;
              case 'int64':
              case 'uint64':
              case 'sint64':
              case 'fixed64':
              case 'sfixed64':
                e('if(!util.key64Re.test(%s))', r)(
                  'return%j',
                  n(t, 'integer|Long key')
                );
                break;
              case 'bool':
                e('if(!util.key2Re.test(%s))', r)(
                  'return%j',
                  n(t, 'boolean key')
                );
            }
            return e;
          }
          function s(e) {
            var t = f.codegen('m')('if(typeof m!=="object"||m===null)')(
                'return%j',
                'object expected'
              ),
              r = e.oneofsArray,
              s = {};
            r.length && t('var p={}');
            for (var u = 0; u < e.fieldsArray.length; ++u) {
              var a = e._fieldsArray[u].resolve(),
                l = 'm' + f.safeProp(a.name);
              if (
                (a.optional &&
                  t('if(%s!=null&&m.hasOwnProperty(%j)){', l, a.name),
                a.map)
              )
                t('if(!util.isObject(%s))', l)('return%j', n(a, 'object'))(
                  'var k=Object.keys(%s)',
                  l
                )('for(var i=0;i<k.length;++i){'),
                  o(t, a, 'k[i]'),
                  i(t, a, u, l + '[k[i]]')('}');
              else if (a.repeated)
                t('if(!Array.isArray(%s))', l)('return%j', n(a, 'array'))(
                  'for(var i=0;i<%s.length;++i){',
                  l
                ),
                  i(t, a, u, l + '[i]')('}');
              else {
                if (a.partOf) {
                  var p = f.safeProp(a.partOf.name);
                  1 === s[a.partOf.name] &&
                    t('if(p%s===1)', p)(
                      'return%j',
                      a.partOf.name + ': multiple values'
                    ),
                    (s[a.partOf.name] = 1),
                    t('p%s=1', p);
                }
                i(t, a, u, l);
              }
              a.optional && t('}');
            }
            return t('return null');
          }
          t.exports = s;
          var u = e(16),
            f = e(37);
        },
        { 16: 16, 37: 37 },
      ],
      41: [
        function (e, t, r) {
          function n(e, t, r) {
            (this.fn = e),
              (this.len = t),
              (this.next = undefined),
              (this.val = r);
          }
          function i() {}
          function o(e) {
            (this.head = e.head),
              (this.tail = e.tail),
              (this.len = e.len),
              (this.next = e.states);
          }
          function s() {
            (this.len = 0),
              (this.head = new n(i, 0, 0)),
              (this.tail = this.head),
              (this.states = null);
          }
          function u(e, t, r) {
            t[r] = 255 & e;
          }
          function f(e, t, r) {
            for (; e > 127; ) (t[r++] = (127 & e) | 128), (e >>>= 7);
            t[r] = e;
          }
          function a(e, t) {
            (this.len = e), (this.next = undefined), (this.val = t);
          }
          function l(e, t, r) {
            for (; e.hi; )
              (t[r++] = (127 & e.lo) | 128),
                (e.lo = ((e.lo >>> 7) | (e.hi << 25)) >>> 0),
                (e.hi >>>= 7);
            for (; e.lo > 127; )
              (t[r++] = (127 & e.lo) | 128), (e.lo = e.lo >>> 7);
            t[r++] = e.lo;
          }
          function p(e, t, r) {
            (t[r] = 255 & e),
              (t[r + 1] = (e >>> 8) & 255),
              (t[r + 2] = (e >>> 16) & 255),
              (t[r + 3] = e >>> 24);
          }
          t.exports = s;
          var h,
            c = e(39),
            d = c.LongBits,
            y = c.base64,
            m = c.utf8;
          (s.create = c.Buffer
            ? function () {
                return (s.create = function () {
                  return new h();
                })();
              }
            : function () {
                return new s();
              }),
            (s.alloc = function (e) {
              return new c.Array(e);
            }),
            c.Array !== Array &&
              (s.alloc = c.pool(s.alloc, c.Array.prototype.subarray)),
            (s.prototype.push = function (e, t, r) {
              return (
                (this.tail = this.tail.next = new n(e, t, r)),
                (this.len += t),
                this
              );
            }),
            (a.prototype = Object.create(n.prototype)),
            (a.prototype.fn = f),
            (s.prototype.uint32 = function (e) {
              return (
                (this.len += (this.tail = this.tail.next =
                  new a(
                    (e >>>= 0) < 128
                      ? 1
                      : 16384 > e
                      ? 2
                      : 2097152 > e
                      ? 3
                      : 268435456 > e
                      ? 4
                      : 5,
                    e
                  )).len),
                this
              );
            }),
            (s.prototype.int32 = function (e) {
              return 0 > e ? this.push(l, 10, d.fromNumber(e)) : this.uint32(e);
            }),
            (s.prototype.sint32 = function (e) {
              return this.uint32(((e << 1) ^ (e >> 31)) >>> 0);
            }),
            (s.prototype.uint64 = function (e) {
              var t = d.from(e);
              return this.push(l, t.length(), t);
            }),
            (s.prototype.int64 = s.prototype.uint64),
            (s.prototype.sint64 = function (e) {
              var t = d.from(e).zzEncode();
              return this.push(l, t.length(), t);
            }),
            (s.prototype.bool = function (e) {
              return this.push(u, 1, e ? 1 : 0);
            }),
            (s.prototype.fixed32 = function (e) {
              return this.push(p, 4, e >>> 0);
            }),
            (s.prototype.sfixed32 = s.prototype.fixed32),
            (s.prototype.fixed64 = function (e) {
              var t = d.from(e);
              return this.push(p, 4, t.lo).push(p, 4, t.hi);
            }),
            (s.prototype.sfixed64 = s.prototype.fixed64),
            (s.prototype['float'] = function (e) {
              return this.push(c['float'].writeFloatLE, 4, e);
            }),
            (s.prototype['double'] = function (e) {
              return this.push(c['float'].writeDoubleLE, 8, e);
            });
          var v = c.Array.prototype.set
            ? function (e, t, r) {
                t.set(e, r);
              }
            : function (e, t, r) {
                for (var n = 0; n < e.length; ++n) t[r + n] = e[n];
              };
          (s.prototype.bytes = function (e) {
            var t = e.length >>> 0;
            if (!t) return this.push(u, 1, 0);
            if (c.isString(e)) {
              var r = s.alloc((t = y.length(e)));
              y.decode(e, r, 0), (e = r);
            }
            return this.uint32(t).push(v, t, e);
          }),
            (s.prototype.string = function (e) {
              var t = m.length(e);
              return t
                ? this.uint32(t).push(m.write, t, e)
                : this.push(u, 1, 0);
            }),
            (s.prototype.fork = function () {
              return (
                (this.states = new o(this)),
                (this.head = this.tail = new n(i, 0, 0)),
                (this.len = 0),
                this
              );
            }),
            (s.prototype.reset = function () {
              return (
                this.states
                  ? ((this.head = this.states.head),
                    (this.tail = this.states.tail),
                    (this.len = this.states.len),
                    (this.states = this.states.next))
                  : ((this.head = this.tail = new n(i, 0, 0)), (this.len = 0)),
                this
              );
            }),
            (s.prototype.ldelim = function () {
              var e = this.head,
                t = this.tail,
                r = this.len;
              return (
                this.reset().uint32(r),
                r &&
                  ((this.tail.next = e.next), (this.tail = t), (this.len += r)),
                this
              );
            }),
            (s.prototype.finish = function () {
              for (
                var e = this.head.next,
                  t = this.constructor.alloc(this.len),
                  r = 0;
                e;

              )
                e.fn(e.val, t, r), (r += e.len), (e = e.next);
              return t;
            }),
            (s._configure = function (e) {
              h = e;
            });
        },
        { 39: 39 },
      ],
      42: [
        function (e, t, r) {
          function n() {
            o.call(this);
          }
          function i(e, t, r) {
            e.length < 40 ? s.utf8.write(e, t, r) : t.utf8Write(e, r);
          }
          t.exports = n;
          var o = e(41);
          (n.prototype = Object.create(o.prototype)).constructor = n;
          var s = e(39),
            u = s.Buffer;
          n.alloc = function (e) {
            return (n.alloc = s._Buffer_allocUnsafe)(e);
          };
          var f =
            u &&
            u.prototype instanceof Uint8Array &&
            'set' === u.prototype.set.name
              ? function (e, t, r) {
                  t.set(e, r);
                }
              : function (e, t, r) {
                  if (e.copy) e.copy(t, r, 0, e.length);
                  else for (var n = 0; n < e.length; ) t[r++] = e[n++];
                };
          (n.prototype.bytes = function (e) {
            s.isString(e) && (e = s._Buffer_from(e, 'base64'));
            var t = e.length >>> 0;
            return this.uint32(t), t && this.push(f, t, e), this;
          }),
            (n.prototype.string = function (e) {
              var t = u.byteLength(e);
              return this.uint32(t), t && this.push(i, t, e), this;
            });
        },
        { 39: 39, 41: 41 },
      ],
    },
    {},
    [20]
  );
})(
  ('object' == typeof window && window) ||
    ('object' == typeof self && self) ||
    this
);
