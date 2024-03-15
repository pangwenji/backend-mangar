// https://umijs.org/config/
import { defineConfig } from '@umijs/max';
export default defineConfig({
  define: {
    API_URL: 'http://gateway.kkweio.com:18084', // API地址, 没有配置, 则和页面同源
    HTTPS_API_URL: 'https://gateway.kkweio.com:18084', // API地址, 没有配置, 则和页面同源
  },
});
