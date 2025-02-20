import React from 'react';

interface TodoItemProps {
	todo: string;
	index: number;
	removeTodo: (index: number) => void;
	editTodo: (index: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, index, removeTodo, editTodo }) => {
	return (
		<li>
			{todo}
			<button onClick={() => removeTodo(index)}>Remove</button>
			<button onClick={() => editTodo(index)}>Edit</button>
		</li>
	);
};

export default TodoItem;
