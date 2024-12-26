// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

const app = getApp();

Page({
  data: {
    motto: '开启微信小程序之旅',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname')
  },

  onLoad() {
    // 页面加载时进行初始化
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },

  bindViewTap() {
    wx.navigateTo({
      url: '../blog/blog'
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
    app.globalData.userInfo = this.data.userInfo;
  },
  onInputChange(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
    app.globalData.userInfo = this.data.userInfo;
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.globalData.userInfo = res.data.userInfo;
      }
    })
  },

  // 添加数据刷新方法
  async loadBlogList() {
    try {
      wx.showLoading({
        title: '加载中'
      })

      const db = wx.cloud.database()
      
      const res = await db.collection('blog')
        .orderBy('createTime', 'desc')
        .get()

      console.log('查询结果：', res)

      if (res.data && res.data.length > 0) {
        this.setData({
          blogList: res.data
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

  // 确保页面显示时也能刷新数据
  onShow: async function() {
    await this.loadBlogList()
  }
})
