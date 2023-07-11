function ColorPicker(options) {
  const _options = _buildOptions(DefaultOptions, options);

  const { target } = _options;

  if (target == null) {
    throw new ReferenceError("ERROR::[ColorPicker] target option is defined");
  }

  const _dom = {};
  let _isOpen = false;
  let _color = new HSVColor(0, 100, 100, 1)

  Object.defineProperty(this, "options", {
    value: _options,
  });
  Object.defineProperty(this, "DOM", {
    get: () => _dom,
  });
  Object.defineProperty(this, "isOpen", {
    get: () => _isOpen,
    set: (value) => (_isOpen = value),
  });
  Object.defineProperty(this, "color", {
    get: () => _color,
  });

  // init click and enter key to target
  target.addEventListener("click", (event) => onClickTarget.call(this, event));

  _initDOM.call(this);
}

ColorPicker.prototype.open = function () {
  this.isOpen = true;
  document.body.appendChild(this.DOM.overlayContainer);
};

ColorPicker.prototype.close = function () {
  this.isOpen = false;
  document.body.removeChild(this.DOM.overlayContainer);
};

ColorPicker.prototype.copyIcon = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-201 290.3 16 16' width='16' height='16'%3E%3Cpath d='M-199.1,301.3v-6.7c0-2,1.6-3.7,3.7-3.7h4.3c0.8,0,1.5,0.5,1.7,1.2l-5.4,0l-0.2,0c-1.6,0.1-2.9,1.4-2.9,3.1 l0,7.9C-198.6,302.8-199.1,302.1-199.1,301.3z M-194.8,305.6c-1,0-1.8-0.8-1.8-1.8v-8.6c0-1,0.8-1.8,1.8-1.8h6.1 c1,0,1.8,0.8,1.8,1.8v8.6c0,1-0.8,1.8-1.8,1.8H-194.8z M-188.1,303.8v-8.6c0-0.3-0.3-0.6-0.6-0.6h-6.1c-0.3,0-0.6,0.3-0.6,0.6v8.6 c0,0.3,0.3,0.6,0.6,0.6h6.1C-188.4,304.4-188.1,304.1-188.1,303.8z' fill='%23bcbcbc'%3E%3C/path%3E%3C/svg%3E")`

// ********************************  Color Class
/**
 * 
 * @param {number} h Hue
 * @param {number} s Saturate
 * @param {number} v Value
 * @param {number} a Alpha
 */
function HSVColor(h, s, v, a) {
  this.h = h;
  this.s = s;
  this.v = v;
  this.a = a;
}

HSVColor.prototype.toRGB = function () {
  let { h, s, v } = this;

  h /= 360;
  s /= 100;
  v /= 100;

  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    (s = h.s), (v = h.v), (h = h.h);
  }
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
};

HSVColor.prototype.toHSL = function () {
  let { h, s, v } = this;
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

  return { h, s, l };
};

HSVColor.prototype.toHEX = function () {
  let { h, s, v } = this;
  let { r, g, b } = this.toRGB(h, s, v);

  r = Math.round(r).toString(16);
  g = Math.round(g).toString(16);
  b = Math.round(b).toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
};
// ********************************  Color Class

// ---------------------
const TOP = "t";
const BOTTOM = "b";
const LEFT = "l";
const RIGHT = "r";

const RGB = "rgb";
const HSV = "hsv";
const HSL = "hsl";
const HEX = "hex";

// ---------------------
const DefaultOptions = Object.freeze({
  target: null,
  position: BOTTOM,
  positionFlipOrder: "rltb",
  representation: RGB,
});

