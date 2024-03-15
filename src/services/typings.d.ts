import type { Settings as LayoutSettings } from '@ant-design/pro-components';

import type {
	BlockChainNetType,
	BlockChainType,
	GameDrawStatus,
	GameOrderStatus,
	GameStatus,
	MaintenancePeriod,
	MemberAddressType,
	MenuType,
	StatisticsType,
	SwitchStatus,
} from './enums';

export type AppInitState = {
	settings?: Partial<LayoutSettings>;
	myMenuTree?: API.MyMenuItem[];
	myMenuList?: API.MyMenuItem[];
	myCollectMenuList?: API.MyCollectMenuItem[];
	lotteryMenu?: API.LotteryItem[];
	currentAdmin?: API.CurrentAdmin;
	// systemDictionary?: API.SysDictionary;
	loading?: boolean;
	fetchAdminInfo?: () => Promise<API.CurrentAdmin | undefined>;
	fetchMyMenuList?: () => Promise<
		| {
				myMenuTree: API.MyMenuItem[];
				myMenuList: API.MyMenuItem[];
		  }
		| undefined
	>;
	fetchLotteryMenu?: () => Promise<API.LotteryItem[] | undefined>;
	langs?: Record<string, string>;
};

export declare namespace API {
	interface CommonData<T = any> {
		success: boolean;
		message: null | string;
		data: T;
		code: number;
	}

	type CommonListResult<T, OtherProps = Record<string, unknown>> = {
		records: T[];
		total: number;
		size: number;
		current: number;
		orders: any[];
		optimizeCountSql: boolean;
		searchCount: boolean;
		maxLimit: null;
		countId: null;
		pages: number;
	} & OtherProps;

	type CommonListData<
		T = any,
		OtherProps = Record<string, unknown>
	> = CommonData<CommonListResult<T, OtherProps>>;

	type CommonSummayResult<T = any, OtherProps = Record<string, unknown>> = {
		pageInfo: CommonListResult<T>;
		sumInfo: OtherProps;
	};

	type Captcha = CommonData<{
		key: string; // 公钥
		code: string; // 动态码
	}>;
	type LoginParams = {
		username: string;
		password: string;
		verificationCode: string;
		browserFingerprint?: string;
		googleCode: string;
		platform?: 'mgt';
	};

	type LoginData = {
		roleId: number;
		token: string;
		userId: number;
		userName: string;
	};

	type LoginResult = CommonData<LoginData>;

	// 菜单规则
	type MenuItem = {
		isValidity: SwitchStatus;
		remark: null | string;
		createTime: string;
		updateTime: string;
		creatorUser: null;
		updaterUser: null;
		id: string;
		name: string;
		code: string;
		url: string;
		parentId: null | string | number;
		sort: number;
		menuType: MenuType;
		menuLevel: number;
		child?: MenuItem[];
		icon: string;
	};

	type MenuEditItem = Pick<
		MenuItem,
		'name' | 'code' | 'url' | 'parentId' | 'icon' | 'sort' | 'menuType'
	> & {
		id?: string;
	};
	type MenuListResult = CommonData<MenuItem[]>;
	type MyMenuItem = MenuItem;

	type MyCollectMenuItem = Pick<MenuItem, 'id' | 'name' | 'code'>;
	type ColectMenuParams = {
		menuId: number;
		collection: boolean;
	};

	type RoleItem = {
		id: number;
		roleCode: string;
		name: string;
		remark: string;
		isValidity: number;
		createTime: string;
	};

	type RoleEditItem = Omit<RoleItem, 'id' | 'createTime'> & {
		id?: number;
	};

	type RoleListResult = CommonListData<RoleItem>;

	type RoleBindUserParams = {
		roleId: number;
		unbindUsers?: number[];
		bindUsers?: number[];
	};

	type RoleUserItem = Pick<AdminItem, 'id' | 'firstName'> & {
		key: string;
	};

	type RoleMenuItem = Omit<MenuItem, 'child'> & {
		isChecked: boolean;
		child?: RoleMenuItem[];
	};

	// 系统-用户
	type AdminCreateItem = {
		firstName: string;
		lastName: string;
		email: string;
		password: string;
		confirmPwd: string;
		userType: string;
		isValidity: SwitchStatus;
		ipWhite?: string;
		whiteIPList?: { ip: string }[];
	};

	type AdminEditItem = {
		id: number;
	} & AdminCreateItem;

	type AdminBindRoleParams = {
		id: number;
		roleId: number;
	};

