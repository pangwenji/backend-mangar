import React, { useEffect, useState } from 'react';

import { API } from '@/services/typings';
import { InputNumber, InputNumberProps, Modal } from 'antd';
import { ModalProps } from 'antd/lib';
import { padStart } from 'lodash';

export const padTime = (num: number) => {
	return padStart(`${num}`, 2, '0');
};

const MINUTE = 60;
const HOUR = Math.pow(MINUTE, 2);
const DAY = HOUR * 24;
export const parseSeconds = (seconds: number) => {
	const day = Math.trunc(seconds / DAY);
	const hour = Math.trunc((seconds % DAY) / HOUR);
	const minute = Math.trunc((seconds % HOUR) / MINUTE);
	const second = Math.trunc(seconds % MINUTE);
	return {
		day,
		minute,
		hour,
		second,
	};
};

const TimeInput: React.FC<InputNumberProps> = (props) => {
	return (
		<InputNumber
			placeholder={''}
			controls={false}
			precision={0}
			formatter={(value) => {
				const num = Number(value);
				return padTime(Number.isInteger(num) ? num : 0);
			}}
			parser={(value) => {
				const num = Number(value);
				return Number.isInteger(num) ? num : 0;
			}}
			{...props}
		/>
	);
};

const EditOpenTimeModal: React.FC<
	Omit<ModalProps, 'onOk'> & {
		row?: API.OpenTimeEditItem;
		onOk(row: API.OpenTimeEditItem): void;
	}
> = ({ row, onOk, ...restProps }) => {
	const [day, setDay] = useState(0);
	const [hour, setHour] = useState(0);
	const [minute, setMinute] = useState(0);
	const [second, setSecond] = useState(0);

	useEffect(() => {
		if (!row) {
			setDay(0);
			setHour(0);
			setMinute(0);
			setSecond(0);
		} else {
			const parsedTime = parseSeconds(row.drawingDate);
			setDay(parsedTime.day);
			setHour(parsedTime.hour);
			setMinute(parsedTime.minute);
			setSecond(parsedTime.second);
		}
	}, [row]);

	const handleOK = () => {
		if (!row) return;
		const totalSeconds = day * DAY + hour * HOUR + minute * MINUTE + second;
		onOk({
			...row,
			drawingDate: totalSeconds,
		});
	};
	return (
		<Modal
			className='edit-open-time-modal'
			title='编辑时间'
			width={500}
			onOk={handleOK}
			{...restProps}
		>
			<span>开盘时间</span>
			<div className='time-container'>
				<TimeInput
					value={day}
					onChange={(value) => {
						setDay(Number(value));
					}}
				/>
				天
				<TimeInput
					max={23}
					value={hour}
					onChange={(value) => {
						setHour(Number(value));
					}}
				/>
				小时
				<TimeInput
					max={59}
					value={minute}
					onChange={(value) => {
						setMinute(Number(value));
					}}
				/>
				分钟
				<TimeInput
					max={59}
					value={second}
					onChange={(value) => {
						setSecond(Number(value));
					}}
				/>
				秒
			</div>
		</Modal>
	);
};

export default EditOpenTimeModal;
