import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	currentTool: 'move',
};

const toolSlice = createSlice({
	name: 'tools',
	initialState,

	reducers: {
		setCurrentTool: (state, action) => {
			state.currentTool = action.payload.tool;
		},
	},
});

export default toolSlice.reducer;
export const { setCurrentTool } = toolSlice.actions;
export const selectCurrentTool = (state) => state.tools.currentTool;