	type AdminAuthParams = {
		id: number;
		isBind: SwitchStatus;
	};

	type AdminAuthData = {
		id: number;
		googleKey: string;
		googleUrl: string;
	};

	type AdminEnableParams = {
		userIds: number[];
		isValidity: SwitchStatus;
	};

	type AdminEditPWDParams = Pick<
		AdminEditItem,
		'id' | 'password' | 'confirmPwd'
	>;

	// 管理员成员
	type AdminItem = Omit<AdminEditItem, 'password' | 'confirmPwd'> & {
		roleId: number | null;
		isBind: SwitchStatus;
		createTime: string;
		googleKey: string | null;
		googleUrl: string | null;
	};

	type AdminListResult = CommonListData<AdminItem>;

	// role menu
	type RoleMenu = {
		serverCode: string;
		browsersName: string;
	};

	// 当前管理员
	type CurrentAdmin = AdminItem;
	// 本地记录信息
	type LocalUserinfo = Pick<CurrentAdmin, 'id'>;

	type UpdateCurrentAdminPWDParams = {
		oldPwd: string;
		newPwd: string;
	};

	// 在线用户数据
	type OnlineUserInfo = {
		mgtUserNum: number;
		playerNum: number;
	};

	// 仪表盘数据
	type DashboardMonthData = {
		day: string;
		num: number;
	};

	type DashboardParams = {
		queryCode: StatisticsType;
		startTime?: string;
		endTime?: string;
	};

	type DashboardInfo = {
		playerStateInfo: {
			todayPlayerIncNum: number;
			todayPlayerIncRate: string;
			playerTotalNum: number;
		};
		betStateInfo: {
			todayBetAmount: number;
			todayBetRate: string;
			monthBetAmount: number;
		};
		winLossStateInfo: {
			todayWinLossAmount: number;
			todayWinLossRate: string;
			monthWinLossAmount: number;
		};
		monthDataList: DashboardMonthData[];
	};

	type MemberItem = {
		id: number;
		accountName: string;
		fromType: number;
		balance: number;
		currency: string;
		merchantName: string;
		thirdId: string;
		isValidity: SwitchStatus;
		createTime: string;
		betAmount: number;
		winLossAmount: number;
		onlineStatus: boolean;
	};

	type MemberListSummary = {
		sumBalance: number;
		sumBetAmount: number;
		sumWinLossAmount: number;
	};
	type MemberListResult = CommonData<
		CommonSummayResult<MemberItem, MemberListSummary>
	>;

	type TradeType = {
		tradeType: number;
		tradeName: string;
	};

	type BalanceLogItem = {
		id: number;
		userId: number;
		accountName: string;
		tradeAmount: number;
		tradeType: number;
		beforeBalance: number;
		afterBalance: number;
		createTime: string;
		remark: string;
	};
	type BalanceLogListResult = CommonListData<BalanceLogItem>;

	type BettorItem = {
		userName: string;
		gameName: string;
		betAmount: number;
		validAmount: number;
		rewardAmount: number;
		count: number;
		winCount: number;
		lossCount: number;
		memberWinLoss: number;
		companyWinLoss: number;
		memberWinPercent: string;
	};

	type BettorSummary = {
		sumCount: number;
		sumValidAmount: number;
		sumBetAmount: number;
		sumRewardAmount: number;
		sumCompanyWinLoss: number;
		sumMemberWinLoss: number;
		sumWinCount: number;
		sumLossCount: number;
	};
	type BettorListResult = CommonData<
		CommonSummayResult<BettorItem, BettorSummary>
	>;

	type RevenueItem = {
		merchantName: string;
		count: number;
		betAmount: number;
		validAmount: number;
		rewardAmount: number;
		companyWinLoss: number;
	};

	type RevenueSummary = {
		sumCount: number;
		sumValidAmount: number;
		sumBetAmount: number;
		sumRewardAmount: number;
		sumCompanyWinLoss: number;
	};

	type RevenueListResult = CommonData<
		CommonSummayResult<RevenueItem, RevenueSummary>
	>;

	type GameSummaryItem = {
		gameName: string;
		betAmount: number;
		validAmount: number;
		userCount: number;
		rewardAmount: number;
		companyWinLoss: number;
		count: number;
		winCount: number;
		lossCount: number;
		memberWinLoss: number;
		gameWinPercent: string;
	};