// ---------------------
function _buildOptions(baseOptions, options) {
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

// ---------------------

function onClickTarget(event) {
  event.stopPropagation();
  switch (this.isOpen) {
    case false:
      this.open();
      break;
    case true:
      this.close();
      break;
  }
}

function _initDOM() {
  // DOM declaration
  const cp_overlayContainer = createElement("div", ["cp-overlay-container"])
  const cp_overlayBackdrop = createElement("div", ["cp-overlay-backdrop"])
  const cp_overlayWrapper = createElement("div", ["cp-overlay-wrapper"])
  const cp_Wrapper = createElement("div", ["cp-wrapper"])

  // Append child nodes
  cp_overlayContainer.appendChild(cp_overlayBackdrop);
  cp_overlayContainer.appendChild(cp_overlayWrapper);
  cp_overlayWrapper.appendChild(cp_Wrapper);
  // build palette
  cp_Wrapper.appendChild(_buildPaletteColor.call(this));
  // build color settings
  cp_Wrapper.appendChild(_buildColorSettings.call(this))

  // Append events
  cp_overlayBackdrop.addEventListener("click", this.close.bind(this));

  this.DOM["overlayContainer"] = cp_overlayContainer;
}

function _buildPaletteColor() {
  const paletteWrapper = createElement("div", ["cp-palette-wrapper"]);
  const palette = createElement("div", ["cp-palette"]);
  const cursor = createElement("div", ["cp-cursor"]);
  
  paletteWrapper.appendChild(palette);
  paletteWrapper.appendChild(cursor);

  // Append event
  this.__onMouseDownCursor = _onMouseDownCursor.bind(this);
  this.__onMouseUpCusror = _onMouseUpCusror.bind(this);
  this.__onMouseMoveCursor = _onMouseMoveCursor.bind(this);
  paletteWrapper.addEventListener("mousedown", this.__onMouseDownCursor);

  this.DOM["palette"] = palette;
  this.DOM["cursor"] = cursor;

  return paletteWrapper;
}

function _onMouseDownCursor(event) {
  document.addEventListener("mousemove", this.__onMouseMoveCursor);
  document.addEventListener("mouseup", this.__onMouseUpCusror);

  this.__onMouseMoveCursor(event);
}

function _onMouseUpCusror() {
  document.removeEventListener("mousemove", this.__onMouseMoveCursor);
  document.removeEventListener("mouseup", this.__onMouseUpCusror);
}

function _onMouseMoveCursor(event) {
  const { x, y } = _getCursorPosition.call(this, event.clientX, event.clientY);
  this.DOM.cursor.style.transform = `translate(${x}px, ${y}px)`;
  _extractHSVColor.call(this, x, y);
  
  // const { representation } = this.options

  // switch (representation) {
  //   case RGB: {

  //   } break;

  //   case HSV: {

  //   } break;

  //   case HSL: {

  //   } break;

  //   case HEX: {

  //   } break;
  // }
}

function _getCursorPosition(clientX, clientY) {
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
}

/**
 * Extract HSV color from x and y cursor position
 * @param {number} x 
 * @param {number} y 
 */
function _extractHSVColor(x, y) {
  const paletteHeight = this.DOM.palette.offsetHeight;
  const paletteWidth = this.DOM.palette.offsetWidth;

  this.color.s = ((paletteHeight - y) / paletteHeight) * 100
  this.color.v = (x / paletteWidth) * 100
}

/**
* Build color settings section
*/
function _buildColorSettings() {
  const colorSettings = createElement("div", ["cp-color-settings"]);

  // Build color color
  colorSettings.appendChild(_buildCopyColor.call(this))
  // Build color preview
  colorSettings.appendChild(_buildColorPreview.call(this))
  // Build sliders
  colorSettings.appendChild(_buildColorSliders.call(this))

  return colorSettings;
}

/**
* Build clipboard color icon for coping the color
*/
function _buildCopyColor() {
  const copyColorWrapper = document.createElement("span")
  const copyColor = document.createElement("button")
  const hiddenInput = document.createElement("input")
  copyColor.classList.add("cp-clipboard-color")
  copyColor.style.setProperty("background-image", this.copyIcon)
  copyColor.addEventListener("click", _onClickCopyColor.bind(this))
  hiddenInput.setAttribute("style", "opacity: 0 !important;position: absolute !important;pointer-events: none !important")

  copyColorWrapper.appendChild(copyColor)
  copyColorWrapper.appendChild(hiddenInput)

  this.DOM["copyColor"] = copyColor
  this.DOM["hiddenInput"] = hiddenInput

  return copyColorWrapper
}

/**
 * Click event for copy color button
 */
function _onClickCopyColor() {
  this.DOM.hiddenInput.value = _getColorText.call(this)
  this.DOM.hiddenInput.select()
  document.execCommand('copy')
  this.DOM.copyColor.style.setProperty("background-image", `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='14' height='14'%3E%3Cpath fill='%23bcbcbc' d='M15.2,4.7c0.3-0.3,0.2-0.7-0.1-1l-0.8-0.8c-0.3-0.3-0.7-0.2-1,0.1l-6.7,7.5L2.5,6.7c-0.3-0.3-0.7-0.2-1,0.1 L0.7,7.6c-0.3,0.3-0.2,0.7,0.1,1l5.5,5c0.3,0.3,0.7,0.2,1-0.1L15.2,4.7z'/%3E%3C/svg%3E")`)
  
  setTimeout(()=>{
    this.DOM.copyColor.style.setProperty("background-image", this.copyIcon)
  }, 600);
}

/**
 * Get color in text format
 */
function _getColorText() {
  switch (this.options.representation) {
    case RGB:
      const { r, g, b } = this.color.toRGB()
      return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${this.color.a})`;
      
    case HSV:
      const { h, s, v, a } = this.color
      return `hsva(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(v)}%, ${a})`;

    case HSL:
      const hsl = this.color.toHSL()
      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${this.color.a})`;

    case HEX: return this.color.toHEX()
  }
}

