import { LuSquare } from 'react-icons/lu';
import { LuCircle } from 'react-icons/lu';
import { LuTriangle } from 'react-icons/lu';
import { PiPolygonFill } from 'react-icons/pi';
import { IoIosArrowDown } from 'react-icons/io';
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
				className="tool-btn shape-select-btn"
				onClick={() => {
					toggleShapesList();
				}}
			>
				{currentTool && (
					<SelectedIcon
						className="icon
				"
					/>
				)}
				<IoIosArrowDown className="list-arrow" />
			</button>
			<div className={`shapes-list ${shapesListHidden ? 'hidden' : ''}`}>
				<button
					onClick={() => {
						setTool('rectangle');
					}}
					className="tool-btn"
				>
					<LuSquare className="icon" />
				</button>
				<button onClick={() => setTool('circle')} className="tool-btn">
					<LuCircle className="icon" />
				</button>
				<button
					onClick={() => setTool('triangle')}
					className="tool-btn"
				>
					<LuTriangle className="icon" />
				</button>
				<button
					onClick={() => setTool('manualShape')}
					className="tool-btn"
				>
					<PiPolygonFill className="icon" />
				</button>
			</div>
		</div>
	);
};

export default ShapeSelect;
