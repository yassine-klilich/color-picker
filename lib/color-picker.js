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
})

function ColorPicker(options) {
	this.options = _util_.buildOptions(DefaultOptions, options);

  const { target } = this.options;

	this._dom = { target }
	this.isOpen = false
	let _currentRepresentation = this.options.representation
	this.__c = null

	Object.defineProperty(this, "currentRepresentation", {
		get: () => _currentRepresentation,
		set: (value) => {
      _currentRepresentation = value
      _gui_.updateInputs.call(this)
      this.options.onRepresentationChange(this)
    },
	})

	// init click and enter key to target
	if (target) {
		this.__onClickTarget = _event_.onClickTarget.bind(this)
		target.addEventListener("click", this.__onClickTarget)
	}

	this.setColor(this.options.color)
	this._prevColor = this.getHEX()
	_gui_.initDOM.call(this)
}

ColorPicker.prototype.open = function () {
	this._prevColor = this.getHEX()
	if (this.options.container) {
		_gui_.attachToContainer.call(this, true)
	}
	else {
		_gui_.attachToBody.call(this)
	}
  this.options.onOpen(this)
}

ColorPicker.prototype.close = function () {
	if (!this.__dc) {
		if (this._prevColor != this.getHEX()) {
			this.options.onChange(this)
		}
		_gui_.detachOverlay.call(this)
		this.options.onClose(this)
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

ColorPicker.prototype.updateOptions = function(options) {
	const _options = _util_.buildOptions(this.options, options)
	this.options = _options
	const { target, representation } = this.options
	
	// update representation
	if (this.currentRepresentation != representation) {
		this.currentRepresentation = representation
	}

	// update target
	if (this._dom.target != target) {
		if (this._dom.target != null) {
			this._dom.target.removeEventListener("click", this.__onClickTarget)
		}
		this._dom.target = target
		if (this._dom.target != null) {
			this._dom.target.addEventListener("click", this.__onClickTarget)
		}
	}

	if (this.isOpen) {
		if (this.options.container) {
			_gui_.attachToContainer.call(this, true)
		}
		else {
			_gui_.attachToBody.call(this)
		}
	}
}

ColorPicker.prototype.getColor = function() {
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
}

ColorPicker.prototype.setColor = function(value) {
	const { h, s, v, a } = ColorParser.parse(value)
	this.__c = new Color(h, s, v, a)
}