/**
* Build slider wrapper that wraps the hue and opacity sliders
*/
function _buildColorSliders() {
  const sliders = createElement("div", ["cp-sliders"])
  
  // Build hue slider
  sliders.appendChild(_buildHueSlider.call(this))
  // Build hue slider
  sliders.appendChild(_buildOpacitySlider.call(this))

  return sliders
}

/**
* Build hue slider
*/
function _buildHueSlider() {
  // Create elements
  const sliderWrapper = createElement("div", ["cp-hue-slider-wrapper"])
  const slider = createElement("div", ["cp-hue-slider"])
  const sliderThumb = createElement("div", ["cp-hue-slider-thumb"])

  // Appench child element
  sliderWrapper.appendChild(slider)
  sliderWrapper.appendChild(sliderThumb)

  // Attach events
  this.__onMouseDownHueSlider = _onMouseDownHueSlider.bind(this)
  this.__onMouseUpHueSlider = _onMouseUpHueSlider.bind(this)
  this.__onMouseMoveHueSlider = _onMouseMoveHueSlider.bind(this)
  sliderWrapper.addEventListener('mousedown', this.__onMouseDownHueSlider)

  this.DOM["hueSlider"] = slider
  this.DOM["hueSliderThumb"] = sliderThumb

  return sliderWrapper
}

function _onMouseDownHueSlider(event) {
  document.addEventListener('mousemove', this.__onMouseMoveHueSlider)
  document.addEventListener('mouseup', this.__onMouseUpHueSlider)

  this.__onMouseMoveHueSlider(event)
}

function _onMouseUpHueSlider() {
  document.removeEventListener('mousemove', this.__onMouseMoveHueSlider)
  document.removeEventListener('mouseup', this.__onMouseUpHueSlider)
}

function _onMouseMoveHueSlider(event) {
  const { hueSlider, hueSliderThumb } = this.DOM
  const sliderRect = hueSlider.getBoundingClientRect()
  const sliderThumbHalfWidth = hueSliderThumb.offsetWidth / 2
  const minPosition = (sliderThumbHalfWidth * -1)
  const maxPosition = (sliderRect.width - sliderThumbHalfWidth)
  let thumbX = (event.clientX - sliderRect.left) - sliderThumbHalfWidth

  if(thumbX < minPosition) {
    thumbX = minPosition;
  }
  if(thumbX > maxPosition) {
    thumbX = maxPosition;
  }

  this.color.h = (((thumbX + sliderThumbHalfWidth) / sliderRect.width) * 360)
  hueSliderThumb.style.transform = `translate(${thumbX}px, -50%)`

  
  // _helper.updateColorModelInput();
  // _helper.updateViewColors();
}

/**
* Build opacity slider
*/
function _buildOpacitySlider() {
  // Create elements
  const sliderWrapper = createElement("div", ["cp-opacity-slider-wrapper"])
  const slider = createElement("div", ["cp-opacity-slider"])
  const color = createElement("div", ["cp-opacity-color"])
  const sliderThumb = createElement("div", ["cp-opacity-slider-thumb"])

  // Appench child element
  sliderWrapper.appendChild(slider)
  sliderWrapper.appendChild(sliderThumb)
  slider.appendChild(color)

  // Attach events
  this.__onMouseDownOpacitySlider = _onMouseDownOpacitySlider.bind(this)
  this.__onMouseUpOpacitySlider = _onMouseUpOpacitySlider.bind(this)
  this.__onMouseMoveOpacitySlider = _onMouseMoveOpacitySlider.bind(this)
  sliderWrapper.addEventListener('mousedown', this.__onMouseDownOpacitySlider)

  this.DOM["opacitySlider"] = slider
  this.DOM["opacitySliderThumb"] = sliderThumb

  return sliderWrapper
}