	type GameSummary = {
		sumCount: number;
		sumUserCount: number;
		sumSmallUserCount: number;
		sumValidAmount: number;
		sumBetAmount: number;
		sumRewardAmount: number;
		sumCompanyWinLoss: number;
		sumMemberWinLoss: number;
		sumWinCount: number;
		sumLossCount: number;
	};

	type GameSummaryListResult = CommonData<
		CommonSummayResult<GameSummaryItem, GameSummary>
	>;

	// 会员中心
	type AddressItem = {
		isValidity: SwitchStatus;
		remark: string;
		createTime: string;
		updateTime: string;
		creatorUser: number;
		updaterUser: number;
		id: number;
		userId: number;
		userName: string;
		blockChainType: BlockChainType;
		blockChainNetType: BlockChainNetType;
		memberAddressType: MemberAddressType;
		memberAddress: string;
	};
	type AddressListResult = CommonListData<AddressItem>;

	// 游戏管理
	type GameTypeItem = {
		id: number;
		gameTypeName: string;
		iconUrl: string;
		remark: string;
	};

	type GameTypeMenu = Pick<GameTypeItem, 'id' | 'gameTypeName'>;
	type GameTypeEditItem = {
		id?: number;
		gameTypeName: string;
		iconUrl?: string;
		remark: string;
		file?: Blob;
	};

	// 玩法下拉菜单
	type GamePlayType = {
		playTypeCode: string;
		playTypeName: string;
	};
	// 二级玩法下拉菜单
	type SubGamePlayType = {
		playCode: string;
		playName: string;
	};
	// 表格项
	type GamePlayTypeItem = {
		id: number;
		lotteryName: string;
		playTypeName: string;
		isValidity: SwitchStatus;
	};

	type GameItem = {
		id: number;
		gameName: string;
		gameTypeName: string;
		gameType: number;
		iconUrl: null | string;
		moveIconUrl: null | string;
		remark: null | string;
		sysGameTypeId: number;
	};

	type GameMenu = {
		gameCode: string;
		gameName: string;
	};

	type GameEditItem = {
		id?: number;
		gameTypeId: number;
		remark: string;
		// gameCode: string;
		file?: Blob;
		iconUrl?: string;
	};
	type GameListResult = CommonListData<GameItem>;

	// 游戏维护
	type GameStatusItem = Omit<GameItem, 'remark'> & {
		isValidity: GameStatus;
	};
	type GameStatusListData = Record<string, GameStatusItem[]>;
	type GameStatusEditItem = Pick<GameStatusItem, 'id' | 'isValidity'>;

	type GameMaintainPlanItem = {
		id: string;
		gameName: string;
		period: MaintenancePeriod;
		startTime: string;
		endTime: string;
	};

	type GameMaintainPlanEditItem = Omit<
		GameMaintainPlanItem,
		'id' | 'gameName'
	> & {
		id?: string;
		gameCode?: string;
	};

	// 游戏注单
	type GameOrderItem = {
		id: number;
		lotteryName: string;
		orderNo: string;
		orderDetailNo: string;
		userName: string;
		periodsNumber: number;
		betContent: string;
		odds: number;
		totalAmount: number;
		validAmount: number;
		returnAmount: number;
		rewardAmount: number;
		orderStatus: GameOrderStatus;
		orderDate: string;
		billTime: string;
		winLoseAmount: number;
		runningAmount: number;
		playTypeName: string;
	};

	type GameOrderListResult = CommonListData<GameOrderItem>;
	type GameOrderSummary = {
		totalAmount: number;
		validAmount: number;
		runningAmount: number;
		returnAmount: number;
		rewardAmount: number;
		winLoseAmount: number;
	};

	type SwitchGameOrderCancelParams = { id: number; isCancel: SwitchStatus };

	type LotteryItem = {
		lotteryCode: string;
		lotteryName: string;
	};

	type GameDrawItem = {
		id: number;
		lotteryCode: string;
		lotteryName: string;
		periodsNumber: number;
		autoDrawingDate: string;
		autoCloseDate: string;
		drawingDate: string;
		drawingResult: string;
		startBillTime: string;
		endBillTime: string;
		status: GameDrawStatus;
		manualResult: string;
		rewardAmount: number;
		totalAmount: number;
		betNum: number;
		betPeople: number;
		winLoseAmount: number;
	};

	type GameDrawListResult = CommonListData<GameDrawItem>;

	type ManualDrawParams = {
		lotteryCode: string;
		periodsNumber: number;
		drawingResult: string;
	};

