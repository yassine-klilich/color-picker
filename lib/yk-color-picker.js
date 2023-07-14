
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

function _onClickTarget(event) {
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
  const cp_overlayContainer = _createElement("div", ["cp-overlay-container"])
  const cp_overlayBackdrop = _createElement("div", ["cp-overlay-backdrop"])
  const cp_overlayWrapper = _createElement("div", ["cp-overlay-wrapper"])
  const cp_Wrapper = _createElement("div", ["cp-wrapper"])

  // Append child nodes
  cp_overlayContainer.appendChild(cp_overlayBackdrop)
  cp_overlayContainer.appendChild(cp_overlayWrapper)
  cp_overlayWrapper.appendChild(cp_Wrapper)
  // build palette
  cp_Wrapper.appendChild(_buildPaletteColor.call(this))
  // build color settings
  cp_Wrapper.appendChild(_buildColorSettings.call(this))

  // Append events
  cp_overlayBackdrop.addEventListener("click", this.close.bind(this))

  this.DOM["overlayContainer"] = cp_overlayContainer
}

function _buildPaletteColor() {
  const paletteWrapper = _createElement("div", ["cp-palette-wrapper"]);
  const palette = _createElement("div", ["cp-palette"]);
  const cursor = _createElement("div", ["cp-cursor"]);
  
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
  const { x, y } = _getCursorPosition.call(this, event.clientX, event.clientY)
  this.DOM.cursor.style.transform = `translate(${x}px, ${y}px)`
  _updateColor.call(this, x, y)
  _updateSettingsView.call(this)
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
function _updateColor(x, y) {
  const paletteHeight = this.DOM.palette.offsetHeight;
  const paletteWidth = this.DOM.palette.offsetWidth;

  this.color.hsv.s = Math.round((x / paletteWidth) * 100)
  this.color.hsv.v = Math.round(((paletteHeight - y) / paletteHeight) * 100)
}

/**
* Build color settings section
*/
function _buildColorSettings() {
  const colorSettings = _createElement("div", ["cp-color-settings"]);

  // Build color color
  colorSettings.appendChild(_buildCopyColor.call(this))
  // Build color preview
  colorSettings.appendChild(_buildColorPreview.call(this))
  // Build sliders
  colorSettings.appendChild(_buildColorSliders.call(this))
  // Build inputs
  colorSettings.appendChild(_buildColorInputs.call(this))

  return colorSettings;
}

/**
 * Build color inputs
 */
function _buildColorInputs() {
  // Create elements
  const inputsSettings = _createElement("div", ["cp-color-model-wrapper"])
  const inputsWrapper = _createElement("div", ["cp-color-model"])
  const inputsSwitch = _createElement("button", ["cp-color-model-switch"])
  inputsSwitch.style.setProperty("background-image", `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='-203 292.3 12 12'%3E%3Cpath fill='%23bcbcbc' d='M-200.5,300.9l1.2-1.2l2.3,2.3l2.3-2.3l1.2,1.2l-3.5,3.4L-200.5,300.9z'%3E%3C/path%3E%3Cpath fill='%23bcbcbc' d='M-197,292.3l3.5,3.4l-1.2,1.2l-2.3-2.3l-2.3,2.3l-1.2-1.2L-197,292.3z'%3E%3C/path%3E%3C/svg%3E")`)
  
  // Append elements
  inputsWrapper.appendChild(_buildInput.call(this))
  inputsSettings.appendChild(inputsWrapper)
  inputsSettings.appendChild(inputsSwitch)

  // Attach Events
  inputsSwitch.addEventListener("click", _onClickInputsSwitch.bind(this))

  this.DOM["inputsWrapper"] = inputsWrapper

  return inputsSettings
}

function _onClickInputsSwitch() {
  const { inputsWrapper } = this.DOM
  inputsWrapper.innerHTML = ""
  switch (this.currentRepresentation) {
    case RGB:
      this.currentRepresentation = HSV
      break;
    case HSV:
      this.currentRepresentation = HSL
      this.color.hsl = this.color.toHSL()
      break;
    case HSL:
      this.currentRepresentation = HEX
      this.color.rgb = this.color.toRGB()
      break;
    case HEX:
      this.currentRepresentation = RGB
      this.color.rgb = this.color.toRGB()
      break;
	}
  inputsWrapper.appendChild(_buildInput.call(this))
  _updateInputs.call(this)
}

/**
 * Build color input elements
 * @returns {HTMLElement}
 */
function _buildInput() {
  if (this.currentRepresentation == HEX) {
    return _buildHEXInput.call(this)
  }
  else {
    return _buildQuadrupedInput.call(this)
  }
}

/**
 * Build HEX color input element
 * @returns {HTMLElement}
 */
function _buildHEXInput() {
  const inputWrapper = _createElement("div", ["cp-hex-input"])
  const inputHEX = _createElement("input", ["cp-color-input"])
  const labelHEX = _createElement("label", ["cp-color-model-label"])
  inputHEX.setAttribute("type", "text")
  labelHEX.textContent = "HEX"
  inputWrapper.appendChild(inputHEX)
  inputWrapper.appendChild(labelHEX)

  this.DOM["inputHEX"] = inputHEX

  return inputWrapper
}

/**
 * Build RGB, HSL, HSV color inputs elements
 * @returns {HTMLElement}
 */
function _buildQuadrupedInput() {
  // Create DOM elements
  const inputWrapper = _createElement("div", ["cp-input-wrapper"])
  const inputA = _createElement("input", ["cp-color-input"])
  const inputB = _createElement("input", ["cp-color-input"])
  const inputC = _createElement("input", ["cp-color-input"])
  const inputD = _createElement("input", ["cp-color-input"])
  const labelA = _createElement("label", ["cp-color-model-label"])
  const labelB = _createElement("label", ["cp-color-model-label"])
  const labelC = _createElement("label", ["cp-color-model-label"])
  const labelD = _createElement("label", ["cp-color-model-label"])

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
  inputA.addEventListener("focus", _onFocusInput.bind(this))
  inputA.addEventListener("keydown", _onKeyDownInputA.bind(this))
  inputA.addEventListener("keyup", _onKeyUpInputA.bind(this))
  inputA.addEventListener("change", _onChangeInputA.bind(this))
  
  inputB.addEventListener("focus", _onFocusInput.bind(this))
  inputB.addEventListener("keydown", _onKeyDownInputB.bind(this))
  inputB.addEventListener("keyup", _onKeyUpInputB.bind(this))
  inputB.addEventListener("change", _onChangeInputB.bind(this))
  
  inputC.addEventListener("focus", _onFocusInput.bind(this))
  inputC.addEventListener("keydown", _onKeyDownInputC.bind(this))
  inputC.addEventListener("keyup", _onKeyUpInputC.bind(this))
  inputC.addEventListener("change", _onChangeInputC.bind(this))

  inputD.addEventListener("keydown", _onKeyDownAlphaInput.bind(this));
  inputD.addEventListener("keyup", _onKeyUpAlphaInput.bind(this));
  inputD.addEventListener("change", _onChangeAlphaInput.bind(this));


  this.DOM["inputA"] = inputA
  this.DOM["inputB"] = inputB
  this.DOM["inputC"] = inputC
  this.DOM["inputAlpha"] = inputD

  return inputWrapper
}

function _onFocusInput() {
  switch (this.currentRepresentation) {
    case RGB:
      this.color.rgb = this.getRGB()
      break;
    case HSL:
      this.color.hsl = this.getHSL()
      break;
  }
}

function _onKeyDownAlphaInput(event) {
  const { target, key } = event
  const { a } = this.color

  if(/[0-9]|(\.)|(ArrowUp)|(ArrowDown)|(ArrowRight)|(ArrowLeft)|(Backspace)|(Delete)|(Tab)|(Home)|(End)/.test(key)) {
    switch (key) {
      case "ArrowUp": {
        if(a < 1) {
          let alphaValue = parseFloat((a + 0.01).toFixed(2))
          if (alphaValue > 1) {
            alphaValue = 1
          }
          target.value = this.color.a = alphaValue
          _updateColorView.call(this)
          _updateOpacityThumb.call(this)
        }
      } break;
      
      case "ArrowDown": {
        if(a > 0) {
          let alphaValue = parseFloat((a - 0.01).toFixed(2))
          if (alphaValue < 0) {
            alphaValue = 0
          }
          target.value = this.color.a = alphaValue
          _updateColorView.call(this)
          _updateOpacityThumb.call(this)
        }
      } break;
      
      case ".": {
        if(/(\.)/.test(target.value)) {
          event.preventDefault()
        }
      } break;
    }
  }
  else {
    event.preventDefault();
  }
}

function _onKeyUpAlphaInput(event) {
  const { target, key } = event
  if(/[0-9]|(\.)|(Backspace)|(Delete)/.test(key) && target.value !== null && target.value !== undefined && target.value !== "") {
    const value = parseFloat(target.value)
    if(isNaN(value) || value < 0 || value > 1) {
      target.value = this.color.a
    }
    else {
      this.color.a = value
      _updateColorView.call(this)
      _updateOpacityThumb.call(this)
    }
  }
}

function _onChangeAlphaInput(event) {
  event.target.value = this.color.a
}

function _updateOpacityThumb() {
  const { opacitySlider, opacityThumb } = this.DOM
  opacityThumb.style.setProperty("transform", `translate(${(this.color.a * opacitySlider.offsetWidth) - (opacityThumb.offsetWidth / 2)}px, -50%)`)
}

/**
 * First input events
 */
function _onKeyDownInputA(event) {
  const { target, key } = event
  if (/[0-9]|(ArrowUp)|(ArrowDown)|(ArrowRight)|(ArrowLeft)|(Backspace)|(Delete)|(Tab)|(Home)|(End)/.test(key)) {
    switch (key) {
      case "ArrowUp": {
        switch (this.currentRepresentation) {
          case RGB: {
            let { r, g, b } = this.color.rgb
            if (r < 255) {
              this.color.rgb.r = target.value = ++r
              this.color.hsv = this.color.RGBtoHSV(r, g, b)
              _updateColorView.call(this)
            }
          } break
      
          case HSV:
          case HSL: {
            let { h } = this.color.hsv
            if (h < 360) {
              target.value = Math.round(++h) + "°"
              this.color.hsv.h = this.color.hsl.h = h
              _updateColorView.call(this)
            }
          } break
        }
      } break
      case "ArrowDown": {
        switch (this.currentRepresentation) {
          case RGB: {
            let { r, g, b } = this.color.rgb
            if (r > 0) {
              this.color.rgb.r = target.value = --r
              this.color.hsv = this.color.RGBtoHSV(r, g, b)
              _updateColorView.call(this)
            }
          } break
      
          case HSV:
          case HSL: {
            let { h } = this.color.hsv
            if (h > 0) {
              target.value = Math.round(--h) + "°"
              this.color.hsv.h = this.color.hsl.h = h
              _updateColorView.call(this)
            }
          } break
        }
      } break
    }
  }
  else {
    event.preventDefault()
  }
}

function _onKeyUpInputA(event) {
  const { target, key } = event
  if (/[0-9]|(Backspace)|(Delete)/.test(key) && target.value !== null && target.value !== undefined && target.value !== "") {
    switch (this.currentRepresentation) {
      case RGB: {
        const value = parseInt(target.value)
        const { r, g, b } = this.color.rgb
        if(isNaN(value) || value < 0 || value > 255) {
          target.value = r
        }
        else {
          this.color.rgb.r = value
          this.color.hsv = this.color.RGBtoHSV(value, g, b)
          _updateColorView.call(this)
        }
      } break

      case HSV:
      case HSL: {
        const value = parseInt(target.value)
        const pattern = new RegExp(`^[0-9]{0,3}°$`)
        if (isNaN(value) || !pattern.test(target.value) || value < 0 || value > 360) {
          target.value = `${this.color.hsv.h}°`
        }
        else {
          this.color.hsv.h = this.color.hsl.h = value
          _updateColorView.call(this)
        }
      } break
    }
  }
}

function _onChangeInputA(event) {
  let value = event.target.value
  switch (this.currentRepresentation) {
    case RGB: {
      value = this.color.rgb.r
    } break
    
    case HSV:
    case HSL: {
      value = `${this.color.hsv.h}°`
    } break
  }
  event.target.value = value
}

/**
 * Second input events
 */
function _onKeyDownInputB(event) {
  const { target, key } = event
  if (/[0-9]|(ArrowUp)|(ArrowDown)|(ArrowRight)|(ArrowLeft)|(Backspace)|(Delete)|(Tab)|(Home)|(End)/.test(key)) {
    switch (key) {
      case "ArrowUp": {
        switch (this.currentRepresentation) {
          case RGB: {
            let { r, g, b } = this.color.rgb
            if (g < 255) {
              this.color.rgb.g = target.value = ++g
              this.color.hsv = this.color.RGBtoHSV(r, g, b)
              _updateColorView.call(this)
            }
          } break
      
          case HSV: {
            let { s } = this.color.hsv
            if (s < 100) {
              target.value = ++s + "%"
              this.color.hsv.s = s
              _updateColorView.call(this)
            }
          } break

          case HSL: {
            const { h, s, l } = this.color.hsl
            let hsl_s = s
            if (s < 100) {
              target.value = ++hsl_s + "%"
              this.color.hsl.s = hsl_s
              this.color.hsv.s = this.color.HSLtoHSV(h, hsl_s, l).s
              _updateColorView.call(this)
            }
          } break
        }
      } break;
      case "ArrowDown": {
        switch (this.currentRepresentation) {
          case RGB: {
            let { r, g, b } = this.color.rgb
            if (g > 0) {
              this.color.rgb.g = target.value = --g
              this.color.hsv = this.color.RGBtoHSV(r, g, b)
              _updateColorView.call(this)
            }
          } break
      
          case HSV: {
            let { s } = this.color.hsv
            if (s > 0) {
              target.value = --s + "%"
              this.color.hsv.s = s
              _updateColorView.call(this)
            }
          } break

          case HSL: {
            const { h, s, l } = this.color.hsl
            let hsl_s = s
            if (hsl_s > 0) {
              target.value = --hsl_s + "%"
              this.color.hsl.s = hsl_s
              this.color.hsv.s = this.color.HSLtoHSV(h, hsl_s, l).s
              _updateColorView.call(this)
            }
          } break
        }
      } break;
    }
  }
  else {
    event.preventDefault()
  }
}

function _onKeyUpInputB(event) {
  const { target, key } = event
  if(/[0-9]|(Backspace)|(Delete)/.test(key) && target.value !== null && target.value !== undefined && target.value !== "") {
    switch (this.currentRepresentation) {
      case RGB: {
        const value = parseInt(target.value)
        const { r, g, b } = this.color.rgb
        if(isNaN(value) || value < 0 || value > 255) {
          target.value = g
        }
        else {
          this.color.rgb.g = value
          this.color.hsv = this.color.RGBtoHSV(r, value, b)
          _updateColorView.call(this)
        }
      } break

      case HSV: {
        const value = parseInt(target.value)
        const pattern = new RegExp(`^[0-9]{0,3}%$`)
        if(isNaN(value) || !pattern.test(target.value) || value < 0 || value > 100) {
          target.value = `${this.color.hsv.s}%`
        }
        else {
          this.color.hsv.s = value
          _updateColorView.call(this)
        }
      } break

      case HSL: {
        const value = parseInt(target.value)
        const pattern = new RegExp(`^[0-9]{0,3}%$`)
        const { h, s, l } = this.color.hsl
        if(isNaN(value) || !pattern.test(target.value) || value < 0 || value > 100) {
          target.value = `${s}%`
        }
        else {
          this.color.hsl.s = value
          this.color.hsv = this.color.HSLtoHSV(h, value, l)
          _updateColorView.call(this)
        }
      } break
    }
  }
}

function _onChangeInputB(event) {
  let value = event.target.value
  switch (this.currentRepresentation) {
    case RGB: {
      value = this.color.rgb.g
    } break
    
    case HSV: {
      value = `${this.color.hsv.s}%`
    } break

    case HSL: {
      value = `${this.color.hsl.s}%`
    } break
  }
  event.target.value = value
}

/**
 * Third input events
 */
function _onKeyDownInputC(event) {
  const { target, key } = event
  if (/[0-9]|(ArrowUp)|(ArrowDown)|(ArrowRight)|(ArrowLeft)|(Backspace)|(Delete)|(Tab)|(Home)|(End)/.test(key)) {
    switch (key) {
      case "ArrowUp": {
        switch (this.currentRepresentation) {
          case RGB: {
            let { r, g, b } = this.color.rgb
            if (b < 255) {
              this.color.rgb.b = target.value = ++b
              this.color.hsv = this.color.RGBtoHSV(r, g, b)
              _updateColorView.call(this)
            }
          } break
      
          case HSV: {
            let { v } = this.color.hsv
            if (v < 100) {
              target.value = ++v + "%"
              this.color.hsv.v = v
              _updateColorView.call(this)
            }
          } break

          case HSL: {
            const { h, s, l } = this.color.hsl
            let hsl_l = l
            if (hsl_l < 100) {
              target.value = ++hsl_l + "%"
              this.color.hsl.l = hsl_l
              this.color.hsv.v = this.color.HSLtoHSV(h, s, hsl_l).v
              _updateColorView.call(this)
            }
          } break
        }
      } break;
      case "ArrowDown": {
        switch (this.currentRepresentation) {
          case RGB: {
            let { r, g, b } = this.color.rgb
            if (b > 0) {
              this.color.rgb.b = target.value = --b
              this.color.hsv = this.color.RGBtoHSV(r, g, b)
              _updateColorView.call(this)
            }
          } break
      
          case HSV: {
            let { v } = this.color.hsv
            if (v > 0) {
              target.value = --v + "%"
              this.color.hsv.v = v
              _updateColorView.call(this)
            }
          } break

          case HSL: {
            const { h, s, l } = this.color.hsl
            let hsl_l = l
            if (l > 0) {
              target.value = --hsl_l + "%"
              this.color.hsl.l = hsl_l
              this.color.hsv.v = this.color.HSLtoHSV(h, s, hsl_l).v
              _updateColorView.call(this)
            }
          } break
        }
      } break;
    }
  }
  else {
    event.preventDefault()
  }
}

function _onKeyUpInputC(event) {
  const { target, key } = event
  if(/[0-9]|(Backspace)|(Delete)/.test(key) && target.value !== null && target.value !== undefined && target.value !== "") {
    switch (this.currentRepresentation) {
      case RGB: {
        const value = parseInt(target.value)
        const { r, g, b } = this.color.rgb
        if(isNaN(value) || value < 0 || value > 255) {
          target.value = b
        }
        else {
          this.color.rgb.b = value
          this.color.hsv = this.color.RGBtoHSV(r, g, value)
          _updateColorView.call(this)
        }
      } break

      case HSV: {
        const value = parseInt(target.value)
        const pattern = new RegExp(`^[0-9]{0,3}%$`)
        if(isNaN(value) || !pattern.test(target.value) || value < 0 || value > 100) {
          target.value = `${this.color.hsv.v}%`
        }
        else {
          this.color.hsv.v = value
          _updateColorView.call(this)
        }
      } break

      case HSL: {
        const value = parseInt(target.value)
        const pattern = new RegExp(`^[0-9]{0,3}%$`)
        const { h, s, l } = this.color.hsl
        if(isNaN(value) || !pattern.test(target.value) || value < 0 || value > 100) {
          target.value = `${l}%`
        }
        else {
          this.color.hsl.l = value
          this.color.hsv = this.color.HSLtoHSV(h, s, value)
          _updateColorView.call(this)
        }
      } break
    }
  }
}

function _onChangeInputC(event) {
  let value = event.target.value
  switch (this.currentRepresentation) {
    case RGB: {
      value = this.color.rgb.b
    } break
    
    case HSV: {
      value = `${this.color.hsv.v}%`
    } break
    
    case HSL: {
      value = `${this.color.hsv.l}%`
    } break
  }
  event.target.value = value
}

function _setQuadrupedValue(a, b, c) {
  this.DOM["inputA"].value = a
  this.DOM["inputB"].value = b
  this.DOM["inputC"].value = c
  this.DOM["inputAlpha"].value = this.color.a
}

function _updateHEXInput() {
  this.DOM["inputHEX"].value = _getHEXColorValue.call(this)
}

function _getHEXColorValue() {
  let hexColor = this.color.toHEX()
  if (this.color.a < 1) {
    const alpha = Math.round(this.color.a * 255).toString(16)
    hexColor += (alpha.length < 2) ? `0${alpha}` : alpha
  }
  return hexColor
}

function _updateSettingsView() {
  _updateInputs.call(this)
  _updateColorView.call(this)
}

function _updateInputs() {
  switch (this.currentRepresentation) {
    case RGB: {
      const { r, g, b } = this.color.toRGB()
      _setQuadrupedValue.call(this, r, g, b)
    } break;

    case HSV: {
      const { h, s, v } = this.color.hsv
      _setQuadrupedValue.call(this, `${Math.round(h)}°`, `${Math.round(s)}%`, `${Math.round(v)}%`)
    } break;

    case HSL: {
      const { h, s, l } = this.color.toHSL()
      _setQuadrupedValue.call(this, `${Math.round(h)}°`, `${Math.round(s)}%`, `${Math.round(l)}%`)
    } break;

    case HEX: {
      _updateHEXInput.call(this)
    } break;
  }
}

function _updateColorView() {
  const alpha = this.color.a
  const hsl = this.color.toHSL()
  const { palette, opacitySlider, colorPreview } = this.DOM
  const paletteBGColor = `hsl(${hsl.h}deg 100% 50% / 1)`
  palette.style.backgroundImage = `linear-gradient(180deg, transparent 0%, rgba(0,0,0,1) 100%), linear-gradient(90deg, rgba(255,255,255,1) 0%, ${paletteBGColor} 100%)`
  const hslColor = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
  opacitySlider.style.setProperty('background-image', `linear-gradient(90deg, transparent, ${hslColor})`)
  colorPreview.setAttribute("fill", hslColor)
  colorPreview.setAttribute("fill-opacity", alpha)
}


/**
* Build clipboard color icon for coping the color
*/
function _buildCopyColor() {
  const copyColorWrapper = document._createElement("span")
  const copyColor = document._createElement("button")
  const hiddenInput = document._createElement("input")
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
  switch (this.currentRepresentation) {
    case RGB:
      const { r, g, b } = this.color.rgb
      return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${this.color.a})`
      
    case HSV: {
      const { h, s, v } = this.color.hsv
      return `hsva(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(v)}%, ${this.color.a})`
    }

    case HSL: {
      const { h, s, l } = this.color.hsl
      return `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${this.color.a})`
    }

    case HEX: return _getHEXColorValue.call(this)
  }
}

/**
* Build slider wrapper that wraps the hue and opacity sliders
*/
function _buildColorSliders() {
  const sliders = _createElement("div", ["cp-sliders"])
  
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
  const sliderWrapper = _createElement("div", ["cp-hue-slider-wrapper"])
  const slider = _createElement("div", ["cp-hue-slider"])
  const sliderThumb = _createElement("div", ["cp-hue-slider-thumb"])

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

  this.color.hsv.h = Math.round(((thumbX + sliderThumbHalfWidth) / sliderRect.width) * 360)
  hueSliderThumb.style.transform = `translate(${thumbX}px, -50%)`

  _updateSettingsView.call(this)
}

/**
* Build opacity slider
*/
function _buildOpacitySlider() {
  // Create elements
  const sliderWrapper = _createElement("div", ["cp-opacity-slider-wrapper"])
  const color = _createElement("div", ["cp-opacity-color"])
  const sliderThumb = _createElement("div", ["cp-opacity-slider-thumb"])

  // Appench child element
  sliderWrapper.appendChild(color)
  sliderWrapper.appendChild(sliderThumb)

  // Attach events
  this.__onMouseDownOpacitySlider = _onMouseDownOpacitySlider.bind(this)
  this.__onMouseUpOpacitySlider = _onMouseUpOpacitySlider.bind(this)
  this.__onMouseMoveOpacitySlider = _onMouseMoveOpacitySlider.bind(this)
  sliderWrapper.addEventListener('mousedown', this.__onMouseDownOpacitySlider)

  this.DOM["opacitySlider"] = color
  this.DOM["opacityThumb"] = sliderThumb

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
  const { opacitySlider, opacityThumb, inputAlpha } = this.DOM
  const opacitySliderRect = opacitySlider.getBoundingClientRect()
  const opacityThumbHalfWidth = opacityThumb.offsetWidth / 2
  const minPosition = (opacityThumbHalfWidth * -1)
  const maxPosition = (opacitySliderRect.width - opacityThumbHalfWidth)
  let thumbX = (event.clientX - opacitySliderRect.left) - opacityThumbHalfWidth
  
  if(thumbX < minPosition) {
    thumbX = minPosition
  }
  if(thumbX > maxPosition) {
    thumbX = maxPosition
  }

  this.color.a = parseFloat(((thumbX + opacityThumbHalfWidth) / opacitySliderRect.width).toFixed(2))
  opacityThumb.style.transform = `translate(${thumbX}px, -50%)`
  
  if (this.currentRepresentation == HEX) {
    _updateHEXInput.call(this)
  }
  else {
    inputAlpha.value = this.color.a
  }

  _updateColorView.call(this)
}

/**
* Build color preview in SVG
*/
function _buildColorPreview() {
  const colorPreviewWrapper = _createElement("span", ["cp-color-preview-wrapper"])

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
  colorPreview.setAttribute("fill-opacity", "1")

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
 * @returns {HTMLElement}
 */
function _createElement(tag, classList) {
  const el = document.createElement(tag)
  if (classList != null) {
    el.classList.add(...classList)
  }
  return el
}
