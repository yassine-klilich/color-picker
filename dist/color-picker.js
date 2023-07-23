const ColorParser = (function () {
  const NAMED_COLORS = {
    aliceblue: {
      h: 208,
      s: 6,
      v: 100,
    },
    antiquewhite: {
      h: 34,
      s: 14,
      v: 98,
    },
    aqua: {
      h: 180,
      s: 100,
      v: 100,
    },
    aquamarine: {
      h: 160,
      s: 50,
      v: 100,
    },
    azure: {
      h: 180,
      s: 6,
      v: 100,
    },
    beige: {
      h: 60,
      s: 10,
      v: 96,
    },
    bisque: {
      h: 33,
      s: 23,
      v: 100,
    },
    black: {
      h: 0,
      s: 0,
      v: 0,
    },
    blanchedalmond: {
      h: 36,
      s: 20,
      v: 100,
    },
    blue: {
      h: 240,
      s: 100,
      v: 100,
    },
    blueviolet: {
      h: 271,
      s: 81,
      v: 89,
    },
    brown: {
      h: 0,
      s: 75,
      v: 65,
    },
    burlywood: {
      h: 34,
      s: 39,
      v: 87,
    },
    cadetblue: {
      h: 182,
      s: 41,
      v: 63,
    },
    chartreuse: {
      h: 90,
      s: 100,
      v: 100,
    },
    chocolate: {
      h: 25,
      s: 86,
      v: 82,
    },
    coral: {
      h: 16,
      s: 69,
      v: 100,
    },
    cornflowerblue: {
      h: 219,
      s: 58,
      v: 93,
    },
    cornsilk: {
      h: 48,
      s: 14,
      v: 100,
    },
    crimson: {
      h: 348,
      s: 91,
      v: 86,
    },
    cyan: {
      h: 180,
      s: 100,
      v: 100,
    },
    darkblue: {
      h: 240,
      s: 100,
      v: 55,
    },
    darkcyan: {
      h: 180,
      s: 100,
      v: 55,
    },
    darkgoldenrod: {
      h: 43,
      s: 94,
      v: 72,
    },
    darkgray: {
      h: 0,
      s: 0,
      v: 0.6627450980392157,
    },
    darkgrey: {
      h: 0,
      s: 0,
      v: 0.6627450980392157,
    },
    darkgreen: {
      h: 120,
      s: 100,
      v: 39,
    },
    darkkhaki: {
      h: 56,
      s: 43,
      v: 74,
    },
    darkmagenta: {
      h: 300,
      s: 100,
      v: 55,
    },
    darkolivegreen: {
      h: 82,
      s: 56,
      v: 42,
    },
    darkorange: {
      h: 33,
      s: 100,
      v: 100,
    },
    darkorchid: {
      h: 280,
      s: 75,
      v: 80,
    },
    darkred: {
      h: 0,
      s: 100,
      v: 55,
    },
    darksalmon: {
      h: 15,
      s: 48,
      v: 91,
    },
    darkseagreen: {
      h: 120,
      s: 24,
      v: 74,
    },
    darkslateblue: {
      h: 248,
      s: 56,
      v: 55,
    },
    darkslategray: {
      h: 180,
      s: 41,
      v: 31,
    },
    darkslategrey: {
      h: 180,
      s: 41,
      v: 31,
    },
    darkturquoise: {
      h: 181,
      s: 100,
      v: 82,
    },
    darkviolet: {
      h: 282,
      s: 100,
      v: 83,
    },
    deeppink: {
      h: 328,
      s: 92,
      v: 100,
    },
    deepskyblue: {
      h: 195,
      s: 100,
      v: 100,
    },
    dimgray: {
      h: 0,
      s: 0,
      v: 0.4117647058823529,
    },
    dimgrey: {
      h: 0,
      s: 0,
      v: 0.4117647058823529,
    },
    dodgerblue: {
      h: 210,
      s: 88,
      v: 100,
    },
    firebrick: {
      h: 0,
      s: 81,
      v: 70,
    },
    floralwhite: {
      h: 40,
      s: 6,
      v: 100,
    },
    forestgreen: {
      h: 120,
      s: 76,
      v: 55,
    },
    fuchsia: {
      h: 300,
      s: 100,
      v: 100,
    },
    gainsboro: {
      h: 0,
      s: 0,
      v: 0.8627450980392157,
    },
    ghostwhite: {
      h: 240,
      s: 3,
      v: 100,
    },
    gold: {
      h: 51,
      s: 100,
      v: 100,
    },
    goldenrod: {
      h: 43,
      s: 85,
      v: 85,
    },
    gray: {
      h: 0,
      s: 0,
      v: 0.5019607843137255,
    },
    grey: {
      h: 0,
      s: 0,
      v: 0.5019607843137255,
    },
    green: {
      h: 120,
      s: 100,
      v: 50,
    },
    greenyellow: {
      h: 84,
      s: 82,
      v: 100,
    },
    honeydew: {
      h: 120,
      s: 6,
      v: 100,
    },
    hotpink: {
      h: 330,
      s: 59,
      v: 100,
    },
    "indianred ": {
      h: 0,
      s: 55,
      v: 80,
    },
    "indigo ": {
      h: 275,
      s: 100,
      v: 51,
    },
    ivory: {
      h: 60,
      s: 6,
      v: 100,
    },
    khaki: {
      h: 54,
      s: 42,
      v: 94,
    },
    lavender: {
      h: 240,
      s: 8,
      v: 98,
    },
    lavenderblush: {
      h: 340,
      s: 6,
      v: 100,
    },
    lawngreen: {
      h: 90,
      s: 100,
      v: 99,
    },
    lemonchiffon: {
      h: 54,
      s: 20,
      v: 100,
    },
    lightblue: {
      h: 195,
      s: 25,
      v: 90,
    },
    lightcoral: {
      h: 0,
      s: 47,
      v: 94,
    },
    lightcyan: {
      h: 180,
      s: 12,
      v: 100,
    },
    lightgoldenrodyellow: {
      h: 60,
      s: 16,
      v: 98,
    },
    lightgray: {
      h: 0,
      s: 0,
      v: 0.8274509803921568,
    },
    lightgrey: {
      h: 0,
      s: 0,
      v: 0.8274509803921568,
    },
    lightgreen: {
      h: 120,
      s: 39,
      v: 93,
    },
    lightpink: {
      h: 351,
      s: 29,
      v: 100,
    },
    lightsalmon: {
      h: 17,
      s: 52,
      v: 100,
    },
    lightseagreen: {
      h: 177,
      s: 82,
      v: 70,
    },
    lightskyblue: {
      h: 203,
      s: 46,
      v: 98,
    },
    lightslategray: {
      h: 210,
      s: 22,
      v: 60,
    },
    lightslategrey: {
      h: 210,
      s: 22,
      v: 60,
    },
    lightsteelblue: {
      h: 214,
      s: 21,
      v: 87,
    },
    lightyellow: {
      h: 60,
      s: 12,
      v: 100,
    },
    lime: {
      h: 120,
      s: 100,
      v: 100,
    },
    limegreen: {
      h: 120,
      s: 76,
      v: 80,
    },
    linen: {
      h: 30,
      s: 8,
      v: 98,
    },
    magenta: {
      h: 300,
      s: 100,
      v: 100,
    },
    maroon: {
      h: 0,
      s: 100,
      v: 50,
    },
    mediumaquamarine: {
      h: 160,
      s: 50,
      v: 80,
    },
    mediumblue: {
      h: 240,
      s: 100,
      v: 80,
    },
    mediumorchid: {
      h: 288,
      s: 60,
      v: 83,
    },
    mediumpurple: {
      h: 260,
      s: 48,
      v: 85,
    },
    mediumseagreen: {
      h: 147,
      s: 66,
      v: 70,
    },
    mediumslateblue: {
      h: 249,
      s: 56,
      v: 93,
    },
    mediumspringgreen: {
      h: 157,
      s: 100,
      v: 98,
    },
    mediumturquoise: {
      h: 178,
      s: 66,
      v: 82,
    },
    mediumvioletred: {
      h: 322,
      s: 89,
      v: 78,
    },
    midnightblue: {
      h: 240,
      s: 78,
      v: 44,
    },
    mintcream: {
      h: 150,
      s: 4,
      v: 100,
    },
    mistyrose: {
      h: 6,
      s: 12,
      v: 100,
    },
    moccasin: {
      h: 38,
      s: 29,
      v: 100,
    },
    navajowhite: {
      h: 36,
      s: 32,
      v: 100,
    },
    navy: {
      h: 240,
      s: 100,
      v: 50,
    },
    oldlace: {
      h: 39,
      s: 9,
      v: 99,
    },
    olive: {
      h: 60,
      s: 100,
      v: 50,
    },
    olivedrab: {
      h: 80,
      s: 75,
      v: 56,
    },
    orange: {
      h: 39,
      s: 100,
      v: 100,
    },
    orangered: {
      h: 16,
      s: 100,
      v: 100,
    },
    orchid: {
      h: 302,
      s: 49,
      v: 85,
    },
    palegoldenrod: {
      h: 55,
      s: 29,
      v: 93,
    },
    palegreen: {
      h: 120,
      s: 39,
      v: 98,
    },
    paleturquoise: {
      h: 180,
      s: 26,
      v: 93,
    },
    palevioletred: {
      h: 340,
      s: 48,
      v: 85,
    },
    papayawhip: {
      h: 37,
      s: 16,
      v: 100,
    },
    peachpuff: {
      h: 28,
      s: 27,
      v: 100,
    },
    peru: {
      h: 30,
      s: 69,
      v: 80,
    },
    pink: {
      h: 350,
      s: 25,
      v: 100,
    },
    plum: {
      h: 300,
      s: 28,
      v: 87,
    },
    powderblue: {
      h: 187,
      s: 23,
      v: 90,
    },
    purple: {
      h: 300,
      s: 100,
      v: 50,
    },
    red: {
      h: 0,
      s: 100,
      v: 100,
    },
    rosybrown: {
      h: 0,
      s: 24,
      v: 74,
    },
    royalblue: {
      h: 225,
      s: 71,
      v: 88,
    },
    saddlebrown: {
      h: 25,
      s: 86,
      v: 55,
    },
    salmon: {
      h: 6,
      s: 54,
      v: 98,
    },
    sandybrown: {
      h: 28,
      s: 61,
      v: 96,
    },
    seagreen: {
      h: 146,
      s: 67,
      v: 55,
    },
    seashell: {
      h: 25,
      s: 7,
      v: 100,
    },
    sienna: {
      h: 19,
      s: 72,
      v: 63,
    },
    silver: {
      h: 0,
      s: 0,
      v: 0.7529411764705882,
    },
    skyblue: {
      h: 197,
      s: 43,
      v: 92,
    },
    slateblue: {
      h: 248,
      s: 56,
      v: 80,
    },
    slategray: {
      h: 210,
      s: 22,
      v: 56,
    },
    slategrey: {
      h: 210,
      s: 22,
      v: 56,
    },
    snow: {
      h: 0,
      s: 2,
      v: 100,
    },
    springgreen: {
      h: 150,
      s: 100,
      v: 100,
    },
    steelblue: {
      h: 207,
      s: 61,
      v: 71,
    },
    tan: {
      h: 34,
      s: 33,
      v: 82,
    },
    teal: {
      h: 180,
      s: 100,
      v: 50,
    },
    thistle: {
      h: 300,
      s: 12,
      v: 85,
    },
    tomato: {
      h: 9,
      s: 72,
      v: 100,
    },
    turquoise: {
      h: 174,
      s: 71,
      v: 88,
    },
    violet: {
      h: 300,
      s: 45,
      v: 93,
    },
    wheat: {
      h: 39,
      s: 27,
      v: 96,
    },
    white: {
      h: 0,
      s: 0,
      v: 1,
    },
    whitesmoke: {
      h: 0,
      s: 0,
      v: 0.9607843137254902,
    },
    yellow: {
      h: 60,
      s: 100,
      v: 100,
    },
    yellowgreen: {
      h: 80,
      s: 76,
      v: 80,
    },
  }

  const _colorParser = Object.freeze({
    parse: function (color) {
      arguments.length
      if (arguments.length == 0) {
        throw new Error(
          `COLOR_CONVERT_ERR:: Failed to execute 'parse' on 'ColorParser': 1 argument required, but only 0 present`
        )
      }

      if (color == undefined) {
        throw new Error("COLOR_CONVERT_ERR:: color is undefined")
      }
      
      if (typeof color == "string" || color instanceof String) {
        color = color.trim()

        if (/^(rgba?)/i.test(color)) {
          return compileRGB(color)
        }
        if (/^(#)/i.test(color)) {
          return compileHEX(color)
        }
        const hsv = NAMED_COLORS[color.toLowerCase()]
        if (hsv != undefined) {
          return { ...hsv, a: 1 }
        }
      }
      else {
        const { r, g, b, a } = color
        if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255 && a >= 0 && a <= 1) {
          const { h, s, v } = Color.prototype.RGBtoHSV(r, g, b)
          return { h, s, v, a }
        }
        throw new Error(
          "COLOR_CONVERT_ERR:: the provided RGB object has invalid values, please make sure red, green, blue are between 0 and 255 and alpha value is between 0 and 1"
        )
      }

      throw new Error(
        "COLOR_CONVERT_ERR:: Color is not in RGB or HEX format or a named color"
      )
    },
  })

  function compileRGB(color) {
    let r, g, b, a

    const regexRGB = /rgba?\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(\s+(0?(\.\d+)?|1(\.0*)?)\s*)?\)/i
    
    if (regexRGB.test(color)) {
      const splitColor = color.split(regexRGB).filter(i => !isNaN(i) && i != '' && i != null)
      r = parseInt(splitColor[0])
      g = parseInt(splitColor[1])
      b = parseInt(splitColor[2])
      a = parseFloat(splitColor[3])

      if (r > 255) {
        throw new RangeError(
          `COLOR_CONVERT_ERR:: '${color}' --> ${r} has an invalid red color, it must be an interger between 0 and 255`
        )
      }
      if (g > 255) {
        throw new RangeError(
          `COLOR_CONVERT_ERR:: '${color}' --> ${g} has an invalid green color, it must be an interger between 0 and 255`
        )
      }
      if (b > 255) {
        throw new RangeError(
          `COLOR_CONVERT_ERR:: '${color}' --> ${b} has an invalid blue color, it must be an interger between 0 and 255`
        )
      }
      
      const { h, s, v } = Color.prototype.RGBtoHSV(r, g, b)
      return { h, s, v, a: isNaN(a) ? 1 : a }
    }

    throw new SyntaxError(
      `COLOR_CONVERT_ERR:: '${color}' is an invalid RGB format`
    )
  }

  function compileHEX(color) {
    const rgb = Color.prototype.HEXtoRGBA(color)
    if (rgb) {
      const { r, g, b, a } = rgb
      const { h, s, v } = Color.prototype.RGBtoHSV(r, g, b)
      return { h, s, v, a }
    }
    throw new Error(
      `COLOR_CONVERT_ERR:: '${color}' is an invalid HEX format`
    )
  }

  return _colorParser
})()
const TOP = "t";
const BOTTOM = "b";
const LEFT = "l";
const RIGHT = "r";

