import { useEffect, useRef } from 'react';
import { Ellipse, Transformer } from 'react-konva';

const CircleComp = ({ shapeProps, isSelected, onSelect, onChange }) => {
	const shapeRef = useRef();
	const tfRef = useRef();

	useEffect(() => {
		if (isSelected) {
			tfRef.current.nodes([shapeRef.current]);
		}
	}, [isSelected]);

	return (
		<>
			<Ellipse
				onClick={onSelect}
				onTap={onSelect}
				ref={shapeRef}
				{...shapeProps}
				draggable={isSelected ? true : false}
				onDragEnd={(e) => {
					onChange({
						...shapeProps,
						x: e.target.x(),
						y: e.target.y(),
					});
				}}
				onTransformEnd={() => {
					const node = shapeRef.current;
					const scaleX = node.scaleX();
					const scaleY = node.scaleY();

					node.scaleX(1);
					node.scaleY(1);

					onChange({
						...shapeProps,
						x: node.x(),
						y: node.y(),
						radiusX: Math.max(5, node.radiusX() * scaleX),
						radiusY: Math.max(5, node.radiusY() * scaleY),
					});
				}}
			/>
			{isSelected && (
				<Transformer
					ref={tfRef}
					flipEnabled={false}
					centeredScaling={true}
					boundBoxFunc={(oldBox, newBox) => {
						if (
							Math.abs(newBox.width) < 5 ||
							Math.abs(newBox.height) < 5
						) {
							return oldBox;
						}
						return newBox;
					}}
				/>
			)}
		</>
	);
};

export default CircleComp;
