<template>
	<view class="page__wrap">
		<Search :qs="qs" :route="route" />
		<scroll-view v-if="!showNoResul" scroll-y="true" style="height: 100vh;" @scroll="scrollHandle" :scroll-with-animation="true"
		 :scroll-top="scrollTop">
			<view class="page">
				<block v-if="!hideTags && !dataHave">
					<view class="hot__search">
						<view class="title">热门搜索</view>
						<view class="tags">
							<bolck v-for="item in hot__tags" :key="item.id">
								<view class="tags-item" @tap="qsHandle(item.name)">
									{{item.name}}
								</view>
							</bolck>
						</view>
					</view>
					<view class="history" v-if="userInfo">
						<view class="top">
							<view class="title">历史记录</view>
							<view class="clear" @tap="clearHandle" v-if="history__tags.length">清空</view>
						</view>
						<view class="tags" v-if="history__tags.length">
							<bolck v-for="item in history__tags" :key="item">
								<view class="tags-item" @tap="qsHandle(item)">
									{{item}}
								</view>
							</bolck>
						</view>
					</view>
				</block>
				<QueryList />
			</view>
		</scroll-view>
		<NoResult v-if="showNoResul" />
		<uni-transition :mode-class="['slide-right']" :styles="{'position':'absolute','bottom': '15vh','right': '6vw'}" :show="showToTop">
			<ToTop @goTopHandle="goTopHandle" />
		</uni-transition>
	</view>
</template>

<script>
	export default {
		computed: {
			dataHave() {
				return !!this.$store.state.qsList.length
			},
			hideTags() {
				return !!this.$store.state.typing
			},
			showNoResul() {
				return !this.$store.state.qsList.length && this.$store.state.typing
			},
			userInfo() {
				return this.$store.state.userInfo
			}
		},
		data() {
			return {
				showToTop: false,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				showToTop: false,
				route: '',
				qs: '',
				hot__tags: [
					{
						name: '言情',
						id: 1
					},
					{
						name: '穿越',
						id: 2
					},
					{
						name: '紫阳帝尊',
						id: 3
					}
				],
				history__tags: []
			}
		},
		methods: {
			async getHistory() {
				const res = await wx.cloud.callFunction({
					name: 'getHistories'
				})
				if(res.result.data.length && res.result.data[0].histories.length) {
					this.history__tags = res.result.data[0].histories
				}
			},
			goTopHandle() {
				// 回到顶部
				this.scrollTop = 0
				this.scrollTop = this.old.scrollTop
				this.$nextTick(() => {
					this.scrollTop = 0
				})
			},
			scrollHandle(event) {
				this.old.scrollTop = event.detail.scrollTop
				if (event.detail.scrollTop > 666) {
					this.showToTop = true
				} else {
					this.showToTop = false
				}
			},
			qsHandle(qs) {
				this.qs = qs
			},
			clearHandle() {
				if(!this.history__tags.length) return
				this.history__tags = []
				//  清空数据
				wx.cloud.callFunction({
					name: 'clearHistories'
				})
			}
		},
		onLoad: async function(opt) {
			if (opt.qs) {
				// 分类查询
				let {
					qs
				} = opt
				const words = decodeURIComponent(qs).split('/')
				this.qs = words
			}
			
			const pages = getCurrentPages()
			const ins = pages[pages.length - 1]
			const route = ins.route
			this.route = route
			this.$store.commit('qsList', [])
			this.$store.commit('typing', false)
			
			uni.showLoading({
				title: '加载中...'
			})
			await this.getHistory()
			uni.hideLoading()
		}
	}
</script>

<style scoped>
	.page {
		padding: 142rpx 38rpx 40rpx;
		background: #fff;
	}

	.title {
		font-size: 40rpx;
		color: #474747;
	}

	.top,
	.hot__search .title {
		margin: 30rpx 0 50rpx;
	}

	.hot__search .title {
		margin-top: 0;
		padding-top: 50rpx;
	}

	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.clear {
		font-size: 32rpx;
		color: var(--yyd-color-primary);
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
	}

	.tags .tags-item {
		padding: 10rpx 20rpx;
		border: 1px solid #f3f3f3;
		border-radius: 5rpx;
		margin-right: 30rpx;
		color: #5f5f5f;
		margin-bottom: 30rpx;
	}
</style>
