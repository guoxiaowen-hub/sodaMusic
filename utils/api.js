const getSongUrl = (songmidid) => {
  return new Promise(function(resolve,reject){
    wx.request({
      url: `https://u.y.qq.com/cgi-bin/musicu.fcg?format=json&data=%7B%22req_0%22%3A%7B%22module%22%3A%22vkey.GetVkeyServer%22%2C%22method%22%3A%22CgiGetVkey%22%2C%22param%22%3A%7B%22guid%22%3A%22358840384%22%2C%22songmid%22%3A%5B%22${songmidid}%22%5D%2C%22songtype%22%3A%5B0%5D%2C%22uin%22%3A%221443481947%22%2C%22loginflag%22%3A1%2C%22platform%22%3A%2220%22%7D%7D%2C%22comm%22%3A%7B%22uin%22%3A%2218585073516%22%2C%22format%22%3A%22json%22%2C%22ct%22%3A24%2C%22cv%22%3A0%7D%7D`,
      data: {
        songmidid : songmidid
      },
      success: (res) => {
        resolve(res);
      },
      fail: (error) => {
        reject(error);
      },
    })
  })
}

const getSingerSong = (singermid) => {
  return new Promise(function(resolve,reject){
    wx.request({
      url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8¬ice=0&format=jsonp&hostUin=0&needNewCode=0&platform=yqq&order=listen&begin=0&num=40&songstatus=1&jsonpCallback=callback',
      data: {
        singermid : singermid
      },
      success: (res) => {
        resolve(res);
      },
      fail: (error) => {
        reject(error);
      },
    })
  })
}

module.exports = {
  getSongUrl: getSongUrl,
  getSingerSong: getSingerSong,
}