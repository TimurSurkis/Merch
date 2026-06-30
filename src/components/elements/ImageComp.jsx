import { useEffect, useRef } from 'react';
import { Image, Transformer } from 'react-konva';
import useImage from 'use-image';

const ImageComp = ({ image, isSelected, onSelect, onChange }) => {
	const [img, status] = useImage(image.src);

	const imgRef = useRef();
	const tfRef = useRef();

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
					draggable
					onClick={onSelect}
					onTap={onSelect}
					onDragEnd={(e) => {
						onChange({
							...image,
							x: e.target.x(),
							y: e.target.y(),
						});
					}}
					onTransformEnd={() => {
						const node = imgRef.current;
						const scaleX = node.scaleX();
						const scaleY = node.scaleY();

						node.scaleX(1);
						node.scaleY(1);

						onChange({
							...image,
							x: node.x(),
							y: node.y(),
							width: Math.max(5, node.width() * scaleX),
							height: Math.max(5, node.height() * scaleY),
						});
					}}
				/>
			)}
			{isSelected && (
				<Transformer
					ref={tfRef}
					flipEnabled={false}
					boundBoxFunc={(oldBox, newBox) => {
						if (
							Math.abs(newBox.width) < 5 ||
							Math.abs(newBox.height) < 5
						) {
							return oldBox;
						}
						return newBox;
					}}
				/>
			)}
		</>
	);
};

export default ImageComp;
