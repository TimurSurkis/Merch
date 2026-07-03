import { useDispatch, useSelector } from 'react-redux';
import {
	changeShape,
	selectShapeProps,
	setProperty,
} from '../../store/slices/shapeSlice';

const TriProperties = ({ shape }) => {
	const dispatch = useDispatch();

	const shapeProps = useSelector(selectShapeProps);

	const handleSizeChange = (property, value) => {
		if (value === '') return;

		const nextValue = Number(value);
		if (!Number.isFinite(nextValue)) return;

		const nextSize = Math.max(5, Math.round(nextValue));
		const nextRadius =
			property === 'width' ? nextSize / Math.sqrt(3) : nextSize / 1.5;

		dispatch(
			changeShape({
				id: shape.id,
				shape: {
					...shape,
					radius: nextRadius,
					width: Math.round(nextRadius * Math.sqrt(3)),
					height: Math.round(nextRadius * 1.5),
				},
			}),
		);
	};

	const handleCornerRadiusChange = (value) => {
		if (value === '') return;

		const nextValue = Number(value);
		if (!Number.isFinite(nextValue)) return;

		const cornerRadius = Math.max(0, Math.round(nextValue));

		if (shape) {
			dispatch(
				changeShape({
					id: shape.id,
					shape: {
						...shape,
						cornerRadius,
					},
				}),
			);
		}
		dispatch(
			setProperty({
				prop: 'cornerRadius',
				value: cornerRadius,
			}),
		);
	};

	return (
		<section
			className="property-section"
			aria-labelledby="triangle-size-title"
		>
			<h3 id="triangle-size-title">Size</h3>
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
					<span>Corner Radius</span>
					<input
						type="number"
						min="0"
						value={shape?.cornerRadius ?? shapeProps.cornerRadius}
						onChange={(e) =>
							handleCornerRadiusChange(e.target.value)
						}
					/>
				</label>
			</div>
		</section>
	);
};

export default TriProperties;
