import { useState } from 'react';
import './TodoList.css';
function EditTask({ currentTask, onSave, onCancel }) {
	const [editedTask, setEditedTask] = useState(currentTask.task);

	const handleSave = () => {
		if (!editedTask.trim()) return;
		onSave(currentTask.id, editedTask);
	};

	return (
		<div className='edit-container'>
			<input type='text' value={editedTask} onChange={(e) => setEditedTask(e.target.value)} />
			<button onClick={handleSave}>Save</button>
			<button onClick={onCancel}>Cancel</button>
		</div>
	);
}

export default EditTask;
