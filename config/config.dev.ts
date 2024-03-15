// https://umijs.org/config/
import { defineConfig } from '@umijs/max';
export default defineConfig({
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  define: {
    API_URL: `/dev`, // API地址, 没有配置, 则和页面同源
  },
});
