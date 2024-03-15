// https://umijs.org/config/
import { defineConfig } from '@umijs/max';
export default defineConfig({
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  define: {
    API_URL: 'http://game.dcsoa.com:18082', // API地址, 没有配置, 则和页面同源
    HTTPS_API_URL: 'https://gateway.dcsob.com:18084', // https API地址
  },
});
