function upload_maps(message,that) {
  var send_message = message
  // console.log(send_message)
  wx.request({
    url: 'http://120.78.209.24/maps',
    data: {
      upload:JSON.stringify(send_message)
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      var List = res.data.split(',');
      // console.log(List)
      if(res.data!="商品未入库"&&res.data!="修改成功"&&res.data!="重复编号!"){
        // var List = res.data.split(',');
        var newData = [{
          code: List[0],
          type: List[1],
          price: List[2],
        }];
        var tmp_show = newData.concat(that.data.show);
        that.setData({
          show: tmp_show
        }) 
      }
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














function upload(message,that) {
  console.log(message)
  var send_message = message[0]+','+message[1]+','+message[2]+','+app.globalData.pos+','+app.globalData.longitude+','+app.globalData.latitude
  wx.request({
    url: 'http://120.78.209.24/delete',
    data: {
      upload:JSON.stringify(send_message)
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      if(res.data=='出库成功'){
        upload_maps(message[0]+',',that)
        console.log(message[0])

        // var newData = [{
        //   code: message[0],
        //   type: message[1],
        //   price: message[2]
        // }];
        // that.data.show = newData.concat(that.data.show);
        // that.setData({
        //   show: that.data.show
        // })
      }
      wx.showToast({
        title: res.data,//这里打印出登录成功
        icon: 'none',
        duration: 3000
      });
    }
  })
}

const app = getApp()


// pages/send/send.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: [],
    status:"",
    isAvaliable: false,
    showModal: false,
    goodId: "",
    goodType: "",
    goodPrice: "",
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
        if(message.length==3)
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
                var data_length = that.data.show.length
                wx.showToast({
                  title: '已录入等待服务器响应',
                  icon:'success',
                  duration:2000
                })
                upload(message, that)//上传到本地服务器
              }
              else if(res.cancel)
              {
                wx.showToast({
                  title: '取消录入',
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
  },

  inputButton: function () {
    this.setData({
      showModal: true
    })
  },

  back: function () {
    this.setData({
      showModal: false
    })
  },

  idInput: function (e) {
    this.setData({
      goodId: e.detail.value
    })
  },

  typeInput: function (e) {
    this.setData({
      goodType: e.detail.value
    })
  },

  priceInput: function (e) {
    this.setData({
      goodPrice: e.detail.value
    })
  },
  clearQueue:function(){
    this.setData({
      show:[]
    })
  },
  ok: function () {
    var info = this.data.goodId + "," + this.data.goodType + "," + this.data.goodPrice;
    var message = info.split(",");
    console.log(message);
    upload(message, this);
    this.setData({
      showModal: false
    })
  }
})