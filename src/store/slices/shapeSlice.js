import {
	createSlice,
	createAsyncThunk,
	createSelector,
} from '@reduxjs/toolkit';

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
	colors: {
		fill: '#ffffff',
		stroke: '#000000',
	},
	shapeProps: {
		cornerRadius: 0,
		tension: 0.5,
		strokeWidth: 5,
		strokeEnabled: true,
		fillEnabled: true,
		lineCap: 'round',
		lineJoin: 'round',
	},
	shapes: [],
	selectedId: null,
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
		setSelectedId: (state, action) => {
			state.selectedId = action.payload;
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
		setColor: (state, action) => {
			const colorRole = action.payload.colorRole;

			state.colors[colorRole] = action.payload.color;
		},
		setProperty: (state, action) => {
			const prop = action.payload.prop;
			state.shapeProps[prop] = action.payload.value;
		},
	},

	extraReducers: (builder) => {
		builder.addCase(shapeRemoveAndCleanup.fulfilled, (state, action) => {
			const shapeToDeleteIndex = state.shapes.findIndex((shape) => {
				return shape.id === action.payload.id;
			});
			if (shapeToDeleteIndex >= 0) {
				state.shapes = state.shapes.filter(
					(img) => img.id !== action.payload.id,
				);
			}
		});
	},
});

export default shapeSlice.reducer;
export const { addShape, changeShape, setSelectedId, setColor, setProperty } =
	shapeSlice.actions;
export const selectShapes = (state) => state.shapes.shapes;
export const selectSelectedId = (state) => state.shapes.selectedId;
export const selectShapeById = createSelector(
	[selectShapes, (state, shapeId) => shapeId],
	(shapes, shapeId) => shapes.find((shape) => shape.id === shapeId),
);
export const selectColors = (state) => state.shapes.colors;
export const selectShapeProps = (state) => state.shapes.shapeProps;
