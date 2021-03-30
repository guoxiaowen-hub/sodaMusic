const api = require("../../utils/api");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    singer_id : "",
    singer_mid : "",
    singer_name : "",
    singer_image : "",
    songlist : []
  },
  //单曲点击
  musicTap: function(e){
    let {index} = e.currentTarget.dataset;

    app.globalData.songInfo.songName = this.data.songlist[index].musicData.songname;
    app.globalData.songInfo.songSinger = this.data.songlist[index].musicData.singer;
    app.globalData.songInfo.songAlbum = this.data.songlist[index].musicData.albumname;
    app.globalData.songInfo.songMid = this.data.songlist[index].musicData.songmid;

    wx.switchTab({
     url: "../2_play/2_play",
    })
  },
  //歌曲全部播放
  musicAllPlay: function(){
    let songArray = [];
    console.log("播放全部");
    app.globalData.songInfo.songName = this.data.songlist[0].musicData.songname;
    app.globalData.songInfo.songSinger = this.data.songlist[0].musicData.singer;
    app.globalData.songInfo.songAlbum = this.data.songlist[0].musicData.albumname;
    app.globalData.songInfo.songMid = this.data.songlist[0].musicData.songmid;
    console.log(this.data.songlist[0]);
    // app.globalData.songInfo.islike = this.data.songList[0].data.songmid;
    this.data.songlist.forEach((value,index)=>{
      songArray.push({
        song : this.data.songlist[index].musicData.songname,
        singer : this.data.songlist[index].musicData.singer,
        album : this.data.songlist[index].musicData.albumname,
        songmid : this.data.songlist[index].musicData.songmid,
        url : ""
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
    let singermid = options.singermid;
    api.getSingerSong(singermid).then((res)=>{
      let res1 = res.data.replace(" callback(","");
      let res2 = res1.substring(0,res1.length - 1);
      let res3 = JSON.parse(res2);
      console.log(res3.data.list)
      console.log(res3.data.list[0].musicData)
      let imageSrc = "https://y.gtimg.cn/music/photo_new/T001R300x300M000" +
      res3.data.singer_mid + ".jpg"
      this.setData({
        singer_id : res3.data.singer_id,
        singer_mid : res3.data.singer_mid,
        singer_name : res3.data.singer_name,
        singer_image : imageSrc,
        songlist : res3.data.list
      })
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

  }
})