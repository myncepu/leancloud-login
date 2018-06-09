import AV from 'leancloud-storage'

// LeanCloud - 初始化 - 将这里的 APP_ID 和 APP_KEY 替换成自己的应用数据
// https://leancloud.cn/docs/sdk_setup-js.html#初始化
var APP_ID = 'No9VTS6T0QugN8j2l9Foew4T-gzGzoHsz'
var APP_KEY = 'F7ESYd1jG0zMdhpDMeKXsHig'
export const leancloudInit = () => {
  AV.init({
    appId: APP_ID,
    appKey: APP_KEY
  })
}
