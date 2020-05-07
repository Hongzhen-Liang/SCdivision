//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'This is Position Authority explanation',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    realName:'default',
    imageUri:'../../images/touxiang/default.png',
    explanation: { 'depotManager': '仅允许出库入库', 'front':'仅改价格和判定货物能否出货','admin':'无约束','driver':'仅更改货物位置信息'}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    var that = this;
    wx.request({
      url: 'http:/127.0.0.1/user',//这部分需要完善服务器操作
      method:'GET',
      data:{
        wxid:'',//匹配码
        position:'position',
        realName:'',
      },
      success(res)
      {
        var pos=res.data.position;
        var name =res.data.realName;
        that.setData(
        {
          imageUri:'../../images/touxiang/'+this.pos+'.png',
          motto:'权限说明：'+that.data.explanation[this.pos],
          realName:this.name
        })
      },
      //测试
      fail(res)
      {
        var pos = 'admin';
        var name ='华南师团';
        that.setData(
        {
          imageUri: '../../images/touxiang/' + pos + '.png',
          motto: '权限说明：' + that.data.explanation[pos]+'，此为服务器反馈失败测试',
          realName: name
        })
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }

})
