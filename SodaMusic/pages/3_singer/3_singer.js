// pages/3_singer/3_singer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countArray: []
  },

  hotSinger :function(){
    // console.log(this.data.singerList);
    let hotArray = [];
    let picUrl = [];
    let pic = "picUrl"
    for(let i = 0; i< 10; i++){
      hotArray[i] = this.data.singerList[i];
      picUrl[i] = "https://y.gtimg.cn/music/photo_new/T001R300x300M000" + this.data.singerList[i].Fsinger_mid + ".jpg";
      hotArray[i][pic] = picUrl[i];
    }
    this.setData({
      hotList : hotArray
    })
  },

  //歌手点击
  singerTap : function(e) {
    let {index} = e.currentTarget.dataset;
    console.log(index);
    let mid = this.data.singerList[index].Fsinger_mid;
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
      url: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&hostUin=0&needNewCode=0&platform=yqq&jsonpCallback=callback',
      success:(result) =>{
        let result_data = result.data.replace("callback(","");
        let jsonResult = result_data.substring(0, result_data.length - 1);
        let jsonObj = JSON.parse(jsonResult);
        // console.log(jsonObj);




        // 把歌手列表存到data
        _this.setData({
          singerList : jsonObj.data.list,
        });
        let allArray = [];
        let picUrl = [];
        let pic = "picUrl"
        for(let i = 0; i< jsonObj.data.list.length; i++){
          allArray[i] = this.data.singerList[i];
          picUrl[i] = "https://y.gtimg.cn/music/photo_new/T001R300x300M000" + this.data.singerList[i].Fsinger_mid + ".jpg";
          allArray[i][pic] = picUrl[i];
        }
        _this.setData({
          singerList : allArray,
        });
        // console.log(allArray);
        // 热门歌手
        _this.hotSinger();

        // 全部歌手
        let Array = [];
        // //字母数组获取
        for (let i=0; i<26; i++){
          Array.push({title : String.fromCharCode((65+i))});
        }
        Array.push({title : "9"});
        Array.forEach((Array_value,index)=>{
          let count = 0;
          _this.data.singerList.forEach((value) => {
            if(Array_value.title === value.Findex){
              count++;
            }
          });
          if(count === 0){
            Array.splice(index,1);
          }
        })
        _this.setData({
          countArray : Array
        })
        // console.log(_this.data.countArray);
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

  }
})