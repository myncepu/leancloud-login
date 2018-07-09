import AV from 'leancloud-storage'

// LeanCloud - 初始化 - 将这里的 APP_ID 和 APP_KEY 替换成自己的应用数据
// https://leancloud.cn/docs/sdk_setup-js.html#初始化
var APP_ID = 'xwmOIervtUu8Atzl27F5GFII-gzGzoHsz'
var APP_KEY = 'hcpAzHN3xJrzk6repb8vcKFy'
export const leancloudInit = () => {
  AV.init({
    appId: APP_ID,
    appKey: APP_KEY
  })
}
