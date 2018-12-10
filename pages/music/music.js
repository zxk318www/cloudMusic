// pages/music/music.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
    data: {
        tabs: ["首页", "推荐音乐", "我喜欢的"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        songlist:[],
        mylove:[],
        tuijian:[],

        inputShowed: false,
        searchsongs:[],
        inputVal: [],
        startX: 0, //开始坐标

        startY: 0,
        page:1

    },
    onLoad: function () {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
        this.getAllMusic()
    },
    tabClick: function (e) {
      
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
        this.getMylove()
    },
    getNewMusic(){
      console.log(1)
      var that = this
      wx.request({
        url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?uin=0&notice=0&platform=h5&needNewCode=1&tpl=3=&type=top&topid=27',
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          // success
          console.log(res)
          if(res)
            that.setData({
              songlist: res.data.songlist
            })
            wx.removeStorage({
              key: 'songs',
              success: function(res){
                // success
                console.log("清除本地缓存成功")
              },
              fail: function() {
                // fail
              },
              complete: function() {
               wx.setStorageSync('songs', res.data.songlist)
              }
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
    getTuijianMusic(){
      var that = this
      wx.request({
        url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?notice=0&platform=h5&tpl=3&page=detail&type=top&topid=36',
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          // success
          console.log(res)
          if(res)
          that.setData({
            tuijian:res.data.songlist
          })

          wx.removeStorage({
            key: 'tuijian',
            success: function(res){
              console.log("清除本地推荐歌曲")
            },
            fail: function() {
              // fail
            },
            complete: function() {
              wx.setStorageSync('tuijian', res.data.songlist)
            }
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
    getAllMusic(){
      this.getNewMusic()
      this.getTuijianMusic()
      this.getMylove()
    },

    getMylove(){
      var that = this
      wx.getStorage({
        key: 'mylove',
        success: function(res){
          // success
          that.setData({
            mylove:res.data
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
  showInput: function () {
    console.log("showInput")
      this.setData({
          inputShowed: true
      });
  },
  hideInput: function () {
     console.log("hideInput")
      this.setData({
          inputVal: "",
          inputShowed: false,
          searchsongs:[],
          page:1
      });
  },
  clearInput: function () {
    console.log("clearInput")
      this.setData({
          inputVal: "",
          searchsongs:[],
          page:1
      });
  },
  inputTyping: function (e) {
    console.log("input")
    
     this.findMusic(e.detail.value,this.data.page)
      this.setData({
          inputVal: e.detail.value
      });
  },
  
  longPress(e){
    var that = this
    let idx = e.currentTarget.dataset.index
    console.log(idx)
    wx.showModal({
      title:'提示',
      content:'你将删除该歌曲！',
      success:function(res){
        if(res.confirm){
          console.log("点击删除")
          that.delMusic(idx)
        }
      }
    })
  },
  delMusic(param){
    var songs=[]
    songs = wx.getStorageSync('mylove')
    songs.splice(param,1)
    wx.setStorageSync('mylove', songs)
    this.setData({
      mylove:songs
    })
  },

  findMusic(param,page){
    let songs =[]
    console.log(param)
    var that = this
    wx.request({
      url:  `https://api.bzqll.com/music/tencent/search?key=579621905&s=${param}&limit=20&offset=${page}&type=song`,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log(res.data)
        that.setData({
          searchsongs:res.data.data
        })
        songs = res.data.data
      },
      fail: function() {
        // fail
      },
      complete: function() {
       wx.setStorageSync('search', songs)
      }
    })
  },
  nextSearch(){
    var inputvalue = this.data.inputVal
    let nowpage = parseInt(this.data.page) +1
    this.findMusic(inputvalue,nowpage);
    this.setData({
      page:nowpage
    })
  },

  preSearch(){
    var inputvalue = this.data.inputVal
    if(this.data.page>=1){
      let nowpage = parseInt(this.data.page) -1
      this.findMusic(inputvalue,nowpage);
      this.setData({
        page:nowpage
      })
    }
   
  },
  goto(e){
    let searchSimple={}
    searchSimple ={
      lrc: e.currentTarget.dataset.lrc,
      name: e.currentTarget.dataset.name,
      pic: e.currentTarget.dataset.pic,
      singer: e.currentTarget.dataset.singer,
      url: e.currentTarget.dataset.url
    }
    wx.setStorageSync('searchSimple', searchSimple)
    wx.navigateTo({
      url: '../item/item?type=6',
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
  }
})
 
