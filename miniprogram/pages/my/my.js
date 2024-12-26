// pages/my/my.js
const app = getApp();
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: ''
    },
    uploadStatus: {
      importData: false,
      uploadData: false,
      checkData: false,
      deleteData: false,
      uploadFile: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo: app.globalData.userInfo,
    })
    console.log(this.data.userInfo)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  async onReady() {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'operateDB',
        data: {
          type: 'createCollection'
        }
      })
      console.log('创建集合结果：', result)

      if (result.success) {
        console.log(result.data)
      } else {
        console.error('创建集合失败：', result.errMsg)
      }

    } catch (err) {
      console.error('调用云函数失败：', err)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 导入数据
  async importData() {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'operateDB',
        data: {
          type: 'insert',
          name: '张三',
          age: 40
        }
      })
      console.log('插入结果：', result)
      wx.showToast({
        title: '插入成功',
        icon: 'success'
      })
    } catch (err) {
      console.error('插入失败：', err)
    }
  },

  // 上传数据
  async uploadData() {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'operateDB',
        data: {
          type: 'update',
          oldAge: 40,
          newAge: 26
        }
      })
      console.log('更新结果：', result)
      wx.showToast({
        title: '更新成功',
        icon: 'success'
      })
    } catch (err) {
      console.error('更新失败：', err)
    }
  },

  // 查对数据
  async checkData() {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'operateDB',
        data: {
          type: 'query',
          age: 26
        }
      })
      console.log('查询结果：', result)
      wx.showModal({
        title: '查询结果',
        content: JSON.stringify(result.data),
        showCancel: false
      })
    } catch (err) {
      console.error('查询失败：', err)
    }
  },

  // 删除数据
  async deleteData() {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'operateDB',
        data: {
          type: 'delete',
          age: 26
        }
      })
      console.log('删除结果：', result)
      wx.showToast({
        title: '删除成功',
        icon: 'success'
      })
    } catch (err) {
      console.error('删除失败：', err)
    }
  },

  // 上传文件
  async uploadFile() {
    try {
      // 选择多个文件
      const { tempFiles } = await wx.chooseMessageFile({
        count: 10, // 最多可以选择10个文件
        type: 'file'
      })

      if (tempFiles.length === 0) return

      wx.showLoading({
        title: '上传中...',
        mask: true
      })

      // 上传所有文件
      for (const file of tempFiles) {
        const cloudPath = `files/${Date.now()}_${file.name}`
        const { fileID } = await wx.cloud.uploadFile({
          cloudPath,
          filePath: file.path
        })

        // 保存文件信息到数据库
        const db = wx.cloud.database()
        await db.collection('files').add({
          data: {
            fileID,
            name: file.name,
            size: file.size,
            uploadTime: db.serverDate()
          }
        })
      }

      wx.hideLoading()
      wx.showToast({
        title: '上传成功',
        icon: 'success'
      })

    } catch (err) {
      console.error('上传失败:', err)
      wx.hideLoading()
      wx.showToast({
        title: '上传失败',
        icon: 'error'
      })
    }
  },

  // 下载文件
  downloadFile() {
    console.log('准备跳转到文件列表页');
    wx.navigateTo({
      url: '/pages/fileList/fileList',
      success: function() {
        console.log('跳转成功');
      },
      fail: function(err) {
        console.error('跳转失败：', err);
      }
    });
  },

  // 云函数求和
  async cloudSum() {
    try {
      wx.showLoading({
        title: '计算中...'
      })
      const { result } = await wx.cloud.callFunction({
        name: 'sum',
        data: {
          a: 5,
          b: 3
        }
      })
      wx.hideLoading()
      console.log('求和结果：', result)
      
      if (result.success) {
        wx.showToast({
          title: `结果: ${result.data}`,
          icon: 'none',
          duration: 2000
        })
      } else {
        throw new Error(result.errMsg)
      }
    } catch (err) {
      wx.hideLoading()
      console.error('调用失败：', err)
      wx.showToast({
        title: err.message || '计算失败',
        icon: 'error'
      })
    }
  },

  // 获取用户openid
  async getOpenid() {
    try {
      wx.showLoading({
        title: '获取中...'
      })
      const { result } = await wx.cloud.callFunction({
        name: 'getOpenId'
      })
      wx.hideLoading()
      console.log('用户openid：', result)
      
      if (result.success) {
        wx.showModal({
          title: '获取成功',
          content: `您的openid是：${result.data.openid}`,
          showCancel: false
        })
      } else {
        throw new Error(result.errMsg)
      }
    } catch (err) {
      wx.hideLoading()
      console.error('获取失败：', err)
      wx.showToast({
        title: err.message || '获取失败',
        icon: 'error'
      })
    }
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.setData({
      'userInfo.avatarUrl': avatarUrl
    })
  },

  onInputChange(e) {
    this.setData({
      'userInfo.nickName': e.detail.value
    })
  },

  // 云函数插入数据
  async cloudInsert() {
    try {
      wx.showLoading({ title: '插入中...' })
      const { result } = await wx.cloud.callFunction({
        name: 'operateDB',
        data: {
          type: 'insert',
          name: 'zhao',
          age: 40
        }
      })
      wx.hideLoading()
      console.log('插入结果：', result)
      
      if (result.success) {
        wx.showToast({
          title: '插入成功',
          icon: 'success'
        })
      } else {
        throw new Error(result.errMsg)
      }
    } catch (err) {
      wx.hideLoading()
      console.error('插入失败：', err)
      wx.showToast({
        title: '插入失败',
        icon: 'error'
      })
    }
  },

  // 云函数更新数据
  async cloudUpdate() {
    try {
      wx.showLoading({ title: '更新中...' })
      const { result } = await wx.cloud.callFunction({
        name: 'operateDB',
        data: {
          type: 'update',
          oldAge: 40,
          newAge: 26
        }
      })
      wx.hideLoading()
      if (result.success) {
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        })
      } else {
        throw new Error(result.errMsg)
      }
    } catch (err) {
      wx.hideLoading()
      console.error('更新失败：', err)
      wx.showToast({
        title: '更新失败',
        icon: 'error'
      })
    }
  },

  // 云函数查询数据
  async cloudQuery() {
    try {
      wx.showLoading({ title: '查询中...' })
      const { result } = await wx.cloud.callFunction({
        name: 'operateDB',
        data: {
          type: 'query',
          age: 26
        }
      })
      wx.hideLoading()
      if (result.success) {
        wx.showModal({
          title: '查询结果',
          content: JSON.stringify(result.data),
          showCancel: false
        })
      } else {
        throw new Error(result.errMsg)
      }
    } catch (err) {
      wx.hideLoading()
      console.error('查询失败：', err)
      wx.showToast({
        title: '查询失败',
        icon: 'error'
      })
    }
  },

  // 云函数删除数据
  async cloudDelete() {
    try {
      wx.showLoading({ title: '删除中...' })
      const { result } = await wx.cloud.callFunction({
        name: 'operateDB',
        data: {
          type: 'delete',
          age: 26
        }
      })
      wx.hideLoading()
      if (result.success) {
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
      } else {
        throw new Error(result.errMsg)
      }
    } catch (err) {
      wx.hideLoading()
      console.error('删除失败：', err)
      wx.showToast({
        title: '删除失败',
        icon: 'error'
      })
    }
  }
})