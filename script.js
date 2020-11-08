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
      const _hex_ = {
         red: "FF",
         green: "00",
         blue: "00",
         alpha: "FF",

         toString() {
            if(this.alpha.toUpperCase() == "FF"){
               return `#${this.red}${this.green}${this.blue}`;
            }
            else {
               return `#${this.red}${this.green}${this.blue}${this.alpha}`;
            }
         }
      }
      let currentColorModel = null;
      let _user_options_ = null;

      /**
       * Initialize the color picker library
       */
      function init({
         onOpened, onClosed
      } = _options.defaultOptions) {
         _user_options_ = {
            onOpened, onClosed
         }
         _guiBuilder.initGUI();
         _eventListeners.initEvents();
         
         _eventListeners.openColorPicker();
      }

      /**
       * Get the current selected color model
       */
      function getSelectedColorModel() {
         return currentColorModel;
      }

      /**
       * Default Options
       */
      const _options = {
         defaultOptions: {
            onOpened: function() {},
            onClosed: function(color) { return color; },
         },

         /**
          * Get option
          * @param {string} optionName 
          */
         getOption(optionName) {
            let option = null;

            if(_user_options_ == null || (_user_options_ != null && _user_options_[optionName] == undefined)) {
               option = this.defaultOptions[optionName];
            }
            else {
               option = _user_options_[optionName];
            }

            return option;
         }
      }

      /**
       * Some helper functions
       */
      const _helper = {
         /**
          * Set a color model
          * @param {COLOR_MODEL} colorModel 
          */
         setColorModelInput(colorModel) {
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
            this.updateColorModelInput();
            this.updateViewColors();
            this.updateViewControls();
         },

         updateViewColors() {
            let paletteBGColor = `hsl(${hsva.hue}deg 100% 50% / 1)`;
            DOM.palette.style.backgroundImage = `linear-gradient(180deg, transparent 0%, rgba(0,0,0,1) 100%), linear-gradient(90deg, rgba(255,255,255,1) 0%, ${paletteBGColor} 100%)`;
            
            let hsl = _colorConverter.HSVtoHSL(hsva.hue, hsva.saturate, hsva.value);
            let previewColor = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
            DOM.opacityColor.style.setProperty('background-image', `linear-gradient(90deg, transparent, ${previewColor})`);
            DOM.circleColorPreview.setAttribute("fill", previewColor);
            DOM.circleColorPreview.setAttribute("fill-opacity", hsva.alpha);
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

            return ((paletteHeight - yAxis) / paletteHeight) * 100;
         },

         /**
          * Calculate the saturate for HSV color from the distance between the cursor X axis and the width of palette color
          * @param {number} xAxis
          * 
          * @returns {number} saturate
          */
         calculateSaturate(xAxis) {
            let paletteWidth = DOM.palette.offsetWidth;

            return (xAxis / paletteWidth) * 100;
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

            // Add class names
            cp_overlayContainer.classList.add("cp-overlay-container");
            cp_overlayBackdrop.classList.add("cp-overlay-backdrop");
            cp_overlayWrapper.classList.add("cp-overlay-wrapper");
            colorPicker.classList.add("color-picker");
            cp_Wrapper.classList.add("cp-wrapper");

            // build palette
            let paletteSection = this.buildPaletteColor();
            // build color settings
            let colorSettings = this.buildColorSettings();
            // build style element
            let styleElement = this.buildStyleElement();

            // Append child nodes
            cp_overlayContainer.appendChild(cp_overlayBackdrop);
            cp_overlayContainer.appendChild(cp_overlayWrapper);
            cp_overlayContainer.appendChild(styleElement);
            cp_overlayWrapper.appendChild(colorPicker);
            colorPicker.appendChild(cp_Wrapper);
            cp_Wrapper.appendChild(paletteSection);
            cp_Wrapper.appendChild(colorSettings);
            
            DOM.overlayContainer = cp_overlayContainer;
            DOM.overlayBackdrop = cp_overlayBackdrop;
            DOM.overlayWrapper = cp_overlayWrapper;
            DOM.wrapper = cp_Wrapper;
            
         },

         /**
          * Build palette color section
          */
         buildPaletteColor() {
            let paletteWrapper = document.createElement("div");
            let palette = document.createElement("div");
            let cursor = document.createElement("div");
            
            paletteWrapper.classList.add("cp-palette-wrapper");
            palette.classList.add("cp-palette");
            cursor.classList.add("cp-cursor");
            
            paletteWrapper.appendChild(palette);
            paletteWrapper.appendChild(cursor);

            DOM.paletteWrapper = paletteWrapper;
            DOM.palette = palette;
            DOM.cursor = cursor;

            return DOM.paletteWrapper;
         },

         /**
          * Build color settings section
          */
         buildColorSettings() {
            let colorSettings = document.createElement("div");
            colorSettings.classList.add("cp-color-settings");
            
            let ddd = document.createElement("span");
            ddd.innerHTML = '<svg viewBox="-201 290.3 16 16" ><path d="M-199.1,301.3v-6.7c0-2,1.6-3.7,3.7-3.7h4.3c0.8,0,1.5,0.5,1.7,1.2l-5.4,0l-0.2,0c-1.6,0.1-2.9,1.4-2.9,3.1 l0,7.9C-198.6,302.8-199.1,302.1-199.1,301.3z M-194.8,305.6c-1,0-1.8-0.8-1.8-1.8v-8.6c0-1,0.8-1.8,1.8-1.8h6.1 c1,0,1.8,0.8,1.8,1.8v8.6c0,1-0.8,1.8-1.8,1.8H-194.8z M-188.1,303.8v-8.6c0-0.3-0.3-0.6-0.6-0.6h-6.1c-0.3,0-0.6,0.3-0.6,0.6v8.6 c0,0.3,0.3,0.6,0.6,0.6h6.1C-188.4,304.4-188.1,304.1-188.1,303.8z"/></svg>';

            // Build clipboard color
            let clipboardColor = this.buildClipboardColor();
            // Build SVG color preview
            let svgColorPreview = this.buildSVGColorPreview();
            // Build sliders
            let sliders = this.buildColorSliders();
            // Build color model inputs
            let colorModelInputs = this.buildColorModelInputs();
            
            colorSettings.appendChild(clipboardColor);
            colorSettings.appendChild(svgColorPreview);
            colorSettings.appendChild(sliders);
            colorSettings.appendChild(colorModelInputs);
            
            return colorSettings;
         },

         /**
          * Build slider wrapper that wraps the hue and opacity sliders
          */
         buildColorSliders() {
            let sliders = document.createElement("div");

            sliders.classList.add("cp-sliders");
            
            // Build hue slider
            let hueSliderWrapper = this.buildHueSlider();
            // Build hue slider
            let opacitySliderWrapper = this.buildOpacitySlider();

            sliders.appendChild(hueSliderWrapper);
            sliders.appendChild(opacitySliderWrapper);

            return sliders;
         },

         /**
          * Build hue slider
          */
         buildHueSlider() {
            let hueSliderWrapper = document.createElement("div");
            let hueSlider = document.createElement("div");
            let hueSliderThumb = document.createElement("div");

            hueSliderWrapper.classList.add("cp-hue-slider-wrapper");
            hueSlider.classList.add("cp-hue-slider");
            hueSliderThumb.classList.add("cp-hue-slider-thumb");

            hueSliderWrapper.appendChild(hueSlider);
            hueSliderWrapper.appendChild(hueSliderThumb);

            DOM.hueSliderWrapper = hueSliderWrapper;
            DOM.hueSlider = hueSlider;
            DOM.hueSliderThumb = hueSliderThumb;

            return hueSliderWrapper;
         },

         /**
          * Build opacity slider
          */
         buildOpacitySlider() {
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

            DOM.opacitySliderWrapper = opacitySliderWrapper;
            DOM.opacityColor = opacityColor;
            DOM.opacitySliderThumb = opacitySliderThumb;

            return opacitySliderWrapper;
         },

         /**
          * Build color models inputs
          */
         buildColorModelInputs() {
            let colorModelWrapper = document.createElement("div");
            let colorModel = document.createElement("div");
            let colorModelArrow = document.createElement("span");
            colorModelArrow.style.setProperty("background-image", `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='-203 292.3 12 12'%3E%3Cpath fill='%23bcbcbc' d='M-200.5,300.9l1.2-1.2l2.3,2.3l2.3-2.3l1.2,1.2l-3.5,3.4L-200.5,300.9z'%3E%3C/path%3E%3Cpath fill='%23bcbcbc' d='M-197,292.3l3.5,3.4l-1.2,1.2l-2.3-2.3l-2.3,2.3l-1.2-1.2L-197,292.3z'%3E%3C/path%3E%3C/svg%3E")`);
            let hiddenClipboardInput = this.buildHiddenClipboardInput();

            let rgbInputs = _guiBuilder.buildRGBInputsDOM();
            let hsvInputs = _guiBuilder.buildHSVInputsDOM();
            let hslInputs = _guiBuilder.buildHSLInputsDOM();
            let hexInputs = _guiBuilder.buildHEXInputsDOM();

            colorModelWrapper.classList.add("cp-color-model-wrapper");
            colorModel.classList.add("cp-color-model");
            colorModelArrow.classList.add("cp-color-model-arrow");
            
            colorModelWrapper.appendChild(colorModel);
            colorModelWrapper.appendChild(colorModelArrow);
            colorModelWrapper.appendChild(hiddenClipboardInput);

            DOM.colorModel = colorModel;
            DOM.colorModelArrow = colorModelArrow;
            DOM.rgbInputs = rgbInputs;
            DOM.hsvInputs = hsvInputs;
            DOM.hslInputs = hslInputs;
            DOM.hexInputs = hexInputs;

            return colorModelWrapper;
         },

         buildHiddenClipboardInput() {
            let hiddenClipboardInput = document.createElement("input");
            hiddenClipboardInput.classList.add("cp-clipboard-color-input");
            DOM.hiddenClipboardInput = hiddenClipboardInput;

            return hiddenClipboardInput;
         },

         /**
          * Build clipboard color icon for coping the color
          */
         buildClipboardColor() {
            let clipboardColor = document.createElement("span");
            clipboardColor.classList.add("cp-clipboard-color");
            let copyClipboardIcon = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-201 290.3 16 16' width='16' height='16'%3E%3Cpath d='M-199.1,301.3v-6.7c0-2,1.6-3.7,3.7-3.7h4.3c0.8,0,1.5,0.5,1.7,1.2l-5.4,0l-0.2,0c-1.6,0.1-2.9,1.4-2.9,3.1 l0,7.9C-198.6,302.8-199.1,302.1-199.1,301.3z M-194.8,305.6c-1,0-1.8-0.8-1.8-1.8v-8.6c0-1,0.8-1.8,1.8-1.8h6.1 c1,0,1.8,0.8,1.8,1.8v8.6c0,1-0.8,1.8-1.8,1.8H-194.8z M-188.1,303.8v-8.6c0-0.3-0.3-0.6-0.6-0.6h-6.1c-0.3,0-0.6,0.3-0.6,0.6v8.6 c0,0.3,0.3,0.6,0.6,0.6h6.1C-188.4,304.4-188.1,304.1-188.1,303.8z' fill='%23bcbcbc'%3E%3C/path%3E%3C/svg%3E")`;
            let copiedClipboardIcon = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='14' height='14'%3E%3Cpath fill='%23bcbcbc' d='M15.2,4.7c0.3-0.3,0.2-0.7-0.1-1l-0.8-0.8c-0.3-0.3-0.7-0.2-1,0.1l-6.7,7.5L2.5,6.7c-0.3-0.3-0.7-0.2-1,0.1 L0.7,7.6c-0.3,0.3-0.2,0.7,0.1,1l5.5,5c0.3,0.3,0.7,0.2,1-0.1L15.2,4.7z'/%3E%3C/svg%3E")`;
            clipboardColor.style.setProperty("background-image", copyClipboardIcon);

            DOM.clipboardColor = clipboardColor;
            DOM.copyClipboardIcon = copyClipboardIcon;
            DOM.copiedClipboardIcon = copiedClipboardIcon;

            return clipboardColor;
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
               _rgba_.red = redInput.value = Math.round(r);
               _rgba_.green = greenInput.value = Math.round(g);
               _rgba_.blue = blueInput.value = Math.round(b);
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
               hueInput.value = `${Math.round(h)}°`;
               saturateInput.value = `${Math.round(s)}%`;
               valueInput.value = `${Math.round(v)}%`;
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
               h = Math.round(h);
               s = Math.round(s);
               l = Math.round(l);
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
               let _hex = hex.split(/([A-Fa-f0-9]{2})/).filter(str=>str!=""&&str != "#");
               _hex_.red = _hex[0].toUpperCase();
               _hex_.green = _hex[1].toUpperCase();
               _hex_.blue = _hex[2].toUpperCase();
               _hex_.alpha = _hex[3] ? _hex[3].toUpperCase() : "FF";
            };
            
            hexInput.addEventListener("keydown", (event) => _eventListeners.hexInputKeyDown(event));
            hexInput.addEventListener("change", (event) => _eventListeners.hexInputChanged(event));
            
            return cp_HEXInput;
         },

         /**
          * Build the style element that contains styles
          */
         buildStyleElement() {
            let styleElement = document.createElement("style");
            // styleElement.innerHTML = '.cp-overlay-container{font-family:Roboto,sans-serif;position:fixed;top:0;left:0;width:100%;height:100%}.cp-overlay-backdrop{position:absolute;top:0;left:0;width:100%;height:100%;z-index:0}.cp-overlay-wrapper{position:absolute;z-index:1}.color-picker{display:inline-block}.cp-wrapper{box-shadow:0 0 4px #494949;border:1px solid #494949;background-color:#242424;display:inline-block;width:280px;border-radius:4px}.cp-palette-wrapper{position:relative;-moz-user-select:none;-webkit-user-select:none;user-select:none;overflow:hidden;border-top-left-radius:4px;border-top-right-radius:4px}.cp-palette{height:150px;background-image:linear-gradient(180deg,transparent 0,#000 100%),linear-gradient(90deg,#fff 0,red 100%)}.cp-cursor{position:absolute;top:-6px;left:-6px;width:10px;height:10px;border-radius:50%;border:1px solid #fff;box-shadow:0 0 0 1px #000}.cp-color-settings{display:flex;align-items:center;padding:12px 15px;flex-wrap:wrap;column-gap:18px;row-gap:15px}.cp-sliders{flex-grow:1;display:flex;row-gap:12px;flex-direction:column}.cp-hue-slider-wrapper,.cp-opacity-slider-wrapper{position:relative;-moz-user-select:none;-webkit-user-select:none;user-select:none;flex-grow:1}.cp-hue-slider,.cp-opacity-slider{width:100%;height:10px;border-radius:2px}.cp-hue-slider{background-image:linear-gradient(90deg,red,#ff0,#0f0,#0ff,#00f,#f0f,red)}.cp-opacity-slider{position:relative;background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyIDIiPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNMSwwSDJWMUgxVjBaTTAsMUgxVjJIMFYxWiIvPjxwYXRoIGZpbGw9IiNEQkRCREIiIGQ9Ik0wLDBIMVYxSDBWMFpNMSwxSDJWMkgxVjFaIi8+PC9zdmc+);background-size:8px;overflow:hidden}.cp-opacity-color{background-image:linear-gradient(90deg,transparent,red);position:absolute;width:100%;height:100%}.cp-hue-slider-thumb,.cp-opacity-slider-thumb{position:absolute;width:16px;height:16px;border-radius:50px;background-color:#272727;box-shadow:0 0 6px #777;top:50%;transform:translate(-8px,-50%)}.cp-color-preview-wrapper{width:34px;height:34px;border:1px solid gray;border-radius:50%;position:relative;overflow:hidden}.cp-color-preview-wrapper::before{content:"";position:absolute;width:100%;height:100%;background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyIDIiPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNMSwwSDJWMUgxVjBaTTAsMUgxVjJIMFYxWiIvPjxwYXRoIGZpbGw9IiNEQkRCREIiIGQ9Ik0wLDBIMVYxSDBWMFpNMSwxSDJWMkgxVjFaIi8+PC9zdmc+);background-size:8px}.cp-color-preview{position:absolute;width:100%;height:100%}.cp-color-model-wrapper{display:flex;flex-basis:100%;position:relative;align-items:center;column-gap:12px}.cp-color-model{display:flex;flex-direction:column;align-items:center;row-gap:6px;flex-grow:1}.cp-hex-input,.cp-hsl-input,.cp-hsv-input,.cp-rgb-input{display:grid;width:100%;justify-items:center;row-gap:4px}.cp-hsl-input,.cp-hsv-input,.cp-rgb-input{grid-template-columns:1fr 1fr 1fr 1fr}.cp-hex-input{grid-template-columns:1fr}.cp-color-input{font-family:inherit;height:18px;outline:0;border:1px solid #5a5a5a;background-color:#242424;padding:2px;color:#bcbcbc;font-size:12px;text-align:center;padding:2px}.cp-color-input:focus{border-color:#0e639c}.cp-hsl-input .cp-color-input,.cp-hsv-input .cp-color-input,.cp-rgb-input .cp-color-input{width:38px}.cp-hex-input .cp-color-input{width:180px}.cp-color-model-label{color:#bcbcbc;font-size:12px}.cp-color-model-arrow{cursor:pointer;position:relative}.cp-color-model-arrow::before{content:"";visibility:hidden;position:absolute;background-color:#4d4d4d;width:26px;height:26px;border-radius:50%;z-index:0;top:50%;left:50%;transform:translate(-50%,-56%)}.cp-color-model-arrow:hover::before{visibility:visible}.cp-color-model-arrow svg{position:relative;z-index:1}.cp-color-model-arrow svg path{fill:#bcbcbc}';

            return styleElement;
         },

         /**
          * Build color preview in SVG
          */
         buildSVGColorPreview() {
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

            DOM.circleColorPreview = circleColorPreview;
            return colorPreviewWrapper;
         },

         /**
          * Set copy clipboard icon
          */
         setCopyClipboardIcon() {
            DOM.clipboardColor.style.setProperty("background-image", DOM.copyClipboardIcon);
         },

         /**
          * Set check mark when color is copied
          */
         setCopiedClipboardIcon() {
            DOM.clipboardColor.style.setProperty("background-image", DOM.copiedClipboardIcon);

            setTimeout(()=>{
               _guiBuilder.setCopyClipboardIcon();
            }, 1000);
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
   
            let l = (_lightness * 100);
            s = (_saturate);
            
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
               r: (r * 255),
               g: (g * 255),
               b: (b * 255)
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
   
            return this.RGBToHex(Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b));
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
         
            h = (h * 100);
            s = (s * 100);
            l = (l * 100);
   
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
          
            h = (h * 360);
            s = (s * 100);
            v = (v * 100);

            return {
               h,
               s,
               v
            };
         },

         /**
          * Convert RGB to HEX
          * @param {number} r Red 
          * @param {number} g Green 
          * @param {number} b Blue 
          * 
          * @returns {object} HEX color 
          */
         RGBToHex(r, g, b) {
            r = r.toString(16);
            g = g.toString(16);
            b = b.toString(16);
          
            if (r.length == 1)
              r = "0" + r;
            if (g.length == 1)
              g = "0" + g;
            if (b.length == 1)
              b = "0" + b;
          
            return "#" + r + g + b;
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
               s: (hsv1 === 0 ? 0 : 2 * hsv1 / (l + hsv1) * 100),
               v: (l + hsv1)
            };
         },

         /**
          * Convert HEX to RGB color
          * @param {string} hex 
          */
         HEXtoRGBA(hex) {
            let r = 0, g = 0, b = 0, a = 0;
            
            if(/^#(([a-f0-9]){3,4}|([a-f0-9]){6}|([a-f0-9]){8})$/i.test(hex)) {
               switch (hex.length) {
                  case 4: {
                     let splitHexValues = hex.split("");
                     r = +("0x" + splitHexValues[1] + splitHexValues[1]);
                     g = +("0x" + splitHexValues[2] + splitHexValues[2]);
                     b = +("0x" + splitHexValues[3] + splitHexValues[3]);
                     a = 255;
                  } break;

                  case 5: {
                     let splitHexValues = hex.split("");
                     r = +("0x" + splitHexValues[1] + splitHexValues[1]);
                     g = +("0x" + splitHexValues[2] + splitHexValues[2]);
                     b = +("0x" + splitHexValues[3] + splitHexValues[3]);
                     a = +("0x" + splitHexValues[4] + splitHexValues[4]);
                  } break;

                  case 7: {
                     let splitHexValues = hex.split(/([a-f0-9]{2})([a-f0-9]{2})/i);
                     r = +("0x" + splitHexValues[1]);
                     g = +("0x" + splitHexValues[2]);
                     b = +("0x" + splitHexValues[3]);
                     a = 255;
                  } break;

                  case 9: {
                     let splitHexValues = hex.split(/([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/i);
                     r = +("0x" + splitHexValues[1]);
                     g = +("0x" + splitHexValues[2]);
                     b = +("0x" + splitHexValues[3]);
                     a = +("0x" + splitHexValues[4]);
                  } break;
               }

               return { r, g, b, a };
            }
            else {
               throw new Error("Invalid Hex value");
            }
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
            document.addEventListener('keyup', _eventListeners.closeColorPicker);
            DOM.paletteWrapper.addEventListener('mousedown', _eventListeners.cursorMouseDown);
            DOM.hueSliderWrapper.addEventListener('mousedown', _eventListeners.hueSliderThumbMouseDown);
            DOM.opacitySliderWrapper.addEventListener('mousedown', _eventListeners.opacitySliderThumbMouseDown);
            DOM.overlayBackdrop.addEventListener('click', _eventListeners.closeColorPicker);
            DOM.colorModelArrow.addEventListener('click', _eventListeners.changeColorModel);
            DOM.clipboardColor.addEventListener('click', _eventListeners.clipboardColor);
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

            _helper.updateColorModelInput();
            _helper.updateViewColors();
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

            hsva.hue = (((thumbX + hueSliderThumbHalfWidth) / hueSliderRect.width) * 360);
            DOM.hueSliderThumb.style.transform = `translate(${thumbX}px, -50%)`;

            _helper.updateColorModelInput();
            _helper.updateViewColors();
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
               
            _helper.updateColorModelInput();
            _helper.updateViewColors();
         },

         /**
          * Open color picker
          */
         openColorPicker() {
            _helper.setColorModelInput(COLOR_MODEL.HSL);
            document.body.appendChild(DOM.overlayContainer);
            _helper.applyColor();

            _options.getOption("onOpened")();
         },

         /**
          * Close color picker
          * @param {MouseEvent | KeyboardEvent} event 
          */
         closeColorPicker(event) {
            if(DOM.overlayContainer.parentElement) {
               if(event instanceof MouseEvent || (event instanceof KeyboardEvent && event.key == "Escape")){
                  document.body.removeChild(DOM.overlayContainer);
                  let result = null;

                  switch (getSelectedColorModel()) {
                     case COLOR_MODEL.RGB: {
                        result = {
                           red: _rgba_.red,
                           green: _rgba_.green,
                           blue: _rgba_.blue,
                           alpha: hsva.alpha
                        }
                     } break;
                     case COLOR_MODEL.HSV: {
                        result = {
                           hue: Math.round(hsva.hue),
                           saturate: Math.round(hsva.saturate),
                           value: Math.round(hsva.value),
                           alpha: hsva.alpha
                        }
                     } break;
                     case COLOR_MODEL.HSL: {
                        result = {
                           hue: _hsla_.hue,
                           saturate: _hsla_.saturate,
                           lightness: _hsla_.lightness,
                           alpha: hsva.alpha
                        }
                     } break;
                     case COLOR_MODEL.HEX: {
                        result = _hex_.toString();
                     } break;
                  }
                  
                  _options.getOption("onClosed")(result);
               }
            }
         },

         /**
          * Change color model
          */
         changeColorModel() {
            switch (getSelectedColorModel()) {
               case COLOR_MODEL.RGB: {
                  _helper.setColorModelInput(COLOR_MODEL.HSV);
               } break;
               
               case COLOR_MODEL.HSV: {
                  _helper.setColorModelInput(COLOR_MODEL.HSL);
               } break;
               
               case COLOR_MODEL.HSL: {
                  _helper.setColorModelInput(COLOR_MODEL.HEX);
               } break;

               case COLOR_MODEL.HEX: {
                  _helper.setColorModelInput(COLOR_MODEL.RGB);
               } break;
            }
         },

         rgbaInputKeyDown(event, color) {
            let target = event.target;
            let pressedKey = event.key;

            if(/[0-9]|(ArrowUp)|(ArrowDown)|(ArrowRight)|(ArrowLeft)|(Backspace)|(Delete)|(Tab)|(Home)|(End)/.test(pressedKey)) {
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

            if(/[0-9]|(\.)|(ArrowUp)|(ArrowDown)|(ArrowRight)|(ArrowLeft)|(Backspace)|(Delete)|(Tab)|(Home)|(End)/.test(pressedKey)) {
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

            if(/[0-9]|(ArrowUp)|(ArrowDown)|(ArrowRight)|(ArrowLeft)|(Backspace)|(Delete)|(Tab)|(Home)|(End)/.test(pressedKey)) {
               switch (pressedKey) {
                  case "ArrowUp":
                     if(hsva[color] < maxValue) {
                        let result = (hsva[color] + 1);
                        hsva[color] = (result > maxValue) ? maxValue : result;
                        target.value = `${Math.round(hsva[color])}${suffix}`;
                        _helper.updateViewColors();
                        _helper.updateViewControls();
                     }
                  break;
                  
                  case "ArrowDown":
                     if(hsva[color] > 0) {
                        let result = (hsva[color] - 1);
                        hsva[color] = (result < 0) ? 0 : result;
                        target.value = `${Math.round(hsva[color])}${suffix}`;
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
                  target.value = `${Math.round(hsva[color])}${suffix}`;
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
            target.value = `${Math.round(hsva[color])}${suffix}`;
         },
         
         hslaInputKeyDown(event, color, maxValue, suffix) {
            let target = event.target;
            let pressedKey = event.key;

            if(/[0-9]|(ArrowUp)|(ArrowDown)|(ArrowRight)|(ArrowLeft)|(Backspace)|(Delete)|(Tab)|(Home)|(End)/.test(pressedKey)) {
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
            target.value = `${Math.round(_hsla_[color])}${suffix}`;
         },
         
         /**
          * 
          * @param {KeyboardEvent} event 
          */
         hexInputKeyDown(event) {
            let target = event.target;
            let pressedKey = event.key;
            
            if(/^[A-Fa-f0-9]{1}$|(#)|(Backspace)|(Delete)|(Tab)|(ArrowLeft)|(ArrowRight)|(Home)|(End)/.test(pressedKey)) {
               let _value;

               if(/^[A-Fa-f0-9]{1}$|(#)/.test(pressedKey)) {
                  if(target.value.length < 9) {
                     _value = target.value.substring(0, target.selectionStart) + pressedKey + target.value.substring(target.selectionEnd, target.value.length);
                  }
                  else {
                     event.preventDefault();
                  }
               }
               else {
                  switch (pressedKey) {
                     case "Backspace": {
                        let backWith = 0;
                        if(target.selectionStart == target.selectionEnd) {
                           backWith = 1;
                        }
                        _value = target.value.substring(0, target.selectionStart - backWith) + target.value.substring(target.selectionEnd, target.value.length);
                     } break;

                     case "Delete": {
                        let goWith = 0;
                        if(target.selectionStart == target.selectionEnd) {
                           goWith = 1;
                        }
                        _value = target.value.substring(0, target.selectionStart) + target.value.substring(target.selectionEnd + goWith, target.value.length);
                     } break;
                  }
               }

               if(/^#(([a-f0-9]){3,4}|([a-f0-9]){6}|([a-f0-9]){8})$/i.test(_value)) {
                  switch (_value.length) {
                     case 4: {
                        let splitHexValues = _value.split("");
                        _hex_.red = (splitHexValues[1] + splitHexValues[1]).toUpperCase();
                        _hex_.green = (splitHexValues[2] + splitHexValues[2]).toUpperCase();
                        _hex_.blue = (splitHexValues[3] + splitHexValues[3]).toUpperCase();
                        _hex_.alpha = "FF";
                     } break;
   
                     case 5: {
                        let splitHexValues = _value.split("");
                        _hex_.red = (splitHexValues[1] + splitHexValues[1]).toUpperCase();
                        _hex_.green = (splitHexValues[2] + splitHexValues[2]).toUpperCase();
                        _hex_.blue = (splitHexValues[3] + splitHexValues[3]).toUpperCase();
                        _hex_.alpha = (splitHexValues[4] + splitHexValues[4]).toUpperCase();
                     } break;
   
                     case 7: {
                        let splitHexValues = _value.split(/([a-f0-9]{2})([a-f0-9]{2})/i);
                        _hex_.red = (splitHexValues[1]).toUpperCase();
                        _hex_.green = (splitHexValues[2]).toUpperCase();
                        _hex_.blue = (splitHexValues[3]).toUpperCase();
                        _hex_.alpha = "FF";
                     } break;
   
                     case 9: {
                        let splitHexValues = _value.split(/([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/i);
                        _hex_.red = (splitHexValues[1]).toUpperCase();
                        _hex_.green = (splitHexValues[2]).toUpperCase();
                        _hex_.blue = (splitHexValues[3]).toUpperCase();
                        _hex_.alpha = (splitHexValues[4]).toUpperCase();
                     } break;
                  }

                  let rgba = _colorConverter.HEXtoRGBA(_hex_.toString());
                  let hsv = _colorConverter.RGBtoHSV(rgba.r, rgba.g, rgba.b);
                  hsva.hue = hsv.h;
                  hsva.saturate = hsv.s;
                  hsva.value = hsv.v;
                  hsva.alpha = parseFloat((rgba.a/255).toFixed(2));
                  _helper.updateViewColors();
                  _helper.updateViewControls();
               }
            }
            else {
               event.preventDefault();
            }
         },
         
         /**
          * 
          * @param {KeyboardEvent} event 
          */
         hexInputChanged(event) {
            event.target.value = _hex_.toString();
         },

         /**
          * Clipboard color click event listener
          */
         clipboardColor() {
            switch (getSelectedColorModel()) {
               case COLOR_MODEL.RGB:
                  DOM.hiddenClipboardInput.value = `rgba(${_rgba_.red}, ${_rgba_.green}, ${_rgba_.blue}, ${hsva.alpha})`;
                  break;
                  
               case COLOR_MODEL.HSV:
                  DOM.hiddenClipboardInput.value = `hsva(${Math.round(hsva.hue)}, ${Math.round(hsva.saturate)}%, ${Math.round(hsva.value)}%, ${hsva.alpha})`;
               break;

               case COLOR_MODEL.HSL:
                  DOM.hiddenClipboardInput.value = `hsl(${_hsla_.hue}, ${_hsla_.saturate}%, ${_hsla_.lightness}%, ${hsva.alpha})`;
               break;

               case COLOR_MODEL.HEX:
                  DOM.hiddenClipboardInput.value = _hex_.toString();
               break;
            }

            DOM.hiddenClipboardInput.select();
            document.execCommand('copy');
            _guiBuilder.setCopiedClipboardIcon();
         }
      }

      window.ColorPicker = {
         // Properties
         COLOR_MODEL,
         
         // Methods
         init,
         getSelectedColorModel,
         openColorPicker: _eventListeners.openColorPicker,
         closeColorPicker: _eventListeners.closeColorPicker,
         
         // Color converter object contains some converting functions
         colorConverter: {
            HSVtoHSL: (h, s, v) => { 
               let result = _colorConverter.HSVtoHSL(h, s, v) ;
               return {
                  h: result.h,
                  s: Math.round(result.s),
                  l: Math.round(result.l)
               }
            },
            HSVtoRGB: (h, s, v) => { 
               let result = _colorConverter.HSVtoRGB(h, s, v) ;
               return {
                  r: Math.round(result.r),
                  g: Math.round(result.g),
                  b: Math.round(result.b)
               }
            },
            HSVtoHEX: (h, s, v) => { 
               let result = _colorConverter.HSVtoHEX(h, s, v) ;
               return {

               }
            },
            HSLtoHSV: (h, s, l) => { 
               let result = _colorConverter.HSLtoHSV(h, s, l) ;
               return {
                  h: result.h,
                  s: Math.round(result.s),
                  v: Math.round(result.v)
               }
            },
            RGBtoHSL: (r, g, b) => { 
               let result = _colorConverter.RGBtoHSL(r, g, b) ;
               return {
                  h: Math.round(result.h),
                  s: Math.round(result.s),
                  l: Math.round(result.l)
               }
            },
            RGBtoHSV: (r, g, b) => { 
               let result = _colorConverter.RGBtoHSV(r, g, b) ;
               return {
                  h: Math.round(result.h),
                  s: Math.round(result.s),
                  v: Math.round(result.v)
               }
            },
            RGBToHex: _colorConverter.RGBToHex,
            HEXtoRGBA: _colorConverter.HEXtoRGBA
         }
      }
   }
})(window);