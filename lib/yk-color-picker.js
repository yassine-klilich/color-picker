
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
    const paletteRect = this._dom.palette.getBoundingClientRect();
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
    const boxRect = this._dom.overlayWrapper.getBoundingClientRect();
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

    let w = window.innerWidth
    w -= w - document.documentElement.clientWidth
    const b = x_axis + boxRect.width
    if (w < b) {
      x_axis -= b - w
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
    this._dom.overlayWrapper.style.top = `${y}px`
    this._dom.overlayWrapper.style.left = `${x}px`
  }
}

const _gui_ = {
  initDOM: function() {
    // _dom declaration
    const cp_overlayWrapper = _gui_.createElement("div", ["cp-overlay-wrapper"])
    const cp_Wrapper = _gui_.createElement("div", ["cp-wrapper"])
  
    // Append child nodes
    cp_overlayWrapper.appendChild(cp_Wrapper)
    // build palette
    cp_Wrapper.appendChild(_gui_.buildPaletteColor.call(this))
    // build color settings
    cp_Wrapper.appendChild(_gui_.buildColorSettings.call(this))
  
    cp_overlayWrapper.addEventListener("click", event => event.stopPropagation())
    this._dom["overlayWrapper"] = cp_overlayWrapper
    
	  this.__onKeyUpClose = _event_.onKeyUpClose.bind(this)
    this.__onResizeScrollWindow = _event_.onResizeScrollWindow.bind(this)
    this.__onClickClose = this.close.bind(this)

    if (this.options.container) {
      _gui_.attachToContainer.call(this, false)
    }
    else {
      document.body.appendChild(this._dom.overlayWrapper)
    }

    this.options.onInit(this)
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
    paletteWrapper.addEventListener("pointerdown", this.__onMouseDownCursor);
  
    this._dom["palette"] = palette;
    this._dom["cursor"] = cursor;
  
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
    inputsSwitch.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='-203 292.3 12 12'><path d='m-200.5 300.9 1.2-1.2 2.3 2.3 2.3-2.3 1.2 1.2-3.5 3.4-3.5-3.4zM-197 292.3l3.5 3.4-1.2 1.2-2.3-2.3-2.3 2.3-1.2-1.2 3.5-3.4z'/></svg>`
    
    // Append elements
    inputsSettings.appendChild(inputsWrapper)
    inputsSettings.appendChild(inputsSwitch)

    // Attach Events
    inputsSwitch.addEventListener("click", _event_.onClickInputsSwitch.bind(this))

    this._dom["inputsWrapper"] = inputsWrapper

    return inputsSettings
  },
  buildInput: function() {
    const { inputsWrapper } = this._dom
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

    this._dom["inputHEX"] = inputHEX

    return inputWrapper
  },
  buildQuadrupedInput: function() {
    // Create _dom elements
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


    this._dom["inputA"] = inputA
    this._dom["inputB"] = inputB
    this._dom["inputC"] = inputC
    this._dom["inputAlpha"] = inputD

    return inputWrapper
  },
  updateOpacityThumb: function() {
    const { opacitySlider, opacityThumb } = this._dom
    opacityThumb.style.translate = `${(this.__c.a * opacitySlider.offsetWidth)}px`
  },
  updateHueThumb: function() {
    const { hueThumb, hueSlider } = this._dom
    hueThumb.style.translate = `${((this.__c.hsv.h / 360) * hueSlider.offsetWidth)}px`
  },
  setQuadrupedValue: function(a, b, c) {
    this._dom["inputA"].value = a
    this._dom["inputB"].value = b
    this._dom["inputC"].value = c
    this._dom["inputAlpha"].value = parseFloat(this.__c.a.toFixed(2))
  },
  updateHEXInput: function() {
    this._dom["inputHEX"].value = this.__c.hex
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
    const { palette, opacitySlider, colorPreview } = this._dom
    const paletteBGColor = `hsl(${hsl.h}deg 100% 50% / 1)`
    palette.style.backgroundImage = `linear-gradient(180deg, transparent 0%, rgba(0,0,0,1) 100%), linear-gradient(90deg, rgba(255,255,255,1) 0%, ${paletteBGColor} 100%)`
    const hslColor = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    opacitySlider.style.setProperty('background-image', `linear-gradient(90deg, transparent, ${hslColor})`)
    colorPreview.setAttribute("fill", hslColor)
    colorPreview.setAttribute("fill-opacity", alpha)
    if (fireEvent == true) {
      this.options.onInput(this)
    }
  },
  updateCursorThumb: function() {
    const { palette, cursor } = this._dom
    const { s, v } = this.__c.hsv
    cursor.style.translate = `${((s / 100) * palette.offsetWidth)}px ${palette.offsetHeight - ((v / 100) * palette.offsetHeight)}px`
  },
  buildCopyColor: function() {
    const copyColorWrapper = _gui_.createElement("span")
    const copyColor = _gui_.createElement("button", ["cp-clipboard-color"])
    copyColor.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='-201 290.3 16 16'><path d='M-199.1 301.3v-6.7c0-2 1.6-3.7 3.7-3.7h4.3c.8 0 1.5.5 1.7 1.2H-195c-1.6.1-2.9 1.4-2.9 3.1v7.9c-.7-.3-1.2-1-1.2-1.8zm4.3 4.3c-1 0-1.8-.8-1.8-1.8v-8.6c0-1 .8-1.8 1.8-1.8h6.1c1 0 1.8.8 1.8 1.8v8.6c0 1-.8 1.8-1.8 1.8h-6.1zm6.7-1.8v-8.6c0-.3-.3-.6-.6-.6h-6.1c-.3 0-.6.3-.6.6v8.6c0 .3.3.6.6.6h6.1c.3 0 .6-.3.6-.6z'/></svg>`
    copyColor.addEventListener("click", _event_.onClickCopyColor.bind(this))

    copyColorWrapper.appendChild(copyColor)

    this._dom["copyColor"] = copyColor

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
    sliderWrapper.addEventListener('pointerdown', this.__onMouseDownHueSlider)
    sliderThumb.addEventListener('keydown', _event_.onKeyDownHueSlider.bind(this))

    this._dom["hueSlider"] = slider
    this._dom["hueThumb"] = sliderThumb

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
    sliderWrapper.addEventListener('pointerdown', this.__onMouseDownOpacitySlider)
    sliderThumb.addEventListener('keydown', _event_.onKeyDownOpacitySlider.bind(this))

    this._dom["opacitySlider"] = color
    this._dom["opacityThumb"] = sliderThumb

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
    colorPreview.classList.add("cp-preview-stroke")

    svgElement.innerHTML = '<defs><pattern id="transparent-grid" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse"><path fill="#DBDBDB" d="M0 0h3v3H0z"/><path fill="#fff" d="M3 0h3v3H3z"/><path fill="#DBDBDB" d="M3 3h3v3H3z"/><path fill="#fff" d="M0 3h3v3H0z"/></pattern></defs><circle cx="19" cy="19" r="18" fill="url(#transparent-grid)"/>'
    svgElement.appendChild(colorPreview)
    colorPreviewWrapper.appendChild(svgElement)

    this._dom.colorPreview = colorPreview

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
    const val = Math.round(rgb[color])
    if (con(val, conValue)) {
      rgb[color] = op(val, 1)
      this.__c.hex = hex.substring(0, startSelect) + _util_.hexPad2(Math.round(rgb[color])) + hex.substring(endSelect)
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
      target.value = this.__c.hex = hex.substring(0, 7) + _util_.hexPad2(Math.round(this.__c.a * 255))
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
      this._dom.inputAlpha.value = this.__c.a
    }
    _gui_.updateColorPreview.call(this, true)
  },
  updatePosition: function() {
    let { x, y } = _core_.getPositionAxis.call(this)
    x = x < 0 ? 0 : x
    y = y < 0 ? 0 : y
    _core_.setPositionAxis.call(this, {x, y})
  },
  attachToContainer: function(callEvent) {
    const container = document.getElementById(this.options.container)
    if (container == null) {
      throw ReferenceError("ColorPicker:: container to set color picker is undefined")
    }
    _event_.removeWindowEvents.call(this)
    const { overlayWrapper } = this._dom
    const parent = overlayWrapper.parentElement
    container.appendChild(overlayWrapper)
    overlayWrapper.className = ""
    overlayWrapper.classList.add(
      "cp-overlay-wrapper",
      "cp-overlay-wrapper--static",
      "cp-overlay-wrapper--open",
      "cp-overlay-wrapper--" + this.options.theme
    )
    _gui_.updateGUI.call(this)
    this.isOpen = true
    if (callEvent && parent != overlayWrapper.parentElement) {
      this.options.onContainerChange(this, parent)
    }
  },
  attachToBody: function() {
    _event_.removeWindowEvents.call(this)
    const { overlayWrapper } = this._dom
    const parent = overlayWrapper.parentElement
    document.body.appendChild(overlayWrapper)
    overlayWrapper.className = ""
    overlayWrapper.classList.remove("cp-overlay-wrapper--static")
    overlayWrapper.classList.add(
      "cp-overlay-wrapper",
      "cp-overlay-wrapper--open",
      "cp-overlay-wrapper--" + this.options.theme
    )
    _gui_.updateGUI.call(this)
    _gui_.updatePosition.call(this)
		window.addEventListener("resize", this.__onResizeScrollWindow)
		window.addEventListener("scroll", this.__onResizeScrollWindow)
		document.addEventListener("click", this.__onClickClose)
    if (this.options.escapeKey) {
      document.addEventListener("keyup", this.__onKeyUpClose)
    }
    this.isOpen = true
    if (parent != overlayWrapper.parentElement) {
      this.options.onContainerChange(this, parent)
    }
  },
  detachOverlay: function() {
		this._dom.overlayWrapper.classList.remove("cp-overlay-wrapper--open")
    _event_.removeWindowEvents.call(this)
    this.isOpen = false
  },
}

