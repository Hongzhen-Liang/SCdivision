// pages/employeeManage/employeeManage.js

function upload_manager(that) {
  wx.request({
    url: 'http://120.78.209.24/manager',
    method: "GET",
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      // wx.showToast({
      //   title: 'yes',//这里打印出登录成功
      //   icon: 'none',
      //   duration: 3000
      // });

      var message=res.data
      // console.log(res.data.length);
      for(var i=0;i<res.data.length;i=i+1){
        // console.log(message[i]);
        if(message[i][3]=='0') //如果该用户仍未被审核则标记为默认
          var tmp={ 'wxid': message[i][0], 'realName': message[i][1], 'position': 'default' };
        else var tmp={ 'wxid': message[i][0], 'realName': message[i][1], 'position': message[i][2] }
        var tmp_arr=that.data.employeeInfo;
        tmp_arr.push(tmp);
        that.setData({
          employeeInfo: tmp_arr
        })
      }
    },
    fail:function(res){
    }    
  })
}








var app=getApp();
Page({
  data: {
    //所有用户信息库建议按照职业分步查询，这样插入好归类
    employeeInfo: [
      //{ 'wxid': 'oBtgM5Ji7828jqbyQYM3KhMRJOeE', 'realName': 'hx', 'position': 'admin',}, 
      //{ 'wxid': 'oBtgM5Ji7828jqbyQYM3KhMRJOeE', 'realName': 'hx', 'position': 'driver' }, 
      //{ 'wxid': 'oBtgM5Ji7828jqbyQYM3KhMRJOeE', 'realName': 'hx', 'position': 'front' }, 
      //{ 'wxid': 'oBtgM5Ji7828jqbyQYM3KhMRJOeE', 'realName': 'hx', 'position': 'depotManager' }
    ],
    fixInfo:false,
    userId:'',
    userName:'',
    userPosition:'',
    matchArray: ['depotManager', 'depot', 'driver', 'admin'],
    posArray: ['仓库管理员 : depotManager', '前台 : depot', '司机 : driver', '管理员 : admin'],
    posArray_cn: {'depotManager':'仓库管理员', 'depot':'前台', 'driver':'司机', 'admin':'管理员'},//翻译数组
    posArray_eg: { '仓库管理员': 'depotManager', '前台': 'depot', '司机': 'driver', '管理员': 'admin' },//翻译数组
  },
  
  onLoad: function (options) {
    upload_manager(this);
    // var tmp={ 'wxid': 'oBtgM5Ji7828jqbyQYM3KhMRJOeE', 'realName': 'hx', 'position': 'front' }
    // var tmp_arr=this.data.employeeInfo;
    // tmp_arr.push(tmp);
    // this.setData({
    //   employeeInfo: tmp_arr
    // })
  },
  requestFixInfo:function(e){
    
    // console.log(e)
    if(e.currentTarget.dataset.detail.position!='admin')
    this.setData({
      fixInfo:true,
      userId:e.currentTarget.dataset.detail.wxid,
      userName: e.currentTarget.dataset.detail.realName,
      userPosition: e.currentTarget.dataset.detail.position,
    })
  },
  positionChange: function (e) {
    //两个赋值不能放一起会引起异步操作带来的bug
    this.setData({
      posIndex: e.detail.value,
    })
    this.setData({
      userPosition: this.data.matchArray[e.detail.value]
    })
  },
  ok: function(){
    var that=this;
    //服务器操作
    wx.request({
      url: 'http://120.78.209.24/manager_change',
      data: {
        wxid:JSON.stringify(this.data.userId),
        realName:JSON.stringify(this.data.userName),
        position:JSON.stringify(this.data.userPosition)
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

        //刷新
        var infoArray = that.data.employeeInfo;
        for (var i = 0; i < infoArray.length; i++) {
          if (infoArray[i].wxid == that.data.userId) {
            infoArray[i].realName = that.data.userName;
            infoArray[i].position = that.data.userPosition;
            break;
          }
        }
        that.setData({
          employeeInfo: infoArray
        })
      },
      fail:function(res){
      }    
    });

    //关闭窗口
    this.setData({
      fixInfo:false
    })
  },
  back:function(){
    this.setData({
      fixInfo:false
    })
  }
})