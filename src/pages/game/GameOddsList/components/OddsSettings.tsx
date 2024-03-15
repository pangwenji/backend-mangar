import { CustomCommonBG } from '@/../config/theme';
import MyModalWrapper from '@/components/MyModalWrapper';
import {
	initGameOdds,
	queryGameOddList,
	refreshGameOddsCache,
} from '@/services/api';
import { API } from '@/services/typings';
import { ProCard } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import {
	Button,
	Card,
	Col,
	Divider,
	message,
	Row,
	Skeleton,
	Typography,
} from 'antd';
import React, { memo, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { handleGameGroupOddUpdate, handleGameOddUpdate } from '../actions';
import '../index.less';
import EditOddForm, { EditOddType } from './EditOddForm';

const { Text } = Typography;

const OddsGroup: React.FC<
	{
		group: API.GameOddGroup;
		onOddClick(odd: API.GameOddItem): void;
		refreshSettings(): Promise<void>;

		editDisabled?: boolean;
	} & API.LotteryNMerchatNHandicapParams
> = ({
	group,
	onOddClick,
	refreshSettings,
	lotteryCode,
	merchantId,
	handicapCode,
	editDisabled,
}) => {
	const [loading, setLoading] = useState(false);
	const access = useAccess();
	return (
		<Card
			loading={loading}
			headStyle={{ backgroundColor: CustomCommonBG, borderBottom: 'none' }}
			title={
				<>
					<Text>{group.playTypeName}</Text>
					{access.GAME_MANAGEMENT_03_INITIALIZE && (
						<MyModalWrapper
							key='initialize'
							content='确认初始化当前赔率吗'
							onFinish={async () => {
								const playTypeCode = group.oddsListVOList[0]?.playTypeCode;
								if (!playTypeCode || !merchantId) return true;
								try {
									setLoading(true);
									await initGameOdds({
										lotteryCode,
										playTypeCode,
										merchantId,
										handicapCode,
									});
									refreshSettings();
									return true;
								} catch {
								} finally {
									setLoading(false);
								}
							}}
						>
							<Button type='primary' size='small'>
								初始化
							</Button>
						</MyModalWrapper>
					)}
				</>
			}
			type='inner'
			bordered={false}
			className='odds-panel'
		>
			<Row>
				{group.oddsListVOList.map((oddItem) => {
					return (
						<Col
							key={oddItem.id}
							className='odds-container'
							xxl={3}
							xl={4}
							lg={4}
							md={6}
							sm={6}
							xs={8}
						>
							<div className='odds-item odds-index'>
								{oddItem.playName.split('-').pop()}
							</div>
							<div className='odds-item odds-value'>
								<Button
									type='link'
									disabled={editDisabled}
									onClick={() => onOddClick(oddItem)}
								>
									{oddItem.maxOdds.toFixed(3)}
								</Button>
							</div>
						</Col>
					);
				})}
			</Row>
		</Card>
	);
};

const ContainerHeight = window.document.documentElement.clientHeight * 0.58;

const OddsSettings: React.FC<API.LotteryNMerchatNHandicapParams> = ({
	lotteryCode,
	merchantId,
	handicapCode,
}) => {
	const access = useAccess();
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<API.GameOddGroup[]>([]);
	const [current, setCurrent] = useState(0);
	const totalPage = useRef<number | null>(null);
	const hasMore =
		!Number.isInteger(totalPage.current) || totalPage.current! > current;

	const loadMoreData = async (refresh = false) => {
		if (!lotteryCode || !merchantId) return;
		if (loading || (!refresh && !hasMore)) {
			return;
		}
		setLoading(true);
		const hide = message.loading('加载赔率配置中...');
		const page = refresh ? 1 : current + 1;
		try {
			const result = await queryGameOddList({
				current: page,
				lotteryCode,
				merchantId,
				handicapCode,
			});
			if (refresh) {
				// 重置数据
				setData(result.data);
			} else {
				// 累加数据
				setData((prevData) => [...prevData, ...result.data]);
			}
			setCurrent(page);
			// 保存页码
			totalPage.current = result.pages;
		} catch {
		} finally {
			setLoading(false);
			hide();
		}
	};

	useEffect(() => {
		if (access.GAME_MANAGEMENT_ODD_SETTINGS_LIST && merchantId) {
			loadMoreData(true);
		}
	}, [access.GAME_MANAGEMENT_ODD_SETTINGS_LIST, merchantId]);

	/* 编辑赔率 */
	const [editOdd, setEditOdd] = useState<API.GameOddItem>();
	const onEditFormFinish = async (
		gameInfo: API.GameOddEditItem,
		type: EditOddType
	) => {
		let success;
		// update
		if (editOdd && lotteryCode) {
			if (type === EditOddType.Single) {
				// 编辑游戏单独赔率
				success = await handleGameOddUpdate(
					{
						...gameInfo,
						isAwards: editOdd.isAwards,
					},
					editOdd
				);
			} else {
				// 编辑游戏玩法赔率
				success = await handleGameGroupOddUpdate({
					lotteryCode,
					merchantId,
					playTypeCode: editOdd.playTypeCode,
					handicapCode,
					...gameInfo,
				});
			}
		}
		// 成功后都需要关闭编辑窗口, 刷新数据
		if (success) {
			setEditOdd(undefined);
			loadMoreData(true);
		}
	};
	const onEditFormCancel = () => {
		setEditOdd(undefined);
	};

	/* 初始化赔率 */
	const [initLoading, setInitLoading] = useState(false);
	const handleRefreshOdd = async () => {
		if (!lotteryCode || !merchantId) return;
		setInitLoading(true);
		try {
			await refreshGameOddsCache({ lotteryCode, merchantId, handicapCode });
			loadMoreData(true);
			return true;
		} catch {
		} finally {
			setInitLoading(false);
		}
	};

	const editDisabled = !(
		access.GAME_MANAGEMENT_03_UPDATE || access.GAME_MANAGEMENT_03_UPDATE_BATCH
	);

	return (
		access.GAME_MANAGEMENT_ODD_SETTINGS_LIST && (
			<ProCard
				direction='column'
				title={
					access.GAME_MANAGEMENT_03_REFRESH && (
						<MyModalWrapper
							content='确认要更新当前缓存吗？'
							onFinish={handleRefreshOdd}
						>
							<Button loading={initLoading}>更新缓存</Button>
						</MyModalWrapper>
					)
				}
				headStyle={{ paddingInline: 0 }}
				bodyStyle={{ paddingInline: 0 }}
			>
				<InfiniteScroll
					className='odds-settings'
					dataLength={data.length}
					next={loadMoreData}
					hasMore={hasMore}
					loader={<Skeleton paragraph={{ rows: 3 }} active />}
					endMessage={<Divider plain>这已经是底部，没有更多数据了</Divider>}
					// scrollableTarget='setting-scrollable-div'
					height={ContainerHeight}
				>
					{data.map((item: API.GameOddGroup) => (
						<OddsGroup
							key={item.playTypeName}
							group={item}
							onOddClick={setEditOdd}
							refreshSettings={() => loadMoreData(true)}
							lotteryCode={lotteryCode!}
							handicapCode={handicapCode}
							merchantId={merchantId}
							editDisabled={editDisabled}
						/>
					))}
				</InfiniteScroll>
				{!editDisabled && (
					<EditOddForm
						open={!!editOdd}
						onFinish={onEditFormFinish}
						modalProps={{ onCancel: onEditFormCancel }}
						initialValues={{
							...editOdd,
							odds: editOdd?.maxOdds,
						}}
					/>
				)}
			</ProCard>
		)
	);
};

export default memo(OddsSettings);
