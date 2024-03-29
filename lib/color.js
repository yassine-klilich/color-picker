/**
 * 
 * @param {number} h Hue
 * @param {number} s Saturate
 * @param {number} v Value
 * @param {number} a Alpha
 */
function Color(h, s, v, a) {
  this.a = a
  
  this.hsv = { h, s, v }
  this.rgb = this.toRGB()
  this.hsl = this.toHSL()
  this.hex = this.toHEX()
}

Color.prototype.toRGB = function () {
	let { h, s, v } = this.hsv

	h /= 360
	s /= 100
	v /= 100

	var r, g, b, i, f, p, q, t
	i = Math.floor(h * 6)
	f = h * 6 - i
	p = v * (1 - s)
	q = v * (1 - f * s)
	t = v * (1 - (1 - f) * s)
	switch (i % 6) {
		case 0:
			(r = v), (g = t), (b = p)
			break;
		case 1:
			(r = q), (g = v), (b = p)
			break;
		case 2:
			(r = p), (g = v), (b = t)
			break;
		case 3:
			(r = p), (g = q), (b = v)
			break;
		case 4:
			(r = t), (g = p), (b = v)
			break;
		case 5:
			(r = v), (g = p), (b = q)
			break;
	}
	return {
		r: r * 255,
		g: g * 255,
		b: b * 255
	};
}

Color.prototype.toHSL = function () {
	let { h, s, v } = this.hsv
	let _saturation = s * 0.01
	let _value = v * 0.01

	let _lightness = _value - (_value * _saturation) / 2
	let _saturate = NaN

	if (_lightness == 0 || _lightness == 1) {
		_saturate = 0
	} else {
		_saturate =
			((_value - _lightness) / Math.min(_lightness, 1 - _lightness)) * 100
	}

	let l = _lightness * 100
	s = _saturate

	return {
		h,
		s: s,
		l: l
	};
}

Color.prototype.toHEX = function () {
	let { r, g, b } = this.toRGB()
	return this.RGBAtoHEX(r, g, b, this.a)
}

Color.prototype.RGBtoHSV = function(r, g, b) {
	r /= 255, g /= 255, b /= 255

	let max = Math.max(r, g, b), min = Math.min(r, g, b)
	let h, s, v = max

	let d = max - min
	s = max == 0 ? 0 : d / max

	if (max == min) {
		h = 0
	} else {
		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break
			case g: h = (b - r) / d + 2; break
			case b: h = (r - g) / d + 4; break
		}

		h /= 6
	}

	h = h * 360
	s = s * 100
	v = v * 100

	return { h, s, v }
}

Color.prototype.HSLtoHSV = function(h, s, l) {
	const hsv1 = s * (l < 50 ? l : 100 - l) / 100

	return {
		h,
		s: hsv1 === 0 ? 0 : 2 * hsv1 / (l + hsv1) * 100,
		v: l + hsv1
	}
}

Color.prototype.HEXtoRGBA = function(hex) {
	let r = 0, g = 0, b = 0, a = 0
	
	if(/^#(([a-f0-9]){3,4}|([a-f0-9]){6}|([a-f0-9]){8})$/i.test(hex)) {
    if (hex.length < 6) {
      const splitHexValues = hex.split("");
      r = +("0x" + splitHexValues[1] + splitHexValues[1])
      g = +("0x" + splitHexValues[2] + splitHexValues[2])
      b = +("0x" + splitHexValues[3] + splitHexValues[3])
      a = (splitHexValues[4] ? parseFloat((+("0x" + splitHexValues[4] + splitHexValues[4]) / 255).toFixed(2)) : 1)
    }
    else if (hex.length < 10) {
      const splitHexValues = hex.split(/([a-f0-9]{2})/i)
      r = +("0x" + splitHexValues[1])
      g = +("0x" + splitHexValues[3])
      b = +("0x" + splitHexValues[5])
      a = (splitHexValues[7] ? parseFloat((+("0x" + splitHexValues[7]) / 255).toFixed(2)) : 1)
    }
    
		return { r, g, b, a }
	}
}

Color.prototype.RGBAtoHEX = function(r, g, b, a) {
	r = _util_.hexPad2(Math.round(r))
	g = _util_.hexPad2(Math.round(g))
	b = _util_.hexPad2(Math.round(b))
  a = (a == 1) ? "" : _util_.hexPad2(Math.round(a * 255))

	return "#" + r + g + b + a
}