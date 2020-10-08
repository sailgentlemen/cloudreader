<template>
	<view class="page__wrap">
		<scroll-view scroll-y="true" style="height: 100vh;" @scroll="scrollHandle" :scroll-with-animation="true" :scroll-top="scrollTop">
			<view class="page">
				<view class="scroll__area">
					<view class="comment__item" v-for="item in list" :key="item.avatarUrl">
						<!-- <navigator url="/pages/commentDeatil/commentDeatil"> -->
							<view class="header">
								<view class="avatar">
									<image :src="item.avatarUrl"
									 mode="widthFix"></image>
								</view>
								<view class="nickname">
									{{item.nickName}}
								</view>
								<view class="remark">
									<view style="margin-right: 10rpx;">点评</view>
									<Rate :value="item.value" color="#828491" gap="5rpx" size="30rpx" />
								</view>
							</view>
							<view class="content line5">
								{{item.comment_msg}}
							</view>
						<!-- </navigator> -->
					</view>
				</view>
			</view>
		</scroll-view>
		<uni-transition :mode-class="['slide-right']" :styles="{'position':'absolute','bottom': '15vh','right': '6vw'}" :show="showToTop">
			<ToTop @goTopHandle="goTopHandle" />
		</uni-transition>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				showToTop: false
			}
		},
		computed: {
			list: function() {
				return this.$store.state.commentList
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
				if (event.detail.scrollTop > 666) {
					this.showToTop = true
				} else {
					this.showToTop = false
				}
			}
		},
		onLoad: function() {

		}
	}
</script>

<style scoped>
	.page__wrap {
		background: #ebefee;
	}

	.comment__item {
		margin-bottom: 20rpx;
		background: #fff;
		padding: 0 38rpx 45rpx;
	}

	.header {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		padding-top: 40rpx;
	}

	.avatar {
		width: 58rpx;
		height: 58rpx;
		margin-right: 20rpx;
	}

	.avatar image {
		border-radius: 100%;
	}

	.remark {
		display: flex;
		color: #8c9093;
		margin-left: 15rpx;
		align-items: center;
	}

	.content {
		line-height: 1.5;
		fonts-size: 42rpx;
		padding-left: 84rpx;
	}
</style>
