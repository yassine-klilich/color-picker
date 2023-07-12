const ColorParser = (function () {

	const NAMED_COLORS = [
		{
			name: "aliceblue",
			code: {
				red: "F0",
				green: "F8",
				blue: "FF",
				alpha: "FF"
			}
		},
		{
			name: "antiquewhite",
			code: {
				red: "FA",
				green: "EB",
				blue: "D7",
				alpha: "FF"
			}
		},
		{
			name: "aqua",
			code: {
				red: "00",
				green: "FF",
				blue: "FF",
				alpha: "FF"
			}
		},
		{
			name: "aquamarine",
			code: {
				red: "7F",
				green: "FF",
				blue: "D4",
				alpha: "FF"
			}
		},
		{
			name: "azure",
			code: {
				red: "F0",
				green: "FF",
				blue: "FF",
				alpha: "FF"
			}
		},
		{
			name: "beige",
			code: {
				red: "F5",
				green: "F5",
				blue: "DC",
				alpha: "FF"
			}
		},
		{
			name: "bisque",
			code: {
				red: "FF",
				green: "E4",
				blue: "C4",
				alpha: "FF"
			}
		},
		{
			name: "black",
			code: {
				red: "00",
				green: "00",
				blue: "00",
				alpha: "FF"
			}
		},
		{
			name: "blanchedalmond",
			code: {
				red: "FF",
				green: "EB",
				blue: "CD",
				alpha: "FF"
			}
		},
		{
			name: "blue",
			code: {
				red: "00",
				green: "00",
				blue: "FF",
				alpha: "FF"
			}
		},
		{
			name: "blueviolet",
			code: {
				red: "8A",
				green: "2B",
				blue: "E2",
				alpha: "FF"
			}
		},
		{
			name: "brown",
			code: {
				red: "A5",
				green: "2A",
				blue: "2A",
				alpha: "FF"
			}
		},
		{
			name: "burlywood",
			code: {
				red: "DE",
				green: "B8",
				blue: "87",
				alpha: "FF"
			}
		},
		{
			name: "cadetblue",
			code: {
				red: "5F",
				green: "9E",
				blue: "A0",
				alpha: "FF"
			}
		},
		{
			name: "chartreuse",
			code: {
				red: "7F",
				green: "FF",
				blue: "00",
				alpha: "FF"
			}
		},
		{
			name: "chocolate",
			code: {
				red: "D2",
				green: "69",
				blue: "1E",
				alpha: "FF"
			}
		},
		{
			name: "coral",
			code: {
				red: "FF",
				green: "7F",
				blue: "50",
				alpha: "FF"
			}
		},
		{
			name: "cornflowerblue",
			code: {
				red: "64",
				green: "95",
				blue: "ED",
				alpha: "FF"
			}
		},
		{
			name: "cornsilk",
			code: {
				red: "FF",
				green: "F8",
				blue: "DC",
				alpha: "FF"
			}
		},
		{
			name: "crimson",
			code: {
				red: "DC",
				green: "14",
				blue: "3C",
				alpha: "FF"
			}
		},
		{
			name: "cyan",
			code: {
				red: "00",
				green: "FF",
				blue: "FF",
				alpha: "FF"
			}
		},
		{
			name: "darkblue",
			code: {
				red: "00",
				green: "00",
				blue: "8B",
				alpha: "FF"
			}
		},
		{
			name: "darkcyan",
			code: {
				red: "00",
				green: "8B",
				blue: "8B",
				alpha: "FF"
			}
		},
		{
			name: "darkgoldenrod",
			code: {
				red: "B8",
				green: "86",
				blue: "0B",
				alpha: "FF"
			}
		},
		{
			name: "darkgray",
			code: {
				red: "A9",
				green: "A9",
				blue: "A9",
				alpha: "FF"
			}
		},
		{
			name: "darkgrey",
			code: {
				red: "A9",
				green: "A9",
				blue: "A9",
				alpha: "FF"
			}
		},
		{
			name: "darkgreen",
			code: {
				red: "00",
				green: "64",
				blue: "00",
				alpha: "FF"
			}
		},
		{
			name: "darkkhaki",
			code: {
				red: "BD",
				green: "B7",
				blue: "6B",
				alpha: "FF"
			}
		},
		{
			name: "darkmagenta",
			code: {
				red: "8B",
				green: "00",
				blue: "8B",
				alpha: "FF"
			}
		},
		{
			name: "darkolivegreen",
			code: {
				red: "55",
				green: "6B",
				blue: "2F",
				alpha: "FF"
			}
		},
		{
			name: "darkorange",
			code: {
				red: "FF",
				green: "8C",
				blue: "00",
				alpha: "FF"
			}
		},
		{
			name: "darkorchid",
			code: {
				red: "99",
				green: "32",
				blue: "CC",
				alpha: "FF"
			}
		},
		{
			name: "darkred",
			code: {
				red: "8B",
				green: "00",
				blue: "00",
				alpha: "FF"
			}
		},
		{
			name: "darksalmon",
			code: {
				red: "E9",
				green: "96",
				blue: "7A",
				alpha: "FF"
			}
		},
		{
			name: "darkseagreen",
			code: {
				red: "8F",
				green: "BC",
				blue: "8F",
				alpha: "FF"
			}
		},
		{
			name: "darkslateblue",
			code: {
				red: "48",
				green: "3D",
				blue: "8B",
				alpha: "FF"
			}
		},
		{
			name: "darkslategray",
			code: {
				red: "2F",
				green: "4F",
				blue: "4F",
				alpha: "FF"
			}
		},
		{
			name: "darkslategrey",
			code: {
				red: "2F",
				green: "4F",
				blue: "4F",
				alpha: "FF"
			}
		},
		{
			name: "darkturquoise",
			code: {
				red: "00",
				green: "CE",
				blue: "D1",
				alpha: "FF"
			}
		},
		{
			name: "darkviolet",
			code: {
				red: "94",
				green: "00",
				blue: "D3",
				alpha: "FF"
			}
		},
		{
			name: "deeppink",
			code: {
				red: "FF",
				green: "14",
				blue: "93",
				alpha: "FF"
			}
		},
		{
			name: "deepskyblue",
			code: {
				red: "00",
				green: "BF",
				blue: "FF",
				alpha: "FF"
			}
		},
		{
			name: "dimgray",
			code: {
				red: "69",
				green: "69",
				blue: "69",
				alpha: "FF"
			}
		},
		{
			name: "dimgrey",
			code: {
				red: "69",
				green: "69",
				blue: "69",
				alpha: "FF"
			}
		},
		{
			name: "dodgerblue",
			code: {
				red: "1E",
				green: "90",
				blue: "FF",
				alpha: "FF"
			}
		},
		{
			name: "firebrick",
			code: {
				red: "B2",
				green: "22",
				blue: "22",
				alpha: "FF"
			}
		},
		{
			name: "floralwhite",
			code: {
				red: "FF",
				green: "FA",
				blue: "F0",
				alpha: "FF"
			}
		},
		{
			name: "forestgreen",
			code: {
				red: "22",
				green: "8B",
				blue: "22",
				alpha: "FF"
			}
		},
		{
			name: "fuchsia",
			code: {
				red: "FF",
				green: "00",
				blue: "FF",
				alpha: "FF"
			}
		},
		{
			name: "gainsboro",
			code: {
				red: "DC",
				green: "DC",
				blue: "DC",
				alpha: "FF"
			}
		},
		{
			name: "ghostwhite",
			code: {
				red: "F8",
				green: "F8",
				blue: "FF",
				alpha: "FF"
			}
		},
		{
			name: "gold",
			code: {
				red: "FF",
				green: "D7",
				blue: "00",
				alpha: "FF"
			}
		},
		{
			name: "goldenrod",
			code: {
				red: "DA",
				green: "A5",
				blue: "20",
				alpha: "FF"
			}
		},
		{
			name: "gray",
			code: {
				red: "80",
				green: "80",
				blue: "80",
				alpha: "FF"
			}
		},
		{
			name: "grey",
			code: {
				red: "80",
				green: "80",
				blue: "80",
				alpha: "FF"
			}
		},
		{
			name: "green",
			code: {
				red: "00",
				green: "80",
				blue: "00",
				alpha: "FF"
			}
		},
		{
			name: "greenyellow",
			code: {
				red: "AD",
				green: "FF",
				blue: "2F",
				alpha: "FF"
			}
		},
		{
			name: "honeydew",
			code: {
				red: "F0",
				green: "FF",
				blue: "F0",
				alpha: "FF"
			}
		},
		{
			name: "hotpink",
			code: {
				red: "FF",
				green: "69",
				blue: "B4",
				alpha: "FF"
			}
		},
		{
			name: "indianred ",
			code: {
				red: "CD",
				green: "5C",
				blue: "5C",
				alpha: "FF"
			}
		},
		{
			name: "indigo ",
			code: {
				red: "4B",
				green: "00",
				blue: "82",
				alpha: "FF"
			}
		},
		{
			name: "ivory",
			code: {
				red: "FF",
				green: "FF",
				blue: "F0",
				alpha: "FF"
			}
		},
		{
			name: "khaki",
			code: {
				red: "F0",
				green: "E6",
				blue: "8C",
				alpha: "FF"
			}
		},
		{
			name: "lavender",
			code: {
				red: "E6",
				green: "E6",
				blue: "FA",
				alpha: "FF"
			}
		},
		{
			name: "lavenderblush",
			code: {
				red: "FF",
				green: "F0",
				blue: "F5",
				alpha: "FF"
			}
		},
		{
			name: "lawngreen",
			code: {
				red: "7C",
				green: "FC",
				blue: "00",
				alpha: "FF"
			}
		},
		{
			name: "lemonchiffon",
			code: {
				red: "FF",
				green: "FA",
				blue: "CD",
				alpha: "FF"
			}
		},
		{
			name: "lightblue",
			code: {
				red: "AD",
				green: "D8",
				blue: "E6",
				alpha: "FF"
			}
		},
		{
			name: "lightcoral",
			code: {
				red: "F0",
				green: "80",
				blue: "80",
				alpha: "FF"
			}
		},
		{
			name: "lightcyan",
			code: {
				red: "E0",
				green: "FF",
				blue: "FF",
				alpha: "FF"
			}
		},
		{
			name: "lightgoldenrodyellow",
			code: {
				red: "FA",
				green: "FA",
				blue: "D2",
				alpha: "FF"
			}
		},
		{
			name: "lightgray",
			code: {
				red: "D3",
				green: "D3",
				blue: "D3",
				alpha: "FF"
			}
		},
		{
			name: "lightgrey",
			code: {
				red: "D3",
				green: "D3",
				blue: "D3",
				alpha: "FF"
			}
		},
		{
			name: "lightgreen",
			code: {
				red: "90",
				green: "EE",
				blue: "90",
				alpha: "FF"
			}
		},
		{
			name: "lightpink",
			code: {
				red: "FF",
				green: "B6",
				blue: "C1",
				alpha: "FF"
			}
		},
		{
			name: "lightsalmon",
			code: {
				red: "FF",
				green: "A0",
				blue: "7A",
				alpha: "FF"
			}
		},
		{
			name: "lightseagreen",
			code: {
				red: "20",
				green: "B2",
				blue: "AA",
				alpha: "FF"
			}
		},
		{
			name: "lightskyblue",
			code: {
				red: "87",
				green: "CE",
				blue: "FA",
				alpha: "FF"
			}
		},
		{
			name: "lightslategray",
			code: {
				red: "77",
				green: "88",
				blue: "99",
				alpha: "FF"
			}
		},
		{
			name: "lightslategrey",
			code: {
				red: "77",
				green: "88",
				blue: "99",
				alpha: "FF"
			}
		},
		{
			name: "lightsteelblue",
			code: {
				red: "B0",
				green: "C4",
				blue: "DE",
				alpha: "FF"
			}
		},
		{
			name: "lightyellow",
			code: {
				red: "FF",
				green: "FF",
				blue: "E0",
				alpha: "FF"
			}
		},
		{
			name: "lime",
			code: {
				red: "00",
				green: "FF",
				blue: "00",
				alpha: "FF"
			}
		},
		{
			name: "limegreen",
			code: {
				red: "32",
				green: "CD",
				blue: "32",
				alpha: "FF"
			}
		},
		{
			name: "linen",
			code: {
				red: "FA",
				green: "F0",
				blue: "E6",
				alpha: "FF"
			}
		},
		{
			name: "magenta",
			code: {
				red: "FF",
				green: "00",
				blue: "FF",
				alpha: "FF"
			}
		},
		{
			name: "maroon",
			code: {
				red: "80",
				green: "00",
				blue: "00",
				alpha: "FF"
			}
		},
		{
			name: "mediumaquamarine",
			code: {
				red: "66",
				green: "CD",
				blue: "AA",
				alpha: "FF"
			}
		},
		{
			name: "mediumblue",
			code: {
				red: "00",
				green: "00",
				blue: "CD",
				alpha: "FF"
			}
		},
		{
			name: "mediumorchid",
			code: {
				red: "BA",
				green: "55",
				blue: "D3",
				alpha: "FF"
			}
		},
		{
			name: "mediumpurple",
			code: {
				red: "93",
				green: "70",
				blue: "D8",
				alpha: "FF"
			}
		},
		{
			name: "mediumseagreen",
			code: {
				red: "3C",
				green: "B3",
				blue: "71",
				alpha: "FF"
			}
		},
		{
			name: "mediumslateblue",
			code: {
				red: "7B",
				green: "68",
				blue: "EE",
				alpha: "FF"
			}
		},
		{
			name: "mediumspringgreen",
			code: {
				red: "00",
				green: "FA",
				blue: "9A",
				alpha: "FF"
			}
		},
		{
			name: "mediumturquoise",
			code: {
				red: "48",
				green: "D1",
				blue: "CC",
				alpha: "FF"
			}
		},
		{
			name: "mediumvioletred",
			code: {
				red: "C7",
				green: "15",
				blue: "85",
				alpha: "FF"
			}
		},
		{
			name: "midnightblue",
			code: {
				red: "19",
				green: "19",
				blue: "70",
				alpha: "FF"
			}
		},
		{
			name: "mintcream",
			code: {
				red: "F5",
				green: "FF",
				blue: "FA",
				alpha: "FF"
			}
		},
		{
			name: "mistyrose",
			code: {
				red: "FF",
				green: "E4",
				blue: "E1",
				alpha: "FF"
			}
		},
		{
			name: "moccasin",
			code: {
				red: "FF",
				green: "E4",
				blue: "B5",
				alpha: "FF"
			}
		},
		{
			name: "navajowhite",
			code: {
				red: "FF",
				green: "DE",
				blue: "AD",
				alpha: "FF"
			}
		},
		{
			name: "navy",
			code: {
				red: "00",
				green: "00",
				blue: "80",
				alpha: "FF"
			}
		},
		{
			name: "oldlace",
			code: {
				red: "FD",
				green: "F5",
				blue: "E6",
				alpha: "FF"
			}
		},
		{
			name: "olive",
			code: {
				red: "80",
				green: "80",
				blue: "00",
				alpha: "FF"
			}
		},
		{
			name: "olivedrab",
			code: {
				red: "6B",
				green: "8E",
				blue: "23",
				alpha: "FF"
			}
		},
		{
			name: "orange",
			code: {
				red: "FF",
				green: "A5",
				blue: "00",
				alpha: "FF"
			}
		},
		{
			name: "orangered",
			code: {
				red: "FF",
				green: "45",
				blue: "00",
				alpha: "FF"
			}
		},
		{
			name: "orchid",
			code: {
				red: "DA",
				green: "70",
				blue: "D6",
				alpha: "FF"
			}
		},
		{
			name: "palegoldenrod",
			code: {
				red: "EE",
				green: "E8",
				blue: "AA",
				alpha: "FF"
			}
		},
		{
			name: "palegreen",
			code: {
				red: "98",
				green: "FB",
				blue: "98",
				alpha: "FF"
			}
		},
		{
			name: "paleturquoise",
			code: {
				red: "AF",
				green: "EE",
				blue: "EE",
				alpha: "FF"
			}
		},
		{
			name: "palevioletred",
			code: {
				red: "D8",
				green: "70",
				blue: "93",
				alpha: "FF"
			}
		},
		{
			name: "papayawhip",
			code: {
				red: "FF",
				green: "EF",
				blue: "D5",
				alpha: "FF"
			}
		},
		{
			name: "peachpuff",
			code: {
				red: "FF",
				green: "DA",
				blue: "B9",
				alpha: "FF"
			}
		},
		{
			name: "peru",
			code: {
				red: "CD",
				green: "85",
				blue: "3F",
				alpha: "FF"
			}
		},
		{
			name: "pink",
			code: {
				red: "FF",
				green: "C0",
				blue: "CB",
				alpha: "FF"
			}
		},
		{
			name: "plum",
			code: {
				red: "DD",
				green: "A0",
				blue: "DD",
				alpha: "FF"
			}
		},
		{
			name: "powderblue",
			code: {
				red: "B0",
				green: "E0",
				blue: "E6",
				alpha: "FF"
			}
		},
		{
			name: "purple",
			code: {
				red: "80",
				green: "00",
				blue: "80",
				alpha: "FF"
			}
		},
		{
			name: "red",
			code: {
				red: "FF",
				green: "00",
				blue: "00",
				alpha: "FF"
			}
		},
		{
			name: "rosybrown",
			code: {
				red: "BC",
				green: "8F",
				blue: "8F",
				alpha: "FF"
			}
		},
		{
			name: "royalblue",
			code: {
				red: "41",
				green: "69",
				blue: "E1",
				alpha: "FF"
			}
		},
		{
			name: "saddlebrown",
			code: {
				red: "8B",
				green: "45",
				blue: "13",
				alpha: "FF"
			}
		},
		{
			name: "salmon",
			code: {
				red: "FA",
				green: "80",
				blue: "72",
				alpha: "FF"
			}
		},
		{
			name: "sandybrown",
			code: {
				red: "F4",
				green: "A4",
				blue: "60",
				alpha: "FF"
			}
		},
		{
			name: "seagreen",
			code: {
				red: "2E",
				green: "8B",
				blue: "57",
				alpha: "FF"
			}
		},
		{
			name: "seashell",
			code: {
				red: "FF",
				green: "F5",
				blue: "EE",
				alpha: "FF"
			}
		},
		{
			name: "sienna",
			code: {
				red: "A0",
				green: "52",
				blue: "2D",
				alpha: "FF"
			}
		},
		{
			name: "silver",
			code: {
				red: "C0",
				green: "C0",
				blue: "C0",
				alpha: "FF"
			}
		},
		{
			name: "skyblue",
			code: {
				red: "87",
				green: "CE",
				blue: "EB",
				alpha: "FF"
			}
		},
		{
			name: "slateblue",
			code: {
				red: "6A",
				green: "5A",
				blue: "CD",
				alpha: "FF"
			}
		},
		{
			name: "slategray",
			code: {
				red: "70",
				green: "80",
				blue: "90",
				alpha: "FF"
			}
		},
		{
			name: "slategrey",
			code: {
				red: "70",
				green: "80",
				blue: "90",
				alpha: "FF"
			}
		},
		{
			name: "snow",
			code: {
				red: "FF",
				green: "FA",
				blue: "FA",
				alpha: "FF"
			}
		},
		{
			name: "springgreen",
			code: {
				red: "00",
				green: "FF",
				blue: "7F",
				alpha: "FF"
			}
		},
		{
			name: "steelblue",
			code: {
				red: "46",
				green: "82",
				blue: "B4",
				alpha: "FF"
			}
		},
		{
			name: "tan",
			code: {
				red: "D2",
				green: "B4",
				blue: "8C",
				alpha: "FF"
			}
		},
		{
			name: "teal",
			code: {
				red: "00",
				green: "80",
				blue: "80",
				alpha: "FF"
			}
		},
		{
			name: "thistle",
			code: {
				red: "D8",
				green: "BF",
				blue: "D8",
				alpha: "FF"
			}
		},
		{
			name: "tomato",
			code: {
				red: "FF",
				green: "63",
				blue: "47",
				alpha: "FF"
			}
		},
		{
			name: "turquoise",
			code: {
				red: "40",
				green: "E0",
				blue: "D0",
				alpha: "FF"
			}
		},
		{
			name: "violet",
			code: {
				red: "EE",
				green: "82",
				blue: "EE",
				alpha: "FF"
			}
		},
		{
			name: "wheat",
			code: {
				red: "F5",
				green: "DE",
				blue: "B3",
				alpha: "FF"
			}
		},
		{
			name: "white",
			code: {
				red: "FF",
				green: "FF",
				blue: "FF",
				alpha: "FF"
			}
		},
		{
			name: "whitesmoke",
			code: {
				red: "F5",
				green: "F5",
				blue: "F5",
				alpha: "FF"
			}
		},
		{
			name: "yellow",
			code: {
				red: "FF",
				green: "FF",
				blue: "00",
				alpha: "FF"
			}
		},
		{
			name: "yellowgreen",
			code: {
				red: "9A",
				green: "CD",
				blue: "32",
				alpha: "FF"
			}
		}
	];

	const _colorParser = Object.freeze({
		parse: function (color) {
			arguments.length
			if (arguments.length == 0) {
				throw new Error(`COLOR_CONVERT_ERR:: Failed to execute 'parse' on 'ColorParser': 1 argument required, but only 0 present`);
			}

			if (color == undefined) {
				throw new Error("COLOR_CONVERT_ERR:: color is undefined");
			}

			if (isString(color) == false) {
				throw new TypeError("COLOR_CONVERT_ERR:: Invalid type, color must be type of string");
			}

			color = color.trim();

			if (/^(rgb)/i.test(color)) {
				return compileRGB(color);
			}
			if (/^(hsv)/i.test(color)) {
				return compileHSV(color);
			}
			if (/^(hsl)/i.test(color)) {
				return compileHSL(color);
			}
			if (/^(#)/i.test(color)) {
				return compileHEX(color);
			}
			const namedColor = NAMED_COLORS.find(item => item.name == color.toLowerCase());
			if (namedColor != undefined) {
				return namedColor["code"];
			}

			throw new Error("COLOR_CONVERT_ERR:: Color is not type of RGB, HSV, HSL or HEX color models");
		}
	})

	function compileRGB(color) {
		let red, green, blue;

		const regexRGBSpace = /^(rgb)\s{0,}\(\s{0,}([0-9]{1,})\s{0,}([0-9]{1,})\s{0,}([0-9]{1,})\s{0,}\)$/i;
		const regexRGBComma = /^(rgb)\s{0,}\(\s{0,}([0-9]{1,})\s{0,},\s{0,}([0-9]{1,})\s{0,},\s{0,}([0-9]{1,})\s{0,}\)$/i;
		const regexRGBASpace = /^(rgba)\s{0,}\(\s{0,}([0-9]{1,})\s{0,}([0-9]{1,})\s{0,}([0-9]{1,})\s{0,}([0-9]|(0\.([0-9]{1,})))\s{0,}\)$/i;
		const regexRGBAComma = /^(rgba)\s{0,}\(\s{0,}([0-9]{1,})\s{0,},\s{0,}([0-9]{1,})\s{0,},\s{0,}([0-9]{1,})\s{0,},\s{0,}([0-9]|(0\.([0-9]{1,})))\s{0,}\)$/i;

		if (regexRGBSpace.test(color) || regexRGBComma.test(color) || regexRGBASpace.test(color) || regexRGBAComma.test(color)) {
			let splitedValues = color.split(/([0-9]{1,})/);
			red = parseInt(splitedValues[1]);
			green = parseInt(splitedValues[3]);
			blue = parseInt(splitedValues[5]);

			if (red > 255) {
				throw new RangeError(`COLOR_CONVERT_ERR:: '${color}' --> ${red} is an invalid red color, it must be an interger between 0 and 255`);
			}
			if (green > 255) {
				throw new RangeError(`COLOR_CONVERT_ERR:: '${color}' --> ${green} is an invalid green color, it must be an interger between 0 and 255`);
			}
			if (blue > 255) {
				throw new RangeError(`COLOR_CONVERT_ERR:: '${color}' --> ${blue} is an invalid blue color, it must be an interger between 0 and 255`);
			}

			if (/^(rgba)/i.test(color)) {
				let alpha = NaN;
				if (regexRGBASpace.test(color)) {
					alpha = parseFloat(color.split(/\s{1,}/g)[3]);
				}
				else {
					alpha = parseFloat(color.split(",")[3]);
				}

				if (alpha > 1) {
					throw new RangeError(`COLOR_CONVERT_ERR:: '${color}' --> ${alpha} is an invalid alpha color, it must be an interger or a float number between 0 and 1`);
				}

				return { red, green, blue, alpha };
			}
			else {
				return { red, green, blue, alpha: 1 };
			}
		}
		else {
			if (/^(rgba)/i.test(color)) {
				throw new SyntaxError(`COLOR_CONVERT_ERR:: '${color}' is an invalid RGBA color value`);
			}
			else {
				throw new SyntaxError(`COLOR_CONVERT_ERR:: '${color}' is an invalid RGB color value`);
			}
		}
	}

	function compileHSV(color) {
		let hue, saturate, value;

		const regexHSVSpace = /^(hsv)\s{0,}\(\s{0,}([0-9]{1,})\s{0,}((deg)|(°)){0,1}\s{0,}([0-9]{1,})\s{0,}(%)\s{0,}([0-9]{1,})\s{0,}(%)\s{0,}\)$/i;
		const regexHSVComma = /^(hsv)\s{0,}\(\s{0,}([0-9]{1,})\s{0,}((deg)|(°)){0,1}\s{0,},\s{0,}([0-9]{1,})\s{0,}(%)\s{0,},\s{0,}([0-9]{1,})\s{0,}(%)\s{0,}\)$/i;
		const regexHSVASpace = /^(hsva)\s{0,}\(\s{0,}([0-9]{1,})\s{0,}((deg)|(°)){0,1}\s{0,}([0-9]{1,})\s{0,}(%)\s{0,}([0-9]{1,})\s{0,}(%)\s{0,}([0-9]|(0\.([0-9]{1,})))\s{0,}\)$/i;
		const regexHSVAComma = /^(hsva)\s{0,}\(\s{0,}([0-9]{1,})\s{0,}((deg)|(°)){0,1}\s{0,},\s{0,}([0-9]{1,})\s{0,}(%)\s{0,},\s{0,}([0-9]{1,})\s{0,}(%)\s{0,},\s{0,}([0-9]|(0\.([0-9]{1,})))\s{0,}\)$/i;

		if (regexHSVSpace.test(color) || regexHSVComma.test(color) || regexHSVASpace.test(color) || regexHSVAComma.test(color)) {
			let splitedValues = color.split(/([0-9]{1,})/);
			hue = parseInt(splitedValues[1]);
			saturate = parseInt(splitedValues[3]);
			value = parseInt(splitedValues[5]);

			if (hue > 360) {
				throw new RangeError(`COLOR_CONVERT_ERR:: '${color}' --> ${hue} is an invalid hue value, it must be an interger between 0 and 360`);
			}
			if (saturate > 100) {
				throw new RangeError(`COLOR_CONVERT_ERR:: '${color}' --> ${saturate} is an invalid saturate value, it must be an interger between 0 and 100`);
			}
			if (value > 100) {
				throw new RangeError(`COLOR_CONVERT_ERR:: '${color}' --> ${value} is an invalid value value, it must be an interger between 0 and 100`);
			}

			if (/^(hsva)/i.test(color)) {
				let alpha = NaN;
				if (regexHSVASpace.test(color)) {
					alpha = parseFloat(color.split(/\s{1,}/g)[3]);
				}
				else {
					alpha = parseFloat(color.split(",")[3]);
				}

				if (alpha > 1) {
					throw new RangeError(`COLOR_CONVERT_ERR:: '${color}' --> ${alpha} is an invalid alpha value, it must be an interger or a float number between 0 and 1`);
				}

				return { hue, saturate, value, alpha };
			}
			else {
				return { hue, saturate, value, alpha: 1 };
			}
		}
		else {
			if (/^(hsva)/i.test(color)) {
				throw new SyntaxError(`COLOR_CONVERT_ERR:: '${color}' is an invalid HSVA color value`);
			}
			else {
				throw new SyntaxError(`COLOR_CONVERT_ERR:: '${color}' is an invalid HSV color value`);
			}
		}
	}

	function compileHSL(color) {
		let hue, saturate, lightness;

		const regexHSLSpace = /^(hsl)\s{0,}\(\s{0,}([0-9]{1,})\s{0,}((deg)|(°)){0,1}\s{0,}([0-9]{1,})\s{0,}(%)\s{0,}([0-9]{1,})\s{0,}(%)\s{0,}\)$/i;
		const regexHSLComma = /^(hsl)\s{0,}\(\s{0,}([0-9]{1,})\s{0,}((deg)|(°)){0,1}\s{0,},\s{0,}([0-9]{1,})\s{0,}(%)\s{0,},\s{0,}([0-9]{1,})\s{0,}(%)\s{0,}\)$/i;
		const regexHSLASpace = /^(hsla)\s{0,}\(\s{0,}([0-9]{1,})\s{0,}((deg)|(°)){0,1}\s{0,}([0-9]{1,})\s{0,}(%)\s{0,}([0-9]{1,})\s{0,}(%)\s{0,}([0-9]|(0\.([0-9]{1,})))\s{0,}\)$/i;
		const regexHSLAComma = /^(hsla)\s{0,}\(\s{0,}([0-9]{1,})\s{0,}((deg)|(°)){0,1}\s{0,},\s{0,}([0-9]{1,})\s{0,}(%)\s{0,},\s{0,}([0-9]{1,})\s{0,}(%)\s{0,},\s{0,}([0-9]|(0\.([0-9]{1,})))\s{0,}\)$/i;

		if (regexHSLSpace.test(color) || regexHSLComma.test(color) || regexHSLASpace.test(color) || regexHSLAComma.test(color)) {
			let splitedValues = color.split(/([0-9]{1,})/);
			hue = parseInt(splitedValues[1]);
			saturate = parseInt(splitedValues[3]);
			lightness = parseInt(splitedValues[5]);

			if (hue > 360) {
				throw new RangeError(`COLOR_CONVERT_ERR:: '${color}' --> ${hue} is an invalid hue value, it must be an interger between 0 and 360`);
			}
			if (saturate > 100) {
				throw new RangeError(`COLOR_CONVERT_ERR:: '${color}' --> ${saturate} is an invalid saturate value, it must be an interger between 0 and 100`);
			}
			if (lightness > 100) {
				throw new RangeError(`COLOR_CONVERT_ERR:: '${color}' --> ${lightness} is an invalid lightness value, it must be an interger between 0 and 100`);
			}

			if (/^(hsla)/i.test(color)) {
				let alpha = NaN;
				if (regexHSLASpace.test(color)) {
					alpha = parseFloat(color.split(/\s{1,}/g)[3]);
				}
				else {
					alpha = parseFloat(color.split(",")[3]);
				}

				if (alpha > 1) {
					throw new RangeError(`COLOR_CONVERT_ERR:: '${color}' --> ${alpha} is an invalid alpha value, it must be an interger or a float number between 0 and 1`);
				}

				return { hue, saturate, lightness, alpha };
			}
			else {
				return { hue, saturate, lightness, alpha: 1 };
			}
		}
		else {
			if (/^(hsla)/i.test(color)) {
				throw new SyntaxError(`COLOR_CONVERT_ERR:: '${color}' is an invalid HSLA color value`);
			}
			else {
				throw new SyntaxError(`COLOR_CONVERT_ERR:: '${color}' is an invalid HSL color value`);
			}
		}
	}

	function compileHEX(color) {
		let red, green, blue, alpha = "FF";

		if (/^#[0-9a-f]{3}$/i.test(color)) {
			const splitColor = color.split(/([0-9a-f]{1})/i);
			red = splitColor[1].toUpperCase();
			green = splitColor[3].toUpperCase();
			blue = splitColor[5].toUpperCase();
			red += red;
			green += green;
			blue += blue;

			return { red, green, blue, alpha };
		}
		if (/^#[0-9a-f]{4}$/i.test(color)) {
			const splitColor = color.split(/([0-9a-f]{1})/i);
			red = splitColor[1].toUpperCase();
			green = splitColor[3].toUpperCase();
			blue = splitColor[5].toUpperCase();
			alpha = splitColor[7].toUpperCase();
			red += red;
			green += green;
			blue += blue;
			alpha += alpha;

			return { red, green, blue, alpha };
		}
		if (/^#[0-9a-f]{6}$/i.test(color)) {
			const splitColor = color.split(/([0-9a-f]{2})/i);
			red = splitColor[1].toUpperCase();
			green = splitColor[3].toUpperCase();
			blue = splitColor[5].toUpperCase();

			return { red, green, blue, alpha };
		}
		if (/^#[0-9a-f]{8}$/i.test(color)) {
			const splitColor = color.split(/([0-9a-f]{2})/i);
			red = splitColor[1].toUpperCase();
			green = splitColor[3].toUpperCase();
			blue = splitColor[5].toUpperCase();
			alpha = splitColor[7].toUpperCase();

			return { red, green, blue, alpha };
		}

		throw new Error(`COLOR_CONVERT_ERR:: '${color}' is an invalid HEX color value`);
	}

	function isString(value) {
		return (typeof (value) == "string" || (value instanceof String));
	}

	return _colorParser;
})()