const RGB = "rgb";
const HSV = "hsv";
const HSL = "hsl";
const HEX = "hex";

const DefaultOptions = Object.freeze({
	target: null,
	container: null,
	position: BOTTOM,
	positionFlipOrder: "rltb",
	representation: RGB,
  color: "red",
	closeKey: "Escape",
  closeOnScroll: true,
  closeOnResize: false,
	onInit: () => {},
  onOpen: () => {},
  onClose: () => {},
  onInput: () => {},
  onChange: () => {},
  onCopy: () => {},
  onRepresentationChange: () => {},
})

function ColorPicker(options) {
	const _options = _util_.buildOptions(DefaultOptions, options);

  const { target } = _options;

	const _dom = {};
	let _isOpen = false
	let _currentRepresentation = _options.representation
	this.__c = null

	Object.defineProperty(this, "options", {
		value: _options,
	})
	Object.defineProperty(this, "DOM", {
		get: () => _dom,
	})
	Object.defineProperty(this, "isOpen", {
		get: () => _isOpen,
		set: (value) => (_isOpen = value),
	})
	Object.defineProperty(this, "currentRepresentation", {
		get: () => _currentRepresentation,
		set: (value) => {
      _currentRepresentation = value
      _gui_.updateInputs.call(this)
      this.options.onRepresentationChange.call(this)
    },
	})
	Object.defineProperty(this, "color", {
		get: function() {
      switch (this.currentRepresentation) {
        case RGB: {
          const { r, g, b } = this.__c.rgb
          return { r: Math.round(r), g: Math.round(g), b: Math.round(b), a: this.__c.a }
        }

        case HSV: {
          const { h, s, v } = this.__c.hsv
          return { h: Math.round(h), s: Math.round(s), l: Math.round(v), a: this.__c.a }
        }

        case HSL: {
          const { h, s, l } = this.__c.hsl
          return { h: Math.round(h), s: Math.round(s), l: Math.round(l), a: this.__c.a }
        }

        case HEX: return this.getHEX()
      }
    },
		set: function(value) {
      const { h, s, v, a } = ColorParser.parse(value)
      this.__c = new Color(h, s, v, a)
			_gui_.updateGUI.call(this)
    },
	})

	// init click and enter key to target
	if (target) {
		target.addEventListener("click", (event) => _event_.onClickTarget.call(this, event))
	}

	_gui_.initDOM.call(this)
	this.color = this.options.color
}

ColorPicker.prototype.open = function () {
	if (this.options.container) {
		_gui_.attachToContainer.call(this)
	}
	else {
		_gui_.attachToBody.call(this)
	}
  this.options.onOpen.call(this)
}