const _event_ = {
  onClickTarget: function(event) {
    event.stopPropagation();
    if (this.isOpen) this.close()
    else this.open()
  },
  onMouseDownCursor: function(event) {
    this.__dc = true
    document.addEventListener("pointermove", this.__onMouseMoveCursor);
    document.addEventListener("pointerup", this.__onMouseUpCursor);
    this.__onMouseMoveCursor(event);
  },
  onMouseUpCursor: function(e) {
    document.removeEventListener("pointermove", this.__onMouseMoveCursor);
    document.removeEventListener("pointerup", this.__onMouseUpCursor);
    if (this._dom.overlayWrapper.contains(e.target)) {
      this.__dc = false
    }
  },
  onMouseMoveCursor: function(event) {
    const { x, y } = _core_.getCursorPosition.call(this, event.clientX, event.clientY)
    this._dom.cursor.style.translate = `${x}px ${y}px`
    const paletteHeight = this._dom.palette.offsetHeight
    const paletteWidth = this._dom.palette.offsetWidth
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
    navigator.clipboard.writeText(_core_.getColorText.call(this)).then(
      () => {
        this._dom.copyColor.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='12' height='12'><path d='M15.2 4.7c.3-.3.2-.7-.1-1l-.8-.8c-.3-.3-.7-.2-1 .1l-6.7 7.5-4.1-3.8c-.3-.3-.7-.2-1 .1l-.8.8c-.3.3-.2.7.1 1l5.5 5c.3.3.7.2 1-.1l7.9-8.8z'/></svg>`
        this.options.onCopy(this)
        setTimeout(()=>{
          this._dom.copyColor.innerHTML = this.copyIcon
        }, 600)
      }
    )
  },
  onMouseDownHueSlider: function(event) {
    event.preventDefault() // prevent default to set focus on the thumb
    this.__dc = true
    document.addEventListener('pointermove', this.__onMouseMoveHueSlider)
    document.addEventListener('pointerup', this.__onMouseUpHueSlider)
    this._dom.hueThumb.focus()
    this.__onMouseMoveHueSlider(event)
  },
  onMouseUpHueSlider: function(e) {
    document.removeEventListener('pointermove', this.__onMouseMoveHueSlider)
    document.removeEventListener('pointerup', this.__onMouseUpHueSlider)
    if (this._dom.overlayWrapper.contains(e.target)) {
      this.__dc = false
    }
  },
  onMouseMoveHueSlider: function(event) {
    const { hueSlider, hueThumb } = this._dom
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
    document.addEventListener('pointermove', this.__onMouseMoveOpacitySlider)
    document.addEventListener('pointerup', this.__onMouseUpOpacitySlider)
    this._dom.opacityThumb.focus()
    this.__onMouseMoveOpacitySlider(event)
  },
  onMouseUpOpacitySlider: function(e) {
    document.removeEventListener('pointermove', this.__onMouseMoveOpacitySlider)
    document.removeEventListener('pointerup', this.__onMouseUpOpacitySlider)
    if (this._dom.overlayWrapper.contains(e.target)) {
      this.__dc = false
    }
  },
  onMouseMoveOpacitySlider: function(event) {
    const { opacitySlider, opacityThumb } = this._dom
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
        const { hueThumb, hueSlider } = this._dom
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
        const { hueThumb, hueSlider } = this._dom
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
        const { opacityThumb, opacitySlider } = this._dom
        let position = parseInt(opacityThumb.style.translate)
        if (!isNaN(position) && position < opacitySlider.offsetWidth) {
          opacityThumb.style.translate = `${++position}px`
          _gui_.updateOpacityValue.call(this, (position / opacitySlider.offsetWidth))
        }
        event.preventDefault()
      } break
      
      case "ArrowDown":
      case "ArrowLeft": {
        const { opacityThumb, opacitySlider } = this._dom
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
    if (event.key == "Escape") {
      if (this._prevColor != this.getHEX()) {
        this.setColor(this._prevColor)
        _gui_.updateGUI.call(this)
        this.options.onInput(this)
      }
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
  },
  removeWindowEvents: function() {
    window.removeEventListener("resize", this.__onResizeScrollWindow)
    window.removeEventListener("scroll", this.__onResizeScrollWindow)
    document.removeEventListener("keyup", this.__onKeyUpClose)
    document.removeEventListener("click", this.__onClickClose)
  }
}