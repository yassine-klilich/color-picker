
function _mouseLeave() {
	// this.DOM.classList.remove("box--show");
}

function _mouseEnter() {
	// this.DOM.wrapper.classList.add("box--show");

	const { target } = this.options;

	let _position = position;
	const targetRect = target.getBoundingClientRect();
	const boxRect = box.getBoundingClientRect();
	const scrollTop = document.documentElement.scrollTop;
	const scrollLeft = document.documentElement.scrollLeft;

	const _stateSpaceInTop = enoughSpaceInTheTop(
		scrollTop,
		targetRect.top,
		boxRect.height
	);
	const _stateSpaceInBottom = enoughSpaceInTheBottom(
		scrollTop,
		targetRect.top,
		targetRect.height,
		boxRect.height
	);
	const _stateSpaceInLeft = enoughSpaceInTheLeft(
		scrollLeft,
		targetRect.left,
		boxRect.width
	);
	const _stateSpaceInRight = enoughSpaceInTheRight(
		scrollLeft,
		targetRect.left,
		targetRect.width,
		boxRect.width
	);

	const states = {
		t: _stateSpaceInTop,
		b: _stateSpaceInBottom,
		l: _stateSpaceInLeft,
		r: _stateSpaceInRight,
	};
	let positions = "";

	for (let i = 0; i < positionFlipOrder.length; i++) {
		positions += positionFlipOrder[i] + states[positionFlipOrder[i]];
	}

	let bestPositions = "";
	let secondPositions = "";

	for (let i = 1; i < positions.length; i += 2) {
		const state = positions[i];
		if (state == 2) {
			bestPositions = bestPositions + positions[i - 1];
		}
		if (state == 1) {
			secondPositions = secondPositions + positions[i - 1];
		}
	}

	if (bestPositions != "") {
		if (bestPositions.includes(_position) == false) {
			_position = bestPositions[0];
		}
	} else if (secondPositions != "") {
		if (secondPositions.includes(_position) == false) {
			_position = secondPositions[0];
		}
	} else {
		_position = BOTTOM;
	}

	setPositionAxis(getPositionAxis(_position, targetRect, boxRect));
}

/**
 *
 * @param {string} position
 * @param {DOMRect} targetRect
 * @param {DOMRect} boxRect
 * @returns
 */
function getPositionAxis(position, targetRect, boxRect) {
	let x_axis = 0;
	let y_axis = 0;

	switch (position) {
		case TOP:
			y_axis = targetRect.top - boxRect.height;
			x_axis = targetRect.left + targetRect.width / 2 - boxRect.width / 2;
			break;

		case BOTTOM:
			y_axis = targetRect.top + targetRect.height;
			x_axis = targetRect.left + targetRect.width / 2 - boxRect.width / 2;
			break;

		case LEFT:
			y_axis = targetRect.top + targetRect.height / 2 - boxRect.height / 2;
			x_axis = targetRect.left - boxRect.width;
			break;

		case RIGHT:
			y_axis = targetRect.top + targetRect.height / 2 - boxRect.height / 2;
			x_axis = targetRect.left + targetRect.width;
			break;
	}

	return {
		x: x_axis < 0 ? 0 : x_axis,
		y: y_axis < 0 ? 0 : y_axis,
	};
}

function setPositionAxis(positionAxis) {
	const { x, y } = positionAxis;

	box.style.top = `${y}px`;
	box.style.left = `${x}px`;
}

function getPageHeight() {
	return Math.max(
		document.body.scrollHeight,
		document.documentElement.scrollHeight,
		document.body.offsetHeight,
		document.documentElement.offsetHeight,
		document.body.clientHeight,
		document.documentElement.clientHeight
	);
}

function getPageWidth() {
	return Math.max(
		document.body.scrollWidth,
		document.documentElement.scrollWidth,
		document.body.offsetWidth,
		document.documentElement.offsetWidth,
		document.body.clientWidth,
		document.documentElement.clientWidth
	);
}

function enoughSpaceInTheTop(scrollTop, targetTop, boxHeight) {
	if (scrollTop + targetTop >= boxHeight) {
		if (targetTop >= boxHeight) {
			return 2;
		}
		return 1;
	}
	return 0;
}

function enoughSpaceInTheBottom(scrollTop, targetTop, targetHeight, boxHeight) {
	if (getPageHeight() - (scrollTop + targetTop + targetHeight) >= boxHeight) {
		if (window.innerHeight - (targetTop + targetHeight) >= boxHeight) {
			return 2;
		}
		return 1;
	}
	return 0;
}

function enoughSpaceInTheLeft(scrollLeft, targetLeft, boxWidth) {
	if (scrollLeft + targetLeft >= boxWidth) {
		if (targetLeft >= boxWidth) {
			return 2;
		}
		return 1;
	}
	return 0;
}

function enoughSpaceInTheRight(scrollLeft, targetLeft, targetWidth, boxWidth) {
	if (getPageWidth() - (scrollLeft + targetLeft + targetWidth) >= boxWidth) {
		if (window.innerWidth - (targetLeft + targetWidth) >= boxWidth) {
			return 2;
		}
		return 1;
	}
	return 0;
}
