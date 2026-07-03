import { useEffect, useRef } from 'react';
import { RegularPolygon, Transformer } from 'react-konva';
import useCurrentTool from '../../hooks/useCurrentTool';
import {
	onDragMove,
	onTransform,
	transformerBoxFunc,
} from '../../util/Shape&TransformerFunctions';

const TriangleComp = ({ shapeProps, isSelected, onSelect, onChange }) => {
	const shapeRef = useRef();
	const tfRef = useRef();

	const currentTool = useCurrentTool();

	useEffect(() => {
		if (isSelected) {
			tfRef.current.nodes([shapeRef.current]);
		}
	}, [isSelected]);

	return (
		<>
			<RegularPolygon
				onClick={() => {
					onSelect();
				}}
				onTap={onSelect}
				ref={shapeRef}
				sides={3}
				x={shapeProps.x}
				y={shapeProps.y}
				fill={shapeProps.fill}
				stroke={
					shapeProps.strokeEnabled ? shapeProps.stroke : undefined
				}
				strokeWidth={shapeProps.strokeWidth ?? 1}
				cornerRadius={shapeProps.cornerRadius}
				strokeScaleEnabled={false}
				radius={shapeProps.radius}
				draggable={isSelected || currentTool === 'move'}
				onDragMove={() => onDragMove(shapeRef, shapeProps, onChange)}
				onTransform={() =>
					onTransform('triangle', shapeRef, shapeProps, onChange)
				}
			/>
			{isSelected && (
				<Transformer
					ref={tfRef}
					flipEnabled={false}
					centeredScaling={true}
					boundBoxFunc={transformerBoxFunc}
				/>
			)}
		</>
	);
};

export default TriangleComp;
