const cloud = require('wx-server-sdk')

cloud.init({
  env: 'clound-0gt7nesg13edd57a'
})

exports.main = async (event) => {
  try {
    const db = cloud.database()
    const _ = db.command
    
    // 查询所有数据
    if (event.type === 'all') {
      const result = await db.collection('user').get()
      return {
        success: true,
        data: result.data
      }
    }
    
    // 根据年龄查询
    if (event.age) {
      const result = await db.collection('user')
        .where({
          age: event.age
        })
        .get()
      return {
        success: true,
        data: result.data
      }
    }
    
    // 根据年龄范围查询
    if (event.minAge && event.maxAge) {
      const result = await db.collection('user')
        .where({
          age: _.gte(event.minAge).and(_.lte(event.maxAge))
        })
        .get()
      return {
        success: true,
        data: result.data
      }
    }
    
    // 模糊查询名字
    if (event.nameKeyword) {
      const result = await db.collection('user')
        .where({
          name: db.RegExp({
            regexp: event.nameKeyword,
            options: 'i'
          })
        })
        .get()
      return {
        success: true,
        data: result.data
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