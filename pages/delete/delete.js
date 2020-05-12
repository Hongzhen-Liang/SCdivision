function upload(message,that) {
  wx.request({
    url: 'http://120.78.209.24/delete',
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
    show: [],
    status:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.checkSession({
      success: function(res) {
      },
      fail: function(res) {
        wx.reLaunch({
          url: '../index/index'
        })
      },
      complete: function(res) {},
    })
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
    var message=[];
    //扫图片的组件
    wx.scanCode({
      success: (res) => {
        message = res.result.split(",");
        if(message.length<=4)
        {
          var newData = [{
            code: message[0],
            type: message[1],
            price: message[2]
          }];
          var that = this;
          wx.showModal({
            title: '确认货物信息',
            content: '编号: ' + message[0] + '\r\n类型: ' + message[1] + '\r\n价格: ' + message[2],//模拟器中未换行，真机实验换行
            success(res)
            {
              if(res.confirm)
              {
                that.data.show = newData.concat(that.data.show);
                that.setData({
                  show: that.data.show
                });
                var data_length = that.data.show.length
                // var message = that.data.show[data_length-1]
                var send_message = message[0]+','+message[1]+','+message[2]
                console.log(send_message)
                upload(send_message, that)//上传到本地服务器
                // wx.showToast({
                //   title: '已录入',
                //   icon:'success',
                //   duration:2000
                // })
              }
              else if(res.cancel)
              {
                wx.showToast({
                  title: '未录入',
                  icon:'none',
                  duration:2000
                })
              }
            }
          })
        }
        else
        {
          wx.showToast({
            title: '数据格式有误',
            icon:'none',
            duration:2000
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete: (res) => {
      }  
    })
  }
})