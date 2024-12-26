const cloud = require('wx-server-sdk')

cloud.init({
  env: ''
})

exports.main = async (event) => {
  try {
    const db = cloud.database()
    
    // 删除指定ID的数据
    if (event._id) {
      const result = await db.collection('user')
        .doc(event._id)
        .remove()
      return {
        success: true,
        data: result
      }
    }
    
    // 根据年龄删除
    if (event.age) {
      const result = await db.collection('user')
        .where({
          age: event.age
        })
        .remove()
      return {
        success: true,
        data: result
      }
    }
    
    // 批量删除
    if (event.idList && Array.isArray(event.idList)) {
      const tasks = event.idList.map(id => {
        return db.collection('user').doc(id).remove()
      })
      const results = await Promise.all(tasks)
      return {
        success: true,
        data: results
      }
    }

    return {
      success: false,
      errMsg: '参数错误'
    }
  } catch (err) {
    return {
      success: false,
      errMsg: err.message
    }
  }
} 