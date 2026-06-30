import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import ShapeSelect from '../buttons/ShapeSelect';
import { addShape } from '../../store/slices/shapeSlice';

const imgDefaultAttrs = {
	x: 400,
	y: window.innerHeight / 2,
	width: 0,
	height: 0,
};

const SidePanel = () => {
	const dispatch = useDispatch();

	const handleUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const imageBlob = URL.createObjectURL(file);
			const imgId = uuidv4();
			dispatch(
				addShape({
					shapeType: 'image',
					...imgDefaultAttrs,
					src: imageBlob,
					id: imgId,
				}),
			);
		}
	};

	return (
		<div>
			<input
				type="file"
				accept="image/*"
				className="image-upload"
				onChange={handleUpload}
			/>
			<ShapeSelect />
		</div>
	);
};

export default SidePanel;