ColorPicker.prototype.close = function () {
	if (!this.__dc) {
		_gui_.detachFromBody.call(this)
		this.options.onClose.call(this)
	}
	this.__dc = false
}

ColorPicker.prototype.getRGB = function () {
  return { ...this.__c.toRGB(), a: this.__c.a }
}

ColorPicker.prototype.getHSV = function () {
	const { h, s, v } = this.__c.hsv
	return {
		h: Math.round(h),
		s: Math.round(s),
		v: Math.round(v),
		a: this.__c.a
	}
}

ColorPicker.prototype.getHSL = function () {
	const { h, s, l } = this.__c.toHSL()
	return {
		h: Math.round(h),
		s: Math.round(s),
    l: Math.round(l),
    a: this.__c.a
	}
}

ColorPicker.prototype.getHEX = function () {
	return this.__c.toHEX()
}

ColorPicker.prototype.copyIcon = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-201 290.3 16 16' width='16' height='16'%3E%3Cpath d='M-199.1 301.3v-6.7c0-2 1.6-3.7 3.7-3.7h4.3c.8 0 1.5.5 1.7 1.2H-195c-1.6.1-2.9 1.4-2.9 3.1v7.9c-.7-.3-1.2-1-1.2-1.8zm4.3 4.3c-1 0-1.8-.8-1.8-1.8v-8.6c0-1 .8-1.8 1.8-1.8h6.1c1 0 1.8.8 1.8 1.8v8.6c0 1-.8 1.8-1.8 1.8h-6.1zm6.7-1.8v-8.6c0-.3-.3-.6-.6-.6h-6.1c-.3 0-.6.3-.6.6v8.6c0 .3.3.6.6.6h6.1c.3 0 .6-.3.6-.6z' fill='%23bcbcbc'/%3E%3C/svg%3E")`

const _util_ = {
  buildOptions: function(baseOptions, options) {
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
  },
  lt: function(a, b) {
    return (a < b)
  },
  gt: function(a, b) {
    return (a > b)
  },
  add: function(a, b) {
    return a + b
  },
  sub: function(a, b) {
    return a - b
  },
  hexPad2: function(value) {
    return value.toString(16).padStart(2, '0')
  }
}

