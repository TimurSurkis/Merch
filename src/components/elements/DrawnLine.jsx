import { useEffect, useRef } from 'react';
import {
	onDragMove,
	onTransform,
	transformerBoxFunc,
} from '../../util/Shape&TransformerFunctions';
import useCurrentTool from '../../hooks/useCurrentTool';
import { Line } from 'react-konva';

const DrawnLine = ({ shapeProps, onChange }) => {
	const shapeRef = useRef();
	const tfRef = useRef();

	const currentTool = useCurrentTool();

	return (
		<>
			<Line
				ref={shapeRef}
				x={shapeProps.x}
				y={shapeProps.y}
				points={shapeProps.points}
				tension={shapeProps.tension}
				strokeScaleEnabled={false}
				lineCap={shapeProps.lineCap}
				lineJoin={shapeProps.lineJoin}
				globalCompositeOperation={shapeProps.globalCompositeOperation}
				stroke={shapeProps.stroke}
				strokeWidth={shapeProps.strokeWidth ?? 1}
				onDragMove={() => onDragMove(shapeRef, shapeProps, onChange)}
				onTransform={() =>
					onTransform('manualShape', shapeRef, shapeProps, onChange)
				}
				listening={false}
			/>
		</>
	);
};

export default DrawnLine;
