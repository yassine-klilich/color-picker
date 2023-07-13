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
	value: "red"
})

function ColorPicker(options) {
	const _options = _buildOptions(DefaultOptions, options);

	const { target } = _options;

	if (target == null) {
		throw new ReferenceError("ERROR::[ColorPicker] target option is defined");
	}

	const _dom = {};
	let _isOpen = false
	let _color = new Color(0, 100, 100, 1)
	let _currentRepresentation = _options.representation

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
	Object.defineProperty(this, "color", {
		get: () => _color,
	})
	Object.defineProperty(this, "currentRepresentation", {
		get: () => _currentRepresentation,
		set: (value) => _currentRepresentation = value,
	})

	// init click and enter key to target
	target.addEventListener("click", (event) => _onClickTarget.call(this, event))

	_initDOM.call(this)
}

ColorPicker.prototype.open = function () {
	this.isOpen = true
	_updateSettingsView.call(this)
	document.body.appendChild(this.DOM.overlayContainer)
}

ColorPicker.prototype.close = function () {
	this.isOpen = false
	document.body.removeChild(this.DOM.overlayContainer)
}

ColorPicker.prototype.copyIcon = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-201 290.3 16 16' width='16' height='16'%3E%3Cpath d='M-199.1,301.3v-6.7c0-2,1.6-3.7,3.7-3.7h4.3c0.8,0,1.5,0.5,1.7,1.2l-5.4,0l-0.2,0c-1.6,0.1-2.9,1.4-2.9,3.1 l0,7.9C-198.6,302.8-199.1,302.1-199.1,301.3z M-194.8,305.6c-1,0-1.8-0.8-1.8-1.8v-8.6c0-1,0.8-1.8,1.8-1.8h6.1 c1,0,1.8,0.8,1.8,1.8v8.6c0,1-0.8,1.8-1.8,1.8H-194.8z M-188.1,303.8v-8.6c0-0.3-0.3-0.6-0.6-0.6h-6.1c-0.3,0-0.6,0.3-0.6,0.6v8.6 c0,0.3,0.3,0.6,0.6,0.6h6.1C-188.4,304.4-188.1,304.1-188.1,303.8z' fill='%23bcbcbc'%3E%3C/path%3E%3C/svg%3E")`
