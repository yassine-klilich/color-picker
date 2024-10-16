declare interface __YKColorPickerOptions extends Required<YKColorPickerOptions> {
}

/**
 * Color Picker
 */
export declare class YKColorPicker {
    static DEFAULT_OPTIONS: __YKColorPickerOptions;
    private _isOpen;
    private _options;
    private _color;
    private _dom;
    private _currentRepresentation;
    private _dc;
    private _onClickTargetBind;
    private _onMouseDownCursorBind;
    private _onMouseUpHueSliderBind;
    private _onMouseMoveHueSliderBind;
    private _onMouseDownHueSliderBind;
    private _onMouseDownOpacitySliderBind;
    private _onMouseUpOpacitySliderBind;
    private _onMouseMoveOpacitySliderBind;
    private _onResizeScrollWindowBind;
    private _onClickCloseBind;
    private _onKeyUpCloseBind;
    private _onMouseMoveCursorBind;
    private _onMouseUpCursorBind;
    private _copyTimeout;
    private _prevColor;
    constructor(options: YKColorPickerOptions);
    isOpen(): boolean;
    open(): void;
    close(): void;
    getRGB(): any;
    getHSV(): {
        h: number;
        s: number;
        v: number;
        a: any;
    };
    getHSL(): {
        h: number;
        s: number;
        l: number;
        a: any;
    };
    getHEX(): any;
    updateOptions(options: YKColorPickerOptions): void;
    getColor(): any;
    setColor(value: string): void;
    private _initDOM;
    private _updateGUI;
    private _buildPaletteColor;
    private _buildColorSettings;
    private _buildColorInputs;
    private _buildInput;
    private _buildHEXInput;
    private _buildQuadrupedInput;
    private _updateOpacityThumb;
    private _updateHueThumb;
    private _setQuadrupedValue;
    private _updateHEXInput;
    private _updateSettingsView;
    private _updateInputs;
    private _updateInputsValue;
    private _updateColorPreview;
    private _updateCursorThumb;
    private _buildCopyColor;
    private _attachCopyIcon;
    private _attachCheckIcon;
    private _createSVGIcon;
    private _buildColorSliders;
    private _buildHueSlider;
    private _buildOpacitySlider;
    private _buildColorPreview;
    private _rgbUpdateView;
    private _updateHEXColorSection;
    private _updateHEXAlphaSection;
    private _updateOpacityValue;
    private _updatePosition;
    private _attachToContainer;
    private _attachToBody;
    private _detachOverlay;
    private _onClickTarget;
    private _onMouseDownCursor;
    private _onMouseUpCursor;
    private _onMouseMoveCursor;
    private _onClickInputsSwitch;
    private _onFocusInput;
    private _onKeyDownAlphaInput;
    private _onKeyUpAlphaInput;
    private _onChangeAlphaInput;
    private _onKeyDownInputHEX;
    private _onInputHEX;
    private _onChangeInputHEX;
    private _onKeyDownInputA;
    private _onInputA;
    private _onChangeInputA;
    private _onKeyDownInputB;
    private _onInputB;
    private _onChangeInputB;
    private _onKeyDownInputC;
    private _onInputC;
    private _onChangeInputC;
    private _onClickCopyColor;
    private _onMouseDownHueSlider;
    private _onMouseUpHueSlider;
    private _onMouseMoveHueSlider;
    private _onMouseDownOpacitySlider;
    private _onMouseUpOpacitySlider;
    private _onMouseMoveOpacitySlider;
    private _onKeyDownHueSlider;
    private _onKeyDownOpacitySlider;
    private _onKeyUpClose;
    private _onResizeScrollWindow;
    private _removeWindowEvents;
    private _getCursorPosition;
    private _updateHEXColor;
    private _getColorText;
    private _getCaretPosition;
    private _getPositionAxis;
    private _setPositionAxis;
    private _updateRepresentation;
    private static _isTargetInViewport;
    private static _getPageHeight;
    private static _getPageWidth;
    private static _enoughSpace;
    private static _buildOptions;
    private static _lt;
    private static _gt;
    private static _add;
    private static _sub;
}

export declare enum YKColorPickerMode {
    RGB = "rgb",
    HSV = "hsv",
    HSL = "hsl",
    HEX = "hex"
}

export declare interface YKColorPickerOptions {
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
    onContainerChange?: (instance: YKColorPicker, previousParent: HTMLElement) => void;
}

export declare enum YKColorPickerPosition {
    TOP = "t",
    BOTTOM = "b",
    LEFT = "l",
    RIGHT = "r"
}

export declare type YKColorPickerPositionFallback = "btrl" | "btlr" | "brtl" | "brlt" | "bltr" | "blrt" | "tbrl" | "tblr" | "trbl" | "trlb" | "tlbr" | "tlrb" | "rbtl" | "rblt" | "rtbl" | "rtlb" | "rlbt" | "rltb" | "lbtr" | "lbrt" | "ltbr" | "ltrb" | "lrbt" | "lrtb";

export { }
