// pages/1_home/1_home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
  },
  handleRouter:function(e){
    // console.log(e.currentTarget.dataset.topid);
    let id = e.currentTarget.dataset.topid;
    let url1="../1_home_rank/1_home_rank?topid="+id;
    // console.log(url1);
    wx.navigateTo({
      url: url1,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
      url: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
      success: (result) => {
        // console.log(result.data);
        let result_data = result.data.replace("MusicJsonCallback(","");
        let jsonResult = result_data.substring(0,result_data.length - 1);
        let jsonObj = JSON.parse(jsonResult);
        _this.setData({
          topList: jsonObj.data.topList
        })
        // console.log(jsonObj.data);
        // console.log("1_home");
      },
      fail:(res) => {
        console.error(res);
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



})