	type SkipCurrentDrawParams = Omit<ManualDrawParams, 'drawingResult'>;

	type GameOddItem = {
		id: number;
		playTypeCode: string;
		playTypeName: string;
		playName: string;
		lotteryName: string;
		odds: number;
		maxOdds: number;
		singleMaxLimit: number;
		singleMinLimit: number;
		isAwards: SwitchStatus;
	};
	type GameOddEditItem = { odds: string; isAwards: SwitchStatus };
	type GameGroupOddEditItem = {
		odds: string;
		lotteryCode: string;
		playTypeCode: string;
	};
	type GameGroupOddBatchEditItem = {
		odds: string;
		lotteryCode: string;
		handicapCode: string;
		playTypeCode: string;
		merchantId: number;
	};
	type GameOddGroup = {
		playTypeName: string;
		oddsListVOList: GameOddItem[];
	};
	type GameOddListResult = CommonListData<GameOddGroup>;

	// 限额设定
	type GameQuotaItem = {
		drawWaterRatio: number;
		limitGroupName: string;
		limitGroupCode: string;
		lotteryCode: string;
		returnPointRatio: number;
		singleMaxLimit: number;
		singleMinLimit: number;
		singleIssueLimit: number;
		orderNum: number;
		maxReward: number;
	};

	type GameQuotaEditItem = Omit<GameQuotaItem, 'limitGroupName' | 'orderNum'>;
	type GameQuotaListResult = CommonListData<GameQuotaItem>;

	// 日志
	type LoginLogItem = {
		id: number;
		userName: string;
		merchantName: string;
		domainName: string;
		ipAddr: string;
		ipType: string;
		locationCity: string;
		clientType: string;
		isSuccess: SwitchStatus; // 成功与否，0-失败，1-成功
		remark: string;
		createTime: string;
		userId: number;
	};
	type LoginLogListResult = CommonListData<LoginLogItem>;

	type SystemLogItem = {
		id: string;
		sysName: string;
		targetServer: string;
		routeInfo: string;
		optUserId: number;
		userName: string;
		httpMethod: string;
		url: string;
		ipAddress: string;
		location: string;
		contentType: string;
		requestHeader: string;
		params: string;
		resultJson: string;
		timeCost: number;
		createTime: string;
	};

	type OperateLogItem = {
		id: string;
		userName: string;
		domainName: string;
		module: string;
		operate: string;
		ipAddress: string;
		location: string;
		params: string;
		response: string;
		createTime: string;
	};

	// 聊天模板
	type ChatTemplate = {
		isValidity: SwitchStatus;
		remark: string;
		createTime: string;
		updateTime: string;
		updaterUser: number;
		id: number;
		gameCode: string;
		templateType: string;
		variables: string[];
		contents: string;
		previewContents: string;
	};
	type ChatTemplateEdit = Pick<ChatTemplate, 'id' | 'contents'>;
	type ChatTemplateListResult = CommonData<ChatTemplate[]>;

	// 游戏指令
	type Command = {
		isValidity: SwitchStatus;
		remark: null;
		createTime: string;
		updateTime: string;
		updaterUser: null;
		id: number;
		gameCode: string;
		playName: string;
		playCode: string;
		playTypeCode: string;
		sonPlayTypeCode: string;
		commandType: number;
		chineseCommand: string;
		englishCommand: string;
		commandList: string;
		regexCommandList: string;
		orderDelimiter: string;
		commandDelimiter: string;
	};

	type CommandEdit = Pick<
		Command,
		| 'id'
		| 'commandType'
		| 'chineseCommand'
		| 'englishCommand'
		| 'commandDelimiter'
	>;

	type CommandOptions = {
		commandTypes: Record<string, string>;
		commandDelimiterTypes: Record<string, string>;
	};

	type CommandListResult = CommonData<
		CommandOptions & {
			commands: Command[];
		}
	>;

	// 发言配置
	type PostSetting = {
		id: string;
		speakConfigType: string;
		amount: number;
		isValidity: SwitchStatus;
		remark: string;
	};

	type PostSettingEdit = Pick<PostSetting, 'id' | 'amount' | 'isValidity'>;
	// 游戏禁言配置
	type GameBanItem = {
		id: number;
		gameCode: string;
		gameName: string;
		isSpeakOpen: SwitchStatus;
	};
	type GameBanEditItem = Pick<GameBanItem, 'id' | 'isSpeakOpen'>;

