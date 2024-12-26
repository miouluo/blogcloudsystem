// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'clound-0gt7nesg13edd57a'
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    if (!wxContext.OPENID) {
      throw new Error('获取OPENID失败')
    }
    
    // 直接返回结果
    return {
      success: true,
      data: {
        openid: wxContext.OPENID
      }
    }
  } catch (err) {
    console.error('获取OPENID失败:', err)
    return {
      success: false,
      errMsg: err.message || '获取OPENID失败'
    }
  }
} 