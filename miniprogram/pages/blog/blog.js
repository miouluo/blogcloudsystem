// pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bloglist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    // 调用加载博客列表方法
    await this.loadBlogList();
  },

  // 加载博客列表
  async loadBlogList() {
    try {
      wx.showLoading({
        title: '加载中'
      })

      const db = wx.cloud.database({
        env: 'clound-0gt7nesg13edd57a'
      })
      
      const res = await db.collection('blog')
        .orderBy('createTime', 'desc')
        .get()

      console.log('查询结果：', res)

      if (res.data && res.data.length > 0) {
        this.setData({
          bloglist: res.data
        })
      } else {
        console.log('暂无数据')
      }

      wx.hideLoading()
      
    } catch (err) {
      console.error('加载失败：', err)
      wx.hideLoading()
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      })
    }
  },

  // 修改点赞功能
  async onLike(event) {
    const blogId = event.currentTarget.dataset.blogId;
    const db = wx.cloud.database();
    
    try {
      // 获取当前博客数据
      const blog = this.data.bloglist.find(b => b._id === blogId);
      if (!blog) {
        throw new Error('未找到博客数据');
      }

      const newLikeStatus = !blog.likeStatus;
      const newLikeNum = blog.likeStatus ? blog.likeNum - 1 : blog.likeNum + 1;

      // 更新云数据库
      await db.collection('blog').doc(blogId).update({
        data: {
          likeStatus: newLikeStatus,
          likeNum: newLikeNum
        }
      });

      // 更新本地数据
      const updatedBloglist = this.data.bloglist.map(b => {
        if (b._id === blogId) {
          return { ...b, likeStatus: newLikeStatus, likeNum: newLikeNum };
        }
        return b;
      });

      this.setData({ bloglist: updatedBloglist });

    } catch (err) {
      console.error('更新点赞状态失败：', err);
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  },

  addBlog: function(newBlog) {
    const updatedBloglist = [...this.data.bloglist, newBlog];
    this.setData({ bloglist: updatedBloglist });
    wx.setStorageSync('blog', { bloglist: updatedBloglist });
  },

  // 修改博客内容跳转
  onBlogContent: function(event) {
    const blogId = event.currentTarget.dataset.blogId;
    if (!blogId) {
      console.error('未找到博客ID');
      return;
    }
    wx.navigateTo({
      url: `../content/content?id=${blogId}`
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉作
   */
  onPullDownRefresh: async function() {
    await this.loadBlogList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 导入测试数据
  async importData() {
    try {
      wx.showLoading({
        title: '导入中...',
        mask: true
      })

      const db = wx.cloud.database({
        env: 'clound-0gt7nesg13edd57a'
      })

      // 准备测试数据
      const blogData = [
        {
          id: "9775379",
          date: "20240808",
          image: "https://pic1.zhimg.com/v2-5f1b7922e6bf3b642b7e59742ba42958.jpg",
          hint: "作者 / 云舞空城",
          title: "沙子的供不应求会带来哪些影响？",
          content: "1. 建筑成本上升：沙子是建筑行业的重要原材料之一，供不应求将导致建筑成本增加，进而影响房价和市场投资环境。2. 环境破坏：为了满足对沙子的需求，可能会加剧对河流、湖泊和海滩的非法采砂活动，破坏生态环境。3. 建筑质量下降：在沙子短缺的情况下，一些施工方可能会使用质量不达标或未经处理的替代材料，影响建筑的安全性和耐久性。",
          readingStatus: false,
          readingNum: 42,
          likeStatus: false,
          likeNum: 17,
          commentStatus: false,
          commentNum: 20,
          createTime: db.serverDate()
        },
        {
          id: "9775338",
          date: "20240808",
          image: "https://pica.zhimg.com/v2-6e3921fae0cb915da8b9b43f78fb188f.jpg",
          hint: "作者 / 丁香医生",
          title: "断指如何急救处理，能接回去吗？",
          content: "日常生活中，如果出现剁手的情况，在就医前，请严格按照下列步骤进行急救，这样会增大断肢再接手术的成功率。1. 保持冷静：慌乱会影响判断和处理。2. 止血：用干净纱布或毛巾压迫伤口。3. 断指保存：用干净纱布包裹断指，放入密封袋中，再放入装有冰水的容器。4. 及时就医：尽快前往有显微外科能力的医院。5. 注意事项：断指不要直接接触冰块，避免组织受损。",
          readingStatus: true,
          readingNum: 23,
          likeStatus: true,
          likeNum: 10,
          commentStatus: true,
          commentNum: 2,
          createTime: db.serverDate()
        },
        {
          id: "9775380",
          date: "20240808",
          image: "https://pic2.zhimg.com/v2-8d3dd83f947c114c5cf10f7a7a761f2b.jpg",
          hint: "作者 / 营养师小王",
          title: "夏季饮食有哪些注意事项？",
          content: "1. 饮食清淡：避免过于油腻和刺激性食物，以防肠胃不适。2. 补充水分：每天至少饮水2000ml，可适当饮用淡盐水预防中暑。3. 食材新鲜：高温易滋生细菌，食材要及时冷藏并尽快食用。4. 适量进食：不要暴饮暴食，以免增加消化系统负担。5. 注意卫生：生熟分开，充分煮熟，预防食物中毒。",
          readingStatus: false,
          readingNum: 67,
          likeStatus: false,
          likeNum: 31,
          commentStatus: false,
          commentNum: 15,
          createTime: db.serverDate()
        }
      ]

      // 先清理旧数据
      console.log('清理旧数据...')
      const { stats } = await db.collection('blog').where({
        _openid: '{openid}' // 微信会自动替换为当前用户的 openid
      }).remove()
      
      console.log(`清理了 ${stats.removed} 条旧数据`)

      // 添加新数据
      console.log('添加新数据...')
      const results = []
      for (const blog of blogData) {
        const result = await db.collection('blog').add({
          data: blog // 不需要手动设置 _openid，数据库会自动添加
        })
        console.log('添加数据成功：', result)
        results.push(result)
      }

      wx.hideLoading()
      wx.showToast({
        title: `成功导入 ${results.length} 条数据`,
        icon: 'success'
      })

      // 重新加载数据
      await this.loadBlogList()
      
    } catch (err) {
      console.error('导入失败，详细错误：', err)
      wx.hideLoading()
      wx.showToast({
        title: err.message || '导入失败',
        icon: 'error',
        duration: 2000
      })
    }
  }
});