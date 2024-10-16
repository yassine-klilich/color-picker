import "./style.css";

import { YKColor } from "./yk-color";
import { YKColorParser } from "./yk-color-parser";
import { hexPad2, createElement, attachEvent } from "./utility";

type Point = {
  x: number;
  y: number;
};

export enum YKColorPickerPosition {
  TOP = "t",
  BOTTOM = "b",
  LEFT = "l",
  RIGHT = "r",
}

export type YKColorPickerPositionFallback =
  | "btrl"
  | "btlr"
  | "brtl"
  | "brlt"
  | "bltr"
  | "blrt"
  | "tbrl"
  | "tblr"
  | "trbl"
  | "trlb"
  | "tlbr"
  | "tlrb"
  | "rbtl"
  | "rblt"
  | "rtbl"
  | "rtlb"
  | "rlbt"
  | "rltb"
  | "lbtr"
  | "lbrt"
  | "ltbr"
  | "ltrb"
  | "lrbt"
  | "lrtb";

export enum YKColorPickerMode {
  RGB = "rgb",
  HSV = "hsv",
  HSL = "hsl",
  HEX = "hex",
}

export interface YKColorPickerOptions {
  target: HTMLElement | undefined;
  container: HTMLElement | string | undefined;
  position?: YKColorPickerPosition;
  positionFallback?: YKColorPickerPositionFallback;
  representation?: YKColorPickerMode;
  color?: string;
  closeOnScroll?: boolean;
  closeOnResize?: boolean;
  theme?: string;
  onInit?: (instance: YKColorPicker) => void;
  onOpen?: (instance: YKColorPicker) => void;
  onClose?: (instance: YKColorPicker) => void;
  onInput?: (instance: YKColorPicker) => void;
  onChange?: (instance: YKColorPicker) => void;
  onCopy?: (instance: YKColorPicker) => void;
  onRepresentationChange?: (instance: YKColorPicker) => void;
  onContainerChange?: (
    instance: YKColorPicker,
    previousParent: HTMLElement
  ) => void;
}

interface __YKColorPickerOptions extends Required<YKColorPickerOptions> {}

/**
 * Color Picker
 */
export class YKColorPicker {
  static DEFAULT_OPTIONS: __YKColorPickerOptions = {
    target: undefined,
    container: undefined,
    position: YKColorPickerPosition.BOTTOM,
    positionFallback: "btrl",
    representation: YKColorPickerMode.RGB,
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
  };

  private _isOpen: boolean = false;
  private _options: __YKColorPickerOptions = YKColorPicker.DEFAULT_OPTIONS;
  private _color: any = null;
  private _dom: any = {};
  private _currentRepresentation: any;
  private _dc: any;
  private _onClickTargetBind: any;
  private _onMouseDownCursorBind: any;
  private _onMouseUpHueSliderBind: any;
  private _onMouseMoveHueSliderBind: any;
  private _onMouseDownHueSliderBind: any;
  private _onMouseDownOpacitySliderBind: any;
  private _onMouseUpOpacitySliderBind: any;
  private _onMouseMoveOpacitySliderBind: any;
  private _onResizeScrollWindowBind: any;
  private _onClickCloseBind: any;
  private _onKeyUpCloseBind: any;
  private _onMouseMoveCursorBind: any;
  private _onMouseUpCursorBind: any;
  private _copyTimeout: any = null;
  private _prevColor: any = null;

  constructor(options: YKColorPickerOptions) {
    this._options = YKColorPicker._buildOptions(
      YKColorPicker.DEFAULT_OPTIONS,
      options
    );

    const { target, representation } = this._options;

    this._dom["target"] = target;
    this._currentRepresentation = representation;

    // init click and enter key to target
    if (target) {
      this._onClickTargetBind = this._onClickTarget.bind(this);
      attachEvent(target, "click", this._onClickTargetBind);
    }

    this.setColor(this._options.color);
    this._prevColor = this.getHEX();
    this._initDOM();
  }

  isOpen() {
    return this._isOpen;
  }

  open() {
    this._prevColor = this.getHEX();
    if (this._options.container) {
      this._attachToContainer(true);
    } else {
      this._attachToBody();
    }
    this._options.onOpen && this._options.onOpen(this);
  }

  close() {
    if (!this._dc) {
      if (this._prevColor != this.getHEX()) {
        this._options.onChange && this._options.onChange(this);
      }
      this._detachOverlay();
      this._options.onClose && this._options.onClose(this);
    }
    this._dc = false;
  }

  getRGB() {
    return { ...this._color.toRGB(), a: this._color.a };
  }

  getHSV() {
    const { h, s, v } = this._color.hsv;
    return {
      h: Math.round(h),
      s: Math.round(s),
      v: Math.round(v),
      a: this._color.a,
    };
  }

  getHSL() {
    const { h, s, l } = this._color.toHSL();
    return {
      h: Math.round(h),
      s: Math.round(s),
      l: Math.round(l),
      a: this._color.a,
    };
  }

  getHEX() {
    return this._color.toHEX();
  }

  updateOptions(options: YKColorPickerOptions) {
    const _options = YKColorPicker._buildOptions(this._options, options);
    this._options = _options;
    const { target, representation } = this._options;

    // update representation
    if (representation && this._currentRepresentation != representation) {
      this._updateRepresentation(representation);
    }

    // update target
    if (this._dom.target != target) {
      if (this._dom.target != null) {
        this._dom.target.removeEventListener("click", this._onClickTargetBind);
      }
      this._dom.target = target;
      if (this._dom.target != null) {
        this._dom.attachEvent(target, "click", this._onClickTargetBind);
      }
    }

    if (this._isOpen) {
      if (this._options.container) {
        this._attachToContainer(true);
      } else {
        this._attachToBody();
      }
    }
  }

  getColor() {
    switch (this._currentRepresentation) {
      case YKColorPickerMode.RGB: {
        const { r, g, b } = this._color.rgb;
        return {
          r: Math.round(r),
          g: Math.round(g),
          b: Math.round(b),
          a: this._color.a,
        };
      }

      case YKColorPickerMode.HSV: {
        const { h, s, v } = this._color.hsv;
        return {
          h: Math.round(h),
          s: Math.round(s),
          l: Math.round(v),
          a: this._color.a,
        };
      }

      case YKColorPickerMode.HSL: {
        const { h, s, l } = this._color.hsl;
        return {
          h: Math.round(h),
          s: Math.round(s),
          l: Math.round(l),
          a: this._color.a,
        };
      }

      case YKColorPickerMode.HEX:
        return this.getHEX();
    }
  }

  setColor(value: string) {
    const { h, s, v, a } = YKColorParser.parse(value);
    this._color = new YKColor(h, s, v, a);
  }

