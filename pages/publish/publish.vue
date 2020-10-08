<template>
	<view class="page__wrap">
		<scroll-view v-if="!showNoResul" scroll-y="true" style="height: 100vh;" @scroll="scrollHandle" :scroll-with-animation="true" :scroll-top="scrollTop">
			<view class="page">
				<QueryList />
			</view>
		</scroll-view>
		<NoResult v-if="showNoResul"/>
		<uni-transition :mode-class="['slide-right']" :styles="{'position':'absolute','bottom': '15vh','right': '6vw'}" :show="showToTop">
			<ToTop @goTopHandle="goTopHandle"/>
		</uni-transition>
	</view>
</template>

<script>
	export default {
		computed: {
			showNoResul () {
				return !this.$store.state.qsList.length && this.$store.state.typing
			}
		},
		data() {
			return {
				showToTop: false,
				scrollTop: 0,
				old: {
					scrollTop: 0
				}
			}
		},
		methods: {
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
				if(event.detail.scrollTop > 666) {
					this.showToTop = true
				} else {
					this.showToTop = false
				}
			}
		},
		 onLoad: async function() {
			uni.showLoading({
				title: '加载中'
			})
			this.$store.commit('typing',false)
			this.$store.commit('qsList', [])
			await this.$store.dispatch("qsList")
			uni.hideLoading()
		}
	}
</script>

<style>
	.page {
		padding: 0 38rpx 40rpx;
	}
</style>
