import { configureStore } from '@reduxjs/toolkit';
import shapesReducer from './slices/shapeSlice';
import toolsReducer from './slices/toolSlice';

const store = configureStore({
	reducer: {
		shapes: shapesReducer,
		tools: toolsReducer,
	},
});

export default store;
