// pages/authority/authority.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorityQueue: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // { 'wxid': 'oBtgM5Ji7828jqbyQYM3KhMRJOeE', 'realName': 'hx', 'requestedPosition': 'admin' },
    // { 'wxid': 'oBtgM5Ji7828jqbyQYM3KhMRJOeE', 'realName': 'lhz', 'requestedPosition': 'admin'}

    var that=this;
    wx.request({
      url: 'http://120.78.209.24/authority',
      method: "GET",
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var message=res.data;
        for(var i=0;i<res.data.length;i=i+1){
          console.log(message[i]);
          var tmp={ 'wxid': message[i][0], 'realName': message[i][1], 'requestedPosition': message[i][2] }
          var tmp_arr=that.data.authorityQueue;
          tmp_arr.push(tmp);
          that.setData({
            authorityQueue: tmp_arr
          })
        }
      },
      fail:function(res){
      }    
    })
  },
  deleteFromQueue:function(e){
    // console.log(e.currentTarget.dataset.wxid);
    wx.request({
      url: 'http://120.78.209.24/authority_admitted',
      data: {
        wxid:JSON.stringify(e.currentTarget.dataset.wxid),
        status:JSON.stringify('agree')
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      success: function (res) {
        wx.showToast({
          title: res.data,//这里打印出登录成功
          icon: 'none',
          duration: 3000
        });
      },
      fail:function(res){
      }    
    })
  },
  authorize:function(e){
    wx.request({
      url: 'http://120.78.209.24/authority_admitted',
      data: {
        wxid:JSON.stringify(e.currentTarget.dataset.wxid),
        status:JSON.stringify('reject')
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      success: function (res) {
        wx.showToast({
          title: res.data,//这里打印出登录成功
          icon: 'none',
          duration: 3000
        });

      },
      fail:function(res){
      }    
    })



  }
  ,

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

  }
})