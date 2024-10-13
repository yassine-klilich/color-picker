var Ve = Object.defineProperty;
var Wt = (c) => {
  throw TypeError(c);
};
var We = (c, t, e) => t in c ? Ve(c, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : c[t] = e;
var A = (c, t, e) => We(c, typeof t != "symbol" ? t + "" : t, e), wt = (c, t, e) => t.has(c) || Wt("Cannot " + e);
var i = (c, t, e) => (wt(c, t, "read from private field"), e ? e.call(c) : t.get(c)), S = (c, t, e) => t.has(c) ? Wt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(c) : t.set(c, e), v = (c, t, e, h) => (wt(c, t, "write to private field"), h ? h.call(c, e) : t.set(c, e), e), r = (c, t, e) => (wt(c, t, "access private method"), e);
function j(c) {
  return c.toString(16).padStart(2, "0");
}
function f(c, t, e) {
  const h = document.createElement(c);
  if (t != null && h.classList.add(...t), e)
    for (const n in e)
      Object.prototype.hasOwnProperty.call(e, n) && h.setAttribute(n, e[n]);
  return h;
}
const y = Object.freeze({
  parse: function(c) {
    if (c == null)
      throw new Error("YKColorParser:: color is undefined");
    if (typeof c == "string" || c instanceof String) {
      if (c = c.trim(), /^(rgba?)/i.test(c))
        return this.compileRGB(c);
      if (/^(#)/i.test(c))
        return this.compileHEX(c);
      let t = this.NAMED_COLORS[c.toLowerCase()];
      if (t != null) {
        t = t.split(" ");
        const { h: e, s: h, v: n } = y.RGBtoHSV(t[0], t[1], t[2]);
        return { h: e, s: h, v: n, a: 1 };
      }
    } else {
      const { r: t, g: e, b: h, a: n } = c;
      if (t >= 0 && t <= 255 && e >= 0 && e <= 255 && h >= 0 && h <= 255 && n >= 0 && n <= 1) {
        const { h: a, s: d, v: g } = y.RGBtoHSV(t, e, h);
        return { h: a, s: d, v: g, a: n };
      }
      throw new Error(
        "YKColorParser:: The provided RGB object has invalid values, please make sure red, green, blue are between 0 and 255 and alpha value is between 0 and 1"
      );
    }
    throw new Error(
      "YKColorParser:: Color is not in RGB or HEX format or a named color"
    );
  },
  compileRGB: function(c) {
    let t, e, h, n;
    const a = /rgba?\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(\s+(0?(\.\d+)?|1(\.0*)?)\s*)?\)/i;
    if (a.test(c)) {
      const d = c.split(a).filter((C) => !isNaN(C) && C != "" && C != null);
      if (t = parseInt(d[0]), e = parseInt(d[1]), h = parseInt(d[2]), n = parseFloat(d[3]), t > 255)
        throw new RangeError(
          `YKColorParser:: '${c}' --> ${t} has an invalid red color, it must be an interger between 0 and 255`
        );
      if (e > 255)
        throw new RangeError(
          `YKColorParser:: '${c}' --> ${e} has an invalid green color, it must be an interger between 0 and 255`
        );
      if (h > 255)
        throw new RangeError(
          `YKColorParser:: '${c}' --> ${h} has an invalid blue color, it must be an interger between 0 and 255`
        );
      const { h: g, s: b, v: k } = y.RGBtoHSV(t, e, h);
      return { h: g, s: b, v: k, a: isNaN(n) ? 1 : n };
    }
    throw new SyntaxError(
      `YKColorParser:: '${c}' is an invalid RGB format`
    );
  },
  compileHEX: function(c) {
    const t = y.HEXtoRGBA(c);
    if (t) {
      const { r: e, g: h, b: n, a } = t, { h: d, s: g, v: b } = y.RGBtoHSV(e, h, n);
      return { h: d, s: g, v: b, a };
    }
    throw new Error(`YKColorParser:: '${c}' is an invalid HEX format`);
  },
  RGBtoHSV: function(c, t, e) {
    c /= 255, t /= 255, e /= 255;
    let h = Math.max(c, t, e), n = Math.min(c, t, e), a, d, g = h, b = h - n;
    if (d = h == 0 ? 0 : b / h, h == n)
      a = 0;
    else {
      switch (h) {
        case c:
          a = (t - e) / b + (t < e ? 6 : 0);
          break;
        case t:
          a = (e - c) / b + 2;
          break;
        case e:
          a = (c - t) / b + 4;
          break;
      }
      a /= 6;
    }
    return a = a * 360, d = d * 100, g = g * 100, { h: a, s: d, v: g };
  },
  HSLtoHSV: function(c, t, e) {
    const h = t * (e < 50 ? e : 100 - e) / 100;
    return {
      h: c,
      s: h === 0 ? 0 : 2 * h / (e + h) * 100,
      v: e + h
    };
  },
  HEXtoRGBA: function(c) {
    let t = 0, e = 0, h = 0, n = 0;
    if (/^#(([a-f0-9]){3,4}|([a-f0-9]){6}|([a-f0-9]){8})$/i.test(c)) {
      if (c.length < 6) {
        const a = c.split("");
        t = +("0x" + a[1] + a[1]), e = +("0x" + a[2] + a[2]), h = +("0x" + a[3] + a[3]), n = a[4] ? parseFloat(
          (+("0x" + a[4] + a[4]) / 255).toFixed(2)
        ) : 1;
      } else if (c.length < 10) {
        const a = c.split(/([a-f0-9]{2})/i);
        t = +("0x" + a[1]), e = +("0x" + a[3]), h = +("0x" + a[5]), n = a[7] ? parseFloat((+("0x" + a[7]) / 255).toFixed(2)) : 1;
      }
      return { r: t, g: e, b: h, a: n };
    }
  },
  RGBAtoHEX: function(c, t, e, h) {
    return c = j(Math.round(c)), t = j(Math.round(t)), e = j(Math.round(e)), h = h == 1 ? "" : j(Math.round(h * 255)), "#" + c + t + e + h;
  },
  NAMED_COLORS: Object.freeze({
    aliceblue: "240 248 255",
    antiquewhite: "250 235 215",
    aqua: "0 255 255",
    aquamarine: "127 255 212",
    azure: "240 255 255",
    beige: "245 245 220",
    bisque: "255 228 196",
    black: "0 0 0",
    blanchedalmond: "255 235 205",
    blue: "0 0 255",
    blueviolet: "138 43 226",
    brown: "165 42 42",
    burlywood: "222 184 135",
    cadetblue: "95 158 160",
    chartreuse: "127 255 0",
    chocolate: "210 105 30",
    coral: "255 127 80",
    cornflowerblue: "100 149 237",
    cornsilk: "255 248 220",
    crimson: "220 20 60",
    cyan: "0 255 255",
    darkblue: "0 0 139",
    darkcyan: "0 139 139",
    darkgoldenrod: "184 134 11",
    darkgray: "169 169 169",
    darkgrey: "169 169 169",
    darkgreen: "0 100 0",
    darkkhaki: "189 183 107",
    darkmagenta: "139 0 139",
    darkolivegreen: "85 107 47",
    darkorange: "255 140 0",
    darkorchid: "153 50 204",
    darkred: "139 0 0",
    darksalmon: "233 150 122",
    darkseagreen: "143 188 143",
    darkslateblue: "72 61 139",
    darkslategray: "47 79 79",
    darkslategrey: "47 79 79",
    darkturquoise: "0 206 209",
    darkviolet: "148 0 211",
    deeppink: "255 20 147",
    deepskyblue: "0 191 255",
    dimgray: "105 105 105",
    dimgrey: "105 105 105",
    dodgerblue: "30 144 255",
    firebrick: "178 34 34",
    floralwhite: "255 250 240",
    forestgreen: "34 139 34",
    fuchsia: "255 0 255",
    gainsboro: "220 220 220",
    ghostwhite: "248 248 255",
    gold: "255 215 0",
    goldenrod: "218 165 32",
    gray: "128 128 128",
    grey: "128 128 128",
    green: "0 128 0",
    greenyellow: "173 255 47",
    honeydew: "240 255 240",
    hotpink: "255 105 180",
    indianred: "205 92 92",
    indigo: "75 0 130",
    ivory: "255 255 240",
    khaki: "240 230 140",
    lavender: "230 230 250",
    lavenderblush: "255 240 245",
    lawngreen: "124 252 0",
    lemonchiffon: "255 250 205",
    lightblue: "173 216 230",
    lightcoral: "240 128 128",
    lightcyan: "224 255 255",
    lightgoldenrodyellow: "250 250 210",
    lightgray: "211 211 211",
    lightgrey: "211 211 211",
    lightgreen: "144 238 144",
    lightpink: "255 182 193",
    lightsalmon: "255 160 122",
    lightseagreen: "32 178 170",
    lightskyblue: "135 206 250",
    lightslategray: "119 136 153",
    lightslategrey: "119 136 153",
    lightsteelblue: "176 196 222",
    lightyellow: "255 255 224",
    lime: "0 255 0",
    limegreen: "50 205 50",
    linen: "250 240 230",
    magenta: "255 0 255",
    maroon: "128 0 0",
    mediumaquamarine: "102 205 170",
    mediumblue: "0 0 205",
    mediumorchid: "186 85 211",
    mediumpurple: "147 112 216",
    mediumseagreen: "60 179 113",
    mediumslateblue: "123 104 238",
    mediumspringgreen: "0 250 154",
    mediumturquoise: "72 209 204",
    mediumvioletred: "199 21 133",
    midnightblue: "25 25 112",
    mintcream: "245 255 250",
    mistyrose: "255 228 225",
    moccasin: "255 228 181",
    navajowhite: "255 222 173",
    navy: "0 0 128",
    oldlace: "253 245 230",
    olive: "128 128 0",
    olivedrab: "107 142 35",
    orange: "255 165 0",
    orangered: "255 69 0",
    orchid: "218 112 214",
    palegoldenrod: "238 232 170",
    palegreen: "152 251 152",
    paleturquoise: "175 238 238",
    palevioletred: "216 112 147",
    papayawhip: "255 239 213",
    peachpuff: "255 218 185",
    peru: "205 133 63",
    pink: "255 192 203",
    plum: "221 160 221",
    powderblue: "176 224 230",
    purple: "128 0 128",
    red: "255 0 0",
    rosybrown: "188 143 143",
    royalblue: "65 105 225",
    saddlebrown: "139 69 19",
    salmon: "250 128 114",
    sandybrown: "244 164 96",
    seagreen: "46 139 87",
    seashell: "255 245 238",
    sienna: "160 82 45",
    silver: "192 192 192",
    skyblue: "135 206 235",
    slateblue: "106 90 205",
    slategray: "112 128 144",
    slategrey: "112 128 144",
    snow: "255 250 250",
    springgreen: "0 255 127",
    steelblue: "70 130 180",
    tan: "210 180 140",
    teal: "0 128 128",
    thistle: "216 191 216",
    tomato: "255 99 71",
    turquoise: "64 224 208",
    violet: "238 130 238",
    wheat: "245 222 179",
    white: "255 255 255",
    whitesmoke: "245 245 245",
    yellow: "255 255 0",
    yellowgreen: "154 205 50"
  })
});
class Oe {
  constructor(t, e, h, n) {
    this.a = n, this.hsv = { h: t, s: e, v: h }, this.rgb = this.toRGB(), this.hsl = this.toHSL(), this.hex = this.toHEX();
  }
  toRGB() {
    let { h: t, s: e, v: h } = this.hsv;
    t /= 360, e /= 100, h /= 100;
    var n, a, d, g, b, k, C, O;
    switch (g = Math.floor(t * 6), b = t * 6 - g, k = h * (1 - e), C = h * (1 - b * e), O = h * (1 - (1 - b) * e), g % 6) {
      case 0:
        n = h, a = O, d = k;
        break;
      case 1:
        n = C, a = h, d = k;
        break;
      case 2:
        n = k, a = h, d = O;
        break;
      case 3:
        n = k, a = C, d = h;
        break;
      case 4:
        n = O, a = k, d = h;
        break;
      case 5:
        n = h, a = k, d = C;
        break;
    }
    return {
      r: Math.round(n * 255),
      g: Math.round(a * 255),
      b: Math.round(d * 255)
    };
  }
  toHSL() {
    let { h: t, s: e, v: h } = this.hsv, n = e * 0.01, a = h * 0.01, d = a - a * n / 2, g = NaN;
    d == 0 || d == 1 ? g = 0 : g = (a - d) / Math.min(d, 1 - d) * 100;
    let b = d * 100;
    return e = g, {
      h: t,
      s: e,
      l: b
    };
  }
  toHEX() {
    let { r: t, g: e, b: h } = this.toRGB();
    return y.RGBAtoHEX(t, e, h, this.a);
  }
}
var $, m, o, u, H, B, P, at, Q, F, ot, lt, Y, U, D, J, Z, z, _, q, s, Xt, dt, Dt, Nt, Pt, Ft, Ut, zt, N, G, ct, yt, st, Ht, kt, w, E, qt, St, Kt, ut, jt, Qt, Yt, Jt, X, L, nt, pt, Zt, gt, Et, _t, te, ee, ie, se, ne, rt, re, he, ae, oe, le, de, ce, ue, pe, ge, be, ve, fe, me, we, ye, He, ke, Se, Ee, Ce, Me, Le, Be, Re, xe, bt, Ae, vt, Ge, Ct, Mt, Lt, K, p, Bt, $e, Ie, ht, Rt, I, T, V, W;
const l = class l {
  constructor(t) {
    S(this, s);
    S(this, $, !1);
    S(this, m, l.DEFAULT_OPTIONS);
    S(this, o, null);
    S(this, u, {});
    S(this, H);
    S(this, B);
    S(this, P);
    S(this, at);
    S(this, Q);
    S(this, F);
    S(this, ot);
    S(this, lt);
    S(this, Y);
    S(this, U);
    S(this, D);
    S(this, J);
    S(this, Z);
    S(this, z);
    S(this, _);
    S(this, q, null);
    var n;
    v(this, m, r(n = l, p, Rt).call(n, l.DEFAULT_OPTIONS, t));
    const { target: e, representation: h } = i(this, m);
    i(this, u).target = e, v(this, H, h), e && (v(this, P, r(this, s, te).bind(this)), e.addEventListener("click", i(this, P))), this.setColor(i(this, m).color), this._prevColor = this.getHEX(), r(this, s, Xt).call(this);
  }
  isOpen() {
    return i(this, $);
  }
  open() {
    this._prevColor = this.getHEX(), i(this, m).container ? r(this, s, gt).call(this, !0) : r(this, s, Et).call(this), i(this, m).onOpen(this);
  }
  close() {
    i(this, B) || (this._prevColor != this.getHEX() && i(this, m).onChange(this), r(this, s, _t).call(this), i(this, m).onClose(this)), v(this, B, !1);
  }
  getRGB() {
    return { ...i(this, o).toRGB(), a: i(this, o).a };
  }
  getHSV() {
    const { h: t, s: e, v: h } = i(this, o).hsv;
    return {
      h: Math.round(t),
      s: Math.round(e),
      v: Math.round(h),
      a: i(this, o).a
    };
  }
  getHSL() {
    const { h: t, s: e, l: h } = i(this, o).toHSL();
    return {
      h: Math.round(t),
      s: Math.round(e),
      l: Math.round(h),
      a: i(this, o).a
    };
  }
  getHEX() {
    return i(this, o).toHEX();
  }
  updateOptions(t) {
    var a;
    const e = r(a = l, p, Rt).call(a, i(this, m), t);
    v(this, m, e);
    const { target: h, representation: n } = i(this, m);
    i(this, H) != n && r(this, s, K).call(this, n), i(this, u).target != h && (i(this, u).target != null && i(this, u).target.removeEventListener("click", i(this, P)), i(this, u).target = h, i(this, u).target != null && i(this, u).target.addEventListener("click", i(this, P))), i(this, $) && (i(this, m).container ? r(this, s, gt).call(this, !0) : r(this, s, Et).call(this));
  }
  getColor() {
    switch (i(this, H)) {
      case l.RGB: {
        const { r: t, g: e, b: h } = i(this, o).rgb;
        return {
          r: Math.round(t),
          g: Math.round(e),
          b: Math.round(h),
          a: i(this, o).a
        };
      }
      case l.HSV: {
        const { h: t, s: e, v: h } = i(this, o).hsv;
        return {
          h: Math.round(t),
          s: Math.round(e),
          l: Math.round(h),
          a: i(this, o).a
        };
      }
      case l.HSL: {
        const { h: t, s: e, l: h } = i(this, o).hsl;
        return {
          h: Math.round(t),
          s: Math.round(e),
          l: Math.round(h),
          a: i(this, o).a
        };
      }
      case l.HEX:
        return this.getHEX();
    }
  }
  setColor(t) {
    const { h: e, s: h, v: n, a } = y.parse(t);
    v(this, o, new Oe(e, h, n, a));
  }
};
$ = new WeakMap(), m = new WeakMap(), o = new WeakMap(), u = new WeakMap(), H = new WeakMap(), B = new WeakMap(), P = new WeakMap(), at = new WeakMap(), Q = new WeakMap(), F = new WeakMap(), ot = new WeakMap(), lt = new WeakMap(), Y = new WeakMap(), U = new WeakMap(), D = new WeakMap(), J = new WeakMap(), Z = new WeakMap(), z = new WeakMap(), _ = new WeakMap(), q = new WeakMap(), s = new WeakSet(), Xt = function() {
  const t = f("div", ["cp-overlay-wrapper"]), e = f("div", ["cp-wrapper"]);
  t.appendChild(e), e.appendChild(r(this, s, Dt).call(this)), e.appendChild(r(this, s, Nt).call(this)), t.addEventListener(
    "click",
    (h) => h.stopPropagation()
  ), i(this, u).overlayWrapper = t, v(this, Z, r(this, s, Re).bind(this)), v(this, D, r(this, s, xe).bind(this)), v(this, J, this.close.bind(this)), i(this, m).container ? r(this, s, gt).call(this, !1) : document.body.appendChild(i(this, u).overlayWrapper), i(this, m).onInit(this);
}, dt = function() {
  r(this, s, E).call(this), r(this, s, Ht).call(this), r(this, s, w).call(this, !1), r(this, s, G).call(this), r(this, s, N).call(this);
}, Dt = function() {
  const t = f("div", ["cp-palette-wrapper"]), e = f("div", ["cp-palette"]), h = f("div", ["cp-cursor"]);
  return t.appendChild(e), t.appendChild(h), v(this, at, r(this, s, ee).bind(this)), v(this, _, r(this, s, ie).bind(this)), v(this, z, r(this, s, se).bind(this)), t.addEventListener("pointerdown", i(this, at)), i(this, u).palette = e, i(this, u).cursor = h, t;
}, Nt = function() {
  const t = f("div", ["cp-color-settings"]);
  return t.appendChild(r(this, s, qt).call(this)), t.appendChild(r(this, s, Jt).call(this)), t.appendChild(r(this, s, jt).call(this)), t.appendChild(r(this, s, Pt).call(this)), t;
}, Pt = function() {
  const t = f("div", ["cp-color-model-wrapper"]), e = f("div", ["cp-color-model"]), h = f("button", ["cp-color-model-switch"]);
  return h.appendChild(
    r(this, s, ut).call(this, '<path d="m3.5045 11.431 1.5786-1.5786 3.0256 3.0256 3.0256-3.0256 1.5786 1.5786-4.6042 4.4726zm4.6042-11.313 4.6042 4.4726-1.5786 1.5786-3.0256-3.0256-3.0256 3.0256-1.5786-1.5786z"/>')
  ), t.appendChild(e), t.appendChild(h), h.addEventListener(
    "click",
    r(this, s, ne).bind(this)
  ), i(this, u).inputsWrapper = e, t;
}, Ft = function() {
  const { inputsWrapper: t } = i(this, u);
  t.innerHTML = "", i(this, H) == l.HEX ? t.appendChild(r(this, s, Ut).call(this)) : t.appendChild(r(this, s, zt).call(this));
}, Ut = function() {
  const t = f("div", ["cp-hex-input"]), e = f("input", ["cp-color-input"]), h = f("label", ["cp-color-model-label"]);
  return e.setAttribute("type", "text"), h.textContent = "HEX", t.appendChild(e), t.appendChild(h), e.addEventListener("focus", r(this, s, rt).bind(this)), e.addEventListener("keydown", r(this, s, oe).bind(this)), e.addEventListener("input", r(this, s, le).bind(this)), e.addEventListener("change", r(this, s, de).bind(this)), i(this, u).inputHEX = e, t;
}, zt = function() {
  const t = f("div", ["cp-input-wrapper"]), e = f("input", ["cp-color-input"], {
    type: "text",
    inputmode: "numeric"
  }), h = f("input", ["cp-color-input"], {
    type: "text",
    inputmode: "numeric"
  }), n = f("input", ["cp-color-input"], {
    type: "text",
    inputmode: "numeric"
  }), a = f("input", ["cp-color-input"], {
    type: "text",
    inputmode: "numeric"
  }), d = f("label", ["cp-color-model-label"]), g = f("label", ["cp-color-model-label"]), b = f("label", ["cp-color-model-label"]), k = f("label", ["cp-color-model-label"]), C = i(this, H).toUpperCase();
  return d.textContent = C[0], g.textContent = C[1], b.textContent = C[2], k.textContent = "A", t.appendChild(e), t.appendChild(h), t.appendChild(n), t.appendChild(a), t.appendChild(d), t.appendChild(g), t.appendChild(b), t.appendChild(k), e.addEventListener("focus", r(this, s, rt).bind(this)), e.addEventListener("keydown", r(this, s, ce).bind(this)), e.addEventListener("input", r(this, s, ue).bind(this)), e.addEventListener("change", r(this, s, pe).bind(this)), h.addEventListener("focus", r(this, s, rt).bind(this)), h.addEventListener("keydown", r(this, s, ge).bind(this)), h.addEventListener("input", r(this, s, be).bind(this)), h.addEventListener("change", r(this, s, ve).bind(this)), n.addEventListener("focus", r(this, s, rt).bind(this)), n.addEventListener("keydown", r(this, s, fe).bind(this)), n.addEventListener("input", r(this, s, me).bind(this)), n.addEventListener("change", r(this, s, we).bind(this)), a.addEventListener("keydown", r(this, s, re).bind(this)), a.addEventListener("input", r(this, s, he).bind(this)), a.addEventListener("change", r(this, s, ae).bind(this)), i(this, u).inputA = e, i(this, u).inputB = h, i(this, u).inputC = n, i(this, u).inputAlpha = a, t;
}, N = function() {
  const { opacitySlider: t, opacityThumb: e } = i(this, u);
  e.style.translate = `${i(this, o).a * t.offsetWidth}px`;
}, G = function() {
  const { hueThumb: t, hueSlider: e } = i(this, u);
  t.style.translate = `${i(this, o).hsv.h / 360 * e.offsetWidth}px`;
}, ct = function(t, e, h) {
  i(this, u).inputA.value = t, i(this, u).inputB.value = e, i(this, u).inputC.value = h, i(this, u).inputAlpha.value = parseFloat(i(this, o).a.toFixed(2));
}, yt = function() {
  i(this, u).inputHEX.value = i(this, o).hex;
}, st = function() {
  r(this, s, kt).call(this), r(this, s, w).call(this, !0);
}, Ht = function() {
  r(this, s, Ft).call(this), r(this, s, kt).call(this);
}, kt = function() {
  switch (i(this, H)) {
    case l.RGB:
      {
        const { r: t, g: e, b: h } = i(this, o).rgb = i(this, o).toRGB();
        r(this, s, ct).call(this, Math.round(t), Math.round(e), Math.round(h));
      }
      break;
    case l.HSV:
      {
        const { h: t, s: e, v: h } = i(this, o).hsv;
        r(this, s, ct).call(this, `${Math.round(t)}°`, `${Math.round(e)}%`, `${Math.round(h)}%`);
      }
      break;
    case l.HSL:
      {
        const { h: t, s: e, l: h } = i(this, o).hsl = i(this, o).toHSL();
        r(this, s, ct).call(this, `${Math.round(t)}°`, `${Math.round(e)}%`, `${Math.round(h)}%`);
      }
      break;
    case l.HEX:
      r(this, s, vt).call(this), r(this, s, yt).call(this);
      break;
  }
}, w = function(t) {
  const e = i(this, o).a, h = i(this, o).toHSL(), { palette: n, opacitySlider: a, colorPreview: d } = i(this, u), g = `hsl(${h.h}deg 100% 50% / 1)`;
  n.style.backgroundImage = `linear-gradient(180deg, transparent 0%, rgba(0,0,0,1) 100%), linear-gradient(90deg, rgba(255,255,255,1) 0%, ${g} 100%)`;
  const b = `hsl(${h.h}, ${h.s}%, ${h.l}%)`;
  a.style.setProperty(
    "background-image",
    `linear-gradient(90deg, transparent, ${b})`
  ), d.setAttribute("fill", b), d.setAttribute("fill-opacity", e), t == !0 && i(this, m).onInput(this);
}, E = function() {
  const { palette: t, cursor: e } = i(this, u), { s: h, v: n } = i(this, o).hsv;
  e.style.translate = `${h / 100 * t.offsetWidth}px ${t.offsetHeight - n / 100 * t.offsetHeight}px`;
}, qt = function() {
  const t = f("button", ["cp-clipboard-color"]);
  return t.addEventListener("click", r(this, s, ye).bind(this)), i(this, u).copyColor = t, r(this, s, St).call(this), t;
}, St = function() {
  const t = '<path d="m1.9695 11.037v-6.7c0-2 1.6-3.7 3.7-3.7h4.3c0.8 0 1.5 0.5 1.7 1.2h-5.6c-1.6 0.1-2.9 1.4-2.9 3.1v7.9c-0.7-0.3-1.2-1-1.2-1.8zm4.3 4.3c-1 0-1.8-0.8-1.8-1.8v-8.6c0-1 0.8-1.8 1.8-1.8h6.1c1 0 1.8 0.8 1.8 1.8v8.6c0 1-0.8 1.8-1.8 1.8zm6.7-1.8v-8.6c0-0.3-0.3-0.6-0.6-0.6h-6.1c-0.3 0-0.6 0.3-0.6 0.6v8.6c0 0.3 0.3 0.6 0.6 0.6h6.1c0.3 0 0.6-0.3 0.6-0.6z"/>';
  i(this, u).copyColor.innerHTML = "", i(this, u).copyColor.appendChild(r(this, s, ut).call(this, t));
}, Kt = function() {
  const t = '<path d="m13.975 5.3001c0.24929-0.24929 0.16619-0.58168-0.0831-0.83097l-0.66477-0.66477c-0.24929-0.24929-0.58168-0.16619-0.83097 0.083097l-5.5675 6.2322-3.407-3.1577c-0.24929-0.24929-0.58168-0.16619-0.83097 0.083097l-0.66477 0.66477c-0.24929 0.24929-0.16619 0.58168 0.083097 0.83097l4.5703 4.1548c0.24929 0.24929 0.58168 0.16619 0.83097-0.0831z"/>';
  i(this, u).copyColor.innerHTML = "", i(this, u).copyColor.appendChild(r(this, s, ut).call(this, t));
}, ut = function(t) {
  const e = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  return e.setAttribute("viewBox", "0 0 16 16"), e.setAttribute("width", "16px"), e.setAttribute("height", "16px"), e.innerHTML = t, e;
}, jt = function() {
  const t = f("div", ["cp-sliders"]);
  return t.appendChild(r(this, s, Qt).call(this)), t.appendChild(r(this, s, Yt).call(this)), t;
}, Qt = function() {
  const t = f("div", ["cp-hue-slider-wrapper"]), e = f("div", ["cp-hue-slider"]), h = f("a", ["cp-hue-slider-thumb"]);
  return h.setAttribute("tabindex", "0"), t.appendChild(e), t.appendChild(h), v(this, ot, r(this, s, He).bind(this)), v(this, Q, r(this, s, ke).bind(this)), v(this, F, r(this, s, Se).bind(this)), t.addEventListener(
    "pointerdown",
    i(this, ot)
  ), h.addEventListener(
    "keydown",
    r(this, s, Le).bind(this)
  ), i(this, u).hueSlider = e, i(this, u).hueThumb = h, t;
}, Yt = function() {
  const t = f("div", ["cp-opacity-slider-wrapper"]), e = f("div", ["cp-opacity-color"]), h = f("a", ["cp-opacity-slider-thumb"]);
  return h.setAttribute("tabindex", "0"), t.appendChild(e), t.appendChild(h), v(this, lt, r(this, s, Ee).bind(this)), v(this, Y, r(this, s, Ce).bind(this)), v(this, U, r(this, s, Me).bind(this)), t.addEventListener(
    "pointerdown",
    i(this, lt)
  ), h.addEventListener(
    "keydown",
    r(this, s, Be).bind(this)
  ), i(this, u).opacitySlider = e, i(this, u).opacityThumb = h, t;
}, Jt = function() {
  const t = f("span", [
    "cp-color-preview-wrapper"
  ]), e = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  e.setAttribute("width", 38), e.setAttribute("height", 38);
  const h = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  return h.setAttribute("cx", 19), h.setAttribute("cy", 19), h.setAttribute("r", 18), h.classList.add("cp-preview-stroke"), e.innerHTML = '<pattern id="transparent-grid" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse"><path fill="#DBDBDB" d="M0 0h3v3H0z"/><path fill="#fff" d="M3 0h3v3H3z"/><path fill="#DBDBDB" d="M3 3h3v3H3z"/><path fill="#fff" d="M0 3h3v3H0z"/></pattern></defs><circle cx="19" cy="19" r="18" fill="url(#transparent-grid)"/>', e.appendChild(h), t.appendChild(e), i(this, u).colorPreview = h, t;
}, X = function() {
  r(this, s, w).call(this, !0), r(this, s, G).call(this), r(this, s, E).call(this);
}, L = function(t, e, h, n, a, d, g) {
  const { target: b } = e, { rgb: k, hex: C } = i(this, o);
  if (h(k[t], n)) {
    k[t] = a(k[t], 1), i(this, o).hex = C.substring(0, d) + j(Math.round(k[t])) + C.substring(g);
    const { r: O, g: ft, b: mt } = k;
    i(this, o).hsv = y.RGBtoHSV(O, ft, mt), r(this, s, X).call(this);
  }
  b.value = i(this, o).hex, b.setSelectionRange(d, g), e.preventDefault();
}, nt = function(t, e, h, n) {
  const { target: a } = t, { hex: d, a: g } = i(this, o);
  e(g, h) && (i(this, o).a = parseFloat(n(g, 0.01).toFixed(2)), a.value = i(this, o).hex = d.substring(0, 7) + j(Math.round(i(this, o).a * 255)), r(this, s, w).call(this, !0), r(this, s, N).call(this)), a.value = i(this, o).hex, a.setSelectionRange(7, 9), t.preventDefault();
}, pt = function(t) {
  i(this, o).a = parseFloat(t.toFixed(2)), i(this, H) == l.HEX ? (r(this, s, vt).call(this, this), r(this, s, yt).call(this)) : i(this, u).inputAlpha.value = i(this, o).a, r(this, s, w).call(this, !0);
}, Zt = function() {
  var t;
  if (i(this, m).target != null) {
    if (!r(t = l, p, Bt).call(t, i(this, m).target)) {
      this.close();
      return;
    }
    r(this, s, Lt).call(this, r(this, s, Mt).call(this));
  }
}, gt = function(t) {
  const e = document.getElementById(i(this, m).container);
  if (e == null)
    throw ReferenceError(
      "ColorPicker:: container to set color picker is undefined"
    );
  r(this, s, bt).call(this, this);
  const { overlayWrapper: h } = i(this, u), n = h.parentElement;
  e.appendChild(h), h.classList.remove(
    "cp-overlay-wrapper--light",
    "cp-overlay-wrapper--dark"
  ), h.classList.add("cp-overlay-wrapper--static"), h.classList.add("cp-overlay-wrapper--open"), h.classList.add("cp-overlay-wrapper--" + i(this, m).theme), r(this, s, dt).call(this), v(this, $, !0), t && n != h.parentElement && i(this, m).onContainerChange(this, n);
}, Et = function() {
  r(this, s, bt).call(this, this);
  const { overlayWrapper: t } = i(this, u), e = t.parentElement;
  document.body.appendChild(t), t.classList.remove(
    "cp-overlay-wrapper--light",
    "cp-overlay-wrapper--dark"
  ), t.classList.remove("cp-overlay-wrapper--static"), t.classList.add("cp-overlay-wrapper--open"), t.classList.add("cp-overlay-wrapper--" + i(this, m).theme), r(this, s, dt).call(this), r(this, s, Zt).call(this), window.addEventListener("resize", i(this, D)), window.addEventListener("scroll", i(this, D)), document.addEventListener("click", i(this, J)), document.addEventListener("keyup", i(this, Z)), v(this, $, !0), e != t.parentElement && i(this, m).onContainerChange(this, e);
}, _t = function() {
  i(this, u).overlayWrapper.classList.remove("cp-overlay-wrapper--open"), r(this, s, bt).call(this, this), v(this, $, !1);
}, te = function(t) {
  t.stopPropagation(), i(this, $) ? this.close() : this.open();
}, ee = function(t) {
  v(this, B, !0), document.addEventListener("pointermove", i(this, z)), document.addEventListener("pointerup", i(this, _)), i(this, z).call(this, t);
}, ie = function(t) {
  document.removeEventListener("pointermove", i(this, z)), document.removeEventListener("pointerup", i(this, _)), i(this, u).overlayWrapper.contains(t.target) && v(this, B, !1);
}, se = function(t) {
  const { x: e, y: h } = r(this, s, Ae).call(this, t.clientX, t.clientY);
  i(this, u).cursor.style.translate = `${e}px ${h}px`;
  const n = i(this, u).palette.offsetHeight, a = i(this, u).palette.offsetWidth;
  i(this, o).hsv.s = e / a * 100, i(this, o).hsv.v = (n - h) / n * 100, r(this, s, st).call(this);
}, ne = function() {
  switch (i(this, H)) {
    case l.RGB:
      r(this, s, K).call(this, l.HSV);
      break;
    case l.HSV:
      r(this, s, K).call(this, l.HSL);
      break;
    case l.HSL:
      r(this, s, K).call(this, l.HEX);
      break;
    case l.HEX:
      r(this, s, K).call(this, l.RGB);
      break;
  }
}, rt = function() {
  switch (i(this, H)) {
    case l.RGB:
      i(this, o).rgb = this.getRGB();
      break;
    case l.HSV:
      i(this, o).hsv = this.getHSV();
      break;
    case l.HSL:
      i(this, o).hsl = this.getHSL();
      break;
    case l.HEX:
      r(this, s, vt).call(this);
      break;
  }
}, re = function(t) {
  const { target: e, key: h } = t, { a: n } = i(this, o);
  switch (h) {
    case "ArrowUp":
      if (n < 1) {
        let a = parseFloat((n + 0.01).toFixed(2));
        a > 1 && (a = 1), e.value = i(this, o).a = a, r(this, s, w).call(this, !0), r(this, s, N).call(this);
      }
      break;
    case "ArrowDown":
      if (n > 0) {
        let a = parseFloat((n - 0.01).toFixed(2));
        a < 0 && (a = 0), e.value = i(this, o).a = a, r(this, s, w).call(this, !0), r(this, s, N).call(this);
      }
      break;
    case ".":
      /(\.)/.test(e.value) && t.preventDefault();
      break;
  }
}, he = function(t) {
  const { target: e } = t;
  if (/^(0(\.\d{1,2})?|(0*)1?)$/.test(e.value) || e.value == "") {
    const h = parseFloat(e.value) || 0;
    !isNaN(h) && h >= 0 && h <= 1 && (i(this, o).a = h, r(this, s, w).call(this, !0), r(this, s, N).call(this, this));
  }
}, ae = function(t) {
  t.target.value = i(this, o).a;
}, oe = function(t) {
  const { target: e, key: h } = t;
  switch (h) {
    case "ArrowUp":
      {
        /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(
          e.value
        ) || (e.value = i(this, o).hex);
        const n = r(this, s, Ct).call(this, e), a = e.value.length;
        a <= 5 ? n < 2 ? r(this, s, L).call(this, "r", t, r(l, p, I), 255, r(l, p, V), 1, 3) : n < 3 ? r(this, s, L).call(this, "g", t, r(l, p, I), 255, r(l, p, V), 3, 5) : n <= 4 && a <= 4 || n < 4 ? r(this, s, L).call(this, "b", t, r(l, p, I), 255, r(l, p, V), 5, 7) : n <= 5 && r(this, s, nt).call(this, t, r(l, p, I), 1, r(l, p, V)) : n < 3 ? r(this, s, L).call(this, "r", t, r(l, p, I), 255, r(l, p, V), 1, 3) : n < 5 ? r(this, s, L).call(this, "g", t, r(l, p, I), 255, r(l, p, V), 3, 5) : n <= 7 && a == 7 || n < 7 ? r(this, s, L).call(this, "b", t, r(l, p, I), 255, r(l, p, V), 5, 7) : n <= 9 && r(this, s, nt).call(this, t, r(l, p, I), 1, r(l, p, V));
      }
      break;
    case "ArrowDown":
      {
        /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(
          e.value
        ) || (e.value = i(this, o).hex);
        const n = r(this, s, Ct).call(this, e), a = e.value.length;
        a <= 5 ? n < 2 ? r(this, s, L).call(this, "r", t, r(l, p, T), 0, r(l, p, W), 1, 3) : n < 3 ? r(this, s, L).call(this, "g", t, r(l, p, T), 0, r(l, p, W), 3, 5) : n <= 4 && a <= 4 || n < 4 ? r(this, s, L).call(this, "b", t, r(l, p, T), 0, r(l, p, W), 5, 7) : n <= 5 && r(this, s, nt).call(this, t, r(l, p, T), 0, r(l, p, W)) : n < 3 ? r(this, s, L).call(this, "r", t, r(l, p, T), 0, r(l, p, W), 1, 3) : n < 5 ? r(this, s, L).call(this, "g", t, r(l, p, T), 0, r(l, p, W), 3, 5) : n <= 7 && a == 7 || n < 7 ? r(this, s, L).call(this, "b", t, r(l, p, T), 0, r(l, p, W), 5, 7) : n <= 9 && r(this, s, nt).call(this, t, r(l, p, T), 0, r(l, p, W));
      }
      break;
  }
}, le = function(t) {
  const e = y.HEXtoRGBA(t.target.value.trim());
  if (e != null) {
    const { r: h, g: n, b: a, a: d } = e;
    i(this, o).a = d, i(this, o).rgb = { r: h, g: n, b: a }, i(this, o).hex = y.RGBAtoHEX(h, n, a, d), i(this, o).hsv = y.RGBtoHSV(h, n, a), r(this, s, w).call(this, !0), r(this, s, G).call(this), r(this, s, N).call(this), r(this, s, E).call(this);
  }
}, de = function(t) {
  t.target.value = i(this, o).hex;
}, ce = function(t) {
  const { target: e, key: h } = t;
  switch (h) {
    case "ArrowUp":
      switch (i(this, H)) {
        case l.RGB:
          {
            let { r: n, g: a, b: d } = i(this, o).rgb;
            n = Math.round(n), n < 255 && (i(this, o).rgb.r = e.value = ++n, i(this, o).hsv = y.RGBtoHSV(n, a, d), r(this, s, X).call(this));
          }
          break;
        case l.HSV:
        case l.HSL:
          {
            let { h: n } = i(this, o).hsv;
            n = Math.round(n), n < 360 && (e.value = ++n + "°", i(this, o).hsv.h = i(this, o).hsl.h = n, r(this, s, w).call(this, !0), r(this, s, G).call(this));
          }
          break;
      }
      break;
    case "ArrowDown":
      switch (i(this, H)) {
        case l.RGB:
          {
            let { r: n, g: a, b: d } = i(this, o).rgb;
            n = Math.round(n), n > 0 && (i(this, o).rgb.r = e.value = --n, i(this, o).hsv = y.RGBtoHSV(n, a, d), r(this, s, X).call(this));
          }
          break;
        case l.HSV:
        case l.HSL:
          {
            let { h: n } = i(this, o).hsv;
            n = Math.round(n), n > 0 && (e.value = --n + "°", i(this, o).hsv.h = i(this, o).hsl.h = n, r(this, s, w).call(this, !0), r(this, s, G).call(this));
          }
          break;
      }
      break;
  }
}, ue = function(t) {
  const e = parseInt(t.target.value || 0);
  if (/^(\d{1,3})(°?)$/.test(e))
    switch (i(this, H)) {
      case l.RGB:
        {
          const { g: h, b: n } = i(this, o).rgb;
          !isNaN(e) && e >= 0 && e <= 255 && (i(this, o).rgb.r = e, i(this, o).hsv = y.RGBtoHSV(e, h, n), r(this, s, w).call(this, !0), r(this, s, G).call(this), r(this, s, E).call(this));
        }
        break;
      case l.HSV:
      case l.HSL:
        !isNaN(e) && e >= 0 && e <= 360 && (i(this, o).hsv.h = i(this, o).hsl.h = e, r(this, s, w).call(this, !0), r(this, s, G).call(this));
        break;
    }
}, pe = function(t) {
  let e = t.target.value;
  switch (i(this, H)) {
    case l.RGB:
      e = Math.round(i(this, o).rgb.r);
      break;
    case l.HSV:
    case l.HSL:
      e = `${Math.round(i(this, o).hsv.h)}°`;
      break;
  }
  t.target.value = e;
}, ge = function(t) {
  const { target: e, key: h } = t;
  switch (h) {
    case "ArrowUp":
      switch (i(this, H)) {
        case l.RGB:
          {
            let { r: n, g: a, b: d } = i(this, o).rgb;
            a = Math.round(a), a < 255 && (i(this, o).rgb.g = e.value = ++a, i(this, o).hsv = y.RGBtoHSV(n, a, d), r(this, s, X).call(this));
          }
          break;
        case l.HSV:
          {
            let { s: n } = i(this, o).hsv;
            n = Math.round(n), n < 100 && (e.value = ++n + "%", i(this, o).hsv.s = n, r(this, s, w).call(this, !0), r(this, s, E).call(this));
          }
          break;
        case l.HSL:
          {
            const { h: n, s: a, l: d } = i(this, o).hsl;
            let g = Math.round(a);
            g < 100 && (e.value = ++g + "%", i(this, o).hsl.s = g, i(this, o).hsv.s = y.HSLtoHSV(n, g, d).s, r(this, s, w).call(this, !0), r(this, s, E).call(this));
          }
          break;
      }
      break;
    case "ArrowDown":
      switch (i(this, H)) {
        case l.RGB:
          {
            let { r: n, g: a, b: d } = i(this, o).rgb;
            a = Math.round(a), a > 0 && (i(this, o).rgb.g = e.value = --a, i(this, o).hsv = y.RGBtoHSV(n, a, d), r(this, s, X).call(this));
          }
          break;
        case l.HSV:
          {
            let { s: n } = i(this, o).hsv;
            n = Math.round(n), n > 0 && (e.value = --n + "%", i(this, o).hsv.s = n, r(this, s, w).call(this, !0), r(this, s, E).call(this));
          }
          break;
        case l.HSL:
          {
            const { h: n, s: a, l: d } = i(this, o).hsl;
            let g = Math.round(a);
            g > 0 && (e.value = --g + "%", i(this, o).hsl.s = g, i(this, o).hsv.s = y.HSLtoHSV(n, g, d).s, r(this, s, w).call(this, !0), r(this, s, E).call(this));
          }
          break;
      }
      break;
  }
}, be = function(t) {
  const e = parseInt(t.target.value || 0);
  if (/^(\d{1,3})(%?)$/.test(e))
    switch (i(this, H)) {
      case l.RGB:
        {
          const { r: h, b: n } = i(this, o).rgb;
          !isNaN(e) && e >= 0 && e <= 255 && (i(this, o).rgb.g = e, i(this, o).hsv = y.RGBtoHSV(h, e, n), r(this, s, w).call(this, !0), r(this, s, G).call(this), r(this, s, E).call(this));
        }
        break;
      case l.HSV:
        !isNaN(e) && e >= 0 && e <= 100 && (i(this, o).hsv.s = e, r(this, s, w).call(this, !0), r(this, s, E).call(this));
        break;
      case l.HSL:
        {
          const { h, l: n } = i(this, o).hsl;
          !isNaN(e) && e >= 0 && e <= 100 && (i(this, o).hsl.s = e, i(this, o).hsv = y.HSLtoHSV(h, e, n), r(this, s, w).call(this, !0), r(this, s, E).call(this));
        }
        break;
    }
}, ve = function(t) {
  let e = t.target.value;
  switch (i(this, H)) {
    case l.RGB:
      e = Math.round(i(this, o).rgb.g);
      break;
    case l.HSV:
      e = `${Math.round(i(this, o).hsv.s)}%`;
      break;
    case l.HSL:
      e = `${Math.round(i(this, o).hsl.s)}%`;
      break;
  }
  t.target.value = e;
}, fe = function(t) {
  const { target: e, key: h } = t;
  switch (h) {
    case "ArrowUp":
      switch (i(this, H)) {
        case l.RGB:
          {
            let { r: n, g: a, b: d } = i(this, o).rgb;
            d = Math.round(d), d < 255 && (i(this, o).rgb.b = e.value = ++d, i(this, o).hsv = y.RGBtoHSV(n, a, d), r(this, s, X).call(this));
          }
          break;
        case l.HSV:
          {
            let { v: n } = i(this, o).hsv;
            n = Math.round(n), n < 100 && (e.value = ++n + "%", i(this, o).hsv.v = n, r(this, s, w).call(this, !0), r(this, s, E).call(this));
          }
          break;
        case l.HSL:
          {
            const { h: n, s: a, l: d } = i(this, o).hsl;
            let g = Math.round(d);
            g < 100 && (e.value = ++g + "%", i(this, o).hsl.l = g, i(this, o).hsv.v = y.HSLtoHSV(n, a, g).v, r(this, s, w).call(this, !0), r(this, s, E).call(this));
          }
          break;
      }
      break;
    case "ArrowDown":
      switch (i(this, H)) {
        case l.RGB:
          {
            let { r: n, g: a, b: d } = i(this, o).rgb;
            d = Math.round(d), d > 0 && (i(this, o).rgb.b = e.value = --d, i(this, o).hsv = y.RGBtoHSV(n, a, d), r(this, s, X).call(this));
          }
          break;
        case l.HSV:
          {
            let { v: n } = i(this, o).hsv;
            n = Math.round(n), n > 0 && (e.value = --n + "%", i(this, o).hsv.v = n, r(this, s, w).call(this, !0), r(this, s, E).call(this));
          }
          break;
        case l.HSL:
          {
            const { h: n, s: a, l: d } = i(this, o).hsl;
            let g = Math.round(d);
            d > 0 && (e.value = --g + "%", i(this, o).hsl.l = g, i(this, o).hsv.v = y.HSLtoHSV(n, a, g).v, r(this, s, w).call(this, !0), r(this, s, E).call(this));
          }
          break;
      }
      break;
  }
}, me = function(t) {
  const e = parseInt(t.target.value || 0);
  if (/^(\d{1,3})(%?)$/.test(e))
    switch (i(this, H)) {
      case l.RGB:
        {
          const { r: h, g: n } = i(this, o).rgb;
          !isNaN(e) && e >= 0 && e <= 255 && (i(this, o).rgb.b = e, i(this, o).hsv = y.RGBtoHSV(h, n, e), r(this, s, w).call(this, !0), r(this, s, G).call(this), r(this, s, E).call(this));
        }
        break;
      case l.HSV:
        !isNaN(e) && e >= 0 && e <= 100 && (i(this, o).hsv.v = e, r(this, s, w).call(this, !0), r(this, s, E).call(this));
        break;
      case l.HSL:
        {
          const { h, s: n } = i(this, o).hsl;
          !isNaN(e) && e >= 0 && e <= 100 && (i(this, o).hsl.l = e, i(this, o).hsv = y.HSLtoHSV(h, n, e), r(this, s, w).call(this, !0), r(this, s, E).call(this));
        }
        break;
    }
}, we = function(t) {
  let e = t.target.value;
  switch (i(this, H)) {
    case l.RGB:
      e = Math.round(i(this, o).rgb.b);
      break;
    case l.HSV:
      e = `${Math.round(i(this, o).hsv.v)}%`;
      break;
    case l.HSL:
      e = `${Math.round(i(this, o).hsl.l)}%`;
      break;
  }
  t.target.value = e;
}, ye = function() {
  i(this, q) && clearTimeout(i(this, q));
  const t = document.createElement("input");
  t.style.position = "absolute", t.style.left = "-99999px", t.style.top = "-99999px", t.value = r(this, s, Ge).call(this), document.body.appendChild(t), t.select();
  try {
    document.execCommand("copy"), r(this, s, Kt).call(this), i(this, u).copyColor.focus(), i(this, m).onCopy(this), v(this, q, setTimeout(() => {
      r(this, s, St).call(this), v(this, q, null);
    }, 600));
  } catch (e) {
    throw document.body.removeChild(t), new Error("YKColorPicker:: Failed to copy color.", {
      cause: e
    });
  }
}, He = function(t) {
  t.preventDefault(), v(this, B, !0), document.addEventListener("pointermove", i(this, F)), document.addEventListener("pointerup", i(this, Q)), i(this, u).hueThumb.focus(), i(this, F).call(this, t);
}, ke = function(t) {
  document.removeEventListener("pointermove", i(this, F)), document.removeEventListener("pointerup", i(this, Q)), i(this, u).overlayWrapper.contains(t.target) && v(this, B, !1);
}, Se = function(t) {
  const { hueSlider: e, hueThumb: h } = i(this, u), n = e.getBoundingClientRect(), a = n.width;
  let d = t.clientX - n.left;
  d < 0 && (d = 0), d > a && (d = a), i(this, o).hsv.h = d / n.width * 360, h.style.translate = `${d}px`, r(this, s, st).call(this);
}, Ee = function(t) {
  t.preventDefault(), v(this, B, !0), document.addEventListener(
    "pointermove",
    i(this, U)
  ), document.addEventListener("pointerup", i(this, Y)), i(this, u).opacityThumb.focus(), i(this, U).call(this, t);
}, Ce = function(t) {
  document.removeEventListener(
    "pointermove",
    i(this, U)
  ), document.removeEventListener("pointerup", i(this, Y)), i(this, u).overlayWrapper.contains(t.target) && v(this, B, !1);
}, Me = function(t) {
  const { opacitySlider: e, opacityThumb: h } = i(this, u), n = e.getBoundingClientRect(), a = n.width;
  let d = t.clientX - n.left;
  h.focus(), d < 0 && (d = 0), d > a && (d = a), h.style.translate = `${d}px`, r(this, s, pt).call(this, d / a);
}, Le = function(t) {
  const { key: e } = t;
  switch (e) {
    case "ArrowUp":
    case "ArrowRight":
      {
        const { hueThumb: h, hueSlider: n } = i(this, u);
        let a = parseInt(h.style.translate);
        !isNaN(a) && a < n.offsetWidth && (h.style.translate = `${++a}px`, i(this, o).hsv.h = a / n.offsetWidth * 360, r(this, s, st).call(this)), t.preventDefault();
      }
      break;
    case "ArrowDown":
    case "ArrowLeft":
      {
        const { hueThumb: h, hueSlider: n } = i(this, u);
        let a = parseInt(h.style.translate);
        !isNaN(a) && a > 0 && (h.style.translate = `${--a}px`, i(this, o).hsv.h = a / n.offsetWidth * 360, r(this, s, st).call(this)), t.preventDefault();
      }
      break;
  }
}, Be = function(t) {
  const { key: e } = t;
  switch (e) {
    case "ArrowUp":
    case "ArrowRight":
      {
        const { opacityThumb: h, opacitySlider: n } = i(this, u);
        let a = parseInt(h.style.translate);
        !isNaN(a) && a < n.offsetWidth && (h.style.translate = `${++a}px`, r(this, s, pt).call(this, a / n.offsetWidth)), t.preventDefault();
      }
      break;
    case "ArrowDown":
    case "ArrowLeft":
      {
        const { opacityThumb: h, opacitySlider: n } = i(this, u);
        let a = parseInt(h.style.translate);
        !isNaN(a) && a > 0 && (h.style.translate = `${--a}px`, r(this, s, pt).call(this, a / n.offsetWidth)), t.preventDefault();
      }
      break;
  }
}, Re = function(t) {
  if (t.key == "Enter" && i(this, $)) {
    this.close();
    return;
  }
  t.key == "Escape" && (this._prevColor != this.getHEX() && (this.setColor(this._prevColor), r(this, s, dt).call(this), i(this, m).onInput(this)), this.close());
}, xe = function(t) {
  var d;
  const { type: e } = t, { target: h, closeOnScroll: n, closeOnResize: a } = i(this, m);
  if (e == "scroll" && n || e == "resize" && a)
    this.close();
  else {
    if (h == null)
      return;
    if (!r(d = l, p, Bt).call(d, i(this, m).target)) {
      this.close();
      return;
    }
    r(this, s, Lt).call(this, r(this, s, Mt).call(this));
  }
}, bt = function() {
  window.removeEventListener("resize", i(this, D)), window.removeEventListener("scroll", i(this, D)), document.removeEventListener("keyup", i(this, Z)), document.removeEventListener("click", i(this, J));
}, Ae = function(t, e) {
  const h = i(this, u).palette.getBoundingClientRect();
  let n = t - h.left, a = e - h.top;
  return n < 0 ? n = 0 : n > h.width && (n = h.width), a < 0 ? a = 0 : a > h.height && (a = h.height), {
    x: n,
    y: a
  };
}, vt = function() {
  const { r: t, g: e, b: h } = i(this, o).rgb = i(this, o).toRGB();
  i(this, o).hex = y.RGBAtoHEX(t, e, h, i(this, o).a);
}, Ge = function() {
  switch (i(this, H)) {
    case l.RGB:
      const { r: t, g: e, b: h } = i(this, o).rgb;
      return `rgba(${Math.round(t)}, ${Math.round(e)}, ${Math.round(h)}, ${i(this, o).a})`;
    case l.HSV: {
      const { h: n, s: a, v: d } = i(this, o).hsv;
      return `hsva(${Math.round(n)}, ${Math.round(a)}%, ${Math.round(d)}%, ${i(this, o).a})`;
    }
    case l.HSL: {
      const { h: n, s: a, l: d } = i(this, o).hsl;
      return `hsla(${Math.round(n)}, ${Math.round(a)}%, ${Math.round(d)}%, ${i(this, o).a})`;
    }
    case l.HEX:
      return this.getHEX();
  }
}, Ct = function(t) {
  let e = t.selectionStart;
  const h = t.value.length;
  return e > h && (e = h), e;
}, Mt = function() {
  var Gt, $t, It, Tt;
  const { target: t, position: e, positionFallback: h } = i(this, m), n = t.getBoundingClientRect(), a = i(this, u).overlayWrapper.getBoundingClientRect(), d = document.documentElement.scrollTop, g = document.documentElement.scrollLeft, b = 6;
  let k = e;
  const C = r(Gt = l, p, ht).call(Gt, () => d + n.top, () => n.top, a.height + b), O = r($t = l, p, ht).call($t, () => {
    var M;
    return r(M = l, p, $e).call(M) - (d + n.top + n.height);
  }, () => window.innerHeight - (n.top + n.height), a.height + b), ft = r(It = l, p, ht).call(It, () => g + n.left, () => n.left, a.width + b), mt = r(Tt = l, p, ht).call(Tt, () => {
    var M;
    return r(M = l, p, Ie).call(M) - (g + n.left + n.width);
  }, () => window.innerWidth - (n.left + n.width), a.width + b), Te = {
    t: C,
    b: O,
    l: ft,
    r: mt
  };
  let tt = "";
  for (let M = 0; M < h.length; M++)
    tt += h[M] + Te[h[M]];
  let et = "", it = "";
  for (let M = 1; M < tt.length; M += 2) {
    const Vt = tt[M];
    Vt == 2 && (et = et + tt[M - 1]), Vt == 1 && (it = it + tt[M - 1]);
  }
  et != "" ? et.includes(k) == !1 && (k = et[0]) : it != "" ? it.includes(k) == !1 && (k = it[0]) : k = l.BOTTOM;
  let R = 0, x = 0;
  switch (k) {
    case l.TOP:
      x = n.top - a.height - b, R = n.left + n.width / 2 - a.width / 2;
      break;
    case l.BOTTOM:
      x = n.top + n.height + b, R = n.left + n.width / 2 - a.width / 2;
      break;
    case l.LEFT:
      x = n.top + n.height / 2 - a.height / 2, R = n.left - a.width - b;
      break;
    case l.RIGHT:
      x = n.top + n.height / 2 - a.height / 2, R = n.left + n.width + b;
      break;
  }
  const xt = window.innerWidth - document.documentElement.clientWidth, At = window.innerHeight - document.documentElement.clientHeight;
  return window.innerWidth - xt < R + a.width && (R -= R + a.width - window.innerWidth + xt), window.innerHeight - At < x + a.height && (x -= x + a.height - window.innerHeight + At), R = Math.max(R, 0), x = Math.max(x, 0), {
    x: R,
    y: x
  };
}, Lt = function(t) {
  const { x: e, y: h } = t;
  i(this, u).overlayWrapper.style.top = `${h}px`, i(this, u).overlayWrapper.style.left = `${e}px`;
}, K = function(t) {
  v(this, H, t), r(this, s, Ht).call(this), i(this, m).onRepresentationChange(this);
}, p = new WeakSet(), Bt = function(t) {
  if (t) {
    const e = t.getBoundingClientRect();
    return e.top >= 0 && e.left >= 0 && e.bottom <= (window.innerHeight || document.documentElement.clientHeight) && e.right <= (window.innerWidth || document.documentElement.clientWidth);
  }
}, $e = function() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );
}, Ie = function() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.body.clientWidth,
    document.documentElement.clientWidth
  );
}, ht = function(t, e, h) {
  return t() >= h ? e() >= h ? 2 : 1 : 0;
}, Rt = function(t, e) {
  e == null && (e = {});
  const h = {}, n = Object.keys(t);
  for (let a = 0; a < n.length; a++) {
    const d = n[a];
    e.hasOwnProperty(d) == !0 ? h[d] = e[d] : h[d] = t[d];
  }
  return h;
}, I = function(t, e) {
  return t < e;
}, T = function(t, e) {
  return t > e;
}, V = function(t, e) {
  return t + e;
}, W = function(t, e) {
  return t - e;
}, S(l, p), A(l, "TOP", "t"), A(l, "BOTTOM", "b"), A(l, "LEFT", "l"), A(l, "RIGHT", "r"), A(l, "RGB", "rgb"), A(l, "HSV", "hsv"), A(l, "HSL", "hsl"), A(l, "HEX", "hex"), A(l, "DEFAULT_OPTIONS", Object.freeze({
  target: null,
  container: null,
  position: l.BOTTOM,
  positionFallback: "btrl",
  representation: l.RGB,
  color: "red",
  closeOnScroll: !0,
  closeOnResize: !1,
  theme: "light",
  onInit: () => {
  },
  onOpen: () => {
  },
  onClose: () => {
  },
  onInput: () => {
  },
  onChange: () => {
  },
  onCopy: () => {
  },
  onRepresentationChange: () => {
  },
  onContainerChange: () => {
  }
}));
let Ot = l;
export {
  Ot as default
};
