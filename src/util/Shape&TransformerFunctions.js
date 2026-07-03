export const transformerBoxFunc = (oldBox, newBox) => {
	if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
		return oldBox;
	}
	return newBox;
};

export const onDragMove = (shapeRef, shapeProps, onChange) => {
	const node = shapeRef.current;
	const newX = Math.round(node.x());
	const newY = Math.round(node.y());

	if (shapeProps.x !== newX || shapeProps.y !== newY) {
		onChange({
			...shapeProps,
			x: newX,
			y: newY,
		});
	}
};

export const onTransform = (shape, shapeRef, shapeProps, onChange) => {
	if (shape === 'rectangle' || shape === 'image') {
		const node = shapeRef.current;
		const scaleX = node.scaleX();
		const scaleY = node.scaleY();

		const newWidth = Math.max(5, node.width() * scaleX);
		const newHeight = Math.max(5, node.height() * scaleY);

		node.width(newWidth);
		node.height(newHeight);

		node.scaleX(1);
		node.scaleY(1);

		onChange({
			...shapeProps,
			x: Math.round(node.x()),
			y: Math.round(node.y()),
			width: newWidth,
			height: newHeight,
		});
		return;
	}
	if (shape === 'circle') {
		const node = shapeRef.current;
		const scaleX = node.scaleX();
		const scaleY = node.scaleY();

		node.scaleX(1);
		node.scaleY(1);

		onChange({
			...shapeProps,
			radiusX: Math.max(5, Math.round(node.radiusX() * scaleX)),
			radiusY: Math.max(5, Math.round(node.radiusY() * scaleY)),
		});
		return;
	}
	if (shape === 'triangle') {
		const node = shapeRef.current;
		const scaleX = node.scaleX();
		const scaleY = node.scaleY();

		const newWidth = Math.round((node.width() * scaleX * Math.sqrt(3)) / 2);
		const newHeight = Math.round(node.height() * scaleY * 0.75);

		onChange({
			...shapeProps,
			width: newWidth,
			height: newHeight,
		});
		return;
	}
	if (shape === 'manualShape') {
		const node = shapeRef.current;
		const scaleX = node.scaleX();
		const scaleY = node.scaleY();

		onChange({
			...shapeProps,
			width: Math.round(node.width() * scaleX),
			height: Math.round(node.height() * scaleY),
		});
		return;
	}
};
