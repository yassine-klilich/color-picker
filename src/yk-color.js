import { YKColorParser } from "./yk-color-parser";

/**
 * Color
 */
export class YKColor {
  constructor(h, s, v, a) {
    this.a = a;
    this.hsv = { h, s, v };
    this.rgb = this.toRGB();
    this.hsl = this.toHSL();
    this.hex = this.toHEX();
  }

  toRGB() {
    let { h, s, v } = this.hsv;

    h /= 360;
    s /= 100;
    v /= 100;

    var r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  toHSL() {
    let { h, s, v } = this.hsv;
    let _saturation = s * 0.01;
    let _value = v * 0.01;

    let _lightness = _value - (_value * _saturation) / 2;
    let _saturate = NaN;

    if (_lightness == 0 || _lightness == 1) {
      _saturate = 0;
    } else {
      _saturate =
        ((_value - _lightness) / Math.min(_lightness, 1 - _lightness)) * 100;
    }

    let l = _lightness * 100;
    s = _saturate;

    return {
      h,
      s: s,
      l: l,
    };
  }

  toHEX() {
    let { r, g, b } = this.toRGB();
    return YKColorParser.RGBAtoHEX(r, g, b, this.a);
  }
}
