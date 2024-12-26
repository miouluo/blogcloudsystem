const app = getApp()

// 生成唯一的ID
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    form: {
      title: '',
      content: '',
      sex: 'male'
    }
  },
  changeInput(e) {
    console.log(e);
  },

  changeRadio(e) {
    console.log(e);
  },
  chooseImage(e) {
    var that = this;
    wx.chooseMedia({
      count: 4,
      mediaType: ['image', 'video'],
      sourceType: ['album', 'camera'],
      success(res) {
        // 更新imgList，并为每个图片对象生成唯一的id
        const newImgList = res.tempFiles.map(file => ({
          ...file,
          id: `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }));
        that.setData({
          imgList: [...that.data.imgList, ...newImgList] // 合并旧的图片列表和新选择的图片
        });
      },
    });
  },
  // 上传图片到云存储
  async uploadImage(tempFilePath) {
    try {
      const cloudPath = `blog/${Date.now()}_${Math.random().toString(36).substr(2)}.${tempFilePath.match(/\.(\w+)$/)[1]}`
      const res = await wx.cloud.uploadFile({
        cloudPath,
        filePath: tempFilePath
      })
      console.log('图片上传成功：', res.fileID)
      return res.fileID
    } catch (err) {
      console.error('图片上传失败：', err)
      throw err
    }
  },

  // 获取表单提交内容
  async formSubmit(e) {
    try {
      wx.showLoading({
        title: '发布中...',
        mask: true
      })

      // 上传图片到云存储
      let imageUrl = ''
      if (this.data.imgList.length > 0) {
        imageUrl = await this.uploadImage(this.data.imgList[0].tempFilePath)
      }

      const db = wx.cloud.database()
      
      // 准备博客数据
      const blogData = {
        id: `blog_${Date.now()}`,
        date: new Date().toISOString().split('T')[0].replace(/-/g, ''),
        image: imageUrl || '/images/default.png',
        hint: "作者 / " + (e.detail.value.sex === 'male' ? '男作者' : '女作者'),
        title: e.detail.value.title,
        content: e.detail.value.content,
        readingStatus: false,
        readingNum: 0,
        likeStatus: false,
        likeNum: 0,
        commentStatus: false,
        commentNum: 0,
        createTime: db.serverDate()
      }

      // 保存到云数据库
      const result = await db.collection('blog').add({
        data: blogData
      })

      console.log('博客发布成功：', result)

      wx.hideLoading()
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      })

      // 清空表单数据
      this.setData({
        imgList: [],
        ['form.title']: '',
        ['form.content']: '',
        ['form.sex']: 'male'
      })

      // 延迟跳转到推荐页面
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/blog/blog',
          success: () => {
            // 获取推荐页面实例并刷新数据
            const pages = getCurrentPages()
            const blogPage = pages[pages.length - 1]
            if (blogPage && blogPage.loadBlogList) {
              blogPage.loadBlogList()
            }
          }
        })
      }, 1500)

    } catch (err) {
      console.error('发布失败：', err)
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
        icon: 'error',
        duration: 2000
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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

  }
})