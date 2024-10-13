import "./yk-color-picker.css";

import { YKColor } from "./yk-color";
import { YKColorParser } from "./yk-color-parser";
import { hexPad2, createElement, attachEvent } from "./utility";

/**
 * Color Picker
 */
export default class YKColorPicker {
  #isOpen = false;
  #options = YKColorPicker.DEFAULT_OPTIONS;
  #color = null;
  #dom = {};
  #currentRepresentation;
  #dc;
  #onClickTargetBind;
  #onMouseDownCursorBind;
  #onMouseUpHueSliderBind;
  #onMouseMoveHueSliderBind;
  #onMouseDownHueSliderBind;
  #onMouseDownOpacitySliderBind;
  #onMouseUpOpacitySliderBind;
  #onMouseMoveOpacitySliderBind;
  #onResizeScrollWindowBind;
  #onClickCloseBind;
  #onKeyUpCloseBind;
  #onMouseMoveCursorBind;
  #onMouseUpCursorBind;
  #copyTimeout = null;

  static TOP = "t";
  static BOTTOM = "b";
  static LEFT = "l";
  static RIGHT = "r";

  static RGB = "rgb";
  static HSV = "hsv";
  static HSL = "hsl";
  static HEX = "hex";

  static DEFAULT_OPTIONS = Object.freeze({
    target: null,
    container: null,
    position: YKColorPicker.BOTTOM,
    positionFallback: "btrl",
    representation: YKColorPicker.RGB,
    color: "red",
    closeOnScroll: true,
    closeOnResize: false,
    theme: "light",
    onInit: () => {},
    onOpen: () => {},
    onClose: () => {},
    onInput: () => {},
    onChange: () => {},
    onCopy: () => {},
    onRepresentationChange: () => {},
    onContainerChange: () => {},
  });

  constructor(options) {
    this.#options = YKColorPicker.#buildOptions(
      YKColorPicker.DEFAULT_OPTIONS,
      options
    );

    const { target, representation } = this.#options;

    this.#dom["target"] = target;
    this.#currentRepresentation = representation;

