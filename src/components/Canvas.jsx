import { useCallback, useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Ellipse, RegularPolygon, Line } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';

import Rectangle from './elements/Rectangle';
import ImageComp from './elements/ImageComp';
import CircleComp from './elements/Circle';
import TriangleComp from './elements/Triangle';
import ManualShape from './elements/ManualShape';

import { useDispatch, useSelector } from 'react-redux';
import useCurrentTool from '../hooks/useCurrentTool';
import {
	addShape,
	changeShape,
	selectColors,
	selectSelectedId,
	selectShapeProps,
	selectShapes,
	setSelectedId,
	shapeRemoveAndCleanup,
} from '../store/slices/shapeSlice';
import DrawnLine from './elements/DrawnLine';

let shapeBase = {
	shapeType: null,
	x: 0,
	y: 0,
	id: null,
};

const Canvas = ({ size }) => {
	const dispatch = useDispatch();
	const currentTool = useCurrentTool();

	const shapes = useSelector(selectShapes);
	const selectedId = useSelector(selectSelectedId);
	const colors = useSelector(selectColors);
	const shapeProps = useSelector(selectShapeProps);

	const [drawingShape, setDrawingShape] = useState(false);
	const [shape, setShape] = useState({
		...shapeBase,
		fill: colors.fill,
		stroke: colors.stroke,
		strokeWidth: shapeProps.strokeWidth,
		strokeEnabled: shapeProps.strokeEnabled,
	});
	const stageRef = useRef(null);

	const handleSelectId = useCallback(
		(id) => {
			dispatch(setSelectedId(id));
		},
		[dispatch],
	);

	const handleMouseDown = (e) => {
		const clickedOnEmpty = e.target === e.target.getStage();
		if (clickedOnEmpty && selectedId !== null) handleSelectId(null);

		if (currentTool === null || !clickedOnEmpty || selectedId !== null) {
			return;
		}

		const stage = stageRef.current;

		if (stage) {
			const pointerPos = stage.getPointerPosition();
			const { x, y } = pointerPos;
			if (currentTool === 'manualShape') {
				if (!drawingShape) {
					setDrawingShape(true);
					setShape({
						...shape,
						fill: colors.fill,
						fillEnabled: shapeProps.fillEnabled,
						stroke: colors.stroke,
						strokeWidth: shapeProps.strokeWidth,
						strokeEnabled: shapeProps.strokeEnabled,
						tension: shapeProps.tension,
						x: Math.round(x),
						y: Math.round(y),
						points: [0, 0, 0, 0],
					});
					return;
				}

				setShape({
					...shape,
					points: [...shape.points, x - shape.x, y - shape.y],
				});
			} else {
				setDrawingShape(true);
				if (currentTool === 'draw' || currentTool === 'erase') {
					setShape({
						...shape,
						stroke: colors.stroke,
						strokeWidth: shapeProps.strokeWidth,
						lineCap: shapeProps.lineCap,
						lineJoin: shapeProps.lineJoin,
						tension: shapeProps.tension,
						globalCompositeOperation:
							currentTool === 'erase'
								? 'destination-out'
								: 'source-over',
						x: Math.round(x),
						y: Math.round(y),
						points: [0, 0, 0, 0],
					});
					return;
				}
				setShape({
					...shape,
					fill: colors.fill,
					fillEnabled: shapeProps.fillEnabled,
					stroke: colors.stroke,
					strokeWidth: shapeProps.strokeWidth,
					strokeEnabled: shapeProps.strokeEnabled,
					...(currentTool !== 'circle' && {
						cornerRadius: shapeProps.cornerRadius,
					}),
					x,
					y,
				});
			}
		}
	};

	const trackMousePos = (e) => {
		const stage = stageRef.current;

		const isShiftPressed = e.evt.shiftKey;

		if (stage && drawingShape) {
			const pointerPos = stage.getPointerPosition();
			const { x, y } = pointerPos;

			if (currentTool === 'rectangle') {
				setShape({
					...shape,
					width: x - shape.x,
					height: isShiftPressed ? x - shape.x : y - shape.y,
				});
			} else if (currentTool === 'circle') {
				setShape({
					...shape,
					radiusX: Math.round(x - shape.x),
					radiusY: isShiftPressed
						? Math.round(x - shape.x)
						: Math.round(y - shape.y),
				});
			} else if (currentTool === 'triangle') {
				const radius = Math.sqrt(
					Math.pow(x - shape.x, 2) + Math.pow(y - shape.y, 2),
				);
				const width = Math.round(radius * Math.sqrt(3));
				const height = Math.round(radius * 1.5);
				setShape({
					...shape,
					radius,
					width,
					height,
				});
			} else if (currentTool === 'manualShape') {
				const newPoints = [...shape.points];

				newPoints[newPoints.length - 2] = x - shape.x;
				newPoints[newPoints.length - 1] = y - shape.y;

				setShape({
					...shape,
					points: newPoints,
				});
			} else if (currentTool === 'draw' || currentTool === 'erase') {
				setShape({
					...shape,
					points: [...shape.points, x - shape.x, y - shape.y],
				});
			}
		}
	};

	const endDrawShape = () => {
		if (currentTool === 'manualShape') return;
		setDrawingShape(false);

		const neededKeys = ['width', 'height', 'radius', 'radiusX', 'radiusY'];
		const hasKey = neededKeys.some((key) => Object.hasOwn(shape, key));

		if (!hasKey && currentTool !== 'draw' && currentTool !== 'erase') {
			setShape({
				...shapeBase,
				fill: colors.fill,
				stroke: colors.stroke,
				strokeWidth: shapeProps.strokeWidth,
				strokeEnabled: shapeProps.strokeEnabled,
			});
			return;
		}

		const shapeId = uuidv4();
		if (currentTool !== null) {
			dispatch(
				addShape({ ...shape, shapeType: currentTool, id: shapeId }),
			);
		}
		setShape(shapeBase);
	};

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Delete' || e.key === 'Backspace') {
				if (selectedId) {
					dispatch(shapeRemoveAndCleanup(selectedId));
					handleSelectId(null);
				}
			}

			if (drawingShape && e.key === 'Escape') {
				setDrawingShape(false);
				setShape({
					...shapeBase,
					fill: colors.fill,
					stroke: colors.stroke,
					strokeWidth: shapeProps.strokeWidth,
					strokeEnabled: shapeProps.strokeEnabled,
				});
			}

			if (
				currentTool === 'manualShape' &&
				e.key === 'Enter' &&
				drawingShape
			) {
				setDrawingShape(false);

				const pointsX = shape.points.filter(
					(_, index) => index % 2 === 0,
				);
				const pointsY = shape.points.filter(
					(_, index) => index % 2 !== 0,
				);

				const largestX = Math.max(...pointsX);
				const largestY = Math.max(...pointsY);
				const smallestX = Math.min(...pointsX);
				const smallestY = Math.min(...pointsY);

				const width = Math.round(largestX - smallestX);
				const height = Math.round(largestY - smallestY);

				const shapeId = uuidv4();
				dispatch(
					addShape({
						...shape,
						shapeType: currentTool,
						width,
						height,
						points: shape.points.slice(0, -2),
						id: shapeId,
					}),
				);
				setShape({
					...shapeBase,
					fill: colors.fill,
					stroke: colors.stroke,
					strokeWidth: shapeProps.strokeWidth,
					strokeEnabled: shapeProps.strokeEnabled,
				});
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [
		colors.fill,
		colors.stroke,
		currentTool,
		dispatch,
		drawingShape,
		handleSelectId,
		selectedId,
		shape,
		shapeProps.strokeEnabled,
		shapeProps.strokeWidth,
	]);

	return (
		<Stage
			ref={stageRef}
			width={size.width}
			height={size.height}
			onMouseDown={handleMouseDown}
			onTouchStart={handleMouseDown}
			onMouseMove={trackMousePos}
			onMouseUp={drawingShape && endDrawShape}
		>
			<Layer>
				{!!shapes.length &&
					shapes.map((shape) => {
						if (shape.shapeType === 'rectangle') {
							return (
								<Rectangle
									key={shape.id}
									shapeProps={shape}
									onChange={(newAttrs) => {
										dispatch(
											changeShape({
												id: shape.id,
												shape: newAttrs,
											}),
										);
									}}
									isSelected={shape.id === selectedId}
									onSelect={() => handleSelectId(shape.id)}
								/>
							);
						}

						if (shape.shapeType === 'image') {
							return (
								<ImageComp
									key={shape.id}
									image={shape}
									isSelected={shape.id === selectedId}
									onSelect={() => handleSelectId(shape.id)}
									onChange={(newAttrs) =>
										dispatch(
											changeShape({
												id: shape.id,
												shape: newAttrs,
											}),
										)
									}
								/>
							);
						}

						if (shape.shapeType === 'circle') {
							return (
								<CircleComp
									key={shape.id}
									shapeProps={shape}
									isSelected={shape.id === selectedId}
									onSelect={() => handleSelectId(shape.id)}
									onChange={(newAttrs) =>
										dispatch(
											changeShape({
												id: shape.id,
												shape: newAttrs,
											}),
										)
									}
								/>
							);
						}

						if (shape.shapeType === 'triangle') {
							return (
								<TriangleComp
									key={shape.id}
									shapeProps={shape}
									isSelected={shape.id === selectedId}
									onSelect={() => handleSelectId(shape.id)}
									onChange={(newAttrs) =>
										dispatch(
											changeShape({
												id: shape.id,
												shape: newAttrs,
											}),
										)
									}
								/>
							);
						}

						if (shape.shapeType === 'manualShape') {
							return (
								<ManualShape
									key={shape.id}
									shapeProps={shape}
									isSelected={shape.id === selectedId}
									onSelect={() => {
										handleSelectId(shape.id);
									}}
									onChange={(newAttrs) => {
										dispatch(
											changeShape({
												id: shape.id,
												shape: newAttrs,
											}),
										);
									}}
								/>
							);
						}

						if (
							shape.shapeType === 'draw' ||
							shape.shapeType === 'erase'
						) {
							return (
								<DrawnLine
									key={shape.id}
									shapeProps={shape}
									onChange={(newAttrs) => {
										dispatch(
											changeShape({
												id: shape.id,
												shape: newAttrs,
											}),
										);
									}}
								/>
							);
						}

						return null;
					})}

				{drawingShape &&
					((currentTool === 'rectangle' && (
						<Rect
							x={shape.x}
							y={shape.y}
							cornerRadius={shape.cornerRadius}
							width={shape.width}
							height={shape.height}
							fill={shape.fill}
							fillEnabled={shape.fillEnabled}
							strokeEnabled={shape.strokeEnabled}
							stroke={shape.stroke}
							strokeWidth={
								shape.strokeWidth ?? shapeProps.strokeWidth
							}
						/>
					)) ||
						(currentTool === 'circle' && (
							<Ellipse
								x={shape.x}
								y={shape.y}
								radiusX={shape.radiusX}
								radiusY={shape.radiusY}
								fill={shape.fill}
								strokeEnabled={shape.strokeEnabled}
								stroke={shape.stroke}
								strokeWidth={
									shape.strokeWidth ?? shapeProps.strokeWidth
								}
							/>
						)) ||
						(currentTool === 'triangle' && (
							<RegularPolygon
								x={shape.x}
								y={shape.y}
								cornerRadius={shape.cornerRadius}
								sides={3}
								radius={shape.radius || 5}
								fill={shape.fill}
								fillEnabled={shape.fillEnabled}
								strokeEnabled={shape.strokeEnabled}
								stroke={shape.stroke}
								strokeWidth={
									shape.strokeWidth ?? shapeProps.strokeWidth
								}
							/>
						)) ||
						(currentTool === 'manualShape' && (
							<Line
								x={shape.x}
								y={shape.y}
								points={shape.points}
								tension={shape.tension}
								closed
								fill={shape.fill}
								fillEnabled={shape.fillEnabled}
								strokeEnabled={shape.strokeEnabled}
								stroke={shape.stroke}
								strokeWidth={
									shape.strokeWidth ?? shapeProps.strokeWidth
								}
								listening={false}
							/>
						)) ||
						((currentTool === 'draw' ||
							currentTool === 'erase') && (
							<Line
								x={shape.x}
								y={shape.y}
								points={shape.points}
								stroke={shape.stroke}
								lineCap={shape.lineCap}
								lineJoin={shape.lineJoin}
								strokeWidth={shape.strokeWidth}
								globalCompositeOperation={
									shape.globalCompositeOperation
								}
								tension={shape.tension}
								listening={false}
							/>
						)))}
			</Layer>
		</Stage>
	);
};

export default Canvas;
