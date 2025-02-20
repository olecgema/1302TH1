import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, DatePicker, TimePicker, message, Select, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const StudyProgress = () => {
	const [studyGoals, setStudyGoals] = useState<{ [key: string]: number }>({});
	const [subjects, setSubjects] = useState<any[]>([]);
	const [visible, setVisible] = useState(false);
	const [editingSubject, setEditingSubject] = useState<any>(null);
	const [subjectOptions, setSubjectOptions] = useState<string[]>(['Toán', 'Văn', 'Anh', 'Khoa học', 'Công nghệ']);
	const [goalModalVisible, setGoalModalVisible] = useState(false);

	useEffect(() => {
		const storedSubjects = JSON.parse(localStorage.getItem('subjects') || '[]');
		setSubjects(storedSubjects);
		const storedSubjectOptions = JSON.parse(localStorage.getItem('subjectOptions') || '[]');
		if (storedSubjectOptions.length > 0) {
			setSubjectOptions(storedSubjectOptions);
		}
		const storedGoals = JSON.parse(localStorage.getItem('studyGoals') || '{}');
		setStudyGoals(storedGoals);
	}, []);

	const handleSave = (values: any) => {
		const formattedValues = {
			...values,
			date: values.date ? values.date.format('YYYY-MM-DD HH:mm') : '', // Lưu dạng chuỗi
			duration: values.duration ? values.duration.format('HH:mm') : '', // Lưu dạng chuỗi
		};

		let updatedSubjects = [...subjects];

		if (editingSubject) {
			updatedSubjects = updatedSubjects.map((subject) =>
				subject.key === editingSubject.key ? { ...editingSubject, ...formattedValues } : subject,
			);
		} else {
			updatedSubjects.push({ ...formattedValues, key: Date.now() });
		}

		setSubjects(updatedSubjects);
		localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
		setVisible(false);
		setEditingSubject(null);
		message.success('Lưu thành công');
	};

	const handleDelete = (key: number) => {
		const updatedSubjects = subjects.filter((subject) => subject.key !== key);
		setSubjects(updatedSubjects);
		localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
		message.success('Xóa thành công');
	};

	const handleSubjectChange = (value: string[]) => {
		const newSubjects = value.filter((v) => !subjectOptions.includes(v));
		if (newSubjects.length > 0) {
			const updatedSubjectOptions = [...subjectOptions, ...newSubjects];
			setSubjectOptions(updatedSubjectOptions);
			localStorage.setItem('subjectOptions', JSON.stringify(updatedSubjectOptions));
		}
	};

	const calculateStudyProgress = () => {
		const progress: { [key: string]: number } = {};

		subjects.forEach(({ name, duration }) => {
			const durationHours = moment(duration, 'HH:mm').hours() + moment(duration, 'HH:mm').minutes() / 60;
			progress[name] = (progress[name] || 0) + durationHours;
		});

		return progress;
	};

	const progressData = calculateStudyProgress();

	const columns = [
		{ title: 'Tên môn', dataIndex: 'name', key: 'name' },
		{ title: 'Thời gian học', dataIndex: 'date', key: 'date' },
		{ title: 'Thời lượng học', dataIndex: 'duration', key: 'duration' },
		{ title: 'Nội dung đã học', dataIndex: 'content', key: 'content' },
		{ title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
		{
			title: 'Hành động',
			key: 'action',
			render: (text: any, record: any) => (
				<>
					<Button
						onClick={() => {
							setEditingSubject(record);
							setVisible(true);
						}}
					>
						Sửa
					</Button>
					<Button onClick={() => handleDelete(record.key)} danger style={{ marginLeft: 10 }}>
						Xóa
					</Button>
				</>
			),
		},
	];

	return (
		<div>
			<Button type='primary' style={{ margin: '0 10px' }} icon={<PlusOutlined />} onClick={() => setVisible(true)}>
				Thêm môn học
			</Button>
			<Button
				type='dashed'
				style={{ background: 'green', color: 'white' }}
				icon={<PlusOutlined />}
				onClick={() => setGoalModalVisible(true)}
			>
				Thiết lập mục tiêu
			</Button>
			<Modal
				title='Thiết lập mục tiêu học tập'
				visible={goalModalVisible}
				onCancel={() => setGoalModalVisible(false)}
				footer={null}
			>
				<Form
					onFinish={(values) => {
						setStudyGoals(values);
						localStorage.setItem('studyGoals', JSON.stringify(values));
						setGoalModalVisible(false);
					}}
				>
					{subjectOptions.map((subject) => (
						<Form.Item key={subject} name={subject} label={`Mục tiêu ${subject} (giờ)`}>
							<InputNumber min={0} />
						</Form.Item>
					))}
					<Button type='primary' htmlType='submit'>
						Lưu
					</Button>
				</Form>
			</Modal>

			<Table
				columns={[
					{ title: 'Môn học', dataIndex: 'name', key: 'name' },
					{
						title: 'Mục tiêu (giờ)',
						render: (_, record) => studyGoals[record.name] || 'Chưa đặt',
					},
					{
						title: 'Đã học (giờ)',
						render: (_, record) => progressData[record.name]?.toFixed(2) || 0,
					},
					{
						title: 'Trạng thái',
						render: (_, record) => {
							const goal = studyGoals[record.name];
							const learned = progressData[record.name] || 0;

							if (goal === undefined) {
								return '⚠️ Chưa xác định';
							}

							return learned >= goal ? '✅ Hoàn thành' : `⏳ Còn thiếu ${(goal - learned).toFixed(2)} giờ`;
						},
					},
				]}
				dataSource={subjects}
				style={{ marginTop: 20 }}
			/>

			<Table columns={columns} dataSource={subjects} style={{ marginTop: 20 }} />
			<Modal
				title={editingSubject ? 'Sửa môn học' : 'Thêm môn học'}
				visible={visible}
				onCancel={() => {
					setVisible(false);
					setEditingSubject(null);
				}}
				footer={null}
			>
				<Form
					initialValues={{
						...editingSubject,
						date: editingSubject?.date ? moment(editingSubject.date, 'YYYY-MM-DD HH:mm') : null,
						duration: editingSubject?.duration ? moment(editingSubject.duration, 'HH:mm') : null,
					}}
					onFinish={handleSave}
				>
					<Form.Item name='name' label='Tên môn' rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}>
						<Select
							mode='tags'
							style={{ width: '100%' }}
							placeholder='Chọn hoặc thêm môn học'
							onChange={handleSubjectChange}
						>
							{subjectOptions.map((subject) => (
								<Option key={subject} value={subject}>
									{subject}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name='date'
						label='Thời gian học'
						rules={[{ required: true, message: 'Vui lòng chọn thời gian học' }]}
					>
						<DatePicker showTime />
					</Form.Item>
					<Form.Item
						name='duration'
						label='Thời lượng học'
						rules={[{ required: true, message: 'Vui lòng nhập thời lượng học' }]}
					>
						<TimePicker />
					</Form.Item>
					<Form.Item name='content' label='Nội dung đã học'>
						<Input.TextArea />
					</Form.Item>
					<Form.Item name='notes' label='Ghi chú'>
						<Input.TextArea />
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit'>
							Lưu
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default StudyProgress;
