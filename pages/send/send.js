function upload(message,that) {
  wx.request({
    url: 'http://127.0.0.1:80/score',
    data: {
      upload:JSON.stringify(message)
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);//将后端状态传给前端并赋值status
      that.setData({
        status: res.data
      })
      wx.showToast({
        title: res.data,//这里打印出登录成功
        icon: 'none',
        duration: 3000
      });
    }
  })
}




// pages/send/send.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: "",
    status:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //扫一扫绑定的函数
  check: function () {
    var that = this;
    var show;
    //扫图片的组件
    wx.scanCode({
      success: (res) => {
        this.show = res.result;
        that.setData({
          show: this.show
        })
        wx.showToast({
          title: '上传成功',
          icon: 'success',
          duration: 2000
        })
        upload(this.show,that)//上传到本地服务器
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete: (res) => {
      }  
    })
  }
})