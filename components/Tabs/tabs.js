// components/tabs/tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    singerlist: {
      type: Array,
      value: []
    },
    title: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    singerTap : function(e) {
      let {index} = e.currentTarget.dataset;
      console.log(index);
      let mid = this.data.singerlist[index].Fsinger_mid;
      wx.navigateTo({
        url: `../1_home_search_result/1_home_search_result?singermid=${mid}`,
      })
    }
  }
})
