// pages/content/content.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 原有的数据
    "image_hue": "0xb39a7d",
    "hint": "作者 / 丁香医生",
    "date": "20240808",
    "url": "https://daily.zhihu.com/story/9775379",
    "image": "https://pic1.zhimg.com/v2-5f1b7922e6bf3b642b7e59742ba42958.jpg?source=8673f162",
    "title": "断指如何急救处理，能接回去吗？",
    "ga_prefix": "091107",
    "type": 0,
    "content": "日常生活中，如果出现剁手的情况，在就医前，请严格按照下列步骤进行急救，这样会增大断肢再接手术的成功率。1.立即拨打 120 急救电话 如果距高医院较近，事急从权，可以在家人陪同下自主前往。2.",
    "id": 9775379,
    "commentNum": 20,
    "likeNum": 17,
    "readingNum": 42,
    commentObject: {
      "Bill": "好",
      "Janet": "不好",
      "lucy": "非常好!"
    },
    // 新增的评论数据
    comments: [],
    newComment: '',
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    var blogId = options.id;
    var blogList = wx.getStorageSync('blog') || []; // 确保这里有一个默认值，防止 undefined
    for (const i in blogList.top_stories) {
      if (blogId == blogList.top_stories[i].id) {
        this.setData({
          date: blogList.top_stories[i].date || '未知日期', // 如果没有日期，则设置为 '未知日期'
          blog: blogList.top_stories[i]
        });
        // 设置导航栏标题
        wx.setNavigationBarTitle({
          title: this.data.blog.title,
        });
        break; // 找到匹配的博客后退出循环
      }
    }
    this.loadComments(); // 加载评论
    this.setData({
      userInfo: app.globalData.userInfo
    });
  },

  /**
   * 加载评论
   */
  loadComments: function() {
    let comments = wx.getStorageSync('comments') || [];
    this.setData({ comments: comments });
  },

  /**
   * 提交新评论
   */
  addComment: function() {
    if (!this.data.newComment.trim()) return; // 如果评论为空，则不提交
    const newComment = {
      nickName: this.data.userInfo.nickName || '匿名用户', // 如果没有昵称，则显示为 '匿名用户'
      avatarUrl: this.data.userInfo.avatarUrl || '默认头像URL', // 如果没有头像URL，则使用默认头像
      content: this.data.newComment,
      time: new Date().toLocaleString(),
      likeNum: 0,
    };
    // 添加新评论到数组的开头
    let comments = [newComment, ...this.data.comments];
    this.setData({ comments: comments, newComment: '' }); // 更新数据并清空输入框
    wx.setStorageSync('comments', comments); // 存储评论到本地
  },

  onLike: function(event) {
    // 更新点赞状态和数量
    const newLikeStatus = !this.data.likeStatus;
    const newLikeNum = this.data.likeStatus ? this.data.likeNum - 1 : this.data.likeNum + 1;
    this.setData({
      likeStatus: newLikeStatus,
      likeNum: newLikeNum
    });
  },

  /**
   * 点赞评论
   */
  likeComment: function(event) {
    const index = event.currentTarget.dataset.index;
    let comments = this.data.comments.map((c, i) => {
      if (i === index) {
        return { ...c, likeNum: c.likeNum + 1 };
      }
      return c;
    });
    this.setData({ comments: comments });
    wx.setStorageSync('comments', comments); // 更新本地存储的评论
  },

  inputComment: function(e) {
    this.setData({
      newComment: e.detail.value
    });
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