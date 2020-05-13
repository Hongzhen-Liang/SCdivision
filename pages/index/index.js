//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isHide: false,
    motto: 'This is Position Authority explanation',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    realName: 'default',
    imageUri: '../../images/touxiang/default.png',
    explanation: {
      'depotManager': '仅允许出库入库',
      'front': '仅改价格和判定货物能否出货',
      'admin': '无约束',
      'driver': '仅更改货物位置信息'
    },
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    var that = this;
    wx.getSetting({
      success: function(res) {
        wx.showToast({
          title: '登陆中',
          icon: 'loading'
        })
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
              // 根据自己的需求有其他操作再补充
              // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
              wx.login({
                success: res => {
                  // 获取到用户的 code 之后：res.code
                  var code = res.code;
                  // 直接使用微信的提供的接口直接获取 openid ，方法如下：
                  wx.request({
                    // 自行补上自己的 APPID 和 SECRET
                    url: 'https://api.weixin.qq.com/sns/jscode2session',
                    data: {
                      appid: 'wxec04bdd5b687cb31',
                      secret: 'eed9f0baa83797415f4cc343dbc52b3c',
                      js_code: res.code,
                      grant_type: 'authorization_code'
                    },
                    success: res => {
                      // 获取到用户的 openid
                      try {
                        wx.setStorageSync('userId', res.data.openid)
                      } catch (e) {
                        wx.showModal({
                          title:'发生了意外的错误'
                        })
                      }
                      console.log("用户的openid:" + wx.getStorageSync('userId'));
                    }
                  });
                  console.log("用户的openid:" + wx.getStorageSync('userId'));
                  wx.request({
                    url: 'http:/127.0.0.1/wx_flask.py', //这部分需要完善服务器操作
                    method: 'GET',
                    data: {
                      wxid: that.data.openId, //匹配码
                      position: 'position',
                      realName: '',
                    },
                    success(res) {
                      var pos = res.data.position;
                      var name = res.data.realName;
                      that.setData({
                        imageUri: '../../images/touxiang/' + this.pos + '.png',
                        motto: '权限说明：' + that.data.explanation[this.pos],
                        realName: this.name
                      })
                    },
                    //测试
                    fail(res) {
                      var pos = 'admin';
                      var name = '华南师团';
                      that.setData({
                        imageUri: '../../images/touxiang/' + pos + '.png',
                        motto: '权限说明：' + that.data.explanation[pos] + '，此为服务器反馈失败测试',
                        realName: name
                      })
                    }
                  })
                }
              });
            }
          });
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          wx.hideTabBar({

          });
          that.setData({
            isHide: true
          });
        }
        wx.hideToast();
      }
    });
  },
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false
      });
      wx.showTabBar({

      })
      //跳转至send
      wx.reLaunch({
        url: 'index',
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  }

})