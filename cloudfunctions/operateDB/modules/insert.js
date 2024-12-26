const cloud = require('wx-server-sdk')

cloud.init({
  env: ''
})

exports.main = async (event) => {
  try {
    const db = cloud.database()
    
    // 插入数据到 user 集合
    const result = await db.collection('user').add({
      data: {
        name: event.name,
        age: event.age,
        createTime: db.serverDate()
      }
    })

    return {
      success: true,
      data: 'data insert success'
    }
  } catch (err) {
    console.error('插入数据失败：', err)
    return {
      success: false,
      errMsg: err.message || '插入数据失败'
    }
  }
} 