const _core_ = {
  getCursorPosition: function(clientX, clientY) {
    const paletteRect = this.DOM.palette.getBoundingClientRect();
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
  },
  updateHEXColor: function() {
    const { r, g, b } = this.__c.rgb = this.__c.toRGB()
    this.__c.hex = this.__c.RGBAtoHEX(r, g, b, this.__c.a)
  },
  getColorText: function() {
    switch (this.currentRepresentation) {
      case RGB:
        const { r, g, b } = this.__c.rgb
        return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${this.__c.a})`
        
      case HSV: {
        const { h, s, v } = this.__c.hsv
        return `hsva(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(v)}%, ${this.__c.a})`
      }
  
      case HSL: {
        const { h, s, l } = this.__c.hsl
        return `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${this.__c.a})`
      }
  
      case HEX: return this.getHEX()
    }
  },
  getCaretPosition: function(target) {
    let position = target.selectionStart
    const length = target.value.length
    if (position > length) {
      position = length
    }
    return position
  },
  getPositionAxis: function() {
    const { target, position, positionFlipOrder } = this.options;
    const offset = 6
    let _position = position;
    const targetRect = target.getBoundingClientRect();
    const boxRect = this.DOM.overlayWrapper.getBoundingClientRect();
    const scrollTop = document.documentElement.scrollTop;
    const scrollLeft = document.documentElement.scrollLeft;

    const _stateSpaceInTop = _core_.enoughSpace(
      () => scrollTop + targetRect.top,
      () => targetRect.top,
      boxRect.height + offset
    )
    const _stateSpaceInBottom = _core_.enoughSpace(
      () => _core_.getPageHeight() - (scrollTop + targetRect.top + targetRect.height),
      () => window.innerHeight - (targetRect.top + targetRect.height),
      boxRect.height + offset
    )
    const _stateSpaceInLeft = _core_.enoughSpace(
      () => scrollLeft + targetRect.left,
      () => targetRect.left,
      boxRect.width + offset
    )
    const _stateSpaceInRight = _core_.enoughSpace(
      () => _core_.getPageWidth() - (scrollLeft + targetRect.left + targetRect.width),
      () => window.innerWidth - (targetRect.left + targetRect.width),
      boxRect.width + offset
    )

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
      _position = BOTTOM;
    }

    let x_axis = 0;
    let y_axis = 0;

    switch (_position) {
      case TOP:
        y_axis = (targetRect.top - boxRect.height) - offset;
        x_axis = targetRect.left + targetRect.width / 2 - boxRect.width / 2;
        break;

      case BOTTOM:
        y_axis = (targetRect.top + targetRect.height) + offset;
        x_axis = targetRect.left + targetRect.width / 2 - boxRect.width / 2;
        break;

      case LEFT:
        y_axis = targetRect.top + targetRect.height / 2 - boxRect.height / 2;
        x_axis = (targetRect.left - boxRect.width) - offset;
        break;

      case RIGHT:
        y_axis = targetRect.top + targetRect.height / 2 - boxRect.height / 2;
        x_axis = (targetRect.left + targetRect.width) + offset;
        break;
    }

    if (window.innerWidth < (x_axis + boxRect.width)) {
      x_axis -= ((x_axis + boxRect.width) - window.innerWidth)
    }

    return {
      x: x_axis,
      y: y_axis,
    };
  },
  getPageHeight: function() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
  },
  getPageWidth: function() {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.body.clientWidth,
      document.documentElement.clientWidth
    );
  },
  enoughSpace: function (condition1, condition2, boxSize) {
    if (condition1() >= boxSize) {
      if (condition2() >= boxSize) {
        return 2
      }
      return 1
    }
    return 0
  },
  setPositionAxis: function(axis) {
    const { x, y } = axis
    this.DOM.overlayWrapper.style.top = `${y}px`
    this.DOM.overlayWrapper.style.left = `${x}px`
  }
}

const _gui_ = {
  initDOM: function() {
    // DOM declaration
    const cp_overlayWrapper = _gui_.createElement("div", ["cp-overlay-wrapper"])
    const cp_Wrapper = _gui_.createElement("div", ["cp-wrapper"])
  
    // Append child nodes
    cp_overlayWrapper.appendChild(cp_Wrapper)
    // build palette
    cp_Wrapper.appendChild(_gui_.buildPaletteColor.call(this))
    // build color settings
    cp_Wrapper.appendChild(_gui_.buildColorSettings.call(this))
  
    cp_overlayWrapper.addEventListener("click", event => event.stopPropagation())
    this.DOM["overlayWrapper"] = cp_overlayWrapper
    
	  this.__onKeyUpClose = _event_.onKeyUpClose.bind(this)
    this.__onResizeScrollWindow = _event_.onResizeScrollWindow.bind(this)
    this.__onClickClose = this.close.bind(this)

    if (this.options.container) {
      _gui_.attachToContainer.call(this)
    }

    this.options.onInit.call(this)
  },
  updateGUI: function() {
    _gui_.updateCursorThumb.call(this)
    _gui_.updateInputs.call(this)
    _gui_.updateColorPreview.call(this, false)
    _gui_.updateHueThumb.call(this)
    _gui_.updateOpacityThumb.call(this)
  },
  buildPaletteColor: function() {
    const paletteWrapper = _gui_.createElement("div", ["cp-palette-wrapper"]);
    const palette = _gui_.createElement("div", ["cp-palette"]);
    const cursor = _gui_.createElement("div", ["cp-cursor"]);
    
    paletteWrapper.appendChild(palette);
    paletteWrapper.appendChild(cursor);
  
    // Append event
    this.__onMouseDownCursor = _event_.onMouseDownCursor.bind(this);
    this.__onMouseUpCursor = _event_.onMouseUpCursor.bind(this);
    this.__onMouseMoveCursor = _event_.onMouseMoveCursor.bind(this);
    paletteWrapper.addEventListener("mousedown", this.__onMouseDownCursor);
  
    this.DOM["palette"] = palette;
    this.DOM["cursor"] = cursor;
  
    return paletteWrapper;
  },
  buildColorSettings: function() {
    const colorSettings = _gui_.createElement("div", ["cp-color-settings"]);
  
    // Build color color
    colorSettings.appendChild(_gui_.buildCopyColor.call(this))
    // Build color preview
    colorSettings.appendChild(_gui_.buildColorPreview.call(this))
    // Build sliders
    colorSettings.appendChild(_gui_.buildColorSliders.call(this))
    // Build inputs
    colorSettings.appendChild(_gui_.buildColorInputs.call(this))
  
    return colorSettings;
  },
  buildColorInputs: function() {
    // Create elements
    const inputsSettings = _gui_.createElement("div", ["cp-color-model-wrapper"])
    const inputsWrapper = _gui_.createElement("div", ["cp-color-model"])
    const inputsSwitch = _gui_.createElement("button", ["cp-color-model-switch"])
    inputsSwitch.style.setProperty("background-image", `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='-203 292.3 12 12'%3E%3Cpath fill='%23bcbcbc' d='m-200.5 300.9 1.2-1.2 2.3 2.3 2.3-2.3 1.2 1.2-3.5 3.4-3.5-3.4zM-197 292.3l3.5 3.4-1.2 1.2-2.3-2.3-2.3 2.3-1.2-1.2 3.5-3.4z'/%3E%3C/svg%3E")`)
    
    // Append elements
    inputsSettings.appendChild(inputsWrapper)
    inputsSettings.appendChild(inputsSwitch)

    // Attach Events
    inputsSwitch.addEventListener("click", _event_.onClickInputsSwitch.bind(this))

    this.DOM["inputsWrapper"] = inputsWrapper

    return inputsSettings
  },
  buildInput: function() {
    const { inputsWrapper } = this.DOM
    inputsWrapper.innerHTML = ""
    if (this.currentRepresentation == HEX) {
      inputsWrapper.appendChild(_gui_.buildHEXInput.call(this))
    }
    else {
      inputsWrapper.appendChild(_gui_.buildQuadrupedInput.call(this))
    }
  },
  buildHEXInput: function() {
    const inputWrapper = _gui_.createElement("div", ["cp-hex-input"])
    const inputHEX = _gui_.createElement("input", ["cp-color-input"])
    const labelHEX = _gui_.createElement("label", ["cp-color-model-label"])
    inputHEX.setAttribute("type", "text")
    labelHEX.textContent = "HEX"
    inputWrapper.appendChild(inputHEX)
    inputWrapper.appendChild(labelHEX)

    inputHEX.addEventListener("focus", _event_.onFocusInput.bind(this))
    inputHEX.addEventListener("keydown", _event_.onKeyDownInputHEX.bind(this))
    inputHEX.addEventListener("input", _event_.onInputHEX.bind(this))
    inputHEX.addEventListener("change", _event_.onChangeInputHEX.bind(this))

    this.DOM["inputHEX"] = inputHEX

    return inputWrapper
  },
  buildQuadrupedInput: function() {
    // Create DOM elements
    const inputWrapper = _gui_.createElement("div", ["cp-input-wrapper"])
    const inputA = _gui_.createElement("input", ["cp-color-input"])
    const inputB = _gui_.createElement("input", ["cp-color-input"])
    const inputC = _gui_.createElement("input", ["cp-color-input"])
    const inputD = _gui_.createElement("input", ["cp-color-input"])
    const labelA = _gui_.createElement("label", ["cp-color-model-label"])
    const labelB = _gui_.createElement("label", ["cp-color-model-label"])
    const labelC = _gui_.createElement("label", ["cp-color-model-label"])
    const labelD = _gui_.createElement("label", ["cp-color-model-label"])

    inputA.setAttribute("type", "text")
    inputB.setAttribute("type", "text")
    inputC.setAttribute("type", "text")
    inputD.setAttribute("type", "text")

    // Set labels' text
    const model = this.currentRepresentation.toUpperCase()
    labelA.textContent = model[0]
    labelB.textContent = model[1]
    labelC.textContent = model[2]
    labelD.textContent = "A"

    // Append child elements
    inputWrapper.appendChild(inputA)
    inputWrapper.appendChild(inputB)
    inputWrapper.appendChild(inputC)
    inputWrapper.appendChild(inputD)
    inputWrapper.appendChild(labelA)
    inputWrapper.appendChild(labelB)
    inputWrapper.appendChild(labelC)
    inputWrapper.appendChild(labelD)

    // Attach events
    inputA.addEventListener("focus", _event_.onFocusInput.bind(this))
    inputA.addEventListener("keydown", _event_.onKeyDownInputA.bind(this))
    inputA.addEventListener("input", _event_.onInputA.bind(this))
    inputA.addEventListener("change", _event_.onChangeInputA.bind(this))
    
    inputB.addEventListener("focus", _event_.onFocusInput.bind(this))
    inputB.addEventListener("keydown", _event_.onKeyDownInputB.bind(this))
    inputB.addEventListener("input", _event_.onInputB.bind(this))
    inputB.addEventListener("change", _event_.onChangeInputB.bind(this))
    
    inputC.addEventListener("focus", _event_.onFocusInput.bind(this))
    inputC.addEventListener("keydown", _event_.onKeyDownInputC.bind(this))
    inputC.addEventListener("input", _event_.onInputC.bind(this))
    inputC.addEventListener("change", _event_.onChangeInputC.bind(this))

    inputD.addEventListener("keydown", _event_.onKeyDownAlphaInput.bind(this));
    inputD.addEventListener("input", _event_.onKeyUpAlphaInput.bind(this));
    inputD.addEventListener("change", _event_.onChangeAlphaInput.bind(this));


    this.DOM["inputA"] = inputA
    this.DOM["inputB"] = inputB
    this.DOM["inputC"] = inputC
    this.DOM["inputAlpha"] = inputD

    return inputWrapper
  },
  updateOpacityThumb: function() {
    const { opacitySlider, opacityThumb } = this.DOM
    opacityThumb.style.translate = `${(this.__c.a * opacitySlider.offsetWidth)}px`
  },
  updateHueThumb: function() {
    const { hueThumb, hueSlider } = this.DOM
    hueThumb.style.translate = `${((this.__c.hsv.h / 360) * hueSlider.offsetWidth)}px`
  },
  setQuadrupedValue: function(a, b, c) {
    this.DOM["inputA"].value = a
    this.DOM["inputB"].value = b
    this.DOM["inputC"].value = c
    this.DOM["inputAlpha"].value = parseFloat(this.__c.a.toFixed(2))
  },
  updateHEXInput: function() {
    this.DOM["inputHEX"].value = this.__c.hex
  },
  updateSettingsView: function() {
    _gui_.updateInputsValue.call(this)
    _gui_.updateColorPreview.call(this, true)
  },
  updateInputs: function () {
    _gui_.buildInput.call(this)
    _gui_.updateInputsValue.call(this)
  },
  updateInputsValue: function() {
    switch (this.currentRepresentation) {
      case RGB: {
        const { r, g, b } = this.__c.rgb = this.__c.toRGB()
        _gui_.setQuadrupedValue.call(this, Math.round(r), Math.round(g), Math.round(b))
      } break;

      case HSV: {
        const { h, s, v } = this.__c.hsv
        _gui_.setQuadrupedValue.call(this, `${Math.round(h)}°`, `${Math.round(s)}%`, `${Math.round(v)}%`)
      } break;

      case HSL: {
        const { h, s, l } = this.__c.hsl = this.__c.toHSL()
        _gui_.setQuadrupedValue.call(this, `${Math.round(h)}°`, `${Math.round(s)}%`, `${Math.round(l)}%`)
      } break;

      case HEX: {
        _core_.updateHEXColor.call(this)
        _gui_.updateHEXInput.call(this)
      } break;
    }
  },
  updateColorPreview: function(fireEvent) {
    const alpha = this.__c.a
    const hsl = this.__c.toHSL()
    const { palette, opacitySlider, colorPreview } = this.DOM
    const paletteBGColor = `hsl(${hsl.h}deg 100% 50% / 1)`
    palette.style.backgroundImage = `linear-gradient(180deg, transparent 0%, rgba(0,0,0,1) 100%), linear-gradient(90deg, rgba(255,255,255,1) 0%, ${paletteBGColor} 100%)`
    const hslColor = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    opacitySlider.style.setProperty('background-image', `linear-gradient(90deg, transparent, ${hslColor})`)
    colorPreview.setAttribute("fill", hslColor)
    colorPreview.setAttribute("fill-opacity", alpha)
    if (fireEvent == true) {
      this.options.onInput.call(this)
    }
  },
  updateCursorThumb: function() {
    const { palette, cursor } = this.DOM
    const { s, v } = this.__c.hsv
    cursor.style.translate = `${((s / 100) * palette.offsetWidth)}px ${palette.offsetHeight - ((v / 100) * palette.offsetHeight)}px`
  },
  buildCopyColor: function() {
    const copyColorWrapper = _gui_.createElement("span")
    const copyColor = _gui_.createElement("button", ["cp-clipboard-color"])
    const hiddenInput = _gui_.createElement("input")
    copyColor.style.setProperty("background-image", this.copyIcon)
    copyColor.addEventListener("click", _event_.onClickCopyColor.bind(this))
    hiddenInput.setAttribute("tabindex", "-1")
    hiddenInput.setAttribute("style", "opacity: 0 !important;position: absolute !important;pointer-events: none !important")

    copyColorWrapper.appendChild(copyColor)
    copyColorWrapper.appendChild(hiddenInput)

    this.DOM["copyColor"] = copyColor
    this.DOM["hiddenInput"] = hiddenInput

    return copyColorWrapper
  },
  buildColorSliders: function() {
    const sliders = _gui_.createElement("div", ["cp-sliders"])
    
    // Build hue slider
    sliders.appendChild(_gui_.buildHueSlider.call(this))
    // Build hue slider
    sliders.appendChild(_gui_.buildOpacitySlider.call(this))

    return sliders
  },
  buildHueSlider: function() {
    // Create elements
    const sliderWrapper = _gui_.createElement("div", ["cp-hue-slider-wrapper"])
    const slider = _gui_.createElement("div", ["cp-hue-slider"])
    const sliderThumb = _gui_.createElement("a", ["cp-hue-slider-thumb"])
    sliderThumb.setAttribute("tabindex", "0")

    // Appench child element
    sliderWrapper.appendChild(slider)
    sliderWrapper.appendChild(sliderThumb)

    // Attach events
    this.__onMouseDownHueSlider = _event_.onMouseDownHueSlider.bind(this)
    this.__onMouseUpHueSlider = _event_.onMouseUpHueSlider.bind(this)
    this.__onMouseMoveHueSlider = _event_.onMouseMoveHueSlider.bind(this)
    sliderWrapper.addEventListener('mousedown', this.__onMouseDownHueSlider)
    sliderThumb.addEventListener('keydown', _event_.onKeyDownHueSlider.bind(this))

    this.DOM["hueSlider"] = slider
    this.DOM["hueThumb"] = sliderThumb

    return sliderWrapper
  },
  buildOpacitySlider: function() {
    // Create elements
    const sliderWrapper = _gui_.createElement("div", ["cp-opacity-slider-wrapper"])
    const color = _gui_.createElement("div", ["cp-opacity-color"])
    const sliderThumb = _gui_.createElement("a", ["cp-opacity-slider-thumb"])
    sliderThumb.setAttribute("tabindex", "0")

    // Appench child element
    sliderWrapper.appendChild(color)
    sliderWrapper.appendChild(sliderThumb)

    // Attach events
    this.__onMouseDownOpacitySlider = _event_.onMouseDownOpacitySlider.bind(this)
    this.__onMouseUpOpacitySlider = _event_.onMouseUpOpacitySlider.bind(this)
    this.__onMouseMoveOpacitySlider = _event_.onMouseMoveOpacitySlider.bind(this)
    sliderWrapper.addEventListener('mousedown', this.__onMouseDownOpacitySlider)
    sliderThumb.addEventListener('keydown', _event_.onKeyDownOpacitySlider.bind(this))

    this.DOM["opacitySlider"] = color
    this.DOM["opacityThumb"] = sliderThumb

    return sliderWrapper
  },
  buildColorPreview: function() {
    const colorPreviewWrapper = _gui_.createElement("span", ["cp-color-preview-wrapper"])

    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svgElement.setAttribute("width", 38)
    svgElement.setAttribute("height", 38)

    const colorPreview = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    colorPreview.setAttribute("cx", 19)
    colorPreview.setAttribute("cy", 19)
    colorPreview.setAttribute("r", 18)
    colorPreview.setAttribute("stroke", "gray")

    svgElement.innerHTML = '<defs><pattern id="transparent-grid" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse"><path fill="#DBDBDB" d="M0 0h3v3H0z"/><path fill="#fff" d="M3 0h3v3H3z"/><path fill="#DBDBDB" d="M3 3h3v3H3z"/><path fill="#fff" d="M0 3h3v3H0z"/></pattern></defs><circle cx="19" cy="19" r="18" fill="url(#transparent-grid)"/>'
    svgElement.appendChild(colorPreview)
    colorPreviewWrapper.appendChild(svgElement)

    this.DOM.colorPreview = colorPreview

    return colorPreviewWrapper
  },
  createElement: function(tag, classList) {
    const el = document.createElement(tag)
    if (classList != null) {
      el.classList.add(...classList)
    }
    return el
  },
  rgbUpdateView: function() {
    _gui_.updateColorPreview.call(this, true)
    _gui_.updateHueThumb.call(this)
    _gui_.updateCursorThumb.call(this)
  },
  updateHEXColorSection: function(color, event, con, conValue, op, startSelect, endSelect) {
    const { target } = event
    const { rgb, hex } = this.__c
    if (con(rgb[color], conValue)) {
      rgb[color] = op(rgb[color], 1)
      this.__c.hex = hex.substring(0, startSelect) + _util_.hexPad2(rgb[color]) + hex.substring(endSelect)
      const { r, g, b } = rgb
      this.__c.hsv = this.__c.RGBtoHSV(r, g, b)
      _gui_.rgbUpdateView.call(this)
    }
    target.value = this.__c.hex
    target.setSelectionRange(startSelect, endSelect)
    event.preventDefault()
  },
  updateHEXAlphaSection: function(event, con, conValue, op) {
    const { target } = event
    const { hex, a } = this.__c
    if (con(a, conValue)) {
      this.__c.a = parseFloat(op(a, 0.01).toFixed(2))
      target.value = this.__c.hex = hex.substring(0, 7) + _util_.hexPad2(this.__c.a * 255)
      _gui_.updateColorPreview.call(this, true)
      _gui_.updateOpacityThumb.call(this)
    }
    target.value = this.__c.hex
    target.setSelectionRange(7, 9)
    event.preventDefault()
  },
  updateOpacityValue: function(value) {
    this.__c.a = parseFloat(value.toFixed(2))
    if (this.currentRepresentation == HEX) {
      _core_.updateHEXColor.call(this)
      _gui_.updateHEXInput.call(this)
    }
    else {
      this.DOM.inputAlpha.value = this.__c.a
    }
    _gui_.updateColorPreview.call(this, true)
  },
  updatePosition: function() {
    let { x, y } = _core_.getPositionAxis.call(this)
    x = x < 0 ? 0 : x
    y = y < 0 ? 0 : y
    _core_.setPositionAxis.call(this, {x, y})
  },
  attachToContainer: function() {
    const container = document.getElementById(this.options.container)
    if (container == null) {
      throw ReferenceError("ColorPicker:: container to set color picker is undefined")
    }
    this.DOM.overlayWrapper.classList.add("cp-overlay-wrapper--static")
    container.appendChild(this.DOM.overlayWrapper)
    if (this.__c == null) {
      this.color = this.options.color
    }
    _gui_.updateGUI.call(this)
    this.isOpen = true
  },
  attachToBody: function() {
		if (this.__c == null) {
      this.color = this.options.color
		}
		this.DOM.overlayWrapper.classList.remove("cp-overlay-wrapper--static")
		document.body.appendChild(this.DOM.overlayWrapper)
		_gui_.updateGUI.call(this)
		_gui_.updatePosition.call(this)
		window.addEventListener("resize", this.__onResizeScrollWindow)
		window.addEventListener("scroll", this.__onResizeScrollWindow)
		document.addEventListener("keyup", this.__onKeyUpClose)
		document.addEventListener("click", this.__onClickClose)
    this.isOpen = true
  },
  detachFromBody: function() {
    const parent = this.DOM.overlayWrapper.parentElement
    if (parent != null) {
      window.removeEventListener("resize", this.__onResizeScrollWindow)
      window.removeEventListener("scroll", this.__onResizeScrollWindow)
      document.removeEventListener("keyup", this.__onKeyUpClose)
      document.removeEventListener("click", this.__onClickClose)
      parent.removeChild(this.DOM.overlayWrapper)
      this.isOpen = false
    }
  },
}

