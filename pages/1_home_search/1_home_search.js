var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotkey : "",  //热搜
    searchInfo : "",  //输入框输入信息
    storage : [],  //存入存储
    getStorage : [],  //读取存储
    hideScroll : true,  //显示下拉框
    hideHistory : true//显示暂无历史记录
  },

  // 输入框输入
  input:function(e){
    let _this=this;

    _this.setData({
      searchInfo : e.detail.value,
    });

    wx.request({
      url: 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg',
      data: {
        key : _this.data.searchInfo
      },
      
      success: (result) => {
        let result1 = result.data;
        // console.log(result1);
        if(result1.code===0){
          _this.setData({
            scrData : result1.data,
            album : result1.data.album.itemlist,
            mv : result1.data.mv.itemlist,
            singer : result1.data.singer.itemlist,
            song : result1.data.song.itemlist,
            hideScroll : false
          });
          console.log(result1.data);
        }
        else{
          _this.setData({
            album : [],
            mv : [],
            singer : [],
            song : [],
            hideScroll : true
          })
        }
      },
      fail: (res) => {
        console.error(res);
      },
    });
  },

  // 点击搜索
  search:function(e){
    let count = 0;
    let _this = this;
    _this.setData({
      hideHistory : true
    })
    if(_this.data.searchInfo !== undefined && _this.data.searchInfo !== ""){
      _this.setData({
        storage : (wx.getStorageSync('searchStorage') || [])
      })
      _this.data.storage.forEach(function(value){
        if(_this.data.searchInfo === value.storage){
          count++;
        };
      })
      if (count==0) {
        _this.data.storage.unshift({storage : _this.data.searchInfo});
        wx.setStorageSync('searchStorage', _this.data.storage);
        _this.setData({
          getStorage : (wx.getStorageSync('searchStorage') || [])
        })
      }
    }
  },

  // 清除缓存
  hisClr: function(){
    wx.removeStorageSync("searchStorage");
    this.setData({
      getStorage : [],
      hideHistory : false
    })
  },

  // 单曲点击事件
  songTap: function(e){
    let {index} = e.currentTarget.dataset;
    app.globalData.songInfo.songName = this.data.song[index].name;
    app.globalData.songInfo.songSinger = [{name : this.data.song[index].singer}];
    app.globalData.songInfo.songAlbum = "未知";
    app.globalData.songInfo.songMid = this.data.song[index].mid;
    wx.switchTab({
     url: "../2_play/2_play",
    })
  },

  //歌手点击事件
  singerTap:function(e){
    let {index} = e.currentTarget.dataset;
    let mid = this.data.singer[index].mid
    wx.navigateTo({
      url: `../1_home_search_result/1_home_search_result?singermid=${mid}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    
    wx.request({
      url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
      success:(result) =>{
        let result_data = result.data;
        // console.log("result");
        // console.log(result_data);
        _this.setData({
          hotkey : result_data.data.hotkey,
        });
        // console.log(result_data.data.hotkey);
      }
    });

    _this.setData({
        getStorage : (wx.getStorageSync('searchStorage') || [])
    });

    if (_this.data.getStorage.length===0) {
      _this.setData({
        hideHistory: false
      })
    };
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