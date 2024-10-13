import { hexPad2 } from "./utility";

/**
 * Color Parser
 */
export const YKColorParser = Object.freeze({
  parse: function (color) {
    if (color == undefined) {
      throw new Error("YKColorParser:: color is undefined");
    }

    if (typeof color == "string" || color instanceof String) {
      color = color.trim();

      if (/^(rgba?)/i.test(color)) {
        return this.compileRGB(color);
      }
      if (/^(#)/i.test(color)) {
        return this.compileHEX(color);
      }
      let rgb = this.NAMED_COLORS[color.toLowerCase()];
      if (rgb != undefined) {
        rgb = rgb.split(" ");
        const { h, s, v } = YKColorParser.RGBtoHSV(rgb[0], rgb[1], rgb[2]);
        return { h, s, v, a: 1 };
      }
    } else {
      const { r, g, b, a } = color;
      if (
        r >= 0 &&
        r <= 255 &&
        g >= 0 &&
        g <= 255 &&
        b >= 0 &&
        b <= 255 &&
        a >= 0 &&
        a <= 1
      ) {
        const { h, s, v } = YKColorParser.RGBtoHSV(r, g, b);
        return { h, s, v, a };
      }
      throw new Error(
        "YKColorParser:: The provided RGB object has invalid values, please make sure red, green, blue are between 0 and 255 and alpha value is between 0 and 1"
      );
    }

    throw new Error(
      "YKColorParser:: Color is not in RGB or HEX format or a named color"
    );
  },

  compileRGB: function (color) {
    let r, g, b, a;

    const regexRGB =
      /rgba?\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(\s+(0?(\.\d+)?|1(\.0*)?)\s*)?\)/i;

    if (regexRGB.test(color)) {
      const splitColor = color
        .split(regexRGB)
        .filter((i) => !isNaN(i) && i != "" && i != null);
      r = parseInt(splitColor[0]);
      g = parseInt(splitColor[1]);
      b = parseInt(splitColor[2]);
      a = parseFloat(splitColor[3]);

      if (r > 255) {
        throw new RangeError(
          `YKColorParser:: '${color}' --> ${r} has an invalid red color, it must be an interger between 0 and 255`
        );
      }
      if (g > 255) {
        throw new RangeError(
          `YKColorParser:: '${color}' --> ${g} has an invalid green color, it must be an interger between 0 and 255`
        );
      }
      if (b > 255) {
        throw new RangeError(
          `YKColorParser:: '${color}' --> ${b} has an invalid blue color, it must be an interger between 0 and 255`
        );
      }

      const { h, s, v } = YKColorParser.RGBtoHSV(r, g, b);
      return { h, s, v, a: isNaN(a) ? 1 : a };
    }

    throw new SyntaxError(
      `YKColorParser:: '${color}' is an invalid RGB format`
    );
  },

  compileHEX: function (color) {
    const rgb = YKColorParser.HEXtoRGBA(color);
    if (rgb) {
      const { r, g, b, a } = rgb;
      const { h, s, v } = YKColorParser.RGBtoHSV(r, g, b);
      return { h, s, v, a };
    }
    throw new Error(`YKColorParser:: '${color}' is an invalid HEX format`);
  },

  RGBtoHSV: function (r, g, b) {
    (r /= 255), (g /= 255), (b /= 255);

    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      v = max;

    let d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    h = h * 360;
    s = s * 100;
    v = v * 100;

    return { h, s, v };
  },

  HSLtoHSV: function (h, s, l) {
    const hsv1 = (s * (l < 50 ? l : 100 - l)) / 100;

    return {
      h,
      s: hsv1 === 0 ? 0 : ((2 * hsv1) / (l + hsv1)) * 100,
      v: l + hsv1,
    };
  },

  HEXtoRGBA: function (hex) {
    let r = 0,
      g = 0,
      b = 0,
      a = 0;

    if (/^#(([a-f0-9]){3,4}|([a-f0-9]){6}|([a-f0-9]){8})$/i.test(hex)) {
      if (hex.length < 6) {
        const splitHexValues = hex.split("");
        r = +("0x" + splitHexValues[1] + splitHexValues[1]);
        g = +("0x" + splitHexValues[2] + splitHexValues[2]);
        b = +("0x" + splitHexValues[3] + splitHexValues[3]);
        a = splitHexValues[4]
          ? parseFloat(
              (+("0x" + splitHexValues[4] + splitHexValues[4]) / 255).toFixed(2)
            )
          : 1;
      } else if (hex.length < 10) {
        const splitHexValues = hex.split(/([a-f0-9]{2})/i);
        r = +("0x" + splitHexValues[1]);
        g = +("0x" + splitHexValues[3]);
        b = +("0x" + splitHexValues[5]);
        a = splitHexValues[7]
          ? parseFloat((+("0x" + splitHexValues[7]) / 255).toFixed(2))
          : 1;
      }

      return { r, g, b, a };
    }
  },

  RGBAtoHEX: function (r, g, b, a) {
    r = hexPad2(Math.round(r));
    g = hexPad2(Math.round(g));
    b = hexPad2(Math.round(b));
    a = a == 1 ? "" : hexPad2(Math.round(a * 255));

    return "#" + r + g + b + a;
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
    yellowgreen: "154 205 50",
  }),
});
