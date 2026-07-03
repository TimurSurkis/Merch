import { useEffect, useRef } from 'react';
import { Ellipse, Transformer } from 'react-konva';
import useCurrentTool from '../../hooks/useCurrentTool';
import {
	onDragMove,
	onTransform,
	transformerBoxFunc,
} from '../../util/Shape&TransformerFunctions';

const CircleComp = ({ shapeProps, isSelected, onSelect, onChange }) => {
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
			<Ellipse
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
					onTransform('circle', shapeRef, shapeProps, onChange)
				}
			/>
			{isSelected && (
				<Transformer
					ref={tfRef}
					flipEnabled={false}
					enabledAnchors={[
						'top-left',
						'top-center',
						'top-right',
						'middle-right',
						'middle-left',
						'bottom-left',
						'bottom-center',
						'bottom-right',
					]}
					centeredScaling={true}
					boundBoxFunc={transformerBoxFunc}
				/>
			)}
		</>
	);
};

export default CircleComp;
