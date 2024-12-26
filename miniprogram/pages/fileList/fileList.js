Page({
  data: {
    files: []
  },

  onLoad() {
    this.loadFiles()
  },

  // 加载文件列表
  async loadFiles() {
    try {
      wx.showLoading({ title: '加载中...' })
      
      const db = wx.cloud.database()
      const { data } = await db.collection('files')
        .orderBy('uploadTime', 'desc')
        .get()

      // 格式化文件大小
      const files = data.map(file => ({
        ...file,
        sizeText: this.formatFileSize(file.size)
      }))

      this.setData({ files })
      wx.hideLoading()

    } catch (err) {
      console.error('加载失败:', err)
      wx.hideLoading()
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      })
    }
  },

  // 下载文件
  async downloadFile(e) {
    const file = e.currentTarget.dataset.file
    try {
      wx.showLoading({ title: '下载中...' })

      // 从云存储下载到临时文件
      const { tempFilePath } = await wx.cloud.downloadFile({
        fileID: file.fileID
      })

      // 保存文件到本地
      wx.hideLoading()
      wx.showModal({
        title: '下载完成',
        content: '是否保存文件到手机？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await wx.saveFile({
                tempFilePath,
                success: function (res) {
                  const savedFilePath = res.savedFilePath
                  console.log('文件保存路径:', savedFilePath)
                  wx.showToast({
                    title: '保存成功',
                    icon: 'success'
                  })

                  // 打开文件
                  wx.openDocument({
                    filePath: savedFilePath,
                    success: function (res) {
                      console.log('打开文档成功')
                    },
                    fail: function(err) {
                      console.error('打开文档失败:', err)
                    }
                  })
                }
              })
            } catch (err) {
              console.error('保存失败:', err)
              wx.showToast({
                title: '保存失败',
                icon: 'error'
              })
            }
          }
        }
      })

    } catch (err) {
      console.error('下载失败:', err)
      wx.hideLoading()
      wx.showToast({
        title: '下载失败',
        icon: 'error'
      })
    }
  },

  // 格式化文件大小
  formatFileSize(size) {
    const units = ['B', 'KB', 'MB', 'GB']
    let index = 0
    while (size >= 1024 && index < units.length - 1) {
      size /= 1024
      index++
    }
    return `${size.toFixed(2)} ${units[index]}`
  },

  // 长按删除文件
  async onLongPress(e) {
    const file = e.currentTarget.dataset.file
    try {
      const { confirm } = await wx.showModal({
        title: '确认删除',
        content: '是否删除该文件？'
      })

      if (!confirm) return

      wx.showLoading({ title: '删除中...' })

      // 删除云存储中的文件
      await wx.cloud.deleteFile({
        fileList: [file.fileID]
      })

      // 删除数据库中的记录
      const db = wx.cloud.database()
      await db.collection('files').doc(file._id).remove()

      // 重新加载文件列表
      await this.loadFiles()

      wx.hideLoading()
      wx.showToast({
        title: '删除成功',
        icon: 'success'
      })

    } catch (err) {
      console.error('删除失败:', err)
      wx.hideLoading()
      wx.showToast({
        title: '删除失败',
        icon: 'error'
      })
    }
  }
}) 