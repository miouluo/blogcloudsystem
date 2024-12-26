const cloud = require('wx-server-sdk')

cloud.init({
  env: 'clound-0gt7nesg13edd57a'
})

exports.main = async (event) => {
  try {
    const db = cloud.database()
    
    // 根据条件更新
    if (event.where) {
      const result = await db.collection('user')
        .where(event.where)
        .update({
          data: event.data
        })
      return {
        success: true,
        data: result
      }
    }
    
    // 更新指定ID的数据
    if (event._id) {
      const result = await db.collection('user')
        .doc(event._id)
        .update({
          data: event.data
        })
      return {
        success: true,
        data: result
      }
    }
    
    // 更新年龄
    if (event.oldAge && event.newAge) {
      const result = await db.collection('user')
        .where({
          age: event.oldAge
        })
        .update({
          data: {
            age: event.newAge
          }
        })
      return {
        success: true,
        data: result
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