// pages/2_search/2_search.js

var app = getApp();
const backgroundAudioManager = wx.getBackgroundAudioManager();
const api = require("../../utils/api");
const dayjs = require("../../miniprogram_npm/dayjs/index");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlaying : false,
    playStatus : 0,
    likeArray : [],
    getArray : [],
    songArray : [],
    imageitem : "imageitem1",
    isList : true,

    // 进度条
    totalTime: dayjs(0).format("mm:ss"), //总时长
    max: 0, //滑块最大值
    value: 0, //进度条进程
    currentTime: dayjs(0).format("mm:ss"), //当前时长
    flag: false //是否在拖动滑块
  },
  // 点歌之后自动播放
  musicAutoPlay : function (music) {
    api.getSongUrl(music.songmid).then((res)=>{
      var musicUrl = res.data.req_0.data.sip[0] + res.data.req_0.data.midurlinfo[0].purl;
      if(res.data.req_0.data.midurlinfo[0].purl !== ""){
        let singer = '';
        let count = 0;
        // let islike = wx.getStorageSync('musicInfo.islike');
        backgroundAudioManager.title = music.song;
        backgroundAudioManager.epname = music.album;
        if (!this.data.music.singer) {
          return;
        }
        this.data.music.singer.forEach((value) => {
          count++;
        });
        for(let i = 0; i < count; i++){
          if(i === count-1){
            singer = singer + music.singer[i].name;
          }
          else{
            singer = singer + music.singer[i].name + " / ";
          }
        }
        backgroundAudioManager.singer = singer;
        // 设置了 src 之后会自动播放
        backgroundAudioManager.src = musicUrl;
        backgroundAudioManager.onPlay(() => {
          console.log("开始播放");

          this.setData({
            imageitem : "imageitem2",
            isPlaying: true,
            music:{
              songmid: this.data.music.songmid,
              song : this.data.music.song,
              singer : this.data.music.singer,
              album : this.data.music.album,
              islike : this.musicIsLike(this.data.music.songmid)
            }
          })
          // 存入缓存，没有歌曲播放时读取上次播放的数据
          wx.setStorageSync('musicInfo.songmid', this.data.music.songmid);
          wx.setStorageSync('musicInfo.song', this.data.music.song);
          wx.setStorageSync('musicInfo.singer', this.data.music.singer);
          wx.setStorageSync('musicInfo.album', this.data.music.album);
          wx.setStorageSync('musicInfo.islike', this.data.music.islike);
        });
        backgroundAudioManager.onEnded(()=>{
          if(this.data.playStatus === 3){
            this.musicAutoPlay(music);
            console.log("单曲循环");
          }
          else{
          console.log("播放结束,下一首歌");
          this.musicNextTap(music);
          }
        })
        this.musicAddArray(music);
      }
      else{
        console.log("该歌曲已下架");

        backgroundAudioManager.pause();
        this.setData({
          isPlaying : false,
          imageitem : "imageitem1",
          music : {
            song : music.song + "【该歌曲已下架】",
            songmid : music.songmid,
            islike : false,
            // status : true
          },
        });
      }

          // 进度条
    if(this.data.isPlaying === false){
      setInterval(() => {
        //判断滑块是否在推动
          if (this.data.flag === false) {  //滑块没有拖动
            let a = dayjs(backgroundAudioManager.duration * 1000).format("mm:ss") //总时长 用dayjs对总时长进行处理
            let b = parseInt(backgroundAudioManager.duration) //滑块最大值
            let c = dayjs(backgroundAudioManager.currentTime * 1000).format('mm:ss') //当前时长
            let d = parseInt(backgroundAudioManager.currentTime) //滑块值
            this.setData({
              totalTime: a, ///总时长 对数据进行处理后
              max: b, //滑块最大数
              currentTime: c,
              value: d,
            })
            // console.log('定时器', this.data.currentTime)
          }
        }, 1000);
    }
    })
  },

  // 切换点击播放/暂停
  musicPlayTap:function(){
    if(this.data.isPlaying === true){
      this.musicPause();
    }
    else if(this.data.isPlaying === false){
      this.musicPlay();
    }
  },

  // 歌曲暂停/播放
  musicPlay : function(){
    backgroundAudioManager.play();
    backgroundAudioManager.onPause(() => {
      console.log("音乐播放");
      this.setData({
        isPlaying: true,
        imageitem : "imageitem2"
      });
    })
  },
  musicPause : function(){
    backgroundAudioManager.pause();
    backgroundAudioManager.onPause(() => {
      console.log("音乐暂停");
      this.setData({
        isPlaying: false,
        imageitem : "imageitem1"
      });
    })
  },

  // 点歌之后加入到播放列表 
  musicAddArray : function(music){
    let count = 0;
    this.data.songArray.forEach((value)=>{
      if(music.songmid === value.songmid){count++};
    });
    if(count === 0){
      this.data.songArray.push(music);
      console.log("音乐存入播放列表");
      console.log(this.data.songArray);
    }
    else{
      console.log("该音乐已在播放列表");
    }
    this.setData({
      songArray : this.data.songArray,
    })
  },

  //播放上一首歌
  musicLastTap : function(){
  switch(this.data.playStatus){
    case 0 : 
    {
      // 顺序播放
      let songmid = this.data.music.songmid; //取得现在歌的mid
      let songIndex = -1;//用来获取现在歌曲的数组下标
      this.data.songArray.forEach((value,index)=>{
        if(songmid === value.songmid){
        songIndex=index;
        }
      })
      if(songIndex !== -1 && songIndex - 1 >=0 ){
        this.setData({
        music : this.data.songArray[songIndex - 1]
        })
        this.musicAutoPlay(this.data.music);
      }
      else{
      console.log("到头了");
      }
      break;
    }
    case 1:
    {
      //列表播放
      let songmid = this.data.music.songmid; //取得现在歌的mid
      let songIndex = -1;//用来获取现在歌曲的数组下标
      this.data.songArray.forEach((value,index)=>{
        if(songmid === value.songmid){
        songIndex=index;
        }
      })
      if(songIndex !== -1 && songIndex - 1 >=0 ){
        this.setData({
        music : this.data.songArray[songIndex - 1]
        })
        this.musicAutoPlay(this.data.music);
      }
      else{
        this.setData({
          music : this.data.songArray[this.data.songArray.length-1]
          })
          this.musicAutoPlay(this.data.music);
          console.log("跳到最后一首歌了");
          console.log(this.data.songArray);
      }
      break;
    }
    case 2:
    {
      //随机播放
      let random = this.getRandom(0,this.data.songArray.length - 1);
      this.setData({
        music : this.data.songArray[random]
      })
      this.musicAutoPlay(this.data.music);
      console.log("随机");
      break;
    }
    case 3:
    {
      //单曲播放
      let songmid = this.data.music.songmid; //取得现在歌的mid
      let songIndex = -1;//用来获取现在歌曲的数组下标
      this.data.songArray.forEach((value,index)=>{
        if(songmid === value.songmid){
        songIndex=index;
        }
      })
      if(songIndex !== -1 && songIndex - 1 >=0 ){
        this.setData({
        music : this.data.songArray[songIndex - 1]
        })
        this.musicAutoPlay(this.data.music);
      }
      else{
        this.setData({
          music : this.data.songArray[this.data.songArray.length-1]
          })
          this.musicAutoPlay(this.data.music);
          console.log("跳到最后一首歌了");
          console.log(this.data.songArray);
      }
      break;
    }
  }
},

  //播放下一首
  musicNextTap : function(){
    switch(this.data.playStatus) {
      case 0:
      {
        // 顺序播放
        let songmid = this.data.music.songmid; //取得现在歌的mid
        let songIndex = -1;//用来获取现在歌曲的数组下标
        this.data.songArray.forEach((value,index)=>{
        if(songmid === value.songmid){
          songIndex=index;
        }
        })
        if(songIndex !== -1 && songIndex + 1 < this.data.songArray.length){
        this.setData({
          music : this.data.songArray[songIndex + 1]
        })
        this.musicAutoPlay(this.data.music);
        }
        else if(songIndex + 1 >= this.data.songArray.length){
        console.log("播放列表已经没得歌了");
        }
        else{
        console.log("不鸡丢");
        };
        console.log("顺序");
        break;
      }
      case 1:
      {
        // 列表循环
        let songmid = this.data.music.songmid; //取得现在歌的mid
        let songIndex = -1;//用来获取现在歌曲的数组下标
        this.data.songArray.forEach((value,index)=>{
        if(songmid === value.songmid){
          songIndex=index;
        }
        })
        if(songIndex !== -1 && songIndex + 1 < this.data.songArray.length){
        this.setData({
          music : this.data.songArray[songIndex + 1]
        })
        console.log(this.data.songArray);
        this.musicAutoPlay(this.data.music);
        }
        else if(songIndex + 1 >= this.data.songArray.length){
          this.setData({
              music : this.data.songArray[0]
          })
          console.log("列表到头，重头播放");
          console.log(this.data.songArray);
        }
        else{
        console.log("不鸡丢");
        };
        console.log("列表");
        break;
      }
      case 2:
      {
        //随机播放
        let random = this.getRandom(0,this.data.songArray.length - 1);
        this.setData({
          music : this.data.songArray[random]
        })
        this.musicAutoPlay(this.data.music);
        console.log("随机");
        break;
      }
      case 3:
      {
        // 单曲循环
        let songmid = this.data.music.songmid; //取得现在歌的mid
        let songIndex = -1;//用来获取现在歌曲的数组下标
        this.data.songArray.forEach((value,index)=>{
        if(songmid === value.songmid){
          songIndex=index;
        }
        })
        if(songIndex !== -1 && songIndex + 1 < this.data.songArray.length){
        this.setData({
          music : this.data.songArray[songIndex + 1]
        })
        console.log(this.data.songArray);
        this.musicAutoPlay(this.data.music);
        }
        else if(songIndex + 1 >= this.data.songArray.length){
          this.setData({
              music : this.data.songArray[0]
          })
          console.log("列表到头，重头播放");
          console.log(this.data.songArray);
        }
        else{
        console.log("不鸡丢");
        };
        console.log("单曲循环");
        break;
      }
    }
  },

  //获取范围内随机数
  getRandom: function(start,end){
    let differ = end - start;
    let random = Math.random();
    return(start + differ*random).toFixed(0);
  },

  // 收藏音乐
  musicLike : function(music){
    let _this = this;
    
    _this.setData({
      likeArray : (wx.getStorageSync('likeArray') || [])
    })
     
    // 加入收藏
    if (this.musicIsLike(this.data.music.songmid) === false) {
      _this.data.likeArray.unshift({
        likeArray : {
          songmid : _this.data.music.songmid,
          song : _this.data.music.song,
          singer : _this.data.music.singer[0].name,
          album : _this.data.music.album,
          islike : _this.data.music.islike
        }
      });

      wx.setStorageSync('likeArray', _this.data.likeArray);
      wx.setStorageSync('musicInfo.islike', _this.data.music.islike)

      this.setData({
        music:{
          songmid: _this.data.music.songmid,
          song : _this.data.music.song,
          singer : _this.data.music.singer,
          album : _this.data.music.album,
          islike : true
        }
      });
    }

    // 移除收藏
    else if(this.musicIsLike(this.data.music.songmid) === true){
      this.musicDisLike(_this.data.music);
      this.setData({
        music:{
          songmid: _this.data.music.songmid,
          song : _this.data.music.song,
          singer : _this.data.music.singer,
          album : _this.data.music.album,
          islike : false
        }
      });    
    }
  },

  // 判断歌曲是否在收藏列表中
  musicIsLike: function(songmid){
    let storage = wx.getStorageSync('likeArray');
    let flag = false

    if (storage !== '' && storage !== []) {
      storage.forEach((value, index) =>{
        if(songmid === value.likeArray.songmid){
          flag = true;
        }
      })
    }
    return flag;
  },

  // 删除收藏
  musicDisLike: function(music){
    let storage = wx.getStorageSync('likeArray');
    console.log(storage);
    if (storage !== '' && storage !== []) {
      storage.forEach((value, index) =>{
        if(music.songmid === value.likeArray.songmid){
          console.log(storage);
          storage = wx.getStorageSync('likeArray');
          let arr = storage.splice(index, 1);
          console.log(storage);
          wx.setStorageSync('likeArray', storage);
        }
      });
    }
  },
  //播放模式切换
  moduleChange : function(){
    let count = this.data.playStatus;
    if(count < 3){
    this.setData({
      playStatus : ++count,
    })
    }
    else if(count === 3){
      this.setData({
        playStatus : 0,
      })
      }
  },

  changed1(e) { //滑动拖动完成后执行
    let a = e.detail.value
    this.setData({
      flag: false,
    })
    backgroundAudioManager.seek(a)
  },
  //拖动滑块中
  changing(e) { 
    let b = e.detail.value
    let a = dayjs(b * 1000).format("mm:ss")
    this.setData({
      currentTime: a,
      flag: true
    })
  },

  // 列表单击
  listTap : function(){
    console.log("1");
    if(this.data.isList === false){
      this.setData({
        isList : true,
      });
    }
    else if(this.data.isList === true){
      this.setData({
        isList : false,
      });
    }
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    
    

    // 单曲播放
    if(app.globalData.songInfo.songMid !== "" && app.globalData.songInfo.songMid !== undefined && app.globalData.songList.length === 0){
      console.log("单曲播放");
        _this.setData({
          music:{
            song : app.globalData.songInfo.songName,
            singer : app.globalData.songInfo.songSinger,
            album : app.globalData.songInfo.songAlbum,
            songmid : app.globalData.songInfo.songMid,
            islike : app.globalData.songInfo.islike
          },
        });
        console.log(_this.data.music);
        app.globalData.songInfo = {
          songMid : ""
        };
        _this.musicAutoPlay(_this.data.music);
    }
    // 列表播放
    else if(app.globalData.songInfo.songMid !== "" && app.globalData.songList.length > 0  && app.globalData.songInfo.songMid !== undefined){
      console.log("列表播放");
      _this.setData({
        music:{
          song : app.globalData.songInfo.songName,
          singer : app.globalData.songInfo.songSinger,
          album : app.globalData.songInfo.songAlbum,
          songmid : app.globalData.songInfo.songMid,
        },
        songArray : app.globalData.songList,
        isList : true,
      });
      app.globalData.songInfo = {
        songMid : ""
      };
      app.globalData.songList = [];
      _this.musicAutoPlay(_this.data.music);
    }

    // 内存中没有存储上次播放的歌曲时，显示没有歌曲
    else if(wx.getStorageSync('musicInfo.song') == '' || wx.getStorageSync('musicInfo.song') == '【该歌曲已下架】'){
      _this.setData({
        music:{
          song : "没有播放过歌曲",
          islike : false,
        },
        
      });
    }
    // 读取上次播放的歌曲
    else if(this.data.music === undefined){
      let songmid = wx.getStorageSync('musicInfo.songmid');
      wx.setStorageSync('musicInfo.islike', false);
      
      if (this.musicIsLike(songmid)) {
        wx.setStorageSync('musicInfo.islike', true);
      }

      _this.setData({
        music:{
          songmid: wx.getStorageSync('musicInfo.songmid'),
          song : wx.getStorageSync('musicInfo.song'),
          singer : wx.getStorageSync('musicInfo.singer'),
          album : wx.getStorageSync('musicInfo.album'),
          islike : wx.getStorageSync('musicInfo.islike')
        },
        totalTime: dayjs(0).format("mm:ss"), ///总时长 对数据进行处理后
        currentTime: dayjs(0).format("mm:ss"),
      });
      console.log("读取上次播放的歌曲");
      this.musicAutoPlay(this.data.music);
    }


    this.setData({
      isList : true,
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