	// 会员禁言配置
	type MemberBanItem = {
		isValidity: SwitchStatus;
		remark: null | string;
		createTime: string;
		updateTime: string;
		updaterUser: null;
		id: string;
		accountName: string;
		startTime: string;
		endTime: string;
		days: number;
	};
	type MemberBanEditItem = Pick<MemberBanItem, 'accountName' | 'days'>;

	// 风险
	type RiskItem = {
		isValidity: SwitchStatus;
		remark: string;
		createTime: string;
		updateTime: string;
		updaterUser: number;
		id: number;
		warningType: string;
		content: string;
		configId: number;
		warningConfigContent: string;
	};

	type RiskSettingsEdit = {
		profitWarning: boolean;
		profitAmount: number;
		bettingWarning: boolean;
		bettingAmount: number;
		gameLossWarning: boolean;
		gameLossAmount: number;
		registerWarning: boolean;
		registerWarningNumber: number;
		loginWarning: boolean;
		loginWarningNumber: number;
	};

	type RiskSettings = RiskSettingsEdit & {
		isValidity: null;
		remark: null;
		createTime: string;
		updateTime: string;
		updaterUser: null;
		id: number;
		gameId: number;
	};

	// 任务
	type JobItem = {
		id: number;
		enumName: string;
		url: string;
		jobName: string;
		jobHandler: string;
		periodsNumber: string;
		drawingResult: string;
		drawingDate: string;
		jsonArrayKey: string;
		jsonObjectKey: string;
		isFirst: SwitchStatus;
		code: string;
		msg: string;
		codeValue: string;
		msgValue: string;
		weight: number;
		param: string;
		isValidity: SwitchStatus;
		remark: string;
	};

	type JobEditItem = Omit<JobItem, 'id'> & { id?: number };

	// 网站管理
	type TextImgItem = {
		isValidity: SwitchStatus;
		remark: string;
		createTime: string;
		updateTime: string;
		updaterUser: number;
		id: number;
		name: string;
		type: string;
		imgSize: string;
		fileName: string;
		fileUrl: string;
		hyperLinks: null | string;
	};

	type TextImgEditItem = Pick<TextImgItem, 'id' | 'remark'> & { file?: Blob };

	// 客服配置
	type CustomServiceItem = {
		id: number;
		position: string;
		name: string;
		type: string;
		account: string;
		isValidity: SwitchStatus;
	};
	type CustomServiceEditItem = Pick<CustomServiceItem, 'id' | 'account'>;
	type CustomServiceSwitchParams = Pick<CustomServiceItem, 'id' | 'isValidity'>;

	// 文案配置
	type CopyItem = {
		isValidity: SwitchStatus;
		remark: string;
		createTime: string;
		updateTime: string;
		updaterUser: number;
		id: number;
		lotteryType: string;
		playDoc: string;
		oddDoc: string;
	};

	type CopyEditItem = Pick<CopyItem, 'id' | 'playDoc' | 'oddDoc'>;

	// 开盘时间项
	type OpenTimeItem = {
		orderNum: number;
		gameCode: string;
		gameName: string;
		isAutoDrawing: SwitchStatus;
		drawingDate: number; // 秒
	};

	type OpenTimeEditItem = Omit<OpenTimeItem, 'gameName' | 'orderNum'>;
	type OpenTimeSwitchItem = Omit<OpenTimeEditItem, 'drawingDate'>;

	// 测试管理
	type TestItem = Pick<
		GameDrawItem,
		'lotteryCode' | 'lotteryName' | 'periodsNumber' | 'drawingResult'
	> & {
		manualDraw: boolean;
	};

	type TestEditItem = Pick<TestItem, 'lotteryCode' | 'periodsNumber'> & {
		drawResult: string;
	};

	type TestSwitchParams = Pick<TestItem, 'lotteryCode' | 'manualDraw'>;

	// 第三方信息
	type MerchantInfo = {
		merchantName: string;
		merchantCode: string;
		id: number;
	};

	// 盘口
	type HandicapItem = {
		gameCode: string;
		gameName: string;
		handicapSwitch: SwitchStatus;
		handicapNum: number;
	};
	type HandicapEditItem = Omit<HandicapEditItem, 'gameName'>;

	type HandicapOption = {
		handicapCode: string;
		handicapName: string;
		orderNum: 1;
	};

	export type LotteryNMerchatParams = {
		lotteryCode: string;
		merchantId: number;
	};

	export type LotteryNMerchatNHandicapParams = LotteryNMerchatParams & {
		handicapCode?: string;
	};
}
