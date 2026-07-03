import { useDispatch } from 'react-redux';
import { changeShape } from '../../store/slices/shapeSlice';

const CircleProperties = ({ shape }) => {
	const dispatch = useDispatch();

	const handleRadiusChange = (property, value) => {
		if (value === '') return;

		const nextValue = Number(value);
		if (!Number.isFinite(nextValue)) return;

		if (shape) {
			dispatch(
				changeShape({
					id: shape.id,
					shape: {
						...shape,
						[property]: Math.max(5, Math.round(nextValue)),
					},
				}),
			);
		}
	};

	return (
		shape && (
			<section
				className="property-section"
				aria-labelledby="radius-title"
			>
				<h3 id="radius-title">Size</h3>
				<div className="property-grid">
					<label className="property-field">
						<span>X Radius</span>
						<input
							type="number"
							min="5"
							value={shape.radiusX ?? 0}
							onChange={(e) =>
								handleRadiusChange('radiusX', e.target.value)
							}
						/>
					</label>
					<label className="property-field">
						<span>Y Radius</span>
						<input
							type="number"
							min="5"
							value={shape.radiusY ?? 0}
							onChange={(e) =>
								handleRadiusChange('radiusY', e.target.value)
							}
						/>
					</label>
				</div>
			</section>
		)
	);
};

export default CircleProperties;