const _event_ = {
  onClickTarget: function(event) {
    event.stopPropagation();
    switch (this.isOpen) {
      case false:
        this.open();
        break;
      case true:
        this.close();
        break;
    }
  },
  onMouseDownCursor: function(event) {
    this.__dc = true
    document.addEventListener("mousemove", this.__onMouseMoveCursor);
    document.addEventListener("mouseup", this.__onMouseUpCursor);
    this.__onMouseMoveCursor(event);
  },
  onMouseUpCursor: function(e) {
    document.removeEventListener("mousemove", this.__onMouseMoveCursor);
    document.removeEventListener("mouseup", this.__onMouseUpCursor);
    if (this.DOM.overlayWrapper.contains(e.target)) {
      this.__dc = false
    }
  },
  onMouseMoveCursor: function(event) {
    const { x, y } = _core_.getCursorPosition.call(this, event.clientX, event.clientY)
    this.DOM.cursor.style.translate = `${x}px ${y}px`
    const paletteHeight = this.DOM.palette.offsetHeight
    const paletteWidth = this.DOM.palette.offsetWidth
    this.__c.hsv.s = (x / paletteWidth) * 100
    this.__c.hsv.v = ((paletteHeight - y) / paletteHeight) * 100
    _gui_.updateSettingsView.call(this)
  },
  onClickInputsSwitch: function() {
    switch (this.currentRepresentation) {
      case RGB:
        this.currentRepresentation = HSV
        break
      case HSV:
        this.currentRepresentation = HSL
        break
      case HSL:
        this.currentRepresentation = HEX
        break
      case HEX:
        this.currentRepresentation = RGB
        break
    }
  },
  onFocusInput: function() {
    switch (this.currentRepresentation) {
      case RGB:
        this.__c.rgb = this.getRGB()
      break
      case HSV:
        this.__c.hsv = this.getHSV()
      break
      case HSL:
        this.__c.hsl = this.getHSL()
      break
      case HEX:
        _core_.updateHEXColor.call(this)
      break
    }
  },
  onKeyDownAlphaInput: function(event) {
    const { target, key } = event
    const { a } = this.__c
    switch (key) {
      case "ArrowUp": {
        if(a < 1) {
          let alphaValue = parseFloat((a + 0.01).toFixed(2))
          if (alphaValue > 1) {
            alphaValue = 1
          }
          target.value = this.__c.a = alphaValue
          _gui_.updateColorPreview.call(this, true)
          _gui_.updateOpacityThumb.call(this)
        }
      } break;
      
      case "ArrowDown": {
        if(a > 0) {
          let alphaValue = parseFloat((a - 0.01).toFixed(2))
          if (alphaValue < 0) {
            alphaValue = 0
          }
          target.value = this.__c.a = alphaValue
          _gui_.updateColorPreview.call(this, true)
          _gui_.updateOpacityThumb.call(this)
        }
      } break;
      
      case ".": {
        if(/(\.)/.test(target.value)) {
          event.preventDefault()
        }
      } break;
    }
  },
  onKeyUpAlphaInput: function(event) {
    const { target } = event
    if (/^(0(\.\d{1,2})?|(0*)1?)$/.test(target.value) || target.value == "") {
      const value = parseFloat(target.value) || 0
      if(!isNaN(value) && value >= 0 && value <= 1) {
        this.__c.a = value
        _gui_.updateColorPreview.call(this, true)
        _gui_.updateOpacityThumb.call(this)
      }
    }
  },
  onChangeAlphaInput: function(event) {
    event.target.value = this.__c.a
  },
  onKeyDownInputHEX: function(event) {
    const { target, key } = event
    switch (key) {
      case "ArrowUp": {
        if (!/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(target.value)) {
          target.value = this.__c.hex
        }
        const caret = _core_.getCaretPosition(target)
        const length = target.value.length
        if (length <= 5) {
          if (caret < 2) {
            _gui_.updateHEXColorSection.call(this, 'r', event, _util_.lt, 255, _util_.add, 1, 3)
          }
          else if (caret < 3) {
            _gui_.updateHEXColorSection.call(this, 'g', event, _util_.lt, 255, _util_.add, 3, 5)
          }
          else if ((caret <= 4 && length <= 4) || caret < 4) {
            _gui_.updateHEXColorSection.call(this, 'b', event, _util_.lt, 255, _util_.add, 5, 7)
          }
          else if (caret <= 5) {
            _gui_.updateHEXAlphaSection.call(this, event, _util_.lt, 1, _util_.add)
          }
        }
        else {
          if (caret < 3) {
            _gui_.updateHEXColorSection.call(this, 'r', event, _util_.lt, 255, _util_.add, 1, 3)
          }
          else if (caret < 5) {
            _gui_.updateHEXColorSection.call(this, 'g', event, _util_.lt, 255, _util_.add, 3, 5)
          }
          else if ((caret <= 7 && length == 7) || caret < 7) {
            _gui_.updateHEXColorSection.call(this, 'b', event, _util_.lt, 255, _util_.add, 5, 7)
          }
          else if (caret <= 9) {
            _gui_.updateHEXAlphaSection.call(this, event, _util_.lt, 1, _util_.add)
          }
        }
      } break
      case "ArrowDown": {
        if (!/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(target.value)) {
          target.value = this.__c.hex
        }
        const caret = _core_.getCaretPosition(target)
        const length = target.value.length
        if (length <= 5) {
          if (caret < 2) {
            _gui_.updateHEXColorSection.call(this, 'r', event, _util_.gt, 0, _util_.sub, 1, 3)
          }
          else if (caret < 3) {
            _gui_.updateHEXColorSection.call(this, 'g', event, _util_.gt, 0, _util_.sub, 3, 5)
          }
          else if ((caret <= 4 && length <= 4) || caret < 4) {
            _gui_.updateHEXColorSection.call(this, 'b', event, _util_.gt, 0, _util_.sub, 5, 7)
          }
          else if (caret <= 5) {
            _gui_.updateHEXAlphaSection.call(this, event, _util_.gt, 0, _util_.sub)
          }
        }
        else {
          if (caret < 3) {
            _gui_.updateHEXColorSection.call(this, 'r', event, _util_.gt, 0, _util_.sub, 1, 3)
          }
          else if (caret < 5) {
            _gui_.updateHEXColorSection.call(this, 'g', event, _util_.gt, 0, _util_.sub, 3, 5)
          }
          else if ((caret <= 7 && length == 7) || caret < 7) {
            _gui_.updateHEXColorSection.call(this, 'b', event, _util_.gt, 0, _util_.sub, 5, 7)
          }
          else if (caret <= 9) {
            _gui_.updateHEXAlphaSection.call(this, event, _util_.gt, 0, _util_.sub)
          }
        }
      } break
    }
  },
  onInputHEX: function(event) {
    const rgb = this.__c.HEXtoRGBA(event.target.value.trim())
    if (rgb != null) {
      const { r, g, b, a } = rgb
      this.__c.a = a
      this.__c.rgb = { r, g, b }
      this.__c.hex = this.__c.RGBAtoHEX(r, g, b, a)
      this.__c.hsv = this.__c.RGBtoHSV(r, g, b)
      _gui_.updateColorPreview.call(this, true)
      _gui_.updateHueThumb.call(this)
      _gui_.updateOpacityThumb.call(this)
      _gui_.updateCursorThumb.call(this)
    }
  },
  onChangeInputHEX: function(event) {
    event.target.value = this.__c.hex
  },
  onKeyDownInputA: function(event) {
    const { target, key } = event
    switch (key) {
      case "ArrowUp": {
        switch (this.currentRepresentation) {
          case RGB: {
            let { r, g, b } = this.__c.rgb
            r = Math.round(r)
            if (r < 255) {
              this.__c.rgb.r = target.value = ++r
              this.__c.hsv = this.__c.RGBtoHSV(r, g, b)
              _gui_.rgbUpdateView.call(this)
            }
          } break
      
          case HSV:
          case HSL: {
            let { h } = this.__c.hsv
            h = Math.round(h)
            if (h < 360) {
              target.value = ++h + "°"
              this.__c.hsv.h = this.__c.hsl.h = h
              _gui_.updateColorPreview.call(this, true)
              _gui_.updateHueThumb.call(this)
            }
          } break
        }
      } break
      case "ArrowDown": {
        switch (this.currentRepresentation) {
          case RGB: {
            let { r, g, b } = this.__c.rgb
            r = Math.round(r)
            if (r > 0) {
              this.__c.rgb.r = target.value = --r
              this.__c.hsv = this.__c.RGBtoHSV(r, g, b)
              _gui_.rgbUpdateView.call(this)
            }
          } break
      
          case HSV:
          case HSL: {
            let { h } = this.__c.hsv
            h = Math.round(h)
            if (h > 0) {
              target.value = --h + "°"
              this.__c.hsv.h = this.__c.hsl.h = h
              _gui_.updateColorPreview.call(this, true)
              _gui_.updateHueThumb.call(this)
            }
          } break
        }
      } break
    }
  },
  onInputA: function(event) {
    const value = parseInt(event.target.value || 0)
    if (/^(\d{1,3})(°?)$/.test(value)) {
      switch (this.currentRepresentation) {
        case RGB: {
          const { g, b } = this.__c.rgb
          if(!isNaN(value) && value >= 0 && value <= 255) {
            this.__c.rgb.r = value
            this.__c.hsv = this.__c.RGBtoHSV(value, g, b)
            _gui_.updateColorPreview.call(this, true)
            _gui_.updateHueThumb.call(this)
            _gui_.updateCursorThumb.call(this)
          }
        } break

        case HSV:
        case HSL: {
          if (!isNaN(value) && value >= 0 && value <= 360) {
            this.__c.hsv.h = this.__c.hsl.h = value
            _gui_.updateColorPreview.call(this, true)
            _gui_.updateHueThumb.call(this)
          }
        } break
      }
    }
  },
  onChangeInputA: function(event) {
    let value = event.target.value
    switch (this.currentRepresentation) {
      case RGB: {
        value = Math.round(this.__c.rgb.r)
      } break
      
      case HSV:
      case HSL: {
        value = `${Math.round(this.__c.hsv.h)}°`
      } break
    }
    event.target.value = value
  },
  onKeyDownInputB: function(event) {
    const { target, key } = event
    switch (key) {
      case "ArrowUp": {
        switch (this.currentRepresentation) {
          case RGB: {
            let { r, g, b } = this.__c.rgb
            g = Math.round(g)
            if (g < 255) {
              this.__c.rgb.g = target.value = ++g
              this.__c.hsv = this.__c.RGBtoHSV(r, g, b)
              _gui_.rgbUpdateView.call(this)
            }
          } break
      
          case HSV: {
            let { s } = this.__c.hsv
            s = Math.round(s)
            if (s < 100) {
              target.value = ++s + "%"
              this.__c.hsv.s = s
              _gui_.updateColorPreview.call(this, true)
              _gui_.updateCursorThumb.call(this)
            }
          } break

          case HSL: {
            const { h, s, l } = this.__c.hsl
            let hsl_s = Math.round(s)
            if (hsl_s < 100) {
              target.value = ++hsl_s + "%"
              this.__c.hsl.s = hsl_s
              this.__c.hsv.s = this.__c.HSLtoHSV(h, hsl_s, l).s
              _gui_.updateColorPreview.call(this, true)
              _gui_.updateCursorThumb.call(this)
            }
          } break
        }
      } break;
      case "ArrowDown": {
        switch (this.currentRepresentation) {
          case RGB: {
            let { r, g, b } = this.__c.rgb
            g = Math.round(g)
            if (g > 0) {
              this.__c.rgb.g = target.value = --g
              this.__c.hsv = this.__c.RGBtoHSV(r, g, b)
              _gui_.rgbUpdateView.call(this)
            }
          } break
      
          case HSV: {
            let { s } = this.__c.hsv
            s = Math.round(s)
            if (s > 0) {
              target.value = --s + "%"
              this.__c.hsv.s = s
              _gui_.updateColorPreview.call(this, true)
              _gui_.updateCursorThumb.call(this)
            }
          } break

          case HSL: {
            const { h, s, l } = this.__c.hsl
            let hsl_s = Math.round(s)
            if (hsl_s > 0) {
              target.value = --hsl_s + "%"
              this.__c.hsl.s = hsl_s
              this.__c.hsv.s = this.__c.HSLtoHSV(h, hsl_s, l).s
              _gui_.updateColorPreview.call(this, true)
              _gui_.updateCursorThumb.call(this)
            }
          } break
        }
      } break;
    }
  },
  onInputB: function(event) {
    const value = parseInt(event.target.value || 0)
    if (/^(\d{1,3})(%?)$/.test(value)) {
      switch (this.currentRepresentation) {
        case RGB: {
          const { r, b } = this.__c.rgb
          if(!isNaN(value) && value >= 0 && value <= 255) {
            this.__c.rgb.g = value
            this.__c.hsv = this.__c.RGBtoHSV(r, value, b)
            _gui_.updateColorPreview.call(this, true)
            _gui_.updateHueThumb.call(this)
            _gui_.updateCursorThumb.call(this)
          }
        } break

        case HSV: {
          if(!isNaN(value) && value >= 0 && value <= 100) {
            this.__c.hsv.s = value
            _gui_.updateColorPreview.call(this, true)
            _gui_.updateCursorThumb.call(this)
          }
        } break

        case HSL: {
          const { h, l } = this.__c.hsl
          if(!isNaN(value) && value >= 0 && value <= 100) {
            this.__c.hsl.s = value
            this.__c.hsv = this.__c.HSLtoHSV(h, value, l)
            _gui_.updateColorPreview.call(this, true)
            _gui_.updateCursorThumb.call(this)
          }
        } break
      }
    }
  },
  onChangeInputB: function(event) {
    let value = event.target.value
    switch (this.currentRepresentation) {
      case RGB: {
        value = Math.round(this.__c.rgb.g)
      } break
      
      case HSV: {
        value = `${Math.round(this.__c.hsv.s)}%`
      } break

      case HSL: {
        value = `${Math.round(this.__c.hsl.s)}%`
      } break
    }
    event.target.value = value
  },
  onKeyDownInputC: function(event) {
    const { target, key } = event
    switch (key) {
      case "ArrowUp": {
        switch (this.currentRepresentation) {
          case RGB: {
            let { r, g, b } = this.__c.rgb
            b = Math.round(b)
            if (b < 255) {
              this.__c.rgb.b = target.value = ++b
              this.__c.hsv = this.__c.RGBtoHSV(r, g, b)
              _gui_.rgbUpdateView.call(this)
            }
          } break
      
          case HSV: {
            let { v } = this.__c.hsv
            v = Math.round(v)
            if (v < 100) {
              target.value = ++v + "%"
              this.__c.hsv.v = v
              _gui_.updateColorPreview.call(this, true)
              _gui_.updateCursorThumb.call(this)
            }
          } break

          case HSL: {
            const { h, s, l } = this.__c.hsl
            let hsl_l = Math.round(l)
            if (hsl_l < 100) {
              target.value = ++hsl_l + "%"
              this.__c.hsl.l = hsl_l
              this.__c.hsv.v = this.__c.HSLtoHSV(h, s, hsl_l).v
              _gui_.updateColorPreview.call(this, true)
              _gui_.updateCursorThumb.call(this)
            }
          } break
        }
      } break;
      case "ArrowDown": {
        switch (this.currentRepresentation) {
          case RGB: {
            let { r, g, b } = this.__c.rgb
            b = Math.round(b)
            if (b > 0) {
              this.__c.rgb.b = target.value = --b
              this.__c.hsv = this.__c.RGBtoHSV(r, g, b)
              _gui_.rgbUpdateView.call(this)
            }
          } break
      
          case HSV: {
            let { v } = this.__c.hsv
            v = Math.round(v)
            if (v > 0) {
              target.value = --v + "%"
              this.__c.hsv.v = v
              _gui_.updateColorPreview.call(this, true)
              _gui_.updateCursorThumb.call(this)
            }
          } break

          case HSL: {
            const { h, s, l } = this.__c.hsl
            let hsl_l = Math.round(l)
            if (l > 0) {
              target.value = --hsl_l + "%"
              this.__c.hsl.l = hsl_l
              this.__c.hsv.v = this.__c.HSLtoHSV(h, s, hsl_l).v
              _gui_.updateColorPreview.call(this, true)
              _gui_.updateCursorThumb.call(this)
            }
          } break
        }
      } break;
    }
  },
  onInputC: function(event) {
    const value = parseInt(event.target.value || 0)
    if(/^(\d{1,3})(%?)$/.test(value)) {
      switch (this.currentRepresentation) {
        case RGB: {
          const { r, g } = this.__c.rgb
          if(!isNaN(value) && value >= 0 && value <= 255) {
            this.__c.rgb.b = value
            this.__c.hsv = this.__c.RGBtoHSV(r, g, value)
            _gui_.updateColorPreview.call(this, true)
            _gui_.updateHueThumb.call(this)
            _gui_.updateCursorThumb.call(this)
          }
        } break

        case HSV: {
          if(!isNaN(value) && value >= 0 && value <= 100) {
            this.__c.hsv.v = value
            _gui_.updateColorPreview.call(this, true)
            _gui_.updateCursorThumb.call(this)
          }
        } break

        case HSL: {
          const { h, s } = this.__c.hsl
          if(!isNaN(value) && value >= 0 && value <= 100) {
            this.__c.hsl.l = value
            this.__c.hsv = this.__c.HSLtoHSV(h, s, value)
            _gui_.updateColorPreview.call(this, true)
            _gui_.updateCursorThumb.call(this)
          }
        } break
      }
    }
  },
  onChangeInputC: function(event) {
    let value = event.target.value
    switch (this.currentRepresentation) {
      case RGB: {
        value = Math.round(this.__c.rgb.b)
      } break
      
      case HSV: {
        value = `${Math.round(this.__c.hsv.v)}%`
      } break
      
      case HSL: {
        value = `${Math.round(this.__c.hsl.l)}%`
      } break
    }
    event.target.value = value
  },
  onClickCopyColor: function() {
    this.DOM.hiddenInput.value = _core_.getColorText.call(this)
    this.DOM.hiddenInput.select()
    document.execCommand('copy')
    this.options.onCopy.call(this)
    this.DOM.copyColor.style.setProperty("background-image", `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='14' height='14'%3E%3Cpath fill='%23bcbcbc' d='M15.2 4.7c.3-.3.2-.7-.1-1l-.8-.8c-.3-.3-.7-.2-1 .1l-6.7 7.5-4.1-3.8c-.3-.3-.7-.2-1 .1l-.8.8c-.3.3-.2.7.1 1l5.5 5c.3.3.7.2 1-.1l7.9-8.8z'/%3E%3C/svg%3E")`)
    
    setTimeout(()=>{
      this.DOM.copyColor.style.setProperty("background-image", this.copyIcon)
    }, 600);
  },
  onMouseDownHueSlider: function(event) {
    event.preventDefault() // prevent default to set focus on the thumb
    this.__dc = true
    document.addEventListener('mousemove', this.__onMouseMoveHueSlider)
    document.addEventListener('mouseup', this.__onMouseUpHueSlider)
    this.DOM.hueThumb.focus()
    this.__onMouseMoveHueSlider(event)
  },
  onMouseUpHueSlider: function(e) {
    document.removeEventListener('mousemove', this.__onMouseMoveHueSlider)
    document.removeEventListener('mouseup', this.__onMouseUpHueSlider)
    if (this.DOM.overlayWrapper.contains(e.target)) {
      this.__dc = false
    }
  },
  onMouseMoveHueSlider: function(event) {
    const { hueSlider, hueThumb } = this.DOM
    const sliderRect = hueSlider.getBoundingClientRect()
    const sliderWidth = sliderRect.width
    let thumbX = (event.clientX - sliderRect.left)

    if(thumbX < 0) {
      thumbX = 0
    }
    if(thumbX > sliderWidth) {
      thumbX = sliderWidth
    }

    this.__c.hsv.h = (thumbX / sliderRect.width) * 360
    hueThumb.style.translate = `${thumbX}px`

    _gui_.updateSettingsView.call(this)
  },
  onMouseDownOpacitySlider: function(event) {
    event.preventDefault() // prevent default to set focus on the thumb
    this.__dc = true
    document.addEventListener('mousemove', this.__onMouseMoveOpacitySlider)
    document.addEventListener('mouseup', this.__onMouseUpOpacitySlider)
    this.DOM.opacityThumb.focus()
    this.__onMouseMoveOpacitySlider(event)
  },
  onMouseUpOpacitySlider: function(e) {
    document.removeEventListener('mousemove', this.__onMouseMoveOpacitySlider)
    document.removeEventListener('mouseup', this.__onMouseUpOpacitySlider)
    if (this.DOM.overlayWrapper.contains(e.target)) {
      this.__dc = false
    }
  },
  onMouseMoveOpacitySlider: function(event) {
    const { opacitySlider, opacityThumb } = this.DOM
    const opacitySliderRect = opacitySlider.getBoundingClientRect()
    const sliderWidth = opacitySliderRect.width
    let thumbX = (event.clientX - opacitySliderRect.left)
    opacityThumb.focus()
    
    if(thumbX < 0) {
      thumbX = 0
    }
    if(thumbX > sliderWidth) {
      thumbX = sliderWidth
    }

    opacityThumb.style.translate = `${thumbX}px`
    _gui_.updateOpacityValue.call(this, (thumbX / sliderWidth))
  },
  onKeyDownHueSlider: function(event) {
    const { key } = event
    switch (key) {
      case "ArrowUp":
      case "ArrowRight": {
        const { hueThumb, hueSlider } = this.DOM
        let position = parseInt(hueThumb.style.translate)
        if (!isNaN(position) && position < hueSlider.offsetWidth) {
          hueThumb.style.translate = `${++position}px`
          this.__c.hsv.h = (position / hueSlider.offsetWidth) * 360
          _gui_.updateSettingsView.call(this)
        }
        event.preventDefault()
      } break
      
      case "ArrowDown":
      case "ArrowLeft": {
        const { hueThumb, hueSlider } = this.DOM
        let position = parseInt(hueThumb.style.translate)
        if (!isNaN(position) && position > 0) {
          hueThumb.style.translate = `${--position}px`
          this.__c.hsv.h = (position / hueSlider.offsetWidth) * 360
          _gui_.updateSettingsView.call(this)
        }
        event.preventDefault()
      } break
    }
  },
  onKeyDownOpacitySlider: function(event) {
    const { key } = event
    switch (key) {
      case "ArrowUp":
      case "ArrowRight": {
        const { opacityThumb, opacitySlider } = this.DOM
        let position = parseInt(opacityThumb.style.translate)
        if (!isNaN(position) && position < opacitySlider.offsetWidth) {
          opacityThumb.style.translate = `${++position}px`
          _gui_.updateOpacityValue.call(this, (position / opacitySlider.offsetWidth))
        }
        event.preventDefault()
      } break
      
      case "ArrowDown":
      case "ArrowLeft": {
        const { opacityThumb, opacitySlider } = this.DOM
        let position = parseInt(opacityThumb.style.translate)
        if (!isNaN(position) && position > 0) {
          opacityThumb.style.translate = `${--position}px`
          _gui_.updateOpacityValue.call(this, (position / opacitySlider.offsetWidth))
        }
        event.preventDefault()
      } break
    }
  },
  onKeyUpClose: function(event) {
    if (event.key == this.options.closeKey) {
      this.close()
    }
  },
  onResizeScrollWindow: function(event) {
    const { type } = event
    const { closeOnScroll, closeOnResize } = this.options
    if ((type == "scroll" && closeOnScroll) || (type == "resize" && closeOnResize)) {
      this.close()
    }
    else {
      let { x, y } = _core_.getPositionAxis.call(this)
      if (type != "scroll") {
        x = x < 0 ? 0 : x
        y = y < 0 ? 0 : y
      }
      _core_.setPositionAxis.call(this, {x, y})
    }
  }
}
/**
 * 
 * @param {number} h Hue
 * @param {number} s Saturate
 * @param {number} v Value
 * @param {number} a Alpha
 */
