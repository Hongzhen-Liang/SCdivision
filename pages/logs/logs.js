//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    wx.checkSession({
      success: function(res) {},
      fail: function(res) {
        wx.reLaunch({
          url: '../index/index'
        })
      },
      complete: function(res) {},
    })
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
