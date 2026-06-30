import { useEffect, useState, useRef } from 'react';
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
	selectShapes,
	shapeRemoveAndCleanup,
} from '../store/slices/shapeSlice';

let shapeBase = {
	shapeType: null,
	x: 0,
	y: 0,
	fill: 'red',
	id: null,
};

const Canvas = ({ size }) => {
	const dispatch = useDispatch();
	const shapes = useSelector(selectShapes);
	const currentTool = useCurrentTool();

	console.log(shapes);

	const [drawingShape, setDrawingShape] = useState(false);
	const [shape, setShape] = useState(shapeBase);
	const [selectedId, setSelectedId] = useState(null);
	const stageRef = useRef(null);

	const handleMouseDown = (e) => {
		const clickedOnEmpty = e.target === e.target.getStage();
		if (clickedOnEmpty && selectedId !== null) setSelectedId(null);

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
						x,
						y,
						points: [0, 0, 0, 0],
					});
					return;
				}

				setShape({
					...shape,
					points: [
						...shape.points,
						x - shape.x,
						y - shape.y,
						x - shape.x,
						y - shape.y,
					],
				});
			} else {
				setDrawingShape(true);
				setShape({ ...shape, x, y });
			}
		}
	};

	const trackMousePos = () => {
		const stage = stageRef.current;

		if (stage && drawingShape) {
			const pointerPos = stage.getPointerPosition();
			const { x, y } = pointerPos;

			if (currentTool === 'rectangle') {
				setShape({
					...shape,
					width: x - shape.x,
					height: y - shape.y,
				});
			} else if (currentTool === 'circle') {
				setShape({
					...shape,
					radiusX: x - shape.x,
					radiusY: y - shape.y,
				});
			} else if (currentTool === 'triangle') {
				const radius = Math.sqrt(
					Math.pow(x - shape.x, 2) + Math.pow(y - shape.y, 2),
				);
				setShape({
					...shape,
					radius,
				});
			} else if (currentTool === 'manualShape') {
				const newPoints = [...shape.points];

				newPoints[newPoints.length - 2] = x - shape.x;
				newPoints[newPoints.length - 1] = y - shape.y;

				setShape({
					...shape,
					points: newPoints,
				});
			}
		}
	};

	const endDrawShape = () => {
		if (currentTool === 'manualShape') return;
		setDrawingShape(false);

		const neededKeys = ['width', 'height', 'radius', 'radiusX', 'radiusY'];
		const hasKey = neededKeys.some((key) => Object.hasOwn(shape, key));

		if (!hasKey) return setShape(shapeBase);

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
					setSelectedId(null);
				}
			}

			if (
				currentTool === 'manualShape' &&
				e.key === 'Enter' &&
				drawingShape
			) {
				setDrawingShape(false);

				const shapeId = uuidv4();
				dispatch(
					addShape({
						...shape,
						shapeType: currentTool,
						points: shape.points.slice(0, -2),
						id: shapeId,
					}),
				);
				setShape(shapeBase);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [dispatch, selectedId, drawingShape, currentTool, shape]);

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
									onSelect={() => setSelectedId(shape.id)}
								/>
							);
						}

						if (shape.shapeType === 'image') {
							return (
								<ImageComp
									key={shape.id}
									image={shape}
									isSelected={shape.id === selectedId}
									onSelect={() => setSelectedId(shape.id)}
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
									onSelect={() => setSelectedId(shape.id)}
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
									onSelect={() => setSelectedId(shape.id)}
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
										setSelectedId(shape.id);
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

						return null;
					})}

				{drawingShape &&
					((currentTool === 'rectangle' && (
						<Rect
							x={shape.x}
							y={shape.y}
							width={shape.width}
							height={shape.height}
							fill={shape.fill}
						/>
					)) ||
						(currentTool === 'circle' && (
							<Ellipse
								x={shape.x}
								y={shape.y}
								radiusX={shape.radiusX}
								radiusY={shape.radiusY}
								fill={shape.fill}
							/>
						)) ||
						(currentTool === 'triangle' && (
							<RegularPolygon
								x={shape.x}
								y={shape.y}
								sides={3}
								radius={shape.radius || 5}
								fill={shape.fill}
							/>
						)) ||
						(currentTool === 'manualShape' && (
							<Line
								x={shape.x}
								y={shape.y}
								points={shape.points}
								closed
								tension={0}
								stroke="white"
							/>
						)))}
			</Layer>
		</Stage>
	);
};

export default Canvas;
