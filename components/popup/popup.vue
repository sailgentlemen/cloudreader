<template>
	<view class="popup__wrap">
		<view class="mask" @tap="maskTap"></view>
		<view class="panel" @transitionend="transitionendHandle" :class="{'animation-translate-out': translateOut, 'animation-translate-in': translateIn}">
			<view class="header">
				<view class="partial">
					<view class="title">
						<slot name="title"></slot>
					</view>
					<view class="author">
						<slot name="author"></slot>
					</view>
				</view>
				<view class="partial">
					<view class="update__time">
						<slot name="chapters"></slot>
					</view>
					<view class="sort" @tap="reverseHandle"><text v-if="!sortChange" class="iconfont">&#xe610;
						</text><text v-if="sortChange" class="iconfont">&#xe61d;</text><text>{{mgs}}</text></view>
				</view>
			</view>
			<scroll-view lower-threshold="150" style="height: 68vh;" :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper"
			 @scrolltolower="lower" @scroll="scroll" scroll-with-animation="true">
				<slot name="list"></slot>
			</scroll-view>
		</view>
	</view>
</template>
<script>
	export default {
		props: ["popupclosed","popScrollTop"],
		computed: {
			mgs() {
				return this.sortChange ? "正序" : "倒序"
			},
			scrollTop () {
				return this.scrollTOP || this.popScrollTop
			}
		},
		data() {
			return {
				scrollTOP: 0,
				showToTop: false,
				old: {
					scrollTop: 0
				},
				translateOut: true,
				translateIn: false,
				sortChange: false
			};
		},
		methods: {
			upper() {
				console.log('到顶')
			},
			lower() {
				// this.$emit('skip')
			},
			scroll(event) {
				this.old.scrollTop = event.detail.scrollTop
			},
			transitionendHandle() {
				if (this.popupclosed || this.maskClick) {
					this.$emit('popupanimationend', this.translateIn)
				}
			},
			maskTap() {
				this.translateIn = false
				this.maskClick = true
			},
			reverseHandle() {
				// 倒序正序
				this.sortChange = !this.sortChange
				this.$emit('sortHandle')
				this.scrollTOP = this.old.scrollTop
				this.$nextTick(() => {
					this.scrollTOP = 0
				})
			}
		},
		beforeDestroy() {
			this.$emit('destroyPop',this.old.scrollTop)
		},
		mounted() {
			this.translateIn = true
		},
		watch: {
			popupclosed(changed) {
				this.translateIn = !changed
			}
		}
	}
</script>

<style scoped>
	.animation-translate-out {
		transform: translateY(120%)
	}

	.animation-translate-in {
		transform: translateY(0)
	}

	.header {
		height: 160rpx;
		display: flex;
		justify-content: space-between;
		font-size: 30rpx;
		line-height: 1;
		/* align-items: center; */
		color: var(--yyd-popup-color-header);
		padding: 40rpx 0;
		box-sizing: border-box;
	}

	.header .partial {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-content: space-between;
		align-items: flex-end;
	}

	.header .partial:first-child {
		align-items: flex-start;
	}

	.header .title {
		color: var(--yyd-popup-color-title);
		font-size: 32rpx;
		line-height: 1.5;
	}

	.header .update__time {
		display: flex;
	}
	
	.header .sort .iconfont {
		font-size: 30rpx;
		margin-right: 4rpx;
	}
	
	.header .sort {
		color: #FC6337;
	}

	.popup__wrap {
		position: absolute;
		top: 0;
		left: 0;
		transform: translateY(-100.5%);
		width: 100vw;
	}

	.panel {
		background: var(--yyd-bgcolor-configbar);
		padding: 0 35px;
		color: var(--yyd-popup-list-color);
		position: absolute;
		width: 100%;
		bottom: 0;
		transition: .3s;
		z-index: 888;
		font-size: 30rpx;
		line-height: 2;
	}

	.mask {
		position: fixed;
		width: 100vw;
		height: 100vh;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: var(--yyd-mask-bgcolor);
		z-index: 666;
		transform: translateY(-100%);
	}
</style>
