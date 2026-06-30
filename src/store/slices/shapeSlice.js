import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const shapeRemoveAndCleanup = createAsyncThunk(
	'images/shapeRemoveAndCleanup',
	(id, { getState, dispatch }) => {
		const state = getState();

		const imgToCleanup = state.shapes.shapes.find((img) => img.id === id);
		if (
			imgToCleanup &&
			imgToCleanup.src &&
			imgToCleanup.src.startsWith('blob:')
		) {
			URL.revokeObjectURL(imgToCleanup.src);
		}

		dispatch(shapeSlice.actions.deleteShape({ id }));
	},
);

const initialState = {
	shapes: [],
};
const shapeSlice = createSlice({
	name: 'shapes',
	initialState,

	reducers: {
		addShape: (state, action) => {
			state.shapes.push(action.payload);
		},
		changeShape: (state, action) => {
			const shapeIndex = state.shapes.findIndex(
				(shape) => shape.id === action.payload.id,
			);
			if (shapeIndex >= 0) {
				state.shapes[shapeIndex] = action.payload.shape;
			}
		},
		deleteShape: (state, action) => {
			const shapeIndex = state.shapes.findIndex(
				(shape) => shape.id === action.payload.id,
			);
			if (shapeIndex >= 0) {
				state.shapes = state.shapes.filter(
					(shape) => shape.id !== action.payload.id,
				);
			}
		},
	},

	extraReducers: (builder) => {
		builder.addCase(shapeRemoveAndCleanup.fulfilled, (state, action) => {
			const shapeToDeleteIndex = state.shapes.findIndex((shape) => {
				return shape.id === action.payload.id;
			});
			if (shapeToDeleteIndex >= 0) {
				state.images = state.images.filter(
					(img) => img.id !== action.payload.id,
				);
			}
		});
	},
});

export default shapeSlice.reducer;
export const { addShape, changeShape } = shapeSlice.actions;
export const selectShapes = (state) => state.shapes.shapes;
