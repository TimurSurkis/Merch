import { useEffect, useRef } from 'react';
import { Line, Transformer } from 'react-konva';

const ManualShape = ({ shapeProps, isSelected, onSelect, onChange }) => {
	const shapeRef = useRef();
	const tfRef = useRef();

	useEffect(() => {
		if (isSelected) {
			tfRef.current.nodes([shapeRef.current]);
		}
	}, [isSelected]);

	return (
		<>
			<Line
				onClick={() => {
					console.log(isSelected);
					onSelect();
				}}
				onTap={onSelect}
				ref={shapeRef}
				x={shapeProps.x}
				y={shapeProps.y}
				points={shapeProps.points}
				tension={0}
				fill={shapeProps.fill}
				stroke={'white'}
				closed
				draggable={isSelected}
				onDragEnd={(e) => {
					onChange({
						...shapeProps,
						x: e.target.x(),
						y: e.target.y(),
					});
				}}
				onTransformEnd={() => {
					const node = shapeRef.current;

					onChange({
						...shapeProps,
						x: node.x(),
						y: node.y(),
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

export default ManualShape;
