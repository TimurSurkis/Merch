import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { LuImagePlus } from 'react-icons/lu';
import { LuMove } from 'react-icons/lu';
import { LuEraser } from 'react-icons/lu';
import { LuPencil } from 'react-icons/lu';
import ShapeSelect from '../buttons/ShapeSelect';
import { addShape, selectShapeProps } from '../../store/slices/shapeSlice';
import { setCurrentTool } from '../../store/slices/toolSlice';
import useCurrentTool from '../../hooks/useCurrentTool';
import { useEffect } from 'react';

const imgDefaultAttrs = {
	x: 400,
	y: window.innerHeight / 2,
	width: 0,
	height: 0,
};

const SidePanel = () => {
	const dispatch = useDispatch();

	const currentTool = useCurrentTool();
	const shapeProps = useSelector(selectShapeProps);

	const setTool = (tool) => {
		dispatch(setCurrentTool({ tool }));
	};

	const handleUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const imageBlob = URL.createObjectURL(file);
			const imgId = uuidv4();
			dispatch(
				addShape({
					shapeType: 'image',
					...imgDefaultAttrs,
					cornerRadius: shapeProps.cornerRadius,
					src: imageBlob,
					id: imgId,
				}),
			);
		}
	};

	useEffect(() => {
		const hotkeys = {
			m: 'move',
			b: 'draw',
			e: 'erase',
			r: 'rectangle',
			c: 'circle',
			t: 'triangle',
			s: 'manualShape',
		};

		const toolsHotkeyListener = (e) => {
			const tool = hotkeys[e.key];
			if (tool) {
				setTool(tool);
			}
		};

		window.addEventListener('keydown', toolsHotkeyListener);

		return () => {
			window.removeEventListener('keydown', toolsHotkeyListener);
		};
	}, [setTool]);

	return (
		<aside className="tool-sidebar" aria-label="Editor tools">
			<div className="sidebar-section">
				<span className="sidebar-label">Assets</span>
				<label className="upload-button" htmlFor="image-upload">
					<LuImagePlus className="icon" />
					<span>Upload</span>
				</label>
				<input
					id="image-upload"
					type="file"
					accept="image/*"
					className="image-upload"
					onChange={handleUpload}
				/>
			</div>
			<div className="sidebar-section">
				<span className="sidebar-label">Move</span>
				<button
					className={`tool-btn ${currentTool === 'move' ? 'is-active' : ''}`}
					onClick={() => setTool('move')}
				>
					<LuMove className="icon" />
				</button>
				<span className="sidebar-label">Draw</span>
				<button
					className={`tool-btn ${currentTool === 'draw' ? 'is-active' : ''}`}
					onClick={() => setTool('draw')}
				>
					<LuPencil className="icon" />
				</button>
				<span className="sidebar-label">Erase</span>
				<button
					className={`tool-btn ${currentTool === 'erase' ? 'is-active' : ''}`}
					onClick={() => setTool('erase')}
				>
					<LuEraser className="icon" />
				</button>
			</div>
			<div className="sidebar-section">
				<span className="sidebar-label">Shapes</span>
				<ShapeSelect />
			</div>
		</aside>
	);
};

export default SidePanel;
