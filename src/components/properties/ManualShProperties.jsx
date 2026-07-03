import { useDispatch, useSelector } from 'react-redux';
import {
	changeShape,
	selectShapeProps,
	setProperty,
} from '../../store/slices/shapeSlice';

const ManualShProperties = ({ shape }) => {
	const dispatch = useDispatch();

	const shapeProps = useSelector(selectShapeProps);

	const handleSizeChange = (property, value) => {
		if (value === '') return;

		const nextValue = Number(value);
		if (!Number.isFinite(nextValue)) return;

		const nextSize = Math.max(5, Math.round(nextValue));
		const currentSize = Math.max(1, shape[property] ?? 1);
		const scale = nextSize / currentSize;
		const points = shape.points.map((point, index) => {
			const shouldScale =
				(property === 'width' && index % 2 === 0) ||
				(property === 'height' && index % 2 !== 0);

			return shouldScale ? Math.round(point * scale) : point;
		});

		if (shape) {
			dispatch(
				changeShape({
					id: shape.id,
					shape: {
						...shape,
						[property]: nextSize,
						points,
					},
				}),
			);
		}
	};

	return (
		<section
			className="property-section"
			aria-labelledby="manual-size-title"
		>
			<h3 id="manual-size-title">Shape</h3>
			<div className="property-grid">
				{shape && (
					<>
						<label className="property-field">
							<span>Width</span>
							<input
								type="number"
								min="5"
								value={shape.width ?? 0}
								onChange={(e) =>
									handleSizeChange('width', e.target.value)
								}
							/>
						</label>
						<label className="property-field">
							<span>Height</span>
							<input
								type="number"
								min="5"
								value={shape.height ?? 0}
								onChange={(e) =>
									handleSizeChange('height', e.target.value)
								}
							/>
						</label>
					</>
				)}
				<label className="property-field">
					<span>Tension</span>
					<input
						type="number"
						min="0"
						max="1"
						step="0.1"
						value={shape?.tension ?? shapeProps.tension}
						onChange={(e) => {
							shape &&
								dispatch(
									changeShape({
										id: shape.id,
										shape: {
											...shape,
											tension: Number(e.target.value),
										},
									}),
								);

							dispatch(
								setProperty({
									prop: 'tension',
									value: Number(e.target.value),
								}),
							);
						}}
					/>
				</label>
			</div>
		</section>
	);
};

export default ManualShProperties;
