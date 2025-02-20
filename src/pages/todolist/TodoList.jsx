import { useState, useEffect } from 'react';
import EditTask from './EditTask.jsx';
import './TodoList.css';

function TodoList() {
	const [editTaskData, setEditTaskData] = useState(null);
	const [task, setTask] = useState('');
	const [todoList, setTodoList] = useState(() => {
		const savedTodos = localStorage.getItem('todoList');
		return savedTodos ? JSON.parse(savedTodos) : [];
	});

	useEffect(() => {
		localStorage.setItem('todoList', JSON.stringify(todoList));
	}, [todoList]);

	const getTask = (value) => {
		setTask(value);
	};

	const addTask = () => {
		if (!task.trim()) return;

		const newTask = { id: Date.now(), task: task, isCompleted: false };

		setTodoList((prev) => [...prev, newTask]);
		setTask('');
	};

	const deleteTask = (id) => {
		setTodoList((prev) => prev.filter((item) => item.id !== id));
	};

	const startEditTask = (task) => {
		setEditTaskData(task);
	};

	const saveEditedTask = (id, updatedTask) => {
		setTodoList((prev) => prev.map((item) => (item.id === id ? { ...item, task: updatedTask } : item)));
		setEditTaskData(null);
	};
	const toggleComplete = (id) => {
		setTodoList((prev) => prev.map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item)));
	};

	return (
		<div className='App'>
			<div className='input-container'>
				<input type='text' placeholder='Nhập công việc' value={task} onChange={(e) => getTask(e.target.value)} />
				<button onClick={addTask}>Add</button>
			</div>

			<div className='task-container'>
				{todoList.map((item) => (
					<div key={item.id} className='task'>
						{editTaskData && editTaskData.id === item.id ? (
							<EditTask currentTask={item} onSave={saveEditedTask} onCancel={() => setEditTaskData(null)} />
						) : (
							<>
								<div className='task-content'>
									<div className='task-content'>
										<input type='checkbox' checked={item.isCompleted} onChange={() => toggleComplete(item.id)} />
										<span className={item.isCompleted ? 'completed-text' : ''}>{item.task}</span>
									</div>
								</div>
								<div className='task-buttons'>
									<button className='edit-btn' onClick={() => startEditTask(item)}>
										Edit
									</button>
									<button className='delete-btn' onClick={() => deleteTask(item.id)}>
										Delete
									</button>
								</div>
							</>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export default TodoList;