  private _initDOM() {
    // #dom declaration
    const cp_overlayWrapper = createElement("div", ["yk-overlay-wrapper"]);
    const cp_Wrapper = createElement("div", ["yk-wrapper"]);

    // Append child nodes
    cp_overlayWrapper.appendChild(cp_Wrapper);
    // build palette
    cp_Wrapper.appendChild(this._buildPaletteColor());
    // build color settings
    cp_Wrapper.appendChild(this._buildColorSettings());

    attachEvent(cp_overlayWrapper, "click", (event: MouseEvent) =>
      event.stopPropagation()
    );
    this._dom["overlayWrapper"] = cp_overlayWrapper;

    this._onKeyUpCloseBind = this._onKeyUpClose.bind(this);
    this._onResizeScrollWindowBind = this._onResizeScrollWindow.bind(this);
    this._onClickCloseBind = this.close.bind(this);

    if (this._options.container) {
      this._attachToContainer(false);
    } else {
      document.body.appendChild(this._dom.overlayWrapper);
    }

    this._options.onInit && this._options.onInit(this);
  }

  private _updateGUI() {
    this._updateCursorThumb();
    this._updateInputs();
    this._updateColorPreview(false);
    this._updateHueThumb();
    this._updateOpacityThumb();
  }

  private _buildPaletteColor() {
    const paletteWrapper = createElement("div", ["yk-palette-wrapper"]);
    const palette = createElement("div", ["yk-palette"]);
    const cursor = createElement("div", ["yk-cursor"]);

    paletteWrapper.appendChild(palette);
    paletteWrapper.appendChild(cursor);

    // Append event
    this._onMouseDownCursorBind = this._onMouseDownCursor.bind(this);
    this._onMouseUpCursorBind = this._onMouseUpCursor.bind(this);
    this._onMouseMoveCursorBind = this._onMouseMoveCursor.bind(this);
    attachEvent(paletteWrapper, "pointerdown", this._onMouseDownCursorBind);

    this._dom["palette"] = palette;
    this._dom["cursor"] = cursor;

    return paletteWrapper;
  }

  private _buildColorSettings() {
    const colorSettings = createElement("div", ["yk-color-settings"]);

    // Build color color
    colorSettings.appendChild(this._buildCopyColor());
    // Build color preview
    colorSettings.appendChild(this._buildColorPreview());
    // Build sliders
    colorSettings.appendChild(this._buildColorSliders());
    // Build inputs
    colorSettings.appendChild(this._buildColorInputs());

    return colorSettings;
  }

  private _buildColorInputs() {
    // Create elements
    const inputsSettings = createElement("div", ["yk-color-model-wrapper"]);
    const inputsWrapper = createElement("div", ["yk-color-model"]);
    const btnSwitch = createElement("button", ["yk-color-model-switch"], {
      type: "button",
    });
    btnSwitch.appendChild(
      this._createSVGIcon(
        `<path d="m3.5045 11.431 1.5786-1.5786 3.0256 3.0256 3.0256-3.0256 1.5786 1.5786-4.6042 4.4726zm4.6042-11.313 4.6042 4.4726-1.5786 1.5786-3.0256-3.0256-3.0256 3.0256-1.5786-1.5786z"/>`
      )
    );

    // Append elements
    inputsSettings.appendChild(inputsWrapper);
    inputsSettings.appendChild(btnSwitch);

    // Attach Events
    attachEvent(btnSwitch, "click", this._onClickInputsSwitch.bind(this));

    this._dom["btnSwitch"] = btnSwitch;
    this._dom["inputsWrapper"] = inputsWrapper;

    return inputsSettings;
  }

  private _buildInput() {
    const { inputsWrapper } = this._dom;
    inputsWrapper.innerHTML = "";
    if (this._currentRepresentation == YKColorPickerMode.HEX) {
      inputsWrapper.appendChild(this._buildHEXInput());
    } else {
      inputsWrapper.appendChild(this._buildQuadrupedInput());
    }
  }

  private _buildHEXInput() {
    const inputWrapper = createElement("div", ["yk-hex-input"]);
    const inputHEX = createElement("input", ["yk-color-input"]);
    const labelHEX = createElement("label", ["yk-color-model-label"]);
    inputHEX.setAttribute("type", "text");
    labelHEX.textContent = "HEX";
    inputWrapper.appendChild(inputHEX);
    inputWrapper.appendChild(labelHEX);

    attachEvent(inputHEX, "focus", this._onFocusInput.bind(this));
    attachEvent(inputHEX, "keydown", this._onKeyDownInputHEX.bind(this));
    attachEvent(inputHEX, "input", this._onInputHEX.bind(this));
    attachEvent(inputHEX, "change", this._onChangeInputHEX.bind(this));

    this._dom["inputHEX"] = inputHEX;

    return inputWrapper;
  }

  private _buildQuadrupedInput() {
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
    const model = this._currentRepresentation.toUpperCase();
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
    attachEvent(inputA, "focus", this._onFocusInput.bind(this));
    attachEvent(inputA, "keydown", this._onKeyDownInputA.bind(this));
    attachEvent(inputA, "input", this._onInputA.bind(this));
    attachEvent(inputA, "change", this._onChangeInputA.bind(this));

    attachEvent(inputB, "focus", this._onFocusInput.bind(this));
    attachEvent(inputB, "keydown", this._onKeyDownInputB.bind(this));
    attachEvent(inputB, "input", this._onInputB.bind(this));
    attachEvent(inputB, "change", this._onChangeInputB.bind(this));

    attachEvent(inputC, "focus", this._onFocusInput.bind(this));
    attachEvent(inputC, "keydown", this._onKeyDownInputC.bind(this));
    attachEvent(inputC, "input", this._onInputC.bind(this));
    attachEvent(inputC, "change", this._onChangeInputC.bind(this));

    attachEvent(inputD, "keydown", this._onKeyDownAlphaInput.bind(this));
    attachEvent(inputD, "input", this._onKeyUpAlphaInput.bind(this));
    attachEvent(inputD, "change", this._onChangeAlphaInput.bind(this));

    this._dom["inputA"] = inputA;
    this._dom["inputB"] = inputB;
    this._dom["inputC"] = inputC;
    this._dom["inputAlpha"] = inputD;

    return inputWrapper;
  }

  private _updateOpacityThumb() {
    const { opacitySlider, opacityThumb } = this._dom;
    opacityThumb.style.translate = `${
      this._color.a * opacitySlider.offsetWidth
    }px`;
  }

  private _updateHueThumb() {
    const { hueThumb, hueSlider } = this._dom;
    hueThumb.style.translate = `${
      (this._color.hsv.h / 360) * hueSlider.offsetWidth
    }px`;
  }

  private _setQuadrupedValue(a: string, b: string, c: string) {
    this._dom["inputA"].value = a;
    this._dom["inputB"].value = b;
    this._dom["inputC"].value = c;
    this._dom["inputAlpha"].value = parseFloat(this._color.a.toFixed(2));
  }

  private _updateHEXInput() {
    this._dom["inputHEX"].value = this._color.hex;
  }

  private _updateSettingsView() {
    this._updateInputsValue();
    this._updateColorPreview(true);
  }

  private _updateInputs() {
    this._buildInput();
    this._updateInputsValue();
  }

