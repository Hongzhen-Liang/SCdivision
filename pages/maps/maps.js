// pages/maps/maps.js

function upload(message,that) {
  var send_message = message[0]
  console.log(send_message)
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
      if(res.data!="商品未入库"){
        var List = res.data.split(',');
        var newData = [{
          id: List[0],
          type: List[1],
          price: List[2],
          submission_date: List[3],
          status: List[4],
          agree_modify: List[5],
          lng_lat: List[6] + ',' + List[7]
        }];
        that.data.show = newData.concat(that.data.show);
        that.setData({
          show: that.data.show
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









Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude:0,
    longitude:0,  
    show:[],
    isAvaliable:false,
    showModal:false,
    goodId:"",
    goodType:"",
    goodPrice:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    wx.getLocation({  //获取经纬度坐标
      type: 'gcj02',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          latitude:res.latitude,
          longitude:res.longitude
        })
        // console.log(latitude,longitude)
        const speed = res.speed
        const accuracy = res.accuracy
        // wx.openLocation({ //打开地图位置
        //   latitude,
        //   longitude,
        //   scale: 28
        // })
      }
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
          var that = this;
          wx.showModal({
            title: '确认货物信息',
            content: '编号: ' + message[0] + '\r\n类型: ' + message[1] + '\r\n价格: ' + message[2],//模拟器中未换行，真机实验换行
            success(res)
            {
              if(res.confirm)
              {
                wx.showToast({
                  title: '已录入等待服务器响应',
                  icon:'success',
                  duration:500
                })
                upload(message, that)//上传到本地服务器
              }
              else if(res.cancel)
              {
                wx.showToast({
                  title: '取消录入',
                  icon:'none',
                  duration:500
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

  locate_maps:function(e){
    console.log(e.currentTarget.dataset.lnglat)
    var locate_mes = e.currentTarget.dataset.lnglat.split(',')
    const latitude=parseFloat(locate_mes[1])
    const longitude=parseFloat(locate_mes[0])
    wx.openLocation({ //打开地图位置
      latitude,
      longitude,
      scale: 28
    })

  },

  inputButton:function(){
    this.setData({
      showModal:true
    })
  },

  back:function()
  {
    this.setData({
      showModal:false
    })
  },

  idInput:function(e)
  {
    this.setData({
      goodId:e.detail.value
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

  ok:function()
  {
    var info = this.data.goodId+","+this.data.goodType+","+this.data.goodPrice;
    var message = info.split(",");
    console.log(message);
    upload(message,this);
    this.setData({
      showModal: false
    })
  }
})