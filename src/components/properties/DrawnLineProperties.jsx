import { useDispatch, useSelector } from 'react-redux';
import {
	changeShape,
	selectShapeProps,
	setProperty,
} from '../../store/slices/shapeSlice';
import useCurrentTool from '../../hooks/useCurrentTool';

const LINECAP_VALUES = ['butt', 'round', 'square'];
const LINEJOIN_VALUES = ['miter', 'round', 'bevel'];

const DrawnLineProperties = () => {
	const dispatch = useDispatch();

	const shapeProps = useSelector(selectShapeProps);
	const currentTool = useCurrentTool();

	const handleSelect = (e, prop) => {
		dispatch(setProperty({ prop, value: e.target.value }));
	};

	return (
		<section
			className="property-section"
			aria-labelledby="manual-size-title"
		>
			<h3 id="manual-size-title">Line Settings</h3>
			<div className="property-grid">
				<label className="property-field">
					<span>Tension</span>
					<input
						type="number"
						min="0"
						max="1"
						step="0.1"
						value={shapeProps.tension}
						onChange={(e) => {
							dispatch(
								setProperty({
									prop: 'tension',
									value: Number(e.target.value),
								}),
							);
						}}
					/>
				</label>
				{currentTool === 'draw' && (
					<>
						<label className="property-field">
							<span>Line Cap</span>
							<select
								onChange={(e) => handleSelect(e, 'lineCap')}
								value={shapeProps.lineCap}
							>
								{LINECAP_VALUES.map((value, index) => {
									return <option key={index}>{value}</option>;
								})}
							</select>
						</label>
						<label className="property-field">
							<span>Line Join</span>
							<select
								defaultValue={shapeProps.lineJoin}
								onChange={(e) => handleSelect(e, 'lineJoin')}
							>
								{LINEJOIN_VALUES.map((value, index) => {
									return <option key={index}>{value}</option>;
								})}
							</select>
						</label>
					</>
				)}
			</div>
		</section>
	);
};

export default DrawnLineProperties;
