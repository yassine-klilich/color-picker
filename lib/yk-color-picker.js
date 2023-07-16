
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
  }
}

const _core_ = {
  updateColor: function(x, y) {
    const paletteHeight = this.DOM.palette.offsetHeight;
    const paletteWidth = this.DOM.palette.offsetWidth;
  
    this.color.hsv.s = Math.round((x / paletteWidth) * 100)
    this.color.hsv.v = Math.round(((paletteHeight - y) / paletteHeight) * 100)
  },
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
    const { r, g, b } = this.color.rgb = this.color.toRGB()
    let hex = this.color.RGBtoHEX(r, g, b)
    if (this.color.a < 1) {
      hex += Math.round(this.color.a * 255).toString(16).padStart(2, 0)
    }
    this.color.hex = hex
  },
  getColorText: function() {
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
  }
}

const _gui_ = {
  initDOM: function() {
    // DOM declaration
    const cp_overlayContainer = _gui_.createElement("div", ["cp-overlay-container"])
    const cp_overlayBackdrop = _gui_.createElement("div", ["cp-overlay-backdrop"])
    const cp_overlayWrapper = _gui_.createElement("div", ["cp-overlay-wrapper"])
    const cp_Wrapper = _gui_.createElement("div", ["cp-wrapper"])
  
    // Append child nodes
    cp_overlayContainer.appendChild(cp_overlayBackdrop)
    cp_overlayContainer.appendChild(cp_overlayWrapper)
    cp_overlayWrapper.appendChild(cp_Wrapper)
    // build palette
    cp_Wrapper.appendChild(_gui_.buildPaletteColor.call(this))
    // build color settings
    cp_Wrapper.appendChild(_gui_.buildColorSettings.call(this))
  
    // Append events
    cp_overlayBackdrop.addEventListener("click", this.close.bind(this))
  
    this.DOM["overlayContainer"] = cp_overlayContainer
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
    inputsSwitch.style.setProperty("background-image", `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='-203 292.3 12 12'%3E%3Cpath fill='%23bcbcbc' d='M-200.5,300.9l1.2-1.2l2.3,2.3l2.3-2.3l1.2,1.2l-3.5,3.4L-200.5,300.9z'%3E%3C/path%3E%3Cpath fill='%23bcbcbc' d='M-197,292.3l3.5,3.4l-1.2,1.2l-2.3-2.3l-2.3,2.3l-1.2-1.2L-197,292.3z'%3E%3C/path%3E%3C/svg%3E")`)
    
    // Append elements
    inputsWrapper.appendChild(_gui_.buildInput.call(this))
    inputsSettings.appendChild(inputsWrapper)
    inputsSettings.appendChild(inputsSwitch)

    // Attach Events
    inputsSwitch.addEventListener("click", _event_.onClickInputsSwitch.bind(this))

    this.DOM["inputsWrapper"] = inputsWrapper

    return inputsSettings
  },
  buildInput: function() {
    if (this.currentRepresentation == HEX) {
      return _gui_.buildHEXInput.call(this)
    }
    else {
      return _gui_.buildQuadrupedInput.call(this)
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
    opacityThumb.style.setProperty("transform", `translate(${(this.color.a * opacitySlider.offsetWidth) - (opacityThumb.offsetWidth / 2)}px, -50%)`)
  },
  updateHueThumb: function() {
    const { hueThumb, hueSlider } = this.DOM
    hueThumb.style.setProperty("transform", `translate(${((this.color.hsv.h / 360) * hueSlider.offsetWidth) - (hueThumb.offsetWidth / 2)}px, -50%)`);
  },
  setQuadrupedValue: function(a, b, c) {
    this.DOM["inputA"].value = a
    this.DOM["inputB"].value = b
    this.DOM["inputC"].value = c
    this.DOM["inputAlpha"].value = this.color.a
  },
  updateHEXInput: function() {
    this.DOM["inputHEX"].value = this.color.hex
  },
  updateSettingsView: function() {
    _gui_.updateInputs.call(this)
    _gui_.updateColorView.call(this)
  },
  updateInputs: function() {
    switch (this.currentRepresentation) {
      case RGB: {
        const { r, g, b } = this.color.rgb = this.color.toRGB()
        _gui_.setQuadrupedValue.call(this, r, g, b)
      } break;

      case HSV: {
        const { h, s, v } = this.color.hsv
        _gui_.setQuadrupedValue.call(this, `${Math.round(h)}°`, `${Math.round(s)}%`, `${Math.round(v)}%`)
      } break;

      case HSL: {
        const { h, s, l } = this.color.hsl = this.color.toHSL()
        _gui_.setQuadrupedValue.call(this, `${Math.round(h)}°`, `${Math.round(s)}%`, `${Math.round(l)}%`)
      } break;

      case HEX: {
        _core_.updateHEXColor.call(this)
        _gui_.updateHEXInput.call(this)
      } break;
    }
  },
  updateColorView: function() {
    const alpha = this.color.a
    const hsl = this.color.toHSL()
    const { palette, opacitySlider, colorPreview } = this.DOM
    const paletteBGColor = `hsl(${hsl.h}deg 100% 50% / 1)`
    palette.style.backgroundImage = `linear-gradient(180deg, transparent 0%, rgba(0,0,0,1) 100%), linear-gradient(90deg, rgba(255,255,255,1) 0%, ${paletteBGColor} 100%)`
    const hslColor = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    opacitySlider.style.setProperty('background-image', `linear-gradient(90deg, transparent, ${hslColor})`)
    colorPreview.setAttribute("fill", hslColor)
    colorPreview.setAttribute("fill-opacity", alpha)
  },
  updateCursorPalette: function() {
    const { palette, cursor } = this.DOM
    const { s, v } = this.color.hsv
    cursor.style.setProperty("transform", `translate(${((s / 100) * palette.offsetWidth)}px, ${palette.offsetHeight - ((v / 100) * palette.offsetHeight)}px)`)
  },
  buildCopyColor: function() {
    const copyColorWrapper = _gui_.createElement("span")
    const copyColor = _gui_.createElement("button", ["cp-clipboard-color"])
    const hiddenInput = _gui_.createElement("input")
    copyColor.style.setProperty("background-image", this.copyIcon)
    copyColor.addEventListener("click", _event_.onClickCopyColor.bind(this))
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
    const sliderThumb = _gui_.createElement("div", ["cp-hue-slider-thumb"])

    // Appench child element
    sliderWrapper.appendChild(slider)
    sliderWrapper.appendChild(sliderThumb)

    // Attach events
    this.__onMouseDownHueSlider = _event_.onMouseDownHueSlider.bind(this)
    this.__onMouseUpHueSlider = _event_.onMouseUpHueSlider.bind(this)
    this.__onMouseMoveHueSlider = _event_.onMouseMoveHueSlider.bind(this)
    sliderWrapper.addEventListener('mousedown', this.__onMouseDownHueSlider)

    this.DOM["hueSlider"] = slider
    this.DOM["hueThumb"] = sliderThumb

    return sliderWrapper
  },
  buildOpacitySlider: function() {
    // Create elements
    const sliderWrapper = _gui_.createElement("div", ["cp-opacity-slider-wrapper"])
    const color = _gui_.createElement("div", ["cp-opacity-color"])
    const sliderThumb = _gui_.createElement("div", ["cp-opacity-slider-thumb"])

    // Appench child element
    sliderWrapper.appendChild(color)
    sliderWrapper.appendChild(sliderThumb)

    // Attach events
    this.__onMouseDownOpacitySlider = _event_.onMouseDownOpacitySlider.bind(this)
    this.__onMouseUpOpacitySlider = _event_.onMouseUpOpacitySlider.bind(this)
    this.__onMouseMoveOpacitySlider = _event_.onMouseMoveOpacitySlider.bind(this)
    sliderWrapper.addEventListener('mousedown', this.__onMouseDownOpacitySlider)

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
    colorPreview.setAttribute("stroke-width", 1)
    colorPreview.setAttribute("fill", "red")
    colorPreview.setAttribute("fill-opacity", "1")

    svgElement.innerHTML = '<defs><pattern id="transparent-grid" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="3" height="3" fill="#DBDBDB"/><rect x="3" y="0" width="3" height="3" fill="white"/><rect x="3" y="3" width="3" height="3" fill="#DBDBDB"/><rect x="0" y="3" width="3" height="3" fill="white"/></pattern></defs><circle cx="19" cy="19" r="18" fill="url(#transparent-grid)" />'
    svgElement.appendChild(colorPreview)
    colorPreviewWrapper.appendChild(svgElement)

    this.DOM.colorPreview = colorPreview

    return colorPreviewWrapper;
  },
  createElement: function(tag, classList) {
    const el = document.createElement(tag)
    if (classList != null) {
      el.classList.add(...classList)
    }
    return el
  },
  rgbUpdateView: function() {
    _gui_.updateColorView.call(this)
    _gui_.updateHueThumb.call(this)
    _gui_.updateCursorPalette.call(this)
  },
  updateHEXColorSection: function(color, event, con, conValue, op, startSelect, endSelect) {
    const { target } = event
    const { rgb, hex } = this.color
    if (con(rgb[color], conValue)) {
      rgb[color] = op(rgb[color], 1)
      this.color.hex = hex.substring(0, startSelect) + rgb[color].toString(16).padStart(2, '0') + hex.substring(endSelect)
      const { r, g, b  } = rgb
      this.color.hsv = this.color.RGBtoHSV(r, g, b)
      _gui_.rgbUpdateView.call(this)
    }
    target.value = this.color.hex
    target.setSelectionRange(startSelect, endSelect)
    event.preventDefault()
  },
  updateHEXAlphaSection: function(event, con, conValue, op) {
    const { target } = event
    const { hex, a } = this.color
    if (con(a, conValue)) {
      this.color.a = parseFloat(op(a, 0.01).toFixed(2))
      target.value = this.color.hex = hex.substring(0, 7) + Math.round(this.color.a * 255).toString(16).padStart(2, '0')
      _gui_.updateColorView.call(this)
      _gui_.updateOpacityThumb.call(this)
    }
    target.value = this.color.hex
    target.setSelectionRange(7, 9)
    event.preventDefault()
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
    document.addEventListener("mousemove", this.__onMouseMoveCursor);
    document.addEventListener("mouseup", this.__onMouseUpCursor);

    this.__onMouseMoveCursor(event);
  },
  onMouseUpCursor: function() {
    document.removeEventListener("mousemove", this.__onMouseMoveCursor);
    document.removeEventListener("mouseup", this.__onMouseUpCursor);
  },
  onMouseMoveCursor: function(event) {
    const { x, y } = _core_.getCursorPosition.call(this, event.clientX, event.clientY)
    this.DOM.cursor.style.transform = `translate(${x}px, ${y}px)`
    _core_.updateColor.call(this, x, y)
    _gui_.updateSettingsView.call(this)
  },
  onClickInputsSwitch: function() {
    const { inputsWrapper } = this.DOM
    inputsWrapper.innerHTML = ""
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
    inputsWrapper.appendChild(_gui_.buildInput.call(this))
    _gui_.updateInputs.call(this)
  },
  onFocusInput: function() {
    switch (this.currentRepresentation) {
      case RGB:
        this.color.rgb = this.getRGB()
      break
      case HSV:
        this.color.hsv = this.getHSV()
      break
      case HSL:
        this.color.hsl = this.getHSL()
      break
      case HEX:
        _core_.updateHEXColor.call(this)
      break
    }
  },
  onKeyDownAlphaInput: function(event) {
    const { target, key } = event
    const { a } = this.color
    switch (key) {
      case "ArrowUp": {
        if(a < 1) {
          let alphaValue = parseFloat((a + 0.01).toFixed(2))
          if (alphaValue > 1) {
            alphaValue = 1
          }
          target.value = this.color.a = alphaValue
          _gui_.updateColorView.call(this)
          _gui_.updateOpacityThumb.call(this)
        }
      } break;
      
      case "ArrowDown": {
        if(a > 0) {
          let alphaValue = parseFloat((a - 0.01).toFixed(2))
          if (alphaValue < 0) {
            alphaValue = 0
          }
          target.value = this.color.a = alphaValue
          _gui_.updateColorView.call(this)
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
    if (/^(0(\.\d{1,2})?|(0*)1?)$/.test(target.value)) {
      const value = parseFloat(target.value)
      if(!isNaN(value) && value >= 0 && value <= 1) {
        this.color.a = value
        _gui_.updateColorView.call(this)
        _gui_.updateOpacityThumb.call(this)
      }
    }
  },
  onChangeAlphaInput: function(event) {
    event.target.value = this.color.a
  },
  onKeyDownInputHEX: function(event) {
    const { target, key } = event
    switch (key) {
      case "ArrowUp": {
        if (!/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(target.value)) {
          target.value = this.color.hex
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
          target.value = this.color.hex
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
    const { target } = event
    const value = target.value.trim()
    if (/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value)) {
      const { r, g, b, a  } = this.color.HEXtoRGBA(value)
      this.color.a = a / 255
      this.color.rgb = { r, g, b }
      let hex = this.color.RGBtoHEX(r, g, b)
      if (this.color.a < 1) {
        hex += Math.round(this.color.a * 255).toString(16).padStart(2, 0)
      }
      this.color.hex = hex
      this.color.hsv = this.color.RGBtoHSV(r, g, b)
      _gui_.updateColorView.call(this)
      _gui_.updateHueThumb.call(this)
      _gui_.updateOpacityThumb.call(this)
      _gui_.updateCursorPalette.call(this)
    }
  },
  onChangeInputHEX: function(event) {
    event.target.value = this.color.hex
  },
  onKeyDownInputA: function(event) {
    const { target, key } = event
    switch (key) {
      case "ArrowUp": {
        switch (this.currentRepresentation) {
          case RGB: {
            let { r, g, b } = this.color.rgb
            if (r < 255) {
              this.color.rgb.r = target.value = ++r
              this.color.hsv = this.color.RGBtoHSV(r, g, b)
              _gui_.rgbUpdateView.call(this)
            }
          } break
      
          case HSV:
          case HSL: {
            let { h } = this.color.hsv
            if (h < 360) {
              target.value = ++h + "°"
              this.color.hsv.h = this.color.hsl.h = h
              _gui_.updateColorView.call(this)
              _gui_.updateHueThumb.call(this)
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
              _gui_.rgbUpdateView.call(this)
            }
          } break
      
          case HSV:
          case HSL: {
            let { h } = this.color.hsv
            if (h > 0) {
              target.value = --h + "°"
              this.color.hsv.h = this.color.hsl.h = h
              _gui_.updateColorView.call(this)
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
          const { g, b } = this.color.rgb
          if(!isNaN(value) && value >= 0 && value <= 255) {
            this.color.rgb.r = value
            this.color.hsv = this.color.RGBtoHSV(value, g, b)
            _gui_.updateColorView.call(this)
            _gui_.updateHueThumb.call(this)
            _gui_.updateCursorPalette.call(this)
          }
        } break

        case HSV:
        case HSL: {
          if (!isNaN(value) && value >= 0 && value <= 360) {
            this.color.hsv.h = this.color.hsl.h = value
            _gui_.updateColorView.call(this)
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
        value = this.color.rgb.r
      } break
      
      case HSV:
      case HSL: {
        value = `${this.color.hsv.h}°`
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
            let { r, g, b } = this.color.rgb
            if (g < 255) {
              this.color.rgb.g = target.value = ++g
              this.color.hsv = this.color.RGBtoHSV(r, g, b)
              _gui_.rgbUpdateView.call(this)
            }
          } break
      
          case HSV: {
            let { s } = this.color.hsv
            if (s < 100) {
              target.value = ++s + "%"
              this.color.hsv.s = s
              _gui_.updateColorView.call(this)
              _gui_.updateCursorPalette.call(this)
            }
          } break

          case HSL: {
            const { h, s, l } = this.color.hsl
            let hsl_s = s
            if (s < 100) {
              target.value = ++hsl_s + "%"
              this.color.hsl.s = hsl_s
              this.color.hsv.s = this.color.HSLtoHSV(h, hsl_s, l).s
              _gui_.updateColorView.call(this)
              _gui_.updateCursorPalette.call(this)
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
              _gui_.rgbUpdateView.call(this)
            }
          } break
      
          case HSV: {
            let { s } = this.color.hsv
            if (s > 0) {
              target.value = --s + "%"
              this.color.hsv.s = s
              _gui_.updateColorView.call(this)
              _gui_.updateCursorPalette.call(this)
            }
          } break

          case HSL: {
            const { h, s, l } = this.color.hsl
            let hsl_s = s
            if (hsl_s > 0) {
              target.value = --hsl_s + "%"
              this.color.hsl.s = hsl_s
              this.color.hsv.s = this.color.HSLtoHSV(h, hsl_s, l).s
              _gui_.updateColorView.call(this)
              _gui_.updateCursorPalette.call(this)
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
          const { r, b } = this.color.rgb
          if(!isNaN(value) && value >= 0 && value <= 255) {
            this.color.rgb.g = value
            this.color.hsv = this.color.RGBtoHSV(r, value, b)
            _gui_.updateColorView.call(this)
            _gui_.updateHueThumb.call(this)
            _gui_.updateCursorPalette.call(this)
          }
        } break

        case HSV: {
          if(!isNaN(value) && value >= 0 && value <= 100) {
            this.color.hsv.s = value
            _gui_.updateColorView.call(this)
            _gui_.updateCursorPalette.call(this)
          }
        } break

        case HSL: {
          const { h, l } = this.color.hsl
          if(!isNaN(value) && value >= 0 && value <= 100) {
            this.color.hsl.s = value
            this.color.hsv = this.color.HSLtoHSV(h, value, l)
            _gui_.updateColorView.call(this)
            _gui_.updateCursorPalette.call(this)
          }
        } break
      }
    }
  },
  onChangeInputB: function(event) {
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
  },
  onKeyDownInputC: function(event) {
    const { target, key } = event
    switch (key) {
      case "ArrowUp": {
        switch (this.currentRepresentation) {
          case RGB: {
            let { r, g, b } = this.color.rgb
            if (b < 255) {
              this.color.rgb.b = target.value = ++b
              this.color.hsv = this.color.RGBtoHSV(r, g, b)
              _gui_.rgbUpdateView.call(this)
            }
          } break
      
          case HSV: {
            let { v } = this.color.hsv
            if (v < 100) {
              target.value = ++v + "%"
              this.color.hsv.v = v
              _gui_.updateColorView.call(this)
              _gui_.updateCursorPalette.call(this)
            }
          } break

          case HSL: {
            const { h, s, l } = this.color.hsl
            let hsl_l = l
            if (hsl_l < 100) {
              target.value = ++hsl_l + "%"
              this.color.hsl.l = hsl_l
              this.color.hsv.v = this.color.HSLtoHSV(h, s, hsl_l).v
              _gui_.updateColorView.call(this)
              _gui_.updateCursorPalette.call(this)
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
              _gui_.rgbUpdateView.call(this)
            }
          } break
      
          case HSV: {
            let { v } = this.color.hsv
            if (v > 0) {
              target.value = --v + "%"
              this.color.hsv.v = v
              _gui_.updateColorView.call(this)
              _gui_.updateCursorPalette.call(this)
            }
          } break

          case HSL: {
            const { h, s, l } = this.color.hsl
            let hsl_l = l
            if (l > 0) {
              target.value = --hsl_l + "%"
              this.color.hsl.l = hsl_l
              this.color.hsv.v = this.color.HSLtoHSV(h, s, hsl_l).v
              _gui_.updateColorView.call(this)
              _gui_.updateCursorPalette.call(this)
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
          const { r, g } = this.color.rgb
          if(!isNaN(value) && value >= 0 && value <= 255) {
            this.color.rgb.b = value
            this.color.hsv = this.color.RGBtoHSV(r, g, value)
            _gui_.updateColorView.call(this)
            _gui_.updateHueThumb.call(this)
            _gui_.updateCursorPalette.call(this)
          }
        } break

        case HSV: {
          if(!isNaN(value) && value >= 0 && value <= 100) {
            this.color.hsv.v = value
            _gui_.updateColorView.call(this)
            _gui_.updateCursorPalette.call(this)
          }
        } break

        case HSL: {
          const { h, s } = this.color.hsl
          if(!isNaN(value) && value >= 0 && value <= 100) {
            this.color.hsl.l = value
            this.color.hsv = this.color.HSLtoHSV(h, s, value)
            _gui_.updateColorView.call(this)
            _gui_.updateCursorPalette.call(this)
          }
        } break
      }
    }
  },
  onChangeInputC: function(event) {
    let value = event.target.value
    switch (this.currentRepresentation) {
      case RGB: {
        value = this.color.rgb.b
      } break
      
      case HSV: {
        value = `${this.color.hsv.v}%`
      } break
      
      case HSL: {
        value = `${this.color.hsl.l}%`
      } break
    }
    event.target.value = value
  },
  onClickCopyColor: function() {
    this.DOM.hiddenInput.value = _core_.getColorText.call(this)
    this.DOM.hiddenInput.select()
    document.execCommand('copy')
    this.DOM.copyColor.style.setProperty("background-image", `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='14' height='14'%3E%3Cpath fill='%23bcbcbc' d='M15.2,4.7c0.3-0.3,0.2-0.7-0.1-1l-0.8-0.8c-0.3-0.3-0.7-0.2-1,0.1l-6.7,7.5L2.5,6.7c-0.3-0.3-0.7-0.2-1,0.1 L0.7,7.6c-0.3,0.3-0.2,0.7,0.1,1l5.5,5c0.3,0.3,0.7,0.2,1-0.1L15.2,4.7z'/%3E%3C/svg%3E")`)
    
    setTimeout(()=>{
      this.DOM.copyColor.style.setProperty("background-image", this.copyIcon)
    }, 600);
  },
  onMouseDownHueSlider: function(event) {
    document.addEventListener('mousemove', this.__onMouseMoveHueSlider)
    document.addEventListener('mouseup', this.__onMouseUpHueSlider)

    this.__onMouseMoveHueSlider(event)
  },
  onMouseUpHueSlider: function() {
    document.removeEventListener('mousemove', this.__onMouseMoveHueSlider)
    document.removeEventListener('mouseup', this.__onMouseUpHueSlider)
  },
  onMouseMoveHueSlider: function(event) {
    const { hueSlider, hueThumb } = this.DOM
    const sliderRect = hueSlider.getBoundingClientRect()
    const sliderThumbHalfWidth = hueThumb.offsetWidth / 2
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
    hueThumb.style.transform = `translate(${thumbX}px, -50%)`

    _gui_.updateSettingsView.call(this)
  },
  onMouseDownOpacitySlider: function(event) {
    document.addEventListener('mousemove', this.__onMouseMoveOpacitySlider)
    document.addEventListener('mouseup', this.__onMouseUpOpacitySlider)

    this.__onMouseMoveOpacitySlider(event)
  },
  onMouseUpOpacitySlider: function() {
    document.removeEventListener('mousemove', this.__onMouseMoveOpacitySlider)
    document.removeEventListener('mouseup', this.__onMouseUpOpacitySlider)
  },
  onMouseMoveOpacitySlider: function(event) {
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
      _core_.updateHEXColor.call(this)
      _gui_.updateHEXInput.call(this)
    }
    else {
      inputAlpha.value = this.color.a
    }

    _gui_.updateColorView.call(this)
  },
}