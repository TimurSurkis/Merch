import { useSelector } from 'react-redux';
import { selectSelectedId, selectShapeById } from '../store/slices/shapeSlice';
import DefaultProperties from './properties/DefaultProperties';
import RectProperties from './properties/RectProperties';
import TriProperties from './properties/TriangleProperties';
import ManualShProperties from './properties/ManualShProperties';
import CircleProperties from './properties/CircleProperties';
import ImageProperties from './properties/ImageProperties';
import useCurrentTool from '../hooks/useCurrentTool';
import DrawnLineProperties from './properties/DrawnLineProperties';

const Properties = () => {
	const selectedId = useSelector(selectSelectedId);
	const currentTool = useCurrentTool();

	const propertyComponents = {
		rectangle: RectProperties,
		triangle: TriProperties,
		manualShape: ManualShProperties,
		circle: CircleProperties,
		image: ImageProperties,
		draw: DrawnLineProperties,
		erase: DrawnLineProperties,
	};

	const selectedShape = useSelector((state) =>
		selectShapeById(state, selectedId),
	);

	const activeType = selectedShape?.shapeType || currentTool;
	const PropertiesComponent = propertyComponents[activeType];

	const stopEPropagation = (e) => {
		e.stopPropagation();
	};

	return (
		<aside
			onKeyDown={stopEPropagation}
			onKeyUp={stopEPropagation}
			className="properties-panel"
			aria-label="Properties panel"
		>
			<div className="panel-header">
				<span className="panel-kicker">Selection</span>
				<h2>Properties</h2>
			</div>
			{selectedId === null && currentTool === 'move' ? (
				<div className="property-placeholder">No item selected</div>
			) : (
				<>
					<DefaultProperties shape={selectedShape} />
					{PropertiesComponent && (
						<PropertiesComponent shape={selectedShape} />
					)}
				</>
			)}
		</aside>
	);
};

export default Properties;
