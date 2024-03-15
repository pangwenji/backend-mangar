export const AppRoutePath = {
	Login: '/login',
	UserList: '/user/userlist',
	Game: '/game',
	GameOrderList: '/game/order',
	GameName: '/game/name',
	MyCollection: '/mycollection',
	RiskList: '/risk/list',
};

export default [
	{
		name: '登录',
		path: AppRoutePath.Login,
		component: './system/Login',
		layout: false,
	},
	{
		path: AppRoutePath.MyCollection,
		access: 'MY_COLLECTION',
	},
	{
		name: '首页',
		path: '/index',
		access: 'INDEX',
		routes: [
			{
				name: '仪表盘',
				path: '/index/dashboard',
				access: 'INDXE_DASHBOARD',
				component: './indexPage/Dashboard',
			},
			{ path: '/index', redirect: '/index/dashboard' },
		],
	},
	{
		name: '会员中心',
		path: '/member',
		access: 'MEMBER_CENTER',
		routes: [
			{
				name: '会员管理',
				path: '/member/list',
				access: 'MEMBER_CENTER_PAGE',
				component: './member/MemberList',
			},
			/*   {
        name: '地址管理',
        path: '/member/address',
        // access: 'canMenuList',
        component: './member/AddressList',
      }, */
			{
				name: '余额日志',
				path: '/member/balance',
				access: 'MEMBER_CENTER_BLANCE_LOG',
				component: './member/BalanceLogList',
			},
			{ path: '/member', redirect: '/member/list' },
		],
	},
	{
		name: '游戏管理',
		path: AppRoutePath.Game,
		access: 'GAME_MANAGEMENT',
		routes: [
			{
				name: '游戏注单',
				path: AppRoutePath.GameOrderList,
				access: 'GAME_MANAGEMENT_ORDER',
				component: './game/GameOrderList',
			},
			{
				name: '赔率设置',
				path: '/game/odds',
				access: 'GAME_MANAGEMENT_ODD_SETTINGS',
				component: './game/GameOddsList',
			},
			{
				name: '开奖结果',
				path: '/game/draw',
				access: 'GAME_MANAGEMENT_DRAW',
				component: './game/GameDrawList',
			},
			{
				name: '数据管理',
				path: '/game/data',
				access: 'GAME_MANAGEMENT_DATA',
				component: './game/GameDataPage',
			},
			{
				name: '游戏维护',
				path: '/game/maintain',
				access: 'GAME_MANAGEMENT_MAINTEN',
				component: './game/GameMaintainPage',
			},
			{
				name: '限额设定',
				path: '/game/quota',
				access: 'GAME_MANAGEMENT_LIMIT',
				component: './game/GameQuotaList',
			},
			{ path: '/game', redirect: '/game/data' },
		],
	},
	{
		name: '聊天室管理',
		path: '/chat',
		access: 'CHAT_MANAGEMENT',
		routes: [
			{
				name: '发言管理',
				path: '/chat/speak',
				component: './chat/PostSettings',
				access: 'CHAT_MANAGEMENT_SPEAK',
			},
			{
				name: '指令配置',
				path: '/chat/command',
				component: './chat/CommandSettings',
				access: 'CHAT_MANAGEMENT_DIRECT',
			},
			{
				name: '模板配置',
				path: '/chat/template',
				component: './chat/TemplateSettings',
				access: 'CHAT_MANAGEMENT_TEMPLATE',
			},
			{ path: '/chat', redirect: '/chat/command' },
		],
	},
	{
		name: '报表统计',
		path: '/report',
		access: 'REPORT_MANAGEMENT',
		routes: [
			{
				name: '营收报表',
				path: '/report/revenue',
				access: 'REPORT_MANAGEMENT_REVENUE',
				component: './report/RevenueList',
			},
			{
				name: '会员投注',
				path: '/report/bettors',
				access: 'REPORT_MANAGEMENT_MEMBER',
				component: './report/BettorList',
			},
			{
				name: '游戏汇总',
				path: '/report/game-summary',
				access: 'REPORT_MANAGEMENT_GAME',
				component: './report/GameSummary',
			},
			{ path: '/report', redirect: '/report/revenue' },
		],
	},
	{
		name: '日志管理',
		path: '/log',
		access: 'LOG_MANAGEMENT',
		routes: [
			{
				name: '登录日志',
				path: '/log/login',
				access: 'LOG_MANAGEMENT_LOGIN',
				component: './log/LoginLogPage',
			},
			{
				name: '操作日志',
				path: '/log/operate',
				access: 'LOG_MANAGEMENT_OPERATE',
				component: './log/OperateLogPage',
			},
			{
				name: '系统日志',
				path: '/log/system',
				access: 'LOG_MANAGEMENT_SYS',
				component: './log/SystemLogPage',
			},
			{ path: '/log', redirect: '/log/login' },
		],
	},
	{
		name: '风控管理',
		path: '/risk',
		access: 'RISK_MANAGEMENT',
		routes: [
			{
				name: '风控配置',
				path: '/risk/settings',
				access: 'RISK_MANAGEMENT_CONFIG',
				component: './risk/RiskSettings',
			},
			{
				name: '风控预警',
				path: AppRoutePath.RiskList,
				access: 'RISK_MANAGEMENT_RECORD',
				component: './risk/RiskList',
			},
			{ path: '/risk', redirect: '/risk/settings' },
		],
	},
	{
		name: '系统管理',
		path: '/system',
		access: 'SYSTEM_MANAGEMENT',
		routes: [
			{
				name: '用户管理',
				path: '/system/adminlist',
				access: 'SYSTEM_MANAGEMENT_USER',
				component: './system/AdminList',
			},
			{
				name: '角色管理',
				path: '/system/rolelist',
				access: 'SYSTEM_MANAGEMENT_ROLE',
				component: './system/RoleList',
			},
			{
				name: '资源管理',
				path: '/system/rulelist',
				access: 'SYSTEM_MANAGEMENT_MENU',
				component: './system/MenuList',
			},
			{
				name: '任务管理',
				path: '/system/joblist',
				access: 'SYSTEM_MANAGEMENT_TASK',
				component: './system/JobList',
			},
			{
				name: '网站管理',
				path: '/system/websitelist',
				access: 'SYSTEM_MANAGEMENT_WEBSITE',
				component: './system/WebsitePage',
			},
			{
				name: '测试管理',
				path: '/system/testlist',
				access: 'SYSTEM_MANAGEMENT_TEST',
				component: './system/TestList',
			},
			{
				name: '盘口管理',
				path: '/system/handicaplist',
				access: 'SYSTEM_MANAGEMENT_HANDICAP',
				component: './system/HandicapList',
			},
			{ path: '/system', redirect: '/system/adminlist' },
		],
	},
	{ path: '/', redirect: '/index' },
	{ path: '*', layout: false, component: './404' },
];
