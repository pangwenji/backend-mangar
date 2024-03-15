// https://umijs.org/config/
import { defineConfig } from '@umijs/max';
export default defineConfig({
	// https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
	define: {
		API_URL: 'http://18.162.35.39:18082',
		HTTPS_API_URL: 'https://devadmin.dcsob.com:18084', // API地址, 没有配置, 则和页面同源
	},
});
