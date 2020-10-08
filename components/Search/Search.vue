<template>
	<view class="search__wrap" @tap="tapHandle">
		<view class="search__box">
			<label class="iconfont">&#xe698;
			</label>
			<input @focus="clearHandle" v-model="querystring" confirm-type="search" placeholder="图书/作者/书籍分类" :disabled="disabled"/>
		</view>
	</view>
</template>

<script>
	import _ from 'lodash'
	
	export default {
		props: ["route","qs"],
		data() {
			return {
				disabled: true,
				querystring: '',
			};
		},
		computed: {
			list: function() {
				return this.$store.state.qsList
			},
			userInfo: function() {
				return this.$store.state.userInfo
			}
		},
		created() {
			this.debouncedQsHttpService = _.debounce(this.qsHttpService,800)
		},
		methods: {
			clearHandle() {
				this.querystring = ''
			},
			tapHandle() {
				if(this.route==="pages/bookmall/bookmall") {
					uni.navigateTo({
						url: "/pages/search/search"
					})
				}else if(this.route==="pages/search/search") {
					this.disabled = false
				}
			},
			async qsHttpService(qs) {
				const words = qs
				uni.showLoading({
					title: "搜索中..."
				})
				await this.$store.dispatch('QUERYBOOKS', {words})
				uni.hideLoading()
				this.hideTags()
			},
			hideTags() {
				this.$store.commit('typing',true)
			}
		},
		watch: {
			qs: function (qs){
				this.querystring = qs
			},
			querystring: function (qs) {
				if(!Array.isArray(qs)){
					if(!qs.trim()) return
				}
				this.debouncedQsHttpService(qs)
			},
			list:async function(res) {
				if(!this.userInfo) return
				// 监听用户搜索
				if(res.length && this.querystring){
					await wx.cloud.callFunction({
						name: "addHistories",
						data: {
							histories: this.querystring
						}
					})
				}
			}
		}
	}
</script>

<style scoped>
	.search__box {
		background: #58B1FF;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 99999;
		padding: 20rpx 38rpx;
	}

	.search__box input {
		background: #fff;
		height: 90rpx;
		border-radius: 60rpx;
		padding: 0 50rpx 0 80rpx;
	}

	.search__box .iconfont {
		position: absolute;
		font-size: 45rpx;
		left: 8%;
		top: 50%;
		transform: translateY(-50%);
	}
</style>
