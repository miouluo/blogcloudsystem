// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: ''
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { a, b } = event
    const sum = Number(a) + Number(b)  // 确保是数字运算
    
    // 直接返回结果
    return {
      success: true,
      data: sum
    }
  } catch (err) {
    console.error('计算失败:', err)
    return {
      success: false,
      errMsg: err.message || '计算失败'
    }
  }
} 