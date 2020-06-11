//index.js
//获取应用实例
const app = getApp()

function upload_name_select(message,that) {
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
      if(res.data!="商品未入库"&&res.data!="修改成功"){
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
      'driver': '仅更改货物位置信息',
      'default':'无权限！'
    },
    isActuallyAdmin:app.globalData.isActuallyAdmin,//每次刷新都校验全局数据
    isEmployee:false,
    noAuthority:false,
    requestAuthority:false,
    posArray: ['仓库管理员','前台', '司机', '管理员'],
    posIndex:0,
    selectedPosition:'',//申请的职位
    userId:wx.getStorageSync("userId"),
    name_Input:'',  //申请真实名字
    showChangeBtn:false,
  },
  //事件处理函数
  onLoad: function() {
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
        app.globalData.latitude=latitude //全局变量
        app.globalData.longitude=longitude
        // console.log(latitude,longitude)
      }
    })
    

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
                  // console.log("用户的openid:" + wx.getStorageSync('userId'));
                  wx.request({
                    url: 'http://120.78.209.24/index', //这部分需要完善服务器操作
                    data: {
                      wxid: JSON.stringify(wx.getStorageSync('userId').toString()), //匹配码
                      position: JSON.stringify('position'),
                      realName: JSON.stringify(''),
                    },
                    method: 'POST',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded',
                      'chartset': 'utf-8'
                    },
                    success(res) {
                      // console.log(res.data);
                      var mess=res.data.split(',');
                      var name = mess[0]
                      var pos = mess[1]
                      // console.log(pos)
                      // 全局变量修改
                      app.globalData.pos = pos
                      app.globalData.name = name
                      wx.setStorageSync("position", pos);
                      //只要登陆一次admin就有更改自身权限的能力
                      if(pos=='admin')
                      {
                        app.globalData.isActuallyAdmin=true;
                        that.setData({
                          isActuallyAdmin:true,
                        })
                      }
                      //'depotManager': '仅允许出库入库',
                      //'front': '仅改价格和判定货物能否出货',
                      //'admin': '无约束',
                      //'driver': '仅更改货物位置信息',
                      //'default': '无权限！'
                      else if (pos == 'front' || pos == 'depotManager' || pos == 'driver')
                      {
                        that.setData({
                          isEmployee:true,
                          noAuthority:false,
                        })
                      }
                      else
                      {
                        that.setData({
                          isEmployee:false,
                          noAuthority:true,
                        })
                      }
                      that.setData({
                        imageUri: '../../images/touxiang/' + pos + '.png',
                        motto: '权限说明：' + that.data.explanation[pos],
                        realName: name
                      })
                    },
                    //测试
                    fail(res) {
                      var pos = 'default';
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
  //授权页面跳转
  navigateToAuthorityPage:function(){
    wx.navigateTo({
      url: '../authority/authority',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  navigateToEmployeeManagePage:function(){
    wx.navigateTo({
      url: '../employeeManage/employeeManage',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //显示权限申请信息输入窗口
  requestingAuthority:function(){
    this.setData({
      requestAuthority:true
    })
  },
  nameInput:function(e){
    this.setData({
      name_Input:e.detail.value
    })
  },

  //确认函数
  back:function(){
    this.setData({
      requestAuthority:false
    })
  },
  positionChange: function (e) {
    //两个赋值不能放一起会引起异步操作带来的bug
    this.setData({
      posIndex: e.detail.value,
    })
    this.setData({
      selectedPosition: this.data.posArray[this.data.posIndex]
    })
  },
  ok:function(){
    var message=wx.getStorageSync('userId').toString()+','+this.data.name_Input+','+this.data.selectedPosition;
    console.log(message)
    var select_pos='';
    //upload_name_select(message,this);
    switch(this.data.selectedPosition){
      case '仓库管理员':
        select_pos='depotManager';
        break;
      case '前台':
        select_pos='front';
        break;
      case '司机':
        select_pos='driver';
        break;
      case '管理员':
        select_pos='admin';
        break;   
    }

   wx.request({//需要完善插入操作，不会写，注意职位输入项是中文要匹对成相应的英文！
     url: 'http://120.78.209.24/authorizeQueue',
     data: {
       wxid: JSON.stringify(wx.getStorageSync('userId').toString()), //匹配码
       position: JSON.stringify(select_pos),
       realName: JSON.stringify(this.data.name_Input)
     },
     method: 'POST',
     header: {
       'content-type': 'application/x-www-form-urlencoded',
       'chartset': 'utf-8'
     },
     success(res)
     {
       var titlem='待审核';
       var iconm='success';
      if(res.data!='yes'){
        titlem=res.data;
      }
      if(titlem=="不能更改管理员权限") 
      {
        iconm='none';
      }
      wx.showToast({
         title: titlem,
         icon:iconm,
         duration: 2000,
       })
     },
     fail(res){
      wx.showToast({
        title:'操作失败!',
        icon: 'none',
        duration:2000,
      })
     }
   })
   this.setData({
     requestingAuthority:false
   })
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
  },
  //更改权限（职位）
  changePosition:function(e)
  {
    //获取更改的职位： e.currentTarget.id
    console.log(e.currentTarget.id);
    var cpos = e.currentTarget.id;
    var that = this;
    // //以下是更改权限的部分,暂时没必要更改服务器上的权限，否则到时候改回来很烦
    // wx.request({
    //   url: 'http://120.78.209.24/index',
    //   method : "PSOT",
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded',
    //     'chartset': 'utf-8'
    //   },
    //   data:{
    //     wxId: wx.getStorageSync('userId').toString(),
    //     changeToPosition: cpos
    //   },
    //   success(res){
    //     app.globalData.pos = cpos;
    //     that.setData({
    //       imageUri: '../../images/touxiang/' + cpos + '.png',
    //       motto: '权限说明：' + this.data.explanation[cpos],
    //     })
    //   }
    // })
    //后端测试时请删掉！！！
    this.setData({
      imageUri: '../../images/touxiang/' + cpos + '.png',
      motto: '权限说明：' + this.data.explanation[cpos],
    })
    //从上面copy的代码
    if (cpos == 'admin') {
      wx.showTabBar({
        aniamtion: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      that.setData({
        noAuthority:false,
        isEmployee:false,
      })
    }
    //'depotManager': '仅允许出库入库',
    //'front': '仅改价格和判定货物能否出货',
    //'admin': '无约束',
    //'driver': '仅更改货物位置信息',
    //'default': '无权限！'
    else if (cpos == 'front' || cpos == 'depotManager' || cpos == 'driver') {
      wx.showTabBar({
        aniamtion: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      that.setData({
        isEmployee: true,
        noAuthority:false
      })
    }
    else {
      that.setData({
        isEmployee:false,
        noAuthority: true
      });
      wx.hideTabBar({
        aniamtion: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
    // 更改全局变量，告诉服务器(driver、admin)身份是什么
    app.globalData.pos=cpos
  },
  bindViewTap: function () {
    this.setData({
      showChangeBtn: !this.data.showChangeBtn
    })
  },
})