  private _updateInputsValue() {
    switch (this._currentRepresentation) {
      case YKColorPickerMode.RGB:
        {
          const { r, g, b } = (this._color.rgb = this._color.toRGB());
          this._setQuadrupedValue(
            Math.round(r).toString(),
            Math.round(g).toString(),
            Math.round(b).toString()
          );
        }
        break;

      case YKColorPickerMode.HSV:
        {
          const { h, s, v } = this._color.hsv;
          this._setQuadrupedValue(
            `${Math.round(h)}°`,
            `${Math.round(s)}%`,
            `${Math.round(v)}%`
          );
        }
        break;

      case YKColorPickerMode.HSL:
        {
          const { h, s, l } = (this._color.hsl = this._color.toHSL());
          this._setQuadrupedValue(
            `${Math.round(h)}°`,
            `${Math.round(s)}%`,
            `${Math.round(l)}%`
          );
        }
        break;

      case YKColorPickerMode.HEX:
        {
          this._updateHEXColor();
          this._updateHEXInput();
        }
        break;
    }
  }

  private _updateColorPreview(fireEvent: boolean) {
    const alpha = this._color.a;
    const hsl = this._color.toHSL();
    const { palette, opacitySlider, colorPreview } = this._dom;
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
      this._options.onInput(this);
    }
  }

  private _updateCursorThumb() {
    const { palette, cursor } = this._dom;
    const { s, v } = this._color.hsv;
    cursor.style.translate = `${(s / 100) * palette.offsetWidth}px ${
      palette.offsetHeight - (v / 100) * palette.offsetHeight
    }px`;
  }

  private _buildCopyColor() {
    const copyColor = createElement("button", ["yk-clipboard-color"], {
      type: "button",
    });
    attachEvent(copyColor, "click", this._onClickCopyColor.bind(this));
    this._dom["copyColor"] = copyColor;
    this._attachCopyIcon();

    return copyColor;
  }

  private _attachCopyIcon() {
    const path = `<path d="m1.9695 11.037v-6.7c0-2 1.6-3.7 3.7-3.7h4.3c0.8 0 1.5 0.5 1.7 1.2h-5.6c-1.6 0.1-2.9 1.4-2.9 3.1v7.9c-0.7-0.3-1.2-1-1.2-1.8zm4.3 4.3c-1 0-1.8-0.8-1.8-1.8v-8.6c0-1 0.8-1.8 1.8-1.8h6.1c1 0 1.8 0.8 1.8 1.8v8.6c0 1-0.8 1.8-1.8 1.8zm6.7-1.8v-8.6c0-0.3-0.3-0.6-0.6-0.6h-6.1c-0.3 0-0.6 0.3-0.6 0.6v8.6c0 0.3 0.3 0.6 0.6 0.6h6.1c0.3 0 0.6-0.3 0.6-0.6z"/>`;
    this._dom.copyColor.innerHTML = "";
    this._dom.copyColor.appendChild(this._createSVGIcon(path));
  }

  private _attachCheckIcon() {
    const path = `<path d="m13.975 5.3001c0.24929-0.24929 0.16619-0.58168-0.0831-0.83097l-0.66477-0.66477c-0.24929-0.24929-0.58168-0.16619-0.83097 0.083097l-5.5675 6.2322-3.407-3.1577c-0.24929-0.24929-0.58168-0.16619-0.83097 0.083097l-0.66477 0.66477c-0.24929 0.24929-0.16619 0.58168 0.083097 0.83097l4.5703 4.1548c0.24929 0.24929 0.58168 0.16619 0.83097-0.0831z"/>`;
    this._dom.copyColor.innerHTML = "";
    this._dom.copyColor.appendChild(this._createSVGIcon(path));
  }

  private _createSVGIcon(path: string) {
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

  private _buildColorSliders() {
    const sliders = createElement("div", ["yk-sliders"]);

    // Build hue slider
    sliders.appendChild(this._buildHueSlider());
    // Build hue slider
    sliders.appendChild(this._buildOpacitySlider());

    return sliders;
  }

  private _buildHueSlider() {
    // Create elements
    const sliderWrapper = createElement("div", ["yk-hue-slider-wrapper"]);
    const slider = createElement("div", ["yk-hue-slider"]);
    const sliderThumb = createElement("a", ["yk-hue-slider-thumb"]);
    sliderThumb.setAttribute("tabindex", "0");

    // Appench child element
    sliderWrapper.appendChild(slider);
    sliderWrapper.appendChild(sliderThumb);

    // Attach events
    this._onMouseDownHueSliderBind = this._onMouseDownHueSlider.bind(this);
    this._onMouseUpHueSliderBind = this._onMouseUpHueSlider.bind(this);
    this._onMouseMoveHueSliderBind = this._onMouseMoveHueSlider.bind(this);
    attachEvent(sliderWrapper, "pointerdown", this._onMouseDownHueSliderBind);
    attachEvent(sliderThumb, "keydown", this._onKeyDownHueSlider.bind(this));

    this._dom["hueSlider"] = slider;
    this._dom["hueThumb"] = sliderThumb;

    return sliderWrapper;
  }

  private _buildOpacitySlider() {
    // Create elements
    const sliderWrapper = createElement("div", ["yk-opacity-slider-wrapper"]);
    const color = createElement("div", ["yk-opacity-color"]);
    const sliderThumb = createElement("a", ["yk-opacity-slider-thumb"]);
    sliderThumb.setAttribute("tabindex", "0");

    // Appench child element
    sliderWrapper.appendChild(color);
    sliderWrapper.appendChild(sliderThumb);

    // Attach events
    this._onMouseDownOpacitySliderBind =
      this._onMouseDownOpacitySlider.bind(this);
    this._onMouseUpOpacitySliderBind = this._onMouseUpOpacitySlider.bind(this);
    this._onMouseMoveOpacitySliderBind =
      this._onMouseMoveOpacitySlider.bind(this);
    attachEvent(
      sliderWrapper,
      "pointerdown",
      this._onMouseDownOpacitySliderBind
    );
    attachEvent(
      sliderThumb,
      "keydown",
      this._onKeyDownOpacitySlider.bind(this)
    );

    this._dom["opacitySlider"] = color;
    this._dom["opacityThumb"] = sliderThumb;

    return sliderWrapper;
  }

  private _buildColorPreview() {
    const colorPreviewWrapper = createElement("span", [
      "yk-color-preview-wrapper",
    ]);

    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElement.setAttribute("width", "38");
    svgElement.setAttribute("height", "38");

    const colorPreview = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    colorPreview.setAttribute("cx", "19");
    colorPreview.setAttribute("cy", "19");
    colorPreview.setAttribute("r", "18");
    colorPreview.classList.add("yk-preview-stroke");

    svgElement.innerHTML =
      '<pattern id="transparent-grid" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse"><path fill="#DBDBDB" d="M0 0h3v3H0z"/><path fill="#fff" d="M3 0h3v3H3z"/><path fill="#DBDBDB" d="M3 3h3v3H3z"/><path fill="#fff" d="M0 3h3v3H0z"/></pattern></defs><circle cx="19" cy="19" r="18" fill="url(#transparent-grid)"/>';
    svgElement.appendChild(colorPreview);
    colorPreviewWrapper.appendChild(svgElement);

    this._dom.colorPreview = colorPreview;

    return colorPreviewWrapper;
  }

  private _rgbUpdateView() {
    this._updateColorPreview(true);
    this._updateHueThumb();
    this._updateCursorThumb();
  }

  private _updateHEXColorSection(
    color: string,
    event: Event,
    con: (a: number, b: number) => boolean,
    conValue: number,
    op: (a: number, b: number) => number,
    startSelect: number,
    endSelect: number
  ) {
    const target = event.target as HTMLInputElement;
    const { rgb, hex } = this._color;
    if (con(rgb[color], conValue)) {
      rgb[color] = op(rgb[color], 1);
      this._color.hex =
        hex.substring(0, startSelect) +
        hexPad2(Math.round(rgb[color])) +
        hex.substring(endSelect);
      const { r, g, b } = rgb;
      this._color.hsv = YKColorParser.RGBtoHSV(r, g, b);
      this._rgbUpdateView();
    }
    target.value = this._color.hex;
    target.setSelectionRange(startSelect, endSelect);
    event.preventDefault();
  }

  private _updateHEXAlphaSection(
    event: Event,
    con: (a: number, b: number) => boolean,
    conValue: number,
    op: (a: number, b: number) => number
  ) {
    const target = event.target as HTMLInputElement;
    const { hex, a } = this._color;
    if (con(a, conValue)) {
      this._color.a = parseFloat(op(a, 0.01).toFixed(2));
      target.value = this._color.hex =
        hex.substring(0, 7) + hexPad2(Math.round(this._color.a * 255));
      this._updateColorPreview(true);
      this._updateOpacityThumb();
    }
    target.value = this._color.hex;
    target.setSelectionRange(7, 9);
    event.preventDefault();
  }

  private _updateOpacityValue(value: number) {
    this._color.a = parseFloat(value.toFixed(2));
    if (this._currentRepresentation == YKColorPickerMode.HEX) {
      this._updateHEXColor();
      this._updateHEXInput();
    } else {
      this._dom.inputAlpha.value = this._color.a;
    }
    this._updateColorPreview(true);
  }

  private _updatePosition() {
    if (this._options.target == null) {
      return;
    }
    if (!YKColorPicker._isTargetInViewport(this._options.target)) {
      this.close();
      return;
    }
    this._setPositionAxis(this._getPositionAxis());
  }

  private _attachToContainer(callEvent: boolean) {
    if (!this._options.container) {
      throw new Error("YKColorPicker:: container is not defined");
    }
    let _container: HTMLElement | string | null = null;
    if (typeof this._options.container == "string") {
      _container = document.getElementById(this._options.container);
    } else {
      _container = this._options.container;
    }
    if (!_container) {
      throw ReferenceError(
        "ColorPicker:: container to set color picker is undefined"
      );
    }
    this._removeWindowEvents();
    const { overlayWrapper } = this._dom;
    const parent = overlayWrapper.parentElement;
    _container.appendChild(overlayWrapper);
    overlayWrapper.classList.remove(
      "yk-overlay-wrapper--light",
      "yk-overlay-wrapper--dark"
    );
    overlayWrapper.classList.add("yk-overlay-wrapper--static");
    overlayWrapper.classList.add("yk-overlay-wrapper--open");
    overlayWrapper.classList.add("yk-overlay-wrapper--" + this._options.theme);
    this._updateGUI();
    this._isOpen = true;
    if (callEvent && parent != overlayWrapper.parentElement) {
      this._options.onContainerChange &&
        this._options.onContainerChange(this, parent);
    }
  }

  private _attachToBody() {
    this._removeWindowEvents();
    const { overlayWrapper } = this._dom;
    const parent = overlayWrapper.parentElement;
    document.body.appendChild(overlayWrapper);
    overlayWrapper.classList.remove(
      "yk-overlay-wrapper--light",
      "yk-overlay-wrapper--dark"
    );
    overlayWrapper.classList.remove("yk-overlay-wrapper--static");
    overlayWrapper.classList.add("yk-overlay-wrapper--open");
    overlayWrapper.classList.add("yk-overlay-wrapper--" + this._options.theme);
    this._updateGUI();
    this._updatePosition();
    attachEvent(window, "resize", this._onResizeScrollWindowBind);
    attachEvent(window, "scroll", this._onResizeScrollWindowBind);
    attachEvent(document, "click", this._onClickCloseBind);
    attachEvent(document, "keyup", this._onKeyUpCloseBind);
    this._isOpen = true;
    if (parent != overlayWrapper.parentElement) {
      this._options.onContainerChange &&
        this._options.onContainerChange(this, parent);
    }
  }

  private _detachOverlay() {
    this._dom.overlayWrapper.classList.remove("yk-overlay-wrapper--open");
    this._removeWindowEvents();
    this._isOpen = false;
  }

  private _onClickTarget(event: MouseEvent) {
    event.stopPropagation();
    if (this._isOpen) this.close();
    else this.open();
  }

  private _onMouseDownCursor(event: MouseEvent) {
    this._dc = true;
    attachEvent(document, "pointermove", this._onMouseMoveCursorBind);
    attachEvent(document, "pointerup", this._onMouseUpCursorBind);
    this._onMouseMoveCursorBind(event);
  }

  private _onMouseUpCursor(e: MouseEvent) {
    document.removeEventListener("pointermove", this._onMouseMoveCursorBind);
    document.removeEventListener("pointerup", this._onMouseUpCursorBind);
    if (this._dom.overlayWrapper.contains(e.target)) {
      this._dc = false;
    }
  }

  private _onMouseMoveCursor(event: MouseEvent) {
    const { x, y } = this._getCursorPosition(event.clientX, event.clientY);
    this._dom.cursor.style.translate = `${x}px ${y}px`;
    const paletteHeight = this._dom.palette.offsetHeight;
    const paletteWidth = this._dom.palette.offsetWidth;
    this._color.hsv.s = (x / paletteWidth) * 100;
    this._color.hsv.v = ((paletteHeight - y) / paletteHeight) * 100;
    this._updateSettingsView();
  }

  private _onClickInputsSwitch() {
    switch (this._currentRepresentation) {
      case YKColorPickerMode.RGB:
        this._updateRepresentation(YKColorPickerMode.HSV);
        break;
      case YKColorPickerMode.HSV:
        this._updateRepresentation(YKColorPickerMode.HSL);
        break;
      case YKColorPickerMode.HSL:
        this._updateRepresentation(YKColorPickerMode.HEX);
        break;
      case YKColorPickerMode.HEX:
        this._updateRepresentation(YKColorPickerMode.RGB);
        break;
    }
  }

  private _onFocusInput() {
    switch (this._currentRepresentation) {
      case YKColorPickerMode.RGB:
        this._color.rgb = this.getRGB();
        break;
      case YKColorPickerMode.HSV:
        this._color.hsv = this.getHSV();
        break;
      case YKColorPickerMode.HSL:
        this._color.hsl = this.getHSL();
        break;
      case YKColorPickerMode.HEX:
        this._updateHEXColor();
        break;
    }
  }

  private _onKeyDownAlphaInput(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    const { a } = this._color;
    switch (event.key) {
      case "ArrowUp":
        {
          if (a < 1) {
            let alphaValue = parseFloat((a + 0.01).toFixed(2));
            if (alphaValue > 1) {
              alphaValue = 1;
            }
            target.value = (this._color.a = alphaValue).toString();
            this._updateColorPreview(true);
            this._updateOpacityThumb();
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
            target.value = (this._color.a = alphaValue).toString();
            this._updateColorPreview(true);
            this._updateOpacityThumb();
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

  private _onKeyUpAlphaInput(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    if (/^(0(\.\d{1,2})?|(0*)1?)$/.test(target.value) || target.value == "") {
      const value = parseFloat(target.value) || 0;
      if (!isNaN(value) && value >= 0 && value <= 1) {
        this._color.a = value;
        this._updateColorPreview(true);
        this._updateOpacityThumb();
      }
    }
  }

  private _onChangeAlphaInput(event: Event) {
    event.target && ((event.target as HTMLInputElement).value = this._color.a);
  }

  private _onKeyDownInputHEX(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    switch (event.key) {
      case "ArrowUp":
        {
          if (
            !/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(
              target.value
            )
          ) {
            target.value = this._color.hex;
          }
          const caret = this._getCaretPosition(target);
          const length = target.value.length;
          if (length <= 5) {
            if (caret < 2) {
              this._updateHEXColorSection(
                "r",
                event,
                YKColorPicker._lt,
                255,
                YKColorPicker._add,
                1,
                3
              );
            } else if (caret < 3) {
              this._updateHEXColorSection(
                "g",
                event,
                YKColorPicker._lt,
                255,
                YKColorPicker._add,
                3,
                5
              );
            } else if ((caret <= 4 && length <= 4) || caret < 4) {
              this._updateHEXColorSection(
                "b",
                event,
                YKColorPicker._lt,
                255,
                YKColorPicker._add,
                5,
                7
              );
            } else if (caret <= 5) {
              this._updateHEXAlphaSection(
                event,
                YKColorPicker._lt,
                1,
                YKColorPicker._add
              );
            }
          } else {
            if (caret < 3) {
              this._updateHEXColorSection(
                "r",
                event,
                YKColorPicker._lt,
                255,
                YKColorPicker._add,
                1,
                3
              );
            } else if (caret < 5) {
              this._updateHEXColorSection(
                "g",
                event,
                YKColorPicker._lt,
                255,
                YKColorPicker._add,
                3,
                5
              );
            } else if ((caret <= 7 && length == 7) || caret < 7) {
              this._updateHEXColorSection(
                "b",
                event,
                YKColorPicker._lt,
                255,
                YKColorPicker._add,
                5,
                7
              );
            } else if (caret <= 9) {
              this._updateHEXAlphaSection(
                event,
                YKColorPicker._lt,
                1,
                YKColorPicker._add
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
            target.value = this._color.hex;
          }
          const caret = this._getCaretPosition(target);
          const length = target.value.length;
          if (length <= 5) {
            if (caret < 2) {
              this._updateHEXColorSection(
                "r",
                event,
                YKColorPicker._gt,
                0,
                YKColorPicker._sub,
                1,
                3
              );
            } else if (caret < 3) {
              this._updateHEXColorSection(
                "g",
                event,
                YKColorPicker._gt,
                0,
                YKColorPicker._sub,
                3,
                5
              );
            } else if ((caret <= 4 && length <= 4) || caret < 4) {
              this._updateHEXColorSection(
                "b",
                event,
                YKColorPicker._gt,
                0,
                YKColorPicker._sub,
                5,
                7
              );
            } else if (caret <= 5) {
              this._updateHEXAlphaSection(
                event,
                YKColorPicker._gt,
                0,
                YKColorPicker._sub
              );
            }
          } else {
            if (caret < 3) {
              this._updateHEXColorSection(
                "r",
                event,
                YKColorPicker._gt,
                0,
                YKColorPicker._sub,
                1,
                3
              );
            } else if (caret < 5) {
              this._updateHEXColorSection(
                "g",
                event,
                YKColorPicker._gt,
                0,
                YKColorPicker._sub,
                3,
                5
              );
            } else if ((caret <= 7 && length == 7) || caret < 7) {
              this._updateHEXColorSection(
                "b",
                event,
                YKColorPicker._gt,
                0,
                YKColorPicker._sub,
                5,
                7
              );
            } else if (caret <= 9) {
              this._updateHEXAlphaSection(
                event,
                YKColorPicker._gt,
                0,
                YKColorPicker._sub
              );
            }
          }
        }
        break;
    }
  }

  private _onInputHEX(event: Event) {
    const rgb = YKColorParser.HEXtoRGBA(
      (event.target as HTMLInputElement).value.trim()
    );
    if (rgb != null) {
      const { r, g, b, a } = rgb;
      this._color.a = a;
      this._color.rgb = { r, g, b };
      this._color.hex = YKColorParser.RGBAtoHEX(r, g, b, a);
      this._color.hsv = YKColorParser.RGBtoHSV(r, g, b);
      this._updateColorPreview(true);
      this._updateHueThumb();
      this._updateOpacityThumb();
      this._updateCursorThumb();
    }
  }

  private _onChangeInputHEX(event: Event) {
    (event.target as HTMLInputElement).value = this._color.hex;
  }

  private _onKeyDownInputA(event: KeyboardEvent) {
    const { target, key } = event;
    switch (key) {
      case "ArrowUp":
        {
          switch (this._currentRepresentation) {
            case YKColorPickerMode.RGB:
              {
                let { r, g, b } = this._color.rgb;
                r = Math.round(r);
                if (r < 255) {
                  this._color.rgb.r = (target as HTMLInputElement).value =
                    (++r).toString();
                  this._color.hsv = YKColorParser.RGBtoHSV(r, g, b);
                  this._rgbUpdateView();
                }
              }
              break;

            case YKColorPickerMode.HSV:
            case YKColorPickerMode.HSL:
              {
                let { h } = this._color.hsv;
                h = Math.round(h);
                if (h < 360) {
                  (target as HTMLInputElement).value = ++h + "°";
                  this._color.hsv.h = this._color.hsl.h = h;
                  this._updateColorPreview(true);
                  this._updateHueThumb();
                }
              }
              break;
          }
        }
        break;
      case "ArrowDown":
        {
          switch (this._currentRepresentation) {
            case YKColorPickerMode.RGB:
              {
                let { r, g, b } = this._color.rgb;
                r = Math.round(r);
                if (r > 0) {
                  this._color.rgb.r = (target as HTMLInputElement).value =
                    (--r).toString();
                  this._color.hsv = YKColorParser.RGBtoHSV(r, g, b);
                  this._rgbUpdateView();
                }
              }
              break;

            case YKColorPickerMode.HSV:
            case YKColorPickerMode.HSL:
              {
                let { h } = this._color.hsv;
                h = Math.round(h);
                if (h > 0) {
                  (target as HTMLInputElement).value = --h + "°";
                  this._color.hsv.h = this._color.hsl.h = h;
                  this._updateColorPreview(true);
                  this._updateHueThumb();
                }
              }
              break;
          }
        }
        break;
    }
  }

  private _onInputA(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value || "0");
    if (/^(\d{1,3})(°?)$/.test(value.toString())) {
      switch (this._currentRepresentation) {
        case YKColorPickerMode.RGB:
          {
            const { g, b } = this._color.rgb;
            if (!isNaN(value) && value >= 0 && value <= 255) {
              this._color.rgb.r = value;
              this._color.hsv = YKColorParser.RGBtoHSV(value, g, b);
              this._updateColorPreview(true);
              this._updateHueThumb();
              this._updateCursorThumb();
            }
          }
          break;

        case YKColorPickerMode.HSV:
        case YKColorPickerMode.HSL:
          {
            if (!isNaN(value) && value >= 0 && value <= 360) {
              this._color.hsv.h = this._color.hsl.h = value;
              this._updateColorPreview(true);
              this._updateHueThumb();
            }
          }
          break;
      }
    }
  }

  private _onChangeInputA(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    switch (this._currentRepresentation) {
      case YKColorPickerMode.RGB:
        {
          value = Math.round(this._color.rgb.r).toString();
        }
        break;

      case YKColorPickerMode.HSV:
      case YKColorPickerMode.HSL:
        {
          value = `${Math.round(this._color.hsv.h)}°`;
        }
        break;
    }
    (event.target as HTMLInputElement).value = value;
  }

  private _onKeyDownInputB(event: KeyboardEvent) {
    const { target, key } = event;
    switch (key) {
      case "ArrowUp":
        {
          switch (this._currentRepresentation) {
            case YKColorPickerMode.RGB:
              {
                let { r, g, b } = this._color.rgb;
                g = Math.round(g);
                if (g < 255) {
                  this._color.rgb.g = (target as HTMLInputElement).value =
                    (++g).toString();
                  this._color.hsv = YKColorParser.RGBtoHSV(r, g, b);
                  this._rgbUpdateView();
                }
              }
              break;

            case YKColorPickerMode.HSV:
              {
                let { s } = this._color.hsv;
                s = Math.round(s);
                if (s < 100) {
                  (target as HTMLInputElement).value = ++s + "%";
                  this._color.hsv.s = s;
                  this._updateColorPreview(true);
                  this._updateCursorThumb();
                }
              }
              break;

            case YKColorPickerMode.HSL:
              {
                const { h, s, l } = this._color.hsl;
                let hsl_s = Math.round(s);
                if (hsl_s < 100) {
                  (target as HTMLInputElement).value = ++hsl_s + "%";
                  this._color.hsl.s = hsl_s;
                  this._color.hsv.s = YKColorParser.HSLtoHSV(h, hsl_s, l).s;
                  this._updateColorPreview(true);
                  this._updateCursorThumb();
                }
              }
              break;
          }
        }
        break;
      case "ArrowDown":
        {
          switch (this._currentRepresentation) {
            case YKColorPickerMode.RGB:
              {
                let { r, g, b } = this._color.rgb;
                g = Math.round(g);
                if (g > 0) {
                  this._color.rgb.g = (target as HTMLInputElement).value =
                    (--g).toString();
                  this._color.hsv = YKColorParser.RGBtoHSV(r, g, b);
                  this._rgbUpdateView();
                }
              }
              break;

            case YKColorPickerMode.HSV:
              {
                let { s } = this._color.hsv;
                s = Math.round(s);
                if (s > 0) {
                  (target as HTMLInputElement).value = --s + "%";
                  this._color.hsv.s = s;
                  this._updateColorPreview(true);
                  this._updateCursorThumb();
                }
              }
              break;

            case YKColorPickerMode.HSL:
              {
                const { h, s, l } = this._color.hsl;
                let hsl_s = Math.round(s);
                if (hsl_s > 0) {
                  (target as HTMLInputElement).value = --hsl_s + "%";
                  this._color.hsl.s = hsl_s;
                  this._color.hsv.s = YKColorParser.HSLtoHSV(h, hsl_s, l).s;
                  this._updateColorPreview(true);
                  this._updateCursorThumb();
                }
              }
              break;
          }
        }
        break;
    }
  }

  private _onInputB(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value || "0");
    if (/^(\d{1,3})(%?)$/.test(value.toString())) {
      switch (this._currentRepresentation) {
        case YKColorPickerMode.RGB:
          {
            const { r, b } = this._color.rgb;
            if (!isNaN(value) && value >= 0 && value <= 255) {
              this._color.rgb.g = value;
              this._color.hsv = YKColorParser.RGBtoHSV(r, value, b);
              this._updateColorPreview(true);
              this._updateHueThumb();
              this._updateCursorThumb();
            }
          }
          break;

        case YKColorPickerMode.HSV:
          {
            if (!isNaN(value) && value >= 0 && value <= 100) {
              this._color.hsv.s = value;
              this._updateColorPreview(true);
              this._updateCursorThumb();
            }
          }
          break;

        case YKColorPickerMode.HSL:
          {
            const { h, l } = this._color.hsl;
            if (!isNaN(value) && value >= 0 && value <= 100) {
              this._color.hsl.s = value;
              this._color.hsv = YKColorParser.HSLtoHSV(h, value, l);
              this._updateColorPreview(true);
              this._updateCursorThumb();
            }
          }
          break;
      }
    }
  }

  private _onChangeInputB(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    switch (this._currentRepresentation) {
      case YKColorPickerMode.RGB:
        {
          value = Math.round(this._color.rgb.g).toString();
        }
        break;

      case YKColorPickerMode.HSV:
        {
          value = `${Math.round(this._color.hsv.s)}%`;
        }
        break;

      case YKColorPickerMode.HSL:
        {
          value = `${Math.round(this._color.hsl.s)}%`;
        }
        break;
    }
    (event.target as HTMLInputElement).value = value;
  }

  private _onKeyDownInputC(event: KeyboardEvent) {
    const { target, key } = event;
    switch (key) {
      case "ArrowUp":
        {
          switch (this._currentRepresentation) {
            case YKColorPickerMode.RGB:
              {
                let { r, g, b } = this._color.rgb;
                b = Math.round(b);
                if (b < 255) {
                  this._color.rgb.b = (target as HTMLInputElement).value =
                    (++b).toString();
                  this._color.hsv = YKColorParser.RGBtoHSV(r, g, b);
                  this._rgbUpdateView();
                }
              }
              break;

            case YKColorPickerMode.HSV:
              {
                let { v } = this._color.hsv;
                v = Math.round(v);
                if (v < 100) {
                  (target as HTMLInputElement).value = ++v + "%";
                  this._color.hsv.v = v;
                  this._updateColorPreview(true);
                  this._updateCursorThumb();
                }
              }
              break;

            case YKColorPickerMode.HSL:
              {
                const { h, s, l } = this._color.hsl;
                let hsl_l = Math.round(l);
                if (hsl_l < 100) {
                  (target as HTMLInputElement).value = ++hsl_l + "%";
                  this._color.hsl.l = hsl_l;
                  this._color.hsv.v = YKColorParser.HSLtoHSV(h, s, hsl_l).v;
                  this._updateColorPreview(true);
                  this._updateCursorThumb();
                }
              }
              break;
          }
        }
        break;
      case "ArrowDown":
        {
          switch (this._currentRepresentation) {
            case YKColorPickerMode.RGB:
              {
                let { r, g, b } = this._color.rgb;
                b = Math.round(b);
                if (b > 0) {
                  this._color.rgb.b = (target as HTMLInputElement).value =
                    (--b).toString();
                  this._color.hsv = YKColorParser.RGBtoHSV(r, g, b);
                  this._rgbUpdateView();
                }
              }
              break;

            case YKColorPickerMode.HSV:
              {
                let { v } = this._color.hsv;
                v = Math.round(v);
                if (v > 0) {
                  (target as HTMLInputElement).value = --v + "%";
                  this._color.hsv.v = v;
                  this._updateColorPreview(true);
                  this._updateCursorThumb();
                }
              }
              break;

            case YKColorPickerMode.HSL:
              {
                const { h, s, l } = this._color.hsl;
                let hsl_l = Math.round(l);
                if (l > 0) {
                  (target as HTMLInputElement).value = --hsl_l + "%";
                  this._color.hsl.l = hsl_l;
                  this._color.hsv.v = YKColorParser.HSLtoHSV(h, s, hsl_l).v;
                  this._updateColorPreview(true);
                  this._updateCursorThumb();
                }
              }
              break;
          }
        }
        break;
    }
  }

  private _onInputC(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value || "0");
    if (/^(\d{1,3})(%?)$/.test(value.toString())) {
      switch (this._currentRepresentation) {
        case YKColorPickerMode.RGB:
          {
            const { r, g } = this._color.rgb;
            if (!isNaN(value) && value >= 0 && value <= 255) {
              this._color.rgb.b = value;
              this._color.hsv = YKColorParser.RGBtoHSV(r, g, value);
              this._updateColorPreview(true);
              this._updateHueThumb();
              this._updateCursorThumb();
            }
          }
          break;

        case YKColorPickerMode.HSV:
          {
            if (!isNaN(value) && value >= 0 && value <= 100) {
              this._color.hsv.v = value;
              this._updateColorPreview(true);
              this._updateCursorThumb();
            }
          }
          break;

        case YKColorPickerMode.HSL:
          {
            const { h, s } = this._color.hsl;
            if (!isNaN(value) && value >= 0 && value <= 100) {
              this._color.hsl.l = value;
              this._color.hsv = YKColorParser.HSLtoHSV(h, s, value);
              this._updateColorPreview(true);
              this._updateCursorThumb();
            }
          }
          break;
      }
    }
  }

  private _onChangeInputC(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    switch (this._currentRepresentation) {
      case YKColorPickerMode.RGB:
        {
          value = Math.round(this._color.rgb.b).toString();
        }
        break;

      case YKColorPickerMode.HSV:
        {
          value = `${Math.round(this._color.hsv.v)}%`;
        }
        break;

      case YKColorPickerMode.HSL:
        {
          value = `${Math.round(this._color.hsl.l)}%`;
        }
        break;
    }
    (event.target as HTMLInputElement).value = value;
  }

  private _onClickCopyColor() {
    if (this._copyTimeout) {
      clearTimeout(this._copyTimeout);
    }
    const input = document.createElement("input");
    input.style.position = "absolute";
    input.style.left = "-99999px";
    input.style.top = "-99999px";
    input.value = this._getColorText();
    document.body.appendChild(input);
    input.select();

    try {
      document.execCommand("copy");
      this._attachCheckIcon();
      this._dom.copyColor.focus();
      this._options.onCopy(this);

      this._copyTimeout = setTimeout(() => {
        this._attachCopyIcon();
        this._copyTimeout = null;
      }, 600);
    } catch (err) {
      document.body.removeChild(input);
      throw new Error("YKColorPicker:: Failed to copy color.\n" + err);
    }
  }

  private _onMouseDownHueSlider(event: MouseEvent) {
    event.preventDefault(); // prevent default to set focus on the thumb
    this._dc = true;
    attachEvent(document, "pointermove", this._onMouseMoveHueSliderBind);
    attachEvent(document, "pointerup", this._onMouseUpHueSliderBind);
    this._dom.hueThumb.focus();
    this._onMouseMoveHueSliderBind(event);
  }

  private _onMouseUpHueSlider(event: MouseEvent) {
    document.removeEventListener("pointermove", this._onMouseMoveHueSliderBind);
    document.removeEventListener("pointerup", this._onMouseUpHueSliderBind);
    if (this._dom.overlayWrapper.contains(event.target)) {
      this._dc = false;
    }
  }

  private _onMouseMoveHueSlider(event: MouseEvent) {
    const { hueSlider, hueThumb } = this._dom;
    const sliderRect = hueSlider.getBoundingClientRect();
    const sliderWidth = sliderRect.width;
    let thumbX = event.clientX - sliderRect.left;

    if (thumbX < 0) {
      thumbX = 0;
    }
    if (thumbX > sliderWidth) {
      thumbX = sliderWidth;
    }

    this._color.hsv.h = (thumbX / sliderRect.width) * 360;
    hueThumb.style.translate = `${thumbX}px`;

    this._updateSettingsView();
  }

  private _onMouseDownOpacitySlider(event: MouseEvent) {
    event.preventDefault(); // prevent default to set focus on the thumb
    this._dc = true;
    attachEvent(document, "pointermove", this._onMouseMoveOpacitySliderBind);
    attachEvent(document, "pointerup", this._onMouseUpOpacitySliderBind);
    this._dom.opacityThumb.focus();
    this._onMouseMoveOpacitySliderBind(event);
  }

  private _onMouseUpOpacitySlider(event: MouseEvent) {
    document.removeEventListener(
      "pointermove",
      this._onMouseMoveOpacitySliderBind
    );
    document.removeEventListener("pointerup", this._onMouseUpOpacitySliderBind);
    if (this._dom.overlayWrapper.contains(event.target)) {
      this._dc = false;
    }
  }

  private _onMouseMoveOpacitySlider(event: MouseEvent) {
    const { opacitySlider, opacityThumb } = this._dom;
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
    this._updateOpacityValue(thumbX / sliderWidth);
  }

  private _onKeyDownHueSlider(event: KeyboardEvent) {
    const { key } = event;
    switch (key) {
      case "ArrowUp":
      case "ArrowRight":
        {
          const { hueThumb, hueSlider } = this._dom;
          let position = parseInt(hueThumb.style.translate);
          if (!isNaN(position) && position < hueSlider.offsetWidth) {
            hueThumb.style.translate = `${++position}px`;
            this._color.hsv.h = (position / hueSlider.offsetWidth) * 360;
            this._updateSettingsView();
          }
          event.preventDefault();
        }
        break;

      case "ArrowDown":
      case "ArrowLeft":
        {
          const { hueThumb, hueSlider } = this._dom;
          let position = parseInt(hueThumb.style.translate);
          if (!isNaN(position) && position > 0) {
            hueThumb.style.translate = `${--position}px`;
            this._color.hsv.h = (position / hueSlider.offsetWidth) * 360;
            this._updateSettingsView();
          }
          event.preventDefault();
        }
        break;
    }
  }

  private _onKeyDownOpacitySlider(event: KeyboardEvent) {
    const { key } = event;
    switch (key) {
      case "ArrowUp":
      case "ArrowRight":
        {
          const { opacityThumb, opacitySlider } = this._dom;
          let position = parseInt(opacityThumb.style.translate);
          if (!isNaN(position) && position < opacitySlider.offsetWidth) {
            opacityThumb.style.translate = `${++position}px`;
            this._updateOpacityValue(position / opacitySlider.offsetWidth);
          }
          event.preventDefault();
        }
        break;

      case "ArrowDown":
      case "ArrowLeft":
        {
          const { opacityThumb, opacitySlider } = this._dom;
          let position = parseInt(opacityThumb.style.translate);
          if (!isNaN(position) && position > 0) {
            opacityThumb.style.translate = `${--position}px`;
            this._updateOpacityValue(position / opacitySlider.offsetWidth);
          }
          event.preventDefault();
        }
        break;
    }
  }

  private _onKeyUpClose(event: KeyboardEvent) {
    if (
      event.key == "Enter" &&
      this._isOpen &&
      ![this._dom.copyColor, this._dom.btnSwitch].includes(event.target)
    ) {
      this.close();
      return;
    }

    if (event.key == "Escape") {
      if (this._prevColor != this.getHEX()) {
        this.setColor(this._prevColor);
        this._updateGUI();
        this._options.onInput(this);
      }
      this.close();
    }
  }

  private _onResizeScrollWindow(event: Event) {
    const { type } = event;
    const { target, closeOnScroll, closeOnResize } = this._options;
    if (
      (type == "scroll" && closeOnScroll) ||
      (type == "resize" && closeOnResize)
    ) {
      this.close();
    } else {
      if (target == null) {
        return;
      }
      if (!YKColorPicker._isTargetInViewport(this._options.target)) {
        this.close();
        return;
      }
      this._setPositionAxis(this._getPositionAxis());
    }
  }

  private _removeWindowEvents() {
    window.removeEventListener("resize", this._onResizeScrollWindowBind);
    window.removeEventListener("scroll", this._onResizeScrollWindowBind);
    document.removeEventListener("keyup", this._onKeyUpCloseBind);
    document.removeEventListener("click", this._onClickCloseBind);
  }

  private _getCursorPosition(clientX: number, clientY: number) {
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
  }

  private _updateHEXColor() {
    const { r, g, b } = (this._color.rgb = this._color.toRGB());
    this._color.hex = YKColorParser.RGBAtoHEX(r, g, b, this._color.a);
  }

  private _getColorText() {
    switch (this._currentRepresentation) {
      case YKColorPickerMode.RGB:
        const { r, g, b } = this._color.rgb;
        return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${
          this._color.a
        })`;

      case YKColorPickerMode.HSV: {
        const { h, s, v } = this._color.hsv;
        return `hsva(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(v)}%, ${
          this._color.a
        })`;
      }

      case YKColorPickerMode.HSL: {
        const { h, s, l } = this._color.hsl;
        return `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${
          this._color.a
        })`;
      }

      case YKColorPickerMode.HEX:
        return this.getHEX();
    }
  }

  private _getCaretPosition(target: HTMLInputElement) {
    let position = target.selectionStart || 0;
    const length = target.value.length;
    if (position > length) {
      position = length;
    }
    return position;
  }

  private _getPositionAxis(): Point {
    const { target, position, positionFallback } = this._options;
    if (!target || !position || !positionFallback) {
      return { x: 0, y: 0 };
    }
    const targetRect = target.getBoundingClientRect();
    const colorPickerRect = this._dom.overlayWrapper.getBoundingClientRect();
    const scrollTop = document.documentElement.scrollTop;
    const scrollLeft = document.documentElement.scrollLeft;
    const offset = 6;
    let _position = position;

    const _stateSpaceInTop = YKColorPicker._enoughSpace(
      () => scrollTop + targetRect.top,
      () => targetRect.top,
      colorPickerRect.height + offset
    );
    const _stateSpaceInBottom = YKColorPicker._enoughSpace(
      () =>
        YKColorPicker._getPageHeight() -
        (scrollTop + targetRect.top + targetRect.height),
      () => window.innerHeight - (targetRect.top + targetRect.height),
      colorPickerRect.height + offset
    );
    const _stateSpaceInLeft = YKColorPicker._enoughSpace(
      () => scrollLeft + targetRect.left,
      () => targetRect.left,
      colorPickerRect.width + offset
    );
    const _stateSpaceInRight = YKColorPicker._enoughSpace(
      () =>
        YKColorPicker._getPageWidth() -
        (scrollLeft + targetRect.left + targetRect.width),
      () => window.innerWidth - (targetRect.left + targetRect.width),
      colorPickerRect.width + offset
    );

    const states: any = {
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
      if (state == "2") {
        bestPositions = bestPositions + positions[i - 1];
      }
      if (state == "1") {
        secondPositions = secondPositions + positions[i - 1];
      }
    }

    if (bestPositions != "") {
      if (bestPositions.includes(_position) == false) {
        _position = bestPositions[0] as YKColorPickerPosition;
      }
    } else if (secondPositions != "") {
      if (secondPositions.includes(_position) == false) {
        _position = secondPositions[0] as YKColorPickerPosition;
      }
    } else {
      _position = YKColorPickerPosition.BOTTOM;
    }

    let x_axis = 0;
    let y_axis = 0;

    switch (_position) {
      case YKColorPickerPosition.TOP:
        y_axis = targetRect.top - colorPickerRect.height - offset;
        x_axis =
          targetRect.left + targetRect.width / 2 - colorPickerRect.width / 2;
        break;

      case YKColorPickerPosition.BOTTOM:
        y_axis = targetRect.top + targetRect.height + offset;
        x_axis =
          targetRect.left + targetRect.width / 2 - colorPickerRect.width / 2;
        break;

      case YKColorPickerPosition.LEFT:
        y_axis =
          targetRect.top + targetRect.height / 2 - colorPickerRect.height / 2;
        x_axis = targetRect.left - colorPickerRect.width - offset;
        break;

      case YKColorPickerPosition.RIGHT:
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

  private _setPositionAxis(axis: Point) {
    const { x, y } = axis;
    this._dom.overlayWrapper.style.top = `${y}px`;
    this._dom.overlayWrapper.style.left = `${x}px`;
  }

  private _updateRepresentation(value: YKColorPickerMode) {
    this._currentRepresentation = value;
    this._updateInputs();
    if (this._options.onRepresentationChange) {
      this._options.onRepresentationChange(this);
    }
  }

  private static _isTargetInViewport(target: HTMLElement | undefined) {
    if (!target) {
      return false;
    }

    const rect = target.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  private static _getPageHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
  }

  private static _getPageWidth() {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.body.clientWidth,
      document.documentElement.clientWidth
    );
  }

  private static _enoughSpace(
    condition1: () => number,
    condition2: () => number,
    boxSize: number
  ) {
    if (condition1() >= boxSize) {
      if (condition2() >= boxSize) {
        return 2;
      }
      return 1;
    }
    return 0;
  }

  private static _buildOptions(
    baseOptions: __YKColorPickerOptions,
    options: YKColorPickerOptions
  ): __YKColorPickerOptions {
    const _options: any = {};
    const keys: string[] = Object.keys(baseOptions);
    for (let i = 0; i < keys.length; i++) {
      const key: string = keys[i];
      if (options.hasOwnProperty(key) == true) {
        (_options as any)[key] = (options as any)[key];
      } else {
        (_options as any)[key] = (baseOptions as any)[key];
      }
    }
    return _options;
  }

  private static _lt(a: number, b: number) {
    return a < b;
  }

  private static _gt(a: number, b: number) {
    return a > b;
  }

  private static _add(a: number, b: number) {
    return a + b;
  }

  private static _sub(a: number, b: number) {
    return a - b;
  }
}
