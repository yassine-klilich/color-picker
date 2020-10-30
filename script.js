




(function(window) {
   if(!window.ColorPicker) {
      const DOM = {};
      const COLOR_MODEL = {
         RGB: 'rgb',
         HSV: 'hsv',
         HSL: 'hsl',
         HEX: 'hex'
      }
      const hsva = {
         hue: 0,
         saturate: 70,
         value: 50,
         alpha: 1
      }
      const _rgba_ = {
         red: 255,
         green: 0,
         blue: 0
      }
      const _hsla_ = {
         hue: 0,
         saturate: 100,
         lightness: 100
      }
      let currentColorModel = null;

      /**
       * Initialize the color picker library
       */
      function init() {
         _guiBuilder.initGUI();
         _eventListeners.initEvents();
      }

      /**
       * Get the current selected color model
       */
      function selectedColorModel() {
         return currentColorModel;
      }

      const _helper = {
         /**
          * Set a color model
          * @param {COLOR_MODEL} colorModel 
          */
         setColorModel(colorModel) {
            currentColorModel = colorModel;
            DOM.colorModel.innerHTML = "";
            
            switch (currentColorModel) {
               case COLOR_MODEL.RGB:
                  let rgb = _colorConverter.HSVtoRGB(hsva.hue, hsva.saturate, hsva.value);
                  DOM.colorModel.appendChild(DOM.rgbInputs);
                  DOM.rgbInputs.cp_setValue(rgb.r, rgb.g, rgb.b, hsva.alpha);
               break;
               
               case COLOR_MODEL.HSV:
                  DOM.colorModel.appendChild(DOM.hsvInputs);
                  DOM.hsvInputs.cp_setValue(hsva.hue, hsva.saturate, hsva.value, hsva.alpha);
               break;

               case COLOR_MODEL.HSL:
                  let hsl = _colorConverter.HSVtoHSL(hsva.hue, hsva.saturate, hsva.value);
                  DOM.colorModel.appendChild(DOM.hslInputs);
                  DOM.hslInputs.cp_setValue(hsl.h, hsl.s, hsl.l, hsva.alpha);
               break;

               case COLOR_MODEL.HEX:
                  let hex = _colorConverter.HSVtoHEX(hsva.hue, hsva.saturate, hsva.value);
                  if(hsva.alpha < 1){
                     let alpha = Math.round(hsva.alpha * 255).toString(16);
                     alpha = (alpha.length < 2) ? `0${alpha}` : alpha;
                     hex += alpha;
                  }
                  DOM.colorModel.appendChild(DOM.hexInputs);
                  DOM.hexInputs.cp_setValue(hex);
               break;
            }
         },

         /**
          * Apply color
          */
         applyColor() {
            this.updateViewColors();
            this.updateViewControls();
            this.updateColorModelInput();
         },

         updateViewColors() {
            let hsl = _colorConverter.HSVtoHSL(hsva.hue, hsva.saturate, hsva.value);

            let paletteBGColor = `hsl(${hsl.h}deg 100% 50% / 1)`;
            DOM.palette.style.backgroundImage = `linear-gradient(180deg, transparent 0%, rgba(0,0,0,1) 100%), linear-gradient(90deg, rgba(255,255,255,1) 0%, ${paletteBGColor} 100%)`;
            
            let previewRGBColor = `hsl(${hsl.h}deg ${hsl.s}% ${hsl.l}% / ${hsva.alpha})`;
            let opacityRGBColor = `hsl(${hsl.h}deg ${hsl.s}% ${hsl.l}%)`;
            DOM.colorPreview.style.setProperty('background-color', previewRGBColor);
            DOM.opacityColor.style.setProperty('background-image', `linear-gradient(90deg, transparent, ${opacityRGBColor})`);
         },

         updateViewControls() {
            this.updateHueThumbControl();
            this.updateOpacityThumbControl();
            this.updateCursorPalette();
         },

         updateHueThumbControl() {
            let hueThumbHalfWidth = DOM.hueSliderThumb.offsetWidth / 2;
            let positionHueThumb = ((hsva.hue / 360) * DOM.hueSliderWrapper.offsetWidth) - hueThumbHalfWidth;

            DOM.hueSliderThumb.style.setProperty("transform", `translate(${positionHueThumb}px, -50%)`);
         },

         updateOpacityThumbControl() {
            let opacityThumbHalfWidth = DOM.opacitySliderThumb.offsetWidth / 2;
            let positionOpacityThumb = (hsva.alpha * DOM.opacitySliderWrapper.offsetWidth) - opacityThumbHalfWidth;

            DOM.opacitySliderThumb.style.setProperty("transform", `translate(${positionOpacityThumb}px, -50%)`);
         },

         updateCursorPalette() {
            let xPosition = ((hsva.saturate / 100) * DOM.paletteWrapper.offsetWidth);
            let yPosition = DOM.paletteWrapper.offsetHeight - ((hsva.value / 100) * DOM.paletteWrapper.offsetHeight);

            DOM.cursor.style.setProperty("transform", `translate(${xPosition}px, ${yPosition}px)`);
         },

         updateColorModelInput() {
            switch (currentColorModel) {
               case COLOR_MODEL.RGB: {
                  let rgb = _colorConverter.HSVtoRGB(hsva.hue, hsva.saturate, hsva.value);
                  DOM.rgbInputs.cp_setValue(rgb.r, rgb.g, rgb.b, hsva.alpha);
               }
               break;

               case COLOR_MODEL.HSV: {
                  DOM.hsvInputs.cp_setValue(hsva.hue, hsva.saturate, hsva.value, hsva.alpha);
               }
               break;

               case COLOR_MODEL.HSL: {
                  let hsl = _colorConverter.HSVtoHSL(hsva.hue, hsva.saturate, hsva.value);
                  DOM.hslInputs.cp_setValue(hsl.h, hsl.s, hsl.l, hsva.alpha);
               }
               break;

               case COLOR_MODEL.HEX: {
                  let previewHEXColor = _colorConverter.HSVtoHEX(hsva.hue, hsva.saturate, hsva.value);
                  if(hsva.alpha < 1){
                     let alpha = Math.round(hsva.alpha * 255).toString(16);
                     alpha = (alpha.length < 2) ? `0${alpha}` : alpha;
                     previewHEXColor += alpha;
                  }
                  DOM.hexInputs.cp_setValue(previewHEXColor);
               }
               break;
            }
         },

         /**
          * Calculate the value for HSV color from the distance between the cursor Y axis and the height of palette color
          * @param {number} yAxis 
          * 
          * @returns {number} value
          */
         calculateValue(yAxis) {
            let paletteHeight = DOM.palette.offsetHeight;

            return Math.round(((paletteHeight - yAxis) / paletteHeight) * 100);
         },

         /**
          * Calculate the saturate for HSV color from the distance between the cursor X axis and the width of palette color
          * @param {number} xAxis
          * 
          * @returns {number} saturate
          */
         calculateSaturate(xAxis) {
            let paletteWidth = DOM.palette.offsetWidth;

            return Math.round((xAxis / paletteWidth) * 100);
         }
      }

      /**
       * GUI builder
       */
      const _guiBuilder = {
         /**
          * Initialize the GUI
          */
         initGUI() {
            // DOM declaration
            let cp_overlayContainer = document.createElement("div");
            let cp_overlayBackdrop = document.createElement("div");
            let cp_overlayWrapper = document.createElement("div");
            let colorPicker = document.createElement("div");
            let cp_Wrapper = document.createElement("div");
            let cp_PaletteWrapper = document.createElement("div");
            let cp_Palette = document.createElement("div");
            let cp_Cursor = document.createElement("div");
            let cp_ColorSetting = document.createElement("div");
            let cp_ColorPreviewWrapper = document.createElement("div");
            let cp_ColorPreview = document.createElement("div");
            let cp_Sliders = document.createElement("div");
            let cp_HueSliderWrapper = document.createElement("div");
            let cp_HueSlider = document.createElement("div");
            let cp_HueSliderThumb = document.createElement("div");
            let cp_OpacitySliderWrapper = document.createElement("div");
            let cp_OpacitySlider = document.createElement("div");
            let cp_OpacityColor = document.createElement("div");
            let cp_OpacitySliderThumb = document.createElement("div");
            let cp_ColorModelWrapper = document.createElement("div");
            let cp_ColorModel = document.createElement("div");
            let cp_colorModelArrow = document.createElement("span");
            cp_colorModelArrow.innerHTML = '<svg width="12" height="12" viewBox="-285 408.9 24 24"><path d="M-285,417l4-4.1l8,8l8-8l4,4.1l-12,11.9L-285,417z"/></svg>';
            let cp_SelectColorModelOverlayWrapper = document.createElement("div");
            let cp_SelectColorModelOverlay = document.createElement("div");
            let cp_SelectColorModel = _guiBuilder.buildColorModelSelectDOM();
            let cp_rgbInputs = _guiBuilder.buildRGBInputsDOM();
            let cp_hsvInputs = _guiBuilder.buildHSVInputsDOM();
            let cp_hslInputs = _guiBuilder.buildHSLInputsDOM();
            let cp_hexInputs = _guiBuilder.buildHEXInputsDOM();
            
            // Add class names
            cp_overlayContainer.classList.add("cp-overlay-container");
            cp_overlayBackdrop.classList.add("cp-overlay-backdrop");
            cp_overlayWrapper.classList.add("cp-overlay-wrapper");
            colorPicker.classList.add("color-picker");
            cp_Wrapper.classList.add("cp-wrapper");
            cp_PaletteWrapper.classList.add("cp-palette-wrapper");
            cp_Palette.classList.add("cp-palette");
            cp_Cursor.classList.add("cp-cursor");
            cp_ColorSetting.classList.add("cp-color-setting");
            cp_ColorPreviewWrapper.classList.add("cp-color-preview-wrapper");
            cp_ColorPreview.classList.add("cp-color-preview");
            cp_Sliders.classList.add("cp-sliders");
            cp_HueSliderWrapper.classList.add("cp-hue-slider-wrapper");
            cp_HueSlider.classList.add("cp-hue-slider");
            cp_HueSliderThumb.classList.add("cp-hue-slider-thumb");
            cp_OpacitySliderWrapper.classList.add("cp-opacity-slider-wrapper");
            cp_OpacitySlider.classList.add("cp-opacity-slider");
            cp_OpacityColor.classList.add("cp-opacity-color");
            cp_OpacitySliderThumb.classList.add("cp-opacity-slider-thumb");
            cp_ColorModelWrapper.classList.add("cp-color-model-wrapper");
            cp_ColorModel.classList.add("cp-color-model");
            cp_colorModelArrow.classList.add("cp-color-model-arrow");
            cp_SelectColorModelOverlayWrapper.classList.add("cp-select-color-model-overlay-wrapper");
            cp_SelectColorModelOverlay.classList.add("cp-select-color-model-overlay");
            
            // Append child nodes
            cp_overlayContainer.appendChild(cp_overlayBackdrop);
            cp_overlayContainer.appendChild(cp_overlayWrapper);
            cp_overlayWrapper.appendChild(colorPicker);
            colorPicker.appendChild(cp_Wrapper);
            cp_Wrapper.appendChild(cp_PaletteWrapper);
            cp_Wrapper.appendChild(cp_ColorSetting);
            cp_PaletteWrapper.appendChild(cp_Palette);
            cp_PaletteWrapper.appendChild(cp_Cursor);
            cp_ColorSetting.appendChild(cp_ColorPreviewWrapper);
            cp_ColorSetting.appendChild(cp_Sliders);
            cp_ColorSetting.appendChild(cp_ColorModelWrapper);
            cp_ColorPreviewWrapper.appendChild(cp_ColorPreview);
            cp_Sliders.appendChild(cp_HueSliderWrapper);
            cp_Sliders.appendChild(cp_OpacitySliderWrapper);
            cp_HueSliderWrapper.appendChild(cp_HueSlider);
            cp_HueSliderWrapper.appendChild(cp_HueSliderThumb);
            cp_OpacitySliderWrapper.appendChild(cp_OpacitySlider);
            cp_OpacitySliderWrapper.appendChild(cp_OpacitySliderThumb);
            cp_OpacitySlider.appendChild(cp_OpacityColor);
            cp_ColorModelWrapper.appendChild(cp_ColorModel);
            cp_ColorModelWrapper.appendChild(cp_colorModelArrow);
            cp_SelectColorModelOverlayWrapper.appendChild(cp_SelectColorModelOverlay);
            cp_SelectColorModelOverlay.appendChild(cp_SelectColorModel);
            
            DOM.overlayContainer = cp_overlayContainer;
            DOM.overlayBackdrop = cp_overlayBackdrop;
            DOM.overlayWrapper = cp_overlayWrapper;
            DOM.orPicker = colorPicker;
            DOM.wrapper = cp_Wrapper;
            DOM.paletteWrapper = cp_PaletteWrapper;
            DOM.palette = cp_Palette;
            DOM.cursor = cp_Cursor;
            DOM.colorSetting = cp_ColorSetting;
            DOM.colorPreviewWrapper = cp_ColorPreviewWrapper;
            DOM.colorPreview = cp_ColorPreview;
            DOM.sliders = cp_Sliders;
            DOM.hueSliderWrapper = cp_HueSliderWrapper;
            DOM.hueSlider = cp_HueSlider;
            DOM.hueSliderThumb = cp_HueSliderThumb;
            DOM.opacitySliderWrapper = cp_OpacitySliderWrapper;
            DOM.opacitySlider = cp_OpacitySlider;
            DOM.opacityColor = cp_OpacityColor;
            DOM.opacitySliderThumb = cp_OpacitySliderThumb;
            DOM.colorModelWrapper = cp_ColorModelWrapper;
            DOM.colorModel = cp_ColorModel;
            DOM.colorModelArrow = cp_colorModelArrow;
            DOM.selectColorModelOverlayWrapper = cp_SelectColorModelOverlayWrapper;
            DOM.selectColorModelOverlay = cp_SelectColorModelOverlay;
            DOM.selectColorModel = cp_SelectColorModel;
            DOM.rgbInputs = cp_rgbInputs;
            DOM.hsvInputs = cp_hsvInputs;
            DOM.hslInputs = cp_hslInputs;
            DOM.hexInputs = cp_hexInputs;
         },

         /**
          * Build RGB color model input elements
          */
         buildRGBInputsDOM() {
            let cp_RgbInput = document.createElement("div");
            let redInput = document.createElement("input");
            let greenInput = document.createElement("input");
            let blueInput = document.createElement("input");
            let alphaInput = document.createElement("input");
            let redLabel = document.createElement("label");
            let greenLabel = document.createElement("label");
            let blueLabel = document.createElement("label");
            let alphaLabel = document.createElement("label");

            redInput.setAttribute("type", "text");
            greenInput.setAttribute("type", "text");
            blueInput.setAttribute("type", "text");
            alphaInput.setAttribute("type", "text");
            
            cp_RgbInput.classList.add("cp-rgb-input");
            redInput.classList.add("cp-color-input");
            greenInput.classList.add("cp-color-input");
            blueInput.classList.add("cp-color-input");
            alphaInput.classList.add("cp-color-input");
            redLabel.classList.add("cp-color-model-label");
            greenLabel.classList.add("cp-color-model-label");
            blueLabel.classList.add("cp-color-model-label");
            alphaLabel.classList.add("cp-color-model-label");

            redLabel.innerHTML = "R";
            greenLabel.innerHTML = "G";
            blueLabel.innerHTML = "B";
            alphaLabel.innerHTML = "A";

            cp_RgbInput.appendChild(redInput);
            cp_RgbInput.appendChild(greenInput);
            cp_RgbInput.appendChild(blueInput);
            cp_RgbInput.appendChild(alphaInput);
            cp_RgbInput.appendChild(redLabel);
            cp_RgbInput.appendChild(greenLabel);
            cp_RgbInput.appendChild(blueLabel);
            cp_RgbInput.appendChild(alphaLabel);

            /**
             * Set RGB color inputs values
             * @param {number} r 
             * @param {number} g 
             * @param {number} b 
             * @param {number} a 
             */
            cp_RgbInput.cp_setValue = function(r, g, b, a) {
               _rgba_.red = redInput.value = r;
               _rgba_.green = greenInput.value = g;
               _rgba_.blue = blueInput.value = b;
               alphaInput.value = a;
            };
            
            redInput.addEventListener("keydown", (event) => _eventListeners.rgbaInputKeyDown(event, "red"));
            redInput.addEventListener("keyup", (event) => _eventListeners.rgbaInputKeyUp(event, "red"));
            redInput.addEventListener("change", (event) => _eventListeners.rgbaInputChanged(event, "red"));

            greenInput.addEventListener("keydown", (event) => _eventListeners.rgbaInputKeyDown(event, "green"));
            greenInput.addEventListener("keyup", (event) => _eventListeners.rgbaInputKeyUp(event, "green"));
            greenInput.addEventListener("change", (event) => _eventListeners.rgbaInputChanged(event, "green"));

            blueInput.addEventListener("keydown", (event) => _eventListeners.rgbaInputKeyDown(event, "blue"));
            blueInput.addEventListener("keyup", (event) => _eventListeners.rgbaInputKeyUp(event, "blue"));
            blueInput.addEventListener("change", (event) => _eventListeners.rgbaInputChanged(event, "blue"));

            alphaInput.addEventListener("keydown", (event) => _eventListeners.alphaInputKeyDown(event));
            alphaInput.addEventListener("keyup", (event) => _eventListeners.alphaInputKeyUp(event));
            alphaInput.addEventListener("change", (event) => _eventListeners.alphaInputChanged(event));

            return cp_RgbInput;
         },

         /**
          * Build HSV color model input elements
          */
         buildHSVInputsDOM() {
            let cp_HSVInput = document.createElement("div");
            let hueInput = document.createElement("input");
            let saturateInput = document.createElement("input");
            let valueInput = document.createElement("input");
            let alphaInput = document.createElement("input");
            let hueLabel = document.createElement("label");
            let saturateLabel = document.createElement("label");
            let valueLabel = document.createElement("label");
            let alphaLabel = document.createElement("label");

            hueInput.setAttribute("type", "text");
            saturateInput.setAttribute("type", "text");
            valueInput.setAttribute("type", "text");
            alphaInput.setAttribute("type", "text");
            
            cp_HSVInput.classList.add("cp-hsv-input");
            hueInput.classList.add("cp-color-input");
            saturateInput.classList.add("cp-color-input");
            valueInput.classList.add("cp-color-input");
            alphaInput.classList.add("cp-color-input");
            hueLabel.classList.add("cp-color-model-label");
            saturateLabel.classList.add("cp-color-model-label");
            valueLabel.classList.add("cp-color-model-label");
            alphaLabel.classList.add("cp-color-model-label");

            hueLabel.innerHTML = "H";
            saturateLabel.innerHTML = "S";
            valueLabel.innerHTML = "V";
            alphaLabel.innerHTML = "A";

            cp_HSVInput.appendChild(hueInput);
            cp_HSVInput.appendChild(saturateInput);
            cp_HSVInput.appendChild(valueInput);
            cp_HSVInput.appendChild(alphaInput);
            cp_HSVInput.appendChild(hueLabel);
            cp_HSVInput.appendChild(saturateLabel);
            cp_HSVInput.appendChild(valueLabel);
            cp_HSVInput.appendChild(alphaLabel);

            /**
             * Set HSV color inputs values
             * @param {number} h 
             * @param {number} s 
             * @param {number} v 
             * @param {number} a 
             */
            cp_HSVInput.cp_setValue = function(h, s, v, a) {
               hueInput.value = `${h}°`;
               saturateInput.value = `${s}%`;
               valueInput.value = `${v}%`;
               alphaInput.value = a;
            };

            hueInput.addEventListener("keydown", (event) => _eventListeners.hsvaInputKeyDown(event, "hue", 360, "°"));
            hueInput.addEventListener("keyup", (event) => _eventListeners.hsvaInputKeyUp(event, "hue", 360, "°"));
            hueInput.addEventListener("change", (event) => _eventListeners.hsvaInputChanged(event, "hue", "°"));
            
            saturateInput.addEventListener("keydown", (event) => _eventListeners.hsvaInputKeyDown(event, "saturate", 100, "%"));
            saturateInput.addEventListener("keyup", (event) => _eventListeners.hsvaInputKeyUp(event, "saturate", 100, "%"));
            saturateInput.addEventListener("change", (event) => _eventListeners.hsvaInputChanged(event, "saturate", "%"));

            valueInput.addEventListener("keydown", (event) => _eventListeners.hsvaInputKeyDown(event, "value", 100, "%"));
            valueInput.addEventListener("keyup", (event) => _eventListeners.hsvaInputKeyUp(event, "value", 100, "%"));
            valueInput.addEventListener("change", (event) => _eventListeners.hsvaInputChanged(event, "value", "%"));

            alphaInput.addEventListener("keydown", (event) => _eventListeners.alphaInputKeyDown(event));
            alphaInput.addEventListener("keyup", (event) => _eventListeners.alphaInputKeyUp(event));
            alphaInput.addEventListener("change", (event) => _eventListeners.alphaInputChanged(event));

            return cp_HSVInput;
         },

         /**
          * Build HSL color model input elements
          */
         buildHSLInputsDOM() {
            let cp_HSLInput = document.createElement("div");
            let hueInput = document.createElement("input");
            let saturateInput = document.createElement("input");
            let lightnessInput = document.createElement("input");
            let alphaInput = document.createElement("input");
            let hueLabel = document.createElement("label");
            let saturateLabel = document.createElement("label");
            let lightnessLabel = document.createElement("label");
            let alphaLabel = document.createElement("label");

            hueInput.setAttribute("type", "text");
            saturateInput.setAttribute("type", "text");
            lightnessInput.setAttribute("type", "text");
            alphaInput.setAttribute("type", "text");
            
            cp_HSLInput.classList.add("cp-hsl-input");
            hueInput.classList.add("cp-color-input");
            saturateInput.classList.add("cp-color-input");
            lightnessInput.classList.add("cp-color-input");
            alphaInput.classList.add("cp-color-input");
            hueLabel.classList.add("cp-color-model-label");
            saturateLabel.classList.add("cp-color-model-label");
            lightnessLabel.classList.add("cp-color-model-label");
            alphaLabel.classList.add("cp-color-model-label");

            hueLabel.innerHTML = "H";
            saturateLabel.innerHTML = "S";
            lightnessLabel.innerHTML = "L";
            alphaLabel.innerHTML = "A";

            cp_HSLInput.appendChild(hueInput);
            cp_HSLInput.appendChild(saturateInput);
            cp_HSLInput.appendChild(lightnessInput);
            cp_HSLInput.appendChild(alphaInput);
            cp_HSLInput.appendChild(hueLabel);
            cp_HSLInput.appendChild(saturateLabel);
            cp_HSLInput.appendChild(lightnessLabel);
            cp_HSLInput.appendChild(alphaLabel);

            /**
             * Set HSL color inputs values
             * @param {number} h 
             * @param {number} s 
             * @param {number} l 
             * @param {number} a 
             */
            cp_HSLInput.cp_setValue = function(h, s, l, a) {
               hueInput.value = `${h}°`;
               saturateInput.value = `${s}%`;
               lightnessInput.value = `${l}%`;
               alphaInput.value = a;
               _hsla_.hue = h;
               _hsla_.saturate = s;
               _hsla_.lightness = l;
            };


            hueInput.addEventListener("keydown", (event) => _eventListeners.hslaInputKeyDown(event, "hue", 360, "°"));
            hueInput.addEventListener("keyup", (event) => _eventListeners.hslaInputKeyUp(event, "hue", 360, "°"));
            hueInput.addEventListener("change", (event) => _eventListeners.hslaInputChanged(event, "hue", "°"));
            
            saturateInput.addEventListener("keydown", (event) => _eventListeners.hslaInputKeyDown(event, "saturate", 100, "%"));
            saturateInput.addEventListener("keyup", (event) => _eventListeners.hslaInputKeyUp(event, "saturate", 100, "%"));
            saturateInput.addEventListener("change", (event) => _eventListeners.hslaInputChanged(event, "saturate", "%"));

            lightnessInput.addEventListener("keydown", (event) => _eventListeners.hslaInputKeyDown(event, "lightness", 100, "%"));
            lightnessInput.addEventListener("keyup", (event) => _eventListeners.hslaInputKeyUp(event, "lightness", 100, "%"));
            lightnessInput.addEventListener("change", (event) => _eventListeners.hslaInputChanged(event, "lightness", "%"));

            alphaInput.addEventListener("keydown", (event) => _eventListeners.alphaInputKeyDown(event));
            alphaInput.addEventListener("keyup", (event) => _eventListeners.alphaInputKeyUp(event));
            alphaInput.addEventListener("change", (event) => _eventListeners.alphaInputChanged(event));

            return cp_HSLInput;
         },

         /**
          * Build HEX color model input elements
          */
         buildHEXInputsDOM() {
            let cp_HEXInput = document.createElement("div");
            let hexInput = document.createElement("input");
            let hexLabel = document.createElement("label");

            hexInput.setAttribute("type", "text");
            
            cp_HEXInput.classList.add("cp-hex-input");
            hexInput.classList.add("cp-color-input");
            hexLabel.classList.add("cp-color-model-label");
            
            hexLabel.innerHTML = "HEX";
            
            cp_HEXInput.appendChild(hexInput);
            cp_HEXInput.appendChild(hexLabel);

            /**
             * Set HEX color inputs values
             * @param {string} hex 
             */
            cp_HEXInput.cp_setValue = function(hex) {
               hexInput.value = hex;
            };
            
            return cp_HEXInput;
         },

         /**
          * Build custom select input for selecting a color model
          */
         buildColorModelSelectDOM() {
            let cp_SelectColorModel = document.createElement("div");
            let cp_SelectColorModelOptionRGB = document.createElement("span");
            let cp_SelectColorModelOptionHSV = document.createElement("span");
            let cp_SelectColorModelOptionHSL = document.createElement("span");
            let cp_SelectColorModelOptionHEX = document.createElement("span");

            cp_SelectColorModel.classList.add("cp-select-color-model");
            cp_SelectColorModelOptionRGB.classList.add("cp-select-color-model-option");
            cp_SelectColorModelOptionHSV.classList.add("cp-select-color-model-option");
            cp_SelectColorModelOptionHSL.classList.add("cp-select-color-model-option");
            cp_SelectColorModelOptionHEX.classList.add("cp-select-color-model-option");

            cp_SelectColorModelOptionRGB.setAttribute("data-value", COLOR_MODEL.RGB);
            cp_SelectColorModelOptionHSV.setAttribute("data-value", COLOR_MODEL.HSV);
            cp_SelectColorModelOptionHSL.setAttribute("data-value", COLOR_MODEL.HSL);
            cp_SelectColorModelOptionHEX.setAttribute("data-value", COLOR_MODEL.HEX);

            cp_SelectColorModelOptionRGB.innerHTML = "RGB";
            cp_SelectColorModelOptionHSV.innerHTML = "HSV";
            cp_SelectColorModelOptionHSL.innerHTML = "HSL";
            cp_SelectColorModelOptionHEX.innerHTML = "HEX";

            cp_SelectColorModel.appendChild(cp_SelectColorModelOptionRGB);
            cp_SelectColorModel.appendChild(cp_SelectColorModelOptionHSV);
            cp_SelectColorModel.appendChild(cp_SelectColorModelOptionHSL);
            cp_SelectColorModel.appendChild(cp_SelectColorModelOptionHEX);

            return cp_SelectColorModel;
         }
      }

      /**
       * Color converter
       */
      const _colorConverter = {
         /**
          * Convert HSV to HSL
          * @param {number} h Hue 
          * @param {number} s Saturation 
          * @param {number} v Value 
          * 
          * @returns {object} HSL color 
          */
         HSVtoHSL(h, s, v) {
            let _saturation = s * 0.01;
            let _value = v * 0.01;
            
            let _lightness = (_value - ((_value*_saturation) / 2));
            let _saturate = NaN;
            
            if(_lightness == 0 || _lightness == 1){
               _saturate = 0;
            }
            else {
               _saturate = ((_value - _lightness) / Math.min(_lightness, 1 - _lightness)) * 100;
            }
   
            let l = Math.round(_lightness * 100);
            s = Math.round(_saturate);
            
            return { h, s, l }
         },
   
         /**
          * Convert HSV to RGB
          * @param {number} h Hue 
          * @param {number} s Saturation 
          * @param {number} v Value 
          * 
          * @returns {object} RGB color 
          */
         HSVtoRGB(h, s, v) {
            h /= 360;
            s /= 100;
            v /= 100;
   
            var r, g, b, i, f, p, q, t;
            if (arguments.length === 1) {
               s = h.s, v = h.v, h = h.h;
            }
            i = Math.floor(h * 6);
            f = h * 6 - i;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            switch (i % 6) {
               case 0: r = v, g = t, b = p; break;
               case 1: r = q, g = v, b = p; break;
               case 2: r = p, g = v, b = t; break;
               case 3: r = p, g = q, b = v; break;
               case 4: r = t, g = p, b = v; break;
               case 5: r = v, g = p, b = q; break;
            }
            return {
               r: Math.round(r * 255),
               g: Math.round(g * 255),
               b: Math.round(b * 255)
            };
         },
   
         /**
          * Convert HSV to HEX
          * @param {number} h Hue 
          * @param {number} s Saturation 
          * @param {number} v Value 
          * 
          * @returns {object} HEX color 
          */
         HSVtoHEX(h, s, v) {
            let rgb = this.HSVtoRGB(h, s, v);
   
            let redHex = rgb.r.toString(16);
            let greenHex = rgb.g.toString(16);
            let blueHex = rgb.b.toString(16);
   
            redHex = (redHex.length < 2) ? '0' + redHex : redHex;
            greenHex = (greenHex.length < 2) ? '0' + greenHex : greenHex;
            blueHex = (blueHex.length < 2) ? '0' + blueHex : blueHex;
   
            return `#${redHex}${greenHex}${blueHex}`;
         },
   
         /**
          * Convert RGB to HSL
          * @param {number} r Red
          * @param {number} g Green 
          * @param {number} b Blue 
          * 
          * @returns {object} HSL color 
          */
         RGBtoHSL(r, g, b) {
            r /= 255, g /= 255, b /= 255;
         
            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2;
         
            if (max == min) {
            h = s = 0; // achromatic
            } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
         
            switch (max) {
               case r: h = (g - b) / d + (g < b ? 6 : 0); break;
               case g: h = (b - r) / d + 2; break;
               case b: h = (r - g) / d + 4; break;
            }
         
            h /= 6;
            }
         
            h = Math.round(h * 100);
            s = Math.round(s * 100);
            l = Math.round(l * 100);
   
            return { h, s, l };
         },

         /**
          * Convert RGB to HSV
          * @param {number} r Red 
          * @param {number} g Green 
          * @param {number} b Blue 
          * 
          * @returns {object} HSV color 
          */ 
         RGBtoHSV(r, g, b) {
            r /= 255, g /= 255, b /= 255;
          
            let max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, v = max;
          
            let d = max - min;
            s = max == 0 ? 0 : d / max;
          
            if (max == min) {
              h = 0; // achromatic
            } else {
              switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
              }
          
              h /= 6;
            }
          
            h = Math.round(h * 360);
            s = Math.round(s * 100);
            v = Math.round(v * 100);

            return {
               h,
               s,
               v
            };
         },

         /**
          * Convert HSL to HSV
          * @param {number} h Hue
          * @param {number} s Saturate
          * @param {number} l Lightness 
          * 
          * @returns {object} HSV color 
          */ 
         HSLtoHSV(h, s, l) {
            const hsv1 = s * (l < 50 ? l : 100 - l) / 100;

            return {
               h,
               s: Math.round(hsv1 === 0 ? 0 : 2 * hsv1 / (l + hsv1) * 100),
               v: Math.round(l + hsv1)
            };
         }
      }

      /**
       * Event listeners
       */
      const _eventListeners = {
         /**
          * Initialize event listeners for DOM elements.
          * There are some event listeners are initialized in the _guiBuilder object.
          */
         initEvents() {
            DOM.paletteWrapper.addEventListener('mousedown', _eventListeners.cursorMouseDown);
            DOM.hueSliderWrapper.addEventListener('mousedown', _eventListeners.hueSliderThumbMouseDown);
            DOM.opacitySliderWrapper.addEventListener('mousedown', _eventListeners.opacitySliderThumbMouseDown);
            DOM.overlayBackdrop.addEventListener('click', _eventListeners.closeColorPicker);
            DOM.colorModelArrow.addEventListener('click', _eventListeners.openSelectColorModel);
            DOM.selectColorModelOverlayWrapper.addEventListener('click', _eventListeners.closeSelectColorModel);
            DOM.selectColorModel.addEventListener('click', _eventListeners.onColorModelChanged);
         },

         /**
          * Click event handler when a color model is changed
          * @param {MouseEvent} event 
          */
         onColorModelChanged(event) {
            let selectedColorModel = event.target.dataset.value;
            if(currentColorModel != selectedColorModel) {
               _helper.setColorModel(selectedColorModel);
            }
         },

         /**
          * Cursor palette color mouse down event handler
          * @param {MouseEvent} event 
          */
         cursorMouseDown(event) {
            document.addEventListener('mousemove', _eventListeners.cursorMouseMove);
            document.addEventListener('mouseup', _eventListeners.cursorMouseUp);

            _eventListeners.cursorMouseMove(event);
         },

         /**
          * Cursor palette color mouse up event handler
          */
         cursorMouseUp() {
            document.removeEventListener('mousemove', _eventListeners.cursorMouseMove);
            document.removeEventListener('mouseup', _eventListeners.cursorMouseUp);
         },

         /**
          * Cursor palette color mouse move event handler
          * @param {MouseEvent} event 
          */
         cursorMouseMove(event) {
            let paletteWrapperClientRect = DOM.paletteWrapper.getBoundingClientRect();
            let xAxis = event.clientX - paletteWrapperClientRect.left;
            let yAxis = event.clientY - paletteWrapperClientRect.top;

            if(xAxis < 0) {
               xAxis = 0;
            }
            if(xAxis > DOM.paletteWrapper.offsetWidth) {
               xAxis = DOM.paletteWrapper.offsetWidth;
            }
            if(yAxis < 0) {
               yAxis = 0;
            }
            if(yAxis > DOM.paletteWrapper.offsetHeight) {
               yAxis = DOM.paletteWrapper.offsetHeight;
            }

            DOM.cursor.style.transform = `translate(${xAxis}px, ${yAxis}px)`;

            hsva.saturate = _helper.calculateSaturate(xAxis);
            hsva.value = _helper.calculateValue(yAxis);

            _helper.updateViewColors();
            _helper.updateColorModelInput();
         },

         /**
          * Hue slider thumb mouse down event handler
          * @param {MouseEvent} event 
          */
         hueSliderThumbMouseDown(event) {
            document.addEventListener('mousemove', _eventListeners.hueSliderThumbMouseMove);
            document.addEventListener('mouseup', _eventListeners.hueSliderThumbMouseUp);

            _eventListeners.hueSliderThumbMouseMove(event);
         },

         /**
          * Hue slider thumb mouse up event handler
          */
         hueSliderThumbMouseUp() {
            document.removeEventListener('mousemove', _eventListeners.hueSliderThumbMouseMove);
            document.removeEventListener('mouseup', _eventListeners.hueSliderThumbMouseUp);
         },

         /**
          * Hue slider thumb mouse move event handler
          * @param {MouseEvent} event 
          */
         hueSliderThumbMouseMove(event) {
            let hueSliderRect = DOM.hueSlider.getBoundingClientRect();
            let hueSliderThumbHalfWidth = DOM.hueSliderThumb.offsetWidth / 2;
            let value = event.clientX - hueSliderRect.left;
            let thumbX = value - hueSliderThumbHalfWidth;
            let minPosition = (hueSliderThumbHalfWidth * -1);
            let maxPosition = (hueSliderRect.width - hueSliderThumbHalfWidth);

            if(thumbX < minPosition) {
               thumbX = minPosition;
            }
            if(thumbX > maxPosition) {
               thumbX = maxPosition;
            }

            hsva.hue = Math.round(((thumbX + hueSliderThumbHalfWidth) / hueSliderRect.width) * 360);
            DOM.hueSliderThumb.style.transform = `translate(${thumbX}px, -50%)`;

            _helper.updateViewColors();
            _helper.updateColorModelInput();
         },

         /**
          * Opacity slider thumb mouse down event handler
          * @param {MouseEvent} event 
          */
         opacitySliderThumbMouseDown(event) {
            document.addEventListener('mousemove', _eventListeners.opacitySliderThumbMouseMove);
            document.addEventListener('mouseup', _eventListeners.opacitySliderThumbMouseUp);

            _eventListeners.opacitySliderThumbMouseMove(event);
         },

         /**
          * Opacity slider thumb mouse up event handler
          */
         opacitySliderThumbMouseUp() {
            document.removeEventListener('mousemove', _eventListeners.opacitySliderThumbMouseMove);
            document.removeEventListener('mouseup', _eventListeners.opacitySliderThumbMouseUp);
         },

         /**
          * Opacity slider thumb mouse move event handler
          * @param {MouseEvent} event 
          */
         opacitySliderThumbMouseMove(event) {
            let opacitySliderRect = DOM.opacitySliderWrapper.getBoundingClientRect();
            let opacitySliderThumbHalfWidth = DOM.opacitySliderThumb.offsetWidth / 2;
            let value = event.clientX - opacitySliderRect.left;
            let thumbX = value - opacitySliderThumbHalfWidth;
            let minPosition = (opacitySliderThumbHalfWidth * -1);
            let maxPosition = (opacitySliderRect.width - opacitySliderThumbHalfWidth);
            
            if(thumbX < minPosition) {
               thumbX = minPosition;
            }
            if(thumbX > maxPosition) {
               thumbX = maxPosition;
            }

            hsva.alpha = parseFloat(((thumbX + opacitySliderThumbHalfWidth) / opacitySliderRect.width).toFixed(2));
            DOM.opacitySliderThumb.style.transform = `translate(${thumbX}px, -50%)`;
               
            _helper.updateViewColors();
            _helper.updateColorModelInput();
         },

         /**
          * Open color picker
          */
         openColorPicker() {
            _helper.setColorModel(COLOR_MODEL.HSL);
            document.body.appendChild(DOM.overlayContainer);
            _helper.applyColor();
         },

         /**
          * Close color picker
          */
         closeColorPicker() {
            document.body.removeChild(DOM.overlayContainer);

            let result = {
               hue: hsva.hue,
               saturate: hsva.saturate,
               value: hsva.value,
               alpha: hsva.alpha
            };
            
            return result;
         },

         /**
          * Open the select color model input
          */
         openSelectColorModel() {
            DOM.overlayContainer.appendChild(DOM.selectColorModelOverlayWrapper);
         },

         /**
          * Close the select color model input
          */
         closeSelectColorModel() {
            DOM.overlayContainer.removeChild(DOM.selectColorModelOverlayWrapper);
         },

         rgbaInputKeyDown(event, color) {
            let target = event.target;
            let pressedKey = event.key;

            if(/[0-9]|(ArrowUp)|(ArrowDown)|(ArrowRight)|(ArrowLeft)|(Backspace)|(Delete)|(Tab)|(Control)/.test(pressedKey)) {
               switch (pressedKey) {
                  case "ArrowUp":
                     if(_rgba_[color] < 255) {
                        target.value = ++_rgba_[color];
                        let hsv = _colorConverter.RGBtoHSV(_rgba_.red, _rgba_.green, _rgba_.blue);
                        hsva.hue = hsv.h;
                        hsva.saturate = hsv.s;
                        hsva.value = hsv.v;
                        _helper.updateViewColors();
                        _helper.updateViewControls();
                     }
                  break;
                  
                  case "ArrowDown":
                     if(_rgba_[color] > 0) {
                        target.value = --_rgba_[color];
                        let hsv = _colorConverter.RGBtoHSV(_rgba_.red, _rgba_.green, _rgba_.blue);
                        hsva.hue = hsv.h;
                        hsva.saturate = hsv.s;
                        hsva.value = hsv.v;
                        _helper.updateViewColors();
                        _helper.updateViewControls();
                     }
                  break;
               }
            }
            else {
               event.preventDefault();
            }
         },

         rgbaInputKeyUp(event, color) {
            let target = event.target;
            if(/[0-9]|(Backspace)|(Delete)/.test(event.key) && target.value !== null && target.value !== undefined && target.value !== "") {
               let value = parseInt(target.value);
               if(isNaN(value) || value < 0 || value > 255) {
                  target.value = _rgba_[color];
               }
               else {
                  _rgba_[color] = value;
                  let hsv = _colorConverter.RGBtoHSV(_rgba_.red, _rgba_.green, _rgba_.blue);
                  hsva.hue = hsv.h;
                  hsva.saturate = hsv.s;
                  hsva.value = hsv.v;
                  _helper.updateViewColors();
                  _helper.updateViewControls();
               }
            }
         },

         rgbaInputChanged(event, color) {
            let target = event.target;
            target.value = _rgba_[color];
         },

         alphaInputKeyDown(event) {
            let target = event.target;
            let pressedKey = event.key;

            if(/[0-9]|(\.)|(ArrowUp)|(ArrowDown)|(ArrowRight)|(ArrowLeft)|(Backspace)|(Delete)|(Tab)|(Control)/.test(pressedKey)) {
               switch (pressedKey) {
                  case "ArrowUp":
                     if(hsva.alpha < 1) {
                        let alphaValue = parseFloat((hsva.alpha + 0.01).toFixed(2));
                        if(alphaValue > 1){
                           alphaValue = 1;
                        }
                        target.value = hsva.alpha = alphaValue;
                        _helper.updateViewColors();
                        _helper.updateOpacityThumbControl();
                     }
                  break;
                  
                  case "ArrowDown":
                     if(hsva.alpha > 0) {
                        let alphaValue = parseFloat((hsva.alpha - 0.01).toFixed(2));
                        if(alphaValue < 0){
                           alphaValue = 0;
                        }
                        target.value = hsva.alpha = alphaValue;
                        _helper.updateViewColors();
                        _helper.updateOpacityThumbControl();
                     }
                  break;
                  
                  case ".":
                     if(/(\.)/.test(target.value)) {
                        event.preventDefault();
                     }
                  break;
               }
            }
            else {
               event.preventDefault();
            }
         },

         alphaInputKeyUp(event) {
            let target = event.target;
            if(/[0-9]|(\.)|(Backspace)|(Delete)/.test(event.key) && target.value !== null && target.value !== undefined && target.value !== "") {
               let value = parseFloat(target.value);
               if(isNaN(value) || value < 0 || value > 1) {
                  target.value = hsva.alpha;
               }
               else {
                  hsva.alpha = value;
                  _helper.updateViewColors();
                  _helper.updateOpacityThumbControl();
               }
            }
         },

         alphaInputChanged(event) {
            let target = event.target;
            target.value = hsva.alpha;
         },

         hsvaInputKeyDown(event, color, maxValue, suffix) {
            let target = event.target;
            let pressedKey = event.key;

            if(/[0-9]|(ArrowUp)|(ArrowDown)|(ArrowRight)|(ArrowLeft)|(Backspace)|(Delete)|(Tab)|(Control)/.test(pressedKey)) {
               switch (pressedKey) {
                  case "ArrowUp":
                     if(hsva[color] < maxValue) {
                        target.value = `${++hsva[color]}${suffix}`;
                        _helper.updateViewColors();
                        _helper.updateViewControls();
                     }
                  break;
                  
                  case "ArrowDown":
                     if(hsva[color] > 0) {
                        target.value = `${--hsva[color]}${suffix}`;
                        _helper.updateViewColors();
                        _helper.updateViewControls();
                     }
                  break;
               }
            }
            else {
               event.preventDefault();
            }
         },

         hsvaInputKeyUp(event, color, maxValue, suffix) {
            let target = event.target;
            if(/[0-9]|(Backspace)|(Delete)/.test(event.key) && target.value !== null && target.value !== undefined && target.value !== "" && target.value !== suffix) {
               let value = parseInt(target.value);
               let pattern = new RegExp(`^[0-9]{0,3}${suffix}$`);
               if(isNaN(value) || !pattern.test(target.value) || value < 0 || value > maxValue) {
                  target.value = `${hsva[color]}${suffix}`;
               }
               else {
                  hsva[color] = value;
                  _helper.updateViewColors();
                  _helper.updateViewControls();
               }
            }
         },

         hsvaInputChanged(event, color, suffix) {
            let target = event.target;
            target.value = `${hsva[color]}${suffix}`;
         },
         
         hslaInputKeyDown(event, color, maxValue, suffix) {
            let target = event.target;
            let pressedKey = event.key;

            if(/[0-9]|(ArrowUp)|(ArrowDown)|(ArrowRight)|(ArrowLeft)|(Backspace)|(Delete)|(Tab)|(Control)/.test(pressedKey)) {
               switch (pressedKey) {
                  case "ArrowUp":
                     if(_hsla_[color] < maxValue) {
                        target.value = `${++_hsla_[color]}${suffix}`;
                        let hsv = _colorConverter.HSLtoHSV(_hsla_.hue, _hsla_.saturate, _hsla_.lightness);
                        hsva.hue = hsv.h;
                        hsva.saturate = hsv.s;
                        hsva.value = hsv.v;
                        _helper.updateViewColors();
                        _helper.updateViewControls();
                     }
                  break;
                  
                  case "ArrowDown":
                     if(_hsla_[color] > 0) {
                        target.value = `${--_hsla_[color]}${suffix}`;
                        let hsv = _colorConverter.HSLtoHSV(_hsla_.hue, _hsla_.saturate, _hsla_.lightness);
                        hsva.hue = hsv.h;
                        hsva.saturate = hsv.s;
                        hsva.value = hsv.v;
                        _helper.updateViewColors();
                        _helper.updateViewControls();
                     }
                  break;
               }
            }
            else {
               event.preventDefault();
            }
         },

         hslaInputKeyUp(event, color, maxValue, suffix) {
            let target = event.target;
            if(/[0-9]|(Backspace)|(Delete)/.test(event.key) && target.value !== null && target.value !== undefined && target.value !== "" && target.value !== suffix) {
               let value = parseInt(target.value);
               let pattern = new RegExp(`^[0-9]{0,3}${suffix}$`);
               if(isNaN(value) || !pattern.test(target.value) || value < 0 || value > maxValue) {
                  target.value = `${_hsla_[color]}${suffix}`;
               }
               else {
                  _hsla_[color] = value;
                  let hsv = _colorConverter.HSLtoHSV(_hsla_.hue, _hsla_.saturate, _hsla_.lightness);
                  hsva.hue = hsv.h;
                  hsva.saturate = hsv.s;
                  hsva.value = hsv.v;
                  _helper.updateViewColors();
                  _helper.updateViewControls();
               }
            }
         },

         hslaInputChanged(event, color, suffix) {
            let target = event.target;
            target.value = `${_hsla_[color]}${suffix}`;
         },

      }

      window.ColorPicker = {
         // Properties
         COLOR_MODEL,
         
         // Methods
         init,
         selectedColorModel,
         openColorPicker: _eventListeners.openColorPicker,
         closeColorPicker: _eventListeners.closeColorPicker
      }
   }
})(window);