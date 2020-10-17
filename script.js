




(function(window) {
   if(!window.ColorPicker) {
      const DOM = {
         /**
          * @property {HTMLElement} paletteWwrapper
          */
         paletteWrapper: null,
      
         /**
          * @property {HTMLElement} cursor
          */
         cursor: null,
         
         /**
          * @property {HTMLElement} palette
          */
         palette: null,
      
         /**
          * @property {HTMLElement} hueSlider
          */
         hueSlider: null,
      
         /**
          * @property {HTMLElement} hueSliderThumb
          */
         hueSliderThumb: null,
      
         /**
          * @property {HTMLElement} hueSliderWrapper
          */
         hueSliderWrapper: null,
      
         /**
          * @property {HTMLElement} opacitySliderWrapper
          */
         opacitySliderWrapper: null,
      
         /**
          * @property {HTMLElement} opacityColor
          */
         opacityColor: null,
      
         /**
          * @property {HTMLElement} opacitySliderThumb
          */
         opacitySliderThumb: null,
      
         /**
          * @property {HTMLElement} colorPreview
          */
         colorPreview: null
      
      }
      
      const COLOR_MODEL = {
         RGB: 'rgb',
         HSV: 'hsv',
         HSL: 'hsl',
         HEX: 'hex'
      };
      const hsv = {
         h: 0,
         s: 100,
         v: 100,
         a: 1
      }
      let currentColorModel = COLOR_MODEL.RGB;

      let colorValue;

      function init() {
         DOM.paletteWrapper = document.querySelector('.cp-palette-wrapper');
         DOM.palette = document.querySelector('.cp-palette');
         DOM.cursor = document.querySelector('.cp-cursor');
         DOM.hueSliderWrapper = document.querySelector('.cp-hue-slider-wrapper');
         DOM.hueSliderThumb = document.querySelector('.cp-hue-slider-thumb');
         DOM.hueSlider = document.querySelector('.cp-hue-slider');
         DOM.opacitySliderWrapper = document.querySelector('.cp-opacity-slider-wrapper');
         DOM.opacityColor = document.querySelector('.cp-opacity-color');
         DOM.opacitySliderThumb = document.querySelector('.cp-opacity-slider-thumb');
         DOM.colorPreview = document.querySelector('.cp-color-preview');
         
         colorValue = document.getElementById('colorHSL');

         DOM.paletteWrapper.addEventListener('mousedown', cursorMouseDown);
         DOM.hueSliderWrapper.addEventListener('mousedown', hueSliderThumbMouseDown);
         DOM.opacitySliderWrapper.addEventListener('mousedown', opacitySliderThumbMouseDown);

         applyColor();
      }

      /**
       * Cursor palette color mouse down event handler
       * @param {MouseEvent} event 
       */
      function cursorMouseDown(event) {
         document.addEventListener('mousemove', cursorMouseMove);
         document.addEventListener('mouseup', cursorMouseUp);

         cursorMouseMove(event);
      }

      /**
       * Cursor palette color mouse up event handler
       */
      function cursorMouseUp() {
         document.removeEventListener('mousemove', cursorMouseMove);
         document.removeEventListener('mouseup', cursorMouseUp);
      }

      /**
       * Cursor palette color mouse move event handler
       * @param {MouseEvent} event 
       */
      function cursorMouseMove(event) {
         let xAxis = event.clientX;
         let yAxis = event.clientY;

         let paletteWrapperClientRect = DOM.paletteWrapper.getBoundingClientRect();

         if(xAxis <= paletteWrapperClientRect.left) {
            xAxis = paletteWrapperClientRect.left;
         }
         if(xAxis >= paletteWrapperClientRect.right) {
            xAxis = paletteWrapperClientRect.right;
         }
         if(yAxis <= paletteWrapperClientRect.top) {
            yAxis = paletteWrapperClientRect.top;
         }
         if(yAxis >= paletteWrapperClientRect.bottom) {
            yAxis = paletteWrapperClientRect.bottom;
         }

         xAxis -= 9;
         yAxis -= 9;

         DOM.cursor.style.transform = `translate(${xAxis}px, ${yAxis}px)`;

         hsv.s = calculateSaturate(xAxis);
         hsv.v = calculateValue(yAxis);

         applyColor();
      }

      /**
       * Hue slider thumb mouse down event handler
       * @param {MouseEvent} event 
       */
      function hueSliderThumbMouseDown(event) {
         document.addEventListener('mousemove', hueSliderThumbMouseMove);
         document.addEventListener('mouseup', hueSliderThumbMouseUp);

         hueSliderThumbMouseMove(event);
      }

      /**
       * Hue slider thumb mouse up event handler
       */
      function hueSliderThumbMouseUp() {
         document.removeEventListener('mousemove', hueSliderThumbMouseMove);
         document.removeEventListener('mouseup', hueSliderThumbMouseUp);
      }

      /**
       * Hue slider thumb mouse move event handler
       * @param {MouseEvent} event 
       */
      function hueSliderThumbMouseMove(event) {
         let hueSliderRect = DOM.hueSlider.getBoundingClientRect();
         let hueSliderThumbHalfWidth = DOM.hueSliderThumb.offsetWidth / 2;
         let value = event.clientX - hueSliderRect.left;
         let thumbX = value - hueSliderThumbHalfWidth;
         
         if(thumbX >= (hueSliderThumbHalfWidth * -1) && thumbX <= (hueSliderRect.width - hueSliderThumbHalfWidth)) {
            hsv.h = Math.round((value / hueSliderRect.width) * 360);
            DOM.hueSliderThumb.style.transform = `translate(${thumbX}px, -50%)`;
            
            applyColor();
         }
      }

      /**
       * Opacity slider thumb mouse down event handler
       * @param {MouseEvent} event 
       */
      function opacitySliderThumbMouseDown(event) {
         document.addEventListener('mousemove', opacitySliderThumbMouseMove);
         document.addEventListener('mouseup', opacitySliderThumbMouseUp);

         opacitySliderThumbMouseMove(event);
      }

      /**
       * Opacity slider thumb mouse up event handler
       */
      function opacitySliderThumbMouseUp() {
         document.removeEventListener('mousemove', opacitySliderThumbMouseMove);
         document.removeEventListener('mouseup', opacitySliderThumbMouseUp);
      }

      /**
       * Opacity slider thumb mouse move event handler
       * @param {MouseEvent} event 
       */
      function opacitySliderThumbMouseMove(event) {
         let opacitySliderRect = DOM.opacitySliderWrapper.getBoundingClientRect();
         let opacitySliderThumbHalfWidth = DOM.opacitySliderThumb.offsetWidth / 2;
         let value = event.clientX - opacitySliderRect.left;
         let thumbX = value - opacitySliderThumbHalfWidth;
         
         if(thumbX >= (opacitySliderThumbHalfWidth * -1) && thumbX <= (opacitySliderRect.width - opacitySliderThumbHalfWidth)) {
            hsv.a = parseFloat((value / opacitySliderRect.width).toFixed(2));
            DOM.opacitySliderThumb.style.transform = `translate(${thumbX}px, -50%)`;
            applyColor();
         }
      }

      /**
       * Apply color
       */
      function applyColor() {
         let paletteBGColor = `hsl(${hsv.h}deg 100% 50% / 1)`;
         DOM.palette.style.backgroundImage = `linear-gradient(180deg, transparent 0%, rgba(0,0,0,1) 100%), linear-gradient(90deg, rgba(255,255,255,1) 0%, ${paletteBGColor} 100%)`;

         switch (currentColorModel) {
            case COLOR_MODEL.RGB: {
               let rgb = HSVtoRGB(hsv.h, hsv.s, hsv.v);
               let previewRGBColor = `rgba(${rgb.r} ${rgb.g} ${rgb.b} / ${hsv.a})`;
               let opacityRGBColor = `rgb(${rgb.r} ${rgb.g} ${rgb.b})`;
               DOM.colorPreview.style.setProperty('background-color', previewRGBColor);
               DOM.opacityColor.style.setProperty('background-image', `linear-gradient(90deg, transparent, ${opacityRGBColor})`);
               colorValue.textContent = previewRGBColor;
            }
            break;

            case COLOR_MODEL.HSV: {
               let hsl = HSVtoHSL(hsv.h, hsv.s, hsv.v);
               let previewHSLColor = `hsl(${hsl.h}deg ${hsl.s}% ${hsl.l}% / ${hsv.a})`;
               let opacityHSLColor = `hsl(${hsl.h}deg ${hsl.s}% ${hsl.l}%)`;
               let colorHSV = `hsv(${hsv.h}deg ${hsv.s}% ${hsv.v}% / ${hsv.a})`;
               DOM.colorPreview.style.setProperty('background-color', previewHSLColor);
               DOM.opacityColor.style.setProperty('background-image', `linear-gradient(90deg, transparent, ${opacityHSLColor})`);
               colorValue.textContent = colorHSV;
            }
            break;

            case COLOR_MODEL.HSL: {
               let hsl = HSVtoHSL(hsv.h, hsv.s, hsv.v);
               let previewHSLColor = `hsl(${hsl.h}deg ${hsl.s}% ${hsl.l}% / ${hsv.a})`;
               let opacityHSLColor = `hsl(${hsl.h}deg ${hsl.s}% ${hsl.l}%)`;
               DOM.colorPreview.style.setProperty('background-color', previewHSLColor);
               DOM.opacityColor.style.setProperty('background-image', `linear-gradient(90deg, transparent, ${opacityHSLColor})`);
               colorValue.textContent = previewHSLColor;
            }
            break;

            case COLOR_MODEL.HEX: {
               let previewHSLColor = HSVtoHEX(hsv.h, hsv.s, hsv.v);
               let opacityHSLColor = previewHSLColor;

               if(hsv.a < 1){
                  let alpha = Math.round(hsv.a * 255).toString(16);
                  alpha = (alpha.length < 2) ? `0${alpha}` : alpha;
                  previewHSLColor += alpha;
               }

               DOM.colorPreview.style.setProperty('background-color', previewHSLColor);
               DOM.opacityColor.style.setProperty('background-image', `linear-gradient(90deg, transparent, ${opacityHSLColor})`);
               colorValue.textContent = previewHSLColor;
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
      function calculateValue(yAxis) {
         let paletteHeight = DOM.palette.offsetHeight;

         return Math.round(((paletteHeight - yAxis) / paletteHeight) * 100);
      }

      /**
       * Calculate tha saturate for HSV color
       * @param {number} xAxis
       * 
       * @returns {number} saturate
       */
      function calculateSaturate(xAxis) {
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
      function HSVtoHSL(h, s, v) {
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
      function HSVtoRGB(h, s, v) {
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
      function RGBtoHSL(r, g, b) {
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
      function HSVtoHEX(h, s, v) {
         let rgb = HSVtoRGB(h, s, v);

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

         // Methods
         init,
         selectedColorModel,
      }
   }
})(window);