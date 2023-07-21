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
	document.addEventListener("keyup", this.__onKeyUpClose)
  this.options.onOpen.call(this)



	const { target, position, positionFlipOrder } = this.options;

	let _position = position;
	const targetRect = target.getBoundingClientRect();
	const boxRect = this.DOM.overlayWrapper.getBoundingClientRect();
	const scrollTop = document.documentElement.scrollTop;
	const scrollLeft = document.documentElement.scrollLeft;

	const _stateSpaceInTop = enoughSpaceInTheTop(
		scrollTop,
		targetRect.top,
		boxRect.height
	);
	const _stateSpaceInBottom = enoughSpaceInTheBottom(
		scrollTop,
		targetRect.top,
		targetRect.height,
		boxRect.height
	);
	const _stateSpaceInLeft = enoughSpaceInTheLeft(
		scrollLeft,
		targetRect.left,
		boxRect.width
	);
	const _stateSpaceInRight = enoughSpaceInTheRight(
		scrollLeft,
		targetRect.left,
		targetRect.width,
		boxRect.width
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
		_position = BOTTOM;
	}

	setPositionAxis.call(this, getPositionAxis.call(this, _position, targetRect, boxRect));
}

ColorPicker.prototype.close = function () {
	this.isOpen = false
  if (document.body.contains(this.DOM.overlayContainer)) {
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


function getPositionAxis(position, targetRect, boxRect) {
	let x_axis = 0;
	let y_axis = 0;

	switch (position) {
		case TOP:
			y_axis = targetRect.top - boxRect.height;
			x_axis = targetRect.left + targetRect.width / 2 - boxRect.width / 2;
			break;

		case BOTTOM:
			y_axis = targetRect.top + targetRect.height;
			x_axis = targetRect.left + targetRect.width / 2 - boxRect.width / 2;
			break;

		case LEFT:
			y_axis = targetRect.top + targetRect.height / 2 - boxRect.height / 2;
			x_axis = targetRect.left - boxRect.width;
			break;

		case RIGHT:
			y_axis = targetRect.top + targetRect.height / 2 - boxRect.height / 2;
			x_axis = targetRect.left + targetRect.width;
			break;
	}

	if (window.innerWidth < (x_axis + boxRect.width)) {
		x_axis -= ((x_axis + boxRect.width) - window.innerWidth)
	}
	if (x_axis < 0) {
		x_axis = 0
	}
	if (y_axis < 0) {
		y_axis = 0
	}

	return {
		x: x_axis,
		y: y_axis,
	};
}

function setPositionAxis(positionAxis) {
	const { x, y } = positionAxis;

	this.DOM.overlayWrapper.style.top = `${y}px`;
	this.DOM.overlayWrapper.style.left = `${x}px`;
}

function getPageHeight() {
	return Math.max(
		document.body.scrollHeight,
		document.documentElement.scrollHeight,
		document.body.offsetHeight,
		document.documentElement.offsetHeight,
		document.body.clientHeight,
		document.documentElement.clientHeight
	);
}

function getPageWidth() {
	return Math.max(
		document.body.scrollWidth,
		document.documentElement.scrollWidth,
		document.body.offsetWidth,
		document.documentElement.offsetWidth,
		document.body.clientWidth,
		document.documentElement.clientWidth
	);
}

function enoughSpaceInTheTop(scrollTop, targetTop, boxHeight) {
	if (scrollTop + targetTop >= boxHeight) {
		if (targetTop >= boxHeight) {
			return 2;
		}
		return 1;
	}
	return 0;
}

function enoughSpaceInTheBottom(scrollTop, targetTop, targetHeight, boxHeight) {
	if (getPageHeight() - (scrollTop + targetTop + targetHeight) >= boxHeight) {
		if (window.innerHeight - (targetTop + targetHeight) >= boxHeight) {
			return 2;
		}
		return 1;
	}
	return 0;
}

function enoughSpaceInTheLeft(scrollLeft, targetLeft, boxWidth) {
	if (scrollLeft + targetLeft >= boxWidth) {
		if (targetLeft >= boxWidth) {
			return 2;
		}
		return 1;
	}
	return 0;
}

function enoughSpaceInTheRight(scrollLeft, targetLeft, targetWidth, boxWidth) {
	if (getPageWidth() - (scrollLeft + targetLeft + targetWidth) >= boxWidth) {
		if (window.innerWidth - (targetLeft + targetWidth) >= boxWidth) {
			return 2;
		}
		return 1;
	}
	return 0;
}
