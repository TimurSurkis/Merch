import { HexColorPicker } from 'react-colorful';
import { useDispatch, useSelector } from 'react-redux';
import {
	changeShape,
	selectColors,
	selectShapeProps,
	setColor,
	setProperty,
} from '../../store/slices/shapeSlice';
import useCurrentTool from '../../hooks/useCurrentTool';

const DefaultProperties = ({ shape }) => {
	const dispatch = useDispatch();
	const colors = useSelector(selectColors);
	const shapeProps = useSelector(selectShapeProps);

	const currentTool = useCurrentTool();

	const handleNumberChange = (property, value) => {
		if (value === '') return;

		const nextValue = Number(value);
		if (!Number.isFinite(nextValue)) return;

		dispatch(
			changeShape({
				id: shape.id,
				shape: {
					...shape,
					[property]: Math.round(nextValue),
				},
			}),
		);
	};

	const handleColorChange = (colorRole, color) => {
		if (shape) {
			dispatch(
				changeShape({
					id: shape.id,
					shape: {
						...shape,
						[colorRole]: color,
					},
				}),
			);
		}
		dispatch(
			setColor({
				colorRole,
				color,
			}),
		);
	};

	const handleStrokeWidthChange = (value) => {
		if (value === '') return;

		const nextValue = Number(value);
		if (!Number.isFinite(nextValue)) return;

		const strokeWidth = Math.max(1, Math.round(nextValue));

		if (shape) {
			dispatch(
				changeShape({
					id: shape.id,
					shape: {
						...shape,
						strokeWidth,
					},
				}),
			);
		}
		dispatch(
			setProperty({
				prop: 'strokeWidth',
				value: strokeWidth,
			}),
		);
	};

	const handleValueEnabledChange = (valueEnabled, isEnabled) => {
		if (shape) {
			dispatch(
				changeShape({
					id: shape.id,
					shape: {
						...shape,
						[value]: isEnabled,
						...(value === 'stroke' && {
							strokeWidth:
								shape.strokeWidth ?? shapeProps.strokeWidth,
						}),
					},
				}),
			);
		}

		dispatch(
			setProperty({
				prop: 'strokeEnabled',
				value: isEnabled,
			}),
		);
	};

	const fillEnabled = shape?.fillEnabled ?? true;
	const strokeEnabled = shape?.strokeEnabled ?? true;

	return (
		<div className="property-stack">
			{shape && (
				<section
					className="property-section"
					aria-labelledby="position-title"
				>
					<h3 id="position-title">Position</h3>
					<div className="property-grid">
						<label className="property-field">
							<span>X</span>
							<input
								type="number"
								value={shape?.x ?? 0}
								onChange={(e) =>
									handleNumberChange('x', e.target.value)
								}
							/>
						</label>
						<label className="property-field">
							<span>Y</span>
							<input
								type="number"
								value={shape?.y ?? 0}
								onChange={(e) =>
									handleNumberChange('y', e.target.value)
								}
							/>
						</label>
					</div>
				</section>
			)}
			{shape?.shapeType !== 'image' && (
				<section
					className="property-section"
					aria-labelledby="color-title"
				>
					<h3 id="color-title">
						{currentTool !== 'draw' && currentTool !== 'erase'
							? 'Color'
							: 'Stroke'}
					</h3>
					{currentTool !== 'erase' && (
						<div className="color-controls">
							{currentTool !== 'draw' && (
								<>
									<label className="color-field">
										<span>Fill</span>
										<HexColorPicker
											color={colors.fill}
											onChange={(newColor) =>
												handleColorChange(
													'fill',
													newColor,
												)
											}
										/>
									</label>
									<label className="value-toggle">
										<input
											type="checkbox"
											checked={fillEnabled}
											onChange={(e) =>
												handleValueEnabledChange(
													'fillEnabled',
													e.target.checked,
												)
											}
										/>
										<span>Fill on</span>
									</label>
								</>
							)}
							<label className="color-field">
								<span>Stroke</span>
								<div
									className={
										strokeEnabled
											? 'stroke-color-picker'
											: 'stroke-color-picker is-disabled'
									}
									aria-disabled={!strokeEnabled}
								>
									<HexColorPicker
										color={colors.stroke}
										onChange={(newColor) =>
											handleColorChange(
												'stroke',
												newColor,
											)
										}
									/>
								</div>
							</label>
						</div>
					)}
					<div className="stroke-controls">
						{currentTool !== 'draw' && currentTool !== 'erase' && (
							<label className="value-toggle">
								<input
									type="checkbox"
									checked={strokeEnabled}
									onChange={(e) =>
										handleValueEnabledChange(
											'strokeEnabled',
											e.target.checked,
										)
									}
								/>
								<span>Stroke on</span>
							</label>
						)}
						<label className="property-field">
							<span>Stroke Width</span>
							<input
								type="number"
								min="1"
								value={
									shape?.strokeWidth ?? shapeProps.strokeWidth
								}
								disabled={!strokeEnabled}
								onChange={(e) =>
									handleStrokeWidthChange(e.target.value)
								}
							/>
						</label>
					</div>
				</section>
			)}
		</div>
	);
};

export default DefaultProperties;
