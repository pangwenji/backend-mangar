// 是否可用 0:禁用 1:启用
export enum SwitchStatus {
	Close = 0,
	Open = 1,
}

export const SwitchStatusEnums = {
	[SwitchStatus.Open]: {
		text: '启用',
		status: 'Processing',
	},
	[SwitchStatus.Close]: {
		text: '禁用',
		status: 'Error',
	},
};

// 成功与否，0-失败，1-成功
export const SuccessEnums = {
	[SwitchStatus.Open]: {
		text: '成功',
		status: 'Success',
	},
	[SwitchStatus.Close]: {
		text: '失败',
		status: 'Error',
	},
};

// 1-注册,2-登录,3-投注
export const enum StatisticsType {
	Register = '1',
	Login = '2',
	Bet = '3',
}

// 系统用户1,代理2,代理子账号3
export enum AdminUser {
	SysMember = 1,
	Proxy,
	SubProxy,
}

export const AdminUserEnums = {
	[AdminUser.SysMember]: {
		text: '系统用户',
	},
	[AdminUser.Proxy]: {
		text: '代理',
	},
	[AdminUser.SubProxy]: {
		text: '代理子账号',
	},
};

export const AdminGoogleBindEnums = {
	[SwitchStatus.Close]: '未绑定',
	[SwitchStatus.Open]: '已绑定',
};

// 管理员操作状态 1成功 2失败
export enum AdminLogStatus {
	Success = 1,
	Fail,
}

// 权限菜单类型 1:按钮;2:菜单;3:目录
export enum MenuType {
	Button = 1,
	Menu,
	Catalog,
}

export const MenuTypeEnums = {
	[MenuType.Button]: '按钮',
	[MenuType.Menu]: '菜单',
	[MenuType.Catalog]: '目录',
};

// 区块链类型 1,Ethereum;2,Tron;3,Optimism;4,Arbitrum;
export enum BlockChainType {
	Ethereum = 1,
	Tron,
	Optimism,
	Arbitrum,
}

export const BlockChainTypeEnums = {
	[BlockChainType.Ethereum]: 'Ethereum',
	[BlockChainType.Tron]: 'Tron',
	[BlockChainType.Optimism]: 'Optimism',
	[BlockChainType.Arbitrum]: 'Arbitrum',
};

// 区块链网络类型 - 1,ERC20;2,TRC20;3,Optimism;4,Arbitrum;
export enum BlockChainNetType {
	ERC20 = 1,
	TRC20,
	Optimism,
	Arbitrum,
}

export const BlockChainNetTypeEnums = {
	[BlockChainNetType.ERC20]: 'ERC20',
	[BlockChainNetType.TRC20]: 'TRC20',
	[BlockChainNetType.Optimism]: 'Optimism',
	[BlockChainNetType.Arbitrum]: 'Arbitrum',
};

// 地址类型 - 1,投注地址;2,存款地址;3,提現地址;
export enum MemberAddressType {
	Bet = 1,
	Deposit,
	Withdraw,
}

export const MemberAddressTypeEnums = {
	[MemberAddressType.Bet]: '投注地址',
	[MemberAddressType.Deposit]: '存款地址',
	[MemberAddressType.Withdraw]: '提現地址',
};

// 0:维护 1:正常 2:休市 3:隐藏
export enum GameStatus {
	Maintaining = 0,
	Open,
	Closed,
	Hidden,
}

export const GameStatusEnums = {
	[GameStatus.Maintaining]: '维护',
	[GameStatus.Open]: '正常',
	[GameStatus.Closed]: '休市',
	[GameStatus.Hidden]: '隐藏',
};

// 维护周期 0:每天 1:周一 2:周二 3:周三 4:周四 5:周五 6:周六 7:周日
export enum MaintenancePeriod {
	EveryDay = 0,
	Monday,
	Tuesday,
	Wednesday,
	Thursday,
	Friday,
	Saturday,
	Sunday,
}
export const MaintenancePeriodEnums = {
	[MaintenancePeriod.EveryDay]: '每天',
	[MaintenancePeriod.Monday]: '周一',
	[MaintenancePeriod.Tuesday]: '周二',
	[MaintenancePeriod.Wednesday]: '周三',
	[MaintenancePeriod.Thursday]: '周四',
	[MaintenancePeriod.Friday]: '周五',
	[MaintenancePeriod.Saturday]: '周六',
	[MaintenancePeriod.Sunday]: '周日',
};

// 订单状态;0:未结算 1:待开奖  2:已派奖  3:玩家撤單 4:系统撤单 5 限红扣除 6：退还本金
export enum GameOrderStatus {
	Unsettled = 0,
	NotWon,
	Won,
	Cancelled,
	SystemCancelled,
	Deduct,
	ReturnCapital,
}
export const GameOrderStatusEnums = {
	[GameOrderStatus.Unsettled]: '待开奖',
	[GameOrderStatus.NotWon]: '未中奖',
	[GameOrderStatus.Won]: '已派奖',
	[GameOrderStatus.Cancelled]: '玩家撤单',
	[GameOrderStatus.SystemCancelled]: '系统撤单',
	[GameOrderStatus.Deduct]: '限红扣除',
	[GameOrderStatus.ReturnCapital]: '退还本金',
};

/* 输或者赢; 1:輸;2:和 3:贏 4:不计算 */
export enum GameWinLose {
	Lose = 1,
	Draw,
	Win,
	NotCount,
}
export const GameWinLoseEnums = {
	[GameWinLose.Lose]: '輸',
	[GameWinLose.Draw]: '和',
	[GameWinLose.Win]: '贏',
	[GameWinLose.NotCount]: '不计算',
};

// tag 1:下单时间  2:结算时间
export enum GameOrderTimeTag {
	OrderTime = 1,
	BillTime,
}

export const GameOrderTimeTagEnums = {
	[GameOrderTimeTag.OrderTime]: '投注时间',
	[GameOrderTimeTag.BillTime]: '结算时间',
};

// 状态 0 已开盘 1开奖中 2已开奖 3开奖失败 4已封盘 9未开盘
export enum GameDrawStatus {
	Open = 0,
	Drawing,
	Finished,
	Failed,
	Closed,
	NotOpen = 9,
}
export const GameDrawStatusEnums = {
	[GameDrawStatus.Open]: '已开盘',
	[GameDrawStatus.Drawing]: '开奖中',
	[GameDrawStatus.Finished]: '已开奖',
	[GameDrawStatus.Failed]: '开奖失败',
	[GameDrawStatus.Closed]: '已封盘',
	[GameDrawStatus.NotOpen]: '未开盘',
};

// 后台管理员-mgt,前台玩家-client
export enum LoginUserType {
	MGT = 'mgt',
	Client = 'client',
}

//  0:否 1:是
export const YNEnums = {
	[SwitchStatus.Close]: '否',
	[SwitchStatus.Open]: '是',
};

export const TempMerchantCode = 'sys_game_hall';

/* 预警类型:
PROFIT_WARNING:會員盈利預警
BETTING_WARNING:會員對賭預警
GAME_LOSS_WARNING:游戲虧損預警
REGISTER_WARNING:注冊預警
LOGIN_WARNING:登陸預警
	 */
export const RiskTypeEnums = {
	PROFIT_WARNING: '會員盈利預警',
	BETTING_WARNING: '會員對賭預警',
	GAME_LOSS_WARNING: '游戲虧損預警',
	REGISTER_WARNING: '注冊預警',
	LOGIN_WARNING: '登陸預警',
};
