// pages/1_home_rank/1_home_rank.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  play: function(e){
    let index = e.currentTarget.dataset.index;
    // app.globalData.songPic = this.data.songList[index].data.
    app.globalData.songInfo.songName = this.data.songList[index].data.songname;
    app.globalData.songInfo.songSinger = this.data.songList[index].data.singer;
    app.globalData.songInfo.songAlbum = this.data.songList[index].data.albumname;
    app.globalData.songInfo.songMid = this.data.songList[index].data.songmid;
    app.globalData.songInfo.islike = false;
    // console.log(this.data.songList[index].data.islike);

    wx.switchTab({
     url: "../2_play/2_play",
    })
  },
  //播放全部
  musicAllPlay : function(){
    let songArray = [];
    console.log("播放全部");
    app.globalData.songInfo.songName = this.data.songList[0].data.songname;
    app.globalData.songInfo.songSinger = this.data.songList[0].data.singer;
    app.globalData.songInfo.songAlbum = this.data.songList[0].data.albumname;
    app.globalData.songInfo.songMid = this.data.songList[0].data.songmid;
    app.globalData.songInfo.islike = false;
    this.data.songList.forEach((value,index)=>{
      songArray.push({
        song : this.data.songList[index].data.songname,
        singer : this.data.songList[index].data.singer,
        album : this.data.songList[index].data.albumname,
        songmid : this.data.songList[index].data.songmid,
        islike : false,
      });
    });
    app.globalData.songList = songArray;
    wx.switchTab({
      url: "../2_play/2_play",
     })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    // console.log("options");
    // console.log(options);
    _this.setData({
      topid:options.topid,
    })
    

    // 
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
    let _this = this;
    // console.log("pags");
    // console.log(_this.data.topid);

    wx.request({
      url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
      data:{
        topid : _this.data.topid
      },
      success: (result) => {
        let result_data = result.data;
        // console.log("result");
        // console.log(result_data);

        wx.setNavigationBarTitle({
          title: result_data.topinfo.ListName,
        });
        
        _this.setData({
          songList: result_data.songlist,
          image: result_data.topinfo.pic_v12,
        })
      },
      fail:(res) => {
        console.error(res);
      }
    })
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

  }
})