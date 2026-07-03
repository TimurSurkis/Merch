import { useDispatch, useSelector } from 'react-redux';
import {
	changeShape,
	selectShapeProps,
	setProperty,
} from '../../store/slices/shapeSlice';

const ImageProperties = ({ shape }) => {
	const dispatch = useDispatch();

	const shapeProps = useSelector(selectShapeProps);

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

	const width = Math.round(shape.width);
	const height = Math.round(shape.height);

	return (
		<section
			className="property-section"
			aria-labelledby="image-shape-title"
		>
			<h3 id="image-shape-title">Shape</h3>
			<div className="property-grid">
				{shape && (
					<>
						<label className="property-field">
							<span>Width</span>
							<input
								type="number"
								min="5"
								value={width ?? 0}
								onChange={(e) =>
									dispatch(
										changeShape({
											id: shape.id,
											shape: {
												...shape,
												width: Number(e.target.value),
											},
										}),
									)
								}
							/>
						</label>
						<label className="property-field">
							<span>Height</span>
							<input
								type="number"
								min="5"
								value={height ?? 0}
								onChange={(e) =>
									dispatch(
										changeShape({
											id: shape.id,
											shape: {
												...shape,
												height: Number(e.target.value),
											},
										}),
									)
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

export default ImageProperties;
