import { useEffect, useRef } from 'react';
import { Rect, Transformer } from 'react-konva';

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange }) => {
	const shapeRef = useRef();
	const tfRef = useRef();

	useEffect(() => {
		if (isSelected) {
			tfRef.current.nodes([shapeRef.current]);
		}
	}, [isSelected]);

	return (
		<>
			<Rect
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
						width: Math.max(5, node.width() * scaleX),
						height: Math.max(5, node.height() * scaleY),
					});
				}}
			/>
			{isSelected && (
				<Transformer
					ref={tfRef}
					flipEnabled={false}
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

export default Rectangle;
