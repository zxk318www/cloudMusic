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
        inputVal: ""

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
              songlist: res.data.songlist,
              topinfo: res.data.topinfo
             
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
                wx.setStorage({
                  key: 'songs',
                  data: res.data.songlist,
                  success: function(res){
                    // success
                    console.log("添加缓存成功")
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
              wx.setStorage({
                key: 'tuijian',
                data: res.data.songlist,
                success: function(res){
                  // success
                  console.log("添加缓存成功")
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
      this.setData({
          inputShowed: true
      });
  },
  hideInput: function () {
      this.setData({
          inputVal: "",
          inputShowed: false
      });
  },
  clearInput: function () {
      this.setData({
          inputVal: ""
      });
  },
  inputTyping: function (e) {
      this.setData({
          inputVal: e.detail.value
      });
  }
});
