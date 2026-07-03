import { useEffect, useRef } from 'react';
import { Image, Transformer } from 'react-konva';
import useImage from 'use-image';
import useCurrentTool from '../../hooks/useCurrentTool';
import {
	onDragMove,
	onTransform,
	transformerBoxFunc,
} from '../../util/Shape&TransformerFunctions';

const ImageComp = ({ image, isSelected, onSelect, onChange }) => {
	const [img, status] = useImage(image.src);

	const imgRef = useRef();
	const tfRef = useRef();

	const currentTool = useCurrentTool();

	useEffect(() => {
		if (status === 'loaded' && img && (!image.width || !image.height)) {
			const maxInitialWidth = 400;
			let finalWidth = img.width;
			let finalHeight = img.height;

			if (img.width > maxInitialWidth) {
				const aspectRatio = img.height / img.width;
				finalWidth = maxInitialWidth;
				finalHeight = maxInitialWidth * aspectRatio;
			}

			onChange({
				...image,
				width: finalWidth,
				height: finalHeight,
			});
		}
	}, [status, img]);

	useEffect(() => {
		if (isSelected) {
			tfRef.current.nodes([imgRef.current]);
		}
	}, [isSelected]);

	return (
		<>
			{status === 'loaded' && (
				<Image
					ref={imgRef}
					image={img}
					x={image.x}
					y={image.y}
					width={image.width}
					height={image.height}
					offsetX={image.width / 2}
					offsetY={image.height / 2}
					cornerRadius={image.cornerRadius}
					draggable={isSelected || currentTool === 'move'}
					onClick={onSelect}
					onTap={onSelect}
					onDragMove={() => onDragMove(imgRef, image, onChange)}
					onTransform={() =>
						onTransform('image', imgRef, image, onChange)
					}
				/>
			)}
			{isSelected && (
				<Transformer
					ref={tfRef}
					flipEnabled={false}
					boundBoxFunc={transformerBoxFunc}
				/>
			)}
		</>
	);
};

export default ImageComp;
