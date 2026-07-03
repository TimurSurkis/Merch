import { useEffect, useRef, useState } from 'react';
import './App.css';
import Canvas from './components/Canvas';
import SidePanel from './components/elements/SidePanel';
import Properties from './components/Properties';

function App() {
	const wrapperRef = useRef(null);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	useEffect(() => {
		if (!wrapperRef.current) return;

		const resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				setDimensions({
					width: entry.contentRect.width,
					height: entry.contentRect.height,
				});
			}
		});

		resizeObserver.observe(wrapperRef.current);
		return () => resizeObserver.disconnect();
	}, []);

	return (
		<div className="editor-shell">
			<SidePanel />
			<main className="canvas-workspace" aria-label="Canvas workspace">
				<div ref={wrapperRef} className="canvas-container">
					<Canvas size={dimensions} />
				</div>
			</main>
			<Properties />
		</div>
	);
}

export default App;
