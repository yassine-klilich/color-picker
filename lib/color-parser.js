const ColorParser = (function () {

	const NAMED_COLORS = {
    "aliceblue": {
        "h": 208,
        "s": 6,
        "v": 100
    },
    "antiquewhite": {
        "h": 34,
        "s": 14,
        "v": 98
    },
    "aqua": {
        "h": 180,
        "s": 100,
        "v": 100
    },
    "aquamarine": {
        "h": 160,
        "s": 50,
        "v": 100
    },
    "azure": {
        "h": 180,
        "s": 6,
        "v": 100
    },
    "beige": {
        "h": 60,
        "s": 10,
        "v": 96
    },
    "bisque": {
        "h": 33,
        "s": 23,
        "v": 100
    },
    "black": {
        "h": 0,
        "s": 0,
        "v": 0
    },
    "blanchedalmond": {
        "h": 36,
        "s": 20,
        "v": 100
    },
    "blue": {
        "h": 240,
        "s": 100,
        "v": 100
    },
    "blueviolet": {
        "h": 271,
        "s": 81,
        "v": 89
    },
    "brown": {
        "h": 0,
        "s": 75,
        "v": 65
    },
    "burlywood": {
        "h": 34,
        "s": 39,
        "v": 87
    },
    "cadetblue": {
        "h": 182,
        "s": 41,
        "v": 63
    },
    "chartreuse": {
        "h": 90,
        "s": 100,
        "v": 100
    },
    "chocolate": {
        "h": 25,
        "s": 86,
        "v": 82
    },
    "coral": {
        "h": 16,
        "s": 69,
        "v": 100
    },
    "cornflowerblue": {
        "h": 219,
        "s": 58,
        "v": 93
    },
    "cornsilk": {
        "h": 48,
        "s": 14,
        "v": 100
    },
    "crimson": {
        "h": 348,
        "s": 91,
        "v": 86
    },
    "cyan": {
        "h": 180,
        "s": 100,
        "v": 100
    },
    "darkblue": {
        "h": 240,
        "s": 100,
        "v": 55
    },
    "darkcyan": {
        "h": 180,
        "s": 100,
        "v": 55
    },
    "darkgoldenrod": {
        "h": 43,
        "s": 94,
        "v": 72
    },
    "darkgray": {
        "h": 0,
        "s": 0,
        "v": 0.6627450980392157
    },
    "darkgrey": {
        "h": 0,
        "s": 0,
        "v": 0.6627450980392157
    },
    "darkgreen": {
        "h": 120,
        "s": 100,
        "v": 39
    },
    "darkkhaki": {
        "h": 56,
        "s": 43,
        "v": 74
    },
    "darkmagenta": {
        "h": 300,
        "s": 100,
        "v": 55
    },
    "darkolivegreen": {
        "h": 82,
        "s": 56,
        "v": 42
    },
    "darkorange": {
        "h": 33,
        "s": 100,
        "v": 100
    },
    "darkorchid": {
        "h": 280,
        "s": 75,
        "v": 80
    },
    "darkred": {
        "h": 0,
        "s": 100,
        "v": 55
    },
    "darksalmon": {
        "h": 15,
        "s": 48,
        "v": 91
    },
    "darkseagreen": {
        "h": 120,
        "s": 24,
        "v": 74
    },
    "darkslateblue": {
        "h": 248,
        "s": 56,
        "v": 55
    },
    "darkslategray": {
        "h": 180,
        "s": 41,
        "v": 31
    },
    "darkslategrey": {
        "h": 180,
        "s": 41,
        "v": 31
    },
    "darkturquoise": {
        "h": 181,
        "s": 100,
        "v": 82
    },
    "darkviolet": {
        "h": 282,
        "s": 100,
        "v": 83
    },
    "deeppink": {
        "h": 328,
        "s": 92,
        "v": 100
    },
    "deepskyblue": {
        "h": 195,
        "s": 100,
        "v": 100
    },
    "dimgray": {
        "h": 0,
        "s": 0,
        "v": 0.4117647058823529
    },
    "dimgrey": {
        "h": 0,
        "s": 0,
        "v": 0.4117647058823529
    },
    "dodgerblue": {
        "h": 210,
        "s": 88,
        "v": 100
    },
    "firebrick": {
        "h": 0,
        "s": 81,
        "v": 70
    },
    "floralwhite": {
        "h": 40,
        "s": 6,
        "v": 100
    },
    "forestgreen": {
        "h": 120,
        "s": 76,
        "v": 55
    },
    "fuchsia": {
        "h": 300,
        "s": 100,
        "v": 100
    },
    "gainsboro": {
        "h": 0,
        "s": 0,
        "v": 0.8627450980392157
    },
    "ghostwhite": {
        "h": 240,
        "s": 3,
        "v": 100
    },
    "gold": {
        "h": 51,
        "s": 100,
        "v": 100
    },
    "goldenrod": {
        "h": 43,
        "s": 85,
        "v": 85
    },
    "gray": {
        "h": 0,
        "s": 0,
        "v": 0.5019607843137255
    },
    "grey": {
        "h": 0,
        "s": 0,
        "v": 0.5019607843137255
    },
    "green": {
        "h": 120,
        "s": 100,
        "v": 50
    },
    "greenyellow": {
        "h": 84,
        "s": 82,
        "v": 100
    },
    "honeydew": {
        "h": 120,
        "s": 6,
        "v": 100
    },
    "hotpink": {
        "h": 330,
        "s": 59,
        "v": 100
    },
    "indianred ": {
        "h": 0,
        "s": 55,
        "v": 80
    },
    "indigo ": {
        "h": 275,
        "s": 100,
        "v": 51
    },
    "ivory": {
        "h": 60,
        "s": 6,
        "v": 100
    },
    "khaki": {
        "h": 54,
        "s": 42,
        "v": 94
    },
    "lavender": {
        "h": 240,
        "s": 8,
        "v": 98
    },
    "lavenderblush": {
        "h": 340,
        "s": 6,
        "v": 100
    },
    "lawngreen": {
        "h": 90,
        "s": 100,
        "v": 99
    },
    "lemonchiffon": {
        "h": 54,
        "s": 20,
        "v": 100
    },
    "lightblue": {
        "h": 195,
        "s": 25,
        "v": 90
    },
    "lightcoral": {
        "h": 0,
        "s": 47,
        "v": 94
    },
    "lightcyan": {
        "h": 180,
        "s": 12,
        "v": 100
    },
    "lightgoldenrodyellow": {
        "h": 60,
        "s": 16,
        "v": 98
    },
    "lightgray": {
        "h": 0,
        "s": 0,
        "v": 0.8274509803921568
    },
    "lightgrey": {
        "h": 0,
        "s": 0,
        "v": 0.8274509803921568
    },
    "lightgreen": {
        "h": 120,
        "s": 39,
        "v": 93
    },
    "lightpink": {
        "h": 351,
        "s": 29,
        "v": 100
    },
    "lightsalmon": {
        "h": 17,
        "s": 52,
        "v": 100
    },
    "lightseagreen": {
        "h": 177,
        "s": 82,
        "v": 70
    },
    "lightskyblue": {
        "h": 203,
        "s": 46,
        "v": 98
    },
    "lightslategray": {
        "h": 210,
        "s": 22,
        "v": 60
    },
    "lightslategrey": {
        "h": 210,
        "s": 22,
        "v": 60
    },
    "lightsteelblue": {
        "h": 214,
        "s": 21,
        "v": 87
    },
    "lightyellow": {
        "h": 60,
        "s": 12,
        "v": 100
    },
    "lime": {
        "h": 120,
        "s": 100,
        "v": 100
    },
    "limegreen": {
        "h": 120,
        "s": 76,
        "v": 80
    },
    "linen": {
        "h": 30,
        "s": 8,
        "v": 98
    },
    "magenta": {
        "h": 300,
        "s": 100,
        "v": 100
    },
    "maroon": {
        "h": 0,
        "s": 100,
        "v": 50
    },
    "mediumaquamarine": {
        "h": 160,
        "s": 50,
        "v": 80
    },
    "mediumblue": {
        "h": 240,
        "s": 100,
        "v": 80
    },
    "mediumorchid": {
        "h": 288,
        "s": 60,
        "v": 83
    },
    "mediumpurple": {
        "h": 260,
        "s": 48,
        "v": 85
    },
    "mediumseagreen": {
        "h": 147,
        "s": 66,
        "v": 70
    },
    "mediumslateblue": {
        "h": 249,
        "s": 56,
        "v": 93
    },
    "mediumspringgreen": {
        "h": 157,
        "s": 100,
        "v": 98
    },
    "mediumturquoise": {
        "h": 178,
        "s": 66,
        "v": 82
    },
    "mediumvioletred": {
        "h": 322,
        "s": 89,
        "v": 78
    },
    "midnightblue": {
        "h": 240,
        "s": 78,
        "v": 44
    },
    "mintcream": {
        "h": 150,
        "s": 4,
        "v": 100
    },
    "mistyrose": {
        "h": 6,
        "s": 12,
        "v": 100
    },
    "moccasin": {
        "h": 38,
        "s": 29,
        "v": 100
    },
    "navajowhite": {
        "h": 36,
        "s": 32,
        "v": 100
    },
    "navy": {
        "h": 240,
        "s": 100,
        "v": 50
    },
    "oldlace": {
        "h": 39,
        "s": 9,
        "v": 99
    },
    "olive": {
        "h": 60,
        "s": 100,
        "v": 50
    },
    "olivedrab": {
        "h": 80,
        "s": 75,
        "v": 56
    },
    "orange": {
        "h": 39,
        "s": 100,
        "v": 100
    },
    "orangered": {
        "h": 16,
        "s": 100,
        "v": 100
    },
    "orchid": {
        "h": 302,
        "s": 49,
        "v": 85
    },
    "palegoldenrod": {
        "h": 55,
        "s": 29,
        "v": 93
    },
    "palegreen": {
        "h": 120,
        "s": 39,
        "v": 98
    },
    "paleturquoise": {
        "h": 180,
        "s": 26,
        "v": 93
    },
    "palevioletred": {
        "h": 340,
        "s": 48,
        "v": 85
    },
    "papayawhip": {
        "h": 37,
        "s": 16,
        "v": 100
    },
    "peachpuff": {
        "h": 28,
        "s": 27,
        "v": 100
    },
    "peru": {
        "h": 30,
        "s": 69,
        "v": 80
    },
    "pink": {
        "h": 350,
        "s": 25,
        "v": 100
    },
    "plum": {
        "h": 300,
        "s": 28,
        "v": 87
    },
    "powderblue": {
        "h": 187,
        "s": 23,
        "v": 90
    },
    "purple": {
        "h": 300,
        "s": 100,
        "v": 50
    },
    "red": {
        "h": 0,
        "s": 100,
        "v": 100
    },
    "rosybrown": {
        "h": 0,
        "s": 24,
        "v": 74
    },
    "royalblue": {
        "h": 225,
        "s": 71,
        "v": 88
    },
    "saddlebrown": {
        "h": 25,
        "s": 86,
        "v": 55
    },
    "salmon": {
        "h": 6,
        "s": 54,
        "v": 98
    },
    "sandybrown": {
        "h": 28,
        "s": 61,
        "v": 96
    },
    "seagreen": {
        "h": 146,
        "s": 67,
        "v": 55
    },
    "seashell": {
        "h": 25,
        "s": 7,
        "v": 100
    },
    "sienna": {
        "h": 19,
        "s": 72,
        "v": 63
    },
    "silver": {
        "h": 0,
        "s": 0,
        "v": 0.7529411764705882
    },
    "skyblue": {
        "h": 197,
        "s": 43,
        "v": 92
    },
    "slateblue": {
        "h": 248,
        "s": 56,
        "v": 80
    },
    "slategray": {
        "h": 210,
        "s": 22,
        "v": 56
    },
    "slategrey": {
        "h": 210,
        "s": 22,
        "v": 56
    },
    "snow": {
        "h": 0,
        "s": 2,
        "v": 100
    },
    "springgreen": {
        "h": 150,
        "s": 100,
        "v": 100
    },
    "steelblue": {
        "h": 207,
        "s": 61,
        "v": 71
    },
    "tan": {
        "h": 34,
        "s": 33,
        "v": 82
    },
    "teal": {
        "h": 180,
        "s": 100,
        "v": 50
    },
    "thistle": {
        "h": 300,
        "s": 12,
        "v": 85
    },
    "tomato": {
        "h": 9,
        "s": 72,
        "v": 100
    },
    "turquoise": {
        "h": 174,
        "s": 71,
        "v": 88
    },
    "violet": {
        "h": 300,
        "s": 45,
        "v": 93
    },
    "wheat": {
        "h": 39,
        "s": 27,
        "v": 96
    },
    "white": {
        "h": 0,
        "s": 0,
        "v": 1
    },
    "whitesmoke": {
        "h": 0,
        "s": 0,
        "v": 0.9607843137254902
    },
    "yellow": {
        "h": 60,
        "s": 100,
        "v": 100
    },
    "yellowgreen": {
        "h": 80,
        "s": 76,
        "v": 80
    }
	}

	const _colorParser = Object.freeze({
		parse: function (color) {
			arguments.length
			if (arguments.length == 0) {
				throw new Error(`COLOR_CONVERT_ERR:: Failed to execute 'parse' on 'ColorParser': 1 argument required, but only 0 present`);
			}

			if (color == undefined) {
				throw new Error("COLOR_CONVERT_ERR:: color is undefined");
			}

			// if ((typeof (color) == "string" || (color instanceof String)) == false) {
			// 	throw new TypeError("COLOR_CONVERT_ERR:: Invalid type, color must be type of string");
			// }

			if (typeof (color) == "string" || (color instanceof String)) {
				color = color.trim()

				if (/^(rgb)/i.test(color)) {
					return compileRGB(color)
				}
				if (/^(#)/i.test(color)) {
					return compileHEX(color)
				}
				const hsv = NAMED_COLORS[color.toLowerCase()]
				if (hsv != undefined) {
					return { ...hsv, a:1 }
				}
			}

			throw new Error("COLOR_CONVERT_ERR:: Color is not type of RGB, HSV, HSL or HEX color models");
		}
	})

	function compileRGB(color) {
		let r, g, b

		const regexRGBSpace = /^(rgb)\s{0,}\(\s{0,}([0-9]{1,})\s{0,}([0-9]{1,})\s{0,}([0-9]{1,})\s{0,}\)$/i
		const regexRGBComma = /^(rgb)\s{0,}\(\s{0,}([0-9]{1,})\s{0,},\s{0,}([0-9]{1,})\s{0,},\s{0,}([0-9]{1,})\s{0,}\)$/i
		const regexRGBASpace = /^(rgba)\s{0,}\(\s{0,}([0-9]{1,})\s{0,}([0-9]{1,})\s{0,}([0-9]{1,})\s{0,}([0-9]|(0\.([0-9]{1,})))\s{0,}\)$/i
		const regexRGBAComma = /^(rgba)\s{0,}\(\s{0,}([0-9]{1,})\s{0,},\s{0,}([0-9]{1,})\s{0,},\s{0,}([0-9]{1,})\s{0,},\s{0,}([0-9]|(0\.([0-9]{1,})))\s{0,}\)$/i

		if (regexRGBSpace.test(color) || regexRGBComma.test(color) || regexRGBASpace.test(color) || regexRGBAComma.test(color)) {
			const splitColor = color.split(/([0-9]{1,})/)
			r = parseInt(splitColor[1])
			g = parseInt(splitColor[3])
			b = parseInt(splitColor[5])

			if (r > 255) {
				throw new RangeError(`COLOR_CONVERT_ERR:: '${color}' --> ${r} is an invalid red color, it must be an interger between 0 and 255`)
			}
			if (g > 255) {
				throw new RangeError(`COLOR_CONVERT_ERR:: '${color}' --> ${g} is an invalid green color, it must be an interger between 0 and 255`)
			}
			if (b > 255) {
				throw new RangeError(`COLOR_CONVERT_ERR:: '${color}' --> ${b} is an invalid blue color, it must be an interger between 0 and 255`)
			}

			if (/^(rgba)/i.test(color)) {
				let a = NaN
				if (regexRGBASpace.test(color)) {
					a = parseFloat(color.split(/\s{1,}/g)[3])
				}
				else {
					a = parseFloat(color.split(",")[3])
				}

				if (a > 1) {
					throw new RangeError(`COLOR_CONVERT_ERR:: '${color}' --> ${a} is an invalid alpha color, it must be an interger or a float number between 0 and 1`)
				}

				return { r, g, b, a }
			}
			else {
				return { r, g, b, a: 1 }
			}
		}
		else {
			if (/^(rgba)/i.test(color)) {
				throw new SyntaxError(`COLOR_CONVERT_ERR:: '${color}' is an invalid RGBA color value`)
			}
			else {
				throw new SyntaxError(`COLOR_CONVERT_ERR:: '${color}' is an invalid RGB color value`)
			}
		}
	}

	function compileHEX(color) {
		let r, g, b, a = "FF"

		if (/^#[0-9a-f]{3}$/i.test(color)) {
			const splitColor = color.split(/([0-9a-f]{1})/i)
			r = splitColor[1].toUpperCase()
			g = splitColor[3].toUpperCase()
			b = splitColor[5].toUpperCase()
			r += r
			g += g
			b += b

			return { r, g, b, a };
		}
		if (/^#[0-9a-f]{4}$/i.test(color)) {
			const splitColor = color.split(/([0-9a-f]{1})/i)
			r = splitColor[1].toUpperCase()
			g = splitColor[3].toUpperCase()
			b = splitColor[5].toUpperCase()
			a = splitColor[7].toUpperCase()
			r += r
			g += g
			b += b
			a += a

			return { r, g, b, a }
		}
		if (/^#[0-9a-f]{6}$/i.test(color)) {
			const splitColor = color.split(/([0-9a-f]{2})/i)
			r = splitColor[1].toUpperCase()
			g = splitColor[3].toUpperCase()
			b = splitColor[5].toUpperCase()

			return { r, g, b, a };
		}
		if (/^#[0-9a-f]{8}$/i.test(color)) {
			const splitColor = color.split(/([0-9a-f]{2})/i)
			r = splitColor[1].toUpperCase()
			g = splitColor[3].toUpperCase()
			b = splitColor[5].toUpperCase()
			a = splitColor[7].toUpperCase()

			return { r, g, b, a }
		}

		throw new Error(`COLOR_CONVERT_ERR:: '${color}' is an invalid HEX color value`)
	}

	return _colorParser
})()