function Color(h, s, v, a) {
  this.a = a
  
  this.hsv = { h, s, v }
  this.rgb = this.toRGB()
  this.hsl = this.toHSL()
  this.hex = this.toHEX()
}

Color.prototype.toRGB = function () {
	let { h, s, v } = this.hsv

	h /= 360
	s /= 100
	v /= 100

	var r, g, b, i, f, p, q, t
	i = Math.floor(h * 6)
	f = h * 6 - i
	p = v * (1 - s)
	q = v * (1 - f * s)
	t = v * (1 - (1 - f) * s)
	switch (i % 6) {
		case 0:
			(r = v), (g = t), (b = p)
			break;
		case 1:
			(r = q), (g = v), (b = p)
			break;
		case 2:
			(r = p), (g = v), (b = t)
			break;
		case 3:
			(r = p), (g = q), (b = v)
			break;
		case 4:
			(r = t), (g = p), (b = v)
			break;
		case 5:
			(r = v), (g = p), (b = q)
			break;
	}
	return {
		r: r * 255,
		g: g * 255,
		b: b * 255
	};
}

Color.prototype.toHSL = function () {
	let { h, s, v } = this.hsv
	let _saturation = s * 0.01
	let _value = v * 0.01

	let _lightness = _value - (_value * _saturation) / 2
	let _saturate = NaN

	if (_lightness == 0 || _lightness == 1) {
		_saturate = 0
	} else {
		_saturate =
			((_value - _lightness) / Math.min(_lightness, 1 - _lightness)) * 100
	}

	let l = _lightness * 100
	s = _saturate

	return {
		h,
		s: s,
		l: l
	};
}

