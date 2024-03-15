import { API } from '@/services/typings';
import { PauseOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
import useToken from 'antd/es/theme/useToken';
import calendar from 'js-calendar-converter';
import React, { memo } from 'react';

interface ResultProps {
	result: number[];
	drawItem: API.GameDrawItem;
}

const NumberItem: React.FC<{ number: number; color?: string }> = ({
	number,
	color,
}) => {
	const token = useToken()[1];
	return (
		<Avatar
			style={{
				backgroundColor: color || token.colorPrimary,
				verticalAlign: 'middle',
			}}
			gap={1}
		>
			{Math.floor(number / 10) === 0 ? `0${number}` : number}
		</Avatar>
	);
};

const NumberList: React.FC<{ list: number[]; separator?: React.ReactNode }> = ({
	list,
	separator,
}) => {
	const listLen = list.length;
	const lastIndex = listLen - 1;
	return (
		<Space>
			{list.map((num, index) => {
				const isLast = index === lastIndex;
				return separator ? (
					<Space key={index}>
						<NumberItem key={index} number={num} />
						{!isLast && separator}
					</Space>
				) : (
					<NumberItem key={index} number={num} />
				);
			})}
		</Space>
	);
};

const OperatorEqualStyle = {
	transform: 'rotate(90deg)',
};
const OperatorEqual: React.FC = () => {
	return <PauseOutlined style={OperatorEqualStyle} />;
};

const HX28Result: React.FC<ResultProps & { ignore09: boolean }> = ({
	result,
	ignore09,
}) => {
	const token = useToken()[1];
	const specialNum = result.reduce((n, nextN) => {
		return n + nextN;
	});
	const tailCode = specialNum % 10;
	const isBig = specialNum >= 14;
	const isOdd = specialNum % 2 === 1;
	const isBaozi = [...new Set(result)].length === 1;
	const isDuizi = [...new Set(result)].length === 2;
	let isShunzi = false;
	if (!ignore09 || (ignore09 && !(result.includes(0) && result.includes(9)))) {
		const sortResult = [...result].sort();
		if (
			sortResult[2] - sortResult[1] === 1 &&
			sortResult[1] - sortResult[0] === 1
		) {
			isShunzi = true;
		}

		if (!ignore09) {
			if (
				sortResult[0] === 0 &&
				sortResult[2] === 9 &&
				(sortResult[1] === 1 || sortResult[1] === 8)
			) {
				isShunzi = true;
			}
		}
	}

	return (
		<Space direction='vertical' className='result-container'>
			<Space>
				<NumberList list={result} separator={<PlusOutlined />} />
				<OperatorEqual />
				<NumberItem number={specialNum} color={token.colorSuccess} />
			</Space>
			{/* <Row className='result-desc'>
        <Col span={4}>{isBig ? '大' : '小'}</Col>
        <Col span={4}>{isOdd ? '单' : '双'}</Col>
        {(isBaozi || isDuizi || isShunzi) && (
          <Col span={4}>{isBaozi ? '豹子' : isDuizi ? '对子' : '顺子'}</Col>
        )}
        {tailCode >= 1 && tailCode <= 8 && <Col span={4}>尾{tailCode}</Col>}
      </Row> */}
		</Space>
	);
};

const YearAnimals = [
	'鼠',
	'牛',
	'虎',
	'兔',
	'龙',
	'蛇',
	'马',
	'羊',
	'猴',
	'鸡',
	'狗',
	'猪',
];
const MarkSixNumbers = Array(49)
	.fill(0)
	.map((_, index) => index + 1);

const getNumAnimalMap = (date: string) => {
	// utc 年
	const dateObj = new Date(date);
	const year = dateObj.getFullYear();
	const month = dateObj.getMonth() + 1;
	const day = dateObj.getDate();
	// 获取生肖
	const lunarJson = calendar.solar2lunar(year, month, day);
	const yearAnimal = lunarJson.Animal;
	// 生肖顺序数组
	const yaIndex = YearAnimals.indexOf(yearAnimal);
	const sortAnimals = [
		yearAnimal,
		...YearAnimals.slice(0, yaIndex).reverse(),
		...YearAnimals.slice(yaIndex + 1).reverse(),
	];
	// console.log('sortAnimals ', sortAnimals);
	const NumAnimalMap = new Map();
	MarkSixNumbers.forEach((num) => {
		const aIndex = num % 12 || 12;
		NumAnimalMap.set(num, sortAnimals[aIndex - 1]);
	});
	return NumAnimalMap;
};

const MarkSixResult: React.FC<ResultProps> = ({ result, drawItem }) => {
	const token = useToken()[1];
	const numList = [...result];
	const specialNum = numList.pop();

	/* const NumAnimalMap = getNumAnimalMap(drawItem.drawingDate);
  console.log('MarSix ', NumAnimalMap); */
	return (
		<Space direction='vertical' className='result-container'>
			<Space>
				<NumberList list={numList} />
				<PlusOutlined />
				<NumberItem number={specialNum!} color={token.colorSuccess} />
			</Space>
			{/* <Row>
        <Col flex={7}>
          <Row className='result-desc'>
            {numList.map((num, index) => {
              return (
                <Col key={index} flex='auto'>
                  {NumAnimalMap.get(num)}
                </Col>
              );
            })}
          </Row>
        </Col>
        <Col flex={2}>
          <Row className='result-desc'>
            <Col span={18} offset={6}>
              {NumAnimalMap.get(specialNum)}
            </Col>
          </Row>
        </Col>
      </Row> */}
		</Space>
	);
};

const QXCResult: React.FC<ResultProps> = ({ result }) => {
	// const theFirstFour = result.slice(0, 4);
	return (
		<Space direction='vertical' className='result-container'>
			<NumberList list={result} />
			{/* <Row className='result-desc'>
        {theFirstFour.map((num, index) => (
          <Col span={3} key={index}>
            {num % 2 === 0 ? '双' : '单'}
          </Col>
        ))}
      </Row> */}
		</Space>
	);
};

const PCNNResult: React.FC<ResultProps> = ({ result }) => {
	const token = useToken()[1];
	const specialNum = result.reduce((n, nextN) => {
		return n + nextN;
	});

	return (
		<Space direction='vertical' className='result-container'>
			<Space>
				<NumberList list={result} separator={<PlusOutlined />} />
				<OperatorEqual />
				<NumberItem number={specialNum} color={token.colorSuccess} />
			</Space>
			{/*  <Row className='result-desc'>
        <Col span={4}>闲A</Col>
        <Col span={4}>闲B</Col>
        <Col span={4}>庄C</Col>
      </Row> */}
		</Space>
	);
};

// HXEB,JNDEB,XGLHC,QXC,PCNN,PCBJL,JNDSSC

const DrawResult: React.FC<{
	lotteryCode?: string;
	drawItem: API.GameDrawItem;
}> = ({ lotteryCode, drawItem }) => {
	const result = drawItem.drawingResult.split(',').map(Number);
	switch (lotteryCode) {
		case 'HXEB': // 哈希28
			return <HX28Result result={result} ignore09={true} drawItem={drawItem} />;
		case 'JNDEB': // 加拿大28
			return (
				<HX28Result result={result} ignore09={false} drawItem={drawItem} />
			);
		case 'XGLHC': // 香港六合彩
			return <MarkSixResult result={result} drawItem={drawItem} />;
		case 'JNDLHC': // 加拿大六合彩
			return <MarkSixResult result={result} drawItem={drawItem} />;
		case 'QXC': // 七星彩
			return <QXCResult result={result} drawItem={drawItem} />;
		case 'PCNN': // pc牛牛
			return <PCNNResult result={result} drawItem={drawItem} />;
		case 'PCBJL': // pc百家乐
			return <PCNNResult result={result} drawItem={drawItem} />;
		case 'JNDSI': // 加拿大4.2-4.6
			return <PCNNResult result={result} drawItem={drawItem} />;
		case 'JNDWU': // 加拿大5.0
			return <PCNNResult result={result} drawItem={drawItem} />;
		case 'JNDWP': // 加拿大网盘
			return <PCNNResult result={result} drawItem={drawItem} />;
		case 'JNDSSC': // 时时彩
			return <PCNNResult result={result} drawItem={drawItem} />;
		case 'PLS': // 排列三
			return <QXCResult result={result} drawItem={drawItem} />;
		default:
			return <PCNNResult result={result} drawItem={drawItem} />;
	}
};
export default memo(DrawResult);
