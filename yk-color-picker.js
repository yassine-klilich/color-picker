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
  const cp_overlayContainer = document.createElement("div");
  const cp_overlayBackdrop = document.createElement("div");
  const cp_overlayWrapper = document.createElement("div");
  const cp_Wrapper = document.createElement("div");

  // Add class names
  cp_overlayContainer.classList.add("cp-overlay-container");
  cp_overlayBackdrop.classList.add("cp-overlay-backdrop");
  cp_overlayWrapper.classList.add("cp-overlay-wrapper");
  cp_Wrapper.classList.add("cp-wrapper");

  // build palette
  const paletteSection = _buildPaletteColor.call(this);
  // build color settings
  const colorSettings = _buildColorSettings.call(this)

  // Append child nodes
  cp_overlayContainer.appendChild(cp_overlayBackdrop);
  cp_overlayContainer.appendChild(cp_overlayWrapper);
  cp_overlayWrapper.appendChild(cp_Wrapper);
  cp_Wrapper.appendChild(paletteSection);
  cp_Wrapper.appendChild(colorSettings)

  // Append events
  cp_overlayBackdrop.addEventListener("click", this.close.bind(this));

  this.DOM["overlayContainer"] = cp_overlayContainer;
}

function _buildPaletteColor() {
  const paletteWrapper = document.createElement("div");
  const palette = document.createElement("div");
  const cursor = document.createElement("div");

  paletteWrapper.classList.add("cp-palette-wrapper");
  palette.classList.add("cp-palette");
  cursor.classList.add("cp-cursor");
  paletteWrapper.appendChild(palette);
  paletteWrapper.appendChild(cursor);

  // Append event
  this.__cursorMouseDown = _cursorMouseDown.bind(this);
  this.__cursorMouseUp = _cursorMouseUp.bind(this);
  this.__cursorMouseMove = _cursorMouseMove.bind(this);
  paletteWrapper.addEventListener("mousedown", this.__cursorMouseDown);

  this.DOM["palette"] = palette;
  this.DOM["cursor"] = cursor;

  return paletteWrapper;
}

function _cursorMouseDown(event) {
  document.addEventListener("mousemove", this.__cursorMouseMove);
  document.addEventListener("mouseup", this.__cursorMouseUp);

  this.__cursorMouseMove(event);
}

function _cursorMouseUp() {
  document.removeEventListener("mousemove", this.__cursorMouseMove);
  document.removeEventListener("mouseup", this.__cursorMouseUp);
}

function _cursorMouseMove(event) {
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
  const colorSettings = document.createElement("div");
  colorSettings.classList.add("cp-color-settings");

  // Build clipboard color
  const copyColor = _buildCopyColor.call(this);
  // Build SVG color preview
  const colorPreview = _buildColorPreview.call(this);
  // Build sliders
  const sliders = _buildColorSliders.call(this);

  colorSettings.appendChild(copyColor)
  colorSettings.appendChild(colorPreview)
  colorSettings.appendChild(sliders)

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
  let sliders = document.createElement("div");

  sliders.classList.add("cp-sliders");
  
  // Build hue slider
  let hueSliderWrapper = _buildHueSlider.call(this);
  // Build hue slider
  let opacitySliderWrapper = _buildOpacitySlider.call(this);

  sliders.appendChild(hueSliderWrapper);
  sliders.appendChild(opacitySliderWrapper);

  return sliders;
}

/**
* Build hue slider
*/
function _buildHueSlider() {
  let hueSliderWrapper = document.createElement("div");
  let hueSlider = document.createElement("div");
  let hueSliderThumb = document.createElement("div");

  hueSliderWrapper.classList.add("cp-hue-slider-wrapper");
  hueSlider.classList.add("cp-hue-slider");
  hueSliderThumb.classList.add("cp-hue-slider-thumb");

  hueSliderWrapper.appendChild(hueSlider);
  hueSliderWrapper.appendChild(hueSliderThumb);

  this.DOM.hueSliderWrapper = hueSliderWrapper;
  this.DOM.hueSlider = hueSlider;
  this.DOM.hueSliderThumb = hueSliderThumb;

  return hueSliderWrapper;
}

/**
* Build opacity slider
*/
function _buildOpacitySlider() {
  let opacitySliderWrapper = document.createElement("div");
  let opacitySlider = document.createElement("div");
  let opacityColor = document.createElement("div");
  let opacitySliderThumb = document.createElement("div");

  opacitySliderWrapper.classList.add("cp-opacity-slider-wrapper");
  opacitySlider.classList.add("cp-opacity-slider");
  opacityColor.classList.add("cp-opacity-color");
  opacitySliderThumb.classList.add("cp-opacity-slider-thumb");

  opacitySliderWrapper.appendChild(opacitySlider);
  opacitySliderWrapper.appendChild(opacitySliderThumb);
  opacitySlider.appendChild(opacityColor);

  this.DOM.opacitySliderWrapper = opacitySliderWrapper;
  this.DOM.opacityColor = opacityColor;
  this.DOM.opacitySliderThumb = opacitySliderThumb;

  return opacitySliderWrapper;
}

/**
* Build color preview in SVG
*/
function _buildColorPreview() {
  let colorPreviewWrapper = document.createElement("span");
  colorPreviewWrapper.classList.add("cp-color-preview-wrapper");

  let svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgElement.setAttribute("width", 38);
  svgElement.setAttribute("height", 38);

  let circleColorPreview = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circleColorPreview.setAttribute("cx", 19);
  circleColorPreview.setAttribute("cy", 19);
  circleColorPreview.setAttribute("r", 18);
  circleColorPreview.setAttribute("stroke", "gray");
  circleColorPreview.setAttribute("stroke-width", 1);
  circleColorPreview.setAttribute("fill", "red");
  circleColorPreview.setAttribute("fill-opacity", "0.1");

  svgElement.innerHTML = '<defs><pattern id="transparent-grid" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="3" height="3" fill="#DBDBDB"/><rect x="3" y="0" width="3" height="3" fill="white"/><rect x="3" y="3" width="3" height="3" fill="#DBDBDB"/><rect x="0" y="3" width="3" height="3" fill="white"/></pattern></defs><circle cx="19" cy="19" r="18" fill="url(#transparent-grid)" />';
  svgElement.appendChild(circleColorPreview);
  colorPreviewWrapper.appendChild(svgElement);

  this.DOM.circleColorPreview = circleColorPreview;
  return colorPreviewWrapper;
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
