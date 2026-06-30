import { selectCurrentTool } from '../store/slices/toolSlice';
import { useSelector } from 'react-redux';

const useCurrentTool = () => {
	const currentTool = useSelector(selectCurrentTool);

	return currentTool;
};

export default useCurrentTool;
