// pages/item/item.js

const myaudio = wx.createInnerAudioContext();

var myintervi1;
var songs =[];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poster: '', //封面图
    name: '',  //歌名
    lrc:'',
    lrcurl: '',
    //文稿数组，转化完成用来在wxml中使用
    storyContent:[],
    //文稿滚动距离
    marginTop:0,
    //当前正在第几行
    currentIndex222:0,

    author: '', //歌手
    src: '', //播放地址
    isplay: false, //是否播放
    maxlength: 0, //音乐长度
    musicTime: '00:00',
    sliderValue: 0,
    haslength: false, //是否包含长度
    value: 0,  //当前播放进度值
    animation: '' ,//图片旋转,
    index:'',
    type:'',
    islove:false,
    myIndex:'',
    myMusic:[]
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log("==============>item")
     // console.log(options.islove)
      songs = wx.getStorageSync('mylove')
      if(options.type==='3'){
        this.setData({
          myIndex:options.index,
          islove:options.islove
        })
       
        this.getMyLoveMusic()
      }else if(options.type==='6'){
        console.log(options.index)
        let songs = []
        songs = wx.getStorageSync('search')
        let song = {}
        song = songs[options.index]
        this.setData({
          lrcurl:song.lrc,
          name:song.name,
          poster:song.pic,
          author:song.singer,
          src:song.url
        })
      }
      else{
        console.log("getMusic")
        this.getMusic(options.songmid)
        this.setData({
          index: options.index,
          type:options.type,
          name: options.Musicname
        })

        
      }
     
     
     
  },
  onShow:function(){
    myaudio.onEnded((res) =>{
      clearInterval(myintervi1)
      //修改属性。去除css状态
      this.data.isplay = false;
      this.setData({
        isplay: this.data.isplay,
        value: 0,
        maxlength:0,
        marginTop:0,
        currentIndex222:0
      })
    })
    //在播放状态，绑定播放进度更新事件。然后控制进度条和时间显示
    myaudio.onPlay((res) =>{ 
      myaudio.onTimeUpdate(this.timeUpdate)

    })

    var currentName = this.data.name
    //console.log(currentName)
    var songs=[]
    songs = wx.getStorageSync('mylove')
    this.setData({
      myMusic: songs
    })
 
    console.log("mysongs:"+this.data.myMusic.length)
  
   
  },

  //播放
  play: function () {
            const that = this;
            myaudio.src = this.data.src
            that.getmusiclength();
            myaudio.play();
            myaudio.onEnded((res) =>{
              clearInterval(myintervi1)
              //修改属性。去除css状态
              this.data.isplay = false;
              this.setData({
                isplay: this.data.isplay,
                value: 0,
                maxlength:0,
                marginTop:0,
                currentIndex222:0
              })
            })
            
            
            this.setData({ 
              isplay: true,
              storyContent: that.sliceNull(that.parseLyric(that.data.lrc)) 
            });
            myintervi1 = setInterval(function () {
              var a = that.data.value;
              a++;
              that.setData({ value: a })


            if (that.data.currentIndex222 >= 4) {//超过4行开始滚动
              that.setData({
                marginTop: (that.data.currentIndex222 - 3) * 35
              })
            }
            // 文稿对应行颜色改变
            if ( that.data.storyContent && that.data.currentIndex222!=that.data.storyContent.length - 1){//
              var j = 0;
              for (var j = that.data.currentIndex222; j < that.data.storyContent.length; j++) {
                // 当前时间与前一行，后一行时间作比较， j:代表当前行数
                if (that.data.currentIndex222 == that.data.storyContent.length - 2) {
                //最后一行只能与前一行时间比较
                  if (parseFloat(myaudio.currentTime) > parseFloat(that.data.storyContent[that.data.storyContent.length - 1][0])) {
                    that.setData({
                      currentIndex222: that.data.storyContent.length - 1
                    
                    })
                    return;
                  }
                } else {
                  if (parseFloat(myaudio.currentTime) > parseFloat(that.data.storyContent[j][0]) && parseFloat(myaudio.currentTime) < parseFloat(that.data.storyContent[j + 1][0])) {
                    that.setData({
                      currentIndex222: j
                    })
                    return;
                  }
                }
              }
            }


          }, 1000);
        
 
  },


  // 停止
  stop: function () {
        myaudio.pause();
        this.setData({ 
          isplay: false
        });
        clearInterval(myintervi1)
  },

  //获取音乐的长度
  getmusiclength: function () {
      
        const that = this;
        if (myaudio.duration == 0) {
          setTimeout(function () {
            that.data.haslength = false;
            that.getmusiclength();
          }, 100);
        }
        else {
          var a = Math.ceil(myaudio.duration);
          that.setData({
            haslength: true,
            maxlength: a
          
          });
    
        }
  },
  //拖动 结束后重新开始播放
  change: function (e) {
          const that = this;
          // 清除定时器
          clearInterval(myintervi1);
          this.setData({ value: e.detail.value });
          myaudio.seek(e.detail.value);
          myaudio.play();
          //累加刷新页面
          myintervi1 = setInterval(function () {
            var a = that.data.value;
            a++;
            that.setData({ value: a })
            // console.log("currentIndex:"+that.data.currentIndex222)
            // console.log(myaudio.currentTime)
          
        if (that.data.currentIndex222 >= 6) {//超过6行开始滚动
              that.setData({
                marginTop: (that.data.currentIndex222+1)  * 20
              })
            }
            // 文稿对应行颜色改变
            if (that.data.storyContent && that.data.currentIndex222!=that.data.storyContent.length - 1){//
            
              var j = 0;
              for (var j = that.data.currentIndex222; j < that.data.storyContent.length; j++) {
                // 当前时间与前一行，后一行时间作比较， j:代表当前行数
              
                if (that.data.currentIndex222 == that.data.storyContent.length - 2) {
                //最后一行只能与前一行时间比较
                  if (parseFloat(myaudio.currentTime) > parseFloat(that.data.storyContent[that.data.storyContent.length - 1][0])) {
                    that.setData({
                      currentIndex222: that.data.storyContent.length - 1
                      
                    })
                    return;
                  }
                } else {
                  if (parseFloat(myaudio.currentTime) > parseFloat(that.data.storyContent[j][0]) && parseFloat(myaudio.currentTime) < parseFloat(that.data.storyContent[j + 1][0])) {
                    that.setData({
                      currentIndex222: j
                      
                    
                    })
                    return;
                  }
                  //播放时间比当前所在行时间小
                  if(parseFloat(myaudio.currentTime) < parseFloat(that.data.storyContent[j][0])){
                    for(var i = that.data.currentIndex222;i>0;i--){
                      if(parseFloat(myaudio.currentTime)>that.data.storyContent[i][0] && parseFloat(myaudio.currentTime) < parseFloat(that.data.storyContent[j + 1][0])){
                        that.setData({
                          currentIndex222: i
                        })
                        return;
                      }
                    }
                  }
                }
              }
            }
            
          }, 1000);
  },
  changing: function (e) {
       myaudio.pause();
  },

  getMusic(param){
        var that = this
        wx.request({
          url: `https://api.bzqll.com/music/tencent/song?key=579621905&id=${param}`,
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
            // success
            console.log(res)
            if(res)
            that.setData({
              name:res.data.data.name,
              poster: res.data.data.pic,
              author: res.data.data.singer,
              src: res.data.data.url,
              lrcurl:res.data.data.lrc
            })
            that.getLrc(res.data.data.lrc)

            var songs = []
            songs =wx.getStorageSync('mylove')
            for(var i = 0;i<songs.length;i++){
              if(res.data.data.name === songs[i].name){
                that.setData({
                  islove: true
                })
              }
            }
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
  },
  //去除空白
  sliceNull: function (lrc) {
        var result = []
        for (var i = 0; i < lrc.length; i++) {
          if (lrc[i][1] == "") {
          } else {
            result.push(lrc[i]);
          }
        }
        return result
  },

  getLrc(url){
        var that = this
        wx.request({
          url: `${url}`,
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
            // success
          // console.log(res)
            if(res)
            that.setData({
              lrc: res.data
            })
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
  },
  parseLyric: function (text) {
        var result = [];
        var lines = text.split('\n'); //切割每一行
        
        var pattern = /\[\d{2}:\d{2}.\d{2}\]/g; //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
      
        //去掉不含时间的行
        while (!pattern.test(lines[0])) {
          lines = lines.slice(1);
        };
        //上面用'\n'生成数组时，结果中最后一个为空元素，这里将去掉
        lines[lines.length - 1].length === 0 && lines.pop();
        lines.forEach(function (v /*数组元素值*/, i /*元素索引*/, a /*数组本身*/) {
          //提取出时间[xx:xx.xx]
          var time = v.match(pattern),
            //提取歌词
            value = v.replace(pattern, '');
          // 因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
          time.forEach(function (v1, i1, a1) {
            //去掉时间里的中括号得到xx:xx.xx
            var t = v1.slice(1, -1).split(':');
            //将结果压入最终数组
            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
          });
        });
        //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
        result.sort(function (a, b) {
          return a[0] - b[0];
        });
        return result;
  },
  //获取下一首歌
  nextMusic(e){
       
        var index = parseInt(e.currentTarget.dataset.index) +1;
        console.log(e.currentTarget.dataset.index)
        var type = this.data.type
        if(type === '1'){
          let songs = []
          songs = wx.getStorageSync('songs')
          let songid = songs[index].data.songmid
          this.getMusic(songid)
          this.setData({
                index:index,
                value: 0,
                marginTop:0,
                maxlength:0,
                currentIndex222:0,
                isplay:false
                
          })
        }
        if(type === '2'){
          let songs = []
          songs = wx.getStorageSync('songs')
          let songid = songs[index].data.songmid
          this.getMusic(songid)
          this.setData({
                index:index,
                value: 0,
                marginTop:0,
                maxlength:0,
                currentIndex222:0,
                isplay:false
                
          })
        }
   
  },
  //获取上一首歌
  preMusic(e){
        var index = parseInt(e.currentTarget.dataset.index) -1;
        console.log(index)
        if(index>=0){
          let songs = []
          let songid ={}
          songs = wx.getStorageSync('songs')
          songid = songs[index].data.songmid
         
          this.getMusic(songid)
          this.setData({
                index:index,
                value: 0,
                marginTop:0,
                maxlength:0,
                currentIndex222:0,
                isplay:false
                
          })
        }
        
  },
  //添加我喜欢音乐
  addMyLike(){
      // console.log(1)
        this.setData({
          islove:true
        })
        let songs =[]
        var that = this
      
        wx.getStorage({
          key: 'mylove',
          success: function(res){
            songs = res.data
          }, complete: function() {
            let song={
              src:that.data.src,
              poster: that.data.poster, //封面图
              name: that.data.name,  //歌名
              lrc:that.data.lrc,
              author: that.data.author//歌手
            }

            songs.push(song);
            wx.setStorageSync('mylove', songs)
            that.setData({
              myIndex:parseInt(that.data.myIndex)+1
            })
            console.log("添加缓存成功")
          }
        })

  },

  
  removeMyLike(){
        this.setData({
          islove:false
        })
        var that = this
        let songs=[]
        wx.getStorage({
          key: 'mylove',
          success: function(res){
            songs = res.data
            songs.splice(that.data.myIndex,1)
            wx.setStorage({
              key: 'mylove',
              data: songs,
              success: function(res){
                // success
              },
              fail: function() {
                // fail
              },
              complete: function() {
                // complete
              }
            })
          },
          complete: function() {
            
          }
        })
  },

  getMyLoveMusic(){
        var that = this
        var idx = this.data.myIndex
        let songs =[]
        console.log("my lovemusic is index-:"+idx)
        wx.getStorage({
          key: 'mylove',
          success: function(res){
            songs = res.data
            that.setData({
              name:songs[idx].name,
              poster: songs[idx].poster,
              author: songs[idx].author,
              src: songs[idx].src,
              lrc:songs[idx].lrc
            })
          }

        })
  }
})