    // init click and enter key to target
    if (target) {
      this.#onClickTargetBind = this.#onClickTarget.bind(this);
      attachEvent(target, "click", this.#onClickTargetBind);
    }

    this.setColor(this.#options.color);
    this._prevColor = this.getHEX();
    this.#initDOM();
  }

  isOpen() {
    return this.#isOpen;
  }

  open() {
    this._prevColor = this.getHEX();
    if (this.#options.container) {
      this.#attachToContainer(true);
    } else {
      this.#attachToBody();
    }
    this.#options.onOpen(this);
  }

  close() {
    if (!this.#dc) {
      if (this._prevColor != this.getHEX()) {
        this.#options.onChange(this);
      }
      this.#detachOverlay();
      this.#options.onClose(this);
    }
    this.#dc = false;
  }

  getRGB() {
    return { ...this.#color.toRGB(), a: this.#color.a };
  }

  getHSV() {
    const { h, s, v } = this.#color.hsv;
    return {
      h: Math.round(h),
      s: Math.round(s),
      v: Math.round(v),
      a: this.#color.a,
    };
  }

  getHSL() {
    const { h, s, l } = this.#color.toHSL();
    return {
      h: Math.round(h),
      s: Math.round(s),
      l: Math.round(l),
      a: this.#color.a,
    };
  }

  getHEX() {
    return this.#color.toHEX();
  }

  updateOptions(options) {
    const _options = YKColorPicker.#buildOptions(this.#options, options);
    this.#options = _options;
    const { target, representation } = this.#options;

    // update representation
    if (this.#currentRepresentation != representation) {
      this.#updateRepresentation(representation);
    }

    // update target
    if (this.#dom.target != target) {
      if (this.#dom.target != null) {
        this.#dom.target.removeEventListener("click", this.#onClickTargetBind);
      }
      this.#dom.target = target;
      if (this.#dom.target != null) {
        this.#dom.attachEvent(target, "click", this.#onClickTargetBind);
      }
    }

    if (this.#isOpen) {
      if (this.#options.container) {
        this.#attachToContainer(true);
      } else {
        this.#attachToBody();
      }
    }
  }

  getColor() {
    switch (this.#currentRepresentation) {
      case YKColorPicker.RGB: {
        const { r, g, b } = this.#color.rgb;
        return {
          r: Math.round(r),
          g: Math.round(g),
          b: Math.round(b),
          a: this.#color.a,
        };
      }

      case YKColorPicker.HSV: {
        const { h, s, v } = this.#color.hsv;
        return {
          h: Math.round(h),
          s: Math.round(s),
          l: Math.round(v),
          a: this.#color.a,
        };
      }

      case YKColorPicker.HSL: {
        const { h, s, l } = this.#color.hsl;
        return {
          h: Math.round(h),
          s: Math.round(s),
          l: Math.round(l),
          a: this.#color.a,
        };
      }

      case YKColorPicker.HEX:
        return this.getHEX();
    }
  }

  setColor(value) {
    const { h, s, v, a } = YKColorParser.parse(value);
    this.#color = new YKColor(h, s, v, a);
  }

  #initDOM() {
    // #dom declaration
    const cp_overlayWrapper = createElement("div", ["yk-overlay-wrapper"]);
    const cp_Wrapper = createElement("div", ["yk-wrapper"]);

    // Append child nodes
    cp_overlayWrapper.appendChild(cp_Wrapper);
    // build palette
    cp_Wrapper.appendChild(this.#buildPaletteColor());
    // build color settings
    cp_Wrapper.appendChild(this.#buildColorSettings());

    attachEvent(cp_overlayWrapper, "click", (event) => event.stopPropagation());
    this.#dom["overlayWrapper"] = cp_overlayWrapper;

    this.#onKeyUpCloseBind = this.#onKeyUpClose.bind(this);
    this.#onResizeScrollWindowBind = this.#onResizeScrollWindow.bind(this);
    this.#onClickCloseBind = this.close.bind(this);

    if (this.#options.container) {
      this.#attachToContainer(false);
    } else {
      document.body.appendChild(this.#dom.overlayWrapper);
    }

    this.#options.onInit(this);
  }

  #updateGUI() {
    this.#updateCursorThumb();
    this.#updateInputs();
    this.#updateColorPreview(false);
    this.#updateHueThumb();
    this.#updateOpacityThumb();
  }

  #buildPaletteColor() {
    const paletteWrapper = createElement("div", ["yk-palette-wrapper"]);
    const palette = createElement("div", ["yk-palette"]);
    const cursor = createElement("div", ["yk-cursor"]);

    paletteWrapper.appendChild(palette);
    paletteWrapper.appendChild(cursor);

    // Append event
    this.#onMouseDownCursorBind = this.#onMouseDownCursor.bind(this);
    this.#onMouseUpCursorBind = this.#onMouseUpCursor.bind(this);
    this.#onMouseMoveCursorBind = this.#onMouseMoveCursor.bind(this);
    attachEvent(paletteWrapper, "pointerdown", this.#onMouseDownCursorBind);

    this.#dom["palette"] = palette;
    this.#dom["cursor"] = cursor;

    return paletteWrapper;
  }

  #buildColorSettings() {
    const colorSettings = createElement("div", ["yk-color-settings"]);

    // Build color color
    colorSettings.appendChild(this.#buildCopyColor());
    // Build color preview
    colorSettings.appendChild(this.#buildColorPreview());
    // Build sliders
    colorSettings.appendChild(this.#buildColorSliders());
    // Build inputs
    colorSettings.appendChild(this.#buildColorInputs());

    return colorSettings;
  }

  #buildColorInputs() {
    // Create elements
    const inputsSettings = createElement("div", ["yk-color-model-wrapper"]);
    const inputsWrapper = createElement("div", ["yk-color-model"]);
    const inputsSwitch = createElement("button", ["yk-color-model-switch"], {
      type: "button",
    });
    inputsSwitch.appendChild(
      this.#createSVGIcon(
        `<path d="m3.5045 11.431 1.5786-1.5786 3.0256 3.0256 3.0256-3.0256 1.5786 1.5786-4.6042 4.4726zm4.6042-11.313 4.6042 4.4726-1.5786 1.5786-3.0256-3.0256-3.0256 3.0256-1.5786-1.5786z"/>`
      )
    );

    // Append elements
    inputsSettings.appendChild(inputsWrapper);
    inputsSettings.appendChild(inputsSwitch);

    // Attach Events
    attachEvent(inputsSwitch, "click", this.#onClickInputsSwitch.bind(this));

    this.#dom["inputsWrapper"] = inputsWrapper;

    return inputsSettings;
  }

  #buildInput() {
    const { inputsWrapper } = this.#dom;
    inputsWrapper.innerHTML = "";
    if (this.#currentRepresentation == YKColorPicker.HEX) {
      inputsWrapper.appendChild(this.#buildHEXInput());
    } else {
      inputsWrapper.appendChild(this.#buildQuadrupedInput());
    }
  }

  #buildHEXInput() {
    const inputWrapper = createElement("div", ["yk-hex-input"]);
    const inputHEX = createElement("input", ["yk-color-input"]);
    const labelHEX = createElement("label", ["yk-color-model-label"]);
    inputHEX.setAttribute("type", "text");
    labelHEX.textContent = "HEX";
    inputWrapper.appendChild(inputHEX);
    inputWrapper.appendChild(labelHEX);

    attachEvent(inputHEX, "focus", this.#onFocusInput.bind(this));
    attachEvent(inputHEX, "keydown", this.#onKeyDownInputHEX.bind(this));
    attachEvent(inputHEX, "input", this.#onInputHEX.bind(this));
    attachEvent(inputHEX, "change", this.#onChangeInputHEX.bind(this));

    this.#dom["inputHEX"] = inputHEX;

    return inputWrapper;
  }

  #buildQuadrupedInput() {
    // Create #dom elements
    const inputWrapper = createElement("div", ["yk-input-wrapper"]);
    const inputA = createElement("input", ["yk-color-input"], {
      type: "text",
      inputmode: "numeric",
    });
    const inputB = createElement("input", ["yk-color-input"], {
      type: "text",
      inputmode: "numeric",
    });
    const inputC = createElement("input", ["yk-color-input"], {
      type: "text",
      inputmode: "numeric",
    });
    const inputD = createElement("input", ["yk-color-input"], {
      type: "text",
      inputmode: "numeric",
    });
    const labelA = createElement("label", ["yk-color-model-label"]);
    const labelB = createElement("label", ["yk-color-model-label"]);
    const labelC = createElement("label", ["yk-color-model-label"]);
    const labelD = createElement("label", ["yk-color-model-label"]);

    // Set labels' text
    const model = this.#currentRepresentation.toUpperCase();
    labelA.textContent = model[0];
    labelB.textContent = model[1];
    labelC.textContent = model[2];
    labelD.textContent = "A";

    // Append child elements
    inputWrapper.appendChild(inputA);
    inputWrapper.appendChild(inputB);
    inputWrapper.appendChild(inputC);
    inputWrapper.appendChild(inputD);
    inputWrapper.appendChild(labelA);
    inputWrapper.appendChild(labelB);
    inputWrapper.appendChild(labelC);
    inputWrapper.appendChild(labelD);

    // Attach events
    attachEvent(inputA, "focus", this.#onFocusInput.bind(this));
    attachEvent(inputA, "keydown", this.#onKeyDownInputA.bind(this));
    attachEvent(inputA, "input", this.#onInputA.bind(this));
    attachEvent(inputA, "change", this.#onChangeInputA.bind(this));

    attachEvent(inputB, "focus", this.#onFocusInput.bind(this));
    attachEvent(inputB, "keydown", this.#onKeyDownInputB.bind(this));
    attachEvent(inputB, "input", this.#onInputB.bind(this));
    attachEvent(inputB, "change", this.#onChangeInputB.bind(this));

    attachEvent(inputC, "focus", this.#onFocusInput.bind(this));
    attachEvent(inputC, "keydown", this.#onKeyDownInputC.bind(this));
    attachEvent(inputC, "input", this.#onInputC.bind(this));
    attachEvent(inputC, "change", this.#onChangeInputC.bind(this));

    attachEvent(inputD, "keydown", this.#onKeyDownAlphaInput.bind(this));
    attachEvent(inputD, "input", this.#onKeyUpAlphaInput.bind(this));
    attachEvent(inputD, "change", this.#onChangeAlphaInput.bind(this));

    this.#dom["inputA"] = inputA;
    this.#dom["inputB"] = inputB;
    this.#dom["inputC"] = inputC;
    this.#dom["inputAlpha"] = inputD;

    return inputWrapper;
  }

  #updateOpacityThumb() {
    const { opacitySlider, opacityThumb } = this.#dom;
    opacityThumb.style.translate = `${
      this.#color.a * opacitySlider.offsetWidth
    }px`;
  }

  #updateHueThumb() {
    const { hueThumb, hueSlider } = this.#dom;
    hueThumb.style.translate = `${
      (this.#color.hsv.h / 360) * hueSlider.offsetWidth
    }px`;
  }

  #setQuadrupedValue(a, b, c) {
    this.#dom["inputA"].value = a;
    this.#dom["inputB"].value = b;
    this.#dom["inputC"].value = c;
    this.#dom["inputAlpha"].value = parseFloat(this.#color.a.toFixed(2));
  }

  #updateHEXInput() {
    this.#dom["inputHEX"].value = this.#color.hex;
  }

  #updateSettingsView() {
    this.#updateInputsValue();
    this.#updateColorPreview(true);
  }

  #updateInputs() {
    this.#buildInput();
    this.#updateInputsValue();
  }

  #updateInputsValue() {
    switch (this.#currentRepresentation) {
      case YKColorPicker.RGB:
        {
          const { r, g, b } = (this.#color.rgb = this.#color.toRGB());
          this.#setQuadrupedValue(Math.round(r), Math.round(g), Math.round(b));
        }
        break;

      case YKColorPicker.HSV:
        {
          const { h, s, v } = this.#color.hsv;
          this.#setQuadrupedValue(
            `${Math.round(h)}°`,
            `${Math.round(s)}%`,
            `${Math.round(v)}%`
          );
        }
        break;

      case YKColorPicker.HSL:
        {
          const { h, s, l } = (this.#color.hsl = this.#color.toHSL());
          this.#setQuadrupedValue(
            `${Math.round(h)}°`,
            `${Math.round(s)}%`,
            `${Math.round(l)}%`
          );
        }
        break;

      case YKColorPicker.HEX:
        {
          this.#updateHEXColor();
          this.#updateHEXInput();
        }
        break;
    }
  }

  #updateColorPreview(fireEvent) {
    const alpha = this.#color.a;
    const hsl = this.#color.toHSL();
    const { palette, opacitySlider, colorPreview } = this.#dom;
    const paletteBGColor = `hsl(${hsl.h}deg 100% 50% / 1)`;
    palette.style.backgroundImage = `linear-gradient(180deg, transparent 0%, rgba(0,0,0,1) 100%), linear-gradient(90deg, rgba(255,255,255,1) 0%, ${paletteBGColor} 100%)`;
    const hslColor = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    opacitySlider.style.setProperty(
      "background-image",
      `linear-gradient(90deg, transparent, ${hslColor})`
    );
    colorPreview.setAttribute("fill", hslColor);
    colorPreview.setAttribute("fill-opacity", alpha);
    if (fireEvent == true) {
      this.#options.onInput(this);
    }
  }

  #updateCursorThumb() {
    const { palette, cursor } = this.#dom;
    const { s, v } = this.#color.hsv;
    cursor.style.translate = `${(s / 100) * palette.offsetWidth}px ${
      palette.offsetHeight - (v / 100) * palette.offsetHeight
    }px`;
  }

  #buildCopyColor() {
    const copyColor = createElement("button", ["yk-clipboard-color"], {
      type: "button",
    });
    attachEvent(copyColor, "click", this.#onClickCopyColor.bind(this));
    this.#dom["copyColor"] = copyColor;
    this.#attachCopyIcon();

    return copyColor;
  }

  #attachCopyIcon() {
    const path = `<path d="m1.9695 11.037v-6.7c0-2 1.6-3.7 3.7-3.7h4.3c0.8 0 1.5 0.5 1.7 1.2h-5.6c-1.6 0.1-2.9 1.4-2.9 3.1v7.9c-0.7-0.3-1.2-1-1.2-1.8zm4.3 4.3c-1 0-1.8-0.8-1.8-1.8v-8.6c0-1 0.8-1.8 1.8-1.8h6.1c1 0 1.8 0.8 1.8 1.8v8.6c0 1-0.8 1.8-1.8 1.8zm6.7-1.8v-8.6c0-0.3-0.3-0.6-0.6-0.6h-6.1c-0.3 0-0.6 0.3-0.6 0.6v8.6c0 0.3 0.3 0.6 0.6 0.6h6.1c0.3 0 0.6-0.3 0.6-0.6z"/>`;
    this.#dom.copyColor.innerHTML = "";
    this.#dom.copyColor.appendChild(this.#createSVGIcon(path));
  }

  #attachCheckIcon() {
    const path = `<path d="m13.975 5.3001c0.24929-0.24929 0.16619-0.58168-0.0831-0.83097l-0.66477-0.66477c-0.24929-0.24929-0.58168-0.16619-0.83097 0.083097l-5.5675 6.2322-3.407-3.1577c-0.24929-0.24929-0.58168-0.16619-0.83097 0.083097l-0.66477 0.66477c-0.24929 0.24929-0.16619 0.58168 0.083097 0.83097l4.5703 4.1548c0.24929 0.24929 0.58168 0.16619 0.83097-0.0831z"/>`;
    this.#dom.copyColor.innerHTML = "";
    this.#dom.copyColor.appendChild(this.#createSVGIcon(path));
  }

  #createSVGIcon(path) {
    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElement.setAttribute("viewBox", "0 0 16 16");
    svgElement.setAttribute("width", "16px");
    svgElement.setAttribute("height", "16px");
    svgElement.innerHTML = path;

    return svgElement;
  }

  #buildColorSliders() {
    const sliders = createElement("div", ["yk-sliders"]);

    // Build hue slider
    sliders.appendChild(this.#buildHueSlider());
    // Build hue slider
    sliders.appendChild(this.#buildOpacitySlider());

    return sliders;
  }

  #buildHueSlider() {
    // Create elements
    const sliderWrapper = createElement("div", ["yk-hue-slider-wrapper"]);
    const slider = createElement("div", ["yk-hue-slider"]);
    const sliderThumb = createElement("a", ["yk-hue-slider-thumb"]);
    sliderThumb.setAttribute("tabindex", "0");

    // Appench child element
    sliderWrapper.appendChild(slider);
    sliderWrapper.appendChild(sliderThumb);

    // Attach events
    this.#onMouseDownHueSliderBind = this.#onMouseDownHueSlider.bind(this);
    this.#onMouseUpHueSliderBind = this.#onMouseUpHueSlider.bind(this);
    this.#onMouseMoveHueSliderBind = this.#onMouseMoveHueSlider.bind(this);
    attachEvent(sliderWrapper, "pointerdown", this.#onMouseDownHueSliderBind);
    attachEvent(sliderThumb, "keydown", this.#onKeyDownHueSlider.bind(this));

    this.#dom["hueSlider"] = slider;
    this.#dom["hueThumb"] = sliderThumb;

    return sliderWrapper;
  }

  #buildOpacitySlider() {
    // Create elements
    const sliderWrapper = createElement("div", ["yk-opacity-slider-wrapper"]);
    const color = createElement("div", ["yk-opacity-color"]);
    const sliderThumb = createElement("a", ["yk-opacity-slider-thumb"]);
    sliderThumb.setAttribute("tabindex", "0");

    // Appench child element
    sliderWrapper.appendChild(color);
    sliderWrapper.appendChild(sliderThumb);

    // Attach events
    this.#onMouseDownOpacitySliderBind =
      this.#onMouseDownOpacitySlider.bind(this);
    this.#onMouseUpOpacitySliderBind = this.#onMouseUpOpacitySlider.bind(this);
    this.#onMouseMoveOpacitySliderBind =
      this.#onMouseMoveOpacitySlider.bind(this);
    attachEvent(
      sliderWrapper,
      "pointerdown",
      this.#onMouseDownOpacitySliderBind
    );
    attachEvent(
      sliderThumb,
      "keydown",
      this.#onKeyDownOpacitySlider.bind(this)
    );

    this.#dom["opacitySlider"] = color;
    this.#dom["opacityThumb"] = sliderThumb;

    return sliderWrapper;
  }

  #buildColorPreview() {
    const colorPreviewWrapper = createElement("span", [
      "yk-color-preview-wrapper",
    ]);

    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElement.setAttribute("width", 38);
    svgElement.setAttribute("height", 38);

    const colorPreview = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    colorPreview.setAttribute("cx", 19);
    colorPreview.setAttribute("cy", 19);
    colorPreview.setAttribute("r", 18);
    colorPreview.classList.add("yk-preview-stroke");

    svgElement.innerHTML =
      '<pattern id="transparent-grid" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse"><path fill="#DBDBDB" d="M0 0h3v3H0z"/><path fill="#fff" d="M3 0h3v3H3z"/><path fill="#DBDBDB" d="M3 3h3v3H3z"/><path fill="#fff" d="M0 3h3v3H0z"/></pattern></defs><circle cx="19" cy="19" r="18" fill="url(#transparent-grid)"/>';
    svgElement.appendChild(colorPreview);
    colorPreviewWrapper.appendChild(svgElement);

    this.#dom.colorPreview = colorPreview;

    return colorPreviewWrapper;
  }

  #rgbUpdateView() {
    this.#updateColorPreview(true);
    this.#updateHueThumb();
    this.#updateCursorThumb();
  }

  #updateHEXColorSection(
    color,
    event,
    con,
    conValue,
    op,
    startSelect,
    endSelect
  ) {
    const { target } = event;
    const { rgb, hex } = this.#color;
    if (con(rgb[color], conValue)) {
      rgb[color] = op(rgb[color], 1);
      this.#color.hex =
        hex.substring(0, startSelect) +
        hexPad2(Math.round(rgb[color])) +
        hex.substring(endSelect);
      const { r, g, b } = rgb;
      this.#color.hsv = YKColorParser.RGBtoHSV(r, g, b);
      this.#rgbUpdateView();
    }
    target.value = this.#color.hex;
    target.setSelectionRange(startSelect, endSelect);
    event.preventDefault();
  }

  #updateHEXAlphaSection(event, con, conValue, op) {
    const { target } = event;
    const { hex, a } = this.#color;
    if (con(a, conValue)) {
      this.#color.a = parseFloat(op(a, 0.01).toFixed(2));
      target.value = this.#color.hex =
        hex.substring(0, 7) + hexPad2(Math.round(this.#color.a * 255));
      this.#updateColorPreview(true);
      this.#updateOpacityThumb();
    }
    target.value = this.#color.hex;
    target.setSelectionRange(7, 9);
    event.preventDefault();
  }

  #updateOpacityValue(value) {
    this.#color.a = parseFloat(value.toFixed(2));
    if (this.#currentRepresentation == YKColorPicker.HEX) {
      this.#updateHEXColor(this);
      this.#updateHEXInput();
    } else {
      this.#dom.inputAlpha.value = this.#color.a;
    }
    this.#updateColorPreview(true);
  }

  #updatePosition() {
    if (this.#options.target == null) {
      return;
    }
    if (!YKColorPicker.#isTargetInViewport(this.#options.target)) {
      this.close();
      return;
    }
    this.#setPositionAxis(this.#getPositionAxis());
  }

  #attachToContainer(callEvent) {
    const container = document.getElementById(this.#options.container);
    if (container == null) {
      throw ReferenceError(
        "ColorPicker:: container to set color picker is undefined"
      );
    }
    this.#removeWindowEvents(this);
    const { overlayWrapper } = this.#dom;
    const parent = overlayWrapper.parentElement;
    container.appendChild(overlayWrapper);
    overlayWrapper.classList.remove(
      "yk-overlay-wrapper--light",
      "yk-overlay-wrapper--dark"
    );
    overlayWrapper.classList.add("yk-overlay-wrapper--static");
    overlayWrapper.classList.add("yk-overlay-wrapper--open");
    overlayWrapper.classList.add("yk-overlay-wrapper--" + this.#options.theme);
    this.#updateGUI();
    this.#isOpen = true;
    if (callEvent && parent != overlayWrapper.parentElement) {
      this.#options.onContainerChange(this, parent);
    }
  }

  #attachToBody() {
    this.#removeWindowEvents(this);
    const { overlayWrapper } = this.#dom;
    const parent = overlayWrapper.parentElement;
    document.body.appendChild(overlayWrapper);
    overlayWrapper.classList.remove(
      "yk-overlay-wrapper--light",
      "yk-overlay-wrapper--dark"
    );
    overlayWrapper.classList.remove("yk-overlay-wrapper--static");
    overlayWrapper.classList.add("yk-overlay-wrapper--open");
    overlayWrapper.classList.add("yk-overlay-wrapper--" + this.#options.theme);
    this.#updateGUI();
    this.#updatePosition();
    attachEvent(window, "resize", this.#onResizeScrollWindowBind);
    attachEvent(window, "scroll", this.#onResizeScrollWindowBind);
    attachEvent(document, "click", this.#onClickCloseBind);
    attachEvent(document, "keyup", this.#onKeyUpCloseBind);
    this.#isOpen = true;
    if (parent != overlayWrapper.parentElement) {
      this.#options.onContainerChange(this, parent);
    }
  }

  #detachOverlay() {
    this.#dom.overlayWrapper.classList.remove("yk-overlay-wrapper--open");
    this.#removeWindowEvents(this);
    this.#isOpen = false;
  }

  #onClickTarget(event) {
    event.stopPropagation();
    if (this.#isOpen) this.close();
    else this.open();
  }

  #onMouseDownCursor(event) {
    this.#dc = true;
    attachEvent(document, "pointermove", this.#onMouseMoveCursorBind);
    attachEvent(document, "pointerup", this.#onMouseUpCursorBind);
    this.#onMouseMoveCursorBind(event);
  }

  #onMouseUpCursor(e) {
    document.removeEventListener("pointermove", this.#onMouseMoveCursorBind);
    document.removeEventListener("pointerup", this.#onMouseUpCursorBind);
    if (this.#dom.overlayWrapper.contains(e.target)) {
      this.#dc = false;
    }
  }

  #onMouseMoveCursor(event) {
    const { x, y } = this.#getCursorPosition(event.clientX, event.clientY);
    this.#dom.cursor.style.translate = `${x}px ${y}px`;
    const paletteHeight = this.#dom.palette.offsetHeight;
    const paletteWidth = this.#dom.palette.offsetWidth;
    this.#color.hsv.s = (x / paletteWidth) * 100;
    this.#color.hsv.v = ((paletteHeight - y) / paletteHeight) * 100;
    this.#updateSettingsView();
  }

  #onClickInputsSwitch() {
    switch (this.#currentRepresentation) {
      case YKColorPicker.RGB:
        this.#updateRepresentation(YKColorPicker.HSV);
        break;
      case YKColorPicker.HSV:
        this.#updateRepresentation(YKColorPicker.HSL);
        break;
      case YKColorPicker.HSL:
        this.#updateRepresentation(YKColorPicker.HEX);
        break;
      case YKColorPicker.HEX:
        this.#updateRepresentation(YKColorPicker.RGB);
        break;
    }
  }

  #onFocusInput() {
    switch (this.#currentRepresentation) {
      case YKColorPicker.RGB:
        this.#color.rgb = this.getRGB();
        break;
      case YKColorPicker.HSV:
        this.#color.hsv = this.getHSV();
        break;
      case YKColorPicker.HSL:
        this.#color.hsl = this.getHSL();
        break;
      case YKColorPicker.HEX:
        this.#updateHEXColor();
        break;
    }
  }

  #onKeyDownAlphaInput(event) {
    const { target, key } = event;
    const { a } = this.#color;
    switch (key) {
      case "ArrowUp":
        {
          if (a < 1) {
            let alphaValue = parseFloat((a + 0.01).toFixed(2));
            if (alphaValue > 1) {
              alphaValue = 1;
            }
            target.value = this.#color.a = alphaValue;
            this.#updateColorPreview(true);
            this.#updateOpacityThumb();
          }
        }
        break;

      case "ArrowDown":
        {
          if (a > 0) {
            let alphaValue = parseFloat((a - 0.01).toFixed(2));
            if (alphaValue < 0) {
              alphaValue = 0;
            }
            target.value = this.#color.a = alphaValue;
            this.#updateColorPreview(true);
            this.#updateOpacityThumb();
          }
        }
        break;

      case ".":
        {
          if (/(\.)/.test(target.value)) {
            event.preventDefault();
          }
        }
        break;
    }
  }

  #onKeyUpAlphaInput(event) {
    const { target } = event;
    if (/^(0(\.\d{1,2})?|(0*)1?)$/.test(target.value) || target.value == "") {
      const value = parseFloat(target.value) || 0;
      if (!isNaN(value) && value >= 0 && value <= 1) {
        this.#color.a = value;
        this.#updateColorPreview(true);
        this.#updateOpacityThumb(this);
      }
    }
  }

  #onChangeAlphaInput(event) {
    event.target.value = this.#color.a;
  }

  #onKeyDownInputHEX(event) {
    const { target, key } = event;
    switch (key) {
      case "ArrowUp":
        {
          if (
            !/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(
              target.value
            )
          ) {
            target.value = this.#color.hex;
          }
          const caret = this.#getCaretPosition(target);
          const length = target.value.length;
          if (length <= 5) {
            if (caret < 2) {
              this.#updateHEXColorSection(
                "r",
                event,
                YKColorPicker.#lt,
                255,
                YKColorPicker.#add,
                1,
                3
              );
            } else if (caret < 3) {
              this.#updateHEXColorSection(
                "g",
                event,
                YKColorPicker.#lt,
                255,
                YKColorPicker.#add,
                3,
                5
              );
            } else if ((caret <= 4 && length <= 4) || caret < 4) {
              this.#updateHEXColorSection(
                "b",
                event,
                YKColorPicker.#lt,
                255,
                YKColorPicker.#add,
                5,
                7
              );
            } else if (caret <= 5) {
              this.#updateHEXAlphaSection(
                event,
                YKColorPicker.#lt,
                1,
                YKColorPicker.#add
              );
            }
          } else {
            if (caret < 3) {
              this.#updateHEXColorSection(
                "r",
                event,
                YKColorPicker.#lt,
                255,
                YKColorPicker.#add,
                1,
                3
              );
            } else if (caret < 5) {
              this.#updateHEXColorSection(
                "g",
                event,
                YKColorPicker.#lt,
                255,
                YKColorPicker.#add,
                3,
                5
              );
            } else if ((caret <= 7 && length == 7) || caret < 7) {
              this.#updateHEXColorSection(
                "b",
                event,
                YKColorPicker.#lt,
                255,
                YKColorPicker.#add,
                5,
                7
              );
            } else if (caret <= 9) {
              this.#updateHEXAlphaSection(
                event,
                YKColorPicker.#lt,
                1,
                YKColorPicker.#add
              );
            }
          }
        }
        break;
      case "ArrowDown":
        {
          if (
            !/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(
              target.value
            )
          ) {
            target.value = this.#color.hex;
          }
          const caret = this.#getCaretPosition(target);
          const length = target.value.length;
          if (length <= 5) {
            if (caret < 2) {
              this.#updateHEXColorSection(
                "r",
                event,
                YKColorPicker.#gt,
                0,
                YKColorPicker.#sub,
                1,
                3
              );
            } else if (caret < 3) {
              this.#updateHEXColorSection(
                "g",
                event,
                YKColorPicker.#gt,
                0,
                YKColorPicker.#sub,
                3,
                5
              );
            } else if ((caret <= 4 && length <= 4) || caret < 4) {
              this.#updateHEXColorSection(
                "b",
                event,
                YKColorPicker.#gt,
                0,
                YKColorPicker.#sub,
                5,
                7
              );
            } else if (caret <= 5) {
              this.#updateHEXAlphaSection(
                event,
                YKColorPicker.#gt,
                0,
                YKColorPicker.#sub
              );
            }
          } else {
            if (caret < 3) {
              this.#updateHEXColorSection(
                "r",
                event,
                YKColorPicker.#gt,
                0,
                YKColorPicker.#sub,
                1,
                3
              );
            } else if (caret < 5) {
              this.#updateHEXColorSection(
                "g",
                event,
                YKColorPicker.#gt,
                0,
                YKColorPicker.#sub,
                3,
                5
              );
            } else if ((caret <= 7 && length == 7) || caret < 7) {
              this.#updateHEXColorSection(
                "b",
                event,
                YKColorPicker.#gt,
                0,
                YKColorPicker.#sub,
                5,
                7
              );
            } else if (caret <= 9) {
              this.#updateHEXAlphaSection(
                event,
                YKColorPicker.#gt,
                0,
                YKColorPicker.#sub
              );
            }
          }
        }
        break;
    }
  }

  #onInputHEX(event) {
    const rgb = YKColorParser.HEXtoRGBA(event.target.value.trim());
    if (rgb != null) {
      const { r, g, b, a } = rgb;
      this.#color.a = a;
      this.#color.rgb = { r, g, b };
      this.#color.hex = YKColorParser.RGBAtoHEX(r, g, b, a);
      this.#color.hsv = YKColorParser.RGBtoHSV(r, g, b);
      this.#updateColorPreview(true);
      this.#updateHueThumb();
      this.#updateOpacityThumb();
      this.#updateCursorThumb();
    }
  }

  #onChangeInputHEX(event) {
    event.target.value = this.#color.hex;
  }

  #onKeyDownInputA(event) {
    const { target, key } = event;
    switch (key) {
      case "ArrowUp":
        {
          switch (this.#currentRepresentation) {
            case YKColorPicker.RGB:
              {
                let { r, g, b } = this.#color.rgb;
                r = Math.round(r);
                if (r < 255) {
                  this.#color.rgb.r = target.value = ++r;
                  this.#color.hsv = YKColorParser.RGBtoHSV(r, g, b);
                  this.#rgbUpdateView();
                }
              }
              break;

            case YKColorPicker.HSV:
            case YKColorPicker.HSL:
              {
                let { h } = this.#color.hsv;
                h = Math.round(h);
                if (h < 360) {
                  target.value = ++h + "°";
                  this.#color.hsv.h = this.#color.hsl.h = h;
                  this.#updateColorPreview(true);
                  this.#updateHueThumb();
                }
              }
              break;
          }
        }
        break;
      case "ArrowDown":
        {
          switch (this.#currentRepresentation) {
            case YKColorPicker.RGB:
              {
                let { r, g, b } = this.#color.rgb;
                r = Math.round(r);
                if (r > 0) {
                  this.#color.rgb.r = target.value = --r;
                  this.#color.hsv = YKColorParser.RGBtoHSV(r, g, b);
                  this.#rgbUpdateView();
                }
              }
              break;

            case YKColorPicker.HSV:
            case YKColorPicker.HSL:
              {
                let { h } = this.#color.hsv;
                h = Math.round(h);
                if (h > 0) {
                  target.value = --h + "°";
                  this.#color.hsv.h = this.#color.hsl.h = h;
                  this.#updateColorPreview(true);
                  this.#updateHueThumb();
                }
              }
              break;
          }
        }
        break;
    }
  }

  #onInputA(event) {
    const value = parseInt(event.target.value || 0);
    if (/^(\d{1,3})(°?)$/.test(value)) {
      switch (this.#currentRepresentation) {
        case YKColorPicker.RGB:
          {
            const { g, b } = this.#color.rgb;
            if (!isNaN(value) && value >= 0 && value <= 255) {
              this.#color.rgb.r = value;
              this.#color.hsv = YKColorParser.RGBtoHSV(value, g, b);
              this.#updateColorPreview(true);
              this.#updateHueThumb();
              this.#updateCursorThumb();
            }
          }
          break;

        case YKColorPicker.HSV:
        case YKColorPicker.HSL:
          {
            if (!isNaN(value) && value >= 0 && value <= 360) {
              this.#color.hsv.h = this.#color.hsl.h = value;
              this.#updateColorPreview(true);
              this.#updateHueThumb();
            }
          }
          break;
      }
    }
  }

  #onChangeInputA(event) {
    let value = event.target.value;
    switch (this.#currentRepresentation) {
      case YKColorPicker.RGB:
        {
          value = Math.round(this.#color.rgb.r);
        }
        break;

      case YKColorPicker.HSV:
      case YKColorPicker.HSL:
        {
          value = `${Math.round(this.#color.hsv.h)}°`;
        }
        break;
    }
    event.target.value = value;
  }

  #onKeyDownInputB(event) {
    const { target, key } = event;
    switch (key) {
      case "ArrowUp":
        {
          switch (this.#currentRepresentation) {
            case YKColorPicker.RGB:
              {
                let { r, g, b } = this.#color.rgb;
                g = Math.round(g);
                if (g < 255) {
                  this.#color.rgb.g = target.value = ++g;
                  this.#color.hsv = YKColorParser.RGBtoHSV(r, g, b);
                  this.#rgbUpdateView();
                }
              }
              break;

            case YKColorPicker.HSV:
              {
                let { s } = this.#color.hsv;
                s = Math.round(s);
                if (s < 100) {
                  target.value = ++s + "%";
                  this.#color.hsv.s = s;
                  this.#updateColorPreview(true);
                  this.#updateCursorThumb();
                }
              }
              break;

            case YKColorPicker.HSL:
              {
                const { h, s, l } = this.#color.hsl;
                let hsl_s = Math.round(s);
                if (hsl_s < 100) {
                  target.value = ++hsl_s + "%";
                  this.#color.hsl.s = hsl_s;
                  this.#color.hsv.s = YKColorParser.HSLtoHSV(h, hsl_s, l).s;
                  this.#updateColorPreview(true);
                  this.#updateCursorThumb();
                }
              }
              break;
          }
        }
        break;
      case "ArrowDown":
        {
          switch (this.#currentRepresentation) {
            case YKColorPicker.RGB:
              {
                let { r, g, b } = this.#color.rgb;
                g = Math.round(g);
                if (g > 0) {
                  this.#color.rgb.g = target.value = --g;
                  this.#color.hsv = YKColorParser.RGBtoHSV(r, g, b);
                  this.#rgbUpdateView();
                }
              }
              break;

            case YKColorPicker.HSV:
              {
                let { s } = this.#color.hsv;
                s = Math.round(s);
                if (s > 0) {
                  target.value = --s + "%";
                  this.#color.hsv.s = s;
                  this.#updateColorPreview(true);
                  this.#updateCursorThumb();
                }
              }
              break;

            case YKColorPicker.HSL:
              {
                const { h, s, l } = this.#color.hsl;
                let hsl_s = Math.round(s);
                if (hsl_s > 0) {
                  target.value = --hsl_s + "%";
                  this.#color.hsl.s = hsl_s;
                  this.#color.hsv.s = YKColorParser.HSLtoHSV(h, hsl_s, l).s;
                  this.#updateColorPreview(true);
                  this.#updateCursorThumb();
                }
              }
              break;
          }
        }
        break;
    }
  }

  #onInputB(event) {
    const value = parseInt(event.target.value || 0);
    if (/^(\d{1,3})(%?)$/.test(value)) {
      switch (this.#currentRepresentation) {
        case YKColorPicker.RGB:
          {
            const { r, b } = this.#color.rgb;
            if (!isNaN(value) && value >= 0 && value <= 255) {
              this.#color.rgb.g = value;
              this.#color.hsv = YKColorParser.RGBtoHSV(r, value, b);
              this.#updateColorPreview(true);
              this.#updateHueThumb();
              this.#updateCursorThumb();
            }
          }
          break;

        case YKColorPicker.HSV:
          {
            if (!isNaN(value) && value >= 0 && value <= 100) {
              this.#color.hsv.s = value;
              this.#updateColorPreview(true);
              this.#updateCursorThumb();
            }
          }
          break;

        case YKColorPicker.HSL:
          {
            const { h, l } = this.#color.hsl;
            if (!isNaN(value) && value >= 0 && value <= 100) {
              this.#color.hsl.s = value;
              this.#color.hsv = YKColorParser.HSLtoHSV(h, value, l);
              this.#updateColorPreview(true);
              this.#updateCursorThumb();
            }
          }
          break;
      }
    }
  }

  #onChangeInputB(event) {
    let value = event.target.value;
    switch (this.#currentRepresentation) {
      case YKColorPicker.RGB:
        {
          value = Math.round(this.#color.rgb.g);
        }
        break;

      case YKColorPicker.HSV:
        {
          value = `${Math.round(this.#color.hsv.s)}%`;
        }
        break;

      case YKColorPicker.HSL:
        {
          value = `${Math.round(this.#color.hsl.s)}%`;
        }
        break;
    }
    event.target.value = value;
  }

  #onKeyDownInputC(event) {
    const { target, key } = event;
    switch (key) {
      case "ArrowUp":
        {
          switch (this.#currentRepresentation) {
            case YKColorPicker.RGB:
              {
                let { r, g, b } = this.#color.rgb;
                b = Math.round(b);
                if (b < 255) {
                  this.#color.rgb.b = target.value = ++b;
                  this.#color.hsv = YKColorParser.RGBtoHSV(r, g, b);
                  this.#rgbUpdateView();
                }
              }
              break;

            case YKColorPicker.HSV:
              {
                let { v } = this.#color.hsv;
                v = Math.round(v);
                if (v < 100) {
                  target.value = ++v + "%";
                  this.#color.hsv.v = v;
                  this.#updateColorPreview(true);
                  this.#updateCursorThumb();
                }
              }
              break;

            case YKColorPicker.HSL:
              {
                const { h, s, l } = this.#color.hsl;
                let hsl_l = Math.round(l);
                if (hsl_l < 100) {
                  target.value = ++hsl_l + "%";
                  this.#color.hsl.l = hsl_l;
                  this.#color.hsv.v = YKColorParser.HSLtoHSV(h, s, hsl_l).v;
                  this.#updateColorPreview(true);
                  this.#updateCursorThumb();
                }
              }
              break;
          }
        }
        break;
      case "ArrowDown":
        {
          switch (this.#currentRepresentation) {
            case YKColorPicker.RGB:
              {
                let { r, g, b } = this.#color.rgb;
                b = Math.round(b);
                if (b > 0) {
                  this.#color.rgb.b = target.value = --b;
                  this.#color.hsv = YKColorParser.RGBtoHSV(r, g, b);
                  this.#rgbUpdateView();
                }
              }
              break;

            case YKColorPicker.HSV:
              {
                let { v } = this.#color.hsv;
                v = Math.round(v);
                if (v > 0) {
                  target.value = --v + "%";
                  this.#color.hsv.v = v;
                  this.#updateColorPreview(true);
                  this.#updateCursorThumb();
                }
              }
              break;

            case YKColorPicker.HSL:
              {
                const { h, s, l } = this.#color.hsl;
                let hsl_l = Math.round(l);
                if (l > 0) {
                  target.value = --hsl_l + "%";
                  this.#color.hsl.l = hsl_l;
                  this.#color.hsv.v = YKColorParser.HSLtoHSV(h, s, hsl_l).v;
                  this.#updateColorPreview(true);
                  this.#updateCursorThumb();
                }
              }
              break;
          }
        }
        break;
    }
  }

  #onInputC(event) {
    const value = parseInt(event.target.value || 0);
    if (/^(\d{1,3})(%?)$/.test(value)) {
      switch (this.#currentRepresentation) {
        case YKColorPicker.RGB:
          {
            const { r, g } = this.#color.rgb;
            if (!isNaN(value) && value >= 0 && value <= 255) {
              this.#color.rgb.b = value;
              this.#color.hsv = YKColorParser.RGBtoHSV(r, g, value);
              this.#updateColorPreview(true);
              this.#updateHueThumb();
              this.#updateCursorThumb();
            }
          }
          break;

        case YKColorPicker.HSV:
          {
            if (!isNaN(value) && value >= 0 && value <= 100) {
              this.#color.hsv.v = value;
              this.#updateColorPreview(true);
              this.#updateCursorThumb();
            }
          }
          break;

        case YKColorPicker.HSL:
          {
            const { h, s } = this.#color.hsl;
            if (!isNaN(value) && value >= 0 && value <= 100) {
              this.#color.hsl.l = value;
              this.#color.hsv = YKColorParser.HSLtoHSV(h, s, value);
              this.#updateColorPreview(true);
              this.#updateCursorThumb();
            }
          }
          break;
      }
    }
  }

  #onChangeInputC(event) {
    let value = event.target.value;
    switch (this.#currentRepresentation) {
      case YKColorPicker.RGB:
        {
          value = Math.round(this.#color.rgb.b);
        }
        break;

      case YKColorPicker.HSV:
        {
          value = `${Math.round(this.#color.hsv.v)}%`;
        }
        break;

      case YKColorPicker.HSL:
        {
          value = `${Math.round(this.#color.hsl.l)}%`;
        }
        break;
    }
    event.target.value = value;
  }

  #onClickCopyColor() {
    if (this.#copyTimeout) {
      clearTimeout(this.#copyTimeout);
    }
    const input = document.createElement("input");
    input.style.position = "absolute";
    input.style.left = "-99999px";
    input.style.top = "-99999px";
    input.value = this.#getColorText();
    document.body.appendChild(input);
    input.select();

    try {
      document.execCommand("copy");
      this.#attachCheckIcon();
      this.#dom.copyColor.focus();
      this.#options.onCopy(this);

      this.#copyTimeout = setTimeout(() => {
        this.#attachCopyIcon();
        this.#copyTimeout = null;
      }, 600);
    } catch (err) {
      document.body.removeChild(input);
      throw new Error("YKColorPicker:: Failed to copy color.", {
        cause: err,
      });
    }
  }

  #onMouseDownHueSlider(event) {
    event.preventDefault(); // prevent default to set focus on the thumb
    this.#dc = true;
    attachEvent(document, "pointermove", this.#onMouseMoveHueSliderBind);
    attachEvent(document, "pointerup", this.#onMouseUpHueSliderBind);
    this.#dom.hueThumb.focus();
    this.#onMouseMoveHueSliderBind(event);
  }

  #onMouseUpHueSlider(e) {
    document.removeEventListener("pointermove", this.#onMouseMoveHueSliderBind);
    document.removeEventListener("pointerup", this.#onMouseUpHueSliderBind);
    if (this.#dom.overlayWrapper.contains(e.target)) {
      this.#dc = false;
    }
  }

  #onMouseMoveHueSlider(event) {
    const { hueSlider, hueThumb } = this.#dom;
    const sliderRect = hueSlider.getBoundingClientRect();
    const sliderWidth = sliderRect.width;
    let thumbX = event.clientX - sliderRect.left;

    if (thumbX < 0) {
      thumbX = 0;
    }
    if (thumbX > sliderWidth) {
      thumbX = sliderWidth;
    }

    this.#color.hsv.h = (thumbX / sliderRect.width) * 360;
    hueThumb.style.translate = `${thumbX}px`;

    this.#updateSettingsView();
  }

  #onMouseDownOpacitySlider(event) {
    event.preventDefault(); // prevent default to set focus on the thumb
    this.#dc = true;
    attachEvent(document, "pointermove", this.#onMouseMoveOpacitySliderBind);
    attachEvent(document, "pointerup", this.#onMouseUpOpacitySliderBind);
    this.#dom.opacityThumb.focus();
    this.#onMouseMoveOpacitySliderBind(event);
  }

  #onMouseUpOpacitySlider(e) {
    document.removeEventListener(
      "pointermove",
      this.#onMouseMoveOpacitySliderBind
    );
    document.removeEventListener("pointerup", this.#onMouseUpOpacitySliderBind);
    if (this.#dom.overlayWrapper.contains(e.target)) {
      this.#dc = false;
    }
  }

  #onMouseMoveOpacitySlider(event) {
    const { opacitySlider, opacityThumb } = this.#dom;
    const opacitySliderRect = opacitySlider.getBoundingClientRect();
    const sliderWidth = opacitySliderRect.width;
    let thumbX = event.clientX - opacitySliderRect.left;
    opacityThumb.focus();

    if (thumbX < 0) {
      thumbX = 0;
    }
    if (thumbX > sliderWidth) {
      thumbX = sliderWidth;
    }

    opacityThumb.style.translate = `${thumbX}px`;
    this.#updateOpacityValue(thumbX / sliderWidth);
  }

  #onKeyDownHueSlider(event) {
    const { key } = event;
    switch (key) {
      case "ArrowUp":
      case "ArrowRight":
        {
          const { hueThumb, hueSlider } = this.#dom;
          let position = parseInt(hueThumb.style.translate);
          if (!isNaN(position) && position < hueSlider.offsetWidth) {
            hueThumb.style.translate = `${++position}px`;
            this.#color.hsv.h = (position / hueSlider.offsetWidth) * 360;
            this.#updateSettingsView();
          }
          event.preventDefault();
        }
        break;

      case "ArrowDown":
      case "ArrowLeft":
        {
          const { hueThumb, hueSlider } = this.#dom;
          let position = parseInt(hueThumb.style.translate);
          if (!isNaN(position) && position > 0) {
            hueThumb.style.translate = `${--position}px`;
            this.#color.hsv.h = (position / hueSlider.offsetWidth) * 360;
            this.#updateSettingsView();
          }
          event.preventDefault();
        }
        break;
    }
  }

  #onKeyDownOpacitySlider(event) {
    const { key } = event;
    switch (key) {
      case "ArrowUp":
      case "ArrowRight":
        {
          const { opacityThumb, opacitySlider } = this.#dom;
          let position = parseInt(opacityThumb.style.translate);
          if (!isNaN(position) && position < opacitySlider.offsetWidth) {
            opacityThumb.style.translate = `${++position}px`;
            this.#updateOpacityValue(position / opacitySlider.offsetWidth);
          }
          event.preventDefault();
        }
        break;

      case "ArrowDown":
      case "ArrowLeft":
        {
          const { opacityThumb, opacitySlider } = this.#dom;
          let position = parseInt(opacityThumb.style.translate);
          if (!isNaN(position) && position > 0) {
            opacityThumb.style.translate = `${--position}px`;
            this.#updateOpacityValue(position / opacitySlider.offsetWidth);
          }
          event.preventDefault();
        }
        break;
    }
  }

  #onKeyUpClose(event) {
    if (event.key == "Enter" && this.#isOpen) {
      this.close();
      return;
    }

    if (event.key == "Escape") {
      if (this._prevColor != this.getHEX()) {
        this.setColor(this._prevColor);
        this.#updateGUI();
        this.#options.onInput(this);
      }
      this.close();
    }
  }

  #onResizeScrollWindow(event) {
    const { type } = event;
    const { target, closeOnScroll, closeOnResize } = this.#options;
    if (
      (type == "scroll" && closeOnScroll) ||
      (type == "resize" && closeOnResize)
    ) {
      this.close();
    } else {
      if (target == null) {
        return;
      }
      if (!YKColorPicker.#isTargetInViewport(this.#options.target)) {
        this.close();
        return;
      }
      this.#setPositionAxis(this.#getPositionAxis());
    }
  }

  #removeWindowEvents() {
    window.removeEventListener("resize", this.#onResizeScrollWindowBind);
    window.removeEventListener("scroll", this.#onResizeScrollWindowBind);
    document.removeEventListener("keyup", this.#onKeyUpCloseBind);
    document.removeEventListener("click", this.#onClickCloseBind);
  }

  #getCursorPosition(clientX, clientY) {
    const paletteRect = this.#dom.palette.getBoundingClientRect();
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

  #updateHEXColor() {
    const { r, g, b } = (this.#color.rgb = this.#color.toRGB());
    this.#color.hex = YKColorParser.RGBAtoHEX(r, g, b, this.#color.a);
  }

  #getColorText() {
    switch (this.#currentRepresentation) {
      case YKColorPicker.RGB:
        const { r, g, b } = this.#color.rgb;
        return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${
          this.#color.a
        })`;

      case YKColorPicker.HSV: {
        const { h, s, v } = this.#color.hsv;
        return `hsva(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(v)}%, ${
          this.#color.a
        })`;
      }

      case YKColorPicker.HSL: {
        const { h, s, l } = this.#color.hsl;
        return `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${
          this.#color.a
        })`;
      }

      case YKColorPicker.HEX:
        return this.getHEX();
    }
  }

  #getCaretPosition(target) {
    let position = target.selectionStart;
    const length = target.value.length;
    if (position > length) {
      position = length;
    }
    return position;
  }

  #getPositionAxis() {
    const { target, position, positionFallback } = this.#options;
    const targetRect = target.getBoundingClientRect();
    const colorPickerRect = this.#dom.overlayWrapper.getBoundingClientRect();
    const scrollTop = document.documentElement.scrollTop;
    const scrollLeft = document.documentElement.scrollLeft;
    const offset = 6;
    let _position = position;

    const _stateSpaceInTop = YKColorPicker.#enoughSpace(
      () => scrollTop + targetRect.top,
      () => targetRect.top,
      colorPickerRect.height + offset
    );
    const _stateSpaceInBottom = YKColorPicker.#enoughSpace(
      () =>
        YKColorPicker.#getPageHeight() -
        (scrollTop + targetRect.top + targetRect.height),
      () => window.innerHeight - (targetRect.top + targetRect.height),
      colorPickerRect.height + offset
    );
    const _stateSpaceInLeft = YKColorPicker.#enoughSpace(
      () => scrollLeft + targetRect.left,
      () => targetRect.left,
      colorPickerRect.width + offset
    );
    const _stateSpaceInRight = YKColorPicker.#enoughSpace(
      () =>
        YKColorPicker.#getPageWidth() -
        (scrollLeft + targetRect.left + targetRect.width),
      () => window.innerWidth - (targetRect.left + targetRect.width),
      colorPickerRect.width + offset
    );

    const states = {
      t: _stateSpaceInTop,
      b: _stateSpaceInBottom,
      l: _stateSpaceInLeft,
      r: _stateSpaceInRight,
    };
    let positions = "";

    for (let i = 0; i < positionFallback.length; i++) {
      positions += positionFallback[i] + states[positionFallback[i]];
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
      _position = YKColorPicker.BOTTOM;
    }

    let x_axis = 0;
    let y_axis = 0;

    switch (_position) {
      case YKColorPicker.TOP:
        y_axis = targetRect.top - colorPickerRect.height - offset;
        x_axis =
          targetRect.left + targetRect.width / 2 - colorPickerRect.width / 2;
        break;

      case YKColorPicker.BOTTOM:
        y_axis = targetRect.top + targetRect.height + offset;
        x_axis =
          targetRect.left + targetRect.width / 2 - colorPickerRect.width / 2;
        break;

      case YKColorPicker.LEFT:
        y_axis =
          targetRect.top + targetRect.height / 2 - colorPickerRect.height / 2;
        x_axis = targetRect.left - colorPickerRect.width - offset;
        break;

      case YKColorPicker.RIGHT:
        y_axis =
          targetRect.top + targetRect.height / 2 - colorPickerRect.height / 2;
        x_axis = targetRect.left + targetRect.width + offset;
        break;
    }

    // Make sure the color picker won't go beyond viewport by adjusting the x and y axis.
    // Calculate scrollbar for x and y.
    const xScrollbar = window.innerWidth - document.documentElement.clientWidth;
    const yScrollbar =
      window.innerHeight - document.documentElement.clientHeight;

    if (window.innerWidth - xScrollbar < x_axis + colorPickerRect.width) {
      x_axis -= x_axis + colorPickerRect.width - window.innerWidth + xScrollbar;
    }
    if (window.innerHeight - yScrollbar < y_axis + colorPickerRect.height) {
      y_axis -=
        y_axis + colorPickerRect.height - window.innerHeight + yScrollbar;
    }

    x_axis = Math.max(x_axis, 0);
    y_axis = Math.max(y_axis, 0);

    return {
      x: x_axis,
      y: y_axis,
    };
  }

  #setPositionAxis(axis) {
    const { x, y } = axis;
    this.#dom.overlayWrapper.style.top = `${y}px`;
    this.#dom.overlayWrapper.style.left = `${x}px`;
  }

  #updateRepresentation(value) {
    this.#currentRepresentation = value;
    this.#updateInputs();
    this.#options.onRepresentationChange(this);
  }

  static #isTargetInViewport(target) {
    if (target) {
      const rect = target.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    }
  }

  static #getPageHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
  }

  static #getPageWidth() {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.body.clientWidth,
      document.documentElement.clientWidth
    );
  }

  static #enoughSpace(condition1, condition2, boxSize) {
    if (condition1() >= boxSize) {
      if (condition2() >= boxSize) {
        return 2;
      }
      return 1;
    }
    return 0;
  }

  static #buildOptions(baseOptions, options) {
    if (options == null) {
      options = {};
    }
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

  static #lt(a, b) {
    return a < b;
  }

  static #gt(a, b) {
    return a > b;
  }

  static #add(a, b) {
    return a + b;
  }

  static #sub(a, b) {
    return a - b;
  }
}
