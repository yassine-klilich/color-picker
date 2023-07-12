/**
 * 
 * @param {number} h Hue
 * @param {number} s Saturate
 * @param {number} v Value
 * @param {number} a Alpha
 */
function HSVColor(h, s, v, a) {
	this.h = h;
	this.s = s;
	this.v = v;
	this.a = a;
}

HSVColor.prototype.toRGB = function () {
	let { h, s, v } = this;

	h /= 360;
	s /= 100;
	v /= 100;

	var r, g, b, i, f, p, q, t;
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0:
			(r = v), (g = t), (b = p);
			break;
		case 1:
			(r = q), (g = v), (b = p);
			break;
		case 2:
			(r = p), (g = v), (b = t);
			break;
		case 3:
			(r = p), (g = q), (b = v);
			break;
		case 4:
			(r = t), (g = p), (b = v);
			break;
		case 5:
			(r = v), (g = p), (b = q);
			break;
	}
	return {
		r: r * 255,
		g: g * 255,
		b: b * 255,
	};
};

HSVColor.prototype.toHSL = function () {
	let { h, s, v } = this;
	let _saturation = s * 0.01;
	let _value = v * 0.01;

	let _lightness = _value - (_value * _saturation) / 2;
	let _saturate = NaN;

	if (_lightness == 0 || _lightness == 1) {
		_saturate = 0;
	} else {
		_saturate =
			((_value - _lightness) / Math.min(_lightness, 1 - _lightness)) * 100;
	}

	let l = _lightness * 100;
	s = _saturate;

	return { h, s, l };
};

HSVColor.prototype.toHEX = function () {
	let { h, s, v } = this;
	let { r, g, b } = this.toRGB(h, s, v);

	r = Math.round(r).toString(16);
	g = Math.round(g).toString(16);
	b = Math.round(b).toString(16);

	if (r.length == 1) r = "0" + r;
	if (g.length == 1) g = "0" + g;
	if (b.length == 1) b = "0" + b;

	return "#" + r + g + b;
};