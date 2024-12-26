const cloud = require('wx-server-sdk')

cloud.init({
  env: ''
})

exports.main = async (event) => {
  try {
    const db = cloud.database()
    // 先检查集合是否存在
    const collections = await db.listCollections().get()
    const isExist = collections.data.some(col => col.name === 'user')
    
    if (isExist) {
      return {
        success: true,
        data: '集合已存在'
      }
    }

    // 如果不存在则创建
    await db.createCollection('user')
    return {
      success: true,
      data: '集合创建成功'
    }
  } catch (err) {
    return {
      success: false,
      errMsg: err.message
    }
  }
} 