Color.prototype.toHEX = function () {
	let { r, g, b } = this.toRGB()
	return this.RGBAtoHEX(r, g, b, this.a)
}

Color.prototype.RGBtoHSV = function(r, g, b) {
	r /= 255, g /= 255, b /= 255

	let max = Math.max(r, g, b), min = Math.min(r, g, b)
	let h, s, v = max

	let d = max - min
	s = max == 0 ? 0 : d / max

	if (max == min) {
		h = 0
	} else {
		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break
			case g: h = (b - r) / d + 2; break
			case b: h = (r - g) / d + 4; break
		}

		h /= 6
	}

	h = h * 360
	s = s * 100
	v = v * 100

	return { h, s, v }
}

Color.prototype.HSLtoHSV = function(h, s, l) {
	const hsv1 = s * (l < 50 ? l : 100 - l) / 100

	return {
		h,
		s: hsv1 === 0 ? 0 : 2 * hsv1 / (l + hsv1) * 100,
		v: l + hsv1
	}
}

Color.prototype.HEXtoRGBA = function(hex) {
	let r = 0, g = 0, b = 0, a = 0
	
	if(/^#(([a-f0-9]){3,4}|([a-f0-9]){6}|([a-f0-9]){8})$/i.test(hex)) {
    if (hex.length < 6) {
      const splitHexValues = hex.split("");
      r = +("0x" + splitHexValues[1] + splitHexValues[1])
      g = +("0x" + splitHexValues[2] + splitHexValues[2])
      b = +("0x" + splitHexValues[3] + splitHexValues[3])
      a = (splitHexValues[4] ? parseFloat((+("0x" + splitHexValues[4] + splitHexValues[4]) / 255).toFixed(2)) : 1)
    }
    else if (hex.length < 10) {
      const splitHexValues = hex.split(/([a-f0-9]{2})/i)
      r = +("0x" + splitHexValues[1])
      g = +("0x" + splitHexValues[3])
      b = +("0x" + splitHexValues[5])
      a = (splitHexValues[7] ? parseFloat((+("0x" + splitHexValues[7]) / 255).toFixed(2)) : 1)
    }
    
		return { r, g, b, a }
	}
}

Color.prototype.RGBAtoHEX = function(r, g, b, a) {
	r = _util_.hexPad2(Math.round(r))
	g = _util_.hexPad2(Math.round(g))
	b = _util_.hexPad2(Math.round(b))
  a = (a == 1) ? "" : _util_.hexPad2(Math.round(a * 255))

	return "#" + r + g + b + a
}