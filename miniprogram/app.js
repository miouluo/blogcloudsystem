// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      // 初始化云开发环境
      wx.cloud.init({
        env: 'clound-0gt7nesg13edd57a',
        traceUser: true,
        success: () => {
          // 保存环境ID到全局数据
          this.globalData.cloudEnv = 'clound-0gt7nesg13edd57a'
          console.log('云环境初始化成功，当前环境：', this.globalData.cloudEnv)
        },
        fail: err => {
          console.error('云环境初始化失败：', err)
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    cloudEnv: null
  }
})

