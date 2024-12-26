const cloud = require('wx-server-sdk')
const insert = require('./modules/insert')

cloud.init({
  env: 'clound-0gt7nesg13edd57a'
})

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('收到请求：', event)
  
  switch (event.type) {
    case 'insert':
      return await insert.main(event)
    default:
      return {
        success: false,
        errMsg: '未知的操作类型'
      }
  }
} 