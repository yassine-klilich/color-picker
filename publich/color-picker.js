/**
 * Color
 */
class YKColor {
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
      r: r * 255,
      g: g * 255,
      b: b * 255,
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
    return YKColor.RGBAtoHEX(r, g, b, this.a);
  }

  static RGBtoHSV(r, g, b) {
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
  }

  static HSLtoHSV(h, s, l) {
    const hsv1 = (s * (l < 50 ? l : 100 - l)) / 100;

    return {
      h,
      s: hsv1 === 0 ? 0 : ((2 * hsv1) / (l + hsv1)) * 100,
      v: l + hsv1,
    };
  }

  static HEXtoRGBA(hex) {
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
  }

  static RGBAtoHEX(r, g, b, a) {
    r = YKColorPicker.hexPad2(Math.round(r));
    g = YKColorPicker.hexPad2(Math.round(g));
    b = YKColorPicker.hexPad2(Math.round(b));
    a = a == 1 ? "" : YKColorPicker.hexPad2(Math.round(a * 255));

    return "#" + r + g + b + a;
  }
}

/**
 * Color Parser
 */
const YKColorParser = Object.freeze({
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
        const { h, s, v } = YKColor.RGBtoHSV(rgb[0], rgb[1], rgb[2]);
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
        const { h, s, v } = YKColor.RGBtoHSV(r, g, b);
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

      const { h, s, v } = YKColor.RGBtoHSV(r, g, b);
      return { h, s, v, a: isNaN(a) ? 1 : a };
    }

    throw new SyntaxError(
      `YKColorParser:: '${color}' is an invalid RGB format`
    );
  },

  compileHEX: function (color) {
    const rgb = YKColor.HEXtoRGBA(color);
    if (rgb) {
      const { r, g, b, a } = rgb;
      const { h, s, v } = YKColor.RGBtoHSV(r, g, b);
      return { h, s, v, a };
    }
    throw new Error(`YKColorParser:: '${color}' is an invalid HEX format`);
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

/**
 * Color Picker
 */
class YKColorPicker {
  #isOpen = false;
  #options = YKColorPicker.DEFAULT_OPTIONS;
  #color = null;
  #dom = {};
  #currentRepresentation;
  #dc;
  #onClickTargetBind;
  #onMouseDownCursorBind;
  #onMouseUpHueSliderBind;
  #onMouseMoveHueSliderBind;
  #onMouseDownHueSliderBind;
  #onMouseDownOpacitySliderBind;
  #onMouseUpOpacitySliderBind;
  #onMouseMoveOpacitySliderBind;
  #onResizeScrollWindowBind;
  #onClickCloseBind;
  #onKeyUpCloseBind;
  #onMouseMoveCursorBind;
  #onMouseUpCursorBind;
  #copyTimeout = null;

  static TOP = "t";
  static BOTTOM = "b";
  static LEFT = "l";
  static RIGHT = "r";

  static RGB = "rgb";
  static HSV = "hsv";
  static HSL = "hsl";
  static HEX = "hex";

  static DEFAULT_OPTIONS = Object.freeze({
    target: null,
    container: null,
    position: YKColorPicker.BOTTOM,
    positionFlipOrder: "btrl",
    representation: YKColorPicker.RGB,
    color: "red",
    closeOnScroll: true,
    closeOnResize: false,
    escapeKey: true,
    theme: "light",
    onInit: () => {},
    onOpen: () => {},
    onClose: () => {},
    onInput: () => {},
    onChange: () => {},
    onCopy: () => {},
    onRepresentationChange: () => {},
    onContainerChange: () => {},
  });

  constructor(options) {
    this.#options = YKColorPicker.#buildOptions(
      YKColorPicker.DEFAULT_OPTIONS,
      options
    );

    const { target, representation } = this.#options;

    this.#dom["target"] = target;
    this.#currentRepresentation = representation;

    // init click and enter key to target
    if (target) {
      this.#onClickTargetBind = this.#onClickTarget.bind(this);
      target.addEventListener("click", this.#onClickTargetBind);
    }

    this.setColor(this.#options.color);
    this._prevColor = this.getHEX();
    this.#initDOM();
  }

  isOpen() {
    return this.#isOpen;
  }

  open() {
    this._prevColor = this.getHEX();
    if (this.#options.container) {
      this.#attachToContainer(true);
    } else {
      this.#attachToBody();
    }
    this.#options.onOpen(this);
  }

  close() {
    if (!this.#dc) {
      if (this._prevColor != this.getHEX()) {
        this.#options.onChange(this);
      }
      this.#detachOverlay();
      this.#options.onClose(this);
    }
    this.#dc = false;
  }

  getRGB() {
    return { ...this.#color.toRGB(), a: this.#color.a };
  }

  getHSV() {
    const { h, s, v } = this.#color.hsv;
    return {
      h: Math.round(h),
      s: Math.round(s),
      v: Math.round(v),
      a: this.#color.a,
    };
  }

  getHSL() {
    const { h, s, l } = this.#color.toHSL();
    return {
      h: Math.round(h),
      s: Math.round(s),
      l: Math.round(l),
      a: this.#color.a,
    };
  }

  getHEX() {
    return this.#color.toHEX();
  }

  updateOptions(options) {
    const _options = YKColorPicker.#buildOptions(this.#options, options);
    this.#options = _options;
    const { target, representation } = this.#options;

    // update representation
    if (this.#currentRepresentation != representation) {
      this.#updateRepresentation(representation);
    }

    // update target
    if (this.#dom.target != target) {
      if (this.#dom.target != null) {
        this.#dom.target.removeEventListener("click", this.#onClickTargetBind);
      }
      this.#dom.target = target;
      if (this.#dom.target != null) {
        this.#dom.target.addEventListener("click", this.#onClickTargetBind);
      }
    }

    if (this.#isOpen) {
      if (this.#options.container) {
        this.#attachToContainer(true);
      } else {
        this.#attachToBody();
      }
    }
  }

  getColor() {
    switch (this.#currentRepresentation) {
      case YKColorPicker.RGB: {
        const { r, g, b } = this.#color.rgb;
        return {
          r: Math.round(r),
          g: Math.round(g),
          b: Math.round(b),
          a: this.#color.a,
        };
      }

      case YKColorPicker.HSV: {
        const { h, s, v } = this.#color.hsv;
        return {
          h: Math.round(h),
          s: Math.round(s),
          l: Math.round(v),
          a: this.#color.a,
        };
      }

      case YKColorPicker.HSL: {
        const { h, s, l } = this.#color.hsl;
        return {
          h: Math.round(h),
          s: Math.round(s),
          l: Math.round(l),
          a: this.#color.a,
        };
      }

      case YKColorPicker.HEX:
        return this.getHEX();
    }
  }

  setColor(value) {
    const { h, s, v, a } = YKColorParser.parse(value);
    this.#color = new YKColor(h, s, v, a);
  }

  #initDOM() {
    // #dom declaration
    const cp_overlayWrapper = this.#createElement("div", [
      "cp-overlay-wrapper",
    ]);
    const cp_Wrapper = this.#createElement("div", ["cp-wrapper"]);

    // Append child nodes
    cp_overlayWrapper.appendChild(cp_Wrapper);
    // build palette
    cp_Wrapper.appendChild(this.#buildPaletteColor());
    // build color settings
    cp_Wrapper.appendChild(this.#buildColorSettings());

    cp_overlayWrapper.addEventListener("click", (event) =>
      event.stopPropagation()
    );
    this.#dom["overlayWrapper"] = cp_overlayWrapper;

    this.#onKeyUpCloseBind = this.#onKeyUpClose.bind(this);
    this.#onResizeScrollWindowBind = this.#onResizeScrollWindow.bind(this);
    this.#onClickCloseBind = this.close.bind(this);

    if (this.#options.container) {
      this.#attachToContainer(false);
    } else {
      document.body.appendChild(this.#dom.overlayWrapper);
    }

    this.#options.onInit(this);
  }

  #updateGUI() {
    this.#updateCursorThumb();
    this.#updateInputs();
    this.#updateColorPreview(false);
    this.#updateHueThumb();
    this.#updateOpacityThumb();
  }

  #buildPaletteColor() {
    const paletteWrapper = this.#createElement("div", ["cp-palette-wrapper"]);
    const palette = this.#createElement("div", ["cp-palette"]);
    const cursor = this.#createElement("div", ["cp-cursor"]);

    paletteWrapper.appendChild(palette);
    paletteWrapper.appendChild(cursor);

    // Append event
    this.#onMouseDownCursorBind = this.#onMouseDownCursor.bind(this);
    this.#onMouseUpCursorBind = this.#onMouseUpCursor.bind(this);
    this.#onMouseMoveCursorBind = this.#onMouseMoveCursor.bind(this);
    paletteWrapper.addEventListener("mousedown", this.#onMouseDownCursorBind);

    this.#dom["palette"] = palette;
    this.#dom["cursor"] = cursor;

    return paletteWrapper;
  }

  #buildColorSettings() {
    const colorSettings = this.#createElement("div", ["cp-color-settings"]);

    // Build color color
    colorSettings.appendChild(this.#buildCopyColor());
    // Build color preview
    colorSettings.appendChild(this.#buildColorPreview());
    // Build sliders
    colorSettings.appendChild(this.#buildColorSliders());
    // Build inputs
    colorSettings.appendChild(this.#buildColorInputs());

    return colorSettings;
  }

  #buildColorInputs() {
    // Create elements
    const inputsSettings = this.#createElement("div", [
      "cp-color-model-wrapper",
    ]);
    const inputsWrapper = this.#createElement("div", ["cp-color-model"]);
    const inputsSwitch = this.#createElement("button", [
      "cp-color-model-switch",
    ]);
    inputsSwitch.appendChild(
      this.#createSVGIcon(
        `<path d="m3.5045 11.431 1.5786-1.5786 3.0256 3.0256 3.0256-3.0256 1.5786 1.5786-4.6042 4.4726zm4.6042-11.313 4.6042 4.4726-1.5786 1.5786-3.0256-3.0256-3.0256 3.0256-1.5786-1.5786z"/>`
      )
    );

    // Append elements
    inputsSettings.appendChild(inputsWrapper);
    inputsSettings.appendChild(inputsSwitch);

    // Attach Events
    inputsSwitch.addEventListener(
      "click",
      this.#onClickInputsSwitch.bind(this)
    );

    this.#dom["inputsWrapper"] = inputsWrapper;

    return inputsSettings;
  }

  #buildInput() {
    const { inputsWrapper } = this.#dom;
    inputsWrapper.innerHTML = "";
    if (this.#currentRepresentation == YKColorPicker.HEX) {
      inputsWrapper.appendChild(this.#buildHEXInput());
    } else {
      inputsWrapper.appendChild(this.#buildQuadrupedInput());
    }
  }

  #buildHEXInput() {
    const inputWrapper = this.#createElement("div", ["cp-hex-input"]);
    const inputHEX = this.#createElement("input", ["cp-color-input"]);
    const labelHEX = this.#createElement("label", ["cp-color-model-label"]);
    inputHEX.setAttribute("type", "text");
    labelHEX.textContent = "HEX";
    inputWrapper.appendChild(inputHEX);
    inputWrapper.appendChild(labelHEX);

    inputHEX.addEventListener("focus", this.#onFocusInput.bind(this));
    inputHEX.addEventListener("keydown", this.#onKeyDownInputHEX.bind(this));
    inputHEX.addEventListener("input", this.#onInputHEX.bind(this));
    inputHEX.addEventListener("change", this.#onChangeInputHEX.bind(this));

    this.#dom["inputHEX"] = inputHEX;

    return inputWrapper;
  }

  #buildQuadrupedInput() {
    // Create #dom elements
    const inputWrapper = this.#createElement("div", ["cp-input-wrapper"]);
    const inputA = this.#createElement("input", ["cp-color-input"]);
    const inputB = this.#createElement("input", ["cp-color-input"]);
    const inputC = this.#createElement("input", ["cp-color-input"]);
    const inputD = this.#createElement("input", ["cp-color-input"]);
    const labelA = this.#createElement("label", ["cp-color-model-label"]);
    const labelB = this.#createElement("label", ["cp-color-model-label"]);
    const labelC = this.#createElement("label", ["cp-color-model-label"]);
    const labelD = this.#createElement("label", ["cp-color-model-label"]);

    inputA.setAttribute("type", "text");
    inputB.setAttribute("type", "text");
    inputC.setAttribute("type", "text");
    inputD.setAttribute("type", "text");

    // Set labels' text
    const model = this.#currentRepresentation.toUpperCase();
    labelA.textContent = model[0];
    labelB.textContent = model[1];
    labelC.textContent = model[2];
    labelD.textContent = "A";

    // Append child elements
    inputWrapper.appendChild(inputA);
    inputWrapper.appendChild(inputB);
    inputWrapper.appendChild(inputC);
    inputWrapper.appendChild(inputD);
    inputWrapper.appendChild(labelA);
    inputWrapper.appendChild(labelB);
    inputWrapper.appendChild(labelC);
    inputWrapper.appendChild(labelD);

    // Attach events
    inputA.addEventListener("focus", this.#onFocusInput.bind(this));
    inputA.addEventListener("keydown", this.#onKeyDownInputA.bind(this));
    inputA.addEventListener("input", this.#onInputA.bind(this));
    inputA.addEventListener("change", this.#onChangeInputA.bind(this));

    inputB.addEventListener("focus", this.#onFocusInput.bind(this));
    inputB.addEventListener("keydown", this.#onKeyDownInputB.bind(this));
    inputB.addEventListener("input", this.#onInputB.bind(this));
    inputB.addEventListener("change", this.#onChangeInputB.bind(this));

    inputC.addEventListener("focus", this.#onFocusInput.bind(this));
    inputC.addEventListener("keydown", this.#onKeyDownInputC.bind(this));
    inputC.addEventListener("input", this.#onInputC.bind(this));
    inputC.addEventListener("change", this.#onChangeInputC.bind(this));

    inputD.addEventListener("keydown", this.#onKeyDownAlphaInput.bind(this));
    inputD.addEventListener("input", this.#onKeyUpAlphaInput.bind(this));
    inputD.addEventListener("change", this.#onChangeAlphaInput.bind(this));

    this.#dom["inputA"] = inputA;
    this.#dom["inputB"] = inputB;
    this.#dom["inputC"] = inputC;
    this.#dom["inputAlpha"] = inputD;

    return inputWrapper;
  }

  #updateOpacityThumb() {
    const { opacitySlider, opacityThumb } = this.#dom;
    opacityThumb.style.translate = `${
      this.#color.a * opacitySlider.offsetWidth
    }px`;
  }

  #updateHueThumb() {
    const { hueThumb, hueSlider } = this.#dom;
    hueThumb.style.translate = `${
      (this.#color.hsv.h / 360) * hueSlider.offsetWidth
    }px`;
  }

  #setQuadrupedValue(a, b, c) {
    this.#dom["inputA"].value = a;
    this.#dom["inputB"].value = b;
    this.#dom["inputC"].value = c;
    this.#dom["inputAlpha"].value = parseFloat(this.#color.a.toFixed(2));
  }

  #updateHEXInput() {
    this.#dom["inputHEX"].value = this.#color.hex;
  }

  #updateSettingsView() {
    this.#updateInputsValue();
    this.#updateColorPreview(true);
  }

  #updateInputs() {
    this.#buildInput();
    this.#updateInputsValue();
  }

  #updateInputsValue() {
    switch (this.#currentRepresentation) {
      case YKColorPicker.RGB:
        {
          const { r, g, b } = (this.#color.rgb = this.#color.toRGB());
          this.#setQuadrupedValue(Math.round(r), Math.round(g), Math.round(b));
        }
        break;

      case YKColorPicker.HSV:
        {
          const { h, s, v } = this.#color.hsv;
          this.#setQuadrupedValue(
            `${Math.round(h)}°`,
            `${Math.round(s)}%`,
            `${Math.round(v)}%`
          );
        }
        break;

      case YKColorPicker.HSL:
        {
          const { h, s, l } = (this.#color.hsl = this.#color.toHSL());
          this.#setQuadrupedValue(
            `${Math.round(h)}°`,
            `${Math.round(s)}%`,
            `${Math.round(l)}%`
          );
        }
        break;

      case YKColorPicker.HEX:
        {
          this.#updateHEXColor();
          this.#updateHEXInput();
        }
        break;
    }
  }

  #updateColorPreview(fireEvent) {
    const alpha = this.#color.a;
    const hsl = this.#color.toHSL();
    const { palette, opacitySlider, colorPreview } = this.#dom;
    const paletteBGColor = `hsl(${hsl.h}deg 100% 50% / 1)`;
    palette.style.backgroundImage = `linear-gradient(180deg, transparent 0%, rgba(0,0,0,1) 100%), linear-gradient(90deg, rgba(255,255,255,1) 0%, ${paletteBGColor} 100%)`;
    const hslColor = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    opacitySlider.style.setProperty(
      "background-image",
      `linear-gradient(90deg, transparent, ${hslColor})`
    );
    colorPreview.setAttribute("fill", hslColor);
    colorPreview.setAttribute("fill-opacity", alpha);
    if (fireEvent == true) {
      this.#options.onInput(this);
    }
  }

  #updateCursorThumb() {
    const { palette, cursor } = this.#dom;
    const { s, v } = this.#color.hsv;
    cursor.style.translate = `${(s / 100) * palette.offsetWidth}px ${
      palette.offsetHeight - (v / 100) * palette.offsetHeight
    }px`;
  }

  #buildCopyColor() {
    const copyColor = this.#createElement("button", ["cp-clipboard-color"]);
    copyColor.addEventListener("click", this.#onClickCopyColor.bind(this));
    this.#dom["copyColor"] = copyColor;
    this.#attachCopyIcon();

    return copyColor;
  }

  #attachCopyIcon() {
    const path = `<path d="m1.9695 11.037v-6.7c0-2 1.6-3.7 3.7-3.7h4.3c0.8 0 1.5 0.5 1.7 1.2h-5.6c-1.6 0.1-2.9 1.4-2.9 3.1v7.9c-0.7-0.3-1.2-1-1.2-1.8zm4.3 4.3c-1 0-1.8-0.8-1.8-1.8v-8.6c0-1 0.8-1.8 1.8-1.8h6.1c1 0 1.8 0.8 1.8 1.8v8.6c0 1-0.8 1.8-1.8 1.8zm6.7-1.8v-8.6c0-0.3-0.3-0.6-0.6-0.6h-6.1c-0.3 0-0.6 0.3-0.6 0.6v8.6c0 0.3 0.3 0.6 0.6 0.6h6.1c0.3 0 0.6-0.3 0.6-0.6z"/>`;
    this.#dom.copyColor.innerHTML = "";
    this.#dom.copyColor.appendChild(this.#createSVGIcon(path));
  }

  #attachCheckIcon() {
    const path = `<path d="m13.975 5.3001c0.24929-0.24929 0.16619-0.58168-0.0831-0.83097l-0.66477-0.66477c-0.24929-0.24929-0.58168-0.16619-0.83097 0.083097l-5.5675 6.2322-3.407-3.1577c-0.24929-0.24929-0.58168-0.16619-0.83097 0.083097l-0.66477 0.66477c-0.24929 0.24929-0.16619 0.58168 0.083097 0.83097l4.5703 4.1548c0.24929 0.24929 0.58168 0.16619 0.83097-0.0831z"/>`;
    this.#dom.copyColor.innerHTML = "";
    this.#dom.copyColor.appendChild(this.#createSVGIcon(path));
  }

  #createSVGIcon(path) {
    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElement.setAttribute("viewBox", "0 0 16 16");
    svgElement.setAttribute("width", "16px");
    svgElement.setAttribute("height", "16px");
    svgElement.innerHTML = path;

    return svgElement;
  }

  #buildColorSliders() {
    const sliders = this.#createElement("div", ["cp-sliders"]);

    // Build hue slider
    sliders.appendChild(this.#buildHueSlider());
    // Build hue slider
    sliders.appendChild(this.#buildOpacitySlider());

    return sliders;
  }

  #buildHueSlider() {
    // Create elements
    const sliderWrapper = this.#createElement("div", ["cp-hue-slider-wrapper"]);
    const slider = this.#createElement("div", ["cp-hue-slider"]);
    const sliderThumb = this.#createElement("a", ["cp-hue-slider-thumb"]);
    sliderThumb.setAttribute("tabindex", "0");

    // Appench child element
    sliderWrapper.appendChild(slider);
    sliderWrapper.appendChild(sliderThumb);

    // Attach events
    this.#onMouseDownHueSliderBind = this.#onMouseDownHueSlider.bind(this);
    this.#onMouseUpHueSliderBind = this.#onMouseUpHueSlider.bind(this);
    this.#onMouseMoveHueSliderBind = this.#onMouseMoveHueSlider.bind(this);
    sliderWrapper.addEventListener("mousedown", this.#onMouseDownHueSliderBind);
    sliderThumb.addEventListener(
      "keydown",
      this.#onKeyDownHueSlider.bind(this)
    );

    this.#dom["hueSlider"] = slider;
    this.#dom["hueThumb"] = sliderThumb;

    return sliderWrapper;
  }

  #buildOpacitySlider() {
    // Create elements
    const sliderWrapper = this.#createElement("div", [
      "cp-opacity-slider-wrapper",
    ]);
    const color = this.#createElement("div", ["cp-opacity-color"]);
    const sliderThumb = this.#createElement("a", ["cp-opacity-slider-thumb"]);
    sliderThumb.setAttribute("tabindex", "0");

    // Appench child element
    sliderWrapper.appendChild(color);
    sliderWrapper.appendChild(sliderThumb);

    // Attach events
    this.#onMouseDownOpacitySliderBind =
      this.#onMouseDownOpacitySlider.bind(this);
    this.#onMouseUpOpacitySliderBind = this.#onMouseUpOpacitySlider.bind(this);
    this.#onMouseMoveOpacitySliderBind =
      this.#onMouseMoveOpacitySlider.bind(this);
    sliderWrapper.addEventListener(
      "mousedown",
      this.#onMouseDownOpacitySliderBind
    );
    sliderThumb.addEventListener(
      "keydown",
      this.#onKeyDownOpacitySlider.bind(this)
    );

    this.#dom["opacitySlider"] = color;
    this.#dom["opacityThumb"] = sliderThumb;

    return sliderWrapper;
  }

  #buildColorPreview() {
    const colorPreviewWrapper = this.#createElement("span", [
      "cp-color-preview-wrapper",
    ]);

    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElement.setAttribute("width", 38);
    svgElement.setAttribute("height", 38);

    const colorPreview = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    colorPreview.setAttribute("cx", 19);
    colorPreview.setAttribute("cy", 19);
    colorPreview.setAttribute("r", 18);
    colorPreview.classList.add("cp-preview-stroke");

    svgElement.innerHTML =
      '<defs><pattern id="transparent-grid" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse"><path fill="#DBDBDB" d="M0 0h3v3H0z"/><path fill="#fff" d="M3 0h3v3H3z"/><path fill="#DBDBDB" d="M3 3h3v3H3z"/><path fill="#fff" d="M0 3h3v3H0z"/></pattern></defs><circle cx="19" cy="19" r="18" fill="url(#transparent-grid)"/>';
    svgElement.appendChild(colorPreview);
    colorPreviewWrapper.appendChild(svgElement);

    this.#dom.colorPreview = colorPreview;

    return colorPreviewWrapper;
  }

  #createElement(tag, classList) {
    const el = document.createElement(tag);
    if (classList != null) {
      el.classList.add(...classList);
    }
    return el;
  }

  #rgbUpdateView() {
    this.#updateColorPreview(true);
    this.#updateHueThumb();
    this.#updateCursorThumb();
  }

  #updateHEXColorSection(
    color,
    event,
    con,
    conValue,
    op,
    startSelect,
    endSelect
  ) {
    const { target } = event;
    const { rgb, hex } = this.#color;
    if (con(rgb[color], conValue)) {
      rgb[color] = op(rgb[color], 1);
      this.#color.hex =
        hex.substring(0, startSelect) +
        YKColorPicker.hexPad2(Math.round(rgb[color])) +
        hex.substring(endSelect);
      const { r, g, b } = rgb;
      this.#color.hsv = YKColor.RGBtoHSV(r, g, b);
      this.#rgbUpdateView();
    }
    target.value = this.#color.hex;
    target.setSelectionRange(startSelect, endSelect);
    event.preventDefault();
  }

  #updateHEXAlphaSection(event, con, conValue, op) {
    const { target } = event;
    const { hex, a } = this.#color;
    if (con(a, conValue)) {
      this.#color.a = parseFloat(op(a, 0.01).toFixed(2));
      target.value = this.#color.hex =
        hex.substring(0, 7) +
        YKColorPicker.hexPad2(Math.round(this.#color.a * 255));
      this.#updateColorPreview(true);
      this.#updateOpacityThumb();
    }
    target.value = this.#color.hex;
    target.setSelectionRange(7, 9);
    event.preventDefault();
  }

  #updateOpacityValue(value) {
    this.#color.a = parseFloat(value.toFixed(2));
    if (this.#currentRepresentation == YKColorPicker.HEX) {
      this.#updateHEXColor(this);
      this.#updateHEXInput();
    } else {
      this.#dom.inputAlpha.value = this.#color.a;
    }
    this.#updateColorPreview(true);
  }

  #updatePosition() {
    if (this.#options.target == null) {
      return;
    }
    if (!YKColorPicker.#isTargetInViewport(this.#options.target)) {
      this.close();
      return;
    }
    this.#setPositionAxis(this.#getPositionAxis());
  }

  #attachToContainer(callEvent) {
    const container = document.getElementById(this.#options.container);
    if (container == null) {
      throw ReferenceError(
        "ColorPicker:: container to set color picker is undefined"
      );
    }
    this.#removeWindowEvents(this);
    const { overlayWrapper } = this.#dom;
    const parent = overlayWrapper.parentElement;
    container.appendChild(overlayWrapper);
    overlayWrapper.classList.remove(
      "cp-overlay-wrapper--light",
      "cp-overlay-wrapper--dark"
    );
    overlayWrapper.classList.add("cp-overlay-wrapper--static");
    overlayWrapper.classList.add("cp-overlay-wrapper--open");
    overlayWrapper.classList.add("cp-overlay-wrapper--" + this.#options.theme);
    this.#updateGUI();
    this.#isOpen = true;
    if (callEvent && parent != overlayWrapper.parentElement) {
      this.#options.onContainerChange(this, parent);
    }
  }

  #attachToBody() {
    this.#removeWindowEvents(this);
    const { overlayWrapper } = this.#dom;
    const parent = overlayWrapper.parentElement;
    document.body.appendChild(overlayWrapper);
    overlayWrapper.classList.remove(
      "cp-overlay-wrapper--light",
      "cp-overlay-wrapper--dark"
    );
    overlayWrapper.classList.remove("cp-overlay-wrapper--static");
    overlayWrapper.classList.add("cp-overlay-wrapper--open");
    overlayWrapper.classList.add("cp-overlay-wrapper--" + this.#options.theme);
    this.#updateGUI();
    this.#updatePosition();
    window.addEventListener("resize", this.#onResizeScrollWindowBind);
    window.addEventListener("scroll", this.#onResizeScrollWindowBind);
    document.addEventListener("click", this.#onClickCloseBind);
    if (this.#options.escapeKey) {
      document.addEventListener("keyup", this.#onKeyUpCloseBind);
    }
    this.#isOpen = true;
    if (parent != overlayWrapper.parentElement) {
      this.#options.onContainerChange(this, parent);
    }
  }

  #detachOverlay() {
    this.#dom.overlayWrapper.classList.remove("cp-overlay-wrapper--open");
    this.#removeWindowEvents(this);
    this.#isOpen = false;
  }

  #onClickTarget(event) {
    event.stopPropagation();
    if (this.#isOpen) this.close();
    else this.open();
  }

  #onMouseDownCursor(event) {
    this.#dc = true;
    document.addEventListener("mousemove", this.#onMouseMoveCursorBind);
    document.addEventListener("mouseup", this.#onMouseUpCursorBind);
    this.#onMouseMoveCursorBind(event);
  }

  #onMouseUpCursor(e) {
    document.removeEventListener("mousemove", this.#onMouseMoveCursorBind);
    document.removeEventListener("mouseup", this.#onMouseUpCursorBind);
    if (this.#dom.overlayWrapper.contains(e.target)) {
      this.#dc = false;
    }
  }

  #onMouseMoveCursor(event) {
    const { x, y } = this.#getCursorPosition(event.clientX, event.clientY);
    this.#dom.cursor.style.translate = `${x}px ${y}px`;
    const paletteHeight = this.#dom.palette.offsetHeight;
    const paletteWidth = this.#dom.palette.offsetWidth;
    this.#color.hsv.s = (x / paletteWidth) * 100;
    this.#color.hsv.v = ((paletteHeight - y) / paletteHeight) * 100;
    this.#updateSettingsView();
  }

  #onClickInputsSwitch() {
    switch (this.#currentRepresentation) {
      case YKColorPicker.RGB:
        this.#updateRepresentation(YKColorPicker.HSV);
        break;
      case YKColorPicker.HSV:
        this.#updateRepresentation(YKColorPicker.HSL);
        break;
      case YKColorPicker.HSL:
        this.#updateRepresentation(YKColorPicker.HEX);
        break;
      case YKColorPicker.HEX:
        this.#updateRepresentation(YKColorPicker.RGB);
        break;
    }
  }

  #onFocusInput() {
    switch (this.#currentRepresentation) {
      case YKColorPicker.RGB:
        this.#color.rgb = this.getRGB();
        break;
      case YKColorPicker.HSV:
        this.#color.hsv = this.getHSV();
        break;
      case YKColorPicker.HSL:
        this.#color.hsl = this.getHSL();
        break;
      case YKColorPicker.HEX:
        this.#updateHEXColor();
        break;
    }
  }

  #onKeyDownAlphaInput(event) {
    const { target, key } = event;
    const { a } = this.#color;
    switch (key) {
      case "ArrowUp":
        {
          if (a < 1) {
            let alphaValue = parseFloat((a + 0.01).toFixed(2));
            if (alphaValue > 1) {
              alphaValue = 1;
            }
            target.value = this.#color.a = alphaValue;
            this.#updateColorPreview(true);
            this.#updateOpacityThumb();
          }
        }
        break;

      case "ArrowDown":
        {
          if (a > 0) {
            let alphaValue = parseFloat((a - 0.01).toFixed(2));
            if (alphaValue < 0) {
              alphaValue = 0;
            }
            target.value = this.#color.a = alphaValue;
            this.#updateColorPreview(true);
            this.#updateOpacityThumb();
          }
        }
        break;

      case ".":
        {
          if (/(\.)/.test(target.value)) {
            event.preventDefault();
          }
        }
        break;
    }
  }

  #onKeyUpAlphaInput(event) {
    const { target } = event;
    if (/^(0(\.\d{1,2})?|(0*)1?)$/.test(target.value) || target.value == "") {
      const value = parseFloat(target.value) || 0;
      if (!isNaN(value) && value >= 0 && value <= 1) {
        this.#color.a = value;
        this.#updateColorPreview(true);
        this.#updateOpacityThumb(this);
      }
    }
  }

  #onChangeAlphaInput(event) {
    event.target.value = this.#color.a;
  }

  #onKeyDownInputHEX(event) {
    const { target, key } = event;
    switch (key) {
      case "ArrowUp":
        {
          if (
            !/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(
              target.value
            )
          ) {
            target.value = this.#color.hex;
          }
          const caret = this.#getCaretPosition(target);
          const length = target.value.length;
          if (length <= 5) {
            if (caret < 2) {
              this.#updateHEXColorSection(
                "r",
                event,
                YKColorPicker.#lt,
                255,
                YKColorPicker.#add,
                1,
                3
              );
            } else if (caret < 3) {
              this.#updateHEXColorSection(
                "g",
                event,
                YKColorPicker.#lt,
                255,
                YKColorPicker.#add,
                3,
                5
              );
            } else if ((caret <= 4 && length <= 4) || caret < 4) {
              this.#updateHEXColorSection(
                "b",
                event,
                YKColorPicker.#lt,
                255,
                YKColorPicker.#add,
                5,
                7
              );
            } else if (caret <= 5) {
              this.#updateHEXAlphaSection(
                event,
                YKColorPicker.#lt,
                1,
                YKColorPicker.#add
              );
            }
          } else {
            if (caret < 3) {
              this.#updateHEXColorSection(
                "r",
                event,
                YKColorPicker.#lt,
                255,
                YKColorPicker.#add,
                1,
                3
              );
            } else if (caret < 5) {
              this.#updateHEXColorSection(
                "g",
                event,
                YKColorPicker.#lt,
                255,
                YKColorPicker.#add,
                3,
                5
              );
            } else if ((caret <= 7 && length == 7) || caret < 7) {
              this.#updateHEXColorSection(
                "b",
                event,
                YKColorPicker.#lt,
                255,
                YKColorPicker.#add,
                5,
                7
              );
            } else if (caret <= 9) {
              this.#updateHEXAlphaSection(
                event,
                YKColorPicker.#lt,
                1,
                YKColorPicker.#add
              );
            }
          }
        }
        break;
      case "ArrowDown":
        {
          if (
            !/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(
              target.value
            )
          ) {
            target.value = this.#color.hex;
          }
          const caret = this.#getCaretPosition(target);
          const length = target.value.length;
          if (length <= 5) {
            if (caret < 2) {
              this.#updateHEXColorSection(
                "r",
                event,
                YKColorPicker.#gt,
                0,
                YKColorPicker.#sub,
                1,
                3
              );
            } else if (caret < 3) {
              this.#updateHEXColorSection(
                "g",
                event,
                YKColorPicker.#gt,
                0,
                YKColorPicker.#sub,
                3,
                5
              );
            } else if ((caret <= 4 && length <= 4) || caret < 4) {
              this.#updateHEXColorSection(
                "b",
                event,
                YKColorPicker.#gt,
                0,
                YKColorPicker.#sub,
                5,
                7
              );
            } else if (caret <= 5) {
              this.#updateHEXAlphaSection(
                event,
                YKColorPicker.#gt,
                0,
                YKColorPicker.#sub
              );
            }
          } else {
            if (caret < 3) {
              this.#updateHEXColorSection(
                "r",
                event,
                YKColorPicker.#gt,
                0,
                YKColorPicker.#sub,
                1,
                3
              );
            } else if (caret < 5) {
              this.#updateHEXColorSection(
                "g",
                event,
                YKColorPicker.#gt,
                0,
                YKColorPicker.#sub,
                3,
                5
              );
            } else if ((caret <= 7 && length == 7) || caret < 7) {
              this.#updateHEXColorSection(
                "b",
                event,
                YKColorPicker.#gt,
                0,
                YKColorPicker.#sub,
                5,
                7
              );
            } else if (caret <= 9) {
              this.#updateHEXAlphaSection(
                event,
                YKColorPicker.#gt,
                0,
                YKColorPicker.#sub
              );
            }
          }
        }
        break;
    }
  }

  #onInputHEX(event) {
    const rgb = YKColor.HEXtoRGBA(event.target.value.trim());
    if (rgb != null) {
      const { r, g, b, a } = rgb;
      this.#color.a = a;
      this.#color.rgb = { r, g, b };
      this.#color.hex = YKColor.RGBAtoHEX(r, g, b, a);
      this.#color.hsv = YKColor.RGBtoHSV(r, g, b);
      this.#updateColorPreview(true);
      this.#updateHueThumb();
      this.#updateOpacityThumb();
      this.#updateCursorThumb();
    }
  }

  #onChangeInputHEX(event) {
    event.target.value = this.#color.hex;
  }

  #onKeyDownInputA(event) {
    const { target, key } = event;
    switch (key) {
      case "ArrowUp":
        {
          switch (this.#currentRepresentation) {
            case YKColorPicker.RGB:
              {
                let { r, g, b } = this.#color.rgb;
                r = Math.round(r);
                if (r < 255) {
                  this.#color.rgb.r = target.value = ++r;
                  this.#color.hsv = YKColor.RGBtoHSV(r, g, b);
                  this.#rgbUpdateView();
                }
              }
              break;

            case YKColorPicker.HSV:
            case YKColorPicker.HSL:
              {
                let { h } = this.#color.hsv;
                h = Math.round(h);
                if (h < 360) {
                  target.value = ++h + "°";
                  this.#color.hsv.h = this.#color.hsl.h = h;
                  this.#updateColorPreview(true);
                  this.#updateHueThumb();
                }
              }
              break;
          }
        }
        break;
      case "ArrowDown":
        {
          switch (this.#currentRepresentation) {
            case YKColorPicker.RGB:
              {
                let { r, g, b } = this.#color.rgb;
                r = Math.round(r);
                if (r > 0) {
                  this.#color.rgb.r = target.value = --r;
                  this.#color.hsv = YKColor.RGBtoHSV(r, g, b);
                  this.#rgbUpdateView();
                }
              }
              break;

            case YKColorPicker.HSV:
            case YKColorPicker.HSL:
              {
                let { h } = this.#color.hsv;
                h = Math.round(h);
                if (h > 0) {
                  target.value = --h + "°";
                  this.#color.hsv.h = this.#color.hsl.h = h;
                  this.#updateColorPreview(true);
                  this.#updateHueThumb();
                }
              }
              break;
          }
        }
        break;
    }
  }

  #onInputA(event) {
    const value = parseInt(event.target.value || 0);
    if (/^(\d{1,3})(°?)$/.test(value)) {
      switch (this.#currentRepresentation) {
        case YKColorPicker.RGB:
          {
            const { g, b } = this.#color.rgb;
            if (!isNaN(value) && value >= 0 && value <= 255) {
              this.#color.rgb.r = value;
              this.#color.hsv = YKColor.RGBtoHSV(value, g, b);
              this.#updateColorPreview(true);
              this.#updateHueThumb();
              this.#updateCursorThumb();
            }
          }
          break;

        case YKColorPicker.HSV:
        case YKColorPicker.HSL:
          {
            if (!isNaN(value) && value >= 0 && value <= 360) {
              this.#color.hsv.h = this.#color.hsl.h = value;
              this.#updateColorPreview(true);
              this.#updateHueThumb();
            }
          }
          break;
      }
    }
  }

  #onChangeInputA(event) {
    let value = event.target.value;
    switch (this.#currentRepresentation) {
      case YKColorPicker.RGB:
        {
          value = Math.round(this.#color.rgb.r);
        }
        break;

      case YKColorPicker.HSV:
      case YKColorPicker.HSL:
        {
          value = `${Math.round(this.#color.hsv.h)}°`;
        }
        break;
    }
    event.target.value = value;
  }

  #onKeyDownInputB(event) {
    const { target, key } = event;
    switch (key) {
      case "ArrowUp":
        {
          switch (this.#currentRepresentation) {
            case YKColorPicker.RGB:
              {
                let { r, g, b } = this.#color.rgb;
                g = Math.round(g);
                if (g < 255) {
                  this.#color.rgb.g = target.value = ++g;
                  this.#color.hsv = YKColor.RGBtoHSV(r, g, b);
                  this.#rgbUpdateView();
                }
              }
              break;

            case YKColorPicker.HSV:
              {
                let { s } = this.#color.hsv;
                s = Math.round(s);
                if (s < 100) {
                  target.value = ++s + "%";
                  this.#color.hsv.s = s;
                  this.#updateColorPreview(true);
                  this.#updateCursorThumb();
                }
              }
              break;

            case YKColorPicker.HSL:
              {
                const { h, s, l } = this.#color.hsl;
                let hsl_s = Math.round(s);
                if (hsl_s < 100) {
                  target.value = ++hsl_s + "%";
                  this.#color.hsl.s = hsl_s;
                  this.#color.hsv.s = YKColor.HSLtoHSV(h, hsl_s, l).s;
                  this.#updateColorPreview(true);
                  this.#updateCursorThumb();
                }
              }
              break;
          }
        }
        break;
      case "ArrowDown":
        {
          switch (this.#currentRepresentation) {
            case YKColorPicker.RGB:
              {
                let { r, g, b } = this.#color.rgb;
                g = Math.round(g);
                if (g > 0) {
                  this.#color.rgb.g = target.value = --g;
                  this.#color.hsv = YKColor.RGBtoHSV(r, g, b);
                  this.#rgbUpdateView();
                }
              }
              break;

            case YKColorPicker.HSV:
              {
                let { s } = this.#color.hsv;
                s = Math.round(s);
                if (s > 0) {
                  target.value = --s + "%";
                  this.#color.hsv.s = s;
                  this.#updateColorPreview(true);
                  this.#updateCursorThumb();
                }
              }
              break;

            case YKColorPicker.HSL:
              {
                const { h, s, l } = this.#color.hsl;
                let hsl_s = Math.round(s);
                if (hsl_s > 0) {
                  target.value = --hsl_s + "%";
                  this.#color.hsl.s = hsl_s;
                  this.#color.hsv.s = YKColor.HSLtoHSV(h, hsl_s, l).s;
                  this.#updateColorPreview(true);
                  this.#updateCursorThumb();
                }
              }
              break;
          }
        }
        break;
    }
  }

  #onInputB(event) {
    const value = parseInt(event.target.value || 0);
    if (/^(\d{1,3})(%?)$/.test(value)) {
      switch (this.#currentRepresentation) {
        case YKColorPicker.RGB:
          {
            const { r, b } = this.#color.rgb;
            if (!isNaN(value) && value >= 0 && value <= 255) {
              this.#color.rgb.g = value;
              this.#color.hsv = YKColor.RGBtoHSV(r, value, b);
              this.#updateColorPreview(true);
              this.#updateHueThumb();
              this.#updateCursorThumb();
            }
          }
          break;

        case YKColorPicker.HSV:
          {
            if (!isNaN(value) && value >= 0 && value <= 100) {
              this.#color.hsv.s = value;
              this.#updateColorPreview(true);
              this.#updateCursorThumb();
            }
          }
          break;

        case YKColorPicker.HSL:
          {
            const { h, l } = this.#color.hsl;
            if (!isNaN(value) && value >= 0 && value <= 100) {
              this.#color.hsl.s = value;
              this.#color.hsv = YKColor.HSLtoHSV(h, value, l);
              this.#updateColorPreview(true);
              this.#updateCursorThumb();
            }
          }
          break;
      }
    }
  }

  #onChangeInputB(event) {
    let value = event.target.value;
    switch (this.#currentRepresentation) {
      case YKColorPicker.RGB:
        {
          value = Math.round(this.#color.rgb.g);
        }
        break;

      case YKColorPicker.HSV:
        {
          value = `${Math.round(this.#color.hsv.s)}%`;
        }
        break;

      case YKColorPicker.HSL:
        {
          value = `${Math.round(this.#color.hsl.s)}%`;
        }
        break;
    }
    event.target.value = value;
  }

  #onKeyDownInputC(event) {
    const { target, key } = event;
    switch (key) {
      case "ArrowUp":
        {
          switch (this.#currentRepresentation) {
            case YKColorPicker.RGB:
              {
                let { r, g, b } = this.#color.rgb;
                b = Math.round(b);
                if (b < 255) {
                  this.#color.rgb.b = target.value = ++b;
                  this.#color.hsv = YKColor.RGBtoHSV(r, g, b);
                  this.#rgbUpdateView();
                }
              }
              break;

            case YKColorPicker.HSV:
              {
                let { v } = this.#color.hsv;
                v = Math.round(v);
                if (v < 100) {
                  target.value = ++v + "%";
                  this.#color.hsv.v = v;
                  this.#updateColorPreview(true);
                  this.#updateCursorThumb();
                }
              }
              break;

            case YKColorPicker.HSL:
              {
                const { h, s, l } = this.#color.hsl;
                let hsl_l = Math.round(l);
                if (hsl_l < 100) {
                  target.value = ++hsl_l + "%";
                  this.#color.hsl.l = hsl_l;
                  this.#color.hsv.v = YKColor.HSLtoHSV(h, s, hsl_l).v;
                  this.#updateColorPreview(true);
                  this.#updateCursorThumb();
                }
              }
              break;
          }
        }
        break;
      case "ArrowDown":
        {
          switch (this.#currentRepresentation) {
            case YKColorPicker.RGB:
              {
                let { r, g, b } = this.#color.rgb;
                b = Math.round(b);
                if (b > 0) {
                  this.#color.rgb.b = target.value = --b;
                  this.#color.hsv = YKColor.RGBtoHSV(r, g, b);
                  this.#rgbUpdateView();
                }
              }
              break;

            case YKColorPicker.HSV:
              {
                let { v } = this.#color.hsv;
                v = Math.round(v);
                if (v > 0) {
                  target.value = --v + "%";
                  this.#color.hsv.v = v;
                  this.#updateColorPreview(true);
                  this.#updateCursorThumb();
                }
              }
              break;

            case YKColorPicker.HSL:
              {
                const { h, s, l } = this.#color.hsl;
                let hsl_l = Math.round(l);
                if (l > 0) {
                  target.value = --hsl_l + "%";
                  this.#color.hsl.l = hsl_l;
                  this.#color.hsv.v = YKColor.HSLtoHSV(h, s, hsl_l).v;
                  this.#updateColorPreview(true);
                  this.#updateCursorThumb();
                }
              }
              break;
          }
        }
        break;
    }
  }

  #onInputC(event) {
    const value = parseInt(event.target.value || 0);
    if (/^(\d{1,3})(%?)$/.test(value)) {
      switch (this.#currentRepresentation) {
        case YKColorPicker.RGB:
          {
            const { r, g } = this.#color.rgb;
            if (!isNaN(value) && value >= 0 && value <= 255) {
              this.#color.rgb.b = value;
              this.#color.hsv = YKColor.RGBtoHSV(r, g, value);
              this.#updateColorPreview(true);
              this.#updateHueThumb();
              this.#updateCursorThumb();
            }
          }
          break;

        case YKColorPicker.HSV:
          {
            if (!isNaN(value) && value >= 0 && value <= 100) {
              this.#color.hsv.v = value;
              this.#updateColorPreview(true);
              this.#updateCursorThumb();
            }
          }
          break;

        case YKColorPicker.HSL:
          {
            const { h, s } = this.#color.hsl;
            if (!isNaN(value) && value >= 0 && value <= 100) {
              this.#color.hsl.l = value;
              this.#color.hsv = YKColor.HSLtoHSV(h, s, value);
              this.#updateColorPreview(true);
              this.#updateCursorThumb();
            }
          }
          break;
      }
    }
  }

  #onChangeInputC(event) {
    let value = event.target.value;
    switch (this.#currentRepresentation) {
      case YKColorPicker.RGB:
        {
          value = Math.round(this.#color.rgb.b);
        }
        break;

      case YKColorPicker.HSV:
        {
          value = `${Math.round(this.#color.hsv.v)}%`;
        }
        break;

      case YKColorPicker.HSL:
        {
          value = `${Math.round(this.#color.hsl.l)}%`;
        }
        break;
    }
    event.target.value = value;
  }

  #onClickCopyColor() {
    if (this.#copyTimeout) {
      clearTimeout(this.#copyTimeout);
    }
    const input = document.createElement("input");
    input.style.position = "absolute";
    input.style.left = "-99999px";
    input.style.top = "-99999px";
    input.value = this.#getColorText();
    document.body.appendChild(input);
    input.select();

    try {
      document.execCommand("copy");
      this.#attachCheckIcon();
      this.#dom.copyColor.focus();
      this.#options.onCopy(this);

      this.#copyTimeout = setTimeout(() => {
        this.#attachCopyIcon();
        this.#copyTimeout = null;
      }, 600);
    } catch (err) {
      document.body.removeChild(input);
      throw new Error("YKColorPicker:: Failed to copy color.", {
        cause: err,
      });
    }
  }

  #onMouseDownHueSlider(event) {
    event.preventDefault(); // prevent default to set focus on the thumb
    this.#dc = true;
    document.addEventListener("mousemove", this.#onMouseMoveHueSliderBind);
    document.addEventListener("mouseup", this.#onMouseUpHueSliderBind);
    this.#dom.hueThumb.focus();
    this.#onMouseMoveHueSliderBind(event);
  }

  #onMouseUpHueSlider(e) {
    document.removeEventListener("mousemove", this.#onMouseMoveHueSliderBind);
    document.removeEventListener("mouseup", this.#onMouseUpHueSliderBind);
    if (this.#dom.overlayWrapper.contains(e.target)) {
      this.#dc = false;
    }
  }

  #onMouseMoveHueSlider(event) {
    const { hueSlider, hueThumb } = this.#dom;
    const sliderRect = hueSlider.getBoundingClientRect();
    const sliderWidth = sliderRect.width;
    let thumbX = event.clientX - sliderRect.left;

    if (thumbX < 0) {
      thumbX = 0;
    }
    if (thumbX > sliderWidth) {
      thumbX = sliderWidth;
    }

    this.#color.hsv.h = (thumbX / sliderRect.width) * 360;
    hueThumb.style.translate = `${thumbX}px`;

    this.#updateSettingsView();
  }

  #onMouseDownOpacitySlider(event) {
    event.preventDefault(); // prevent default to set focus on the thumb
    this.#dc = true;
    document.addEventListener("mousemove", this.#onMouseMoveOpacitySliderBind);
    document.addEventListener("mouseup", this.#onMouseUpOpacitySliderBind);
    this.#dom.opacityThumb.focus();
    this.#onMouseMoveOpacitySliderBind(event);
  }

  #onMouseUpOpacitySlider(e) {
    document.removeEventListener(
      "mousemove",
      this.#onMouseMoveOpacitySliderBind
    );
    document.removeEventListener("mouseup", this.#onMouseUpOpacitySliderBind);
    if (this.#dom.overlayWrapper.contains(e.target)) {
      this.#dc = false;
    }
  }

  #onMouseMoveOpacitySlider(event) {
    const { opacitySlider, opacityThumb } = this.#dom;
    const opacitySliderRect = opacitySlider.getBoundingClientRect();
    const sliderWidth = opacitySliderRect.width;
    let thumbX = event.clientX - opacitySliderRect.left;
    opacityThumb.focus();

    if (thumbX < 0) {
      thumbX = 0;
    }
    if (thumbX > sliderWidth) {
      thumbX = sliderWidth;
    }

    opacityThumb.style.translate = `${thumbX}px`;
    this.#updateOpacityValue(thumbX / sliderWidth);
  }

  #onKeyDownHueSlider(event) {
    const { key } = event;
    switch (key) {
      case "ArrowUp":
      case "ArrowRight":
        {
          const { hueThumb, hueSlider } = this.#dom;
          let position = parseInt(hueThumb.style.translate);
          if (!isNaN(position) && position < hueSlider.offsetWidth) {
            hueThumb.style.translate = `${++position}px`;
            this.#color.hsv.h = (position / hueSlider.offsetWidth) * 360;
            this.#updateSettingsView();
          }
          event.preventDefault();
        }
        break;

      case "ArrowDown":
      case "ArrowLeft":
        {
          const { hueThumb, hueSlider } = this.#dom;
          let position = parseInt(hueThumb.style.translate);
          if (!isNaN(position) && position > 0) {
            hueThumb.style.translate = `${--position}px`;
            this.#color.hsv.h = (position / hueSlider.offsetWidth) * 360;
            this.#updateSettingsView();
          }
          event.preventDefault();
        }
        break;
    }
  }

  #onKeyDownOpacitySlider(event) {
    const { key } = event;
    switch (key) {
      case "ArrowUp":
      case "ArrowRight":
        {
          const { opacityThumb, opacitySlider } = this.#dom;
          let position = parseInt(opacityThumb.style.translate);
          if (!isNaN(position) && position < opacitySlider.offsetWidth) {
            opacityThumb.style.translate = `${++position}px`;
            this.#updateOpacityValue(position / opacitySlider.offsetWidth);
          }
          event.preventDefault();
        }
        break;

      case "ArrowDown":
      case "ArrowLeft":
        {
          const { opacityThumb, opacitySlider } = this.#dom;
          let position = parseInt(opacityThumb.style.translate);
          if (!isNaN(position) && position > 0) {
            opacityThumb.style.translate = `${--position}px`;
            this.#updateOpacityValue(position / opacitySlider.offsetWidth);
          }
          event.preventDefault();
        }
        break;
    }
  }

  #onKeyUpClose(event) {
    if (event.key == "Escape") {
      if (this._prevColor != this.getHEX()) {
        this.setColor(this._prevColor);
        this.#updateGUI();
        this.#options.onInput(this);
      }
      this.close();
    }
  }

  #onResizeScrollWindow(event) {
    const { type } = event;
    const { target, closeOnScroll, closeOnResize } = this.#options;
    if (
      (type == "scroll" && closeOnScroll) ||
      (type == "resize" && closeOnResize)
    ) {
      this.close();
    } else {
      if (target == null) {
        return;
      }
      if (!YKColorPicker.#isTargetInViewport(this.#options.target)) {
        this.close();
        return;
      }
      this.#setPositionAxis(this.#getPositionAxis());
    }
  }

  #removeWindowEvents() {
    window.removeEventListener("resize", this.#onResizeScrollWindowBind);
    window.removeEventListener("scroll", this.#onResizeScrollWindowBind);
    document.removeEventListener("keyup", this.#onKeyUpCloseBind);
    document.removeEventListener("click", this.#onClickCloseBind);
  }

  #getCursorPosition(clientX, clientY) {
    const paletteRect = this.#dom.palette.getBoundingClientRect();
    let xAxis = clientX - paletteRect.left;
    let yAxis = clientY - paletteRect.top;

    if (xAxis < 0) {
      xAxis = 0;
    } else if (xAxis > paletteRect.width) {
      xAxis = paletteRect.width;
    }
    if (yAxis < 0) {
      yAxis = 0;
    } else if (yAxis > paletteRect.height) {
      yAxis = paletteRect.height;
    }

    return {
      x: xAxis,
      y: yAxis,
    };
  }

  #updateHEXColor() {
    const { r, g, b } = (this.#color.rgb = this.#color.toRGB());
    this.#color.hex = YKColor.RGBAtoHEX(r, g, b, this.#color.a);
  }

  #getColorText() {
    switch (this.#currentRepresentation) {
      case YKColorPicker.RGB:
        const { r, g, b } = this.#color.rgb;
        return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${
          this.#color.a
        })`;

      case YKColorPicker.HSV: {
        const { h, s, v } = this.#color.hsv;
        return `hsva(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(v)}%, ${
          this.#color.a
        })`;
      }

      case YKColorPicker.HSL: {
        const { h, s, l } = this.#color.hsl;
        return `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${
          this.#color.a
        })`;
      }

      case YKColorPicker.HEX:
        return this.getHEX();
    }
  }

  #getCaretPosition(target) {
    let position = target.selectionStart;
    const length = target.value.length;
    if (position > length) {
      position = length;
    }
    return position;
  }

  #getPositionAxis() {
    const { target, position, positionFlipOrder } = this.#options;
    const targetRect = target.getBoundingClientRect();
    const colorPickerRect = this.#dom.overlayWrapper.getBoundingClientRect();
    const scrollTop = document.documentElement.scrollTop;
    const scrollLeft = document.documentElement.scrollLeft;
    const offset = 6;
    let _position = position;

    const _stateSpaceInTop = YKColorPicker.#enoughSpace(
      () => scrollTop + targetRect.top,
      () => targetRect.top,
      colorPickerRect.height + offset
    );
    const _stateSpaceInBottom = YKColorPicker.#enoughSpace(
      () =>
        YKColorPicker.#getPageHeight() -
        (scrollTop + targetRect.top + targetRect.height),
      () => window.innerHeight - (targetRect.top + targetRect.height),
      colorPickerRect.height + offset
    );
    const _stateSpaceInLeft = YKColorPicker.#enoughSpace(
      () => scrollLeft + targetRect.left,
      () => targetRect.left,
      colorPickerRect.width + offset
    );
    const _stateSpaceInRight = YKColorPicker.#enoughSpace(
      () =>
        YKColorPicker.#getPageWidth() -
        (scrollLeft + targetRect.left + targetRect.width),
      () => window.innerWidth - (targetRect.left + targetRect.width),
      colorPickerRect.width + offset
    );

    const states = {
      t: _stateSpaceInTop,
      b: _stateSpaceInBottom,
      l: _stateSpaceInLeft,
      r: _stateSpaceInRight,
    };
    let positions = "";

    for (let i = 0; i < positionFlipOrder.length; i++) {
      positions += positionFlipOrder[i] + states[positionFlipOrder[i]];
    }

    let bestPositions = "";
    let secondPositions = "";

    for (let i = 1; i < positions.length; i += 2) {
      const state = positions[i];
      if (state == 2) {
        bestPositions = bestPositions + positions[i - 1];
      }
      if (state == 1) {
        secondPositions = secondPositions + positions[i - 1];
      }
    }

    if (bestPositions != "") {
      if (bestPositions.includes(_position) == false) {
        _position = bestPositions[0];
      }
    } else if (secondPositions != "") {
      if (secondPositions.includes(_position) == false) {
        _position = secondPositions[0];
      }
    } else {
      _position = YKColorPicker.BOTTOM;
    }

    let x_axis = 0;
    let y_axis = 0;

    switch (_position) {
      case YKColorPicker.TOP:
        y_axis = targetRect.top - colorPickerRect.height - offset;
        x_axis =
          targetRect.left + targetRect.width / 2 - colorPickerRect.width / 2;
        break;

      case YKColorPicker.BOTTOM:
        y_axis = targetRect.top + targetRect.height + offset;
        x_axis =
          targetRect.left + targetRect.width / 2 - colorPickerRect.width / 2;
        break;

      case YKColorPicker.LEFT:
        y_axis =
          targetRect.top + targetRect.height / 2 - colorPickerRect.height / 2;
        x_axis = targetRect.left - colorPickerRect.width - offset;
        break;

      case YKColorPicker.RIGHT:
        y_axis =
          targetRect.top + targetRect.height / 2 - colorPickerRect.height / 2;
        x_axis = targetRect.left + targetRect.width + offset;
        break;
    }

    // Make sure the color picker won't go beyond viewport by adjusting the x and y axis.
    // Calculate scrollbar for x and y.
    const xScrollbar = window.innerWidth - document.documentElement.clientWidth;
    const yScrollbar =
      window.innerHeight - document.documentElement.clientHeight;

    if (window.innerWidth - xScrollbar < x_axis + colorPickerRect.width) {
      x_axis -= x_axis + colorPickerRect.width - window.innerWidth + xScrollbar;
    }
    if (window.innerHeight - yScrollbar < y_axis + colorPickerRect.height) {
      y_axis -=
        y_axis + colorPickerRect.height - window.innerHeight + yScrollbar;
    }

    x_axis = Math.max(x_axis, 0);
    y_axis = Math.max(y_axis, 0);

    return {
      x: x_axis,
      y: y_axis,
    };
  }

  #setPositionAxis(axis) {
    const { x, y } = axis;
    this.#dom.overlayWrapper.style.top = `${y}px`;
    this.#dom.overlayWrapper.style.left = `${x}px`;
  }

  #updateRepresentation(value) {
    this.#currentRepresentation = value;
    this.#updateInputs();
    this.#options.onRepresentationChange(this);
  }

  static hexPad2(value) {
    return value.toString(16).padStart(2, "0");
  }

  static #isTargetInViewport(target) {
    if (target) {
      const rect = target.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    }
  }

  static #getPageHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
  }

  static #getPageWidth() {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.body.clientWidth,
      document.documentElement.clientWidth
    );
  }

  static #enoughSpace(condition1, condition2, boxSize) {
    if (condition1() >= boxSize) {
      if (condition2() >= boxSize) {
        return 2;
      }
      return 1;
    }
    return 0;
  }

  static #buildOptions(baseOptions, options) {
    if (options == null) {
      options = {};
    }
    const _options = {};
    const keys = Object.keys(baseOptions);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      if (options.hasOwnProperty(key) == true) {
        _options[key] = options[key];
      } else {
        _options[key] = baseOptions[key];
      }
    }
    return _options;
  }

  static #lt(a, b) {
    return a < b;
  }

  static #gt(a, b) {
    return a > b;
  }

  static #add(a, b) {
    return a + b;
  }

  static #sub(a, b) {
    return a - b;
  }
}

window.YKColorPicker = YKColorPicker;
