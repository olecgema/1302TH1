import React, { useState } from 'react';
import { Button, Input, message, Card, Table } from 'antd';
import './GuessNumberGame.css';

const GuessNumberGame: React.FC = () => {
	// Khởi tạo các state cần thiết
	const [randomNumber, setRandomNumber] = useState<number>(Math.floor(Math.random() * 100) + 1);
	const [guess, setGuess] = useState<number | undefined>();
	const [attempts, setAttempts] = useState<number>(0);
	const [gameOver, setGameOver] = useState<boolean>(false);
	const [history, setHistory] = useState<{ attempt: number; guess: number; result: string }[]>([]);

	// Hàm xử lý logic khi người chơi đoán số
	const handleGuess = () => {
		if (guess === undefined) {
			message.warning('Vui lòng nhập một số!');
			return;
		}

		setAttempts(attempts + 1);

		let result = '';
		if (guess < randomNumber) {
			result = 'Bạn đoán quá thấp!';
			message.info(result);
		} else if (guess > randomNumber) {
			result = 'Bạn đoán quá cao!';
			message.info(result);
		} else {
			result = 'Chúc mừng! Bạn đã đoán đúng!';
			message.success(result);
			setGameOver(true);
		}

		setHistory([...history, { attempt: attempts + 1, guess, result }]);

		if (attempts + 1 >= 10 && guess !== randomNumber) {
			message.error(`Bạn đã hết lượt! Số đúng là ${randomNumber}.`);
			setGameOver(true);
		}
	};

	// Hàm xử lý khi người chơi muốn chơi lại
	const handleRestart = () => {
		setRandomNumber(Math.floor(Math.random() * 100) + 1);
		setGuess(undefined);
		setAttempts(0);
		setGameOver(false);
		setHistory([]);
	};

	// Cấu hình các cột cho bảng lịch sử đoán số
	const columns = [
		{
			title: 'Lượt đoán',
			dataIndex: 'attempt',
			key: 'attempt',
		},
		{
			title: 'Số đã đoán',
			dataIndex: 'guess',
			key: 'guess',
		},
		{
			title: 'Kết quả',
			dataIndex: 'result',
			key: 'result',
		},
	];

	return (
		<Card title='Trò chơi đoán số' className='guess-number-card'>
			<p>Hệ thống đã sinh ra một số ngẫu nhiên từ 1 đến 100. Bạn có 10 lượt để đoán số đó.</p>
			<Input
				type='number'
				value={guess}
				onChange={(e) => setGuess(e.target.value === '' ? undefined : Number(e.target.value))}
				disabled={gameOver}
				placeholder='Nhập số bạn đoán'
				className='guess-input'
			/>
			<Button type='primary' onClick={handleGuess} disabled={gameOver} className='guess-button'>
				Đoán
			</Button>
			<Button onClick={handleRestart} className='restart-button'>
				Chơi lại
			</Button>
			<p>Lượt đoán: {attempts}/10</p>
			<Table dataSource={history} columns={columns} rowKey='attempt' pagination={false} className='history-table' />
		</Card>
	);
};

// Thành phần Dashboard
const Dashboard: React.FC = () => {
	return (
		<div className='dashboard'>
			{/* Hiển thị trò chơi đoán số */}
			<GuessNumberGame />
		</div>
	);
};

export default Dashboard;
