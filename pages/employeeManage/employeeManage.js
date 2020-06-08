// pages/employeeManage/employeeManage.js
var app=getApp();
Page({
  data: {
    //所有用户信息库建议按照职业分步查询，这样插入好归类
    employeeInfo: [
      { 'wxid': 'oBtgM5Ji7828jqbyQYM3KhMRJOeE', 'realName': 'hx', 'position': 'admin',}, 
      { 'wxid': 'oBtgM5Ji7828jqbyQYM3KhMRJOeE', 'realName': 'hx', 'position': 'driver' }, 
      { 'wxid': 'oBtgM5Ji7828jqbyQYM3KhMRJOeE', 'realName': 'hx', 'position': 'front' }, 
      { 'wxid': 'oBtgM5Ji7828jqbyQYM3KhMRJOeE', 'realName': 'hx', 'position': 'depotManager' }],
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

  },
  requestFixInfo:function(e){
    console.log(e)
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
    var message={
      'wxid': this.data.userId,
      'realName': this.data.userName,
      'position': this.data.userPosition,
    }
    console.log(message);
    //服务器操作

    //修改当前页面或者刷新？
    
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