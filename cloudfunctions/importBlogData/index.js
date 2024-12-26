// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: '',
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log('开始执行导入数据云函数')
    console.log('event:', event)
    console.log('context:', context)
    
    const db = cloud.database()
    const wxContext = cloud.getWXContext()
    
    console.log('wxContext:', wxContext)

    // 检查数据库连接
    try {
      const testResult = await db.collection('blog').count()
      console.log('数据库连接测试:', testResult)
    } catch (err) {
      console.error('数据库连接失败:', err)
      const response = {
        success: false,
        code: -4,
        message: '数据库连接失败',
        error: err.message
      }
      console.log('返回错误响应:', response)
      return response
    }

    if (!wxContext.OPENID) {
      console.error('无法获取OPENID')
      const response = {
        success: false,
        code: -1,
        message: '获取用户信息失败'
      }
      console.log('返回错误响应:', response)
      return response
    }

    // 准备数据
    const blogData = [{
      date: "20240808",
      image: "https://pic1.zhimg.com/v2-5f1b7922e6bf3b642b7e59958.jpg",
      hint: "作者 / 云舞空城",
      title: "沙子的供不应求会带来哪些影响？",
      content: "1. 建筑成本上升：沙子是建筑行业的重要原材料之一...",
      readingStatus: false,
      readingNum: 42,
      likeStatus: false,
      likeNum: 17,
      commentStatus: false,
      commentNum: 20,
      _openid: wxContext.OPENID,
      createTime: db.serverDate()
    }]

    console.log('准备添加的数据：', blogData)

    // 先清理旧数据
    try {
      const removeResult = await db.collection('blog').where({
        _openid: wxContext.OPENID
      }).remove()
      console.log('旧数据清理完成:', removeResult)
    } catch (err) {
      console.error('清理旧数据失败：', err)
      const response = {
        success: false,
        code: -5,
        message: '清理旧数据失败',
        error: err.message
      }
      console.log('返回错误响应:', response)
      return response
    }

    // 添加新数据
    const results = []
    for (const blog of blogData) {
      try {
        const result = await db.collection('blog').add({
          data: blog
        })
        console.log('添加数据成功：', result)
        results.push(result)
      } catch (err) {
        console.error('添加数据失败：', err)
        const response = {
          success: false,
          code: -2,
          message: '添加数据失败',
          error: err.message
        }
        console.log('返回错误响应:', response)
        return response
      }
    }

    if (results.length === 0) {
      const response = {
        success: false,
        code: -3,
        message: '没有数据被添加'
      }
      console.log('返回错误响应:', response)
      return response
    }

    // 返回成功结果
    const response = {
      success: true,
      code: 0,
      message: `成功导入 ${results.length} 条数据`,
      data: results
    }
    console.log('返回成功响应:', response)
    return response

  } catch (err) {
    console.error('导入失败：', err)
    const response = {
      success: false,
      code: -999,
      message: '导入失败',
      error: err.message
    }
    console.log('返回错误响应:', response)
    return response
  }
} 