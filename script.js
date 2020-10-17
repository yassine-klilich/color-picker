
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
    * @property {HTMLElement} hueSliderThumb
    */
   hueSliderThumb: null

}

let color;
let colorValue;


window.addEventListener("load", function() {
   
   DOM.paletteWrapper = document.querySelector('.color-picker-palette-wrapper');
   DOM.palette = document.querySelector('.color-picker-palette');
   DOM.cursor = document.querySelector('.color-picker-cursor');
   DOM.hueSliderThumb = document.querySelector('.color-picker-hue-slider-thumb');
   
   color = document.querySelector('.color');
   colorValue = document.getElementById('colorHSL');

   DOM.paletteWrapper.addEventListener('mousedown', cursorMouseDown);
   DOM.hueSliderThumb.addEventListener('mousedown', hueSliderThumbMouseDown);
   
})

/**
 * 
 * @param {MouseEvent} event 
 */
function cursorMouseDown(event) {
   document.addEventListener('mousemove', cursorMouseMove);
   document.addEventListener('mouseup', cursorMouseUp);

   cursorMouseMove(event);
}

/**
 * 
 * @param {MouseEvent} event 
 */
function cursorMouseUp(event) {
   document.removeEventListener('mousemove', cursorMouseMove);
   document.removeEventListener('mouseup', cursorMouseUp);
}

/**
 * 
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

   let hue = 0;
   let saturate = calculateSaturate(xAxis);
   let value = calculateValue(yAxis);

   let rgb = HSVtoRGB(hue, saturate, value);
   let colorRGB = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
   color.style.backgroundColor = colorRGB;
   colorValue.textContent = colorRGB;
}










/**
 * 
 * @param {MouseEvent} event 
 */
function hueSliderThumbMouseDown(event) {
   document.addEventListener('mousemove', hueSliderThumbMouseMove);
   document.addEventListener('mouseup', hueSliderThumbMouseUp);

   cursorMouseMove(event);
}

/**
 * 
 * @param {MouseEvent} event 
 */
function hueSliderThumbMouseUp(event) {
   document.removeEventListener('mousemove', hueSliderThumbMouseMove);
   document.removeEventListener('mouseup', hueSliderThumbMouseUp);
}

/**
 * 
 * @param {MouseEvent} event 
 */
function hueSliderThumbMouseMove(event) {
   
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

   let l = _lightness * 100;
   s = _saturate;
   
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
   h *= 0.01;
   s *= 0.01;
   v *= 0.01;
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

   redHex = rgb.r.toString(16);
   greenHex = rgb.g.toString(16);
   blueHex = rgb.b.toString(16);

   redHex = (redHex.length < 2) ? '0' + redHex : redHex;
   greenHex = (greenHex.length < 2) ? '0' + greenHex : greenHex;
   blueHex = (blueHex.length < 2) ? '0' + blueHex : blueHex;

   return `#${redHex}${greenHex}${blueHex}`;
}