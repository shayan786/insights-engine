import * as d3 from 'd3';

export function truncateText(text) {
	const LENGTH = 10;

	return text.length > LENGTH ? `${text.substring(0, LENGTH)}...` : text;
}

export function abbreviateText(text) {
	const LENGTH = 10;

	return text.length > LENGTH ? `${text.match(/\b([A-Z])/g).join('')}` : text;
}

export function wrap(text, width) {
	text.each(function() {
		var text = d3.select(this),
		words = text.text().split(/\s+/).reverse(),
		word,
		line = [],
		lineNumber = 0, //<-- 0!
		lineHeight = 1.2, // ems
		x = text.attr("x"), //<-- include the x!
		y = text.attr("y"),
		dy = text.attr("dy") || 0, //<-- null check
		tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
		while (word = words.pop()) {
			line.push(word);
			tspan.text(line.join(" "));
			if (tspan.node().getComputedTextLength() > width) {
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			}
		}
	});
}

export function randomTime (seconds) {
	const ms = 1000 * seconds;

	return Math.random() * (ms - 200) + 200
}

export function randomPercent () {
	return Math.ceil(Math.random() * 100);
}

export function randomInteger (floor = 0, ceil, includeZero = null) {
	return Math.ceil(Math.random() * ceil + (includeZero ? 0 : 1) + floor);
}

export function randomDecimal (ceil) {
	return (Math.random() * ceil).toFixed(2);
}

export function getStatusColor (status) {
	switch (status) {
		case 'up':
			return '#c1e2b0';
		case 'warning':
			return '#FEC405';
		case 'down':
			return '#950000';
		default:
			return '#297994';
	}
}

export function getStatusBgColor (status) {
	switch (status) {
		case 'up':
			return '#fff';
		case 'warning':
			return '#fcf8e0';
		case 'down':
			return '#ffe4e0';
		default:
			return '#FFF';
	}
}

export function getStatusBgSelectedColor (status) {
	switch (status) {
		case 'up':
			return '#e7f4df';
		case 'warning':
			return '#fcf8e0';
		case 'down':
			return '#ffe4e0';
		default:
			return '#FFF';
	}
}

export function getStatusFontColor (status) {
	switch (status) {
		case 'up':
			return '#333333';
		case 'warning':
			return '#333333';
		case 'down':
			return '#950000';
		default:
			return '#333333';
	}
}

export function getStatusFontWeight (status) {
	switch (status) {
		case 'up':
			return '0';
		case 'warning':
			return '1';
		case 'down':
			return '1';
		default:
			return '0';
	}
}

export function getPercentColor (percent) {
	if (percent <= 60)
		return '#35B14A';
	else if (percent > 60 && percent <= 80)
		return '#FEC405';
	else
		return '#950000';
}

export function getRandomStatus () {
	const percent = randomPercent();

	if (percent <= 80)
		return 'up';
	else if (percent > 80 && percent <= 90)
		return 'warning';
	else
		return 'down';
}

export function isIp (address) {
	return (/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/).test(address);
}

export function getInterfaces (amount) {
	let interfaces = [];

	for (let i = 0; i <= amount; i++) {
		interfaces.push({
			index: i,
			name: `eth0/${i}`,
			status: getRandomStatus()
		});
	}

	return interfaces;
}

export function getTransformation(transform) {
  // Create a dummy g for calculation purposes only. This will never
  // be appended to the DOM and will be discarded once this function 
  // returns.
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  
  // Set the transform attribute to the provided string value.
  g.setAttributeNS(null, "transform", transform);
  
  // consolidate the SVGTransformList containing all transformations
  // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
  // its SVGMatrix. 
  var matrix = g.transform.baseVal.consolidate().matrix;
  
  // Below calculations are taken and adapted from the private function
  // transform/decompose.js of D3's module d3-interpolate.
  var {a, b, c, d, e, f} = matrix;   // ES6, if this doesn't work, use below assignment
  // var a=matrix.a, b=matrix.b, c=matrix.c, d=matrix.d, e=matrix.e, f=matrix.f; // ES5
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * 180 / Math.PI,
    skewX: Math.atan(skewX) * 180 / Math.PI,
    scaleX: scaleX,
    scaleY: scaleY
  };
}

export function getLineWithMidPoints (x1, y1, x2, y2) {
	return `${x1} ${y1}, ${(x1+x2)/2} ${(y1+y2)/2}, ${x2} ${y2}`;
}

export function getMidPoint(x1, y1, x2, y2) {
	return {
		x: (x1+x2)/2,
		y: (y1+y2)/2
	};
}