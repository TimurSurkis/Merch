import { useEffect, useRef } from 'react';
import { Line, Transformer } from 'react-konva';
import useCurrentTool from '../../hooks/useCurrentTool';
import {
	onTransform,
	transformerBoxFunc,
} from '../../util/Shape&TransformerFunctions';

const ManualShape = ({ shapeProps, isSelected, onSelect, onChange }) => {
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
				tension={shapeProps.tension}
				strokeScaleEnabled={false}
				fill={shapeProps.fill}
				stroke={
					shapeProps.strokeEnabled ? shapeProps.stroke : undefined
				}
				strokeWidth={shapeProps.strokeWidth ?? 1}
				closed
				draggable={isSelected || currentTool === 'move'}
				onDragMove={() => onDragMove(shapeRef, shapeProps, onChange)}
				onTransform={() => onTransform('manualShape', shapeRef, shapeProps, onChange)}
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

export default ManualShape;
