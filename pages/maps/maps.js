// pages/maps/maps.js
const app = getApp()

function upload(message, that) {
  var send_message = message
  // console.log(send_message)
  wx.request({
    url: 'http://120.78.209.24/maps',
    data: {
      upload: JSON.stringify(send_message)
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function(res) {
      var List = res.data.split(',');
      var tmp_show = that.data.show
      for (var i = 0; i < tmp_show.length; i = i + 1) {
        if (tmp_show[i].id == List[0]) tmp_show.splice(i, 1);
      }
      console.log(List)

      if (res.data != "商品未入库" && res.data != "修改成功" && res.data != "重复编号!") {
        // var List = res.data.split(',');
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
        title: res.data, //这里打印出登录成功
        icon: 'none',
        duration: 3000
      });
    },
    fail: function(res) {}
  })
}









Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 0,
    longitude: 0,
    show: [],
    isAvaliable: false,
    showModal: false,
    goodId: "",
    edit_tmp_value1: "", //临时变量可代表id
    position: "", //当前位置
    show_edit_Modal: false,
    globalposi: "", //映射全局身份

    edit_tmp_id: "", //当前的编号
    edit_tmp_type: "", //当前编辑状态
    edit_tmp_value: "",
    radioValue1: [{
        'name': '0',
        'value': '否',
        'checked': 'true'
      },
      {
        'name': '1',
        'value': '是'
      }
    ],
    radioValue2: [{
        'name': '0',
        'value': '否'
      },
      {
        'name': '1',
        'value': '是',
        'checked': 'true'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    this.setData({
      globalposi: app.globalData.pos
    })
    console.log(this.data.globalposi)

    wx.getLocation({ //获取经纬度坐标
      type: 'gcj02',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      globalposi: app.globalData.pos
    })
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

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

  //扫一扫绑定的函数
  check: function() {
    var that = this;
    var message = [];
    //扫图片的组件
    wx.scanCode({
      success: (res) => {
        message = res.result.split(",");
        if (message.length == 3) {
          var that = this;
          wx.showModal({
            title: '确认货物信息',
            content: '编号: ' + message[0] + '\r\n类型: ' + message[1] + '\r\n价格: ' + message[2], //模拟器中未换行，真机实验换行
            success(res) {
              if (res.confirm) {
                wx.showToast({
                  title: '已录入等待服务器响应',
                  icon: 'success',
                  duration: 500
                })
                upload(message[0] + ',', that) //上传到本地服务器
              } else if (res.cancel) {
                wx.showToast({
                  title: '取消录入',
                  icon: 'none',
                  duration: 500
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '数据格式有误',
            icon: 'none',
            duration: 2000
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
      complete: (res) => {}
    })
  },

  idInput: function(e) {
    this.setData({
      goodId: e.detail.value
    })
  },

  //在位置页面修改事物
  change_td: function(e) {
    if (app.globalData.pos == "admin") {
      console.log(e.currentTarget.dataset.type + ':', e.currentTarget.dataset.value);
      if (e.currentTarget.dataset.type == "经纬度")
        this.setData({
          position: app.globalData.longitude + ',' + app.globalData.latitude
        })
      //这里是为了将库中和可出库的1,0改为是,否
      if (e.currentTarget.dataset.type == "库中" | e.currentTarget.dataset.type == "可出库") {
        var msg;
        if (e.currentTarget.dataset.value == "1") {
          msg = "是"
        } else {
          msg = "否"
        }
        this.setData({
          edit_tmp_value: msg
        })
      } else {
        this.setData({
          edit_tmp_value: e.currentTarget.dataset.value
        })
      }
      this.setData({
        show_edit_Modal: true,
        edit_tmp_id: e.currentTarget.dataset.id,
        edit_tmp_type: e.currentTarget.dataset.type,
        // edit_tmp_value:e.currentTarget.dataset.value,
        edit_tmp_value1: e.currentTarget.dataset.value
      })
      if (e.currentTarget.dataset.type == "经纬度") {
        this.setData({
          edit_tmp_value1: this.data.position
        })
      }
    }
    if (app.globalData.pos == "front") {
      if (e.currentTarget.dataset.type == "价格" | e.currentTarget.dataset.type == "可出库") {
        this.setData({
          show_edit_Modal: true,
          edit_tmp_id: e.currentTarget.dataset.id,
          edit_tmp_type: e.currentTarget.dataset.type,
          edit_tmp_value: e.currentTarget.dataset.value,
          edit_tmp_value1: e.currentTarget.dataset.value
        })
      }
    }
    if (app.globalData.pos == "driver") {
      if (e.currentTarget.dataset.type == "经纬度") {
        this.setData({
          show_edit_Modal: true,
          edit_tmp_id: e.currentTarget.dataset.id,
          edit_tmp_type: e.currentTarget.dataset.type,
          edit_tmp_value: e.currentTarget.dataset.value,
          edit_tmp_value1: e.currentTarget.dataset.value
        })
        this.setData({
          position: app.globalData.longitude + ',' + app.globalData.latitude,
        })
      }
    }
    if (app.globalData.pos == "depotManager") {
      if (e.currentTarget.dataset.type == "库中") {
        this.setData({
          show_edit_Modal: true,
          edit_tmp_id: e.currentTarget.dataset.id,
          edit_tmp_type: e.currentTarget.dataset.type,
          edit_tmp_value: e.currentTarget.dataset.value,
          edit_tmp_value1: e.currentTarget.dataset.value
        })
      }
    }



  },
  locate_maps: function(e) {
    console.log(e.currentTarget.dataset.lnglat)
    var locate_mes = e.currentTarget.dataset.lnglat.split(',')
    const latitude = parseFloat(locate_mes[1])
    const longitude = parseFloat(locate_mes[0])
    wx.openLocation({ //打开地图位置
      latitude,
      longitude,
      scale: 28
    })
  },

  inputButton: function() {
    this.setData({
      showModal: true
    })
  },

  back: function() {
    this.setData({
      showModal: false,
      show_edit_Modal: false
    })
  },


  showAll: function() {
    wx.showToast({
      title: '等待服务器响应', //这里打印出登录成功
      icon: 'none',
      duration: 2000
    });
    var that = this;
    wx.request({
      url: 'http://120.78.209.24/maps_all',
      method: "GET",
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        wx.showToast({
          title: '已显示所有', //这里打印出登录成功
          icon: 'none',
          duration: 3000
        });
        var List;
        var message = res.data;
        that.setData({
          show: []
        })
        // console.log(res.data.length);
        for (var i = 0; i < res.data.length; i = i + 1) {
          // console.log(message[i]);
          List = message[i];
          // var tmp_show=this.data.show;
          var newData = [{
            id: List[0],
            type: List[1],
            price: List[2].toString(),
            submission_date: List[3],
            status: List[4].toString(),
            agree_modify: List[5],
            lng_lat: List[6]
          }];
          // console.log(newData);
          // console.log(this.data.show)
          var tmp_show = newData.concat(that.data.show);
          that.setData({
            show: tmp_show
          })
        }
      },
      fail: function(res) {}
    })
  },

  WhInput: function(e) {
    this.setData({
      edit_tmp_value1: e.detail.value
    })
  },




  ok: function() {
    // var info = this.data.goodId+","+this.data.goodType+","+this.data.goodPrice;
    var info = this.data.goodId + ',';
    // var message = info.split(",");
    console.log(info);
    upload(info, this);
    this.setData({
      showModal: false
    })
  },

  clearQueue: function() {
    this.setData({
      show: []
    })
  },

  ok_edit: function() {
    console.log("编号为:" + this.data.edit_tmp_id + "的" + this.data.edit_tmp_type + "从" + this.data.edit_tmp_value + "改为" + this.data.edit_tmp_value1)
    var info;
    if (this.data.edit_tmp_type == "库中" | this.data.edit_tmp_type == "可出库") {
      if (this.data.edit_tmp_value1 == "是") info = this.data.edit_tmp_id + ',' + this.data.edit_tmp_type + ',' + "1";
      else info = this.data.edit_tmp_id + ',' + this.data.edit_tmp_type + ',' + "0";
    } else
      info = this.data.edit_tmp_id + ',' + this.data.edit_tmp_type + ',' + this.data.edit_tmp_value1;
    console.log('this is info', info)
    upload(info, this);
    var infoArray = this.data.show;
    console.log(this.data.edit_tmp_type)
    for (var i = 0; i < infoArray.length; i++) {
      if (infoArray[i].id == this.data.edit_tmp_id) {
        if (this.data.edit_tmp_type == "类型")
          infoArray[i].type = this.data.edit_tmp_value1;
        else if (this.data.edit_tmp_type == "价格")
          infoArray[i].price = this.data.edit_tmp_value1;
        else if (this.data.edit_tmp_type == "库中") {
          if (this.data.edit_tmp_value1 == "是")
            infoArray[i].status = 1;
          else
            infoArray[i].status = 0;
        } else if (this.data.edit_tmp_type == "可出库") {
          if (this.data.edit_tmp_value1 == "是")
            infoArray[i].agree_modify = 1;
          else
            infoArray[i].agree_modify = 0;
        } else if (this.data.edit_tmp_type == "经纬度")
          infoArray[i].lng_lat = this.data.edit_tmp_value1;
        break;
      }
    }
    this.setData({
      show_edit_Modal: false,
      show: infoArray
    })
  },
  radioChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      edit_tmp_value1: e.detail.value
    })
  }

})