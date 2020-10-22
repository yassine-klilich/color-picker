




(function(window) {
   if(!window.ColorPicker) {
      const DOM = {};
      
      const COLOR_MODEL = {
         RGB: 'rgb',
         HSV: 'hsv',
         HSL: 'hsl',
         HEX: 'hex'
      }
      const hsv = {
         h: 0,
         s: 100,
         v: 100,
         a: 1
      }
      let currentColorModel = COLOR_MODEL.RGB;

      function init() {

         _initGUI();
         
         DOM.paletteWrapper.addEventListener('mousedown', _cursorMouseDown);
         DOM.hueSliderWrapper.addEventListener('mousedown', _hueSliderThumbMouseDown);
         DOM.opacitySliderWrapper.addEventListener('mousedown', _opacitySliderThumbMouseDown);
         DOM.overlayBackdrop.addEventListener('click', _closeColorPicker);

         _applyColor();
      }

      /**
       * Initialize the GUI
       */
      function _initGUI() {
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

         // Add class names
         cp_overlayContainer.classList.add("cl-overlay-container");
         cp_overlayBackdrop.classList.add("cl-overlay-backdrop");
         cp_overlayWrapper.classList.add("cl-overlay-wrapper");
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
         cp_ColorPreviewWrapper.appendChild(cp_ColorPreview);
         cp_Sliders.appendChild(cp_HueSliderWrapper);
         cp_Sliders.appendChild(cp_OpacitySliderWrapper);
         cp_HueSliderWrapper.appendChild(cp_HueSlider);
         cp_HueSliderWrapper.appendChild(cp_HueSliderThumb);
         cp_OpacitySliderWrapper.appendChild(cp_OpacitySlider);
         cp_OpacitySliderWrapper.appendChild(cp_OpacitySliderThumb);
         cp_OpacitySlider.appendChild(cp_OpacityColor);

         DOM.overlayContainer = cp_overlayContainer;
         DOM.overlayBackdrop = cp_overlayBackdrop;
         DOM.paletteWrapper = cp_PaletteWrapper;
         DOM.cursor = cp_Cursor;
         DOM.palette = cp_Palette;
         DOM.hueSlider = cp_HueSlider;
         DOM.hueSliderThumb = cp_HueSliderThumb;
         DOM.hueSliderWrapper = cp_HueSliderWrapper;
         DOM.opacitySliderWrapper = cp_OpacitySliderWrapper;
         DOM.opacityColor = cp_OpacityColor;
         DOM.opacitySliderThumb = cp_OpacitySliderThumb;
         DOM.colorPreview = cp_ColorPreview;

         document.body.appendChild(DOM.overlayContainer);
      }

      /**
       * Cursor palette color mouse down event handler
       * @param {MouseEvent} event 
       */
      function _cursorMouseDown(event) {
         document.addEventListener('mousemove', _cursorMouseMove);
         document.addEventListener('mouseup', _cursorMouseUp);

         _cursorMouseMove(event);
      }

      /**
       * Cursor palette color mouse up event handler
       */
      function _cursorMouseUp() {
         document.removeEventListener('mousemove', _cursorMouseMove);
         document.removeEventListener('mouseup', _cursorMouseUp);
      }

      /**
       * Cursor palette color mouse move event handler
       * @param {MouseEvent} event 
       */
      function _cursorMouseMove(event) {
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

         hsv.s = _calculateSaturate(xAxis);
         hsv.v = _calculateValue(yAxis);

         _applyColor();
      }

      /**
       * Hue slider thumb mouse down event handler
       * @param {MouseEvent} event 
       */
      function _hueSliderThumbMouseDown(event) {
         document.addEventListener('mousemove', _hueSliderThumbMouseMove);
         document.addEventListener('mouseup', _hueSliderThumbMouseUp);

         _hueSliderThumbMouseMove(event);
      }

      /**
       * Hue slider thumb mouse up event handler
       */
      function _hueSliderThumbMouseUp() {
         document.removeEventListener('mousemove', _hueSliderThumbMouseMove);
         document.removeEventListener('mouseup', _hueSliderThumbMouseUp);
      }

      /**
       * Hue slider thumb mouse move event handler
       * @param {MouseEvent} event 
       */
      function _hueSliderThumbMouseMove(event) {
         let hueSliderRect = DOM.hueSlider.getBoundingClientRect();
         let hueSliderThumbHalfWidth = DOM.hueSliderThumb.offsetWidth / 2;
         let value = event.clientX - hueSliderRect.left;
         let thumbX = value - hueSliderThumbHalfWidth;
         
         if(thumbX >= (hueSliderThumbHalfWidth * -1) && thumbX <= (hueSliderRect.width - hueSliderThumbHalfWidth)) {
            hsv.h = Math.round((value / hueSliderRect.width) * 360);
            DOM.hueSliderThumb.style.transform = `translate(${thumbX}px, -50%)`;
            
            _applyColor();
         }
      }

      /**
       * Opacity slider thumb mouse down event handler
       * @param {MouseEvent} event 
       */
      function _opacitySliderThumbMouseDown(event) {
         document.addEventListener('mousemove', _opacitySliderThumbMouseMove);
         document.addEventListener('mouseup', _opacitySliderThumbMouseUp);

         _opacitySliderThumbMouseMove(event);
      }

      /**
       * Opacity slider thumb mouse up event handler
       */
      function _opacitySliderThumbMouseUp() {
         document.removeEventListener('mousemove', _opacitySliderThumbMouseMove);
         document.removeEventListener('mouseup', _opacitySliderThumbMouseUp);
      }

      /**
       * Opacity slider thumb mouse move event handler
       * @param {MouseEvent} event 
       */
      function _opacitySliderThumbMouseMove(event) {
         let opacitySliderRect = DOM.opacitySliderWrapper.getBoundingClientRect();
         let opacitySliderThumbHalfWidth = DOM.opacitySliderThumb.offsetWidth / 2;
         let value = event.clientX - opacitySliderRect.left;
         let thumbX = value - opacitySliderThumbHalfWidth;
         
         if(thumbX >= (opacitySliderThumbHalfWidth * -1) && thumbX <= (opacitySliderRect.width - opacitySliderThumbHalfWidth)) {
            hsv.a = parseFloat((value / opacitySliderRect.width).toFixed(2));
            DOM.opacitySliderThumb.style.transform = `translate(${thumbX}px, -50%)`;
            _applyColor();
         }
      }

      /**
       * Open color picker
       */
      function _openColorPicker() {
         document.body.appendChild(DOM.overlayContainer);
      }

      /**
       * Close color picker
       */
      function _closeColorPicker() {
         document.body.removeChild(DOM.overlayContainer);
      }

      /**
       * Apply color
       */
      function _applyColor() {
         let paletteBGColor = `hsl(${hsv.h}deg 100% 50% / 1)`;
         DOM.palette.style.backgroundImage = `linear-gradient(180deg, transparent 0%, rgba(0,0,0,1) 100%), linear-gradient(90deg, rgba(255,255,255,1) 0%, ${paletteBGColor} 100%)`;

         switch (currentColorModel) {
            case COLOR_MODEL.RGB: {
               let rgb = _HSVtoRGB(hsv.h, hsv.s, hsv.v);
               let previewRGBColor = `rgba(${rgb.r} ${rgb.g} ${rgb.b} / ${hsv.a})`;
               let opacityRGBColor = `rgb(${rgb.r} ${rgb.g} ${rgb.b})`;
               DOM.colorPreview.style.setProperty('background-color', previewRGBColor);
               DOM.opacityColor.style.setProperty('background-image', `linear-gradient(90deg, transparent, ${opacityRGBColor})`);
            }
            break;

            case COLOR_MODEL.HSV: {
               let hsl = _HSVtoHSL(hsv.h, hsv.s, hsv.v);
               let previewHSLColor = `hsl(${hsl.h}deg ${hsl.s}% ${hsl.l}% / ${hsv.a})`;
               let opacityHSLColor = `hsl(${hsl.h}deg ${hsl.s}% ${hsl.l}%)`;
               let colorHSV = `hsv(${hsv.h}deg ${hsv.s}% ${hsv.v}% / ${hsv.a})`;
               DOM.colorPreview.style.setProperty('background-color', previewHSLColor);
               DOM.opacityColor.style.setProperty('background-image', `linear-gradient(90deg, transparent, ${opacityHSLColor})`);
            }
            break;

            case COLOR_MODEL.HSL: {
               let hsl = _HSVtoHSL(hsv.h, hsv.s, hsv.v);
               let previewHSLColor = `hsl(${hsl.h}deg ${hsl.s}% ${hsl.l}% / ${hsv.a})`;
               let opacityHSLColor = `hsl(${hsl.h}deg ${hsl.s}% ${hsl.l}%)`;
               DOM.colorPreview.style.setProperty('background-color', previewHSLColor);
               DOM.opacityColor.style.setProperty('background-image', `linear-gradient(90deg, transparent, ${opacityHSLColor})`);
            }
            break;

            case COLOR_MODEL.HEX: {
               let previewHSLColor = _HSVtoHEX(hsv.h, hsv.s, hsv.v);
               let opacityHSLColor = previewHSLColor;

               if(hsv.a < 1){
                  let alpha = Math.round(hsv.a * 255).toString(16);
                  alpha = (alpha.length < 2) ? `0${alpha}` : alpha;
                  previewHSLColor += alpha;
               }

               DOM.colorPreview.style.setProperty('background-color', previewHSLColor);
               DOM.opacityColor.style.setProperty('background-image', `linear-gradient(90deg, transparent, ${opacityHSLColor})`);
            }
            break;
         }
      }

      /**
       * Calculate tha value for HSV color
       * @param {number} yAxis 
       * 
       * @returns {number} value
       */
      function _calculateValue(yAxis) {
         let paletteHeight = DOM.palette.offsetHeight;

         return Math.round(((paletteHeight - yAxis) / paletteHeight) * 100);
      }

      /**
       * Calculate tha saturate for HSV color
       * @param {number} xAxis
       * 
       * @returns {number} saturate
       */
      function _calculateSaturate(xAxis) {
         let paletteWidth = DOM.palette.offsetWidth;

         return Math.round((xAxis / paletteWidth) * 100);
      }

      /**
       * Convert HSV to HSL
       * @param {number} h Hue 
       * @param {number} s Saturation 
       * @param {number} v Value 
       * 
       * @returns {object} HSL color 
       */
      function _HSVtoHSL(h, s, v) {
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
      }

      /**
       * Convert HSV to RGB
       * @param {number} h Hue 
       * @param {number} s Saturation 
       * @param {number} v Value 
       * 
       * @returns {object} RGB color 
       */
      function _HSVtoRGB(h, s, v) {
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
      }

      /**
       * Convert RGB to HSL
       * @param {number} r Red
       * @param {number} g Green 
       * @param {number} b Blue 
       * 
       * @returns {object} HSL color 
       */
      function _RGBtoHSL(r, g, b) {
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
      }


      /**
       * Convert HSV to HEX
       * @param {number} h Hue 
       * @param {number} s Saturation 
       * @param {number} v Value 
       * 
       * @returns {object} HEX color 
       */
      function _HSVtoHEX(h, s, v) {
         let rgb = _HSVtoRGB(h, s, v);

         let redHex = rgb.r.toString(16);
         let greenHex = rgb.g.toString(16);
         let blueHex = rgb.b.toString(16);

         redHex = (redHex.length < 2) ? '0' + redHex : redHex;
         greenHex = (greenHex.length < 2) ? '0' + greenHex : greenHex;
         blueHex = (blueHex.length < 2) ? '0' + blueHex : blueHex;

         return `#${redHex}${greenHex}${blueHex}`;
      }

      function selectedColorModel() {
         return currentColorModel;
      }

      window.ColorPicker = {
         // Properties
         COLOR_MODEL,
DOM,
         // Methods
         init,
         selectedColorModel,
         openColorPicker: _openColorPicker,
         closeColorPicker: _closeColorPicker
      }
   }
})(window);