/**
* Opacity slider thumb mouse down event handler
* @param {MouseEvent} event 
*/
function _onMouseDownOpacitySlider(event) {
  document.addEventListener('mousemove', this.__onMouseMoveOpacitySlider)
  document.addEventListener('mouseup', this.__onMouseUpOpacitySlider)

  this.__onMouseMoveOpacitySlider(event)
}

/**
* Opacity slider thumb mouse up event handler
*/
function _onMouseUpOpacitySlider() {
  document.removeEventListener('mousemove', this.__onMouseMoveOpacitySlider)
  document.removeEventListener('mouseup', this.__onMouseUpOpacitySlider)
}

/**
* Opacity slider thumb mouse move event handler
* @param {MouseEvent} event 
*/
function _onMouseMoveOpacitySlider(event) {
  const { opacitySlider, opacitySliderThumb } = this.DOM
  const opacitySliderRect = opacitySlider.getBoundingClientRect()
  const opacitySliderThumbHalfWidth = opacitySliderThumb.offsetWidth / 2;
  const minPosition = (opacitySliderThumbHalfWidth * -1);
  const maxPosition = (opacitySliderRect.width - opacitySliderThumbHalfWidth);
  let thumbX = (event.clientX - opacitySliderRect.left) - opacitySliderThumbHalfWidth;
  
  if(thumbX < minPosition) {
    thumbX = minPosition
  }
  if(thumbX > maxPosition) {
    thumbX = maxPosition
  }

  this.color.a = parseFloat(((thumbX + opacitySliderThumbHalfWidth) / opacitySliderRect.width).toFixed(2))
  opacitySliderThumb.style.transform = `translate(${thumbX}px, -50%)`;
  
  // _helper.updateColorModelInput();
  // _helper.updateViewColors();
}

/**
* Build color preview in SVG
*/
function _buildColorPreview() {
  const colorPreviewWrapper = createElement("span", ["cp-color-preview-wrapper"])

  const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svgElement.setAttribute("width", 38)
  svgElement.setAttribute("height", 38)

  const colorPreview = document.createElementNS("http://www.w3.org/2000/svg", "circle")
  colorPreview.setAttribute("cx", 19)
  colorPreview.setAttribute("cy", 19)
  colorPreview.setAttribute("r", 18)
  colorPreview.setAttribute("stroke", "gray")
  colorPreview.setAttribute("stroke-width", 1)
  colorPreview.setAttribute("fill", "red")
  colorPreview.setAttribute("fill-opacity", "0.1")

  svgElement.innerHTML = '<defs><pattern id="transparent-grid" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="3" height="3" fill="#DBDBDB"/><rect x="3" y="0" width="3" height="3" fill="white"/><rect x="3" y="3" width="3" height="3" fill="#DBDBDB"/><rect x="0" y="3" width="3" height="3" fill="white"/></pattern></defs><circle cx="19" cy="19" r="18" fill="url(#transparent-grid)" />'
  svgElement.appendChild(colorPreview)
  colorPreviewWrapper.appendChild(svgElement)

  this.DOM.colorPreview = colorPreview

  return colorPreviewWrapper;
}

/**
 * Create element
 * @param {string} tag 
 * @param {Array} classList 
 */
function createElement(tag, classList) {
  const el = document.createElement(tag)
  if (classList != null) {
    el.classList.add(...classList)
  }
  return el
}


// ********************************
// The code below is all about positioning
// ********************************

function _mouseLeave() {
  // this.DOM.classList.remove("box--show");
}

function _mouseEnter() {
  // this.DOM.wrapper.classList.add("box--show");

  const { target } = this.options;

  let _position = position;
  const targetRect = target.getBoundingClientRect();
  const boxRect = box.getBoundingClientRect();
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

  setPositionAxis(getPositionAxis(_position, targetRect, boxRect));
}

/**
 *
 * @param {string} position
 * @param {DOMRect} targetRect
 * @param {DOMRect} boxRect
 * @returns
 */
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

  return {
    x: x_axis < 0 ? 0 : x_axis,
    y: y_axis < 0 ? 0 : y_axis,
  };
}

function setPositionAxis(positionAxis) {
  const { x, y } = positionAxis;

  box.style.top = `${y}px`;
  box.style.left = `${x}px`;
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
