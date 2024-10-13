var Te = Object.defineProperty;
var Wt = (g) => {
  throw TypeError(g);
};
var Ve = (g, t, e) => t in g ? Te(g, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : g[t] = e;
var A = (g, t, e) => Ve(g, typeof t != "symbol" ? t + "" : t, e), wt = (g, t, e) => t.has(g) || Wt("Cannot " + e);
var s = (g, t, e) => (wt(g, t, "read from private field"), e ? e.call(g) : t.get(g)), S = (g, t, e) => t.has(g) ? Wt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(g) : t.set(g, e), v = (g, t, e, r) => (wt(g, t, "write to private field"), r ? r.call(g, e) : t.set(g, e), e), h = (g, t, e) => (wt(g, t, "access private method"), e);
class H {
  constructor(t, e, r, n) {
    this.a = n, this.hsv = { h: t, s: e, v: r }, this.rgb = this.toRGB(), this.hsl = this.toHSL(), this.hex = this.toHEX();
  }
  toRGB() {
    let { h: t, s: e, v: r } = this.hsv;
    t /= 360, e /= 100, r /= 100;
    var n, a, d, p, b, m, C, O;
    switch (p = Math.floor(t * 6), b = t * 6 - p, m = r * (1 - e), C = r * (1 - b * e), O = r * (1 - (1 - b) * e), p % 6) {
      case 0:
        n = r, a = O, d = m;
        break;
      case 1:
        n = C, a = r, d = m;
        break;
      case 2:
        n = m, a = r, d = O;
        break;
      case 3:
        n = m, a = C, d = r;
        break;
      case 4:
        n = O, a = m, d = r;
        break;
      case 5:
        n = r, a = m, d = C;
        break;
    }
    return {
      r: Math.round(n * 255),
      g: Math.round(a * 255),
      b: Math.round(d * 255)
    };
  }
  toHSL() {
    let { h: t, s: e, v: r } = this.hsv, n = e * 0.01, a = r * 0.01, d = a - a * n / 2, p = NaN;
    d == 0 || d == 1 ? p = 0 : p = (a - d) / Math.min(d, 1 - d) * 100;
    let b = d * 100;
    return e = p, {
      h: t,
      s: e,
      l: b
    };
  }
  toHEX() {
    let { r: t, g: e, b: r } = this.toRGB();
    return H.RGBAtoHEX(t, e, r, this.a);
  }
  static RGBtoHSV(t, e, r) {
    t /= 255, e /= 255, r /= 255;
    let n = Math.max(t, e, r), a = Math.min(t, e, r), d, p, b = n, m = n - a;
    if (p = n == 0 ? 0 : m / n, n == a)
      d = 0;
    else {
      switch (n) {
        case t:
          d = (e - r) / m + (e < r ? 6 : 0);
          break;
        case e:
          d = (r - t) / m + 2;
          break;
        case r:
          d = (t - e) / m + 4;
          break;
      }
      d /= 6;
    }
    return d = d * 360, p = p * 100, b = b * 100, { h: d, s: p, v: b };
  }
  static HSLtoHSV(t, e, r) {
    const n = e * (r < 50 ? r : 100 - r) / 100;
    return {
      h: t,
      s: n === 0 ? 0 : 2 * n / (r + n) * 100,
      v: r + n
    };
  }
  static HEXtoRGBA(t) {
    let e = 0, r = 0, n = 0, a = 0;
    if (/^#(([a-f0-9]){3,4}|([a-f0-9]){6}|([a-f0-9]){8})$/i.test(t)) {
      if (t.length < 6) {
        const d = t.split("");
        e = +("0x" + d[1] + d[1]), r = +("0x" + d[2] + d[2]), n = +("0x" + d[3] + d[3]), a = d[4] ? parseFloat(
          (+("0x" + d[4] + d[4]) / 255).toFixed(2)
        ) : 1;
      } else if (t.length < 10) {
        const d = t.split(/([a-f0-9]{2})/i);
        e = +("0x" + d[1]), r = +("0x" + d[3]), n = +("0x" + d[5]), a = d[7] ? parseFloat((+("0x" + d[7]) / 255).toFixed(2)) : 1;
      }
      return { r: e, g: r, b: n, a };
    }
  }
  static RGBAtoHEX(t, e, r, n) {
    return t = j.hexPad2(Math.round(t)), e = j.hexPad2(Math.round(e)), r = j.hexPad2(Math.round(r)), n = n == 1 ? "" : j.hexPad2(Math.round(n * 255)), "#" + t + e + r + n;
  }
}
const We = Object.freeze({
  parse: function(g) {
    if (g == null)
      throw new Error("YKColorParser:: color is undefined");
    if (typeof g == "string" || g instanceof String) {
      if (g = g.trim(), /^(rgba?)/i.test(g))
        return this.compileRGB(g);
      if (/^(#)/i.test(g))
        return this.compileHEX(g);
      let t = this.NAMED_COLORS[g.toLowerCase()];
      if (t != null) {
        t = t.split(" ");
        const { h: e, s: r, v: n } = H.RGBtoHSV(t[0], t[1], t[2]);
        return { h: e, s: r, v: n, a: 1 };
      }
    } else {
      const { r: t, g: e, b: r, a: n } = g;
      if (t >= 0 && t <= 255 && e >= 0 && e <= 255 && r >= 0 && r <= 255 && n >= 0 && n <= 1) {
        const { h: a, s: d, v: p } = H.RGBtoHSV(t, e, r);
        return { h: a, s: d, v: p, a: n };
      }
      throw new Error(
        "YKColorParser:: The provided RGB object has invalid values, please make sure red, green, blue are between 0 and 255 and alpha value is between 0 and 1"
      );
    }
    throw new Error(
      "YKColorParser:: Color is not in RGB or HEX format or a named color"
    );
  },
  compileRGB: function(g) {
    let t, e, r, n;
    const a = /rgba?\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(\s+(0?(\.\d+)?|1(\.0*)?)\s*)?\)/i;
    if (a.test(g)) {
      const d = g.split(a).filter((C) => !isNaN(C) && C != "" && C != null);
      if (t = parseInt(d[0]), e = parseInt(d[1]), r = parseInt(d[2]), n = parseFloat(d[3]), t > 255)
        throw new RangeError(
          `YKColorParser:: '${g}' --> ${t} has an invalid red color, it must be an interger between 0 and 255`
        );
      if (e > 255)
        throw new RangeError(
          `YKColorParser:: '${g}' --> ${e} has an invalid green color, it must be an interger between 0 and 255`
        );
      if (r > 255)
        throw new RangeError(
          `YKColorParser:: '${g}' --> ${r} has an invalid blue color, it must be an interger between 0 and 255`
        );
      const { h: p, s: b, v: m } = H.RGBtoHSV(t, e, r);
      return { h: p, s: b, v: m, a: isNaN(n) ? 1 : n };
    }
    throw new SyntaxError(
      `YKColorParser:: '${g}' is an invalid RGB format`
    );
  },
  compileHEX: function(g) {
    const t = H.HEXtoRGBA(g);
    if (t) {
      const { r: e, g: r, b: n, a } = t, { h: d, s: p, v: b } = H.RGBtoHSV(e, r, n);
      return { h: d, s: p, v: b, a };
    }
    throw new Error(`YKColorParser:: '${g}' is an invalid HEX format`);
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
var $, w, o, c, k, B, P, at, Q, F, ot, lt, J, U, D, Y, Z, z, _, q, i, Ot, dt, Xt, Dt, Nt, Pt, Ft, Ut, N, G, ct, yt, st, Ht, kt, y, E, zt, St, qt, ut, Kt, jt, Qt, Jt, f, X, L, ht, pt, Yt, gt, Et, Zt, _t, te, ee, ie, se, nt, he, ne, re, ae, oe, le, de, ce, ue, pe, ge, be, ve, fe, me, we, ye, He, ke, Se, Ee, Ce, Me, Le, Be, xe, bt, Re, vt, Ae, Ct, Mt, Lt, K, u, Bt, Ge, $e, rt, xt, I, T, V, W;
const l = class l {
  constructor(t) {
    S(this, i);
    S(this, $, !1);
    S(this, w, l.DEFAULT_OPTIONS);
    S(this, o, null);
    S(this, c, {});
    S(this, k);
    S(this, B);
    S(this, P);
    S(this, at);
    S(this, Q);
    S(this, F);
    S(this, ot);
    S(this, lt);
    S(this, J);
    S(this, U);
    S(this, D);
    S(this, Y);
    S(this, Z);
    S(this, z);
    S(this, _);
    S(this, q, null);
    var n;
    v(this, w, h(n = l, u, xt).call(n, l.DEFAULT_OPTIONS, t));
    const { target: e, representation: r } = s(this, w);
    s(this, c).target = e, v(this, k, r), e && (v(this, P, h(this, i, _t).bind(this)), e.addEventListener("click", s(this, P))), this.setColor(s(this, w).color), this._prevColor = this.getHEX(), h(this, i, Ot).call(this);
  }
  isOpen() {
    return s(this, $);
  }
  open() {
    this._prevColor = this.getHEX(), s(this, w).container ? h(this, i, gt).call(this, !0) : h(this, i, Et).call(this), s(this, w).onOpen(this);
  }
  close() {
    s(this, B) || (this._prevColor != this.getHEX() && s(this, w).onChange(this), h(this, i, Zt).call(this), s(this, w).onClose(this)), v(this, B, !1);
  }
  getRGB() {
    return { ...s(this, o).toRGB(), a: s(this, o).a };
  }
  getHSV() {
    const { h: t, s: e, v: r } = s(this, o).hsv;
    return {
      h: Math.round(t),
      s: Math.round(e),
      v: Math.round(r),
      a: s(this, o).a
    };
  }
  getHSL() {
    const { h: t, s: e, l: r } = s(this, o).toHSL();
    return {
      h: Math.round(t),
      s: Math.round(e),
      l: Math.round(r),
      a: s(this, o).a
    };
  }
  getHEX() {
    return s(this, o).toHEX();
  }
  updateOptions(t) {
    var a;
    const e = h(a = l, u, xt).call(a, s(this, w), t);
    v(this, w, e);
    const { target: r, representation: n } = s(this, w);
    s(this, k) != n && h(this, i, K).call(this, n), s(this, c).target != r && (s(this, c).target != null && s(this, c).target.removeEventListener("click", s(this, P)), s(this, c).target = r, s(this, c).target != null && s(this, c).target.addEventListener("click", s(this, P))), s(this, $) && (s(this, w).container ? h(this, i, gt).call(this, !0) : h(this, i, Et).call(this));
  }
  getColor() {
    switch (s(this, k)) {
      case l.RGB: {
        const { r: t, g: e, b: r } = s(this, o).rgb;
        return {
          r: Math.round(t),
          g: Math.round(e),
          b: Math.round(r),
          a: s(this, o).a
        };
      }
      case l.HSV: {
        const { h: t, s: e, v: r } = s(this, o).hsv;
        return {
          h: Math.round(t),
          s: Math.round(e),
          l: Math.round(r),
          a: s(this, o).a
        };
      }
      case l.HSL: {
        const { h: t, s: e, l: r } = s(this, o).hsl;
        return {
          h: Math.round(t),
          s: Math.round(e),
          l: Math.round(r),
          a: s(this, o).a
        };
      }
      case l.HEX:
        return this.getHEX();
    }
  }
  setColor(t) {
    const { h: e, s: r, v: n, a } = We.parse(t);
    v(this, o, new H(e, r, n, a));
  }
  static hexPad2(t) {
    return t.toString(16).padStart(2, "0");
  }
};
$ = new WeakMap(), w = new WeakMap(), o = new WeakMap(), c = new WeakMap(), k = new WeakMap(), B = new WeakMap(), P = new WeakMap(), at = new WeakMap(), Q = new WeakMap(), F = new WeakMap(), ot = new WeakMap(), lt = new WeakMap(), J = new WeakMap(), U = new WeakMap(), D = new WeakMap(), Y = new WeakMap(), Z = new WeakMap(), z = new WeakMap(), _ = new WeakMap(), q = new WeakMap(), i = new WeakSet(), Ot = function() {
  const t = h(this, i, f).call(this, "div", [
    "cp-overlay-wrapper"
  ]), e = h(this, i, f).call(this, "div", ["cp-wrapper"]);
  t.appendChild(e), e.appendChild(h(this, i, Xt).call(this)), e.appendChild(h(this, i, Dt).call(this)), t.addEventListener(
    "click",
    (r) => r.stopPropagation()
  ), s(this, c).overlayWrapper = t, v(this, Z, h(this, i, Be).bind(this)), v(this, D, h(this, i, xe).bind(this)), v(this, Y, this.close.bind(this)), s(this, w).container ? h(this, i, gt).call(this, !1) : document.body.appendChild(s(this, c).overlayWrapper), s(this, w).onInit(this);
}, dt = function() {
  h(this, i, E).call(this), h(this, i, Ht).call(this), h(this, i, y).call(this, !1), h(this, i, G).call(this), h(this, i, N).call(this);
}, Xt = function() {
  const t = h(this, i, f).call(this, "div", ["cp-palette-wrapper"]), e = h(this, i, f).call(this, "div", ["cp-palette"]), r = h(this, i, f).call(this, "div", ["cp-cursor"]);
  return t.appendChild(e), t.appendChild(r), v(this, at, h(this, i, te).bind(this)), v(this, _, h(this, i, ee).bind(this)), v(this, z, h(this, i, ie).bind(this)), t.addEventListener("pointerdown", s(this, at)), s(this, c).palette = e, s(this, c).cursor = r, t;
}, Dt = function() {
  const t = h(this, i, f).call(this, "div", ["cp-color-settings"]);
  return t.appendChild(h(this, i, zt).call(this)), t.appendChild(h(this, i, Jt).call(this)), t.appendChild(h(this, i, Kt).call(this)), t.appendChild(h(this, i, Nt).call(this)), t;
}, Nt = function() {
  const t = h(this, i, f).call(this, "div", [
    "cp-color-model-wrapper"
  ]), e = h(this, i, f).call(this, "div", ["cp-color-model"]), r = h(this, i, f).call(this, "button", [
    "cp-color-model-switch"
  ]);
  return r.appendChild(
    h(this, i, ut).call(this, '<path d="m3.5045 11.431 1.5786-1.5786 3.0256 3.0256 3.0256-3.0256 1.5786 1.5786-4.6042 4.4726zm4.6042-11.313 4.6042 4.4726-1.5786 1.5786-3.0256-3.0256-3.0256 3.0256-1.5786-1.5786z"/>')
  ), t.appendChild(e), t.appendChild(r), r.addEventListener(
    "click",
    h(this, i, se).bind(this)
  ), s(this, c).inputsWrapper = e, t;
}, Pt = function() {
  const { inputsWrapper: t } = s(this, c);
  t.innerHTML = "", s(this, k) == l.HEX ? t.appendChild(h(this, i, Ft).call(this)) : t.appendChild(h(this, i, Ut).call(this));
}, Ft = function() {
  const t = h(this, i, f).call(this, "div", ["cp-hex-input"]), e = h(this, i, f).call(this, "input", ["cp-color-input"]), r = h(this, i, f).call(this, "label", ["cp-color-model-label"]);
  return e.setAttribute("type", "text"), r.textContent = "HEX", t.appendChild(e), t.appendChild(r), e.addEventListener("focus", h(this, i, nt).bind(this)), e.addEventListener("keydown", h(this, i, ae).bind(this)), e.addEventListener("input", h(this, i, oe).bind(this)), e.addEventListener("change", h(this, i, le).bind(this)), s(this, c).inputHEX = e, t;
}, Ut = function() {
  const t = h(this, i, f).call(this, "div", ["cp-input-wrapper"]), e = h(this, i, f).call(this, "input", ["cp-color-input"], {
    type: "text",
    inputmode: "numeric"
  }), r = h(this, i, f).call(this, "input", ["cp-color-input"], {
    type: "text",
    inputmode: "numeric"
  }), n = h(this, i, f).call(this, "input", ["cp-color-input"], {
    type: "text",
    inputmode: "numeric"
  }), a = h(this, i, f).call(this, "input", ["cp-color-input"], {
    type: "text",
    inputmode: "numeric"
  }), d = h(this, i, f).call(this, "label", ["cp-color-model-label"]), p = h(this, i, f).call(this, "label", ["cp-color-model-label"]), b = h(this, i, f).call(this, "label", ["cp-color-model-label"]), m = h(this, i, f).call(this, "label", ["cp-color-model-label"]), C = s(this, k).toUpperCase();
  return d.textContent = C[0], p.textContent = C[1], b.textContent = C[2], m.textContent = "A", t.appendChild(e), t.appendChild(r), t.appendChild(n), t.appendChild(a), t.appendChild(d), t.appendChild(p), t.appendChild(b), t.appendChild(m), e.addEventListener("focus", h(this, i, nt).bind(this)), e.addEventListener("keydown", h(this, i, de).bind(this)), e.addEventListener("input", h(this, i, ce).bind(this)), e.addEventListener("change", h(this, i, ue).bind(this)), r.addEventListener("focus", h(this, i, nt).bind(this)), r.addEventListener("keydown", h(this, i, pe).bind(this)), r.addEventListener("input", h(this, i, ge).bind(this)), r.addEventListener("change", h(this, i, be).bind(this)), n.addEventListener("focus", h(this, i, nt).bind(this)), n.addEventListener("keydown", h(this, i, ve).bind(this)), n.addEventListener("input", h(this, i, fe).bind(this)), n.addEventListener("change", h(this, i, me).bind(this)), a.addEventListener("keydown", h(this, i, he).bind(this)), a.addEventListener("input", h(this, i, ne).bind(this)), a.addEventListener("change", h(this, i, re).bind(this)), s(this, c).inputA = e, s(this, c).inputB = r, s(this, c).inputC = n, s(this, c).inputAlpha = a, t;
}, N = function() {
  const { opacitySlider: t, opacityThumb: e } = s(this, c);
  e.style.translate = `${s(this, o).a * t.offsetWidth}px`;
}, G = function() {
  const { hueThumb: t, hueSlider: e } = s(this, c);
  t.style.translate = `${s(this, o).hsv.h / 360 * e.offsetWidth}px`;
}, ct = function(t, e, r) {
  s(this, c).inputA.value = t, s(this, c).inputB.value = e, s(this, c).inputC.value = r, s(this, c).inputAlpha.value = parseFloat(s(this, o).a.toFixed(2));
}, yt = function() {
  s(this, c).inputHEX.value = s(this, o).hex;
}, st = function() {
  h(this, i, kt).call(this), h(this, i, y).call(this, !0);
}, Ht = function() {
  h(this, i, Pt).call(this), h(this, i, kt).call(this);
}, kt = function() {
  switch (s(this, k)) {
    case l.RGB:
      {
        const { r: t, g: e, b: r } = s(this, o).rgb = s(this, o).toRGB();
        h(this, i, ct).call(this, Math.round(t), Math.round(e), Math.round(r));
      }
      break;
    case l.HSV:
      {
        const { h: t, s: e, v: r } = s(this, o).hsv;
        h(this, i, ct).call(this, `${Math.round(t)}°`, `${Math.round(e)}%`, `${Math.round(r)}%`);
      }
      break;
    case l.HSL:
      {
        const { h: t, s: e, l: r } = s(this, o).hsl = s(this, o).toHSL();
        h(this, i, ct).call(this, `${Math.round(t)}°`, `${Math.round(e)}%`, `${Math.round(r)}%`);
      }
      break;
    case l.HEX:
      h(this, i, vt).call(this), h(this, i, yt).call(this);
      break;
  }
}, y = function(t) {
  const e = s(this, o).a, r = s(this, o).toHSL(), { palette: n, opacitySlider: a, colorPreview: d } = s(this, c), p = `hsl(${r.h}deg 100% 50% / 1)`;
  n.style.backgroundImage = `linear-gradient(180deg, transparent 0%, rgba(0,0,0,1) 100%), linear-gradient(90deg, rgba(255,255,255,1) 0%, ${p} 100%)`;
  const b = `hsl(${r.h}, ${r.s}%, ${r.l}%)`;
  a.style.setProperty(
    "background-image",
    `linear-gradient(90deg, transparent, ${b})`
  ), d.setAttribute("fill", b), d.setAttribute("fill-opacity", e), t == !0 && s(this, w).onInput(this);
}, E = function() {
  const { palette: t, cursor: e } = s(this, c), { s: r, v: n } = s(this, o).hsv;
  e.style.translate = `${r / 100 * t.offsetWidth}px ${t.offsetHeight - n / 100 * t.offsetHeight}px`;
}, zt = function() {
  const t = h(this, i, f).call(this, "button", ["cp-clipboard-color"]);
  return t.addEventListener("click", h(this, i, we).bind(this)), s(this, c).copyColor = t, h(this, i, St).call(this), t;
}, St = function() {
  const t = '<path d="m1.9695 11.037v-6.7c0-2 1.6-3.7 3.7-3.7h4.3c0.8 0 1.5 0.5 1.7 1.2h-5.6c-1.6 0.1-2.9 1.4-2.9 3.1v7.9c-0.7-0.3-1.2-1-1.2-1.8zm4.3 4.3c-1 0-1.8-0.8-1.8-1.8v-8.6c0-1 0.8-1.8 1.8-1.8h6.1c1 0 1.8 0.8 1.8 1.8v8.6c0 1-0.8 1.8-1.8 1.8zm6.7-1.8v-8.6c0-0.3-0.3-0.6-0.6-0.6h-6.1c-0.3 0-0.6 0.3-0.6 0.6v8.6c0 0.3 0.3 0.6 0.6 0.6h6.1c0.3 0 0.6-0.3 0.6-0.6z"/>';
  s(this, c).copyColor.innerHTML = "", s(this, c).copyColor.appendChild(h(this, i, ut).call(this, t));
}, qt = function() {
  const t = '<path d="m13.975 5.3001c0.24929-0.24929 0.16619-0.58168-0.0831-0.83097l-0.66477-0.66477c-0.24929-0.24929-0.58168-0.16619-0.83097 0.083097l-5.5675 6.2322-3.407-3.1577c-0.24929-0.24929-0.58168-0.16619-0.83097 0.083097l-0.66477 0.66477c-0.24929 0.24929-0.16619 0.58168 0.083097 0.83097l4.5703 4.1548c0.24929 0.24929 0.58168 0.16619 0.83097-0.0831z"/>';
  s(this, c).copyColor.innerHTML = "", s(this, c).copyColor.appendChild(h(this, i, ut).call(this, t));
}, ut = function(t) {
  const e = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  return e.setAttribute("viewBox", "0 0 16 16"), e.setAttribute("width", "16px"), e.setAttribute("height", "16px"), e.innerHTML = t, e;
}, Kt = function() {
  const t = h(this, i, f).call(this, "div", ["cp-sliders"]);
  return t.appendChild(h(this, i, jt).call(this)), t.appendChild(h(this, i, Qt).call(this)), t;
}, jt = function() {
  const t = h(this, i, f).call(this, "div", ["cp-hue-slider-wrapper"]), e = h(this, i, f).call(this, "div", ["cp-hue-slider"]), r = h(this, i, f).call(this, "a", ["cp-hue-slider-thumb"]);
  return r.setAttribute("tabindex", "0"), t.appendChild(e), t.appendChild(r), v(this, ot, h(this, i, ye).bind(this)), v(this, Q, h(this, i, He).bind(this)), v(this, F, h(this, i, ke).bind(this)), t.addEventListener(
    "pointerdown",
    s(this, ot)
  ), r.addEventListener(
    "keydown",
    h(this, i, Me).bind(this)
  ), s(this, c).hueSlider = e, s(this, c).hueThumb = r, t;
}, Qt = function() {
  const t = h(this, i, f).call(this, "div", [
    "cp-opacity-slider-wrapper"
  ]), e = h(this, i, f).call(this, "div", ["cp-opacity-color"]), r = h(this, i, f).call(this, "a", ["cp-opacity-slider-thumb"]);
  return r.setAttribute("tabindex", "0"), t.appendChild(e), t.appendChild(r), v(this, lt, h(this, i, Se).bind(this)), v(this, J, h(this, i, Ee).bind(this)), v(this, U, h(this, i, Ce).bind(this)), t.addEventListener(
    "pointerdown",
    s(this, lt)
  ), r.addEventListener(
    "keydown",
    h(this, i, Le).bind(this)
  ), s(this, c).opacitySlider = e, s(this, c).opacityThumb = r, t;
}, Jt = function() {
  const t = h(this, i, f).call(this, "span", [
    "cp-color-preview-wrapper"
  ]), e = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  e.setAttribute("width", 38), e.setAttribute("height", 38);
  const r = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  return r.setAttribute("cx", 19), r.setAttribute("cy", 19), r.setAttribute("r", 18), r.classList.add("cp-preview-stroke"), e.innerHTML = '<pattern id="transparent-grid" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse"><path fill="#DBDBDB" d="M0 0h3v3H0z"/><path fill="#fff" d="M3 0h3v3H3z"/><path fill="#DBDBDB" d="M3 3h3v3H3z"/><path fill="#fff" d="M0 3h3v3H0z"/></pattern></defs><circle cx="19" cy="19" r="18" fill="url(#transparent-grid)"/>', e.appendChild(r), t.appendChild(e), s(this, c).colorPreview = r, t;
}, f = function(t, e, r) {
  const n = document.createElement(t);
  if (e != null && n.classList.add(...e), r)
    for (const a in r)
      Object.prototype.hasOwnProperty.call(r, a) && n.setAttribute(a, r[a]);
  return n;
}, X = function() {
  h(this, i, y).call(this, !0), h(this, i, G).call(this), h(this, i, E).call(this);
}, L = function(t, e, r, n, a, d, p) {
  const { target: b } = e, { rgb: m, hex: C } = s(this, o);
  if (r(m[t], n)) {
    m[t] = a(m[t], 1), s(this, o).hex = C.substring(0, d) + l.hexPad2(Math.round(m[t])) + C.substring(p);
    const { r: O, g: ft, b: mt } = m;
    s(this, o).hsv = H.RGBtoHSV(O, ft, mt), h(this, i, X).call(this);
  }
  b.value = s(this, o).hex, b.setSelectionRange(d, p), e.preventDefault();
}, ht = function(t, e, r, n) {
  const { target: a } = t, { hex: d, a: p } = s(this, o);
  e(p, r) && (s(this, o).a = parseFloat(n(p, 0.01).toFixed(2)), a.value = s(this, o).hex = d.substring(0, 7) + l.hexPad2(Math.round(s(this, o).a * 255)), h(this, i, y).call(this, !0), h(this, i, N).call(this)), a.value = s(this, o).hex, a.setSelectionRange(7, 9), t.preventDefault();
}, pt = function(t) {
  s(this, o).a = parseFloat(t.toFixed(2)), s(this, k) == l.HEX ? (h(this, i, vt).call(this, this), h(this, i, yt).call(this)) : s(this, c).inputAlpha.value = s(this, o).a, h(this, i, y).call(this, !0);
}, Yt = function() {
  var t;
  if (s(this, w).target != null) {
    if (!h(t = l, u, Bt).call(t, s(this, w).target)) {
      this.close();
      return;
    }
    h(this, i, Lt).call(this, h(this, i, Mt).call(this));
  }
}, gt = function(t) {
  const e = document.getElementById(s(this, w).container);
  if (e == null)
    throw ReferenceError(
      "ColorPicker:: container to set color picker is undefined"
    );
  h(this, i, bt).call(this, this);
  const { overlayWrapper: r } = s(this, c), n = r.parentElement;
  e.appendChild(r), r.classList.remove(
    "cp-overlay-wrapper--light",
    "cp-overlay-wrapper--dark"
  ), r.classList.add("cp-overlay-wrapper--static"), r.classList.add("cp-overlay-wrapper--open"), r.classList.add("cp-overlay-wrapper--" + s(this, w).theme), h(this, i, dt).call(this), v(this, $, !0), t && n != r.parentElement && s(this, w).onContainerChange(this, n);
}, Et = function() {
  h(this, i, bt).call(this, this);
  const { overlayWrapper: t } = s(this, c), e = t.parentElement;
  document.body.appendChild(t), t.classList.remove(
    "cp-overlay-wrapper--light",
    "cp-overlay-wrapper--dark"
  ), t.classList.remove("cp-overlay-wrapper--static"), t.classList.add("cp-overlay-wrapper--open"), t.classList.add("cp-overlay-wrapper--" + s(this, w).theme), h(this, i, dt).call(this), h(this, i, Yt).call(this), window.addEventListener("resize", s(this, D)), window.addEventListener("scroll", s(this, D)), document.addEventListener("click", s(this, Y)), document.addEventListener("keyup", s(this, Z)), v(this, $, !0), e != t.parentElement && s(this, w).onContainerChange(this, e);
}, Zt = function() {
  s(this, c).overlayWrapper.classList.remove("cp-overlay-wrapper--open"), h(this, i, bt).call(this, this), v(this, $, !1);
}, _t = function(t) {
  t.stopPropagation(), s(this, $) ? this.close() : this.open();
}, te = function(t) {
  v(this, B, !0), document.addEventListener("pointermove", s(this, z)), document.addEventListener("pointerup", s(this, _)), s(this, z).call(this, t);
}, ee = function(t) {
  document.removeEventListener("pointermove", s(this, z)), document.removeEventListener("pointerup", s(this, _)), s(this, c).overlayWrapper.contains(t.target) && v(this, B, !1);
}, ie = function(t) {
  const { x: e, y: r } = h(this, i, Re).call(this, t.clientX, t.clientY);
  s(this, c).cursor.style.translate = `${e}px ${r}px`;
  const n = s(this, c).palette.offsetHeight, a = s(this, c).palette.offsetWidth;
  s(this, o).hsv.s = e / a * 100, s(this, o).hsv.v = (n - r) / n * 100, h(this, i, st).call(this);
}, se = function() {
  switch (s(this, k)) {
    case l.RGB:
      h(this, i, K).call(this, l.HSV);
      break;
    case l.HSV:
      h(this, i, K).call(this, l.HSL);
      break;
    case l.HSL:
      h(this, i, K).call(this, l.HEX);
      break;
    case l.HEX:
      h(this, i, K).call(this, l.RGB);
      break;
  }
}, nt = function() {
  switch (s(this, k)) {
    case l.RGB:
      s(this, o).rgb = this.getRGB();
      break;
    case l.HSV:
      s(this, o).hsv = this.getHSV();
      break;
    case l.HSL:
      s(this, o).hsl = this.getHSL();
      break;
    case l.HEX:
      h(this, i, vt).call(this);
      break;
  }
}, he = function(t) {
  const { target: e, key: r } = t, { a: n } = s(this, o);
  switch (r) {
    case "ArrowUp":
      if (n < 1) {
        let a = parseFloat((n + 0.01).toFixed(2));
        a > 1 && (a = 1), e.value = s(this, o).a = a, h(this, i, y).call(this, !0), h(this, i, N).call(this);
      }
      break;
    case "ArrowDown":
      if (n > 0) {
        let a = parseFloat((n - 0.01).toFixed(2));
        a < 0 && (a = 0), e.value = s(this, o).a = a, h(this, i, y).call(this, !0), h(this, i, N).call(this);
      }
      break;
    case ".":
      /(\.)/.test(e.value) && t.preventDefault();
      break;
  }
}, ne = function(t) {
  const { target: e } = t;
  if (/^(0(\.\d{1,2})?|(0*)1?)$/.test(e.value) || e.value == "") {
    const r = parseFloat(e.value) || 0;
    !isNaN(r) && r >= 0 && r <= 1 && (s(this, o).a = r, h(this, i, y).call(this, !0), h(this, i, N).call(this, this));
  }
}, re = function(t) {
  t.target.value = s(this, o).a;
}, ae = function(t) {
  const { target: e, key: r } = t;
  switch (r) {
    case "ArrowUp":
      {
        /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(
          e.value
        ) || (e.value = s(this, o).hex);
        const n = h(this, i, Ct).call(this, e), a = e.value.length;
        a <= 5 ? n < 2 ? h(this, i, L).call(this, "r", t, h(l, u, I), 255, h(l, u, V), 1, 3) : n < 3 ? h(this, i, L).call(this, "g", t, h(l, u, I), 255, h(l, u, V), 3, 5) : n <= 4 && a <= 4 || n < 4 ? h(this, i, L).call(this, "b", t, h(l, u, I), 255, h(l, u, V), 5, 7) : n <= 5 && h(this, i, ht).call(this, t, h(l, u, I), 1, h(l, u, V)) : n < 3 ? h(this, i, L).call(this, "r", t, h(l, u, I), 255, h(l, u, V), 1, 3) : n < 5 ? h(this, i, L).call(this, "g", t, h(l, u, I), 255, h(l, u, V), 3, 5) : n <= 7 && a == 7 || n < 7 ? h(this, i, L).call(this, "b", t, h(l, u, I), 255, h(l, u, V), 5, 7) : n <= 9 && h(this, i, ht).call(this, t, h(l, u, I), 1, h(l, u, V));
      }
      break;
    case "ArrowDown":
      {
        /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(
          e.value
        ) || (e.value = s(this, o).hex);
        const n = h(this, i, Ct).call(this, e), a = e.value.length;
        a <= 5 ? n < 2 ? h(this, i, L).call(this, "r", t, h(l, u, T), 0, h(l, u, W), 1, 3) : n < 3 ? h(this, i, L).call(this, "g", t, h(l, u, T), 0, h(l, u, W), 3, 5) : n <= 4 && a <= 4 || n < 4 ? h(this, i, L).call(this, "b", t, h(l, u, T), 0, h(l, u, W), 5, 7) : n <= 5 && h(this, i, ht).call(this, t, h(l, u, T), 0, h(l, u, W)) : n < 3 ? h(this, i, L).call(this, "r", t, h(l, u, T), 0, h(l, u, W), 1, 3) : n < 5 ? h(this, i, L).call(this, "g", t, h(l, u, T), 0, h(l, u, W), 3, 5) : n <= 7 && a == 7 || n < 7 ? h(this, i, L).call(this, "b", t, h(l, u, T), 0, h(l, u, W), 5, 7) : n <= 9 && h(this, i, ht).call(this, t, h(l, u, T), 0, h(l, u, W));
      }
      break;
  }
}, oe = function(t) {
  const e = H.HEXtoRGBA(t.target.value.trim());
  if (e != null) {
    const { r, g: n, b: a, a: d } = e;
    s(this, o).a = d, s(this, o).rgb = { r, g: n, b: a }, s(this, o).hex = H.RGBAtoHEX(r, n, a, d), s(this, o).hsv = H.RGBtoHSV(r, n, a), h(this, i, y).call(this, !0), h(this, i, G).call(this), h(this, i, N).call(this), h(this, i, E).call(this);
  }
}, le = function(t) {
  t.target.value = s(this, o).hex;
}, de = function(t) {
  const { target: e, key: r } = t;
  switch (r) {
    case "ArrowUp":
      switch (s(this, k)) {
        case l.RGB:
          {
            let { r: n, g: a, b: d } = s(this, o).rgb;
            n = Math.round(n), n < 255 && (s(this, o).rgb.r = e.value = ++n, s(this, o).hsv = H.RGBtoHSV(n, a, d), h(this, i, X).call(this));
          }
          break;
        case l.HSV:
        case l.HSL:
          {
            let { h: n } = s(this, o).hsv;
            n = Math.round(n), n < 360 && (e.value = ++n + "°", s(this, o).hsv.h = s(this, o).hsl.h = n, h(this, i, y).call(this, !0), h(this, i, G).call(this));
          }
          break;
      }
      break;
    case "ArrowDown":
      switch (s(this, k)) {
        case l.RGB:
          {
            let { r: n, g: a, b: d } = s(this, o).rgb;
            n = Math.round(n), n > 0 && (s(this, o).rgb.r = e.value = --n, s(this, o).hsv = H.RGBtoHSV(n, a, d), h(this, i, X).call(this));
          }
          break;
        case l.HSV:
        case l.HSL:
          {
            let { h: n } = s(this, o).hsv;
            n = Math.round(n), n > 0 && (e.value = --n + "°", s(this, o).hsv.h = s(this, o).hsl.h = n, h(this, i, y).call(this, !0), h(this, i, G).call(this));
          }
          break;
      }
      break;
  }
}, ce = function(t) {
  const e = parseInt(t.target.value || 0);
  if (/^(\d{1,3})(°?)$/.test(e))
    switch (s(this, k)) {
      case l.RGB:
        {
          const { g: r, b: n } = s(this, o).rgb;
          !isNaN(e) && e >= 0 && e <= 255 && (s(this, o).rgb.r = e, s(this, o).hsv = H.RGBtoHSV(e, r, n), h(this, i, y).call(this, !0), h(this, i, G).call(this), h(this, i, E).call(this));
        }
        break;
      case l.HSV:
      case l.HSL:
        !isNaN(e) && e >= 0 && e <= 360 && (s(this, o).hsv.h = s(this, o).hsl.h = e, h(this, i, y).call(this, !0), h(this, i, G).call(this));
        break;
    }
}, ue = function(t) {
  let e = t.target.value;
  switch (s(this, k)) {
    case l.RGB:
      e = Math.round(s(this, o).rgb.r);
      break;
    case l.HSV:
    case l.HSL:
      e = `${Math.round(s(this, o).hsv.h)}°`;
      break;
  }
  t.target.value = e;
}, pe = function(t) {
  const { target: e, key: r } = t;
  switch (r) {
    case "ArrowUp":
      switch (s(this, k)) {
        case l.RGB:
          {
            let { r: n, g: a, b: d } = s(this, o).rgb;
            a = Math.round(a), a < 255 && (s(this, o).rgb.g = e.value = ++a, s(this, o).hsv = H.RGBtoHSV(n, a, d), h(this, i, X).call(this));
          }
          break;
        case l.HSV:
          {
            let { s: n } = s(this, o).hsv;
            n = Math.round(n), n < 100 && (e.value = ++n + "%", s(this, o).hsv.s = n, h(this, i, y).call(this, !0), h(this, i, E).call(this));
          }
          break;
        case l.HSL:
          {
            const { h: n, s: a, l: d } = s(this, o).hsl;
            let p = Math.round(a);
            p < 100 && (e.value = ++p + "%", s(this, o).hsl.s = p, s(this, o).hsv.s = H.HSLtoHSV(n, p, d).s, h(this, i, y).call(this, !0), h(this, i, E).call(this));
          }
          break;
      }
      break;
    case "ArrowDown":
      switch (s(this, k)) {
        case l.RGB:
          {
            let { r: n, g: a, b: d } = s(this, o).rgb;
            a = Math.round(a), a > 0 && (s(this, o).rgb.g = e.value = --a, s(this, o).hsv = H.RGBtoHSV(n, a, d), h(this, i, X).call(this));
          }
          break;
        case l.HSV:
          {
            let { s: n } = s(this, o).hsv;
            n = Math.round(n), n > 0 && (e.value = --n + "%", s(this, o).hsv.s = n, h(this, i, y).call(this, !0), h(this, i, E).call(this));
          }
          break;
        case l.HSL:
          {
            const { h: n, s: a, l: d } = s(this, o).hsl;
            let p = Math.round(a);
            p > 0 && (e.value = --p + "%", s(this, o).hsl.s = p, s(this, o).hsv.s = H.HSLtoHSV(n, p, d).s, h(this, i, y).call(this, !0), h(this, i, E).call(this));
          }
          break;
      }
      break;
  }
}, ge = function(t) {
  const e = parseInt(t.target.value || 0);
  if (/^(\d{1,3})(%?)$/.test(e))
    switch (s(this, k)) {
      case l.RGB:
        {
          const { r, b: n } = s(this, o).rgb;
          !isNaN(e) && e >= 0 && e <= 255 && (s(this, o).rgb.g = e, s(this, o).hsv = H.RGBtoHSV(r, e, n), h(this, i, y).call(this, !0), h(this, i, G).call(this), h(this, i, E).call(this));
        }
        break;
      case l.HSV:
        !isNaN(e) && e >= 0 && e <= 100 && (s(this, o).hsv.s = e, h(this, i, y).call(this, !0), h(this, i, E).call(this));
        break;
      case l.HSL:
        {
          const { h: r, l: n } = s(this, o).hsl;
          !isNaN(e) && e >= 0 && e <= 100 && (s(this, o).hsl.s = e, s(this, o).hsv = H.HSLtoHSV(r, e, n), h(this, i, y).call(this, !0), h(this, i, E).call(this));
        }
        break;
    }
}, be = function(t) {
  let e = t.target.value;
  switch (s(this, k)) {
    case l.RGB:
      e = Math.round(s(this, o).rgb.g);
      break;
    case l.HSV:
      e = `${Math.round(s(this, o).hsv.s)}%`;
      break;
    case l.HSL:
      e = `${Math.round(s(this, o).hsl.s)}%`;
      break;
  }
  t.target.value = e;
}, ve = function(t) {
  const { target: e, key: r } = t;
  switch (r) {
    case "ArrowUp":
      switch (s(this, k)) {
        case l.RGB:
          {
            let { r: n, g: a, b: d } = s(this, o).rgb;
            d = Math.round(d), d < 255 && (s(this, o).rgb.b = e.value = ++d, s(this, o).hsv = H.RGBtoHSV(n, a, d), h(this, i, X).call(this));
          }
          break;
        case l.HSV:
          {
            let { v: n } = s(this, o).hsv;
            n = Math.round(n), n < 100 && (e.value = ++n + "%", s(this, o).hsv.v = n, h(this, i, y).call(this, !0), h(this, i, E).call(this));
          }
          break;
        case l.HSL:
          {
            const { h: n, s: a, l: d } = s(this, o).hsl;
            let p = Math.round(d);
            p < 100 && (e.value = ++p + "%", s(this, o).hsl.l = p, s(this, o).hsv.v = H.HSLtoHSV(n, a, p).v, h(this, i, y).call(this, !0), h(this, i, E).call(this));
          }
          break;
      }
      break;
    case "ArrowDown":
      switch (s(this, k)) {
        case l.RGB:
          {
            let { r: n, g: a, b: d } = s(this, o).rgb;
            d = Math.round(d), d > 0 && (s(this, o).rgb.b = e.value = --d, s(this, o).hsv = H.RGBtoHSV(n, a, d), h(this, i, X).call(this));
          }
          break;
        case l.HSV:
          {
            let { v: n } = s(this, o).hsv;
            n = Math.round(n), n > 0 && (e.value = --n + "%", s(this, o).hsv.v = n, h(this, i, y).call(this, !0), h(this, i, E).call(this));
          }
          break;
        case l.HSL:
          {
            const { h: n, s: a, l: d } = s(this, o).hsl;
            let p = Math.round(d);
            d > 0 && (e.value = --p + "%", s(this, o).hsl.l = p, s(this, o).hsv.v = H.HSLtoHSV(n, a, p).v, h(this, i, y).call(this, !0), h(this, i, E).call(this));
          }
          break;
      }
      break;
  }
}, fe = function(t) {
  const e = parseInt(t.target.value || 0);
  if (/^(\d{1,3})(%?)$/.test(e))
    switch (s(this, k)) {
      case l.RGB:
        {
          const { r, g: n } = s(this, o).rgb;
          !isNaN(e) && e >= 0 && e <= 255 && (s(this, o).rgb.b = e, s(this, o).hsv = H.RGBtoHSV(r, n, e), h(this, i, y).call(this, !0), h(this, i, G).call(this), h(this, i, E).call(this));
        }
        break;
      case l.HSV:
        !isNaN(e) && e >= 0 && e <= 100 && (s(this, o).hsv.v = e, h(this, i, y).call(this, !0), h(this, i, E).call(this));
        break;
      case l.HSL:
        {
          const { h: r, s: n } = s(this, o).hsl;
          !isNaN(e) && e >= 0 && e <= 100 && (s(this, o).hsl.l = e, s(this, o).hsv = H.HSLtoHSV(r, n, e), h(this, i, y).call(this, !0), h(this, i, E).call(this));
        }
        break;
    }
}, me = function(t) {
  let e = t.target.value;
  switch (s(this, k)) {
    case l.RGB:
      e = Math.round(s(this, o).rgb.b);
      break;
    case l.HSV:
      e = `${Math.round(s(this, o).hsv.v)}%`;
      break;
    case l.HSL:
      e = `${Math.round(s(this, o).hsl.l)}%`;
      break;
  }
  t.target.value = e;
}, we = function() {
  s(this, q) && clearTimeout(s(this, q));
  const t = document.createElement("input");
  t.style.position = "absolute", t.style.left = "-99999px", t.style.top = "-99999px", t.value = h(this, i, Ae).call(this), document.body.appendChild(t), t.select();
  try {
    document.execCommand("copy"), h(this, i, qt).call(this), s(this, c).copyColor.focus(), s(this, w).onCopy(this), v(this, q, setTimeout(() => {
      h(this, i, St).call(this), v(this, q, null);
    }, 600));
  } catch (e) {
    throw document.body.removeChild(t), new Error("YKColorPicker:: Failed to copy color.", {
      cause: e
    });
  }
}, ye = function(t) {
  t.preventDefault(), v(this, B, !0), document.addEventListener("pointermove", s(this, F)), document.addEventListener("pointerup", s(this, Q)), s(this, c).hueThumb.focus(), s(this, F).call(this, t);
}, He = function(t) {
  document.removeEventListener("pointermove", s(this, F)), document.removeEventListener("pointerup", s(this, Q)), s(this, c).overlayWrapper.contains(t.target) && v(this, B, !1);
}, ke = function(t) {
  const { hueSlider: e, hueThumb: r } = s(this, c), n = e.getBoundingClientRect(), a = n.width;
  let d = t.clientX - n.left;
  d < 0 && (d = 0), d > a && (d = a), s(this, o).hsv.h = d / n.width * 360, r.style.translate = `${d}px`, h(this, i, st).call(this);
}, Se = function(t) {
  t.preventDefault(), v(this, B, !0), document.addEventListener(
    "pointermove",
    s(this, U)
  ), document.addEventListener("pointerup", s(this, J)), s(this, c).opacityThumb.focus(), s(this, U).call(this, t);
}, Ee = function(t) {
  document.removeEventListener(
    "pointermove",
    s(this, U)
  ), document.removeEventListener("pointerup", s(this, J)), s(this, c).overlayWrapper.contains(t.target) && v(this, B, !1);
}, Ce = function(t) {
  const { opacitySlider: e, opacityThumb: r } = s(this, c), n = e.getBoundingClientRect(), a = n.width;
  let d = t.clientX - n.left;
  r.focus(), d < 0 && (d = 0), d > a && (d = a), r.style.translate = `${d}px`, h(this, i, pt).call(this, d / a);
}, Me = function(t) {
  const { key: e } = t;
  switch (e) {
    case "ArrowUp":
    case "ArrowRight":
      {
        const { hueThumb: r, hueSlider: n } = s(this, c);
        let a = parseInt(r.style.translate);
        !isNaN(a) && a < n.offsetWidth && (r.style.translate = `${++a}px`, s(this, o).hsv.h = a / n.offsetWidth * 360, h(this, i, st).call(this)), t.preventDefault();
      }
      break;
    case "ArrowDown":
    case "ArrowLeft":
      {
        const { hueThumb: r, hueSlider: n } = s(this, c);
        let a = parseInt(r.style.translate);
        !isNaN(a) && a > 0 && (r.style.translate = `${--a}px`, s(this, o).hsv.h = a / n.offsetWidth * 360, h(this, i, st).call(this)), t.preventDefault();
      }
      break;
  }
}, Le = function(t) {
  const { key: e } = t;
  switch (e) {
    case "ArrowUp":
    case "ArrowRight":
      {
        const { opacityThumb: r, opacitySlider: n } = s(this, c);
        let a = parseInt(r.style.translate);
        !isNaN(a) && a < n.offsetWidth && (r.style.translate = `${++a}px`, h(this, i, pt).call(this, a / n.offsetWidth)), t.preventDefault();
      }
      break;
    case "ArrowDown":
    case "ArrowLeft":
      {
        const { opacityThumb: r, opacitySlider: n } = s(this, c);
        let a = parseInt(r.style.translate);
        !isNaN(a) && a > 0 && (r.style.translate = `${--a}px`, h(this, i, pt).call(this, a / n.offsetWidth)), t.preventDefault();
      }
      break;
  }
}, Be = function(t) {
  if (t.key == "Enter" && s(this, $)) {
    this.close();
    return;
  }
  t.key == "Escape" && (this._prevColor != this.getHEX() && (this.setColor(this._prevColor), h(this, i, dt).call(this), s(this, w).onInput(this)), this.close());
}, xe = function(t) {
  var d;
  const { type: e } = t, { target: r, closeOnScroll: n, closeOnResize: a } = s(this, w);
  if (e == "scroll" && n || e == "resize" && a)
    this.close();
  else {
    if (r == null)
      return;
    if (!h(d = l, u, Bt).call(d, s(this, w).target)) {
      this.close();
      return;
    }
    h(this, i, Lt).call(this, h(this, i, Mt).call(this));
  }
}, bt = function() {
  window.removeEventListener("resize", s(this, D)), window.removeEventListener("scroll", s(this, D)), document.removeEventListener("keyup", s(this, Z)), document.removeEventListener("click", s(this, Y));
}, Re = function(t, e) {
  const r = s(this, c).palette.getBoundingClientRect();
  let n = t - r.left, a = e - r.top;
  return n < 0 ? n = 0 : n > r.width && (n = r.width), a < 0 ? a = 0 : a > r.height && (a = r.height), {
    x: n,
    y: a
  };
}, vt = function() {
  const { r: t, g: e, b: r } = s(this, o).rgb = s(this, o).toRGB();
  s(this, o).hex = H.RGBAtoHEX(t, e, r, s(this, o).a);
}, Ae = function() {
  switch (s(this, k)) {
    case l.RGB:
      const { r: t, g: e, b: r } = s(this, o).rgb;
      return `rgba(${Math.round(t)}, ${Math.round(e)}, ${Math.round(r)}, ${s(this, o).a})`;
    case l.HSV: {
      const { h: n, s: a, v: d } = s(this, o).hsv;
      return `hsva(${Math.round(n)}, ${Math.round(a)}%, ${Math.round(d)}%, ${s(this, o).a})`;
    }
    case l.HSL: {
      const { h: n, s: a, l: d } = s(this, o).hsl;
      return `hsla(${Math.round(n)}, ${Math.round(a)}%, ${Math.round(d)}%, ${s(this, o).a})`;
    }
    case l.HEX:
      return this.getHEX();
  }
}, Ct = function(t) {
  let e = t.selectionStart;
  const r = t.value.length;
  return e > r && (e = r), e;
}, Mt = function() {
  var Gt, $t, It, Tt;
  const { target: t, position: e, positionFallback: r } = s(this, w), n = t.getBoundingClientRect(), a = s(this, c).overlayWrapper.getBoundingClientRect(), d = document.documentElement.scrollTop, p = document.documentElement.scrollLeft, b = 6;
  let m = e;
  const C = h(Gt = l, u, rt).call(Gt, () => d + n.top, () => n.top, a.height + b), O = h($t = l, u, rt).call($t, () => {
    var M;
    return h(M = l, u, Ge).call(M) - (d + n.top + n.height);
  }, () => window.innerHeight - (n.top + n.height), a.height + b), ft = h(It = l, u, rt).call(It, () => p + n.left, () => n.left, a.width + b), mt = h(Tt = l, u, rt).call(Tt, () => {
    var M;
    return h(M = l, u, $e).call(M) - (p + n.left + n.width);
  }, () => window.innerWidth - (n.left + n.width), a.width + b), Ie = {
    t: C,
    b: O,
    l: ft,
    r: mt
  };
  let tt = "";
  for (let M = 0; M < r.length; M++)
    tt += r[M] + Ie[r[M]];
  let et = "", it = "";
  for (let M = 1; M < tt.length; M += 2) {
    const Vt = tt[M];
    Vt == 2 && (et = et + tt[M - 1]), Vt == 1 && (it = it + tt[M - 1]);
  }
  et != "" ? et.includes(m) == !1 && (m = et[0]) : it != "" ? it.includes(m) == !1 && (m = it[0]) : m = l.BOTTOM;
  let x = 0, R = 0;
  switch (m) {
    case l.TOP:
      R = n.top - a.height - b, x = n.left + n.width / 2 - a.width / 2;
      break;
    case l.BOTTOM:
      R = n.top + n.height + b, x = n.left + n.width / 2 - a.width / 2;
      break;
    case l.LEFT:
      R = n.top + n.height / 2 - a.height / 2, x = n.left - a.width - b;
      break;
    case l.RIGHT:
      R = n.top + n.height / 2 - a.height / 2, x = n.left + n.width + b;
      break;
  }
  const Rt = window.innerWidth - document.documentElement.clientWidth, At = window.innerHeight - document.documentElement.clientHeight;
  return window.innerWidth - Rt < x + a.width && (x -= x + a.width - window.innerWidth + Rt), window.innerHeight - At < R + a.height && (R -= R + a.height - window.innerHeight + At), x = Math.max(x, 0), R = Math.max(R, 0), {
    x,
    y: R
  };
}, Lt = function(t) {
  const { x: e, y: r } = t;
  s(this, c).overlayWrapper.style.top = `${r}px`, s(this, c).overlayWrapper.style.left = `${e}px`;
}, K = function(t) {
  v(this, k, t), h(this, i, Ht).call(this), s(this, w).onRepresentationChange(this);
}, u = new WeakSet(), Bt = function(t) {
  if (t) {
    const e = t.getBoundingClientRect();
    return e.top >= 0 && e.left >= 0 && e.bottom <= (window.innerHeight || document.documentElement.clientHeight) && e.right <= (window.innerWidth || document.documentElement.clientWidth);
  }
}, Ge = function() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );
}, $e = function() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.body.clientWidth,
    document.documentElement.clientWidth
  );
}, rt = function(t, e, r) {
  return t() >= r ? e() >= r ? 2 : 1 : 0;
}, xt = function(t, e) {
  e == null && (e = {});
  const r = {}, n = Object.keys(t);
  for (let a = 0; a < n.length; a++) {
    const d = n[a];
    e.hasOwnProperty(d) == !0 ? r[d] = e[d] : r[d] = t[d];
  }
  return r;
}, I = function(t, e) {
  return t < e;
}, T = function(t, e) {
  return t > e;
}, V = function(t, e) {
  return t + e;
}, W = function(t, e) {
  return t - e;
}, S(l, u), A(l, "TOP", "t"), A(l, "BOTTOM", "b"), A(l, "LEFT", "l"), A(l, "RIGHT", "r"), A(l, "RGB", "rgb"), A(l, "HSV", "hsv"), A(l, "HSL", "hsl"), A(l, "HEX", "hex"), A(l, "DEFAULT_OPTIONS", Object.freeze({
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
let j = l;
export {
  j as default
};
