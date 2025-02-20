import React, { useState } from 'react';

interface TodoFormProps {
	addTodo: (todo: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ addTodo }) => {
	const [value, setValue] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!value) return;
		addTodo(value);
		setValue('');
	};

	return (
		<form onSubmit={handleSubmit}>
			<input type='text' value={value} onChange={(e) => setValue(e.target.value)} placeholder='Add a new todo' />
			<button type='submit'>Add</button>
		</form>
	);
};

export default TodoForm;
