<script>
import Vue from "vue";
export default {
  onLaunch: async function () {
    if (!wx.cloud) {
      console.error("请使用2.2.3或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        evn: "",
      });
    }
    console.log("App Launch");
    uni.getSystemInfo({
      success: function (e) {
        // #ifndef MP
        Vue.prototype.StatusBar = e.statusBarHeight;
        if (e.platform == "android") {
          Vue.prototype.CustomBar = e.statusBarHeight + 50;
        } else {
          Vue.prototype.CustomBar = e.statusBarHeight + 45;
        }
        // #endif
        // #ifdef MP-WEIXIN
        Vue.prototype.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        Vue.prototype.Custom = custom;
        Vue.prototype.CustomBar =
          custom.bottom + custom.top - e.statusBarHeight;
        // #endif
        // #ifdef MP-ALIPAY
        Vue.prototype.StatusBar = e.statusBarHeight;
        Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
        // #endif
      },
    });

    uni.showLoading({
      title: "加载中",
    });
    await this.getUserInfo();
    await this.getBookList();
    await this.getNewBookList();
    await this.getLikeBookList();
    uni.hideLoading();
    // 预加载小说分类
    this.getbooksCategories();
  },
  onShow: async function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
  methods: {
    async getbooksCategories() {
      await this.$store.dispatch("SETCATEGORIES");
    },
    async getNewBookList() {
      // uni.showLoading()
      // 读取数据库中的书籍
      await this.$store.dispatch("SETNEWBOOKS");
      // uni.hideLoading()
    },
    async getLikeBookList() {
      // uni.showLoading()
      // 读取数据库中的书籍
      await this.$store.dispatch("SETLIKEBOOKS", {
        limit: 8,
      });
      // uni.hideLoading()
    },
    async getBookList() {
      // uni.showLoading()
      // 读取数据库中的书籍
      await this.$store.dispatch("SETBOOKS", {
        skip: 0,
        limit: 8,
      });
      // uni.hideLoading()
    },
    async getUserInfo() {
      await this.$store.dispatch("userInfo");
    },
  },
};
</script>

<style>
/*每个页面公共css */
@import "static/iconfont.css";
@import "static/main.css";
</style>
