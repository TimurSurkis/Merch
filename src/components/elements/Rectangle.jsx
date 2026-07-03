import { useEffect, useRef } from 'react';
import { Rect, Transformer } from 'react-konva';
import useCurrentTool from '../../hooks/useCurrentTool';
import {
	onDragMove,
	onTransform,
	transformerBoxFunc,
} from '../../util/Shape&TransformerFunctions';

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange }) => {
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
			<Rect
				onClick={onSelect}
				onTap={onSelect}
				ref={shapeRef}
				{...shapeProps}
				stroke={
					shapeProps.strokeEnabled ? shapeProps.stroke : undefined
				}
				strokeWidth={shapeProps.strokeWidth ?? 1}
				draggable={isSelected || currentTool === 'move'}
				onDragMove={() => onDragMove(shapeRef, shapeProps, onChange)}
				onTransform={() =>
					onTransform('rectangle', shapeRef, shapeProps, onChange)
				}
			/>
			{isSelected && (
				<Transformer
					ref={tfRef}
					flipEnabled={false}
					boundBoxFunc={transformerBoxFunc}
				/>
			)}
		</>
	);
};

export default Rectangle;
