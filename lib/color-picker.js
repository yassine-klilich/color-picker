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
	position: BOTTOM,
	positionFlipOrder: "rltb",
	representation: RGB,
  color: "red",
	closeKey: "Escape",
  closeOnScroll: true,
  closeOnResize: true,
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

	if (target == null) {
		throw new ReferenceError("ERROR::[ColorPicker] target option is defined");
	}

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
          const { r, g, b, a } = this.__c.rgb
          return { r: Math.round(r), g: Math.round(g), b: Math.round(b), a }
        }

        case HSV: {
          const { h, s, v, a } = this.__c.hsv
          return { h: Math.round(h), s: Math.round(s), l: Math.round(v), a }
        }

        case HSL: {
          const { h, s, l, a } = this.__c.hsl
          return { h: Math.round(h), s: Math.round(s), l: Math.round(l), a }
        }

        case HEX: return this.getHEX()
      }
    },
		set: function(value) {
      //_currentRepresentation = value
    },
	})

	// init click and enter key to target
	target.addEventListener("click", (event) => _event_.onClickTarget.call(this, event))

	_gui_.initDOM.call(this)
}

ColorPicker.prototype.open = function () {
	this.isOpen = true
  if (this.__c == null) {
    const { h, s, v, a } = ColorParser.parse(this.options.color)
    this.__c = new Color(h, s, v, a)
  }
	document.body.appendChild(this.DOM.overlayContainer)
  _gui_.updateGUI.call(this)
  _gui_.updatePosition.call(this)
  window.addEventListener("resize", this.__onResizeScrollWindow)
  window.addEventListener("scroll", this.__onResizeScrollWindow)
	document.addEventListener("keyup", this.__onKeyUpClose)
  this.options.onOpen.call(this)
}

ColorPicker.prototype.close = function () {
	this.isOpen = false
  if (document.body.contains(this.DOM.overlayContainer)) {
    window.removeEventListener("resize", this.__onResizeScrollWindow)
    window.removeEventListener("scroll", this.__onResizeScrollWindow)
		document.removeEventListener("keyup", this.__onKeyUpClose)
    document.body.removeChild(this.DOM.overlayContainer)
    this.options.onClose.call(this)
  }
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
