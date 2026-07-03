import { LuSquare } from 'react-icons/lu';
import { LuCircle } from 'react-icons/lu';
import { LuTriangle } from 'react-icons/lu';
import { PiPolygonFill } from 'react-icons/pi';
import { IoIosArrowDown } from 'react-icons/io';
import { LuShapes } from 'react-icons/lu';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentTool } from '../../store/slices/toolSlice';
import useCurrentTool from '../../hooks/useCurrentTool';

const ShapeSelect = () => {
	const dispatch = useDispatch();
	const [shapesListHidden, setShapesListHidden] = useState(true);
	const tools = {
		rectangle: LuSquare,
		circle: LuCircle,
		triangle: LuTriangle,
		manualShape: PiPolygonFill,
	};

	const currentTool = useCurrentTool();

	function toggleShapesList() {
		setShapesListHidden((prev) => !prev);
	}

	const setTool = (tool) => {
		dispatch(setCurrentTool({ tool }));
		toggleShapesList();
	};

	const SelectedIcon = tools[currentTool];

	return (
		<div className="shapes">
			<button
				type="button"
				className={`tool-btn shape-select-btn ${currentTool && SelectedIcon ? 'is-active' : ''}`}
				aria-label="Choose shape tool"
				aria-expanded={!shapesListHidden}
				onClick={() => {
					toggleShapesList();
				}}
			>
				{currentTool && SelectedIcon ? (
					<SelectedIcon className="icon" />
				) : (
					<LuShapes className="icon" />
				)}
				<IoIosArrowDown className="list-arrow" />
			</button>
			<div className={`shapes-list ${shapesListHidden ? 'hidden' : ''}`}>
				<button
					type="button"
					onClick={() => {
						setTool('rectangle');
					}}
					className={`tool-btn ${currentTool === 'rectangle' ? 'is-active' : ''}`}
					aria-label="Rectangle"
				>
					<LuSquare className="icon" />
				</button>
				<button
					type="button"
					onClick={() => setTool('circle')}
					className={`tool-btn ${currentTool === 'circle' ? 'is-active' : ''}`}
					aria-label="Circle"
				>
					<LuCircle className="icon" />
				</button>
				<button
					type="button"
					onClick={() => setTool('triangle')}
					className={`tool-btn ${currentTool === 'triangle' ? 'is-active' : ''}`}
					aria-label="Triangle"
				>
					<LuTriangle className="icon" />
				</button>
				<button
					type="button"
					onClick={() => setTool('manualShape')}
					className={`tool-btn ${currentTool === 'manualShape' ? 'is-active' : ''}`}
					aria-label="Freeform shape"
				>
					<PiPolygonFill className="icon" />
				</button>
			</div>
		</div>
	);
};

export default ShapeSelect;
